/**
 * Generate Description Prompt Template
 * 
 * This module handles the generation of AI prompts for creating rich,
 * detailed card descriptions. It provides templates for different types
 * of cards (epic, story, task, bug) with appropriate formatting and
 * content guidelines.
 */

import { getAIConfig } from '../config/ai';
import type { GenerateDescriptionPromptParams, PromptResult, PromptConfig } from './types';

/**
 * Generates a prompt for creating rich card descriptions with Markdown formatting
 * 
 * This function creates a comprehensive prompt that instructs the AI to generate
 * detailed, well-structured card descriptions using Markdown formatting. The
 * prompt adapts based on the card type and includes guidelines for creating
 * actionable content with proper formatting.
 * 
 * @param params - The parameters for generating the description prompt
 * @param params.cardTitle - The title of the card
 * @param params.cardType - The type of card (epic, story, task, bug)
 * @param params.projectContext - Project context for better description generation
 * @param params.requirements - Additional requirements or acceptance criteria
 * @param params.context - Additional context variables for interpolation
 * @param config - Optional configuration for prompt generation
 * @returns PromptResult containing the generated description prompt and optional metadata
 * 
 * @example
 * ```typescript
 * const result = generateDescriptionPrompt({
 *   cardTitle: "Implement user authentication",
 *   cardType: "story",
 *   projectContext: "E-commerce platform for small businesses",
 *   requirements: ["OAuth integration", "Password reset functionality"]
 * });
 * console.log(result.prompt);
 * ```
 */
export function generateDescriptionPrompt(
  params: GenerateDescriptionPromptParams,
  config?: PromptConfig
): PromptResult {
  const { 
    cardTitle, 
    cardType = 'task', 
    projectContext = '', 
    requirements = [],
    context = {} 
  } = params;
  
  const aiConfig = getAIConfig();
  
  // Build the base prompt with card type-specific guidelines
  const cardTypeGuidelines = getCardTypeGuidelines(cardType);
  const requirementsText = requirements.length > 0 
    ? `\n\nSpecific Requirements:\n${requirements.map(req => `- ${req}`).join('\n')}`
    : '';
  
  const prompt = `Generate a comprehensive, well-structured description for the following ${cardType}:

**Card Title:** ${cardTitle}
${projectContext ? `**Project Context:** ${projectContext}` : ''}${requirementsText}

**Description Requirements:**
${cardTypeGuidelines}

**Markdown Formatting Guidelines:**
- Use **bold text** for key actions and important concepts
- Use headings (## or ###) to organize sections
- Use bullet points or numbered lists for steps, requirements, or features
- Use blockquotes (>) for acceptance criteria or important notes
- Use code blocks (\`\`\`) for technical specifications or examples
- Ensure proper line spacing and visual hierarchy

**Content Guidelines:**
- Write in active voice with specific action verbs
- Include concrete deliverables and outcomes
- Vary sentence structure and vocabulary to avoid repetition
- Add technical context appropriate to the project type
- Specify tools, technologies, or methodologies when applicable
- Make each task actionable with clear success criteria

Generate only the description content in Markdown format. Do not include the title or any meta-information.`;

  const result: PromptResult = {
    prompt
  };
  
  if (config?.includeMetadata) {
    result.metadata = {
      template: 'descriptionPromptTemplate',
      variables: { 
        cardTitle, 
        cardType, 
        projectContext, 
        requirements: requirements.join(', '),
        ...context 
      },
      generatedAt: new Date()
    };
  }
  
  return result;
}

/**
 * Gets card type-specific guidelines for description generation
 * 
 * @param cardType - The type of card (epic, story, task, bug)
 * @returns String containing specific guidelines for the card type
 */
function getCardTypeGuidelines(cardType: string): string {
  switch (cardType) {
    case 'epic':
      return `- Create a high-level overview of a major feature or initiative
- Include business value and user impact
- Break down into potential stories or components
- Specify success metrics and timeline considerations
- Include stakeholder information and dependencies`;
      
    case 'story':
      return `- Write from the user's perspective (As a... I want... So that...)
- Include detailed acceptance criteria in blockquotes
- Specify user interactions and expected behaviors
- Include edge cases and error handling requirements
- Define done criteria and testing considerations`;
      
    case 'bug':
      return `- Describe the current behavior vs expected behavior
- Include steps to reproduce the issue
- Specify affected systems, browsers, or environments
- Include error messages or logs if applicable
- Define acceptance criteria for the fix
- Specify testing requirements to prevent regression`;
      
    case 'task':
    default:
      return `- Define specific, actionable work to be completed
- Include technical implementation details
- Specify tools, frameworks, or technologies to use
- Include configuration or setup requirements
- Define clear completion criteria and deliverables
- Specify any dependencies or prerequisites`;
  }
}
