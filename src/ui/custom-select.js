import { element } from './dom.js';

export class CustomSelect {
  constructor({ label, value, options }) {
    this.options = options;
    this.value = value;
    this.field = element('div', { className: 'tr-field tr-combobox' });
    this.field.append(element('span', { className: 'tr-field-label', text: label }));
    this.trigger = element('button', {
      className: 'tr-combobox-trigger',
      attributes: { type: 'button', 'aria-haspopup': 'listbox', 'aria-expanded': 'false', 'aria-label': label },
    });
    this.valueLabel = element('span', { className: 'tr-combobox-value' });
    this.chevron = element('span', { className: 'tr-combobox-chevron', attributes: { 'aria-hidden': 'true' } });
    this.trigger.append(this.valueLabel, this.chevron);
    this.menu = element('div', { className: 'tr-combobox-menu', attributes: { role: 'listbox', 'aria-label': label, hidden: '' } });
    this.optionButtons = new Map();
    for (const [optionValue, optionLabel] of options) {
      const option = element('button', {
        className: 'tr-combobox-option',
        text: optionLabel,
        attributes: { type: 'button', role: 'option', 'data-value': optionValue },
      });
      option.addEventListener('click', () => {
        this.setValue(optionValue);
        this.field.dispatchEvent(new Event('change', { bubbles: true }));
        this.close();
        this.trigger.focus();
      });
      option.addEventListener('keydown', (event) => this.handleOptionKey(event, optionValue));
      this.optionButtons.set(optionValue, option);
      this.menu.append(option);
    }
    this.trigger.addEventListener('click', () => this.toggle());
    this.trigger.addEventListener('keydown', (event) => this.handleTriggerKey(event));
    this.field.append(this.trigger, this.menu);
    this.setValue(value);
  }

  setValue(value) {
    const selected = this.options.find(([optionValue]) => optionValue === value) || this.options[0];
    this.value = selected[0];
    this.valueLabel.textContent = selected[1];
    for (const [optionValue, button] of this.optionButtons) {
      const active = optionValue === this.value;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-selected', String(active));
    }
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open({ focusSelected = false } = {}) {
    if (this.isOpen) return;
    this.isOpen = true;
    this.menu.hidden = false;
    this.field.classList.add('is-open');
    this.trigger.setAttribute('aria-expanded', 'true');
    this.outsideHandler = (event) => {
      if (!event.composedPath().includes(this.field)) this.close();
    };
    document.addEventListener('pointerdown', this.outsideHandler, true);
    if (focusSelected) this.optionButtons.get(this.value)?.focus();
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.menu.hidden = true;
    this.field.classList.remove('is-open');
    this.trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', this.outsideHandler, true);
    this.outsideHandler = null;
  }

  handleTriggerKey(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.open({ focusSelected: true });
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    } else if (event.key === 'Escape') {
      this.close();
    }
  }

  handleOptionKey(event, optionValue) {
    const index = this.options.findIndex(([value]) => value === optionValue);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const offset = event.key === 'ArrowDown' ? 1 : -1;
      const next = this.options[(index + offset + this.options.length) % this.options.length][0];
      this.optionButtons.get(next)?.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      this.trigger.focus();
    }
  }

  destroy() {
    this.close();
  }
}
