/**
 * Data validation utilities to detect and fix random UID text issues
 */

import { DEFAULT_TEXT, isLikelyUID, isPlaceholderText } from "@kan/shared/constants";

/**
 * Validates and fixes workspace names that might be UIDs
 */
export function validateWorkspaceName(name: string | null | undefined): string {
  if (!name || isLikelyUID(name) || isPlaceholderText(name)) {
    return DEFAULT_TEXT.WORKSPACE.DEFAULT_NAME;
  }
  return name.trim();
}

/**
 * Validates and fixes board names that might be UIDs
 */
export function validateBoardName(name: string | null | undefined): string {
  if (!name || isLikelyUID(name) || isPlaceholderText(name)) {
    return DEFAULT_TEXT.BOARD.DEFAULT_NAME;
  }
  return name.trim();
}

/**
 * Validates and fixes list names that might be UIDs
 */
export function validateListName(name: string | null | undefined): string {
  if (!name || isLikelyUID(name) || isPlaceholderText(name)) {
    return DEFAULT_TEXT.LIST.DEFAULT_NAME;
  }
  return name.trim();
}

/**
 * Validates and fixes card titles that might be UIDs
 */
export function validateCardTitle(title: string | null | undefined): string {
  if (!title || isLikelyUID(title) || isPlaceholderText(title)) {
    return DEFAULT_TEXT.CARD.DEFAULT_TITLE;
  }
  return title.trim();
}

/**
 * Validates and fixes label names that might be UIDs
 */
export function validateLabelName(name: string | null | undefined): string {
  if (!name || isLikelyUID(name) || isPlaceholderText(name)) {
    return DEFAULT_TEXT.LABEL.DEFAULT_NAME;
  }
  return name.trim();
}

/**
 * Validates and fixes user names that might be UIDs
 */
export function validateUserName(name: string | null | undefined): string {
  if (!name || isLikelyUID(name) || isPlaceholderText(name)) {
    return DEFAULT_TEXT.USER.ANONYMOUS;
  }
  return name.trim();
}

/**
 * Comprehensive data validation for any text field
 */
export function validateDisplayText(
  text: string | null | undefined,
  fallback: string,
  options?: {
    allowEmpty?: boolean;
    maxLength?: number;
  }
): string {
  const { allowEmpty = false, maxLength } = options || {};

  // Handle null/undefined
  if (!text) {
    return allowEmpty ? "" : fallback;
  }

  const trimmed = text.trim();

  // Handle empty strings
  if (!trimmed) {
    return allowEmpty ? "" : fallback;
  }

  // Check for UID patterns or placeholder text
  if (isLikelyUID(trimmed) || isPlaceholderText(trimmed)) {
    return fallback;
  }

  // Truncate if needed
  if (maxLength && trimmed.length > maxLength) {
    return trimmed.substring(0, maxLength - 3) + "...";
  }

  return trimmed;
}

/**
 * Batch validation for multiple text fields
 */
export function validateTextFields(fields: Record<string, string | null | undefined>, fallbacks: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(fields)) {
    const fallback = fallbacks[key] || DEFAULT_TEXT.COMMON.UNTITLED;
    result[key] = validateDisplayText(value, fallback);
  }
  
  return result;
}

/**
 * Detects if a database record has corrupted text data
 */
export function hasCorruptedTextData(record: Record<string, any>): boolean {
  const textFields = ['name', 'title', 'description', 'slug'];
  
  for (const field of textFields) {
    const value = record[field];
    if (value && (isLikelyUID(value) || isPlaceholderText(value))) {
      return true;
    }
  }
  
  return false;
}

/**
 * Fixes corrupted text data in a database record
 */
export function fixCorruptedTextData(
  record: Record<string, any>,
  entityType: 'workspace' | 'board' | 'list' | 'card' | 'label' | 'user'
): Record<string, any> {
  const fixed = { ...record };
  
  switch (entityType) {
    case 'workspace':
      if (fixed.name) fixed.name = validateWorkspaceName(fixed.name);
      break;
    case 'board':
      if (fixed.name) fixed.name = validateBoardName(fixed.name);
      break;
    case 'list':
      if (fixed.name) fixed.name = validateListName(fixed.name);
      break;
    case 'card':
      if (fixed.title) fixed.title = validateCardTitle(fixed.title);
      break;
    case 'label':
      if (fixed.name) fixed.name = validateLabelName(fixed.name);
      break;
    case 'user':
      if (fixed.name) fixed.name = validateUserName(fixed.name);
      break;
  }
  
  return fixed;
}

/**
 * Generates a report of data quality issues
 */
export function generateDataQualityReport(records: Array<Record<string, any>>): {
  totalRecords: number;
  corruptedRecords: number;
  corruptedFields: string[];
  issues: Array<{ recordId: string; field: string; value: string; issue: string }>;
} {
  const issues: Array<{ recordId: string; field: string; value: string; issue: string }> = [];
  const corruptedFields = new Set<string>();
  let corruptedRecords = 0;

  for (const record of records) {
    let hasIssues = false;
    const textFields = ['name', 'title', 'description', 'slug'];
    
    for (const field of textFields) {
      const value = record[field];
      if (value) {
        if (isLikelyUID(value)) {
          issues.push({
            recordId: record.id || record.publicId || 'unknown',
            field,
            value,
            issue: 'Likely UID used as display text'
          });
          corruptedFields.add(field);
          hasIssues = true;
        } else if (isPlaceholderText(value)) {
          issues.push({
            recordId: record.id || record.publicId || 'unknown',
            field,
            value,
            issue: 'Placeholder text detected'
          });
          corruptedFields.add(field);
          hasIssues = true;
        }
      }
    }
    
    if (hasIssues) {
      corruptedRecords++;
    }
  }

  return {
    totalRecords: records.length,
    corruptedRecords,
    corruptedFields: Array.from(corruptedFields),
    issues
  };
}
