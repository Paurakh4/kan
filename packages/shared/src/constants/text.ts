/**
 * Centralized text constants to prevent random placeholder text issues
 * This file contains default text values and fallbacks for UI components
 */

export const DEFAULT_TEXT = {
  // Workspace defaults
  WORKSPACE: {
    DEFAULT_NAME: "My Workspace",
    UNTITLED: "Untitled Workspace",
    LOADING: "Loading workspace...",
    NOT_FOUND: "Workspace not found",
    PLACEHOLDER_NAME: "Enter workspace name...",
  },

  // Board defaults
  BOARD: {
    DEFAULT_NAME: "My Board",
    UNTITLED: "Untitled Board",
    LOADING: "Loading board...",
    NOT_FOUND: "Board not found",
    PLACEHOLDER_NAME: "Enter board name...",
    PLACEHOLDER_DESCRIPTION: "Add a description for this board...",
  },

  // List defaults
  LIST: {
    DEFAULT_NAME: "New List",
    UNTITLED: "Untitled List",
    PLACEHOLDER_NAME: "Enter list name...",
    ADD_CARD: "Add a card",
    ADD_LIST: "Add another list",
  },

  // Card defaults
  CARD: {
    DEFAULT_TITLE: "New Card",
    UNTITLED: "Untitled Card",
    PLACEHOLDER_TITLE: "Enter card title...",
    PLACEHOLDER_DESCRIPTION: "Add description... (type '/' to open commands)",
    ADD_COMMENT: "Add a comment...",
  },

  // User/Member defaults
  USER: {
    ANONYMOUS: "Anonymous User",
    GUEST: "Guest",
    LOADING: "Loading user...",
    PLACEHOLDER_NAME: "Enter name...",
    PLACEHOLDER_EMAIL: "Enter email...",
  },

  // Label defaults
  LABEL: {
    DEFAULT_NAME: "New Label",
    UNTITLED: "Untitled Label",
    PLACEHOLDER_NAME: "Enter label name...",
  },

  // Common UI text
  COMMON: {
    LOADING: "Loading...",
    ERROR: "Something went wrong",
    NOT_FOUND: "Not found",
    UNTITLED: "Untitled",
    PLACEHOLDER: "Enter text...",
    NO_DATA: "No data available",
    COMING_SOON: "Coming soon",
  },

  // Form placeholders
  FORMS: {
    SEARCH: "Search...",
    FILTER: "Filter...",
    SELECT: "Select an option...",
    EMAIL: "Enter your email...",
    PASSWORD: "Enter your password...",
    CONFIRM_PASSWORD: "Confirm your password...",
  },

  // Status messages
  STATUS: {
    SUCCESS: "Success!",
    ERROR: "Error occurred",
    WARNING: "Warning",
    INFO: "Information",
    SAVED: "Saved successfully",
    DELETED: "Deleted successfully",
    UPDATED: "Updated successfully",
    CREATED: "Created successfully",
  },
} as const;

/**
 * Helper function to get safe display text with fallback
 * Prevents displaying random UIDs or empty strings in the UI
 */
export function getSafeDisplayText(
  text: string | null | undefined,
  fallback: string,
  options?: {
    maxLength?: number;
    trimWhitespace?: boolean;
  }
): string {
  const { maxLength, trimWhitespace = true } = options || {};
  
  // Handle null, undefined, or empty strings
  if (!text || (trimWhitespace && !text.trim())) {
    return fallback;
  }

  // Check if text looks like a UID (12 chars, alphanumeric)
  const uidPattern = /^[a-z0-9]{12}$/i;
  if (uidPattern.test(text.trim())) {
    return fallback;
  }

  // Check if text starts with PLACEHOLDER_
  if (text.startsWith('PLACEHOLDER_')) {
    return fallback;
  }

  let result = trimWhitespace ? text.trim() : text;
  
  // Truncate if maxLength is specified
  if (maxLength && result.length > maxLength) {
    result = result.substring(0, maxLength - 3) + '...';
  }

  return result;
}

/**
 * Helper function to generate safe slugs from text
 * Ensures slugs are never random UIDs
 */
export function generateSafeSlug(text: string, fallback: string = 'untitled'): string {
  if (!text || !text.trim()) {
    return fallback;
  }

  // Check if text looks like a UID
  const uidPattern = /^[a-z0-9]{12}$/i;
  if (uidPattern.test(text.trim())) {
    return fallback;
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validation function to check if a string is likely a UID
 */
export function isLikelyUID(text: string): boolean {
  if (!text) return false;
  
  // Check for 12-character alphanumeric strings (our UID format)
  const uidPattern = /^[a-z0-9]{12}$/i;
  return uidPattern.test(text.trim());
}

/**
 * Validation function to check if a string is a placeholder
 */
export function isPlaceholderText(text: string): boolean {
  if (!text) return false;
  
  return text.startsWith('PLACEHOLDER_') || 
         text.includes('placeholder') ||
         text.includes('lorem ipsum') ||
         isLikelyUID(text);
}
