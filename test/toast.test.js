import { describe, expect, it, vi } from 'vitest';
import { Toast } from '../src/ui/toast.js';

describe('Toast', () => {
  it('在右下角只保留最新的一条小型状态提示，并在指定时间后移除', () => {
    vi.useFakeTimers();
    const root = document.createElement('div');
    document.body.append(root);
    const toast = new Toast(root);
    toast.show('正在翻译…');
    toast.show('已翻译 3 段文本', { duration: 5000 });
    const notices = root.querySelectorAll('.tr-toast');
    expect(notices).toHaveLength(1);
    expect(notices[0].getAttribute('role')).toBe('status');
    expect(notices[0].querySelector('svg')).not.toBeNull();
    expect(notices[0].classList.contains('is-error')).toBe(false);
    vi.advanceTimersByTime(5000);
    expect(root.querySelectorAll('.tr-toast')).toHaveLength(0);
    vi.useRealTimers();
    root.remove();
  });

});
