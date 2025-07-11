import { z } from "zod";

// Load environment variables if not already loaded (for standalone usage)
// In Next.js context, environment variables are already loaded by the framework
if (typeof process !== 'undefined' && !process.env.NEXT_RUNTIME && !process.env.OPENROUTER_API_KEY) {
  try {
    const path = require('path');
    // Look for .env files in the workspace root (where the Next.js app expects them)
    const rootDir = process.cwd();
    require('dotenv').config({ path: path.join(rootDir, '.env.local') });
    require('dotenv').config({ path: path.join(rootDir, '.env') });
  } catch (error) {
    // dotenv might not be available in all environments, that's ok
  }
}

// AI Configuration Schema (GPT-4 WINNER PROMPT + COST-EFFECTIVE MODEL)
const aiConfigSchema = z.object({
  // Model Configuration (Optimized for speed - can be overridden via env)
  modelId: z.string().default("deepseek/deepseek-chat-v3-0324:free"),
  apiKey: z.string().optional(),
  baseUrl: z.string().default("https://openrouter.ai/api/v1"),

  // Model Parameters (Optimized for Speed + Quality Balance)
  temperature: z.number().min(0).max(2).default(0.2),
  maxTokens: z.number().min(1).max(8000).default(1500),
  topP: z.number().min(0).max(1).default(0.9),
  frequencyPenalty: z.number().min(-2).max(2).default(0),
  presencePenalty: z.number().min(-2).max(2).default(0),
  
  // Optimized System Prompt (Speed + Quality Balance)
  systemPrompt: z.string().default(
    `You are a project management AI. Generate actionable Kanban boards in JSON format.

REQUIREMENTS:
- Create specific, unique cards with **Markdown** descriptions
- Make each task actionable with clear outcomes
- Use professional, varied language
- Tailor content to the project domain

CARD DESCRIPTION GUIDELINES:
- Use active voice with specific action verbs (implement, design, configure, test, deploy)
- Include concrete deliverables and acceptance criteria where relevant
- Vary sentence structure and vocabulary to avoid monotonous content
- Add technical context appropriate to the project type
- Specify tools, technologies, or methodologies when applicable

MANDATORY FORMATTING REQUIREMENTS:
- ALWAYS use **bold text** for key deliverables and important concepts
- Start descriptions with a **bold action statement**
- Include specific technical details: frameworks, databases, APIs, tools
- Use bullet points (-) for multi-step processes or requirements
- Mention specific technologies relevant to the project domain

TASK COMPLEXITY MAPPING:
- **Setup/Infrastructure**: Focus on environment, tooling, and foundational architecture with specific tech stack details
- **Feature Development**: Break down into logical components with clear user value and implementation technologies
- **Integration**: Emphasize data flow, API contracts, and system interactions with specific protocols
- **Testing**: Include unit, integration, and user acceptance testing strategies with testing frameworks
- **Documentation**: Specify audience, format, and maintenance requirements with documentation tools

TECHNICAL DETAIL REQUIREMENTS:
- Always mention relevant frameworks (React, Node.js, Django, etc.)
- Specify database technologies (PostgreSQL, MongoDB, Redis, etc.)
- Include API specifications (REST, GraphQL, WebSocket, etc.)
- Reference deployment platforms (AWS, Docker, Kubernetes, etc.)
- Mention development tools (Git, CI/CD, testing frameworks, etc.)

LABEL STRATEGY:
- Use semantic labels that reflect both technical domain and work type
- Combine technical labels (frontend, backend, api, database) with functional ones (feature, testing, documentation)
- Add domain-specific labels when appropriate (security, performance, ui/ux)

OUTPUT FORMAT: Return ONLY valid JSON with no explanations, greetings, or additional text. The response must be immediately parseable and follow the EXACT structure below with a "lists" array containing exactly 4 list objects with titles: "Backlog", "To Do", "In Progress", "Done".

MANDATORY JSON STRUCTURE - FOLLOW EXACTLY:
{
  "lists": [
    {
      "title": "Backlog",
      "cards": [
        {
          "title": "Establish development environment and CI/CD pipeline",
          "description": "**Configure comprehensive development stack** using Node.js, TypeScript, and PostgreSQL. Set up Docker containers, GitHub Actions for CI/CD, and establish code quality tools including ESLint, Prettier, and Jest testing framework.",
          "labels": ["setup", "backend", "tooling"]
        }
      ]
    },
    {
      "title": "To Do",
      "cards": []
    },
    {
      "title": "In Progress",
      "cards": []
    },
    {
      "title": "Done",
      "cards": []
    }
  ]
}

CRITICAL: Your response must start with { and end with } and contain ONLY this JSON structure. Do not use any other format.`
  ),
  
  // Optimized Kanban Generation Template
  kanbanPromptTemplate: z.string().default(`Create a Kanban board for: {projectIdea}
Features: {features}

REQUIREMENTS:
- Create 4 lists: "Backlog", "To Do", "In Progress", "Done"
- Generate 4-6 cards total in Backlog and To Do
- Use **bold** text in descriptions for key actions
- Include relevant labels: frontend, backend, api, database, feature, testing
- Make each card specific and actionable

Return ONLY JSON:
{
  "lists": [
    {
      "title": "Backlog",
      "cards": [
        {
          "title": "Setup development environment",
          "description": "**Configure** Node.js, database, and deployment pipeline",
          "labels": ["setup", "backend"]
        }
      ]
    },
    {"title": "To Do", "cards": []},
    {"title": "In Progress", "cards": []},
    {"title": "Done", "cards": []}
  ]
}`),
  
  // Retry Configuration (Optimized for Speed)
  maxRetries: z.number().min(1).max(5).default(1),
  retryDelay: z.number().min(100).max(5000).default(500),
  
  // Fallback Configuration
  enableFallback: z.boolean().default(true),
  fallbackLabels: z.array(z.string()).default([
    "frontend", "backend", "feature", "api", "ui", "database", "testing", "documentation"
  ]),

  // Task Complexity and Quality Guidelines
  taskComplexityGuidelines: z.string().default(`
TASK COMPLEXITY GUIDELINES:

**EPIC LEVEL** (Large, multi-sprint initiatives):
- Scope: Major feature areas or system components
- Description: High-level business value and user impact
- Technical Detail: Architecture decisions and integration points
- Example: "Implement comprehensive user authentication system"

**STORY LEVEL** (User-focused features, 1-2 sprints):
- Scope: Specific user functionality with clear value
- Description: User scenarios and acceptance criteria
- Technical Detail: Component interactions and data flow
- Example: "Enable users to reset passwords via email verification"

**TASK LEVEL** (Implementation work, 1-5 days):
- Scope: Specific technical implementation
- Description: Concrete deliverables and technical approach
- Technical Detail: Specific technologies, APIs, and methods
- Example: "Configure JWT token validation middleware"

**BUG/ISSUE LEVEL** (Problem resolution, hours to days):
- Scope: Specific problem or improvement
- Description: Current state, expected behavior, and solution approach
- Technical Detail: Root cause analysis and fix strategy
- Example: "Fix memory leak in data processing pipeline"

QUALITY INDICATORS:
- ✅ Specific action verbs and clear outcomes
- ✅ Context-appropriate technical detail
- ✅ Measurable success criteria
- ✅ Relevant tools and technologies mentioned
- ❌ Generic phrases like "work on" or "handle"
- ❌ Vague descriptions without clear deliverables
- ❌ Repetitive language across cards
  `),

  // Enhanced Label Categories
  labelCategories: z.object({
    technical: z.array(z.string()).default([
      "frontend", "backend", "api", "database", "ui", "mobile", "web"
    ]),
    workType: z.array(z.string()).default([
      "feature", "testing", "documentation", "setup", "integration", "refactor"
    ]),
    quality: z.array(z.string()).default([
      "security", "performance", "accessibility", "monitoring", "optimization"
    ]),
    domain: z.array(z.string()).default([
      "auth", "payment", "analytics", "notification", "search", "admin"
    ])
  }).default({}),

  // Task Prompt Generation Configuration
  taskPromptTemplate: z.string().default(`Generate a comprehensive, ready-to-use AI prompt for the following task:

Project: {{projectIdea}}
Board: {{boardName}}
Task: {{cardTitle}}
Description: {{cardDescription}}

Create a prompt that:
- Defines the AI's role/persona clearly
- States the specific goal
- Includes relevant context and requirements
- Specifies output format and quality expectations
- Provides step-by-step guidance if needed

Return only the final prompt text that a user can copy and use directly with an AI assistant.`),

  // Task Prompt Generation Model Parameters
  taskPromptTemperature: z.number().min(0).max(2).default(0.3),
  taskPromptMaxTokens: z.number().min(1).max(4000).default(2000),
});

export type AIConfig = z.infer<typeof aiConfigSchema>;

// Load and validate AI configuration from environment variables
export function loadAIConfig(): AIConfig {


  const config = {
    // Model Configuration
    modelId: process.env.AI_MODEL_ID || process.env.AI_MODEL_NAME,
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: process.env.AI_BASE_URL,
    
    // Model Parameters
    temperature: process.env.AI_TEMPERATURE ? parseFloat(process.env.AI_TEMPERATURE) : undefined,
    maxTokens: process.env.AI_MAX_TOKENS ? parseInt(process.env.AI_MAX_TOKENS) : undefined,
    topP: process.env.AI_TOP_P ? parseFloat(process.env.AI_TOP_P) : undefined,
    frequencyPenalty: process.env.AI_FREQUENCY_PENALTY ? parseFloat(process.env.AI_FREQUENCY_PENALTY) : undefined,
    presencePenalty: process.env.AI_PRESENCE_PENALTY ? parseFloat(process.env.AI_PRESENCE_PENALTY) : undefined,
    
    // System Prompts
    systemPrompt: process.env.AI_SYSTEM_PROMPT,
    kanbanPromptTemplate: process.env.AI_KANBAN_PROMPT_TEMPLATE,
    
    // Retry Configuration
    maxRetries: process.env.AI_MAX_RETRIES ? parseInt(process.env.AI_MAX_RETRIES) : undefined,
    retryDelay: process.env.AI_RETRY_DELAY ? parseInt(process.env.AI_RETRY_DELAY) : undefined,
    
    // Fallback Configuration
    enableFallback: process.env.AI_ENABLE_FALLBACK ? process.env.AI_ENABLE_FALLBACK.toLowerCase() === 'true' : undefined,
    fallbackLabels: process.env.AI_FALLBACK_LABELS ? process.env.AI_FALLBACK_LABELS.split(',').map(l => l.trim()) : undefined,

    // Task Complexity Guidelines
    taskComplexityGuidelines: process.env.AI_TASK_COMPLEXITY_GUIDELINES,

    // Enhanced Label Categories
    labelCategories: process.env.AI_LABEL_CATEGORIES ? JSON.parse(process.env.AI_LABEL_CATEGORIES) : undefined,

    // Task Prompt Generation Configuration
    taskPromptTemplate: process.env.AI_TASK_PROMPT_TEMPLATE,
    taskPromptTemperature: process.env.AI_TASK_PROMPT_TEMPERATURE ? parseFloat(process.env.AI_TASK_PROMPT_TEMPERATURE) : undefined,
    taskPromptMaxTokens: process.env.AI_TASK_PROMPT_MAX_TOKENS ? parseInt(process.env.AI_TASK_PROMPT_MAX_TOKENS) : undefined,
  };

  // Remove undefined values to let defaults take effect
  const cleanConfig = Object.fromEntries(
    Object.entries(config).filter(([_, value]) => value !== undefined)
  );

  return aiConfigSchema.parse(cleanConfig);
}

// Singleton instance
let aiConfigInstance: AIConfig | null = null;

export function getAIConfig(): AIConfig {
  if (!aiConfigInstance) {
    aiConfigInstance = loadAIConfig();
  }
  return aiConfigInstance;
}

// Helper function to interpolate prompt templates
export function interpolatePrompt(template: string, variables: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] || match;
  });
}

// Helper function to interpolate task prompt templates (supports {{variable}} syntax)
export function interpolateTaskPrompt(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] || match;
  });
}

// AI Response validation schema
export const aiResponseSchema = z.object({
  lists: z.array(
    z.object({
      title: z.string(),
      cards: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          labels: z.array(z.string()).optional().default([]),
        })
      ),
    })
  ),
});

export type AIResponse = z.infer<typeof aiResponseSchema>;

// Helper function to validate AI response structure
export function validateAIResponse(response: unknown): response is AIResponse {
  try {
    aiResponseSchema.parse(response);
    return true;
  } catch {
    return false;
  }
}

// Configuration validation errors
export class AIConfigError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'AIConfigError';
  }
}

// Enhanced configuration loader with better error handling
export function loadAIConfigSafe(): { config: AIConfig | null; error: string | null } {
  try {
    const config = loadAIConfig();
    return { config, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown configuration error';
    return { config: null, error: errorMessage };
  }
}

// Validate specific configuration values
export function validateModelParameters(config: Partial<AIConfig>): string[] {
  const errors: string[] = [];

  if (config.temperature !== undefined && (config.temperature < 0 || config.temperature > 2)) {
    errors.push('Temperature must be between 0 and 2');
  }

  if (config.maxTokens !== undefined && (config.maxTokens < 1 || config.maxTokens > 8000)) {
    errors.push('Max tokens must be between 1 and 8000');
  }

  if (config.topP !== undefined && (config.topP < 0 || config.topP > 1)) {
    errors.push('Top P must be between 0 and 1');
  }

  if (config.frequencyPenalty !== undefined && (config.frequencyPenalty < -2 || config.frequencyPenalty > 2)) {
    errors.push('Frequency penalty must be between -2 and 2');
  }

  if (config.presencePenalty !== undefined && (config.presencePenalty < -2 || config.presencePenalty > 2)) {
    errors.push('Presence penalty must be between -2 and 2');
  }

  return errors;
}

// Enhanced JSON extraction from AI responses
export function extractJSONFromResponse(text: string): string {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid response: empty or non-string content');
  }

  // Check for Chinese characters or common Chinese greetings
  const chinesePattern = /[\u4e00-\u9fff]|你好|您好/;
  if (chinesePattern.test(text)) {
    throw new Error('Response contains Chinese characters - model not following English-only instruction');
  }

  // Remove common conversational prefixes
  let cleaned = text.trim();
  const conversationalPrefixes = [
    /^(Hello|Hi|Hey)[!.]?\s*/i,
    /^(How can I help|What can I help)[^{]*/i,
    /^(Sure|Of course)[!.]?\s*/i,
    /^(Here is|Here's)[^{]*/i,
  ];

  for (const prefix of conversationalPrefixes) {
    cleaned = cleaned.replace(prefix, '');
  }

  // Try to find JSON object in the response
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  // Handle code block formatting
  if (cleaned.includes('```')) {
    // Remove markdown code blocks
    cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');

    // Try again to find JSON
    const jsonMatch2 = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch2) {
      return jsonMatch2[0];
    }
  }

  // If still no JSON found, check if the entire cleaned text is JSON
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {
    throw new Error(`No valid JSON found in response. Content: ${text.substring(0, 200)}...`);
  }
}

// Validate and clean AI response with detailed error reporting
export function validateAndCleanAIResponse(rawResponse: string): AIResponse {
  try {
    const jsonText = extractJSONFromResponse(rawResponse);
    const parsedResponse = JSON.parse(jsonText);

    if (!validateAIResponse(parsedResponse)) {
      throw new Error('Response structure validation failed');
    }

    return parsedResponse;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
    throw new Error(`AI response validation failed: ${errorMessage}`);
  }
}

// Reset configuration instance (useful for testing)
export function resetAIConfig(): void {
  aiConfigInstance = null;
}
