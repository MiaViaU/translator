import { describe, expect, it } from 'vitest';
import { ToggleSwitch } from '../src/ui/switch.js';

describe('ToggleSwitch', () => {
  it('通过整行按钮切换状态并同步无障碍属性', () => {
    const toggle = new ToggleSwitch('启用缓存', false);
    document.body.append(toggle.field);
    expect(toggle.field.getAttribute('role')).toBe('switch');
    expect(toggle.field.getAttribute('aria-checked')).toBe('false');
    expect(toggle.icon.classList.contains('tr-switch-icon')).toBe(true);
    expect(toggle.icon.tagName.toLowerCase()).toBe('svg');
    expect(toggle.iconPath.getAttribute('d')).toBe('M5 5 11 11M11 5 5 11');
    toggle.field.click();
    expect(toggle.checked).toBe(true);
    expect(toggle.field.classList.contains('is-checked')).toBe(true);
    expect(toggle.field.getAttribute('aria-checked')).toBe('true');
    expect(toggle.iconPath.getAttribute('d')).toBe('M3 8.25 6.5 11.5 13 4.75');
    toggle.field.remove();
  });
});
