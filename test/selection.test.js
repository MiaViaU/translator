import { describe, expect, it, vi } from 'vitest';
import { SelectionTranslator } from '../src/selection/selection.js';

const t = (key) => key;

function selectText(textNode, rect) {
  const range = document.createRange();
  range.selectNodeContents(textNode);
  Object.defineProperty(range, 'getClientRects', { value: () => [rect] });
  Object.defineProperty(range, 'getBoundingClientRect', { value: () => rect });
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

describe('SelectionTranslator', () => {
  it('在选区末行附近显示圆点，并将选中文本交给统一输入翻译弹窗', () => {
    document.body.textContent = '';
    const textNode = document.createTextNode('translate me');
    document.body.append(textNode);
    const root = document.createElement('div');
    document.body.append(root);
    selectText(textNode, { left: 100, top: 80, right: 180, bottom: 100, width: 80, height: 20 });
    const onOpen = vi.fn();
    const onNewSelection = vi.fn();
    const translator = new SelectionTranslator(root, {
      getSettings: () => ({ showSelectionButton: true }),
      onOpen,
      onNewSelection,
      t,
    });
    translator.refresh();
    expect(translator.button.classList.contains('is-visible')).toBe(true);
    expect(onNewSelection).toHaveBeenCalledTimes(1);
    expect(translator.button.style.left).toBe('188px');
    translator.button.click();
    expect(onOpen).toHaveBeenCalledWith('translate me', expect.objectContaining({ bottom: 100 }));
    expect(translator.button.classList.contains('is-visible')).toBe(false);
    translator.refresh();
    expect(onNewSelection).toHaveBeenCalledTimes(1);
    expect(translator.button.classList.contains('is-visible')).toBe(false);
    translator.destroy();
    root.remove();
  });

  it('在视口边缘自动将按钮翻转到可见区域', () => {
    const root = document.createElement('div');
    document.body.append(root);
    const translator = new SelectionTranslator(root, {
      getSettings: () => ({ showSelectionButton: true }), onOpen: vi.fn(), t,
    });
    const width = window.innerWidth;
    const height = window.innerHeight;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 300 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 200 });
    translator.positionButton({ left: 270, right: 292, top: 160, bottom: 180, width: 22 });
    expect(translator.button.style.left).toBe('236px');
    expect(translator.button.style.top).toBe('126px');
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
    translator.destroy();
    root.remove();
  });

  it('仅在用户重新选择文本后通知关闭弹窗', () => {
    document.body.textContent = '';
    const first = document.createTextNode('first selection');
    const second = document.createTextNode('second selection');
    document.body.append(first, document.createElement('br'), second);
    const root = document.createElement('div');
    document.body.append(root);
    const onNewSelection = vi.fn();
    const translator = new SelectionTranslator(root, {
      getSettings: () => ({ showSelectionButton: true }), onOpen: vi.fn(), onNewSelection, t,
    });
    selectText(first, { left: 10, top: 10, right: 100, bottom: 30, width: 90, height: 20 });
    translator.refresh();
    translator.translateCurrent();
    translator.refresh();
    expect(onNewSelection).toHaveBeenCalledTimes(1);
    selectText(second, { left: 10, top: 50, right: 120, bottom: 70, width: 110, height: 20 });
    translator.refresh();
    expect(onNewSelection).toHaveBeenCalledTimes(2);
    expect(translator.button.classList.contains('is-visible')).toBe(true);
    translator.destroy();
    root.remove();
  });
});
