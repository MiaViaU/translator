import { describe, expect, it } from 'vitest';
import { MemoryTranslationCache } from '../src/utils/cache.js';

describe('MemoryTranslationCache', () => {
  it('按翻译源、语言和原文隔离缓存', () => {
    const cache = new MemoryTranslationCache();
    const input = { sourceLanguage: 'auto', targetLanguage: 'zh-Hans', text: 'hello' };
    cache.set(input, '你好');
    expect(cache.get(input)).toBe('你好');
    expect(cache.get({ ...input, targetLanguage: 'en' })).toBeUndefined();
    expect(cache.get({ ...input, text: 'Hello' })).toBeUndefined();
  });
});
