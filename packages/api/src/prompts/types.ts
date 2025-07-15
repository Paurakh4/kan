/**
 * Type definitions for AI prompt template system
 * 
 * This file contains all the TypeScript interfaces and types used by the
 * centralized prompt template management system.
 */

/**
 * Base interface for all prompt function parameters
 */
export interface BasePromptParams {
  /** Additional context variables that can be interpolated into prompts */
  context?: Record<string, string>;
}

/**
 * Parameters for generating Kanban board plans
 */
export interface GeneratePlanPromptParams extends BasePromptParams {
  /** The main project idea or description */
  projectIdea: string;
  /** Array of features to be included in the project */
  features: string[];
}

/**
 * Parameters for generating task prompts
 */
export interface GenerateTaskPromptParams extends BasePromptParams {
  /** The project idea or description */
  projectIdea: string;
  /** The name of the board */
  boardName: string;
  /** The title of the card/task */
  cardTitle: string;
  /** The description of the card/task */
  cardDescription: string;
}

/**
 * Parameters for generating card descriptions
 */
export interface GenerateDescriptionPromptParams extends BasePromptParams {
  /** The title of the card */
  cardTitle: string;
  /** The type of card (epic, story, task, bug) */
  cardType?: 'epic' | 'story' | 'task' | 'bug';
  /** Project context for better description generation */
  projectContext?: string;
  /** Additional requirements or acceptance criteria */
  requirements?: string[];
}

/**
 * Parameters for project revision prompts
 */
export interface ReviseProjectPromptParams extends BasePromptParams {
  /** The original project idea */
  projectIdea: string;
  /** Current board structure information */
  currentStructure: Array<{
    title: string;
    cardCount: number;
  }>;
  /** User's revision notes and feedback */
  revisionNotes: string;
}

/**
 * Standard return type for all prompt functions
 */
export interface PromptResult {
  /** The generated prompt string */
  prompt: string;
  /** Optional metadata about the prompt generation */
  metadata?: {
    /** Template used for generation */
    template?: string;
    /** Variables that were interpolated */
    variables?: Record<string, string>;
    /** Timestamp of generation */
    generatedAt?: Date;
  };
}

/**
 * Configuration options for prompt generation
 */
export interface PromptConfig {
  /** Whether to include debug information in metadata */
  includeMetadata?: boolean;
  /** Custom template overrides */
  templateOverrides?: Record<string, string>;
  /** Additional system-level context */
  systemContext?: string;
}

/**
 * Type for prompt template functions
 */
export type PromptFunction<T extends BasePromptParams> = (
  params: T,
  config?: PromptConfig
) => PromptResult;
