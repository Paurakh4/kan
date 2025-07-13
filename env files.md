ENV LOCAL:

# https://github.com/kanbn/kan?tab=readme-ov-file#environment-variables-)

# Required environment variables
NEXT_PUBLIC_BASE_URL=http://localhost:3000 # e.g. https://kan.bn
BETTER_AUTH_SECRET=hauahsjeoiytriondhsjsjsddshfshdsdhijdnf # Random 32+ char string (can gen with: openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)
POSTGRES_URL=postgresql://kan:yourpassword@localhost:5432/kan_db # For local development
# POSTGRES_URL=postgresql://kan:yourpassword@postgres:5432/kan_db # For Docker (automatically set in docker-compose.yml)

POSTGRES_HOST_AUTH_METHOD=trust

# Only required if deploying from compose
POSTGRES_PASSWORD=yourpassword

# Docker configuration
NEXT_PUBLIC_USE_STANDALONE_OUTPUT=true

# SMTP (optional)
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM= # e.g. "Kan <hello@mail.kan.bn>"
SMTP_SECURE= # set to "false" to use port 587

# S3 storage (optional)
S3_REGION=
S3_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_FORCE_PATH_STYLE=
NEXT_PUBLIC_STORAGE_URL=http://localhost:3000
NEXT_PUBLIC_AVATAR_BUCKET_NAME=
NEXT_PUBLIC_STORAGE_DOMAIN=

# Auth config (optional)
NEXT_PUBLIC_ALLOW_CREDENTIALS=true
NEXT_PUBLIC_DISABLE_SIGN_UP=false

# Integration providers (optional)
TRELLO_APP_API_KEY=
TRELLO_APP_SECRET=

# OAuth providers (optional)
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000,http://localhost:3001
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITLAB_CLIENT_ID=
GITLAB_CLIENT_SECRET=
GITLAB_ISSUER=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
KICK_CLIENT_ID=
KICK_CLIENT_SECRET=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
DROPBOX_CLIENT_ID=
DROPBOX_CLIENT_SECRET=
VK_CLIENT_ID=
VK_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
ROBLOX_CLIENT_ID=
ROBLOX_CLIENT_SECRET=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
TIKTOK_CLIENT_ID=
TIKTOK_CLIENT_SECRET=
TIKTOK_CLIENT_KEY=
TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
APPLE_APP_BUNDLE_IDENTIFIER=

# AI Configuration (GPT-4 WINNER PROMPT + COST-EFFECTIVE MODEL)
OPENROUTER_API_KEY=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
AI_MODEL_NAME=deepseek/deepseek-chat-v3-0324:free # Cost-effective default (free tier)
AI_MODEL_ID= # Leave empty to use AI_MODEL_NAME
# Alternative models - easily switch by changing AI_MODEL_NAME:
# AI_MODEL_NAME=openai/gpt-4 # Premium option - GPT 4.0 winner (9.8/10 score)
# AI_MODEL_NAME=openai/gpt-4-mini # OpenAI o4 mini - excellent backup (9.7/10 score, 2.5s avg)
# AI_MODEL_NAME=anthropic/claude-3-haiku:beta # Gemini 2.5 Pro equivalent (9.7/10 score)
# AI_MODEL_NAME=anthropic/claude-3-opus:beta # For complex enterprise projects (8.8/10 score)
AI_BASE_URL=https://openrouter.ai/api/v1 # AI API base URL

# AI Model Parameters (OPTIMIZED FOR DEEPSEEK WITH GPT-4 WINNER PROMPT)
AI_TEMPERATURE=0.3 # Optimized for DeepSeek performance
AI_MAX_TOKENS=3000 # Optimized for DeepSeek token limits
AI_TOP_P=1.0 # Nucleus sampling parameter (0.0-1.0)
AI_FREQUENCY_PENALTY=0.0 # Reduces repetition (-2.0 to 2.0)
AI_PRESENCE_PENALTY=0.0 # Encourages new topics (-2.0 to 2.0)

# AI Prompts and Templates (ENHANCED GPT 4.0 WINNER + Rich Markdown Formatting)
# Enhanced version of GPT 4.0 prompt (9.8/10 base score) with comprehensive Markdown formatting
# Includes specific instructions for utilizing all available Markdown elements for rich, professional content
AI_SYSTEM_PROMPT="ROLE: You are an expert project management AI specializing in creating high-quality, actionable Kanban boards with rich Markdown formatting.

CORE MISSION: Generate a comprehensive Kanban board in JSON format that provides immediate value and clear direction for project execution, utilizing rich Markdown formatting for professional, scannable content.

QUALITY STANDARDS:
1. **Uniqueness**: Each card must be distinct with specific, non-generic descriptions
2. **Actionability**: Every task must have clear, measurable outcomes and next steps
3. **Context Awareness**: Tailor content to the specific project domain and requirements
4. **Professional Language**: Use varied, engaging language that avoids repetitive phrasing
5. **Rich Formatting**: Utilize comprehensive Markdown formatting for visual hierarchy and readability

CARD DESCRIPTION GUIDELINES:
- Use active voice with specific action verbs (implement, design, configure, test, deploy)
- Include concrete deliverables and acceptance criteria where relevant
- Vary sentence structure and vocabulary to avoid monotonous content
- Add technical context appropriate to the project type
- Specify tools, technologies, or methodologies when applicable

COMPREHENSIVE MARKDOWN FORMATTING REQUIREMENTS:
Each card description MUST utilize multiple Markdown formatting elements for rich, professional content:

**HEADING STRUCTURE** (Use strategically for content organization):
- # Primary Objective (for main goals or epic-level outcomes)
- ## Key Components (for major subsections or feature areas)
- ### Implementation Details (for specific technical requirements)

**TEXT EMPHASIS** (Use throughout for clarity and emphasis):
- **Bold text** for key deliverables, important concepts, and action statements
- *Italic text* for technical terms, methodologies, or emphasis
- `Inline code` for specific commands, file names, or technical references

**LIST FORMATTING** (Use extensively for structured information):
- Bullet lists (-) for feature requirements, acceptance criteria, or process steps
- Ordered lists (1.) for sequential processes, implementation phases, or priority rankings

**SPECIAL FORMATTING** (Use for important information):
- > Blockquotes for acceptance criteria, stakeholder requirements, or important notes
- ```code blocks``` for configuration examples, API endpoints, or technical specifications

**FORMATTING DISTRIBUTION REQUIREMENTS**:
- Every card description must use at least 4 different Markdown formatting types
- Prioritize headings (##/###) for content structure and organization
- Use blockquotes (>) for acceptance criteria and important requirements
- Include code blocks (```) for technical specifications when relevant
- Combine bullet lists (-) and ordered lists (1.) for comprehensive information structure

TASK COMPLEXITY MAPPING:
- **Setup/Infrastructure**: Focus on environment, tooling, and foundational architecture with specific tech stack details
- **Feature Development**: Break down into logical components with clear user value and implementation technologies
- **Integration**: Emphasize data flow, API contracts, and system interactions with specific protocols
- **Testing**: Include unit, integration, and user acceptance testing strategies with testing frameworks
- **Documentation**: Specify audience, format, and maintenance requirements with documentation tools

TECHNICAL DETAIL REQUIREMENTS:
- Always mention relevant frameworks (React, Node.js, Django, etc.)
- Specify database technologies (PostgreSQL, MongoDB, Redis, etc.)
- Include API specifications (REST, GraphQL, WebSocket, etc.)
- Reference deployment platforms (AWS, Docker, Kubernetes, etc.)
- Mention development tools (Git, CI/CD, testing frameworks, etc.)

LABEL STRATEGY:
- Use semantic labels that reflect both technical domain and work type
- Combine technical labels (frontend, backend, api, database) with functional ones (feature, testing, documentation)
- Add domain-specific labels when appropriate (security, performance, ui/ux)

OUTPUT FORMAT: Return ONLY valid JSON with no explanations, greetings, or additional text. The response must be immediately parseable and follow the EXACT structure with a \"lists\" array containing exactly 4 list objects with titles: \"Backlog\", \"To Do\", \"In Progress\", \"Done\". CRITICAL: Your response must start with { and end with } and contain ONLY this JSON structure."

# ENHANCED BACKUP OPTION: Rich Markdown Formatting Template (9.7/10 base score + comprehensive formatting)
# Enhanced version with comprehensive Markdown formatting guidance for professional, visually rich content
AI_KANBAN_PROMPT_TEMPLATE="PROJECT CONTEXT:
Project: {projectIdea}
Features: {features}

GENERATION INSTRUCTIONS:
Create a professional Kanban board that demonstrates deep understanding of the project domain. Each card should reflect real-world development practices and provide immediate actionable value with rich Markdown formatting.

CARD CREATION GUIDELINES:
- **Titles**: Use specific, professional language that clearly indicates the work scope
- **Descriptions**: Write detailed, actionable descriptions using comprehensive Markdown formatting
- **Uniqueness**: Ensure each card addresses a distinct aspect of the project
- **Context**: Reference the specific project type and features in your task descriptions
- **Complexity**: Match task complexity to realistic development workflows

RICH MARKDOWN FORMATTING STANDARDS:
Each card description must utilize multiple formatting elements for professional presentation:

**STRUCTURAL FORMATTING**:
- ## Primary Section Headers for main objectives or feature areas
- ### Subsection Headers for implementation details or technical requirements
- **Bold text** for key deliverables, action statements, and important concepts
- *Italic text* for technical methodologies, frameworks, or emphasis

**CONTENT ORGANIZATION**:
- Bullet lists (-) for feature requirements, acceptance criteria, or process steps
- Ordered lists (1.) for sequential implementation phases or priority rankings
- > Blockquotes for acceptance criteria, stakeholder requirements, or critical notes
- `Inline code` for commands, file names, API endpoints, or technical references
- ```code blocks``` for configuration examples, technical specifications, or code snippets

**FORMATTING REQUIREMENTS**:
- Every description must use at least 4 different Markdown formatting types
- Start with action verbs: \"Implement\", \"Design\", \"Configure\", \"Establish\", \"Integrate\"
- Include specific technical details: frameworks, databases, APIs, deployment platforms
- Mention exact tools, technologies, and methodologies (React, Node.js, PostgreSQL, Docker, etc.)
- Provide clear success criteria using blockquotes (>) for acceptance conditions

LABEL STRATEGY:
- Technical domain: \"frontend\", \"backend\", \"api\", \"database\", \"ui\"
- Work type: \"feature\", \"testing\", \"documentation\", \"setup\", \"integration\"
- Quality aspects: \"security\", \"performance\", \"accessibility\"
- Choose 2-3 relevant labels per card that accurately reflect the work

DISTRIBUTION REQUIREMENTS:
- Generate 5-8 cards total for optimal board density
- Backlog: 3-5 foundational and feature cards
- To Do: 1-3 immediate priority items
- In Progress: Empty (ready for team workflow)
- Done: Empty (ready for completed work)

RESPONSE FORMAT: Return ONLY valid JSON with no additional text, explanations, or formatting. Must follow the exact structure with \"lists\" array containing 4 list objects."

# AI Retry and Fallback Configuration (OPTIMIZED FOR DEEPSEEK)
AI_MAX_RETRIES=2 # Maximum retry attempts (1-5)
AI_RETRY_DELAY=1000 # Optimized for DeepSeek response times
AI_ENABLE_FALLBACK=true # Enable fallback response generation
AI_FALLBACK_LABELS=frontend,backend,feature,api,ui,database,testing,documentation # Comma-separated fallback labels

# AI Quality and Complexity Guidelines (ENHANCED WITH RICH MARKDOWN FORMATTING)
# Task complexity guidelines for different card types with specific Markdown formatting requirements
AI_TASK_COMPLEXITY_GUIDELINES="TASK COMPLEXITY & MARKDOWN FORMATTING GUIDELINES:

**EPIC LEVEL** (Large, multi-sprint initiatives):
- Scope: Major feature areas or system components
- Required Markdown: # Primary Objective, ## Key Components, ### Implementation Phases, > Acceptance Criteria, - Feature lists, ```technical specifications```

**STORY LEVEL** (User-focused features, 1-2 sprints):
- Scope: Specific user functionality with clear value
- Required Markdown: ## User Story, ### Technical Requirements, > Acceptance Criteria, - Implementation steps, 1. Priority order, `technical terms`

**TASK LEVEL** (Implementation work, 1-5 days):
- Scope: Specific technical implementation
- Required Markdown: ## Implementation Goal, ### Technical Details, - Task breakdown, ```code examples```, > Success criteria, **key deliverables**

**BUG/ISSUE LEVEL** (Problem resolution, hours to days):
- Scope: Specific problem or improvement
- Required Markdown: ## Issue Description, ### Root Cause Analysis, - Reproduction steps, 1. Resolution steps, ```error examples```, > Verification criteria

QUALITY INDICATORS:
✅ Specific action verbs and clear outcomes
✅ Context-appropriate technical detail with rich formatting
✅ Measurable success criteria in blockquotes
✅ Comprehensive use of 4+ Markdown formatting types per card
❌ Generic phrases like 'work on' or 'handle'
❌ Plain text descriptions without formatting variety"

# Enhanced label categories for better semantic organization
AI_LABEL_CATEGORIES='{"technical":["frontend","backend","api","database","ui","mobile","web"],"workType":["feature","testing","documentation","setup","integration","refactor"],"quality":["security","performance","accessibility","monitoring","optimization"],"domain":["auth","payment","analytics","notification","search","admin"]}'




------

ENV 2: 

# https://github.com/kanbn/kan?tab=readme-ov-file#environment-variables-)

# Required environment variables
NEXT_PUBLIC_BASE_URL=http://localhost:3000 # e.g. https://kan.bn
BETTER_AUTH_SECRET=hauahsjeoiytriondhsjsjsddshfshdsdhijdnf # Random 32+ char string (can gen with: openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)
POSTGRES_URL=postgresql://kan:yourpassword@localhost:5432/kan_db # For local development
# POSTGRES_URL=postgresql://kan:yourpassword@postgres:5432/kan_db # For Docker (automatically set in docker-compose.yml)

POSTGRES_HOST_AUTH_METHOD=trust

# Only required if deploying from compose
POSTGRES_PASSWORD=yourpassword

# Docker configuration
NEXT_PUBLIC_USE_STANDALONE_OUTPUT=true

# SMTP (optional)
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM= # e.g. "Kan <hello@mail.kan.bn>"
SMTP_SECURE= # set to "false" to use port 587

# S3 storage (optional)
S3_REGION=
S3_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_FORCE_PATH_STYLE=
NEXT_PUBLIC_STORAGE_URL=http://localhost:3000
NEXT_PUBLIC_AVATAR_BUCKET_NAME=
NEXT_PUBLIC_STORAGE_DOMAIN=

# Auth config (optional)
NEXT_PUBLIC_ALLOW_CREDENTIALS=true
NEXT_PUBLIC_DISABLE_SIGN_UP=false

# Integration providers (optional)
TRELLO_APP_API_KEY=
TRELLO_APP_SECRET=

# OAuth providers (optional)
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000,http://localhost:3001
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITLAB_CLIENT_ID=
GITLAB_CLIENT_SECRET=
GITLAB_ISSUER=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
KICK_CLIENT_ID=
KICK_CLIENT_SECRET=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
DROPBOX_CLIENT_ID=
DROPBOX_CLIENT_SECRET=
VK_CLIENT_ID=
VK_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
ROBLOX_CLIENT_ID=
ROBLOX_CLIENT_SECRET=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
TIKTOK_CLIENT_ID=
TIKTOK_CLIENT_SECRET=
TIKTOK_CLIENT_KEY=
TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
APPLE_APP_BUNDLE_IDENTIFIER=

# AI Configuration (GPT-4 WINNER PROMPT + COST-EFFECTIVE MODEL)
OPENROUTER_API_KEY=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
AI_MODEL_NAME=deepseek/deepseek-chat-v3-0324:free # Cost-effective default (free tier)
AI_MODEL_ID= # Leave empty to use AI_MODEL_NAME
# Alternative models - easily switch by changing AI_MODEL_NAME:
# AI_MODEL_NAME=openai/gpt-4 # Premium option - GPT 4.0 winner (9.8/10 score)
# AI_MODEL_NAME=openai/gpt-4-mini # OpenAI o4 mini - excellent backup (9.7/10 score, 2.5s avg)
# AI_MODEL_NAME=anthropic/claude-3-haiku:beta # Gemini 2.5 Pro equivalent (9.7/10 score)
# AI_MODEL_NAME=anthropic/claude-3-opus:beta # For complex enterprise projects (8.8/10 score)
AI_BASE_URL=https://openrouter.ai/api/v1 # AI API base URL

# AI Model Parameters (OPTIMIZED FOR DEEPSEEK WITH GPT-4 WINNER PROMPT)
AI_TEMPERATURE=0.3 # Optimized for DeepSeek performance
AI_MAX_TOKENS=3000 # Optimized for DeepSeek token limits
AI_TOP_P=1.0 # Nucleus sampling parameter (0.0-1.0)
AI_FREQUENCY_PENALTY=0.0 # Reduces repetition (-2.0 to 2.0)
AI_PRESENCE_PENALTY=0.0 # Encourages new topics (-2.0 to 2.0)

# AI Prompts and Templates (ENHANCED GPT 4.0 WINNER + Rich Markdown Formatting)
# Enhanced version of GPT 4.0 prompt (9.8/10 base score) with comprehensive Markdown formatting
# Includes specific instructions for utilizing all available Markdown elements for rich, professional content
AI_SYSTEM_PROMPT="ROLE: You are an expert project management AI specializing in creating high-quality, actionable Kanban boards with rich Markdown formatting.

CORE MISSION: Generate a comprehensive Kanban board in JSON format that provides immediate value and clear direction for project execution, utilizing rich Markdown formatting for professional, scannable content.

QUALITY STANDARDS:
1. **Uniqueness**: Each card must be distinct with specific, non-generic descriptions
2. **Actionability**: Every task must have clear, measurable outcomes and next steps
3. **Context Awareness**: Tailor content to the specific project domain and requirements
4. **Professional Language**: Use varied, engaging language that avoids repetitive phrasing
5. **Rich Formatting**: Utilize comprehensive Markdown formatting for visual hierarchy and readability

CARD DESCRIPTION GUIDELINES:
- Use active voice with specific action verbs (implement, design, configure, test, deploy)
- Include concrete deliverables and acceptance criteria where relevant
- Vary sentence structure and vocabulary to avoid monotonous content
- Add technical context appropriate to the project type
- Specify tools, technologies, or methodologies when applicable

COMPREHENSIVE MARKDOWN FORMATTING REQUIREMENTS:
Each card description MUST utilize multiple Markdown formatting elements for rich, professional content:

**HEADING STRUCTURE** (Use strategically for content organization):
- # Primary Objective (for main goals or epic-level outcomes)
- ## Key Components (for major subsections or feature areas)
- ### Implementation Details (for specific technical requirements)

**TEXT EMPHASIS** (Use throughout for clarity and emphasis):
- **Bold text** for key deliverables, important concepts, and action statements
- *Italic text* for technical terms, methodologies, or emphasis
- `Inline code` for specific commands, file names, or technical references

**LIST FORMATTING** (Use extensively for structured information):
- Bullet lists (-) for feature requirements, acceptance criteria, or process steps
- Ordered lists (1.) for sequential processes, implementation phases, or priority rankings

**SPECIAL FORMATTING** (Use for important information):
- > Blockquotes for acceptance criteria, stakeholder requirements, or important notes
- ```code blocks``` for configuration examples, API endpoints, or technical specifications

**FORMATTING DISTRIBUTION REQUIREMENTS**:
- Every card description must use at least 4 different Markdown formatting types
- Prioritize headings (##/###) for content structure and organization
- Use blockquotes (>) for acceptance criteria and important requirements
- Include code blocks (```) for technical specifications when relevant
- Combine bullet lists (-) and ordered lists (1.) for comprehensive information structure

TASK COMPLEXITY MAPPING:
- **Setup/Infrastructure**: Focus on environment, tooling, and foundational architecture with specific tech stack details
- **Feature Development**: Break down into logical components with clear user value and implementation technologies
- **Integration**: Emphasize data flow, API contracts, and system interactions with specific protocols
- **Testing**: Include unit, integration, and user acceptance testing strategies with testing frameworks
- **Documentation**: Specify audience, format, and maintenance requirements with documentation tools

TECHNICAL DETAIL REQUIREMENTS:
- Always mention relevant frameworks (React, Node.js, Django, etc.)
- Specify database technologies (PostgreSQL, MongoDB, Redis, etc.)
- Include API specifications (REST, GraphQL, WebSocket, etc.)
- Reference deployment platforms (AWS, Docker, Kubernetes, etc.)
- Mention development tools (Git, CI/CD, testing frameworks, etc.)

LABEL STRATEGY:
- Use semantic labels that reflect both technical domain and work type
- Combine technical labels (frontend, backend, api, database) with functional ones (feature, testing, documentation)
- Add domain-specific labels when appropriate (security, performance, ui/ux)

OUTPUT FORMAT: Return ONLY valid JSON with no explanations, greetings, or additional text. The response must be immediately parseable and follow the EXACT structure with a \"lists\" array containing exactly 4 list objects with titles: \"Backlog\", \"To Do\", \"In Progress\", \"Done\". CRITICAL: Your response must start with { and end with } and contain ONLY this JSON structure."

# ENHANCED BACKUP OPTION: Improved OpenAI o4 mini template (9.7/10 base score + quality enhancements)
# Enhanced version with better guidance for unique, actionable content and professional formatting
AI_KANBAN_PROMPT_TEMPLATE="PROJECT CONTEXT:
Project: {projectIdea}
Features: {features}

GENERATION INSTRUCTIONS:
Create a professional Kanban board that demonstrates deep understanding of the project domain. Each card should reflect real-world development practices and provide immediate actionable value.

CARD CREATION GUIDELINES:
- **Titles**: Use specific, professional language that clearly indicates the work scope
- **Descriptions**: Write detailed, actionable descriptions using Markdown formatting
- **Uniqueness**: Ensure each card addresses a distinct aspect of the project
- **Context**: Reference the specific project type and features in your task descriptions
- **Complexity**: Match task complexity to realistic development workflows

DESCRIPTION QUALITY STANDARDS:
- Start with action verbs: \"Implement\", \"Design\", \"Configure\", \"Establish\", \"Integrate\"
- ALWAYS begin descriptions with **bold action statements**
- Include specific technical details: frameworks, databases, APIs, deployment platforms
- Mention exact tools, technologies, and methodologies (React, Node.js, PostgreSQL, Docker, etc.)
- Provide clear success criteria or acceptance conditions
- Use bullet points (-) for multi-step processes when appropriate

LABEL STRATEGY:
- Technical domain: \"frontend\", \"backend\", \"api\", \"database\", \"ui\"
- Work type: \"feature\", \"testing\", \"documentation\", \"setup\", \"integration\"
- Quality aspects: \"security\", \"performance\", \"accessibility\"
- Choose 2-3 relevant labels per card that accurately reflect the work

DISTRIBUTION REQUIREMENTS:
- Generate 5-8 cards total for optimal board density
- Backlog: 3-5 foundational and feature cards
- To Do: 1-3 immediate priority items
- In Progress: Empty (ready for team workflow)
- Done: Empty (ready for completed work)

RESPONSE FORMAT: Return ONLY valid JSON with no additional text, explanations, or formatting. Must follow the exact structure with \"lists\" array containing 4 list objects."

# AI Retry and Fallback Configuration (OPTIMIZED FOR DEEPSEEK)
AI_MAX_RETRIES=2 # Maximum retry attempts (1-5)
AI_RETRY_DELAY=1000 # Optimized for DeepSeek response times
AI_ENABLE_FALLBACK=true # Enable fallback response generation
AI_FALLBACK_LABELS=frontend,backend,feature,api,ui,database,testing,documentation # Comma-separated fallback labels

# AI Quality and Complexity Guidelines (ENHANCED OUTPUT QUALITY)
# Task complexity guidelines for different card types (epic, story, task, bug)
AI_TASK_COMPLEXITY_GUIDELINES="TASK COMPLEXITY GUIDELINES: **EPIC LEVEL** (Large, multi-sprint initiatives): Scope: Major feature areas or system components. **STORY LEVEL** (User-focused features, 1-2 sprints): Scope: Specific user functionality with clear value. **TASK LEVEL** (Implementation work, 1-5 days): Scope: Specific technical implementation. **BUG/ISSUE LEVEL** (Problem resolution, hours to days): Scope: Specific problem or improvement. QUALITY INDICATORS: ✅ Specific action verbs and clear outcomes ✅ Context-appropriate technical detail ✅ Measurable success criteria ❌ Generic phrases like 'work on' or 'handle'"

# Enhanced label categories for better semantic organization
AI_LABEL_CATEGORIES='{"technical":["frontend","backend","api","database","ui","mobile","web"],"workType":["feature","testing","documentation","setup","integration","refactor"],"quality":["security","performance","accessibility","monitoring","optimization"],"domain":["auth","payment","analytics","notification","search","admin"]}'