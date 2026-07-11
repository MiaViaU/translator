import { describe, expect, it } from 'vitest';
import { collectTextNodes } from '../src/dom/walker.js';
import { MicrosoftProvider } from '../src/translator/microsoft.js';

describe.skip('审查发现的待修复回归用例', () => {
  it('不会收集由隐藏祖先遮蔽的文本', () => {
    document.body.replaceChildren();
    const visible = document.createElement('p');
    visible.textContent = 'Visible content';
    const hidden = document.createElement('div');
    hidden.style.display = 'none';
    hidden.append(document.createElement('span')).textContent = 'Confidential content';
    const transparent = document.createElement('div');
    transparent.style.opacity = '0';
    transparent.append(document.createElement('span')).textContent = 'Also confidential';
    document.body.append(visible, hidden, transparent);

    expect(collectTextNodes(document.body).map((node) => node.nodeValue.trim())).toEqual(['Visible content']);
  });

  it('会将超过服务上限的单条文本拆分后再合并结果', async () => {
    const requests = [];
    const provider = new MicrosoftProvider(async (details) => {
      if (details.url.includes('/auth')) return { status: 200, responseText: 'token' };
      const body = JSON.parse(details.data);
      requests.push(body);
      return {
        status: 200,
        responseText: JSON.stringify(body.map(({ Text }) => ({ translations: [{ text: Text }] }))),
      };
    });
    const text = 'a'.repeat(60_000);

    await expect(provider.translate(text, {
      sourceLanguage: 'auto',
      targetLanguage: 'zh-Hans',
      batchSize: 50,
      timeoutMs: 1_000,
    })).resolves.toBe(text);
    expect(requests.length).toBeGreaterThan(1);
    expect(requests.flat().every(({ Text }) => Text.length <= 50_000)).toBe(true);
  });
});
