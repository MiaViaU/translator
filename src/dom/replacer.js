export class TextReplacer {
  constructor() {
    this.records = new WeakMap();
    this.nodes = new Set();
  }

  sourceFor(node) {
    const record = this.records.get(node);
    if (!record) return node.nodeValue;
    if (node.nodeValue === record.translated) return record.original;
    this.records.delete(node);
    this.nodes.delete(node);
    return node.nodeValue;
  }

  isOwnTranslation(node) {
    const record = this.records.get(node);
    return Boolean(record && node.nodeValue === record.translated);
  }

  apply(node, translated) {
    const original = this.sourceFor(node);
    if (typeof original !== 'string' || node.nodeValue !== original && !this.records.has(node)) return false;
    node.nodeValue = translated;
    this.records.set(node, { original, translated });
    this.nodes.add(node);
    return true;
  }

  restoreAll() {
    let restored = 0;
    for (const node of this.nodes) {
      const record = this.records.get(node);
      if (!record || !node.isConnected) {
        this.records.delete(node);
        this.nodes.delete(node);
        continue;
      }
      if (node.nodeValue === record.translated) {
        node.nodeValue = record.original;
        restored += 1;
      }
      this.records.delete(node);
      this.nodes.delete(node);
    }
    return restored;
  }
}
