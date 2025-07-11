import { useState, useEffect } from "react";
import { t } from "@lingui/core/macro";
import { HiXMark, HiClipboard, HiSparkles, HiArrowPath } from "react-icons/hi2";

import Button from "~/components/Button";
import { useModal } from "~/providers/modal";
import { usePopup } from "~/providers/popup";
import { api } from "~/utils/api";

interface AIPromptModalProps {
  cardPublicId: string;
}

// Clean and filter AI-generated prompt content
function cleanAIPrompt(prompt: string): string {
  if (!prompt) return "";

  // Remove system-level instructions and meta-prompt content
  const systemInstructions = [
    "You are an expert-level Prompt Engineer",
    "Your goal is to create a detailed, effective prompt",
    "**Overall Project Context:**",
    "**Board Context:**",
    "**Specific Task Details:**",
    "**Your Instructions:**",
    "Based on all the context provided",
    "Respond ONLY with the text of the generated prompt",
    "without any additional commentary or conversational text"
  ];

  let cleaned = prompt;

  // Remove system instruction blocks
  systemInstructions.forEach(instruction => {
    const regex = new RegExp(`.*${instruction.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*\n?`, 'gi');
    cleaned = cleaned.replace(regex, '');
  });

  // Remove meta-prompt template variables that weren't replaced
  cleaned = cleaned.replace(/\{\{[^}]+\}\}/g, '');

  // Remove numbered instruction lists that are meta-instructions
  cleaned = cleaned.replace(/^\d+\.\s+.*(?:should|must|include|specify|provide|mention).*$/gm, '');

  // Remove lines that start with "The prompt should:" or similar meta-instructions
  cleaned = cleaned.replace(/^.*(?:prompt should|output should|response should|instructions?).*:.*$/gm, '');

  // Clean up extra whitespace and empty lines
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

  return cleaned;
}

// Enhanced markdown to HTML converter for prompt display
function convertMarkdownToHTML(markdown: string): string {
  if (!markdown) return "";

  // First clean the prompt content
  let html = cleanAIPrompt(markdown);

  // Convert code blocks first (to avoid conflicts with other formatting)
  html = html.replace(/```([^`]+)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono overflow-x-auto mb-2"><code>$1</code></pre>');

  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs font-mono">$1</code>');

  // Convert bold text
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>');

  // Convert italic text
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

  // Convert headings with better styling
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold mt-5 mb-3 text-gray-900 dark:text-gray-100">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100">$1</h1>');

  // Convert bullet lists
  html = html.replace(/^[\s]*[-*+]\s+(.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
  html = html.replace(/(<li[^>]*>.*<\/li>)/s, '<ul class="list-disc list-inside mb-3 space-y-1">$1</ul>');

  // Convert numbered lists
  html = html.replace(/^[\s]*\d+\.\s+(.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
  html = html.replace(/(<li[^>]*>.*<\/li>)/s, '<ol class="list-decimal list-inside mb-3 space-y-1">$1</ol>');

  // Convert blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300 mb-3">$1</blockquote>');

  // Convert line breaks to proper paragraphs
  const paragraphs = html.split('\n\n').filter(p => p.trim());
  html = paragraphs.map(p => {
    const trimmed = p.trim();
    // Don't wrap already formatted elements
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol') ||
        trimmed.startsWith('<blockquote') || trimmed.startsWith('<pre') ||
        trimmed.includes('<li>')) {
      return trimmed;
    }
    return `<p class="mb-3 text-sm leading-relaxed text-gray-800 dark:text-gray-200">${trimmed.replace(/\n/g, '<br>')}</p>`;
  }).join('');

  return html;
}

export function AIPromptModal({ cardPublicId }: AIPromptModalProps) {
  const { closeModal } = useModal();
  const { showPopup } = usePopup();
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [previousPrompts, setPreviousPrompts] = useState<string[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const generatePromptMutation = api.ai.generateTaskPrompt.useMutation({
    onSuccess: (data) => {
      const newPrompt = data.prompt;
      
      // If this is a regeneration, store the current prompt in history
      if (currentPrompt) {
        setPreviousPrompts(prev => [...prev, currentPrompt]);
      }
      
      setCurrentPrompt(newPrompt);
      setCurrentPromptIndex(previousPrompts.length);
    },
    onError: (error) => {
      showPopup({
        header: t`Unable to generate prompt`,
        message: error.message || t`Please try again later, or contact customer support.`,
        icon: "error",
      });
    },
  });

  const handleGeneratePrompt = () => {
    generatePromptMutation.mutate({ cardPublicId });
  };

  // Auto-generate prompt when modal opens
  useEffect(() => {
    if (cardPublicId && !currentPrompt && !generatePromptMutation.isPending) {
      handleGeneratePrompt();
    }
  }, [cardPublicId]); // Only run when cardPublicId changes (modal opens)

  const handleCopyPrompt = async () => {
    if (!currentPrompt) return;

    try {
      await navigator.clipboard.writeText(currentPrompt);
      showPopup({
        header: t`Copied to clipboard`,
        message: t`The AI prompt has been copied to your clipboard.`,
        icon: "success",
      });
    } catch (error) {
      showPopup({
        header: t`Unable to copy`,
        message: t`Please try copying the text manually.`,
        icon: "error",
      });
    }
  };

  const handlePreviousPrompt = () => {
    if (currentPromptIndex > 0) {
      const newIndex = currentPromptIndex - 1;
      const allPrompts = [...previousPrompts, currentPrompt];
      setCurrentPrompt(allPrompts[newIndex] || "");
      setCurrentPromptIndex(newIndex);
    }
  };

  const handleNextPrompt = () => {
    const allPrompts = [...previousPrompts, currentPrompt];
    if (currentPromptIndex < allPrompts.length - 1) {
      const newIndex = currentPromptIndex + 1;
      setCurrentPrompt(allPrompts[newIndex] || "");
      setCurrentPromptIndex(newIndex);
    }
  };

  const isLoading = generatePromptMutation.isPending;
  const hasPrompt = !!currentPrompt;
  const hasMultiplePrompts = previousPrompts.length > 0;
  const isFirstPrompt = currentPromptIndex === 0;
  const isLastPrompt = currentPromptIndex === previousPrompts.length;

  return (
    <div className="p-5">
      <div className="flex w-full flex-col justify-between pb-4">
        <div className="flex items-center gap-2 pb-2">
          <HiSparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-md font-medium text-neutral-900 dark:text-dark-1000">
            {t`AI Task Prompt`}
          </h2>
        </div>
        <p className="text-sm font-medium text-light-900 dark:text-dark-900">
          {t`Generate an expert-level AI prompt tailored to this specific task.`}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {!hasPrompt && !isLoading && (
          <div className="text-center py-6">
            <HiSparkles className="mx-auto h-8 w-8 text-light-400 dark:text-dark-500 mb-3" />
            <div className="mb-4">
              <Button
                onClick={handleGeneratePrompt}
                iconLeft={<HiSparkles className="h-4 w-4" />}
              >
                {t`Generate Prompt`}
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-6">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-3 text-sm text-light-600 dark:text-dark-600">
              {t`Analyzing task context...`}
            </p>
          </div>
        )}

        {hasPrompt && (
          <>
            {/* Navigation for multiple prompts */}
            {hasMultiplePrompts && (
              <div className="flex items-center justify-between border-b border-light-200 pb-3 mb-3 dark:border-dark-400">
                <button
                  onClick={handlePreviousPrompt}
                  disabled={isFirstPrompt}
                  className="text-xs text-blue-600 hover:text-blue-700 disabled:text-light-400 disabled:cursor-not-allowed dark:text-blue-400 dark:hover:text-blue-300 dark:disabled:text-dark-500"
                >
                  ← {t`Previous`}
                </button>
                <span className="text-xs text-light-600 dark:text-dark-600">
                  {currentPromptIndex + 1} of {previousPrompts.length + 1}
                </span>
                <button
                  onClick={handleNextPrompt}
                  disabled={isLastPrompt}
                  className="text-xs text-blue-600 hover:text-blue-700 disabled:text-light-400 disabled:cursor-not-allowed dark:text-blue-400 dark:hover:text-blue-300 dark:disabled:text-dark-500"
                >
                  {t`Next`} →
                </button>
              </div>
            )}

            {/* Prompt content */}
            <div className="max-h-80 overflow-y-auto rounded-md border border-light-200 bg-light-50 p-4 dark:border-dark-400 dark:bg-dark-100">
              <div
                className="max-w-none text-sm leading-relaxed text-light-900 dark:text-dark-1000
                  [&_h1]:text-base [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-gray-900 [&_h1]:dark:text-gray-100
                  [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:text-gray-900 [&_h2]:dark:text-gray-100
                  [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mt-3 [&_h3]:mb-1 [&_h3]:text-gray-900 [&_h3]:dark:text-gray-100
                  [&_p]:text-sm [&_p]:mb-2 [&_p]:leading-relaxed [&_p]:text-gray-800 [&_p]:dark:text-gray-200
                  [&_strong]:font-semibold [&_em]:italic
                  [&_code]:bg-gray-100 [&_code]:dark:bg-gray-800 [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono
                  [&_pre]:bg-gray-100 [&_pre]:dark:bg-gray-800 [&_pre]:p-2 [&_pre]:rounded [&_pre]:text-xs [&_pre]:font-mono [&_pre]:overflow-x-auto [&_pre]:mb-2
                  [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-2 [&_ul]:space-y-0.5
                  [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-2 [&_ol]:space-y-0.5
                  [&_li]:ml-2 [&_li]:text-sm [&_li]:leading-relaxed
                  [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:dark:text-gray-300 [&_blockquote]:mb-2"
                dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(currentPrompt) }}
              />
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      {hasPrompt && (
        <div className="mt-5 flex justify-between sm:mt-6">
          <Button
            variant="secondary"
            onClick={handleGeneratePrompt}
            disabled={isLoading}
            iconLeft={<HiArrowPath className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />}
            size="sm"
          >
            {t`Regenerate`}
          </Button>

          <Button
            onClick={handleCopyPrompt}
            iconLeft={<HiClipboard className="h-4 w-4" />}
            size="sm"
          >
            {t`Copy Prompt`}
          </Button>
        </div>
      )}
    </div>
  );
}
