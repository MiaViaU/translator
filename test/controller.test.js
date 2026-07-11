import { describe, expect, it } from 'vitest';
import { MemoryTranslationCache } from '../src/utils/cache.js';
import { TranslationController } from '../src/translator/controller.js';

const settings = {
  sourceLanguage: 'auto', targetLanguage: 'zh-Hans',
  cacheEnabled: true, batchSize: 50, timeoutMs: 1000, translateCode: false, translateDynamic: false,
};

describe('TranslationController', () => {
  it('恢复操作会取消尚未完成的翻译写入', async () => {
    document.body.textContent = 'Hello';
    const provider = {
      async translateBatch(texts) {
        await new Promise((resolve) => setTimeout(resolve, 20));
        return texts.map(() => '你好');
      },
    };
    const controller = new TranslationController({ provider, cache: new MemoryTranslationCache(), getSettings: () => settings });
    const pending = controller.translatePage();
    await new Promise((resolve) => setTimeout(resolve, 1));
    controller.restore();
    await pending;
    expect(document.body.textContent).toBe('Hello');
  });

  it('手动翻译请求失败时向调用方返回错误，而不是误报没有文本', async () => {
    document.body.textContent = 'Hello';
    const provider = { async translateBatch() { throw new Error('服务暂不可用'); } };
    const controller = new TranslationController({ provider, cache: new MemoryTranslationCache(), getSettings: () => settings });
    await expect(controller.translatePage()).rejects.toThrow('服务暂不可用');
  });
});
