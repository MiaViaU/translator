import { describe, expect, it } from 'vitest';
import { TextReplacer } from '../src/dom/replacer.js';

describe('TextReplacer', () => {
  it('只修改文本节点并能恢复原文', () => {
    document.body.textContent = '';
    const paragraph = document.createElement('p');
    paragraph.append('Hello ', document.createElement('strong'));
    paragraph.lastChild.textContent = 'world';
    document.body.append(paragraph);
    const replacer = new TextReplacer();
    const node = paragraph.firstChild;
    expect(replacer.apply(node, '你好 ')).toBe(true);
    expect(paragraph.outerHTML).toBe('<p>你好 <strong>world</strong></p>');
    expect(replacer.restoreAll()).toBe(1);
    expect(paragraph.outerHTML).toBe('<p>Hello <strong>world</strong></p>');
  });

  it('网页自行改写节点后不会被恢复操作覆盖', () => {
    document.body.textContent = '';
    const node = document.createTextNode('Hello');
    document.body.append(node);
    const replacer = new TextReplacer();
    replacer.apply(node, '你好');
    node.nodeValue = '网站更新';
    expect(replacer.restoreAll()).toBe(0);
    expect(node.nodeValue).toBe('网站更新');
  });
});
