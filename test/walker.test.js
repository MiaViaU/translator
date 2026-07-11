import { describe, expect, it } from 'vitest';
import { collectTextNodes, isTranslatableTextNode } from '../src/dom/walker.js';

describe('文本节点遍历', () => {
  it('跳过代码、表单和脚本节点', () => {
    document.body.textContent = '';
    const paragraph = document.createElement('p'); paragraph.textContent = 'Hello';
    const code = document.createElement('code'); code.textContent = 'const a = 1';
    const input = document.createElement('input'); input.value = 'Input';
    const script = document.createElement('script'); script.textContent = 'window.x = 1';
    const pre = document.createElement('pre'); pre.textContent = 'pre text';
    document.body.append(paragraph, code, input, script, pre);
    const texts = collectTextNodes(document.body).map((node) => node.nodeValue.trim());
    expect(texts).toEqual(['Hello']);
  });

  it('始终跳过代码块，即使传入旧版设置值', () => {
    document.body.textContent = '';
    const paragraph = document.createElement('p'); paragraph.textContent = 'Hello';
    const code = document.createElement('code'); code.textContent = 'const a = 1';
    const pre = document.createElement('pre'); pre.textContent = 'pre text';
    document.body.append(paragraph, code, pre);
    const texts = collectTextNodes(document.body, { translateCode: true }).map((node) => node.nodeValue.trim());
    expect(texts).toEqual(['Hello']);
    expect(isTranslatableTextNode(document.querySelector('code').firstChild, { translateCode: true })).toBe(false);
  });

  it('跳过网页明确标记为不翻译的内容、代码高亮容器和技术标识符', () => {
    document.body.textContent = '';
    const readable = document.createElement('p'); readable.textContent = 'Readable content';
    const noTranslate = document.createElement('span'); noTranslate.setAttribute('translate', 'no'); noTranslate.textContent = 'Brand Name';
    const classMarked = document.createElement('span'); classMarked.className = 'notranslate'; classMarked.textContent = 'Product Name';
    const highlighted = document.createElement('div'); highlighted.className = 'language-javascript highlight'; highlighted.textContent = 'const value = 1;';
    const editor = document.createElement('div'); editor.className = 'monaco-editor'; editor.textContent = 'function test() {}';
    const math = document.createElement('span'); math.className = 'katex'; math.textContent = 'x = y';
    const ruby = document.createElement('ruby'); ruby.innerHTML = '漢<rt>かん</rt>';
    const hidden = document.createElement('span'); hidden.hidden = true; hidden.textContent = 'Hidden label';
    const url = document.createElement('p'); url.textContent = 'https://example.com/path';
    document.body.append(readable, noTranslate, classMarked, highlighted, editor, math, ruby, hidden, url);

    const texts = collectTextNodes(document.body).map((node) => node.nodeValue.trim());
    expect(texts).toEqual(['Readable content']);
  });
});
