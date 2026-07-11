import { LANGUAGE_OPTIONS } from '../config/defaults.js';
import { button, element } from './dom.js';
import { CustomSelect } from './custom-select.js';
import { ToggleSwitch } from './switch.js';

export class Dialog {
  constructor(root) {
    this.root = root;
  }

  show({ title, content, actions = [], onClose }) {
    this.close();
    this.onClose = onClose;
    const overlay = element('div', { className: 'tr-overlay', attributes: { role: 'presentation' } });
    const panel = element('section', { className: 'tr-dialog tr-dialog--scrollable', attributes: { role: 'dialog', 'aria-modal': 'true' } });
    const contentArea = element('div', { className: 'tr-dialog-content' });
    contentArea.append(content);
    panel.append(element('h2', { className: 'tr-dialog-title', text: title }), contentArea);
    if (actions.length) {
      const actionBar = element('div', { className: 'tr-actions' });
      actions.forEach((action) => actionBar.append(button(action.label, action.label, action.onClick, `tr-button${action.primary ? ' tr-primary' : ''}`)));
      panel.append(actionBar);
    }
    overlay.append(panel);
    overlay.addEventListener('click', (event) => { if (event.target === overlay) this.close(); });
    // 页面常会在 document 上注册 / 等快捷键。让弹窗中的按键正常传给控件，
    // 但不要继续冒泡给页面，避免网页抢走输入框焦点。
    this.stopKeyboardPropagation = (event) => event.stopPropagation();
    panel.addEventListener('keydown', this.stopKeyboardPropagation);
    panel.addEventListener('keypress', this.stopKeyboardPropagation);
    panel.addEventListener('keyup', this.stopKeyboardPropagation);
    this.onKeyDown = (event) => { if (event.key === 'Escape') this.close(); };
    document.addEventListener('keydown', this.onKeyDown, true);
    this.root.append(overlay);
    this.overlay = overlay;
    return panel;
  }

  close() {
    this.onClose?.();
    this.onClose = null;
    this.overlay?.remove();
    this.overlay = null;
    if (this.onKeyDown) document.removeEventListener('keydown', this.onKeyDown, true);
    this.onKeyDown = null;
    this.stopKeyboardPropagation = null;
  }
}

function selectField(label, value, allowAuto = true) {
  return new CustomSelect({
    label,
    value,
    options: LANGUAGE_OPTIONS
    .filter(([code]) => allowAuto || code !== 'auto')
  });
}

function textField(label, value, type = 'number', attributes = {}) {
  const field = element('label', { className: 'tr-field', text: label });
  const input = element('input', { className: 'tr-input', attributes: { type, value, ...attributes } });
  field.append(input);
  return { field, input };
}

function multilineField(label, value, attributes = {}) {
  const field = element('label', { className: 'tr-field', text: label });
  const input = element('textarea', { className: 'tr-input tr-textarea', attributes });
  input.value = value;
  field.append(input);
  return { field, input };
}

export function openSettings(dialog, t, settings, onSave) {
  const content = element('form');
  const source = selectField(t('sourceLanguage'), settings.sourceLanguage);
  const target = selectField(t('targetLanguage'), settings.targetLanguage, false);
  const auto = new ToggleSwitch(t('autoTranslate'), settings.autoTranslate);
  const blacklist = multilineField(t('autoTranslateBlacklist'), settings.autoTranslateBlacklist.join('\n'), {
    rows: 3,
    placeholder: t('autoTranslateBlacklistPlaceholder'),
    'aria-describedby': 'tr-auto-translate-blacklist-hint',
  });
  const blacklistHint = element('p', { id: 'tr-auto-translate-blacklist-hint', className: 'tr-settings-hint', text: t('autoTranslateBlacklistHint') });
  const dynamic = new ToggleSwitch(t('translateDynamic'), settings.translateDynamic);
  const selection = new ToggleSwitch(t('showSelectionButton'), settings.showSelectionButton);
  const cache = new ToggleSwitch(t('cacheEnabled'), settings.cacheEnabled);
  const batch = textField(t('batchSize'), settings.batchSize);
  batch.input.min = '1'; batch.input.max = '100';
  const timeout = textField(t('timeoutMs'), settings.timeoutMs);
  timeout.input.min = '3000'; timeout.input.max = '60000'; timeout.input.step = '1000';
  content.append(source.field, target.field, auto.field, blacklist.field, blacklistHint, dynamic.field, selection.field, cache.field, batch.field, timeout.field);
  dialog.show({
    title: t('settings'),
    content,
    onClose: () => { source.destroy(); target.destroy(); },
    actions: [
      { label: t('cancel'), onClick: () => dialog.close() },
      {
        label: t('save'), primary: true, onClick: async () => {
          await onSave({
            ...settings,
            sourceLanguage: source.value,
            targetLanguage: target.value,
            autoTranslate: auto.checked,
            autoTranslateBlacklist: blacklist.input.value.split(/[\n,]/),
            translateDynamic: dynamic.checked,
            showSelectionButton: selection.checked,
            cacheEnabled: cache.checked,
            batchSize: Number(batch.input.value),
            timeoutMs: Number(timeout.input.value),
          });
          dialog.close();
        },
      },
    ],
  });
}
