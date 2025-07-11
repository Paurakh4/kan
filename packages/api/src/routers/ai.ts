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
  validateAndCleanAIResponse,
  type AIResponse
} from "../config/ai";

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
    description: `Work on implementing the ${feature} feature for the project`,
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
        const aiResponse = await generateWithRetry();

        // Log the validated response
        const totalCards = aiResponse.lists.reduce((sum, list) => sum + list.cards.length, 0);
        console.log(`[AI] Generated ${aiResponse.lists.length} lists with ${totalCards} total cards`);

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
            description: card.description || "",
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
});
