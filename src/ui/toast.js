import { element } from './dom.js';

function toastIcon() {
  const icon = element('span', { className: 'tr-toast-icon', attributes: { 'aria-hidden': 'true' } });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 18 18');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'm4.5 9.2 2.85 2.85 6.15-6.4');
  svg.append(path);
  icon.append(svg);
  return icon;
}

export class Toast {
  constructor(root) {
    this.stack = element('div', { className: 'tr-toast-stack' });
    root.append(this.stack);
  }

  show(message, { duration = 2200 } = {}) {
    clearTimeout(this.timer);
    this.current?.remove();
    const toast = element('div', {
      className: 'tr-toast',
      attributes: { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' },
    });
    toast.append(toastIcon(), element('span', { className: 'tr-toast-message', text: message }));
    this.stack.append(toast);
    this.current = toast;
    this.timer = setTimeout(() => {
      if (this.current !== toast) return;
      toast.remove();
      this.current = null;
      this.timer = null;
    }, duration);
  }
}
