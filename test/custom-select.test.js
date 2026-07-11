import { describe, expect, it } from 'vitest';
import { CustomSelect } from '../src/ui/custom-select.js';

describe('CustomSelect', () => {
  it('不使用原生 select，并会更新当前值与可访问状态', () => {
    const select = new CustomSelect({ label: '目标语言', value: 'zh', options: [['zh', '中文'], ['en', 'English']] });
    document.body.append(select.field);
    expect(select.field.querySelector('select')).toBeNull();
    expect(select.menu.hidden).toBe(true);
    expect(select.field.classList.contains('is-open')).toBe(false);
    select.open();
    expect(select.trigger.getAttribute('aria-expanded')).toBe('true');
    select.optionButtons.get('en').click();
    expect(select.value).toBe('en');
    expect(select.valueLabel.textContent).toBe('English');
    expect(select.trigger.getAttribute('aria-expanded')).toBe('false');
    select.field.remove();
  });
});
