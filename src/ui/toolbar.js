import { button, element } from './dom.js';

const EDGE_GAP = 12;
const EDGE_SNAP_DISTANCE = 28;

export const TOOLBAR_MODE = Object.freeze({
  EXPANDED: 'expanded',
  COLLAPSED: 'collapsed',
  EDGE_LEFT: 'edge-left',
  EDGE_RIGHT: 'edge-right',
});

function chevronIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 18 18');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M10.75 5.5 7 9l3.75 3.5');
  svg.append(path);
  return svg;
}

function dragIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 18 18');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  for (const [cx, cy] of [[6, 4], [12, 4], [6, 9], [12, 9], [6, 14], [12, 14]]) {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', String(cx));
    dot.setAttribute('cy', String(cy));
    dot.setAttribute('r', '1.3');
    svg.append(dot);
  }
  return svg;
}

function normalizeMode(mode, { collapsed = false } = {}) {
  if (Object.values(TOOLBAR_MODE).includes(mode)) return mode;
  return collapsed ? TOOLBAR_MODE.COLLAPSED : TOOLBAR_MODE.EXPANDED;
}

function viewportWidth() {
  return document.documentElement.clientWidth || window.innerWidth;
}

export class Toolbar {
  constructor(root, t, actions, { position = null, mode, collapsed = false, edgeRestoreMode = TOOLBAR_MODE.EXPANDED, edgeCenterY = null, onStateChange = () => {} } = {}) {
    this.t = t;
    this.onStateChange = onStateChange;
    this.mode = normalizeMode(mode, { collapsed });
    this.edgeRestoreMode = [TOOLBAR_MODE.EXPANDED, TOOLBAR_MODE.COLLAPSED].includes(edgeRestoreMode)
      ? edgeRestoreMode
      : TOOLBAR_MODE.EXPANDED;
    this.edgeCenterY = Number.isFinite(Number(edgeCenterY)) ? Number(edgeCenterY) : null;
    this.preferredPosition = position;
    this.bar = element('nav', { className: 'tr-toolbar', attributes: { 'aria-label': t('translatePage') } });
    this.dragHandle = button('', t('dragToolbar'), (event) => event.preventDefault(), 'tr-toolbar-drag');
    this.dragHandle.append(dragIcon());
    this.actions = element('div', { className: 'tr-toolbar-actions' });
    this.actions.append(
      button('文', t('translatePage'), actions.translatePage),
      button('◉', t('translateVisible'), actions.translateVisible),
      button('⌁', t('inputTranslate'), actions.openInput),
      button('↺', t('restore'), actions.restore),
      button('⚙', t('settings'), actions.openSettings),
    );
    this.actions.addEventListener('pointerdown', (event) => event.target.closest?.('.tr-button')?.classList.add('tr-pointer-focused'));
    this.actions.addEventListener('keydown', () => this.actions.querySelectorAll('.tr-pointer-focused').forEach((node) => node.classList.remove('tr-pointer-focused')));
    this.collapseButton = button('', t('collapseToolbar'), () => this.toggleCollapsed(), 'tr-toolbar-collapse');
    this.collapseButton.append(chevronIcon());
    this.bar.append(this.dragHandle, this.actions, this.collapseButton);
    this.dragHandle.addEventListener('pointerdown', (event) => this.startDrag(event));
    this.onResize = () => {
      cancelAnimationFrame(this.resizeFrame);
      this.resizeFrame = requestAnimationFrame(() => this.place());
    };
    window.addEventListener('resize', this.onResize, { passive: true });
    window.visualViewport?.addEventListener('resize', this.onResize, { passive: true });
    root.append(this.bar);
    this.renderMode();
    requestAnimationFrame(() => this.place());
  }

  get isEdgeHidden() { return this.mode === TOOLBAR_MODE.EDGE_LEFT || this.mode === TOOLBAR_MODE.EDGE_RIGHT; }
  get collapsed() { return this.mode === TOOLBAR_MODE.COLLAPSED; }

  toggleCollapsed() {
    if (this.isEdgeHidden) {
      this.restoreFromEdge();
      return;
    }
    this.setMode(this.mode === TOOLBAR_MODE.COLLAPSED ? TOOLBAR_MODE.EXPANDED : TOOLBAR_MODE.COLLAPSED);
  }

  restoreFromEdge() {
    const edge = this.mode;
    const centerY = this.edgeCenterY ?? (this.currentPosition.top + this.bar.offsetHeight / 2);
    this.mode = this.edgeRestoreMode;
    this.edgeCenterY = null;
    this.renderMode();
    requestAnimationFrame(() => {
      const width = this.bar.offsetWidth;
      this.preferredPosition = {
        left: edge === TOOLBAR_MODE.EDGE_LEFT ? EDGE_GAP : viewportWidth() - width - EDGE_GAP,
        top: centerY - this.bar.offsetHeight / 2,
      };
      this.place();
      this.persist();
    });
  }

  setMode(mode, persist = true) {
    const previous = this.currentPosition && !this.isEdgeHidden
      ? { ...this.currentPosition, width: this.bar.offsetWidth }
      : null;
    this.mode = normalizeMode(mode);
    this.renderMode();
    if (persist) this.persist();
    requestAnimationFrame(() => {
      if (previous) {
        const isLeftAnchored = previous.left + previous.width / 2 < viewportWidth() / 2;
        this.preferredPosition = {
          left: isLeftAnchored ? previous.left : previous.left + previous.width - this.bar.offsetWidth,
          top: previous.top,
        };
      }
      this.place();
    });
  }

  renderMode() {
    const edgeLeft = this.mode === TOOLBAR_MODE.EDGE_LEFT;
    const edgeRight = this.mode === TOOLBAR_MODE.EDGE_RIGHT;
    this.bar.classList.toggle('is-collapsed', this.mode === TOOLBAR_MODE.COLLAPSED);
    this.bar.classList.toggle('is-edge-hidden', edgeLeft || edgeRight);
    this.bar.classList.toggle('is-hidden-left', edgeLeft);
    const key = this.isEdgeHidden ? 'showToolbar' : this.mode === TOOLBAR_MODE.COLLAPSED ? 'expandToolbar' : 'collapseToolbar';
    this.collapseButton.setAttribute('title', this.t(key));
    this.collapseButton.setAttribute('aria-label', this.t(key));
  }

  place(position = this.preferredPosition) {
    if (position) this.preferredPosition = { left: position.left, top: position.top };
    const availableWidth = viewportWidth();
    const preferred = this.preferredPosition || { left: availableWidth - this.bar.offsetWidth - 20, top: window.innerHeight - this.bar.offsetHeight - 20 };
    const width = this.bar.offsetWidth;
    const height = this.bar.offsetHeight;
    const maxLeft = Math.max(EDGE_GAP, availableWidth - width - EDGE_GAP);
    const maxTop = Math.max(EDGE_GAP, window.innerHeight - height - EDGE_GAP);
    const left = this.mode === TOOLBAR_MODE.EDGE_LEFT
      ? 0
      : this.mode === TOOLBAR_MODE.EDGE_RIGHT
        ? availableWidth - width
        : Math.max(EDGE_GAP, Math.min(maxLeft, preferred.left));
    const requestedTop = this.isEdgeHidden && this.edgeCenterY !== null
      ? this.edgeCenterY - height / 2
      : preferred.top;
    const top = Math.max(EDGE_GAP, Math.min(maxTop, requestedTop));
    this.currentPosition = { left, top };
    this.bar.style.left = `${Math.round(left)}px`;
    this.bar.style.top = `${Math.round(top)}px`;
    this.bar.style.right = 'auto';
    this.bar.style.bottom = 'auto';
  }

  snapMode(position, fallbackMode) {
    if (position.left <= EDGE_SNAP_DISTANCE) return TOOLBAR_MODE.EDGE_LEFT;
    if (position.left + this.bar.offsetWidth >= viewportWidth() - EDGE_SNAP_DISTANCE) return TOOLBAR_MODE.EDGE_RIGHT;
    return fallbackMode;
  }

  startDrag(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    const rect = this.bar.getBoundingClientRect();
    const origin = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
    const dragStartMode = this.isEdgeHidden ? TOOLBAR_MODE.COLLAPSED : this.mode;
    let moved = false;
    const move = (nextEvent) => {
      const deltaX = nextEvent.clientX - origin.x;
      const deltaY = nextEvent.clientY - origin.y;
      if (!moved && Math.hypot(deltaX, deltaY) < 4) return;
      moved = true;
      this.bar.classList.add('is-dragging');
      this.place({ left: origin.left + deltaX, top: origin.top + deltaY });
    };
    const end = () => {
      document.removeEventListener('pointermove', move, true);
      document.removeEventListener('pointerup', end, true);
      this.bar.classList.remove('is-dragging');
      if (!moved) return;
      const nextMode = this.snapMode(this.currentPosition, dragStartMode);
      if (nextMode === TOOLBAR_MODE.EDGE_LEFT || nextMode === TOOLBAR_MODE.EDGE_RIGHT) {
        this.edgeRestoreMode = dragStartMode;
        this.edgeCenterY = this.currentPosition.top + this.bar.offsetHeight / 2;
      }
      this.mode = nextMode;
      if (!this.isEdgeHidden) this.edgeCenterY = null;
      if (!this.isEdgeHidden) this.preferredPosition = { ...this.currentPosition };
      this.renderMode();
      this.place();
      this.persist();
    };
    document.addEventListener('pointermove', move, true);
    document.addEventListener('pointerup', end, true);
  }

  persist() {
    this.onStateChange({
      toolbarMode: this.mode,
      toolbarEdgeRestoreMode: this.edgeRestoreMode,
      toolbarEdgeCenterY: this.edgeCenterY,
      toolbarCollapsed: this.mode === TOOLBAR_MODE.COLLAPSED,
      toolbarPosition: this.preferredPosition || this.currentPosition,
    });
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    window.visualViewport?.removeEventListener('resize', this.onResize);
    cancelAnimationFrame(this.resizeFrame);
    this.bar.remove();
  }
}
