1. Introduction & Problem Statement
1.1. Problem

While our AI can successfully generate an initial project plan, users often face a "blank page" problem when starting an individual task. They know what the task is (e.g., "Write a blog post announcing the new feature"), but struggle with how to effectively instruct an AI to get the best possible result. Crafting a high-quality prompt requires context, clarity, and an understanding of how to guide the AI, a skill known as prompt engineering. This friction point can slow down task completion and diminish the value of having an AI assistant.

1.2. Proposed Solution

The "AI-Assisted Task Prompt Generation" feature will act as a user's personal prompt engineer. By analyzing the context of the entire project and the specifics of a single Kanban card, the system will generate a detailed, high-quality prompt tailored to that task. This equips the user with a powerful starting point, enabling them to leverage external or internal AI tools with maximum efficiency and achieve superior results.

2. Goals & Objectives
Primary Goal: To accelerate the completion of individual tasks by providing users with expert-level, context-aware AI prompts.

Secondary Goals:

Deepen the AI integration into the core user workflow, making the tool an indispensable assistant.

Improve the quality and consistency of work produced for tasks on a board.

Reduce the cognitive load on users, allowing them to focus on outcomes rather than on the mechanics of AI interaction.

3. Target Audience
Primary: All active users working on tasks within a Kanban board. This feature is for anyone who wants to use AI to help them write, code, design, or plan the specifics of their work.

4. User Stories & Requirements
As a user, when I'm looking at a specific task on a card, I want to... click a button to instantly generate an expert-level prompt, so that I can... get a head start on completing that task with AI assistance.

As a user, I want... the generated prompt to be highly relevant by using the overall project idea and the card's details as context, so that... the AI's output is perfectly aligned with my goals.

As a user, I want to... easily copy the generated prompt to my clipboard, so that I can... use it in any other application or AI tool I prefer.

As a user, I want to... I can easily regenerate the output if I don't like it.

As a user, I want to… have the option to add additional notes to guide or instruct the AI when needed, ensuring this feature remains optional.

As a user, I want... this feature to be seamlessly integrated into the card details view, so that... it feels like a natural part of my workflow without being intrusive.

As a user, I want... would like to 

5. Feature Scope & Detailed Implementation Plan
This feature will be implemented in two main phases: the frontend user experience and the backend contextual analysis and generation logic.

Phase 1: Frontend UI/UX
The user interface must be intuitive, non-disruptive, and immediately useful.

Entry Point in the Card View:

Location: Within the card details modal (which opens when a user clicks on a card from the board).

UI Element: An "AI" or "magic wand" icon button will be placed prominently but unobtrusively, likely near the card's title or description.

Prompt Generation Modal:

Trigger: Clicking the "Generate Prompt" icon will open a new, dedicated compact modal.

Initial State (Loading): Upon opening, the modal will immediately display a loading state (e.g., a spinner with text like "Analyzing task context..." or "Crafting your prompt..."). This manages user expectations and provides instant feedback. It would be ideal if the generated text could appear in real-time/streaming.

Success State (Display):

Once the prompt is generated, the loading indicator will be replaced by the prompt's content.

The prompt will be displayed within a read-only textarea to allow for easy reading and scrolling.

The modal will have two primary actions:

"Copy Prompt" icon Button: A clearly labeled button that copies the entire prompt text to the user's clipboard and provides visual feedback (e.g., changing to "Copied!").

"Close" Button: To dismiss the modal.

Error State: If the backend fails to generate a prompt, the modal will display a user-friendly error message (e.g., "Could not generate a prompt at this time. Please try again.") with a "Close" button.

The generated output must support Markdown formatting.

After regeneration, User should be able to switch back and forth between the new and old prompts.

Phase 2: Backend API & AI Logic
The backend is responsible for gathering context and performing the sophisticated prompt engineering.

New API Endpoint:

A new procedure will be added to the packages/api/src/routers/ai.ts router, named generateTaskPrompt.

Input: It will accept a cardId as its primary parameter.

Context Aggregation:

When the generateTaskPrompt endpoint is called, it will query the database to gather a rich set of contextual information:

Card Details: The title and full description of the card specified by cardId.

Board Details: The name of the board the card belongs to.

(Crucial) Project Idea: The original "Project Idea" text that was used to generate the entire board. This must be stored and associated with the board in the database during the initial plan generation.

Meta-Prompt Engineering (Prompt-for-a-Prompt):

The core of this feature is constructing a "meta-prompt" to instruct the AI. This prompt will not ask the AI to do the task, but to create the best possible prompt for another AI to do the task.

Example Meta-Prompt Structure:

You are an expert-level Prompt Engineer. Your goal is to create a detailed, effective prompt for a user to give to a separate AI assistant to complete a specific task.

**Overall Project Context:**
The main goal of this project is: "[Insert Board's original 'Project Idea' here]"

**Specific Task Details:**
The user needs to complete a task with the following title and description:
- Title: "[Insert Card Title here]"
- Description: "[Insert Card Description here]"

**Your Instructions:**
Based on all the context provided, generate a comprehensive, ready-to-use prompt for the user. The prompt should:
1. Clearly define the persona or role the AI assistant should adopt (e.g., "Act as a senior copywriter...").
2. State the primary goal of the task.
3. Include all relevant context from the project idea and task description.
4. Specify the desired format, tone, and length of the output.
5. Provide clear, step-by-step instructions if the task is complex.

Respond ONLY with the text of the generated prompt, without any additional commentary or conversational text.

Execution and Response:

The backend sends this meta-prompt to the configured AI model via the OpenRouter API.

The text response from the AI is then sent back to the frontend to be displayed in the modal.

6. Success Metrics
Feature Adoption: Track the number of unique users who click the "Generate Prompt" button.

Engagement: Measure the total number of prompts generated and the average number of prompts generated per user.

Utility Rate: Calculate the percentage of generated prompts that are copied using the "Copy Prompt" button. A high rate indicates high utility.

Qualitative Feedback: Collect user feedback on the quality and usefulness of the generated prompts.

7. Future Enhancements (Out of Scope for V1)
Prompt Customization: Allow users to select a "persona" (e.g., Developer, Marketer, Designer) or "output format" (e.g., Email, Blog Post, Code Snippet) to further tailor the generated prompt.

In-App Execution: Integrate an AI model directly within the app to execute the generated prompt and display the results, creating a complete, in-app workflow.

Iterative Refinement: Allow users to provide feedback on a generated prompt ("This was helpful," "This wasn't helpful") to improve future suggestions.