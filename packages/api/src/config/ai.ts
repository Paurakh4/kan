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
  // Model Configuration (DeepSeek free tier with GPT-4 winner prompt)
  modelId: z.string().default("deepseek/deepseek-chat-v3-0324:free"),
  apiKey: z.string().optional(),
  baseUrl: z.string().default("https://openrouter.ai/api/v1"),

  // Model Parameters (Optimized for DeepSeek with GPT-4 winner prompt)
  temperature: z.number().min(0).max(2).default(0.3),
  maxTokens: z.number().min(1).max(8000).default(3000),
  topP: z.number().min(0).max(1).default(1),
  frequencyPenalty: z.number().min(-2).max(2).default(0),
  presencePenalty: z.number().min(-2).max(2).default(0),
  
  // System Prompts (GPT 4.0 WINNER - 9.8/10 score from comprehensive testing)
  systemPrompt: z.string().default(
    "Role: You are an AI service designed to generate Kanban board plans. Action: Generate a complete Kanban board in JSON format. Context: The user will provide a high-level project idea along with a list of desired features. Using this input, the AI must generate a well-structured Kanban board that includes relevant lists, detailed cards, and appropriate labels. The output must be optimized to reduce setup time for the user and provide a practical, actionable starting point for the project. Expectation: The output must be in English. It must contain only valid JSON with no explanations, conversational text, or greetings. The response must not start with any non-JSON content or phrases. Ensure the JSON is fully valid and parseable, representing a Kanban board that includes lists, cards, and labels based on the provided project idea and features. Generate a JSON object with this EXACT structure (all text must be in English): { \"lists\": [ { \"title\": \"Backlog\", \"cards\": [ { \"title\": \"Setup project repository\", \"description\": \"Initialize git repository and basic project structure\", \"labels\": [\"setup\", \"backend\"] } ] }, { \"title\": \"To Do\", \"cards\": [] }, { \"title\": \"In Progress\", \"cards\": [] }, { \"title\": \"Done\", \"cards\": [] } ] }"
  ),
  
  // Kanban Generation Prompts
  kanbanPromptTemplate: z.string().default(`IMPORTANT: Respond ONLY with valid JSON. Do NOT include any text before or after the JSON. Do NOT use Chinese language.

Project: {projectIdea}
Features: {features}

Generate a JSON object with this EXACT structure (all text must be in English):

{
  "lists": [
    {
      "title": "Backlog",
      "cards": [
        {
          "title": "Setup project repository",
          "description": "Initialize git repository and basic project structure",
          "labels": ["setup", "backend"]
        },
        {
          "title": "Design user interface",
          "description": "Create wireframes and mockups for the main user interface",
          "labels": ["design", "frontend"]
        }
      ]
    },
    {
      "title": "To Do",
      "cards": [
        {
          "title": "Implement authentication",
          "description": "Set up user login and registration system",
          "labels": ["backend", "security"]
        }
      ]
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

STRICT REQUIREMENTS:
1. ALL text must be in English, never Chinese
2. Create exactly 4 lists with titles: "Backlog", "To Do", "In Progress", "Done"
3. Generate 4-8 cards total, distributed across Backlog (3-5 cards) and To Do (1-3 cards)
4. Each card needs: title (English), description (English), labels array
5. Use labels: "frontend", "backend", "api", "ui", "database", "testing", "documentation", "feature"
6. Descriptions must be actionable and specific
7. Return ONLY the JSON object, no other text`),
  
  // Retry Configuration (Optimized for DeepSeek)
  maxRetries: z.number().min(1).max(5).default(2),
  retryDelay: z.number().min(100).max(5000).default(1000),
  
  // Fallback Configuration
  enableFallback: z.boolean().default(true),
  fallbackLabels: z.array(z.string()).default([
    "frontend", "backend", "feature", "api", "ui", "database", "testing", "documentation"
  ]),
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
