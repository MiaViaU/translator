import { whenIdle } from '../utils/idle.js';

const SKIPPED_TAGS = new Set([
  'TITLE', 'LINK', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SVG', 'G', 'NOSCRIPT', 'OPTION', 'SELECT', 'TEMPLATE',
  'KBD', 'SAMP', 'VAR', 'WBR', 'RUBY', 'RT', 'RP', 'META', 'MATH', 'TIME',
]);
const CODE_TAGS = new Set(['CODE', 'PRE', 'KBD', 'SAMP', 'TT']);
const SKIPPED_SELECTOR = [
  '[translate="no"]', '.notranslate', '.imt-notranslate', '[data-no-translate]', '[contenteditable="true"]', '[aria-hidden="true"]',
  '.material-icons', 'material-icon', 'i.fa', 'i[class^="fa-"]', '.google-symbols', 'span[class^="material-symbols-"]', '.visuallyhidden',
  '.prism-code', '.enlighter-code', '.rc-CodeBlock', '.highlight', '[role="code"]', 'table.highlight', 'div[class^="codeBlockContent"]',
  'div[class^="codeBlockLines"]', 'div[class^="token-line"]', '[data-test="json-editor"]', '.jp-CodeMirrorEditor', 'cds-code-snippet',
  '.interactive-markdown__code', '#ace-editor', 'table.processedcode', '.CodeMirror', '.cm-editor', '.monaco-editor', '.ace_editor',
  'span.katex', '[class^="MathJax"]', '[role="math"]', 'math-renderer', '.ltx_Math',
].join(',');
const NON_TRANSLATABLE_TEXT = /^(?:https?:\/\/\S+|www\.\S+|mailto:\S+|tel:\S+|[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:[\w-]*[_$][\w$-]*|[\w.-]+[\\/][\w./\\-]+|[\w-]+(?:\.[\w-]+){1,})(?:\([^)]*\))?[;,{})\]]?)$/i;
const NON_TEXTUAL_CONTENT = /^(?:[\d\s.,:/+%#()\[\]{}|*_~^=-]+|copyright\b)/i;

function isInsideSkippedElement(element) {
  if (!element) return true;
  if (element.closest('[data-translator-ui], [hidden], [contenteditable="true"]')) return true;
  if (element.closest(SKIPPED_SELECTOR)) return true;
  for (let current = element; current; current = current.parentElement) {
    if (SKIPPED_TAGS.has(current.tagName)) return true;
    if (CODE_TAGS.has(current.tagName)) return true;
  }
  const style = getComputedStyle(element);
  return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
}

export function isTranslatableTextNode(node) {
  return node?.nodeType === Node.TEXT_NODE
    && Boolean(node.nodeValue?.trim())
    && !NON_TRANSLATABLE_TEXT.test(node.nodeValue.trim())
    && !NON_TEXTUAL_CONTENT.test(node.nodeValue.trim())
    && !isInsideSkippedElement(node.parentElement);
}

export function isTextNodeVisible(node) {
  const range = document.createRange();
  range.selectNodeContents(node);
  const rect = range.getBoundingClientRect();
  if (!rect || (rect.width === 0 && rect.height === 0)) return false;
  return rect.bottom >= 0 && rect.right >= 0 && rect.top <= window.innerHeight && rect.left <= window.innerWidth;
}

export function collectTextNodes(root, options, { visibleOnly = false } = {}) {
  const nodes = [];
  if (root.nodeType === Node.TEXT_NODE && isTranslatableTextNode(root, options) && (!visibleOnly || isTextNodeVisible(root))) {
    nodes.push(root);
    return nodes;
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!isTranslatableTextNode(node, options)) return NodeFilter.FILTER_REJECT;
      if (visibleOnly && !isTextNodeVisible(node)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let node;
  while ((node = walker.nextNode())) nodes.push(node);
  return nodes;
}

export async function scanTextNodesInIdle(root, options, { visibleOnly = false, chunkSize = 150, onChunk } = {}) {
  if (root.nodeType === Node.TEXT_NODE) {
    if (isTranslatableTextNode(root, options) && (!visibleOnly || isTextNodeVisible(root))) await onChunk([root]);
    return;
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => isTranslatableTextNode(node, options) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
  });
  let batch = [];
  let node;
  while ((node = walker.nextNode())) {
    if (!visibleOnly || isTextNodeVisible(node)) batch.push(node);
    if (batch.length >= chunkSize) {
      await onChunk(batch);
      batch = [];
      await whenIdle();
    }
  }
  if (batch.length) await onChunk(batch);
}
