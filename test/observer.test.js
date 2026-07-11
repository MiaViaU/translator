import { describe, expect, it } from 'vitest';
import { IncrementalObserver } from '../src/dom/observer.js';

describe('IncrementalObserver', () => {
  it('仅上报新增的 DOM 根节点', async () => {
    document.body.textContent = '';
    let roots = [];
    const observer = new IncrementalObserver((nextRoots) => { roots = nextRoots; });
    observer.start(document.body);
    const paragraph = document.createElement('p');
    paragraph.textContent = 'new content';
    document.body.append(paragraph);
    await new Promise((resolve) => setTimeout(resolve, 0));
    observer.stop();
    expect(roots).toEqual([paragraph]);
  });
});
