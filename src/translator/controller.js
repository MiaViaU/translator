import { scanTextNodesInIdle } from '../dom/walker.js';
import { TextReplacer } from '../dom/replacer.js';
import { IncrementalObserver } from '../dom/observer.js';

export class TranslationController {
  constructor({ provider, cache, getSettings, onProgress = () => {}, onError = () => {} }) {
    this.provider = provider;
    this.cache = cache;
    this.getSettings = getSettings;
    this.onProgress = onProgress;
    this.onError = onError;
    this.replacer = new TextReplacer();
    this.queue = Promise.resolve();
    this.enabled = false;
    this.generation = 0;
    this.observer = new IncrementalObserver((roots) => this.translateDynamicRoots(roots));
  }

  async translatePage() {
    const generation = ++this.generation;
    this.enabled = true;
    if (this.getSettings().translateDynamic) this.observer.start(document.body);
    return this.translateRoot(document.body, { visibleOnly: false, generation });
  }

  async translateVisible() {
    return this.translateRoot(document.body, { visibleOnly: true, generation: ++this.generation });
  }

  async translateRoot(root, { visibleOnly, generation }) {
    const pending = new Map();
    let translated = 0;
    const flush = async () => {
      if (!pending.size || generation !== this.generation) return;
      const nodes = [...pending.values()].flat();
      pending.clear();
      translated += await this.enqueueNodes(nodes, generation);
    };
    await scanTextNodesInIdle(root, this.getSettings(), {
      visibleOnly,
      onChunk: async (nodes) => {
        if (generation !== this.generation) return;
        for (const node of nodes) {
          const source = this.replacer.sourceFor(node);
          if (!source?.trim()) continue;
          const list = pending.get(source) || [];
          list.push(node);
          pending.set(source, list);
        }
        if (pending.size >= this.getSettings().batchSize) await flush();
      },
    });
    await flush();
    return translated;
  }

  enqueueNodes(nodes, generation = this.generation) {
    const task = this.queue.then(() => generation === this.generation ? this.translateNodes(nodes, generation) : 0);
    // 队列本身必须在失败后继续可用；但手动翻译调用者仍应收到真实错误，
    // 而不是把请求失败误报成“没有可翻译文本”。
    this.queue = task.catch(() => 0);
    return task;
  }

  async translateNodes(nodes, generation = this.generation) {
    const settings = this.getSettings();
    const byText = new Map();
    for (const node of nodes) {
      if (!node.isConnected) continue;
      const text = this.replacer.sourceFor(node);
      if (!text?.trim()) continue;
      const matching = byText.get(text) || [];
      matching.push(node);
      byText.set(text, matching);
    }
    const texts = [...byText.keys()];
    if (!texts.length) return 0;
    const translated = new Map();
    const missing = [];
    for (const text of texts) {
      const input = { sourceLanguage: settings.sourceLanguage, targetLanguage: settings.targetLanguage, text };
      const cached = settings.cacheEnabled ? this.cache.get(input) : undefined;
      if (cached !== undefined) translated.set(text, cached);
      else missing.push(text);
    }
    if (missing.length) {
      const results = await this.provider.translateBatch(missing, settings);
      if (generation !== this.generation) return 0;
      missing.forEach((text, index) => {
        const value = results[index];
        translated.set(text, value);
        if (settings.cacheEnabled) this.cache.set({ sourceLanguage: settings.sourceLanguage, targetLanguage: settings.targetLanguage, text }, value);
      });
    }
    let count = 0;
    for (const [text, matching] of byText) {
      for (const node of matching) {
        if (generation === this.generation && node.isConnected && this.replacer.sourceFor(node) === text && this.replacer.apply(node, translated.get(text))) count += 1;
      }
    }
    if (count) this.onProgress(count);
    return count;
  }

  async translateText(text, overrides = {}) {
    const settings = { ...this.getSettings(), ...overrides };
    const input = { sourceLanguage: settings.sourceLanguage, targetLanguage: settings.targetLanguage, text };
    const cached = settings.cacheEnabled ? this.cache.get(input) : undefined;
    if (cached !== undefined) return cached;
    const translated = await this.provider.translate(text, settings);
    if (settings.cacheEnabled) this.cache.set(input, translated);
    return translated;
  }

  translateDynamicRoots(roots) {
    if (!this.enabled || !this.getSettings().translateDynamic) return;
    const generation = this.generation;
    for (const root of roots) {
      if (root.nodeType === Node.TEXT_NODE && this.replacer.isOwnTranslation(root)) continue;
      this.queue = this.queue.then(async () => {
        if (generation !== this.generation) return;
        const nodes = [];
        await scanTextNodesInIdle(root, this.getSettings(), { onChunk: async (chunk) => nodes.push(...chunk) });
        if (generation === this.generation) await this.translateNodes(nodes, generation);
      }).catch(this.onError);
    }
  }

  restore() {
    this.generation += 1;
    this.enabled = false;
    this.observer.stop();
    return this.replacer.restoreAll();
  }

  refreshDynamicObserver() {
    if (!this.enabled) return;
    if (this.getSettings().translateDynamic) this.observer.start(document.body);
    else this.observer.stop();
  }
}
