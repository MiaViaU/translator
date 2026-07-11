import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, isAutoTranslateBlacklisted, normalizeSettings } from '../src/config/defaults.js';
import { Dialog, openSettings } from '../src/ui/dialog.js';

const t = (key, values = {}) => key.replace(/\{(\w+)\}/g, (_, name) => values[name] || '');

describe('设置页', () => {
  it('仅展示微软翻译可用的设置，并保存填写的值', async () => {
    const root = document.createElement('div');
    document.body.append(root);
    const dialog = new Dialog(root);
    let saved;
    openSettings(dialog, t, DEFAULT_SETTINGS, async (value) => { saved = value; });

    expect(root.querySelector('.tr-combobox')).not.toBeNull();
    expect(root.querySelector('.tr-textarea')).not.toBeNull();
    expect(root.textContent).not.toContain('translateCode');
    root.querySelector('.tr-primary').click();
    await Promise.resolve();

    expect(saved).toMatchObject({
      sourceLanguage: DEFAULT_SETTINGS.sourceLanguage,
      targetLanguage: DEFAULT_SETTINGS.targetLanguage,
    });
    expect(saved).not.toHaveProperty('translateCode');
    root.remove();
  });

  it('规范化自动翻译黑名单，并匹配域名及其子域名', () => {
    const settings = normalizeSettings({ autoTranslateBlacklist: 'https://www.example.com/path\nnews.example.org\ninvalid host' });
    expect(settings.autoTranslateBlacklist).toEqual(['example.com', 'news.example.org']);
    expect(isAutoTranslateBlacklisted('docs.example.com', settings.autoTranslateBlacklist)).toBe(true);
    expect(isAutoTranslateBlacklisted('example.org', settings.autoTranslateBlacklist)).toBe(false);
  });
});
