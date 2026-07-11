import { LANGUAGE_OPTIONS } from '../config/defaults.js';
import { CustomSelect } from '../ui/custom-select.js';
import { button, element } from '../ui/dom.js';
import { copyText } from '../utils/idle.js';

function languageSelect(label, value, allowAuto = true) {
  return new CustomSelect({
    label,
    value,
    options: LANGUAGE_OPTIONS.filter(([code]) => allowAuto || code !== 'auto'),
  });
}

function copyIconButton(label, onClick) {
  const node = button('', label, onClick, 'tr-translation-copy');
  node.setAttribute('aria-label', label);
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 20 20');
  icon.setAttribute('aria-hidden', 'true');
  const back = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  back.setAttribute('d', 'M6.5 5V3.75A1.75 1.75 0 0 1 8.25 2h6A1.75 1.75 0 0 1 16 3.75v6A1.75 1.75 0 0 1 14.25 11.5H13');
  const front = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  front.setAttribute('x', '4'); front.setAttribute('y', '6.5'); front.setAttribute('width', '9.5'); front.setAttribute('height', '11'); front.setAttribute('rx', '1.75');
  icon.append(back, front);
  node.append(icon);
  return node;
}

export class TranslationInputPopup {
  constructor(root, t, toast, { getSettings, translate }) {
    this.root = root;
    this.t = t;
    this.toast = toast;
    this.getSettings = getSettings;
    this.translate = translate;
  }

  open({ text = '', autoTranslate = false } = {}) {
    this.close();
    const settings = this.getSettings();
    this.source = languageSelect(this.t('sourceLanguage'), settings.sourceLanguage, true);
    this.target = languageSelect(this.t('targetLanguage'), settings.targetLanguage, false);
    const overlay = element('div', { className: 'tr-overlay', attributes: { role: 'presentation' } });
    const panel = element('section', { className: 'tr-dialog tr-translation-dialog', attributes: { role: 'dialog', 'aria-modal': 'true', 'aria-label': this.t('inputTranslate') } });
    const header = element('div', { className: 'tr-translation-header' });
    header.append(element('h2', { className: 'tr-dialog-title', text: this.t('inputTranslate') }), button('×', this.t('close'), () => this.close(), 'tr-selection-close'));
    this.input = element('textarea', { className: 'tr-translation-input', attributes: { rows: 5, placeholder: this.t('inputPlaceholder'), 'aria-label': this.t('inputTranslate') } });
    this.input.value = text;
    this.result = element('p', { className: 'tr-translation-result', text: this.t('translationPlaceholder'), attributes: { 'data-state': 'placeholder' } });
    this.copyButton = copyIconButton(this.t('copy'), () => this.copyResult());
    this.copyButton.disabled = true;
    this.resultHeader = element('div', { className: 'tr-translation-result-header' });
    this.resultHeader.append(element('span', { className: 'tr-selection-section-label', text: this.t('translation') }), this.copyButton);
    this.resultSection = element('section', { className: 'tr-translation-result-section' });
    this.resultSection.append(this.resultHeader, this.result);
    this.translateButton = button(this.t('translate'), this.t('translate'), () => this.run(), 'tr-button tr-primary');
    const actions = element('div', { className: 'tr-actions' });
    actions.append(this.translateButton);
    this.languages = element('div', { className: 'tr-translation-languages' });
    this.languages.append(this.source.field, this.target.field);
    this.hint = element('p', { className: 'tr-translation-hint', text: this.t('inputShortcut') });
    const content = element('div', { className: 'tr-translation-content' });
    content.append(this.languages, this.input, this.hint, this.resultSection);
    panel.append(header, content, actions);
    overlay.append(panel);
    overlay.addEventListener('click', (event) => { if (event.target === overlay) this.close(); });
    this.keyHandler = (event) => { if (event.key === 'Escape') this.close(); };
    this.input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        this.run();
      }
    });
    this.input.addEventListener('input', () => this.resetResult());
    document.addEventListener('keydown', this.keyHandler, true);
    this.root.append(overlay);
    this.overlay = overlay;
    if (autoTranslate && text.trim()) queueMicrotask(() => this.run());
    else this.input.focus();
  }

  async run() {
    if (!this.overlay || !this.source || !this.target) return;
    const input = this.input;
    const source = this.source;
    const target = this.target;
    const result = this.result;
    const resultSection = this.resultSection;
    const translateButton = this.translateButton;
    const text = input?.value.trim();
    if (!text) {
      input?.focus();
      return;
    }
    if (this.busy) return;
    this.busy = true;
    translateButton.disabled = true;
    translateButton.textContent = '…';
    this.result.textContent = this.t('translating');
    this.result.dataset.state = 'loading';
    this.copyButton.disabled = true;
    try {
      const translation = await this.translate(text, { sourceLanguage: source.value, targetLanguage: target.value });
      if (this.result !== result) return;
      result.textContent = translation;
      result.dataset.state = 'translated';
      this.copyButton.disabled = false;
    } catch (error) {
      if (this.result === result) {
        result.textContent = this.t('translationPlaceholder');
        result.dataset.state = 'placeholder';
        if (this.copyButton) this.copyButton.disabled = true;
      }
      console.error('[translator-userscript]', error);
    } finally {
      this.busy = false;
      if (this.translateButton === translateButton) {
        translateButton.disabled = false;
        translateButton.textContent = this.t('translate');
      }
    }
  }

  async copyResult() {
    const text = this.result?.dataset.state === 'translated' ? this.result.textContent : '';
    if (!text) return;
    try {
      await copyText(text);
      return;
    } catch {
      return;
    }
  }

  resetResult() {
    if (!this.result || this.busy) return;
    this.result.textContent = this.t('translationPlaceholder');
    this.result.dataset.state = 'placeholder';
    if (this.copyButton) this.copyButton.disabled = true;
  }

  close() {
    this.source?.destroy();
    this.target?.destroy();
    this.source = null;
    this.target = null;
    this.overlay?.remove();
    this.overlay = null;
    this.input = null;
    this.result = null;
    this.resultSection = null;
    this.translateButton = null;
    this.copyButton = null;
    if (this.keyHandler) document.removeEventListener('keydown', this.keyHandler, true);
    this.keyHandler = null;
    this.busy = false;
  }
}
