export class IncrementalObserver {
  constructor(onRoots) {
    this.onRoots = onRoots;
    this.observer = null;
  }

  start(root = document.body) {
    this.stop();
    this.observer = new MutationObserver((mutations) => {
      const roots = new Set();
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') roots.add(mutation.target);
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) roots.add(node);
        }
      }
      const compactRoots = [...roots].filter((rootNode) => ![...roots].some((other) => other !== rootNode && other.contains?.(rootNode)));
      if (compactRoots.length) this.onRoots(compactRoots);
    });
    this.observer.observe(root, { childList: true, characterData: true, subtree: true });
  }

  stop() {
    this.observer?.disconnect();
    this.observer = null;
  }
}
