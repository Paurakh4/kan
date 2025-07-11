# Text Management System

This document describes the centralized text management system implemented to prevent random placeholder text issues in the Kan application.

## Problem

Previously, the application had issues where random UIDs (like "66hfw1", "6kAJmr", "PKgzhO") were appearing in the UI instead of meaningful text. This occurred due to:

1. **Workspace slugs** being set to random UIDs instead of proper slugs
2. **Board slugs** in imports being set to random UIDs
3. **Placeholder text** with `PLACEHOLDER_` prefixes being displayed
4. **Missing fallback text** for empty or null values

## Solution

### 1. Centralized Text Constants

All default text values are now defined in `packages/shared/src/constants/text.ts`:

```typescript
import { DEFAULT_TEXT, getSafeDisplayText } from "@kan/shared/constants";

// Usage example
const displayName = getSafeDisplayText(workspace.name, DEFAULT_TEXT.WORKSPACE.DEFAULT_NAME);
```

### 2. Safe Display Text Functions

The `getSafeDisplayText()` function prevents random UIDs from being displayed:

- Detects 12-character alphanumeric strings (UID pattern)
- Identifies placeholder text patterns
- Provides meaningful fallbacks
- Handles null/undefined values gracefully

### 3. Data Validation Utilities

Located in `packages/api/src/utils/dataValidation.ts`:

- `validateWorkspaceName()` - Ensures workspace names are meaningful
- `validateBoardName()` - Ensures board names are meaningful
- `validateCardTitle()` - Ensures card titles are meaningful
- `hasCorruptedTextData()` - Detects corrupted data
- `generateDataQualityReport()` - Analyzes data quality

### 4. Automatic Data Cleanup

A cleanup script is available to fix existing corrupted data:

```bash
# Dry run to see what would be fixed
pnpm db:fix-placeholder-text:dry-run

# Actually fix the data
pnpm db:fix-placeholder-text

# Fix only specific entity types
pnpm tsx scripts/fix-placeholder-text.ts --entity=workspace
pnpm tsx scripts/fix-placeholder-text.ts --entity=board
```

## Implementation Guidelines

### For Frontend Components

Always use `getSafeDisplayText()` when displaying user-generated content:

```typescript
import { DEFAULT_TEXT, getSafeDisplayText } from "@kan/shared/constants";

// ✅ Good
<h1>{getSafeDisplayText(board.name, DEFAULT_TEXT.BOARD.DEFAULT_NAME)}</h1>

// ❌ Bad
<h1>{board.name || "Untitled"}</h1>
```

### For API Endpoints

Use proper slug generation instead of UIDs:

```typescript
import { generateSlug, generateUID } from "@kan/shared/utils";

// ✅ Good
let slug = generateSlug(input.name);
if (!isSlugUnique) {
  slug = `${slug}-${generateUID()}`;
}

// ❌ Bad
const slug = generateUID();
```

### For Database Operations

Validate text data before saving:

```typescript
import { validateWorkspaceName } from "../utils/dataValidation";

const workspace = await workspaceRepo.create(db, {
  name: validateWorkspaceName(input.name),
  // ... other fields
});
```

## Text Constants Reference

### Workspace
- `DEFAULT_TEXT.WORKSPACE.DEFAULT_NAME` - "My Workspace"
- `DEFAULT_TEXT.WORKSPACE.UNTITLED` - "Untitled Workspace"
- `DEFAULT_TEXT.WORKSPACE.LOADING` - "Loading workspace..."

### Board
- `DEFAULT_TEXT.BOARD.DEFAULT_NAME` - "My Board"
- `DEFAULT_TEXT.BOARD.UNTITLED` - "Untitled Board"
- `DEFAULT_TEXT.BOARD.LOADING` - "Loading board..."

### List
- `DEFAULT_TEXT.LIST.DEFAULT_NAME` - "New List"
- `DEFAULT_TEXT.LIST.ADD_CARD` - "Add a card"

### Card
- `DEFAULT_TEXT.CARD.DEFAULT_TITLE` - "New Card"
- `DEFAULT_TEXT.CARD.PLACEHOLDER_DESCRIPTION` - "Add description..."

### Common
- `DEFAULT_TEXT.COMMON.LOADING` - "Loading..."
- `DEFAULT_TEXT.COMMON.ERROR` - "Something went wrong"
- `DEFAULT_TEXT.COMMON.NOT_FOUND` - "Not found"

## Validation Functions

### `isLikelyUID(text: string): boolean`
Checks if a string matches the UID pattern (12 alphanumeric characters).

### `isPlaceholderText(text: string): boolean`
Checks if a string contains placeholder patterns like "PLACEHOLDER_", "lorem ipsum", etc.

### `generateSafeSlug(text: string, fallback?: string): string`
Generates URL-safe slugs while ensuring they're never random UIDs.

## Migration and Cleanup

### Running the Cleanup Script

The cleanup script can be run in different modes:

```bash
# Check all entities (dry run)
pnpm db:fix-placeholder-text:dry-run

# Fix all entities
pnpm db:fix-placeholder-text

# Fix specific entity type
pnpm tsx scripts/fix-placeholder-text.ts --entity=workspace --dry-run
pnpm tsx scripts/fix-placeholder-text.ts --entity=board
```

### What Gets Fixed

The script identifies and fixes:
- Workspace names that are UIDs
- Board names that are UIDs
- List names that are UIDs
- Card titles that are UIDs
- Label names that are UIDs
- Any text starting with "PLACEHOLDER_"

### Example Output

```
🚀 Starting placeholder text cleanup...
🔍 Checking workspaces...
📊 Workspace Report:
   Total: 5
   Corrupted: 2
   Issues: 2

🔧 Issues found:
   - ws_123: name = "a1b2c3d4e5f6" (Likely UID used as display text)
   - ws_456: name = "PLACEHOLDER_xyz789" (Placeholder text detected)

🛠️  Fixing workspaces...
   ✅ Fixed workspace ws_123: "a1b2c3d4e5f6" → "My Workspace"
   ✅ Fixed workspace ws_456: "PLACEHOLDER_xyz789" → "My Workspace"
✨ Fixed 2 workspaces
```

## Prevention Measures

1. **Code Reviews**: Check for proper use of text constants
2. **Linting Rules**: Consider adding ESLint rules to detect hardcoded fallbacks
3. **Testing**: Include tests that verify text display functions
4. **Documentation**: Keep this guide updated with new text constants

## Best Practices

1. **Always use fallbacks**: Never display raw database values without validation
2. **Consistent naming**: Use the centralized constants for consistency
3. **Meaningful defaults**: Choose defaults that make sense in context
4. **Internationalization ready**: Structure supports future i18n implementation
5. **Performance**: `getSafeDisplayText()` is lightweight and can be used liberally

## Troubleshooting

### If random text still appears:

1. Check if the component is using `getSafeDisplayText()`
2. Verify the correct fallback constant is being used
3. Run the data cleanup script to fix database issues
4. Check for new code that might be generating UIDs as display text

### If the cleanup script fails:

1. Ensure `POSTGRES_URL` environment variable is set
2. Check database connectivity
3. Verify the database schema matches expectations
4. Run with `--dry-run` first to identify issues
