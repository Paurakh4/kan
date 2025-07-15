/**
 * Generate Task Prompt Template
 * 
 * This module handles the generation of AI prompts for creating task-specific
 * AI prompts. It extracts the task prompt generation logic from the AI router
 * to improve maintainability and provide a centralized location for prompt
 * template management.
 */

import { getAIConfig, interpolateTaskPrompt } from '../config/ai';
import type { GenerateTaskPromptParams, PromptResult, PromptConfig } from './types';

/**
 * Generates a comprehensive AI prompt for a specific task/card
 * 
 * This function creates a meta-prompt that helps users generate effective
 * AI prompts for their specific tasks. It takes context about the project,
 * board, and card to create a tailored prompt that defines the AI's role,
 * states the goal, and provides guidance for the task.
 * 
 * @param params - The parameters for generating the task prompt
 * @param params.projectIdea - The project idea or description
 * @param params.boardName - The name of the board
 * @param params.cardTitle - The title of the card/task
 * @param params.cardDescription - The description of the card/task
 * @param params.context - Additional context variables for interpolation
 * @param config - Optional configuration for prompt generation
 * @returns PromptResult containing the generated task prompt and optional metadata
 * 
 * @example
 * ```typescript
 * const result = generateTaskPrompt({
 *   projectIdea: "E-commerce platform",
 *   boardName: "MVP Development",
 *   cardTitle: "Implement user authentication",
 *   cardDescription: "Create secure login and registration system"
 * });
 * console.log(result.prompt);
 * ```
 */
export function generateTaskPrompt(
  params: GenerateTaskPromptParams,
  config?: PromptConfig
): PromptResult {
  const { projectIdea, boardName, cardTitle, cardDescription, context = {} } = params;
  const aiConfig = getAIConfig();
  
  // Prepare variables for template interpolation
  const templateVariables = {
    projectIdea,
    boardName,
    cardTitle,
    cardDescription,
    ...context
  };
  
  // Use the configured task prompt template with interpolation
  const prompt = interpolateTaskPrompt(aiConfig.taskPromptTemplate, templateVariables);
  
  // Prepare result with optional metadata
  const result: PromptResult = {
    prompt
  };
  
  if (config?.includeMetadata) {
    result.metadata = {
      template: 'taskPromptTemplate',
      variables: templateVariables,
      generatedAt: new Date()
    };
  }
  
  return result;
}

/**
 * Generates a simplified task prompt for basic use cases
 * 
 * This function creates a more straightforward prompt when detailed
 * context is not available or when a simpler approach is preferred.
 * 
 * @param params - The parameters for generating the simple task prompt
 * @param config - Optional configuration for prompt generation
 * @returns PromptResult containing the simplified task prompt
 */
export function generateSimpleTaskPrompt(
  params: Pick<GenerateTaskPromptParams, 'cardTitle' | 'cardDescription'>,
  config?: PromptConfig
): PromptResult {
  const { cardTitle, cardDescription } = params;
  
  const simplePrompt = `Create a detailed AI prompt for the following task:

Task: ${cardTitle}
Description: ${cardDescription}

The prompt should:
- Define a clear role for the AI assistant
- Specify the exact goal and deliverables
- Include any relevant context or constraints
- Provide step-by-step guidance if needed
- Specify the expected output format

Return only the final prompt text that can be used directly with an AI assistant.`;

  const result: PromptResult = {
    prompt: simplePrompt
  };
  
  if (config?.includeMetadata) {
    result.metadata = {
      template: 'simpleTaskTemplate',
      variables: { cardTitle, cardDescription },
      generatedAt: new Date()
    };
  }
  
  return result;
}
