import { describe, expect, it } from 'vitest';
import { MicrosoftProvider } from '../src/translator/microsoft.js';

const options = { sourceLanguage: 'auto', targetLanguage: 'zh-Hans', batchSize: 50, timeoutMs: 1000 };

describe('MicrosoftProvider', () => {
  it('获取令牌后批量翻译文本', async () => {
    const requests = [];
    const provider = new MicrosoftProvider(async (details) => {
      requests.push(details);
      if (details.url.includes('/auth')) return { status: 200, responseText: 'token-a' };
      return { status: 200, responseText: JSON.stringify([{ translations: [{ text: '你好' }] }, { translations: [{ text: '世界' }] }]) };
    });
    await expect(provider.translateBatch(['hello', 'world'], options)).resolves.toEqual(['你好', '世界']);
    expect(requests).toHaveLength(2);
    expect(requests[1].url).toContain('to=zh-Hans');
    expect(JSON.parse(requests[1].data)).toEqual([{ Text: 'hello' }, { Text: 'world' }]);
  });

  it('鉴权失败时刷新令牌并只重试一次', async () => {
    let call = 0;
    const provider = new MicrosoftProvider(async (details) => {
      call += 1;
      if (details.url.includes('/auth')) return { status: 200, responseText: `token-${call}` };
      if (call === 2) return { status: 401, responseText: '' };
      return { status: 200, responseText: JSON.stringify([{ translations: [{ text: '你好' }] }]) };
    });
    await expect(provider.translate('hello', options)).resolves.toBe('你好');
    expect(call).toBe(4);
  });
});
