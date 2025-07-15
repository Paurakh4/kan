/**
 * Centralized Prompt Template Management System
 * 
 * This module provides a centralized export point for all AI prompt templates
 * used throughout the application. It improves maintainability and scalability
 * of AI prompts by organizing them into dedicated modules.
 */

// Export all prompt functions
export { generatePlanPrompt, generateFallbackPlanPrompt } from './generatePlan.prompt';
export { generateTaskPrompt, generateSimpleTaskPrompt } from './generateTask.prompt';
export { generateDescriptionPrompt } from './generateDescription.prompt';

// Export types and interfaces
export type {
  BasePromptParams,
  GeneratePlanPromptParams,
  GenerateTaskPromptParams,
  GenerateDescriptionPromptParams,
  ReviseProjectPromptParams,
  PromptResult,
  PromptConfig,
  PromptFunction
} from './types';

/**
 * Utility function to create a revision prompt for existing projects
 * 
 * This function generates a prompt for revising existing Kanban projects
 * based on user feedback and current board structure.
 * 
 * @param params - The parameters for generating the revision prompt
 * @returns PromptResult containing the revision prompt
 */
export function generateRevisionPrompt(params: {
  projectIdea: string;
  currentStructure: Array<{ title: string; cardCount: number }>;
  revisionNotes: string;
}): { prompt: string } {
  const { projectIdea, currentStructure, revisionNotes } = params;
  
  const prompt = `PROJECT REVISION REQUEST

Original Project: ${projectIdea}
Current Board Structure: ${currentStructure.map(list => `${list.title} (${list.cardCount} cards)`).join(", ")}

USER REVISION REQUEST:
${revisionNotes}

Please analyze the current board structure and user feedback to generate an improved Kanban board. 

REVISION GUIDELINES:
- Maintain the core project vision while addressing user feedback
- Improve card organization and list structure based on feedback
- Add missing functionality or features mentioned in revision notes
- Ensure cards are actionable and well-structured
- Use proper Markdown formatting in descriptions
- Generate 4-8 cards total across appropriate lists
- Place new/revised cards primarily in Backlog and To Do lists

Return the response in the same JSON format as the original board generation, with improved structure and content based on the revision request.`;

  return { prompt };
}
