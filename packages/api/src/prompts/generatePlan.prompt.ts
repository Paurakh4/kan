/**
 * Generate Plan Prompt Template
 * 
 * This module handles the generation of AI prompts for creating Kanban board plans.
 * It extracts the prompt logic from the AI router to improve maintainability and
 * provide a centralized location for prompt template management.
 */

import { getAIConfig, interpolatePrompt } from '../config/ai';
import type { GeneratePlanPromptParams, PromptResult, PromptConfig } from './types';

/**
 * Generates a prompt for AI-powered Kanban board creation
 * 
 * This function creates a comprehensive prompt that instructs the AI to generate
 * a structured Kanban board with lists and cards based on the provided project
 * idea and features. The prompt includes specific formatting requirements and
 * guidelines for creating actionable, well-structured cards.
 * 
 * @param params - The parameters for generating the plan prompt
 * @param params.projectIdea - The main project idea or description
 * @param params.features - Array of features to be included in the project
 * @param params.context - Additional context variables for interpolation
 * @param config - Optional configuration for prompt generation
 * @returns PromptResult containing the generated prompt and optional metadata
 * 
 * @example
 * ```typescript
 * const result = generatePlanPrompt({
 *   projectIdea: "E-commerce platform for small businesses",
 *   features: ["user authentication", "product catalog", "shopping cart"]
 * });
 * console.log(result.prompt);
 * ```
 */
export function generatePlanPrompt(
  params: GeneratePlanPromptParams,
  config?: PromptConfig
): PromptResult {
  const { projectIdea, features, context = {} } = params;
  const aiConfig = getAIConfig();
  
  // Prepare variables for template interpolation
  const templateVariables = {
    projectIdea,
    features: features.join(", "),
    ...context
  };
  
  // Use the configured Kanban prompt template with interpolation
  const prompt = interpolatePrompt(aiConfig.kanbanPromptTemplate, templateVariables);
  
  // Prepare result with optional metadata
  const result: PromptResult = {
    prompt
  };
  
  if (config?.includeMetadata) {
    result.metadata = {
      template: 'kanbanPromptTemplate',
      variables: templateVariables,
      generatedAt: new Date()
    };
  }
  
  return result;
}

/**
 * Generates a fallback prompt when the main AI generation fails
 * 
 * This function creates a simplified prompt that can be used as a backup
 * when the primary AI generation encounters issues. It focuses on creating
 * a basic but functional Kanban structure.
 * 
 * @param params - The parameters for generating the fallback prompt
 * @param config - Optional configuration for prompt generation
 * @returns PromptResult containing the fallback prompt
 */
export function generateFallbackPlanPrompt(
  params: GeneratePlanPromptParams,
  config?: PromptConfig
): PromptResult {
  const { projectIdea, features } = params;
  
  const fallbackPrompt = `Create a simple Kanban board for: ${projectIdea}
  
Key Features: ${features.join(", ")}

Generate a basic JSON structure with:
- 4 lists: Backlog, To Do, In Progress, Done
- 3-5 essential cards in Backlog
- Each card should have title, description, and relevant labels
- Focus on core functionality and setup tasks

Return only valid JSON in the specified format.`;

  const result: PromptResult = {
    prompt: fallbackPrompt
  };
  
  if (config?.includeMetadata) {
    result.metadata = {
      template: 'fallbackPlanTemplate',
      variables: { projectIdea, features: features.join(", ") },
      generatedAt: new Date()
    };
  }
  
  return result;
}
