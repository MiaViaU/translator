export class MemoryTranslationCache {
  constructor() {
    this.entries = new Map();
  }

  key({ sourceLanguage, targetLanguage, text }) {
    return JSON.stringify([sourceLanguage, targetLanguage, text]);
  }

  get(input) {
    return this.entries.get(this.key(input));
  }

  set(input, value) {
    this.entries.set(this.key(input), value);
  }

  clear() {
    this.entries.clear();
  }
}
