-- Fix placeholder text issues in Docker database
-- This script identifies and fixes corrupted data where random UIDs are used as display text

BEGIN;

-- Show current problematic data
SELECT 'BEFORE FIXES - Workspaces with UID-like slugs or short names:' as status;
SELECT id, name, slug, 
       CASE 
         WHEN slug ~ '^[a-z0-9]{12}$' THEN 'UID_SLUG'
         WHEN length(name) <= 3 THEN 'SHORT_NAME'
         ELSE 'OK'
       END as issue_type
FROM workspace 
WHERE slug ~ '^[a-z0-9]{12}$' OR length(name) <= 3;

SELECT 'BEFORE FIXES - Boards with UID-like slugs or names:' as status;
SELECT id, name, slug,
       CASE 
         WHEN slug ~ '^[a-z0-9]{12}$' THEN 'UID_SLUG'
         WHEN name ~ '^[a-z0-9]{12}$' THEN 'UID_NAME'
         ELSE 'OK'
       END as issue_type
FROM board 
WHERE slug ~ '^[a-z0-9]{12}$' OR name ~ '^[a-z0-9]{12}$';

SELECT 'BEFORE FIXES - Cards with UID-like titles:' as status;
SELECT id, title,
       CASE 
         WHEN title ~ '^[a-z0-9]{12}$' THEN 'UID_TITLE'
         WHEN title LIKE 'PLACEHOLDER_%' THEN 'PLACEHOLDER'
         ELSE 'OK'
       END as issue_type
FROM card 
WHERE title ~ '^[a-z0-9]{12}$' OR title LIKE 'PLACEHOLDER_%';

SELECT 'BEFORE FIXES - Lists with UID-like names:' as status;
SELECT id, name,
       CASE 
         WHEN name ~ '^[a-z0-9]{12}$' THEN 'UID_NAME'
         WHEN name LIKE 'PLACEHOLDER_%' THEN 'PLACEHOLDER'
         ELSE 'OK'
       END as issue_type
FROM list 
WHERE name ~ '^[a-z0-9]{12}$' OR name LIKE 'PLACEHOLDER_%';

-- Fix workspace issues
UPDATE workspace 
SET name = 'My Workspace'
WHERE length(name) <= 3 OR name ~ '^[a-z0-9]{12}$';

UPDATE workspace 
SET slug = 'my-workspace'
WHERE slug ~ '^[a-z0-9]{12}$';

-- Fix board issues  
UPDATE board 
SET name = 'My Board'
WHERE name ~ '^[a-z0-9]{12}$';

UPDATE board 
SET slug = CASE 
  WHEN slug ~ '^[a-z0-9]{12}$' THEN 
    lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'))
  ELSE slug
END
WHERE slug ~ '^[a-z0-9]{12}$';

-- Fix card issues
UPDATE card 
SET title = 'New Card'
WHERE title ~ '^[a-z0-9]{12}$' OR title LIKE 'PLACEHOLDER_%';

-- Fix list issues
UPDATE list 
SET name = 'New List'
WHERE name ~ '^[a-z0-9]{12}$' OR name LIKE 'PLACEHOLDER_%';

-- Fix label issues if any
UPDATE label 
SET name = 'New Label'
WHERE name ~ '^[a-z0-9]{12}$' OR name LIKE 'PLACEHOLDER_%';

-- Show results after fixes
SELECT 'AFTER FIXES - Updated Workspaces:' as status;
SELECT id, name, slug FROM workspace;

SELECT 'AFTER FIXES - Updated Boards:' as status;
SELECT id, name, slug FROM board;

SELECT 'AFTER FIXES - Sample Cards:' as status;
SELECT id, title FROM card LIMIT 5;

SELECT 'AFTER FIXES - Sample Lists:' as status;
SELECT id, name FROM list LIMIT 5;

-- Show summary of changes
SELECT 'SUMMARY - Changes made:' as status;
SELECT 
  (SELECT COUNT(*) FROM workspace WHERE name = 'My Workspace') as workspaces_fixed,
  (SELECT COUNT(*) FROM workspace WHERE slug = 'my-workspace') as workspace_slugs_fixed,
  (SELECT COUNT(*) FROM board WHERE name = 'My Board') as boards_fixed,
  (SELECT COUNT(*) FROM card WHERE title = 'New Card') as cards_fixed,
  (SELECT COUNT(*) FROM list WHERE name = 'New List') as lists_fixed;

COMMIT;

-- Final verification
SELECT 'VERIFICATION - No more UID patterns should exist:' as status;
SELECT 
  'workspaces' as table_name,
  COUNT(*) as uid_like_records
FROM workspace 
WHERE slug ~ '^[a-z0-9]{12}$' OR name ~ '^[a-z0-9]{12}$'
UNION ALL
SELECT 
  'boards' as table_name,
  COUNT(*) as uid_like_records
FROM board 
WHERE slug ~ '^[a-z0-9]{12}$' OR name ~ '^[a-z0-9]{12}$'
UNION ALL
SELECT 
  'cards' as table_name,
  COUNT(*) as uid_like_records
FROM card 
WHERE title ~ '^[a-z0-9]{12}$' OR title LIKE 'PLACEHOLDER_%'
UNION ALL
SELECT 
  'lists' as table_name,
  COUNT(*) as uid_like_records
FROM list 
WHERE name ~ '^[a-z0-9]{12}$' OR name LIKE 'PLACEHOLDER_%';
