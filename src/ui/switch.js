import { element } from './dom.js';

export class ToggleSwitch {
  constructor(label, checked) {
    this.field = element('button', {
      className: 'tr-switch-row',
      attributes: { type: 'button', role: 'switch', 'aria-label': label },
    });
    this.label = element('span', { className: 'tr-switch-label', text: label });
    this.track = element('span', { className: 'tr-switch-track', attributes: { 'aria-hidden': 'true' } });
    this.thumb = element('span', { className: 'tr-switch-thumb', attributes: { 'aria-hidden': 'true' } });
    this.icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.icon.setAttribute('class', 'tr-switch-icon');
    this.icon.setAttribute('viewBox', '0 0 16 16');
    this.icon.setAttribute('fill', 'none');
    this.icon.setAttribute('stroke', 'currentColor');
    this.icon.setAttribute('stroke-width', '2.2');
    this.icon.setAttribute('stroke-linecap', 'round');
    this.icon.setAttribute('stroke-linejoin', 'round');
    this.iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.icon.append(this.iconPath);
    this.thumb.append(this.icon);
    this.track.append(this.thumb);
    this.field.append(this.label, this.track);
    this.field.addEventListener('click', () => this.setChecked(!this.checked));
    this.setChecked(checked);
  }

  setChecked(checked) {
    this.checked = Boolean(checked);
    this.field.classList.toggle('is-checked', this.checked);
    this.field.setAttribute('aria-checked', String(this.checked));
    this.iconPath.setAttribute('d', this.checked ? 'M3 8.25 6.5 11.5 13 4.75' : 'M5 5 11 11M11 5 5 11');
  }
}
