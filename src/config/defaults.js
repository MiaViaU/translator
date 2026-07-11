export const DEFAULT_SETTINGS = Object.freeze({
  sourceLanguage: 'auto',
  targetLanguage: 'zh-Hans',
  autoTranslate: false,
  autoTranslateBlacklist: [],
  translateDynamic: true,
  showSelectionButton: true,
  cacheEnabled: true,
  batchSize: 50,
  timeoutMs: 15_000,
  toolbarPosition: null,
  toolbarMode: 'expanded',
  toolbarEdgeRestoreMode: 'expanded',
  toolbarEdgeCenterY: null,
  toolbarCollapsed: false,
});

export const LANGUAGE_OPTIONS = [
  ['auto', '自动检测'],
  ['zh-Hans', '简体中文'],
  ['zh-Hant', '繁體中文'],
  ['en', 'English'],
  ['ja', '日本語'],
  ['ko', '한국어'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
  ['es', 'Español'],
  ['ru', 'Русский'],
];

function normalizeHostname(value) {
  const input = String(value || '').trim().toLowerCase();
  if (!input) return '';
  try {
    return new URL(input.includes('://') ? input : `https://${input}`).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function isAutoTranslateBlacklisted(hostname, blacklist = []) {
  const current = normalizeHostname(hostname);
  return Boolean(current && blacklist.some((entry) => current === entry || current.endsWith(`.${entry}`)));
}

export function normalizeSettings(value = {}) {
  const settings = { ...DEFAULT_SETTINGS };
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (key in value) settings[key] = value[key];
  }
  settings.batchSize = Math.min(100, Math.max(1, Number(settings.batchSize) || DEFAULT_SETTINGS.batchSize));
  settings.timeoutMs = Math.min(60_000, Math.max(3_000, Number(settings.timeoutMs) || DEFAULT_SETTINGS.timeoutMs));
  for (const key of ['autoTranslate', 'translateDynamic', 'showSelectionButton', 'cacheEnabled']) {
    settings[key] = Boolean(settings[key]);
  }
  settings.sourceLanguage = String(settings.sourceLanguage || 'auto');
  settings.targetLanguage = String(settings.targetLanguage || DEFAULT_SETTINGS.targetLanguage);
  const rawBlacklist = Array.isArray(settings.autoTranslateBlacklist)
    ? settings.autoTranslateBlacklist
    : String(settings.autoTranslateBlacklist || '').split(/[\n,]/);
  settings.autoTranslateBlacklist = [...new Set(rawBlacklist.map(normalizeHostname).filter(Boolean))].slice(0, 100);
  const validModes = new Set(['expanded', 'collapsed', 'edge-left', 'edge-right']);
  settings.toolbarMode = validModes.has(value.toolbarMode)
    ? value.toolbarMode
    : value.toolbarHidden || value.toolbarEdgeHiddenV2
      ? 'collapsed'
      : settings.toolbarCollapsed ? 'collapsed' : 'expanded';
  settings.toolbarCollapsed = settings.toolbarMode === 'collapsed';
  settings.toolbarEdgeRestoreMode = ['expanded', 'collapsed'].includes(settings.toolbarEdgeRestoreMode)
    ? settings.toolbarEdgeRestoreMode
    : 'expanded';
  settings.toolbarEdgeCenterY = Number.isFinite(Number(settings.toolbarEdgeCenterY))
    ? Number(settings.toolbarEdgeCenterY)
    : null;
  if (settings.toolbarPosition && Number.isFinite(Number(settings.toolbarPosition.left)) && Number.isFinite(Number(settings.toolbarPosition.top))) {
    settings.toolbarPosition = { left: Number(settings.toolbarPosition.left), top: Number(settings.toolbarPosition.top) };
  } else {
    settings.toolbarPosition = null;
  }
  return settings;
}
