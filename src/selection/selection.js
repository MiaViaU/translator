import { button } from '../ui/dom.js';

export class SelectionTranslator {
  constructor(root, { getSettings, onOpen, onNewSelection = () => {}, t }) {
    this.getSettings = getSettings;
    this.onOpen = onOpen;
    this.onNewSelection = onNewSelection;
    this.root = root;
    this.value = '';
    this.anchor = null;
    this.suppressedSelection = null;
    this.button = button('', t('selectionTranslate'), () => this.translateCurrent(), 'tr-selection-button');
    this.button.addEventListener('pointerdown', (event) => event.preventDefault());
    root.append(this.button);
    this.onSelectionChange = () => this.refresh();
    this.onMouseUp = () => setTimeout(() => this.refresh(), 0);
    this.onTouchEnd = () => setTimeout(() => this.refresh(), 0);
    document.addEventListener('selectionchange', this.onSelectionChange);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('touchend', this.onTouchEnd, { passive: true });
  }

  refresh() {
    if (!this.getSettings().showSelectionButton) return this.hide();
    const selection = window.getSelection();
    const value = selection?.toString().trim();
    if (!value || value.length > 5000 || !selection.rangeCount) return this.hide();
    const range = selection.getRangeAt(0);
    const common = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;
    if (common?.closest?.('[data-translator-ui]')) return this.hide();
    const rects = range.getClientRects();
    const rect = rects[rects.length - 1] || range.getBoundingClientRect();
    if (!rect || (!rect.width && !rect.height)) return this.hide();
    if (this.isSuppressedSelection(value, range)) {
      // 点击圆点后仍会派发一次 mouseup；同一选区不能被视为新选区。
      this.value = value;
      this.button.classList.remove('is-visible');
      return;
    }
    this.suppressedSelection = null;
    if (this.value !== value) this.onNewSelection();
    this.value = value;
    this.anchor = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
    this.positionButton(this.anchor);
    this.button.classList.add('is-visible');
  }

  positionButton(rect) {
    const size = 26;
    const gap = 8;
    let left = rect.right + gap;
    let top = rect.bottom + gap;
    if (left + size > window.innerWidth - gap) left = rect.left - size - gap;
    if (left < gap) left = Math.max(gap, Math.min(window.innerWidth - size - gap, rect.left + (rect.width - size) / 2));
    if (top + size > window.innerHeight - gap) top = rect.top - size - gap;
    this.button.style.left = `${Math.round(Math.max(gap, Math.min(window.innerWidth - size - gap, left)))}px`;
    this.button.style.top = `${Math.round(Math.max(gap, Math.min(window.innerHeight - size - gap, top)))}px`;
  }

  hide() {
    this.value = '';
    this.anchor = null;
    this.suppressedSelection = null;
    this.button.classList.remove('is-visible');
  }

  translateCurrent() {
    const text = this.value;
    const anchor = this.anchor;
    if (!text || !anchor) return;
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    this.suppressedSelection = range ? {
      text,
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset,
    } : null;
    this.value = '';
    this.anchor = null;
    this.button.classList.remove('is-visible');
    this.onOpen(text, anchor);
  }

  isSuppressedSelection(value, range) {
    const previous = this.suppressedSelection;
    return Boolean(previous
      && previous.text === value
      && previous.startContainer === range.startContainer
      && previous.startOffset === range.startOffset
      && previous.endContainer === range.endContainer
      && previous.endOffset === range.endOffset);
  }

  destroy() {
    document.removeEventListener('selectionchange', this.onSelectionChange);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('touchend', this.onTouchEnd);
    this.button.remove();
  }
}
