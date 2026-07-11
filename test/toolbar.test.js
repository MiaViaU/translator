import { describe, expect, it, vi } from 'vitest';
import { Toolbar, TOOLBAR_MODE } from '../src/ui/toolbar.js';
import { normalizeSettings } from '../src/config/defaults.js';

const t = (key) => key;
const actions = {
  translatePage: () => {}, translateVisible: () => {}, openInput: () => {}, restore: () => {}, openSettings: () => {},
};

function useImmediateAnimationFrames() {
  const original = globalThis.requestAnimationFrame;
  globalThis.requestAnimationFrame = (callback) => { callback(); return 1; };
  return () => { globalThis.requestAnimationFrame = original; };
}

describe('Toolbar', () => {
  it('在展开和收起之间稳定切换，收起按钮不会触发贴边隐藏', () => {
    const root = document.createElement('div');
    document.body.append(root);
    const restoreAnimationFrames = useImmediateAnimationFrames();
    const toolbar = new Toolbar(root, t, actions, { position: { left: 100, top: 120 } });
    toolbar.collapseButton.click();
    expect(toolbar.mode).toBe(TOOLBAR_MODE.COLLAPSED);
    expect(toolbar.bar.classList.contains('is-edge-hidden')).toBe(false);
    toolbar.collapseButton.click();
    expect(toolbar.mode).toBe(TOOLBAR_MODE.EXPANDED);
    restoreAnimationFrames();
    toolbar.destroy();
    root.remove();
  });

  it('切换展开收起时按最近边缘锚定：左侧向右展开，右侧向左展开', () => {
    const root = document.createElement('div');
    document.body.append(root);
    const restoreAnimationFrames = useImmediateAnimationFrames();
    const originalWidth = window.innerWidth;
    const originalClientWidth = document.documentElement.clientWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 800 });
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 785 });

    const leftToolbar = new Toolbar(root, t, actions, { position: { left: 40, top: 120 }, collapsed: true });
    Object.defineProperty(leftToolbar.bar, 'offsetWidth', { configurable: true, get: () => leftToolbar.mode === TOOLBAR_MODE.COLLAPSED ? 70 : 250 });
    leftToolbar.currentPosition = { left: 40, top: 120 };
    leftToolbar.collapseButton.click();
    expect(leftToolbar.bar.style.left).toBe('40px');

    const rightToolbar = new Toolbar(root, t, actions, { position: { left: 718, top: 180 }, collapsed: true });
    Object.defineProperty(rightToolbar.bar, 'offsetWidth', { configurable: true, get: () => rightToolbar.mode === TOOLBAR_MODE.COLLAPSED ? 70 : 250 });
    rightToolbar.currentPosition = { left: 718, top: 180 };
    rightToolbar.collapseButton.click();
    expect(rightToolbar.bar.style.left).toBe('523px');

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth });
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: originalClientWidth });
    restoreAnimationFrames();
    leftToolbar.destroy();
    rightToolbar.destroy();
    root.remove();
  });

  it('仅在拖动收起工具栏到边缘时进入贴边标签，点击标签恢复收起状态', () => {
    const root = document.createElement('div');
    document.body.append(root);
    const onStateChange = vi.fn();
    const restoreAnimationFrames = useImmediateAnimationFrames();
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 800 });
    const toolbar = new Toolbar(root, t, actions, { position: { left: 680, top: 120 }, collapsed: true, onStateChange });
    Object.defineProperty(toolbar.bar, 'offsetWidth', { configurable: true, get: () => 70 });
    Object.defineProperty(toolbar.bar, 'offsetHeight', { configurable: true, get: () => 46 });
    toolbar.bar.getBoundingClientRect = () => ({ left: 680, top: 120, width: 70, height: 46 });
    toolbar.dragHandle.dispatchEvent(new MouseEvent('pointerdown', { button: 0, clientX: 690, clientY: 130, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 795, clientY: 130 }));
    document.dispatchEvent(new MouseEvent('pointerup', { clientX: 795, clientY: 130 }));
    expect(toolbar.mode).toBe(TOOLBAR_MODE.EDGE_RIGHT);
    expect(toolbar.bar.classList.contains('is-edge-hidden')).toBe(true);
    expect(onStateChange).toHaveBeenCalledWith(expect.objectContaining({ toolbarMode: TOOLBAR_MODE.EDGE_RIGHT, toolbarEdgeRestoreMode: TOOLBAR_MODE.COLLAPSED }));
    toolbar.collapseButton.click();
    expect(toolbar.mode).toBe(TOOLBAR_MODE.COLLAPSED);
    expect(toolbar.bar.classList.contains('is-edge-hidden')).toBe(false);
    expect(toolbar.bar.style.left).toBe('718px');
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth });
    restoreAnimationFrames();
    toolbar.destroy();
    root.remove();
  });

  it('拖动展开工具栏时保持展开，只有吸附到边缘才变为贴边标签', () => {
    const root = document.createElement('div');
    document.body.append(root);
    const restoreAnimationFrames = useImmediateAnimationFrames();
    const toolbar = new Toolbar(root, t, actions, { position: { left: 200, top: 120 } });
    Object.defineProperty(toolbar.bar, 'offsetWidth', { configurable: true, get: () => 250 });
    Object.defineProperty(toolbar.bar, 'offsetHeight', { configurable: true, get: () => 46 });
    toolbar.bar.getBoundingClientRect = () => ({ left: 200, top: 120, width: 250, height: 46 });
    toolbar.dragHandle.dispatchEvent(new MouseEvent('pointerdown', { button: 0, clientX: 210, clientY: 130, bubbles: true }));
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 250, clientY: 140 }));
    document.dispatchEvent(new MouseEvent('pointerup', { clientX: 250, clientY: 140 }));
    expect(toolbar.mode).toBe(TOOLBAR_MODE.EXPANDED);
    expect(toolbar.bar.classList.contains('is-collapsed')).toBe(false);
    restoreAnimationFrames();
    toolbar.destroy();
    root.remove();
  });

  it('展开工具栏贴边后恢复展开，并保持在原来的边缘', () => {
    const root = document.createElement('div');
    document.body.append(root);
    const restoreAnimationFrames = useImmediateAnimationFrames();
    const originalWidth = window.innerWidth;
    const originalClientWidth = document.documentElement.clientWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 800 });
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 785 });
    const toolbar = new Toolbar(root, t, actions, { position: { left: 500, top: 120 } });
    Object.defineProperty(toolbar.bar, 'offsetWidth', { configurable: true, get: () => 250 });
    Object.defineProperty(toolbar.bar, 'offsetHeight', { configurable: true, get: () => 46 });
    toolbar.mode = TOOLBAR_MODE.EDGE_RIGHT;
    toolbar.edgeRestoreMode = TOOLBAR_MODE.EXPANDED;
    toolbar.currentPosition = { left: 770, top: 127 };
    toolbar.edgeCenterY = 144;
    toolbar.renderMode();
    toolbar.collapseButton.click();
    expect(toolbar.mode).toBe(TOOLBAR_MODE.EXPANDED);
    expect(toolbar.bar.style.left).toBe('523px');
    expect(toolbar.bar.style.top).toBe('121px');
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth });
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: originalClientWidth });
    restoreAnimationFrames();
    toolbar.destroy();
    root.remove();
  });

  it('右侧贴边按标签实际宽度完全显示，并以中心线定位', () => {
    const root = document.createElement('div');
    document.body.append(root);
    const restoreAnimationFrames = useImmediateAnimationFrames();
    const originalWidth = window.innerWidth;
    const originalClientWidth = document.documentElement.clientWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 800 });
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 785 });
    const toolbar = new Toolbar(root, t, actions, { mode: TOOLBAR_MODE.EDGE_RIGHT, edgeCenterY: 140 });
    Object.defineProperty(toolbar.bar, 'offsetWidth', { configurable: true, get: () => 30 });
    Object.defineProperty(toolbar.bar, 'offsetHeight', { configurable: true, get: () => 34 });
    toolbar.place({ left: 0, top: 123 });
    expect(toolbar.bar.style.left).toBe('755px');
    expect(toolbar.bar.style.top).toBe('123px');
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth });
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: originalClientWidth });
    restoreAnimationFrames();
    toolbar.destroy();
    root.remove();
  });

  it('恢复新版模式，并将旧隐藏状态迁移为可见的收起状态', () => {
    expect(normalizeSettings({ toolbarMode: 'edge-left' }).toolbarMode).toBe('edge-left');
    expect(normalizeSettings({ toolbarHidden: true }).toolbarMode).toBe('collapsed');
    expect(normalizeSettings({ toolbarEdgeHiddenV2: true }).toolbarMode).toBe('collapsed');
  });

  it('鼠标点击后不保留键盘焦点轮廓，键盘操作仍会恢复焦点样式', () => {
    const root = document.createElement('div');
    document.body.append(root);
    const toolbar = new Toolbar(root, t, actions);
    const action = toolbar.actions.querySelector('.tr-button');
    action.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(action.classList.contains('tr-pointer-focused')).toBe(true);
    action.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(action.classList.contains('tr-pointer-focused')).toBe(false);
    toolbar.destroy();
    root.remove();
  });
});
