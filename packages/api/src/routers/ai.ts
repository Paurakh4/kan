import { TRPCError } from "@trpc/server";
import { z } from "zod";
import OpenAI from "openai";

import * as boardRepo from "@kan/db/repository/board.repo";
import * as cardRepo from "@kan/db/repository/card.repo";
import * as labelRepo from "@kan/db/repository/label.repo";
import * as listRepo from "@kan/db/repository/list.repo";
import * as workspaceRepo from "@kan/db/repository/workspace.repo";
import { colours } from "@kan/shared/constants";
import { generateUID } from "@kan/shared/utils";
import {
  getAIConfig,
  interpolatePrompt,
  interpolateTaskPrompt,
  validateAndCleanAIResponse,
  type AIResponse
} from "../config/ai";
import { safeMarkdownToHTML } from "../utils/markdown-to-html";

// Temporary inline generateSlug function until import issue is resolved
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
};

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { assertUserInWorkspace } from "../utils/auth";

// Simple in-memory cache for AI responses (5 minute TTL)
const responseCache = new Map<string, { response: AIResponse; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(projectIdea: string, features: string[]): string {
  return `${projectIdea.toLowerCase().trim()}-${features.sort().join(',')}`;
}

function getCachedResponse(projectIdea: string, features: string[]): AIResponse | null {
  const key = getCacheKey(projectIdea, features);
  const cached = responseCache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[AI] Cache hit for project: ${projectIdea}`);
    return cached.response;
  }

  // Clean up expired entries
  if (cached) {
    responseCache.delete(key);
  }

  return null;
}

function setCachedResponse(projectIdea: string, features: string[], response: AIResponse): void {
  const key = getCacheKey(projectIdea, features);
  responseCache.set(key, {
    response,
    timestamp: Date.now()
  });
  console.log(`[AI] Cached response for project: ${projectIdea}`);
}

// Input validation schema
const generatePlanInputSchema = z.object({
  boardName: z.string().min(1).max(255),
  projectIdea: z.string().min(10).max(2000),
  features: z.array(z.string().min(1).max(500)).min(1).max(20),
  workspacePublicId: z.string().min(12),
});

// Initialize OpenAI client using centralized configuration
const getOpenAIClient = () => {
  const config = getAIConfig();

  if (!config.apiKey) {
    throw new TRPCError({
      message: "OpenRouter API key not configured",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  return new OpenAI({
    baseURL: config.baseUrl,
    apiKey: config.apiKey,
  });
};

// Generate AI prompt using centralized configuration
const generatePrompt = (projectIdea: string, features: string[]): string => {
  const config = getAIConfig();

  return interpolatePrompt(config.kanbanPromptTemplate, {
    projectIdea,
    features: features.join(", ")
  });
};

// Clean generated prompt to remove system instructions and meta-content
const cleanGeneratedPrompt = (prompt: string): string => {
  if (!prompt) return "";

  let cleaned = prompt;

  // Remove common meta-instruction patterns
  const metaPatterns = [
    /^.*You are an expert.*$/gm,
    /^.*Your goal is to create.*$/gm,
    /^.*Based on all the context provided.*$/gm,
    /^.*Respond ONLY with.*$/gm,
    /^.*without any additional commentary.*$/gm,
    /^\*\*Overall Project Context:\*\*.*$/gm,
    /^\*\*Board Context:\*\*.*$/gm,
    /^\*\*Specific Task Details:\*\*.*$/gm,
    /^\*\*Your Instructions:\*\*.*$/gm,
    /^\*\*Output Requirements:\*\*.*$/gm,
    /^The prompt should:.*$/gm,
    /^\d+\.\s+.*(?:should|must|include|specify|provide|mention).*$/gm,
  ];

  metaPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });

  // Remove template variables that weren't replaced
  cleaned = cleaned.replace(/\{\{[^}]+\}\}/g, '');

  // Clean up extra whitespace and empty lines
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

  return cleaned;
};

// Fallback response generator using centralized configuration
const generateFallbackResponse = (projectIdea: string, features: string[]): AIResponse => {
  const config = getAIConfig();

  if (!config.enableFallback) {
    throw new TRPCError({
      message: "AI generation failed and fallback is disabled",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  const fallbackCards = features.slice(0, 6).map((feature, index) => ({
    title: `Implement ${feature}`,
    description: `<p><strong>Implement ${feature} functionality</strong> for the project. This task involves developing the core features and ensuring proper integration with the existing system.</p>`,
    labels: index % 2 === 0
      ? [config.fallbackLabels[0] || "frontend", "feature"]
      : [config.fallbackLabels[1] || "backend", "feature"],
  }));

  return {
    lists: [
      {
        title: "Backlog",
        cards: fallbackCards.slice(0, 4),
      },
      {
        title: "To Do",
        cards: fallbackCards.slice(4, 6),
      },
      {
        title: "In Progress",
        cards: [],
      },
      {
        title: "Done",
        cards: [],
      },
    ],
  };
};

export const aiRouter = createTRPCRouter({
  generatePlan: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/ai/generate-plan",
        summary: "Generate AI-powered Kanban plan",
        description: "Creates a new board with AI-generated lists and cards based on project idea and features",
        tags: ["AI"],
        protect: true,
      },
    })
    .input(generatePlanInputSchema)
    .output(z.object({
      boardId: z.number(),
      boardPublicId: z.string(),
      boardSlug: z.string(),
      boardName: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          message: "User not authenticated",
          code: "UNAUTHORIZED",
        });
      }

      // Validate workspace access
      const workspace = await workspaceRepo.getByPublicId(
        ctx.db,
        input.workspacePublicId,
      );

      if (!workspace) {
        throw new TRPCError({
          message: `Workspace with public ID ${input.workspacePublicId} not found`,
          code: "NOT_FOUND",
        });
      }

      await assertUserInWorkspace(ctx.db, userId, workspace.id);

      // Retry logic for AI generation using centralized configuration
      const generateWithRetry = async (): Promise<AIResponse> => {
        const config = getAIConfig();
        const openai = getOpenAIClient();
        const prompt = generatePrompt(input.projectIdea, input.features);

        for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
          try {
            console.log(`[AI] Generation attempt ${attempt}/${config.maxRetries}`);

            const completion = await openai.chat.completions.create({
              model: config.modelId,
              messages: [
                {
                  role: "system",
                  content: config.systemPrompt,
                },
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: config.temperature,
              max_tokens: config.maxTokens,
              top_p: config.topP,
              frequency_penalty: config.frequencyPenalty,
              presence_penalty: config.presencePenalty,
            });

            const aiResponseText = completion.choices[0]?.message?.content;
            if (!aiResponseText) {
              throw new Error("Empty AI response");
            }

            // Use enhanced validation and cleaning
            const validatedResponse = validateAndCleanAIResponse(aiResponseText);
            console.log(`[AI] Attempt ${attempt} - Validation successful`);

            return validatedResponse;

          } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);

            if (attempt === config.maxRetries) {
              console.log(`[AI] Generation failed after ${config.maxRetries} attempts, using fallback response`);
              return generateFallbackResponse(input.projectIdea, input.features);
            }

            // Wait before retry using configured delay
            await new Promise(resolve => setTimeout(resolve, config.retryDelay * attempt));
          }
        }

        // This should never be reached, but TypeScript requires it
        throw new Error("Unexpected end of retry loop");
      };

      try {
        let aiResponse: AIResponse;

        // Check cache first
        const cachedResponse = getCachedResponse(input.projectIdea, input.features);
        if (cachedResponse) {
          console.log(`[AI] Using cached response - skipping AI generation`);
          aiResponse = cachedResponse;
        } else {
          // Generate new response
          aiResponse = await generateWithRetry();

          // Cache the successful response
          setCachedResponse(input.projectIdea, input.features, aiResponse);
        }

        // Log the response (cached or generated)
        const totalCards = aiResponse.lists.reduce((sum, list) => sum + list.cards.length, 0);
        console.log(`[AI] Using ${aiResponse.lists.length} lists with ${totalCards} total cards`);

        // Generate unique slug
        let slug = generateSlug(input.boardName);
        const isSlugUnique = await boardRepo.isSlugUnique(ctx.db, {
          slug,
          workspaceId: workspace.id,
        });
        if (!isSlugUnique) slug = `${slug}-${generateUID()}`;

        // Create board
        const board = await boardRepo.create(ctx.db, {
          publicId: generateUID(),
          slug,
          name: input.boardName,
          createdBy: userId,
          workspaceId: workspace.id,
          projectIdea: input.projectIdea, // Store project idea for AI prompt generation
        });

        if (!board) {
          throw new TRPCError({
            message: "Failed to create board",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        // Create lists
        const listInputs = aiResponse.lists.map((list, index) => ({
          publicId: generateUID(),
          name: list.title,
          boardId: board.id,
          createdBy: userId,
          index,
        }));

        const createdLists = await listRepo.bulkCreate(ctx.db, listInputs);

        // Collect all unique labels from AI response
        const allLabels = new Set<string>();
        aiResponse.lists.forEach(list => {
          list.cards.forEach(card => {
            card.labels?.forEach(label => allLabels.add(label));
          });
        });

        // Create labels
        const labelInputs = Array.from(allLabels).map((labelName, index) => ({
          publicId: generateUID(),
          name: labelName,
          boardId: board.id,
          createdBy: userId,
          colourCode: colours[index % colours.length]?.code || "#6B7280",
        }));

        const createdLabels = labelInputs.length > 0
          ? await labelRepo.bulkCreate(ctx.db, labelInputs)
          : [];

        // Create a map of label names to IDs for efficient lookup
        const labelNameToId = new Map<string, number>();
        labelInputs.forEach((labelInput, index) => {
          const createdLabel = createdLabels[index];
          if (createdLabel) {
            labelNameToId.set(labelInput.name, createdLabel.id);
          }
        });

        // Create cards for each list
        for (const [listIndex, aiList] of aiResponse.lists.entries()) {
          const targetList = createdLists[listIndex];
          if (!targetList || aiList.cards.length === 0) continue;

          const cardInputs = aiList.cards.map((card, cardIndex) => ({
            publicId: generateUID(),
            title: card.title,
            description: safeMarkdownToHTML(card.description || ""),
            listId: targetList.id,
            createdBy: userId,
            index: cardIndex,
          }));

          const createdCards = await cardRepo.bulkCreate(ctx.db, cardInputs);

          // Create card-label relationships
          for (const [cardIndex, aiCard] of aiList.cards.entries()) {
            const targetCard = createdCards[cardIndex];
            if (!targetCard || !aiCard.labels?.length) continue;

            const cardLabelRelationships = aiCard.labels
              .map(labelName => {
                const labelId = labelNameToId.get(labelName);
                return labelId ? { cardId: targetCard.id, labelId } : null;
              })
              .filter(Boolean) as { cardId: number; labelId: number }[];

            if (cardLabelRelationships.length > 0) {
              await cardRepo.bulkCreateCardLabelRelationships(ctx.db, cardLabelRelationships);
            }
          }
        }

        return {
          boardId: board.id,
          boardPublicId: board.publicId,
          boardSlug: slug,
          boardName: board.name,
        };

      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("AI plan generation error:", error);
        throw new TRPCError({
          message: "Failed to generate AI plan",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  generateTaskPrompt: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/ai/generate-task-prompt",
        summary: "Generate AI-assisted task prompt",
        description: "Creates a detailed, context-aware prompt for completing a specific Kanban card task",
        tags: ["AI"],
        protect: true,
      },
    })
    .input(z.object({
      cardPublicId: z.string().min(12),
    }))
    .output(z.object({
      prompt: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          message: "User not authenticated",
          code: "UNAUTHORIZED",
        });
      }

      try {
        // Get card details with board context
        const card = await cardRepo.getWithListAndMembersByPublicId(ctx.db, input.cardPublicId);

        if (!card) {
          throw new TRPCError({
            message: "Card not found",
            code: "NOT_FOUND",
          });
        }

        // Get board details including project idea
        const board = await boardRepo.getWithProjectIdeaByPublicId(ctx.db, card.list.board.publicId);

        if (!board) {
          throw new TRPCError({
            message: "Board not found",
            code: "NOT_FOUND",
          });
        }

        // Validate user has access to the workspace
        await assertUserInWorkspace(ctx.db, userId, board.workspaceId);

        // Prepare context variables for prompt generation
        const promptVariables = {
          projectIdea: board.projectIdea || "No project idea available",
          boardName: board.name,
          cardTitle: card.title,
          cardDescription: card.description || "No description provided",
        };

        // Get AI configuration
        const config = getAIConfig();
        const openai = getOpenAIClient();

        // Generate the meta-prompt using the template
        const metaPrompt = interpolateTaskPrompt(config.taskPromptTemplate, promptVariables);

        console.log(`[AI] Generating task prompt for card: ${card.title}`);

        // Call AI to generate the task prompt
        const response = await openai.chat.completions.create({
          model: config.modelId,
          messages: [
            {
              role: "user",
              content: metaPrompt,
            },
          ],
          temperature: config.taskPromptTemperature,
          max_tokens: config.taskPromptMaxTokens,
          top_p: config.topP,
          frequency_penalty: config.frequencyPenalty,
          presence_penalty: config.presencePenalty,
        });

        const rawPrompt = response.choices[0]?.message?.content?.trim();

        if (!rawPrompt) {
          throw new TRPCError({
            message: "Failed to generate task prompt",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        // Clean the generated prompt to remove any meta-instructions or system content
        const cleanedPrompt = cleanGeneratedPrompt(rawPrompt);

        console.log(`[AI] Successfully generated task prompt (${cleanedPrompt.length} characters)`);

        return {
          prompt: cleanedPrompt,
        };

      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Task prompt generation error:", error);
        throw new TRPCError({
          message: "Failed to generate task prompt",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
