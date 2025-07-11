/**
 * Markdown to HTML conversion utility for AI-generated card descriptions
 * 
 * This utility converts AI-generated Markdown content to HTML that's compatible
 * with the TipTap editor used in the Kanban application.
 */

/**
 * Converts Markdown text to HTML compatible with TipTap editor
 * 
 * Supports the following Markdown features commonly used by AI:
 * - **bold text** -> <strong>bold text</strong>
 * - *italic text* -> <em>italic text</em>
 * - # Heading 1 -> <h1>Heading 1</h1>
 * - ## Heading 2 -> <h2>Heading 2</h2>
 * - ### Heading 3 -> <h3>Heading 3</h3>
 * - - Bullet points -> <ul><li>Bullet points</li></ul>
 * - 1. Numbered lists -> <ol><li>Numbered lists</li></ol>
 * - `code` -> <code>code</code>
 * - ```code blocks``` -> <pre><code>code blocks</code></pre>
 * - > Blockquotes -> <blockquote>Blockquotes</blockquote>
 * - Line breaks and paragraphs
 * 
 * @param markdown - The Markdown text to convert
 * @returns HTML string compatible with TipTap editor
 */
export function convertMarkdownToHTML(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  let html = markdown.trim();

  // Handle code blocks first (before other processing)
  html = html.replace(/```([^`]*?)```/gs, '<pre><code>$1</code></pre>');

  // Handle inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Handle headings (must be at start of line)
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Handle bold text (**text** or __text__)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Handle italic text (*text* or _text_)
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Handle blockquotes (> text)
  html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Handle unordered lists (- item or * item)
  html = convertMarkdownLists(html);

  // Handle line breaks and paragraphs
  html = convertMarkdownParagraphs(html);

  return html.trim();
}

/**
 * Converts Markdown lists to HTML lists
 * Handles both unordered (- or *) and ordered (1.) lists
 */
function convertMarkdownLists(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let inUnorderedList = false;
  let inOrderedList = false;
  let listItems: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const trimmedLine = line.trim();

    // Check for unordered list items (- or *)
    const unorderedMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
    // Check for ordered list items (1. 2. etc.)
    const orderedMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);

    if (unorderedMatch) {
      // Handle transition from ordered to unordered list
      if (inOrderedList) {
        result.push(`<ol>${listItems.map(item => `<li>${item}</li>`).join('')}</ol>`);
        listItems = [];
        inOrderedList = false;
      }

      if (!inUnorderedList) {
        inUnorderedList = true;
      }
      listItems.push(unorderedMatch[1] || "");
    } else if (orderedMatch) {
      // Handle transition from unordered to ordered list
      if (inUnorderedList) {
        result.push(`<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`);
        listItems = [];
        inUnorderedList = false;
      }

      if (!inOrderedList) {
        inOrderedList = true;
      }
      listItems.push(orderedMatch[1] || "");
    } else {
      // Not a list item, close any open lists
      if (inUnorderedList) {
        result.push(`<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`);
        listItems = [];
        inUnorderedList = false;
      }
      if (inOrderedList) {
        result.push(`<ol>${listItems.map(item => `<li>${item}</li>`).join('')}</ol>`);
        listItems = [];
        inOrderedList = false;
      }
      result.push(line);
    }
  }

  // Close any remaining open lists
  if (inUnorderedList) {
    result.push(`<ul>${listItems.map(item => `<li>${item}</li>`).join('')}</ul>`);
  }
  if (inOrderedList) {
    result.push(`<ol>${listItems.map(item => `<li>${item}</li>`).join('')}</ol>`);
  }

  return result.join('\n');
}

/**
 * Converts Markdown paragraphs and line breaks to HTML
 * Handles double line breaks as paragraph separators
 */
function convertMarkdownParagraphs(text: string): string {
  // Split by double line breaks to identify paragraphs
  const paragraphs = text.split(/\n\s*\n/);

  return paragraphs
    .map(paragraph => {
      const trimmed = paragraph.trim();
      if (!trimmed) return '';

      // Don't wrap if it's already an HTML block element
      if (trimmed.match(/^<(h[1-6]|ul|ol|blockquote|pre|div)/)) {
        return trimmed;
      }

      // Check if paragraph contains block elements (lists, etc.)
      if (trimmed.includes('<ul>') || trimmed.includes('<ol>') || trimmed.includes('<blockquote>')) {
        // Split content around block elements
        return splitAroundBlockElements(trimmed);
      }

      // Convert single line breaks within paragraphs to <br> tags
      const withBreaks = trimmed.replace(/\n/g, '<br>');

      return `<p>${withBreaks}</p>`;
    })
    .filter(p => p.length > 0)
    .join('');
}

/**
 * Splits content around block elements to avoid nesting block elements in paragraphs
 */
function splitAroundBlockElements(content: string): string {
  // Pattern to match block elements
  const blockElementPattern = /(<(?:ul|ol|blockquote|h[1-6]|pre|div)[^>]*>.*?<\/(?:ul|ol|blockquote|h[1-6]|pre|div)>)/gs;

  const parts = content.split(blockElementPattern);

  return parts
    .map(part => {
      const trimmed = part.trim();
      if (!trimmed) return '';

      // If it's a block element, return as-is
      if (trimmed.match(/^<(ul|ol|blockquote|h[1-6]|pre|div)/)) {
        return trimmed;
      }

      // If it's text content, wrap in paragraph
      const withBreaks = trimmed.replace(/\n/g, '<br>');
      return `<p>${withBreaks}</p>`;
    })
    .filter(p => p.length > 0)
    .join('');
}

/**
 * Checks if a string contains Markdown formatting
 * Used to determine if conversion is needed
 */
export function containsMarkdown(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const markdownPatterns = [
    /\*\*[^*]+\*\*/,  // Bold **text**
    /__[^_]+__/,      // Bold __text__
    /\*[^*]+\*/,      // Italic *text*
    /_[^_]+_/,        // Italic _text_
    /^#{1,6}\s+/m,    // Headings
    /^[-*]\s+/m,      // Unordered lists
    /^\d+\.\s+/m,     // Ordered lists
    /^>\s+/m,         // Blockquotes
    /`[^`]+`/,        // Inline code
    /```[\s\S]*?```/, // Code blocks
  ];

  return markdownPatterns.some(pattern => pattern.test(text));
}

/**
 * Safely converts Markdown to HTML with error handling
 * Returns original text if conversion fails
 */
export function safeMarkdownToHTML(markdown: string): string {
  try {
    if (!containsMarkdown(markdown)) {
      // If no Markdown detected, wrap in paragraph tags for consistency
      return `<p>${markdown}</p>`;
    }

    return convertMarkdownToHTML(markdown);
  } catch (error) {
    console.error('Error converting Markdown to HTML:', error);
    // Fallback to wrapping in paragraph tags
    return `<p>${markdown}</p>`;
  }
}

/**
 * Ensures content is in HTML format for TipTap editor compatibility
 * Handles both new AI-generated Markdown and existing plain text descriptions
 */
export function ensureHTMLFormat(content: string | null): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return '';
  }

  // Check if content is already HTML (contains HTML tags)
  if (isHTMLContent(trimmed)) {
    return trimmed;
  }

  // Check if content contains Markdown formatting
  if (containsMarkdown(trimmed)) {
    return safeMarkdownToHTML(trimmed);
  }

  // Plain text content - wrap in paragraph tags for TipTap compatibility
  return `<p>${trimmed}</p>`;
}

/**
 * Checks if content is already in HTML format
 */
function isHTMLContent(content: string): boolean {
  // Check for common HTML tags that indicate the content is already HTML
  const htmlTagPattern = /<(p|div|h[1-6]|ul|ol|li|strong|em|br|blockquote|code|pre)\b[^>]*>/i;
  return htmlTagPattern.test(content);
}

/**
 * Validates that the converted HTML is safe and well-formed
 * Basic validation to ensure TipTap compatibility
 */
export function validateConvertedHTML(html: string): boolean {
  try {
    // Check for basic HTML structure
    if (!html || typeof html !== 'string') {
      return false;
    }

    // Check for obviously malformed HTML
    if (html.includes('<<') || html.includes('>>')) {
      return false;
    }

    // Check for unclosed angle brackets
    const openBrackets = (html.match(/</g) || []).length;
    const closeBrackets = (html.match(/>/g) || []).length;
    if (openBrackets !== closeBrackets) {
      return false;
    }

    // Basic check for common TipTap-compatible tags
    const allowedTags = ['p', 'strong', 'em', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'br'];
    const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)/g;
    let match;

    while ((match = tagPattern.exec(html)) !== null) {
      const tagName = match[1]?.toLowerCase();
      if (tagName && !allowedTags.includes(tagName)) {
        console.warn(`Unknown tag found: ${tagName}`);
        // Don't fail for unknown tags, just warn
      }
    }

    // If we get here, the HTML is probably valid enough for TipTap
    return true;
  } catch (error) {
    console.error('Error validating HTML:', error);
    return false;
  }
}
