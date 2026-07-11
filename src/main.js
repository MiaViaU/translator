import { createI18n } from './i18n/index.js';
import { isAutoTranslateBlacklisted } from './config/defaults.js';
import { MemoryTranslationCache } from './utils/cache.js';
import { createGmApi } from './utils/gm.js';
import { whenIdle } from './utils/idle.js';
import { SettingsStore } from './utils/storage.js';
import { MicrosoftProvider } from './translator/microsoft.js';
import { TranslationController } from './translator/controller.js';
import { createUiRoot } from './ui/root.js';
import { Toolbar } from './ui/toolbar.js';
import { Toast } from './ui/toast.js';
import { Dialog, openSettings } from './ui/dialog.js';
import { TranslationInputPopup } from './selection/popup.js';
import { SelectionTranslator } from './selection/selection.js';

async function bootstrap() {
  // MVP 不处理 iframe 内容；此保护可避免子框架中重复初始化整套 UI。
  if (window.self !== window.top) return;
  if (document.contentType?.includes('xml')) return;
  const t = createI18n();
  const api = createGmApi();
  const settingsStore = new SettingsStore(api);
  let settings = await settingsStore.load();
  const { root } = createUiRoot();
  const toast = new Toast(root);
  const dialog = new Dialog(root);
  const provider = new MicrosoftProvider((details) => api.request(details));
  let toolbar;
  const controller = new TranslationController({
    provider,
    cache: new MemoryTranslationCache(),
    getSettings: () => settings,
    onProgress: (count) => toast.show(t('translated', { count })),
    onError: (error) => console.error('[translator-userscript]', error),
  });
  const popup = new TranslationInputPopup(root, t, toast, {
    getSettings: () => settings,
    translate: (text, overrides) => controller.translateText(text, overrides),
  });

  const runPage = async () => {
    toast.show(t('translating'), { duration: 60_000 });
    try {
      await controller.translatePage();
    } catch (error) {
      console.error('[translator-userscript]', error);
    }
  };
  const runVisible = async () => {
    toast.show(t('translating'), { duration: 60_000 });
    try {
      await controller.translateVisible();
    } catch (error) {
      console.error('[translator-userscript]', error);
    }
  };
  const restore = () => {
    const count = controller.restore();
    toast.show(t('restored', { count }));
  };
  const saveSettings = async (next) => {
    settings = await settingsStore.save(next);
    controller.refreshDynamicObserver();
  };
  const showSettings = () => openSettings(dialog, t, settings, saveSettings);
  const openInput = () => popup.open();
  let toolbarSaveQueue = Promise.resolve();
  const saveToolbarState = (patch) => {
    toolbarSaveQueue = toolbarSaveQueue.then(async () => {
      settings = await settingsStore.save({ ...settings, ...patch });
    });
    return toolbarSaveQueue;
  };

  toolbar = new Toolbar(root, t, {
    translatePage: runPage,
    translateVisible: runVisible,
    openInput,
    restore,
    openSettings: showSettings,
  }, {
    position: settings.toolbarPosition,
    mode: settings.toolbarMode,
    edgeRestoreMode: settings.toolbarEdgeRestoreMode,
    edgeCenterY: settings.toolbarEdgeCenterY,
    collapsed: settings.toolbarCollapsed,
    onStateChange: saveToolbarState,
  });
  new SelectionTranslator(root, {
    getSettings: () => settings,
    onOpen: (text) => popup.open({ text, autoTranslate: true }),
    onNewSelection: () => popup.close(),
    t,
  });

  api.registerMenuCommand(t('translatePage'), runPage);
  api.registerMenuCommand(t('translateVisible'), runVisible);
  api.registerMenuCommand(t('inputTranslate'), openInput);
  api.registerMenuCommand(t('restore'), restore);
  api.registerMenuCommand(t('settings'), showSettings);

  if (settings.autoTranslate && !isAutoTranslateBlacklisted(location.hostname, settings.autoTranslateBlacklist)) {
    await whenIdle();
    runPage();
  }
}

bootstrap().catch((error) => console.error('[translator-userscript]', error));
