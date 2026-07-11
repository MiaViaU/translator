import { describe, expect, it } from 'vitest';
import { Dialog } from '../src/ui/dialog.js';
import { element } from '../src/ui/dom.js';

describe('Dialog', () => {
  it('将设置内容放进独立滚动区，保留固定操作区', () => {
    const root = document.createElement('div');
    document.body.append(root);
    const dialog = new Dialog(root);
    const content = element('form');
    dialog.show({ title: '设置', content, actions: [{ label: '保存', onClick: () => {} }] });
    const panel = root.querySelector('.tr-dialog');
    expect(panel.classList.contains('tr-dialog--scrollable')).toBe(true);
    expect(panel.querySelector('.tr-dialog-content')).toContain(content);
    expect(panel.querySelector('.tr-actions')).not.toBeNull();
    dialog.close();
    root.remove();
  });

  it('阻止弹窗内的按键冒泡到网页快捷键处理器', () => {
    const root = document.createElement('div');
    document.body.append(root);
    const dialog = new Dialog(root);
    const content = element('form');
    const input = element('input', { attributes: { type: 'text' } });
    content.append(input);
    let pageShortcutCalls = 0;
    const pageShortcut = () => { pageShortcutCalls += 1; };
    document.addEventListener('keydown', pageShortcut);
    dialog.show({ title: '设置', content });
    input.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true, composed: true }));
    expect(pageShortcutCalls).toBe(0);
    document.removeEventListener('keydown', pageShortcut);
    dialog.close();
    root.remove();
  });
});
