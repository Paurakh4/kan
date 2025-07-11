#!/usr/bin/env tsx

/**
 * Data cleanup script to fix placeholder text issues
 * This script identifies and fixes instances where random UIDs or placeholder text
 * are being used as display names in the database.
 * 
 * Usage:
 * pnpm tsx scripts/fix-placeholder-text.ts [--dry-run] [--entity=workspace|board|list|card|label]
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, isNotNull } from "drizzle-orm";

import { boards, workspaces, lists, cards, labels } from "@kan/db/schema";
import { 
  generateDataQualityReport, 
  fixCorruptedTextData, 
  hasCorruptedTextData,
  validateWorkspaceName,
  validateBoardName,
  validateListName,
  validateCardTitle,
  validateLabelName
} from "../packages/api/src/utils/dataValidation";

// Database connection
const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("❌ POSTGRES_URL environment variable is required");
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const entityFilter = args.find(arg => arg.startsWith('--entity='))?.split('=')[1];

async function fixWorkspaces() {
  console.log("🔍 Checking workspaces...");
  
  const workspaceRecords = await db.select().from(workspaces).where(isNotNull(workspaces.name));
  const report = generateDataQualityReport(workspaceRecords);
  
  console.log(`📊 Workspace Report:`);
  console.log(`   Total: ${report.totalRecords}`);
  console.log(`   Corrupted: ${report.corruptedRecords}`);
  console.log(`   Issues: ${report.issues.length}`);
  
  if (report.issues.length > 0) {
    console.log("\n🔧 Issues found:");
    report.issues.forEach(issue => {
      console.log(`   - ${issue.recordId}: ${issue.field} = "${issue.value}" (${issue.issue})`);
    });
    
    if (!isDryRun) {
      console.log("\n🛠️  Fixing workspaces...");
      let fixed = 0;
      
      for (const workspace of workspaceRecords) {
        if (hasCorruptedTextData(workspace)) {
          const fixedName = validateWorkspaceName(workspace.name);
          if (fixedName !== workspace.name) {
            await db.update(workspaces)
              .set({ name: fixedName })
              .where(eq(workspaces.id, workspace.id));
            console.log(`   ✅ Fixed workspace ${workspace.id}: "${workspace.name}" → "${fixedName}"`);
            fixed++;
          }
        }
      }
      
      console.log(`✨ Fixed ${fixed} workspaces`);
    }
  } else {
    console.log("✅ No workspace issues found");
  }
}

async function fixBoards() {
  console.log("\n🔍 Checking boards...");
  
  const boardRecords = await db.select().from(boards).where(isNotNull(boards.name));
  const report = generateDataQualityReport(boardRecords);
  
  console.log(`📊 Board Report:`);
  console.log(`   Total: ${report.totalRecords}`);
  console.log(`   Corrupted: ${report.corruptedRecords}`);
  console.log(`   Issues: ${report.issues.length}`);
  
  if (report.issues.length > 0) {
    console.log("\n🔧 Issues found:");
    report.issues.forEach(issue => {
      console.log(`   - ${issue.recordId}: ${issue.field} = "${issue.value}" (${issue.issue})`);
    });
    
    if (!isDryRun) {
      console.log("\n🛠️  Fixing boards...");
      let fixed = 0;
      
      for (const board of boardRecords) {
        if (hasCorruptedTextData(board)) {
          const fixedName = validateBoardName(board.name);
          if (fixedName !== board.name) {
            await db.update(boards)
              .set({ name: fixedName })
              .where(eq(boards.id, board.id));
            console.log(`   ✅ Fixed board ${board.id}: "${board.name}" → "${fixedName}"`);
            fixed++;
          }
        }
      }
      
      console.log(`✨ Fixed ${fixed} boards`);
    }
  } else {
    console.log("✅ No board issues found");
  }
}

async function fixLists() {
  console.log("\n🔍 Checking lists...");
  
  const listRecords = await db.select().from(lists).where(isNotNull(lists.name));
  const report = generateDataQualityReport(listRecords);
  
  console.log(`📊 List Report:`);
  console.log(`   Total: ${report.totalRecords}`);
  console.log(`   Corrupted: ${report.corruptedRecords}`);
  console.log(`   Issues: ${report.issues.length}`);
  
  if (report.issues.length > 0) {
    console.log("\n🔧 Issues found:");
    report.issues.forEach(issue => {
      console.log(`   - ${issue.recordId}: ${issue.field} = "${issue.value}" (${issue.issue})`);
    });
    
    if (!isDryRun) {
      console.log("\n🛠️  Fixing lists...");
      let fixed = 0;
      
      for (const list of listRecords) {
        if (hasCorruptedTextData(list)) {
          const fixedName = validateListName(list.name);
          if (fixedName !== list.name) {
            await db.update(lists)
              .set({ name: fixedName })
              .where(eq(lists.id, list.id));
            console.log(`   ✅ Fixed list ${list.id}: "${list.name}" → "${fixedName}"`);
            fixed++;
          }
        }
      }
      
      console.log(`✨ Fixed ${fixed} lists`);
    }
  } else {
    console.log("✅ No list issues found");
  }
}

async function fixCards() {
  console.log("\n🔍 Checking cards...");
  
  const cardRecords = await db.select().from(cards).where(isNotNull(cards.title));
  const report = generateDataQualityReport(cardRecords);
  
  console.log(`📊 Card Report:`);
  console.log(`   Total: ${report.totalRecords}`);
  console.log(`   Corrupted: ${report.corruptedRecords}`);
  console.log(`   Issues: ${report.issues.length}`);
  
  if (report.issues.length > 0) {
    console.log("\n🔧 Issues found:");
    report.issues.forEach(issue => {
      console.log(`   - ${issue.recordId}: ${issue.field} = "${issue.value}" (${issue.issue})`);
    });
    
    if (!isDryRun) {
      console.log("\n🛠️  Fixing cards...");
      let fixed = 0;
      
      for (const card of cardRecords) {
        if (hasCorruptedTextData(card)) {
          const fixedTitle = validateCardTitle(card.title);
          if (fixedTitle !== card.title) {
            await db.update(cards)
              .set({ title: fixedTitle })
              .where(eq(cards.id, card.id));
            console.log(`   ✅ Fixed card ${card.id}: "${card.title}" → "${fixedTitle}"`);
            fixed++;
          }
        }
      }
      
      console.log(`✨ Fixed ${fixed} cards`);
    }
  } else {
    console.log("✅ No card issues found");
  }
}

async function fixLabels() {
  console.log("\n🔍 Checking labels...");
  
  const labelRecords = await db.select().from(labels).where(isNotNull(labels.name));
  const report = generateDataQualityReport(labelRecords);
  
  console.log(`📊 Label Report:`);
  console.log(`   Total: ${report.totalRecords}`);
  console.log(`   Corrupted: ${report.corruptedRecords}`);
  console.log(`   Issues: ${report.issues.length}`);
  
  if (report.issues.length > 0) {
    console.log("\n🔧 Issues found:");
    report.issues.forEach(issue => {
      console.log(`   - ${issue.recordId}: ${issue.field} = "${issue.value}" (${issue.issue})`);
    });
    
    if (!isDryRun) {
      console.log("\n🛠️  Fixing labels...");
      let fixed = 0;
      
      for (const label of labelRecords) {
        if (hasCorruptedTextData(label)) {
          const fixedName = validateLabelName(label.name);
          if (fixedName !== label.name) {
            await db.update(labels)
              .set({ name: fixedName })
              .where(eq(labels.id, label.id));
            console.log(`   ✅ Fixed label ${label.id}: "${label.name}" → "${fixedName}"`);
            fixed++;
          }
        }
      }
      
      console.log(`✨ Fixed ${fixed} labels`);
    }
  } else {
    console.log("✅ No label issues found");
  }
}

async function main() {
  console.log("🚀 Starting placeholder text cleanup...");
  
  if (isDryRun) {
    console.log("🔍 DRY RUN MODE - No changes will be made");
  }
  
  if (entityFilter) {
    console.log(`🎯 Filtering to entity type: ${entityFilter}`);
  }
  
  try {
    if (!entityFilter || entityFilter === 'workspace') {
      await fixWorkspaces();
    }
    
    if (!entityFilter || entityFilter === 'board') {
      await fixBoards();
    }
    
    if (!entityFilter || entityFilter === 'list') {
      await fixLists();
    }
    
    if (!entityFilter || entityFilter === 'card') {
      await fixCards();
    }
    
    if (!entityFilter || entityFilter === 'label') {
      await fixLabels();
    }
    
    console.log("\n✅ Cleanup completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the script
main().catch(console.error);
