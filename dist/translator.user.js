// ==UserScript==
// @name         网页翻译助手 MVP
// @namespace    https://github.com/local/translator-userscript
// @version      0.1.3
// @description  高性能、模块化的网页与划词翻译工具
// @author       MiaViaU
// @license      MIT
// @match        *://*/*
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      edge.microsoft.com
// @connect      api-edge.cognitive.microsofttranslator.com
// @run-at       document-idle
// @noframes
// ==/UserScript==
(() => {
  // src/i18n/index.js
  var messages = {
    "zh-CN": {
      translatePage: "\u7FFB\u8BD1\u6574\u9875",
      menuTranslatePage: "\u5168\u9875\u7FFB\u8BD1",
      menuTranslateSelection: "\u7FFB\u8BD1\u9009\u4E2D",
      translateVisible: "\u7FFB\u8BD1\u53EF\u89C6\u533A",
      restore: "\u6062\u590D\u539F\u6587",
      settings: "\u8BBE\u7F6E",
      translating: "\u6B63\u5728\u7FFB\u8BD1\u2026",
      translated: "\u5DF2\u7FFB\u8BD1 {count} \u6BB5\u6587\u672C",
      restored: "\u5DF2\u6062\u590D {count} \u6BB5\u539F\u6587",
      noText: "\u6CA1\u6709\u627E\u5230\u53EF\u7FFB\u8BD1\u7684\u6587\u672C",
      noSelection: "\u8BF7\u5148\u9009\u4E2D\u6587\u672C",
      error: "\u7FFB\u8BD1\u5931\u8D25\uFF1A{message}",
      selectionTranslate: "\u7FFB\u8BD1\u9009\u4E2D\u6587\u672C",
      inputTranslate: "\u8F93\u5165\u7FFB\u8BD1",
      translate: "\u7FFB\u8BD1",
      inputPlaceholder: "\u8F93\u5165\u6216\u7C98\u8D34\u8981\u7FFB\u8BD1\u7684\u6587\u672C\u2026",
      inputRequired: "\u8BF7\u8F93\u5165\u8981\u7FFB\u8BD1\u7684\u6587\u672C",
      translationPlaceholder: "\u8BD1\u6587\u5C06\u663E\u793A\u5728\u8FD9\u91CC",
      inputShortcut: "Enter \u7FFB\u8BD1 \xB7 Shift+Enter \u6362\u884C",
      dragToolbar: "\u62D6\u52A8\u5DE5\u5177\u680F",
      collapseToolbar: "\u6536\u8D77\u5DE5\u5177\u680F",
      expandToolbar: "\u5C55\u5F00\u5DE5\u5177\u680F",
      showToolbar: "\u663E\u793A\u5DE5\u5177\u680F",
      close: "\u5173\u95ED",
      original: "\u539F\u6587",
      translation: "\u8BD1\u6587",
      copy: "\u590D\u5236",
      copied: "\u5DF2\u590D\u5236",
      copyFailed: "\u590D\u5236\u5931\u8D25",
      save: "\u4FDD\u5B58",
      cancel: "\u53D6\u6D88",
      sourceLanguage: "\u6E90\u8BED\u8A00",
      targetLanguage: "\u76EE\u6807\u8BED\u8A00",
      autoTranslate: "\u81EA\u52A8\u7FFB\u8BD1\u9875\u9762",
      enableAutoTranslateForSite: "\u5F53\u524D\u7F51\u7AD9\u9ED8\u8BA4\u81EA\u52A8\u7FFB\u8BD1",
      disableAutoTranslateForSite: "\u5F53\u524D\u7F51\u7AD9\u9ED8\u8BA4\u4E0D\u81EA\u52A8\u7FFB\u8BD1",
      siteAutoTranslateEnabled: "\u5DF2\u8BBE\u4E3A\u81EA\u52A8\u7FFB\u8BD1\u5F53\u524D\u7F51\u7AD9",
      siteAutoTranslateDisabled: "\u5DF2\u8BBE\u4E3A\u4E0D\u81EA\u52A8\u7FFB\u8BD1\u5F53\u524D\u7F51\u7AD9",
      siteAutoTranslateStatusEnabled: "\u5F53\u524D\uFF1A\u9ED8\u8BA4\u7FFB\u8BD1",
      siteAutoTranslateStatusDisabled: "\u5F53\u524D\uFF1A\u9ED8\u8BA4\u4E0D\u7FFB\u8BD1",
      translateDynamic: "\u7FFB\u8BD1\u52A8\u6001\u5185\u5BB9",
      showSelectionButton: "\u663E\u793A\u5212\u8BCD\u6309\u94AE",
      cacheEnabled: "\u542F\u7528\u5185\u5B58\u7F13\u5B58",
      batchSize: "\u6279\u91CF\u5927\u5C0F",
      timeoutMs: "\u8BF7\u6C42\u8D85\u65F6\uFF08\u6BEB\u79D2\uFF09",
      settingsSaved: "\u8BBE\u7F6E\u5DF2\u4FDD\u5B58",
      tokenFailed: "\u5FAE\u8F6F\u7FFB\u8BD1\u6388\u6743\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5"
    },
    "en-US": {
      translatePage: "Translate page",
      menuTranslatePage: "Translate full page",
      menuTranslateSelection: "Translate selection",
      translateVisible: "Translate visible area",
      restore: "Restore original",
      settings: "Settings",
      translating: "Translating\u2026",
      translated: "Translated {count} text nodes",
      restored: "Restored {count} original nodes",
      noText: "No translatable text found",
      noSelection: "Select text to translate first",
      error: "Translation failed: {message}",
      selectionTranslate: "Translate selection",
      inputTranslate: "Text translation",
      translate: "Translate",
      inputPlaceholder: "Type or paste text to translate\u2026",
      inputRequired: "Enter text to translate",
      translationPlaceholder: "The translation will appear here",
      inputShortcut: "Enter to translate \xB7 Shift+Enter for a new line",
      dragToolbar: "Drag toolbar",
      collapseToolbar: "Collapse toolbar",
      expandToolbar: "Expand toolbar",
      showToolbar: "Show toolbar",
      close: "Close",
      original: "Original",
      translation: "Translation",
      copy: "Copy",
      copied: "Copied",
      copyFailed: "Copy failed",
      save: "Save",
      cancel: "Cancel",
      sourceLanguage: "Source language",
      targetLanguage: "Target language",
      autoTranslate: "Translate pages automatically",
      enableAutoTranslateForSite: "Automatically translate this site",
      disableAutoTranslateForSite: "Do not automatically translate this site",
      siteAutoTranslateEnabled: "This site will be translated automatically",
      siteAutoTranslateDisabled: "This site will not be translated automatically",
      siteAutoTranslateStatusEnabled: "Current: translate by default",
      siteAutoTranslateStatusDisabled: "Current: do not translate by default",
      translateDynamic: "Translate dynamic content",
      showSelectionButton: "Show selection button",
      cacheEnabled: "Enable memory cache",
      batchSize: "Batch size",
      timeoutMs: "Request timeout (ms)",
      settingsSaved: "Settings saved",
      tokenFailed: "Microsoft authorization failed. Please try again later."
    }
  };
  function createI18n(locale = navigator.language) {
    const table = messages[locale] || messages[locale?.startsWith("en") ? "en-US" : "zh-CN"];
    return (key, values = {}) => (table[key] || messages["zh-CN"][key] || key).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
  }

  // src/config/defaults.js
  var DEFAULT_SETTINGS = Object.freeze({
    sourceLanguage: "auto",
    targetLanguage: "zh-Hans",
    autoTranslate: false,
    siteAutoTranslatePreferences: {},
    translateDynamic: true,
    showSelectionButton: true,
    cacheEnabled: true,
    batchSize: 50,
    timeoutMs: 15e3,
    toolbarPosition: null,
    toolbarMode: "expanded",
    toolbarEdgeRestoreMode: "expanded",
    toolbarEdgeCenterY: null,
    toolbarCollapsed: false
  });
  var LANGUAGE_OPTIONS = [
    ["auto", "\u81EA\u52A8\u68C0\u6D4B"],
    ["zh-Hans", "\u7B80\u4F53\u4E2D\u6587"],
    ["zh-Hant", "\u7E41\u9AD4\u4E2D\u6587"],
    ["en", "English"],
    ["ja", "\u65E5\u672C\u8A9E"],
    ["ko", "\uD55C\uAD6D\uC5B4"],
    ["fr", "Fran\xE7ais"],
    ["de", "Deutsch"],
    ["es", "Espa\xF1ol"],
    ["ru", "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"]
  ];
  function normalizeHostname(value) {
    const input = String(value || "").trim().toLowerCase();
    if (!input) return "";
    try {
      return new URL(input.includes("://") ? input : `https://${input}`).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  }
  function getSiteAutoTranslatePreference(hostname, preferences = {}) {
    const current = normalizeHostname(hostname);
    if (!current || typeof preferences !== "object") return void 0;
    const segments = current.split(".");
    for (let index = 0; index < segments.length - 1; index += 1) {
      const preference = preferences[segments.slice(index).join(".")];
      if (typeof preference === "boolean") return preference;
    }
    return void 0;
  }
  function shouldAutoTranslateSite(hostname, settings) {
    const preference = getSiteAutoTranslatePreference(hostname, settings.siteAutoTranslatePreferences);
    return preference === void 0 ? settings.autoTranslate : preference;
  }
  function normalizeSettings(value = {}) {
    const settings = { ...DEFAULT_SETTINGS };
    for (const key of Object.keys(DEFAULT_SETTINGS)) {
      if (key in value) settings[key] = value[key];
    }
    settings.batchSize = Math.min(100, Math.max(1, Number(settings.batchSize) || DEFAULT_SETTINGS.batchSize));
    settings.timeoutMs = Math.min(6e4, Math.max(3e3, Number(settings.timeoutMs) || DEFAULT_SETTINGS.timeoutMs));
    for (const key of ["autoTranslate", "translateDynamic", "showSelectionButton", "cacheEnabled"]) {
      settings[key] = Boolean(settings[key]);
    }
    settings.sourceLanguage = String(settings.sourceLanguage || "auto");
    settings.targetLanguage = String(settings.targetLanguage || DEFAULT_SETTINGS.targetLanguage);
    const preferences = value.siteAutoTranslatePreferences && typeof value.siteAutoTranslatePreferences === "object" ? value.siteAutoTranslatePreferences : {};
    settings.siteAutoTranslatePreferences = {};
    for (const [hostname, enabled] of Object.entries(preferences)) {
      const normalizedHostname = normalizeHostname(hostname);
      if (normalizedHostname && typeof enabled === "boolean") settings.siteAutoTranslatePreferences[normalizedHostname] = enabled;
    }
    const legacyBlacklist = Array.isArray(value.autoTranslateBlacklist) ? value.autoTranslateBlacklist : String(value.autoTranslateBlacklist || "").split(/[\n,]/);
    for (const hostname of legacyBlacklist) {
      const normalizedHostname = normalizeHostname(hostname);
      if (normalizedHostname && !(normalizedHostname in settings.siteAutoTranslatePreferences)) {
        settings.siteAutoTranslatePreferences[normalizedHostname] = false;
      }
    }
    const validModes = /* @__PURE__ */ new Set(["expanded", "collapsed", "edge-left", "edge-right"]);
    settings.toolbarMode = validModes.has(value.toolbarMode) ? value.toolbarMode : value.toolbarHidden || value.toolbarEdgeHiddenV2 ? "collapsed" : settings.toolbarCollapsed ? "collapsed" : "expanded";
    settings.toolbarCollapsed = settings.toolbarMode === "collapsed";
    settings.toolbarEdgeRestoreMode = ["expanded", "collapsed"].includes(settings.toolbarEdgeRestoreMode) ? settings.toolbarEdgeRestoreMode : "expanded";
    settings.toolbarEdgeCenterY = Number.isFinite(Number(settings.toolbarEdgeCenterY)) ? Number(settings.toolbarEdgeCenterY) : null;
    if (settings.toolbarPosition && Number.isFinite(Number(settings.toolbarPosition.left)) && Number.isFinite(Number(settings.toolbarPosition.top))) {
      settings.toolbarPosition = { left: Number(settings.toolbarPosition.left), top: Number(settings.toolbarPosition.top) };
    } else {
      settings.toolbarPosition = null;
    }
    return settings;
  }

  // src/utils/cache.js
  var MemoryTranslationCache = class {
    constructor() {
      this.entries = /* @__PURE__ */ new Map();
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
  };

  // src/utils/gm.js
  function asPromise(callbackRequest, details) {
    return new Promise((resolve, reject) => {
      callbackRequest({
        ...details,
        onload: resolve,
        onerror: (error) => reject(Object.assign(new Error("\u7F51\u7EDC\u8BF7\u6C42\u5931\u8D25"), { response: error, status: error?.status || 0 })),
        ontimeout: (error) => reject(Object.assign(new Error("\u8BF7\u6C42\u8D85\u65F6"), { response: error, status: error?.status || 0 })),
        onabort: (error) => reject(Object.assign(new Error("\u8BF7\u6C42\u5DF2\u53D6\u6D88"), { response: error, status: error?.status || 0 }))
      });
    });
  }
  function createGmApi(scope = globalThis) {
    const modern = scope.GM;
    return {
      async getValue(key, fallback) {
        if (modern?.getValue) return modern.getValue(key, fallback);
        if (typeof scope.GM_getValue === "function") return scope.GM_getValue(key, fallback);
        return fallback;
      },
      async setValue(key, value) {
        if (modern?.setValue) return modern.setValue(key, value);
        if (typeof scope.GM_setValue === "function") return scope.GM_setValue(key, value);
        return void 0;
      },
      registerMenuCommand(label, handler) {
        if (modern?.registerMenuCommand) return modern.registerMenuCommand(label, handler);
        if (typeof scope.GM_registerMenuCommand === "function") return scope.GM_registerMenuCommand(label, handler);
        return void 0;
      },
      request(details) {
        if (modern?.xmlHttpRequest) return Promise.resolve(modern.xmlHttpRequest(details));
        if (typeof scope.GM_xmlhttpRequest === "function") return asPromise(scope.GM_xmlhttpRequest, details);
        return Promise.reject(new Error("\u5F53\u524D\u811A\u672C\u7BA1\u7406\u5668\u4E0D\u652F\u6301\u8DE8\u57DF\u8BF7\u6C42"));
      }
    };
  }

  // src/utils/idle.js
  function whenIdle() {
    return new Promise((resolve) => {
      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(resolve, { timeout: 500 });
      } else {
        setTimeout(() => resolve({ timeRemaining: () => 0, didTimeout: true }), 16);
      }
    });
  }
  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  // src/utils/storage.js
  var SETTINGS_KEY = "translator.settings.v1";
  var SettingsStore = class {
    constructor(api) {
      this.api = api;
    }
    async load() {
      return normalizeSettings(await this.api.getValue(SETTINGS_KEY, {}));
    }
    async save(settings) {
      const normalized = normalizeSettings(settings);
      await this.api.setValue(SETTINGS_KEY, normalized);
      return normalized;
    }
  };

  // src/translator/provider.js
  var ProviderError = class extends Error {
    constructor(message, { status = 0, cause } = {}) {
      super(message, { cause });
      this.name = "ProviderError";
      this.status = status;
    }
    get isAuthorizationError() {
      return this.status === 401 || this.status === 403;
    }
    get isRetryable() {
      return this.status === 0 || this.status >= 500;
    }
  };
  var TranslationProvider = class {
    async translate() {
      throw new Error("Provider \u5FC5\u987B\u5B9E\u73B0 translate()");
    }
    async translateBatch() {
      throw new Error("Provider \u5FC5\u987B\u5B9E\u73B0 translateBatch()");
    }
    async detect() {
      throw new Error("Provider \u5FC5\u987B\u5B9E\u73B0 detect()");
    }
  };

  // src/translator/microsoft.js
  var AUTH_URL = "https://edge.microsoft.com/translate/auth";
  var API_URL = "https://api-edge.cognitive.microsofttranslator.com";
  var TOKEN_TTL_MS = 8 * 60 * 1e3;
  var MAX_TEXT_LENGTH = 5e4;
  var LANGUAGE_ALIASES = {
    zh: "zh-Hans",
    "zh-CN": "zh-Hans",
    "zh-TW": "zh-Hant",
    no: "nb",
    sr: "sr-Cyrl"
  };
  function splitIntoChunks(items, size) {
    const chunks = [];
    for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size));
    return chunks;
  }
  function splitText(text) {
    if (text.length <= MAX_TEXT_LENGTH) return [text];
    const chunks = [];
    let start = 0;
    while (start < text.length) {
      let end = Math.min(start + MAX_TEXT_LENGTH, text.length);
      if (end < text.length && /[\uD800-\uDBFF]/.test(text[end - 1])) end -= 1;
      chunks.push(text.slice(start, end));
      start = end;
    }
    return chunks;
  }
  var MicrosoftProvider = class extends TranslationProvider {
    constructor(request) {
      super();
      this.request = request;
      this.token = null;
      this.tokenCreatedAt = 0;
    }
    normalizeLanguage(language) {
      return LANGUAGE_ALIASES[language] || language;
    }
    async getToken(force = false, timeoutMs = 15e3) {
      if (!force && this.token && Date.now() - this.tokenCreatedAt < TOKEN_TTL_MS) return this.token;
      let response;
      try {
        response = await this.request({ method: "GET", url: AUTH_URL, timeout: timeoutMs });
      } catch (cause) {
        throw new ProviderError("\u5FAE\u8F6F\u7FFB\u8BD1\u6388\u6743\u8BF7\u6C42\u5931\u8D25", { status: cause?.status || 0, cause });
      }
      if (response.status !== 200 || !response.responseText) {
        throw new ProviderError("\u5FAE\u8F6F\u7FFB\u8BD1\u6388\u6743\u5931\u8D25", { status: response.status || 0 });
      }
      this.token = response.responseText;
      this.tokenCreatedAt = Date.now();
      return this.token;
    }
    async perform(path, body, options, forceToken = false) {
      const token = await this.getToken(forceToken, options.timeoutMs);
      let response;
      try {
        response = await this.request({
          method: "POST",
          url: `${API_URL}${path}`,
          timeout: options.timeoutMs,
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json"
          },
          data: JSON.stringify(body)
        });
      } catch (cause) {
        throw new ProviderError("\u5FAE\u8F6F\u7FFB\u8BD1\u7F51\u7EDC\u8BF7\u6C42\u5931\u8D25", { status: cause?.status || 0, cause });
      }
      if (response.status < 200 || response.status >= 300) {
        throw new ProviderError("\u5FAE\u8F6F\u7FFB\u8BD1\u8BF7\u6C42\u5931\u8D25", { status: response.status || 0 });
      }
      try {
        return JSON.parse(response.responseText);
      } catch (cause) {
        throw new ProviderError("\u5FAE\u8F6F\u7FFB\u8BD1\u54CD\u5E94\u683C\u5F0F\u65E0\u6548", { status: response.status || 0, cause });
      }
    }
    async requestWithRecovery(path, body, options) {
      try {
        return await this.perform(path, body, options);
      } catch (error) {
        if (!(error instanceof ProviderError)) throw error;
        if (error.isAuthorizationError) return this.perform(path, body, options, true);
        if (error.isRetryable) {
          await new Promise((resolve) => setTimeout(resolve, 400));
          return this.perform(path, body, options);
        }
        throw error;
      }
    }
    async translate(text, options) {
      const [result] = await this.translateBatch([text], options);
      return result;
    }
    async translateBatch(texts, options) {
      if (!texts.length) return [];
      const target = this.normalizeLanguage(options.targetLanguage);
      const source = options.sourceLanguage === "auto" ? "" : `&from=${encodeURIComponent(this.normalizeLanguage(options.sourceLanguage))}`;
      const path = `/translate?api-version=3.0&to=${encodeURIComponent(target)}${source}`;
      const segments = texts.flatMap((text, index) => splitText(text).map((Text) => ({ index, Text })));
      const result = Array(texts.length).fill("");
      for (const chunk of splitIntoChunks(segments, Math.min(100, Math.max(1, options.batchSize || 50)))) {
        const data = await this.requestWithRecovery(path, chunk.map(({ Text }) => ({ Text })), options);
        if (!Array.isArray(data) || data.length !== chunk.length) throw new ProviderError("\u5FAE\u8F6F\u7FFB\u8BD1\u8FD4\u56DE\u6761\u76EE\u6570\u4E0D\u5339\u914D");
        for (let index = 0; index < data.length; index += 1) {
          const item = data[index];
          const translated = item?.translations?.[0]?.text;
          if (typeof translated !== "string") throw new ProviderError("\u5FAE\u8F6F\u7FFB\u8BD1\u7F3A\u5C11\u8BD1\u6587");
          result[chunk[index].index] += translated;
        }
      }
      return result;
    }
    async detect(text, options = {}) {
      const data = await this.requestWithRecovery("/detect?api-version=3.0", [{ Text: text }], options);
      const language = data?.[0]?.language;
      if (!language) throw new ProviderError("\u5FAE\u8F6F\u8BED\u8A00\u68C0\u6D4B\u5931\u8D25");
      return language;
    }
  };

  // src/dom/walker.js
  var SKIPPED_TAGS = /* @__PURE__ */ new Set([
    "TITLE",
    "LINK",
    "SCRIPT",
    "STYLE",
    "TEXTAREA",
    "INPUT",
    "SVG",
    "G",
    "NOSCRIPT",
    "OPTION",
    "SELECT",
    "TEMPLATE",
    "KBD",
    "SAMP",
    "VAR",
    "WBR",
    "RUBY",
    "RT",
    "RP",
    "META",
    "MATH",
    "TIME"
  ]);
  var CODE_TAGS = /* @__PURE__ */ new Set(["CODE", "PRE", "KBD", "SAMP", "TT"]);
  var SKIPPED_SELECTOR = [
    '[translate="no"]',
    ".notranslate",
    ".imt-notranslate",
    "[data-no-translate]",
    '[contenteditable="true"]',
    '[aria-hidden="true"]',
    ".material-icons",
    "material-icon",
    "i.fa",
    'i[class^="fa-"]',
    ".google-symbols",
    'span[class^="material-symbols-"]',
    ".visuallyhidden",
    ".prism-code",
    ".enlighter-code",
    ".rc-CodeBlock",
    ".highlight",
    '[role="code"]',
    "table.highlight",
    'div[class^="codeBlockContent"]',
    'div[class^="codeBlockLines"]',
    'div[class^="token-line"]',
    '[data-test="json-editor"]',
    ".jp-CodeMirrorEditor",
    "cds-code-snippet",
    ".interactive-markdown__code",
    "#ace-editor",
    "table.processedcode",
    ".CodeMirror",
    ".cm-editor",
    ".monaco-editor",
    ".ace_editor",
    "span.katex",
    '[class^="MathJax"]',
    '[role="math"]',
    "math-renderer",
    ".ltx_Math"
  ].join(",");
  var NON_TRANSLATABLE_TEXT = /^(?:https?:\/\/\S+|www\.\S+|mailto:\S+|tel:\S+|[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:[\w-]*[_$][\w$-]*|[\w.-]+[\\/][\w./\\-]+|[\w-]+(?:\.[\w-]+){1,})(?:\([^)]*\))?[;,{})\]]?)$/i;
  var NON_TEXTUAL_CONTENT = /^(?:[\d\s\p{P}\p{S}]+|copyright\b.*)$/iu;
  function isInsideSkippedElement(element2) {
    if (!element2) return true;
    if (element2.closest('[data-translator-ui], [hidden], [contenteditable="true"]')) return true;
    if (element2.closest(SKIPPED_SELECTOR)) return true;
    for (let current = element2; current; current = current.parentElement) {
      if (SKIPPED_TAGS.has(current.tagName)) return true;
      if (CODE_TAGS.has(current.tagName)) return true;
      const style = getComputedStyle(current);
      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return true;
    }
    return false;
  }
  function isTranslatableTextNode(node) {
    return node?.nodeType === Node.TEXT_NODE && Boolean(node.nodeValue?.trim()) && !NON_TRANSLATABLE_TEXT.test(node.nodeValue.trim()) && !NON_TEXTUAL_CONTENT.test(node.nodeValue.trim()) && !isInsideSkippedElement(node.parentElement);
  }
  function isTextNodeVisible(node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    const rect = range.getBoundingClientRect();
    if (!rect || rect.width === 0 && rect.height === 0) return false;
    return rect.bottom >= 0 && rect.right >= 0 && rect.top <= window.innerHeight && rect.left <= window.innerWidth;
  }
  async function scanTextNodesInIdle(root, options, { visibleOnly = false, chunkSize = 150, onChunk } = {}) {
    if (root.nodeType === Node.TEXT_NODE) {
      if (isTranslatableTextNode(root, options) && (!visibleOnly || isTextNodeVisible(root))) await onChunk([root]);
      return;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node2) => isTranslatableTextNode(node2, options) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    let batch = [];
    let node;
    while (node = walker.nextNode()) {
      if (!visibleOnly || isTextNodeVisible(node)) batch.push(node);
      if (batch.length >= chunkSize) {
        await onChunk(batch);
        batch = [];
        await whenIdle();
      }
    }
    if (batch.length) await onChunk(batch);
  }

  // src/dom/replacer.js
  var TextReplacer = class {
    constructor() {
      this.records = /* @__PURE__ */ new WeakMap();
      this.nodes = /* @__PURE__ */ new Set();
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
      if (typeof original !== "string" || node.nodeValue !== original && !this.records.has(node)) return false;
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
  };

  // src/dom/observer.js
  var IncrementalObserver = class {
    constructor(onRoots) {
      this.onRoots = onRoots;
      this.observer = null;
    }
    start(root = document.body) {
      this.stop();
      this.observer = new MutationObserver((mutations) => {
        const roots = /* @__PURE__ */ new Set();
        for (const mutation of mutations) {
          if (mutation.type === "characterData") roots.add(mutation.target);
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
  };

  // src/translator/controller.js
  var TranslationController = class {
    constructor({ provider, cache, getSettings, onProgress = () => {
    }, onError = () => {
    } }) {
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
      const pending = /* @__PURE__ */ new Map();
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
        }
      });
      await flush();
      return translated;
    }
    enqueueNodes(nodes, generation = this.generation) {
      const task = this.queue.then(() => generation === this.generation ? this.translateNodes(nodes, generation) : 0);
      this.queue = task.catch(() => 0);
      return task;
    }
    async translateNodes(nodes, generation = this.generation) {
      const settings = this.getSettings();
      const byText = /* @__PURE__ */ new Map();
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
      const translated = /* @__PURE__ */ new Map();
      const missing = [];
      for (const text of texts) {
        const input = { sourceLanguage: settings.sourceLanguage, targetLanguage: settings.targetLanguage, text };
        const cached = settings.cacheEnabled ? this.cache.get(input) : void 0;
        if (cached !== void 0) translated.set(text, cached);
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
      const cached = settings.cacheEnabled ? this.cache.get(input) : void 0;
      if (cached !== void 0) return cached;
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
  };

  // src/styles/ui.js
  var uiStyles = `
:host { all: initial; color-scheme: light dark; }
*, *::before, *::after { box-sizing: border-box; }
.tr-root { position: fixed; inset: 0; z-index: 2147483647; pointer-events: none; font-family: Inter, "Segoe UI", "Microsoft YaHei", system-ui, sans-serif; color: #172033; }
.tr-toolbar { position: fixed; right: 20px; bottom: 20px; display: flex; max-width: calc(100vw - 24px); align-items: center; gap: 5px; padding: 7px; border: 1px solid rgba(255,255,255,.72); border-radius: 16px; background: rgba(255,255,255,.82); box-shadow: 0 16px 42px rgba(25, 40, 72, .22); backdrop-filter: blur(16px); pointer-events: auto; touch-action: none; animation: tr-in .18s ease-out; }
.tr-toolbar-actions { display: flex; align-items: center; gap: 5px; }
.tr-toolbar-drag, .tr-toolbar-collapse { position: relative; display: grid; width: 30px; min-width: 30px; height: 34px; place-items: center; padding: 0; border: 0; border-radius: 10px; color: #61708a; background: transparent; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; transition: color .16s ease, background .16s ease; }
.tr-toolbar-drag { cursor: grab; }
.tr-toolbar-drag:active, .tr-toolbar.is-dragging .tr-toolbar-drag { cursor: grabbing; }
.tr-toolbar-drag svg { display: block; width: 18px; height: 18px; fill: currentColor; opacity: .78; }
.tr-toolbar-collapse svg { display: block; width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; transform-origin: 50% 50%; transition: transform .18s ease; }
.tr-toolbar-drag:hover, .tr-toolbar-collapse:hover { color: #315ec9; background: rgba(66,113,255,.13); }
.tr-toolbar-drag:active, .tr-toolbar-collapse:active { background: rgba(66,113,255,.2); }
.tr-toolbar-drag:focus-visible, .tr-toolbar-collapse:focus-visible { outline: 2px solid #477cff; outline-offset: 2px; }
.tr-toolbar.is-dragging { user-select: none; box-shadow: 0 20px 48px rgba(25,40,72,.3); }
.tr-toolbar.is-collapsed { gap: 4px; padding: 7px; border-color: rgba(255,255,255,.8); border-radius: 14px; background: rgba(248,250,255,.88); box-shadow: 0 10px 28px rgba(25,40,72,.18); }
.tr-toolbar.is-collapsed .tr-toolbar-actions { display: none; }
.tr-toolbar.is-collapsed .tr-toolbar-collapse { color: #315ec9; }
.tr-toolbar.is-collapsed .tr-toolbar-collapse svg { transform: rotate(180deg); }
.tr-toolbar.is-edge-hidden { padding: 0; justify-content: flex-end; overflow: visible; border: 0; border-radius: 10px 0 0 10px; background: transparent; box-shadow: none; backdrop-filter: none; transition: left .18s ease; }
.tr-toolbar.is-edge-hidden .tr-toolbar-drag { display: none; }
.tr-toolbar.is-edge-hidden .tr-toolbar-actions { display: none; }
.tr-toolbar.is-edge-hidden .tr-toolbar-collapse { width: 30px; min-width: 30px; height: 34px; border: 1px solid rgba(255,255,255,.82); border-right: 0; border-radius: 10px 0 0 10px; color: #315ec9; background: rgba(244,248,255,.92); box-shadow: -3px 4px 13px rgba(25,40,72,.2); backdrop-filter: blur(16px); }
.tr-toolbar.is-edge-hidden .tr-toolbar-collapse:hover { color: #244fae; background: rgba(232,240,255,.98); }
.tr-toolbar.is-edge-hidden .tr-toolbar-collapse svg { transform: rotate(0deg); }
.tr-toolbar.is-edge-hidden.is-hidden-left { justify-content: flex-start; border-radius: 0 10px 10px 0; }
.tr-toolbar.is-edge-hidden.is-hidden-left .tr-toolbar-collapse { border: 1px solid rgba(255,255,255,.82); border-left: 0; border-radius: 0 10px 10px 0; box-shadow: 3px 4px 13px rgba(25,40,72,.2); }
.tr-toolbar.is-edge-hidden.is-hidden-left .tr-toolbar-collapse svg { transform: rotate(180deg); }
.tr-button { appearance: none; border: 0; border-radius: 11px; min-width: 34px; height: 34px; padding: 0 10px; color: #24314a; background: transparent; cursor: pointer; font: 600 13px/1 inherit; transition: background .16s ease, transform .16s ease; }
.tr-button:hover { background: rgba(66, 113, 255, .13); transform: translateY(-1px); }
.tr-toolbar-site-auto { position: relative; font-weight: 800; }
.tr-toolbar-site-auto.is-active { color: #fff; background: #477cff; }
.tr-toolbar-site-auto.is-active:hover { background: #356af0; }
.tr-button:focus-visible, .tr-combobox-trigger:focus-visible { outline: 2px solid #477cff; outline-offset: 2px; }
.tr-button.tr-pointer-focused:focus-visible { outline: none; }
.tr-toast-stack { position: fixed; right: 22px; bottom: 68px; z-index: 8; width: max-content; max-width: calc(100vw - 44px); pointer-events: none; }
.tr-toast { display: flex; align-items: center; gap: 3px; max-width: 100%; padding: 4px 6px; border-radius: 6px; color: #fff; background: rgba(25,34,54,.84); box-shadow: 0 4px 12px rgba(0,0,0,.15); font-family: inherit; font-size: 12px; font-weight: 400; line-height: 1.25; animation: tr-toast-in .16s ease-out; }
.tr-toast-icon { display: grid; flex: 0 0 auto; place-items: center; }
.tr-toast-icon svg { width: 9px; height: 9px; fill: none; stroke: currentColor; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
.tr-toast-message { min-width: 0; overflow-wrap: anywhere; }
.tr-selection-button { position: fixed; z-index: 4; display: none; width: 26px; height: 26px; padding: 0; border: 2px solid rgba(255,255,255,.9); border-radius: 50%; background: #477cff; box-shadow: 0 5px 14px rgba(40,77,180,.32); cursor: pointer; pointer-events: auto; touch-action: manipulation; transition: background .16s ease, box-shadow .16s ease, transform .16s ease; }
.tr-selection-button::after { display: block; width: 5px; height: 5px; margin: auto; border-radius: 50%; background: #fff; content: ''; }
.tr-selection-button.is-visible { display: block; animation: tr-in .14s ease-out; }
.tr-selection-button:hover { background: #356af0; transform: translateY(-1px); }
.tr-selection-button:focus-visible { outline: 2px solid #477cff; outline-offset: 3px; }
.tr-translation-dialog { width: min(540px, 100%); max-height: min(680px, 90dvh); overflow-y: auto; scrollbar-gutter: stable; scrollbar-width: thin; scrollbar-color: rgba(85,105,145,.52) transparent; }
.tr-translation-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.tr-translation-header .tr-dialog-title { margin-bottom: 14px; }
.tr-selection-close { display: grid; width: 30px; height: 30px; place-items: center; padding: 0; border: 0; border-radius: 9px; color: #61708a; background: transparent; cursor: pointer; font: 22px/1 sans-serif; }
.tr-selection-close:hover { color: #253653; background: #e9effb; }
.tr-selection-close:focus-visible { outline: 2px solid #477cff; outline-offset: 2px; }
.tr-translation-content { display: grid; gap: 12px; }
.tr-translation-languages { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
.tr-translation-content .tr-field { margin: 0; }
.tr-translation-input { width: 100%; min-height: 126px; padding: 11px 12px; resize: vertical; border: 1px solid #d8dfec; border-radius: 11px; color: #1e2b42; background: rgba(255,255,255,.8); font: 14px/1.55 inherit; outline: none; transition: border-color .16s ease, box-shadow .16s ease, background .16s ease; }
.tr-translation-input:focus { border-color: #477cff; background: #fff; box-shadow: 0 0 0 3px rgba(71,124,255,.15); }
.tr-translation-hint { margin: -4px 0 0; color: #7787a2; font-size: 11px; line-height: 1.4; }
.tr-translation-result-section { display: grid; gap: 5px; }
.tr-translation-result-header { display: flex; align-items: center; justify-content: space-between; min-height: 30px; }
.tr-selection-section-label { color: #657592; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.tr-translation-result { display: block; min-height: 112px; margin: 0; padding: 11px 12px; overflow-wrap: anywhere; border-radius: 10px; color: #1d2b44; background: #eaf0ff; font: 14px/1.55 inherit; white-space: pre-wrap; transition: color .16s ease, background .16s ease; }
.tr-translation-result[data-state='placeholder'] { color: #7d8ca6; background: #f1f4f9; }
.tr-translation-result[data-state='loading'] { color: #3559a5; background: #edf2ff; }
.tr-translation-copy { display: grid; width: 32px; min-width: 32px; height: 32px; place-items: center; padding: 0; border: 1px solid #d8dfec; border-radius: 9px; color: #456188; background: rgba(255,255,255,.72); cursor: pointer; }
.tr-translation-copy svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.tr-translation-copy:hover { border-color: #9cb7f6; color: #2c62dc; background: #edf2ff; }
.tr-translation-copy:focus-visible { outline: 2px solid #477cff; outline-offset: 2px; }
.tr-translation-copy:disabled { cursor: default; opacity: .45; }
.tr-translation-dialog::-webkit-scrollbar { width: 9px; height: 9px; }
.tr-translation-dialog::-webkit-scrollbar-track { margin: 10px 0; background: transparent; }
.tr-translation-dialog::-webkit-scrollbar-thumb { min-height: 34px; border: 2px solid transparent; border-radius: 99px; background: rgba(85,105,145,.5); background-clip: padding-box; }
.tr-overlay { position: fixed; inset: 0; display: grid; place-items: center; padding: 20px; background: rgba(15, 23, 42, .26); pointer-events: auto; animation: tr-fade .16s ease-out; }
.tr-dialog { width: min(520px, 100%); max-height: min(680px, 90vh); overflow: auto; padding: 20px; border: 1px solid rgba(255,255,255,.7); border-radius: 18px; background: rgba(255,255,255,.93); box-shadow: 0 24px 70px rgba(10, 22, 50, .3); backdrop-filter: blur(18px); animation: tr-scale .18s ease-out; pointer-events: auto; }
.tr-dialog--scrollable { display: flex; flex-direction: column; height: min(680px, calc(100dvh - 40px)); overflow: hidden; }
.tr-dialog-content { flex: 1 1 auto; min-height: 0; padding-right: 7px; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: rgba(85,105,145,.52) transparent; }
.tr-dialog-title { margin: 0 0 16px; color: #172033; font-size: 17px; line-height: 1.4; }
.tr-field { display: grid; gap: 7px; margin: 12px 0; color: #40506d; font-size: 13px; }
.tr-switch-row { display: flex; align-items: center; justify-content: space-between; width: 100%; min-height: 46px; margin: 8px 0; padding: 8px 10px 8px 12px; border: 1px solid #d8dfec; border-radius: 10px; color: #40506d; background: rgba(255,255,255,.44); cursor: pointer; font: 500 13px/1.35 inherit; text-align: left; transition: border-color .16s ease, background .16s ease, box-shadow .16s ease; }
.tr-switch-row:hover { border-color: #a8bdea; background: rgba(248,250,255,.92); }
.tr-switch-row.is-checked { border-color: #81a4ff; background: rgba(71,124,255,.09); }
.tr-switch-row:focus-visible { outline: 2px solid #477cff; outline-offset: 2px; }
.tr-switch-label { padding-right: 12px; }
.tr-switch-track { position: relative; flex: 0 0 auto; width: 38px; height: 22px; border-radius: 999px; background: #c8d2e3; box-shadow: inset 0 0 0 1px rgba(27,53,100,.08); transition: background .16s ease; }
.tr-switch-thumb { position: absolute; top: 3px; left: 3px; display: grid; width: 16px; height: 16px; place-items: center; border-radius: 50%; color: #8090a9; background: #fff; box-shadow: 0 1px 3px rgba(26,44,78,.25); transform: translateX(0); transition: color .16s ease, transform .16s ease; }
.tr-switch-icon { display: block; width: 11px; height: 11px; overflow: visible; }
.tr-switch-row.is-checked .tr-switch-track { background: #477cff; }
.tr-switch-row.is-checked .tr-switch-thumb { color: #356af0; transform: translateX(16px); }
.tr-input { width: 100%; min-height: 40px; padding: 8px 10px; border: 1px solid #d8dfec; border-radius: 9px; color: #1e2b42; background: rgba(255,255,255,.8); font: 14px/1.25 inherit; outline: none; transition: border-color .16s ease, box-shadow .16s ease, background .16s ease; }
.tr-input:focus, .tr-input:focus-visible { border-color: #477cff; background: #fff; box-shadow: 0 0 0 3px rgba(71,124,255,.15); outline: none; }
.tr-textarea { min-height: 76px; resize: vertical; font-family: inherit; line-height: 1.45; }
.tr-combobox { position: relative; z-index: 1; }
.tr-combobox.is-open { z-index: 3; }
.tr-field-label { font-weight: 600; }
.tr-combobox-trigger { display: flex; align-items: center; justify-content: space-between; width: 100%; min-height: 44px; padding: 9px 12px; border: 1px solid #d8dfec; border-radius: 10px; color: #1e2b42; background: rgba(255,255,255,.82); box-shadow: inset 0 1px rgba(255,255,255,.55); cursor: pointer; font: 14px/1.25 inherit; text-align: left; transition: border-color .16s ease, box-shadow .16s ease, background .16s ease; }
.tr-combobox-trigger:hover, .tr-combobox.is-open .tr-combobox-trigger { border-color: #7b9dff; background: #fff; box-shadow: 0 0 0 3px rgba(71,124,255,.12); }
.tr-combobox-trigger:focus-visible { outline: 2px solid #477cff; outline-offset: 2px; }
.tr-combobox-chevron { width: 8px; height: 8px; margin-left: 12px; border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; transform: rotate(45deg) translateY(-2px); transition: transform .16s ease; }
.tr-combobox.is-open .tr-combobox-chevron { transform: rotate(225deg) translateY(-2px); }
.tr-combobox-menu { position: absolute; top: calc(100% + 6px); right: 0; left: 0; display: grid; max-height: min(260px, 38vh); padding: 5px; overflow: auto; border: 1px solid rgba(122,142,180,.28); border-radius: 12px; background: rgba(255,255,255,.96); box-shadow: 0 16px 36px rgba(25,40,72,.2); backdrop-filter: blur(16px); animation: tr-menu-in .16s ease-out; scrollbar-width: thin; scrollbar-color: rgba(85,105,145,.52) transparent; }
.tr-combobox-menu[hidden] { display: none; }
.tr-combobox-option { min-height: 38px; padding: 8px 10px; border: 0; border-radius: 8px; color: #2b3953; background: transparent; cursor: pointer; font: 14px/1.25 inherit; text-align: left; transition: background .13s ease, color .13s ease; }
.tr-combobox-option:hover, .tr-combobox-option:focus-visible { color: #194bb7; background: #eaf0ff; outline: none; }
.tr-combobox-option.is-selected::after { float: right; content: '\u2713'; color: #326cf2; font-weight: 800; }
.tr-dialog-content::-webkit-scrollbar, .tr-combobox-menu::-webkit-scrollbar { width: 9px; height: 9px; }
.tr-dialog-content::-webkit-scrollbar-track, .tr-combobox-menu::-webkit-scrollbar-track { margin: 8px 0; background: transparent; }
.tr-dialog-content::-webkit-scrollbar-thumb, .tr-combobox-menu::-webkit-scrollbar-thumb { min-height: 34px; border: 2px solid transparent; border-radius: 99px; background: rgba(85,105,145,.5); background-clip: padding-box; }
.tr-dialog-content::-webkit-scrollbar-thumb:hover, .tr-combobox-menu::-webkit-scrollbar-thumb:hover { background: rgba(61,84,129,.7); background-clip: padding-box; }
.tr-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
.tr-primary { color: #fff; background: #477cff; }
.tr-primary:hover { background: #356af0; }
.tr-result { margin: 0; padding: 11px 12px; overflow-wrap: anywhere; border-radius: 10px; background: #f1f4f9; color: #27364f; font: 14px/1.55 inherit; white-space: pre-wrap; }
.tr-result + .tr-dialog-title { margin-top: 16px; }
@media (prefers-color-scheme: dark) {
  .tr-toolbar { border-color: rgba(255,255,255,.12); background: rgba(27, 35, 55, .86); }
  .tr-toolbar.is-collapsed { border-color: rgba(255,255,255,.14); background: rgba(31, 41, 63, .9); box-shadow: 0 10px 28px rgba(0,0,0,.28); }
  .tr-toolbar-drag, .tr-toolbar-collapse { color: #b5c2da; }
  .tr-toolbar-drag:hover, .tr-toolbar-collapse:hover { color: #fff; background: rgba(125,160,255,.2); }
  .tr-toolbar.is-edge-hidden .tr-toolbar-collapse { border-color: rgba(255,255,255,.14); color: #d7e2ff; background: rgba(35,47,73,.92); box-shadow: -3px 4px 13px rgba(0,0,0,.28); }
  .tr-toolbar.is-edge-hidden .tr-toolbar-collapse:hover { color: #fff; background: rgba(51,68,107,.96); }
  .tr-button { color: #e8edfa; }
  .tr-button:hover { background: rgba(125, 160, 255, .2); }
  .tr-toolbar-site-auto.is-active { color: #fff; background: #638cff; }
  .tr-dialog { border-color: rgba(255,255,255,.12); background: rgba(26, 34, 53, .95); }
  .tr-selection-close { color: #b5c2da; }
  .tr-selection-close:hover { color: #fff; background: #33446b; }
  .tr-selection-section-label { color: #aebbd2; }
  .tr-translation-input { border-color: #4b5871; color: #eff4ff; background: #202a40; }
  .tr-translation-input:focus { border-color: #7b9dff; background: #27334d; box-shadow: 0 0 0 3px rgba(115,151,255,.18); }
  .tr-translation-hint { color: #aebbd2; }
  .tr-translation-result { color: #f1f5ff; background: #2c3b60; }
  .tr-translation-result[data-state='placeholder'] { color: #b5c2da; background: #202a40; }
  .tr-translation-result[data-state='loading'] { color: #dce7ff; background: #29385a; }
  .tr-translation-copy { border-color: #4b5871; color: #c6d4ed; background: #202a40; }
  .tr-translation-copy:hover { border-color: #7b9dff; color: #fff; background: #33446b; }
  .tr-translation-dialog { scrollbar-color: rgba(159,181,230,.52) transparent; }
  .tr-translation-dialog::-webkit-scrollbar-thumb { background: rgba(159,181,230,.48); background-clip: padding-box; }
  .tr-dialog-title { color: #f1f5ff; }
  .tr-field, .tr-switch-row { color: #c2cce0; }
  .tr-switch-row { border-color: #44516b; background: rgba(30,40,61,.52); }
  .tr-switch-row:hover { border-color: #62769e; background: rgba(45,59,87,.72); }
  .tr-switch-row.is-checked { border-color: #7196ff; background: rgba(77,120,255,.2); }
  .tr-switch-track { background: #59667e; box-shadow: inset 0 0 0 1px rgba(0,0,0,.22); }
  .tr-switch-thumb { color: #73849f; background: #e9effd; }
  .tr-switch-row.is-checked .tr-switch-track { background: #638cff; }
  .tr-switch-row.is-checked .tr-switch-thumb { color: #376df0; }
  .tr-input, .tr-combobox-trigger { border-color: #4b5871; color: #eff4ff; background: #202a40; }
  .tr-input:focus, .tr-input:focus-visible { border-color: #7b9dff; background: #27334d; box-shadow: 0 0 0 3px rgba(115,151,255,.18); }
  .tr-combobox-trigger:hover, .tr-combobox.is-open .tr-combobox-trigger { border-color: #7b9dff; background: #27334d; box-shadow: 0 0 0 3px rgba(115,151,255,.18); }
  .tr-combobox-menu { border-color: rgba(173,191,230,.22); background: rgba(30,40,61,.98); box-shadow: 0 16px 36px rgba(0,0,0,.34); }
  .tr-combobox-option { color: #dce6fb; }
  .tr-combobox-option:hover, .tr-combobox-option:focus-visible { color: #f2f6ff; background: #33446b; }
  .tr-dialog-content, .tr-combobox-menu { scrollbar-color: rgba(159,181,230,.52) transparent; }
  .tr-dialog-content::-webkit-scrollbar-thumb, .tr-combobox-menu::-webkit-scrollbar-thumb { background: rgba(159,181,230,.48); background-clip: padding-box; }
  .tr-dialog-content::-webkit-scrollbar-thumb:hover, .tr-combobox-menu::-webkit-scrollbar-thumb:hover { background: rgba(190,209,250,.7); background-clip: padding-box; }
  .tr-result { background: #202a40; color: #e6edff; }
}
@keyframes tr-in { from { opacity: 0; transform: translateY(5px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes tr-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes tr-toast-in { from { opacity: 0; transform: translateY(-8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes tr-scale { from { opacity: 0; transform: scale(.97); } to { opacity: 1; transform: scale(1); } }
@keyframes tr-menu-in { from { opacity: 0; transform: translateY(-4px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
@media (max-width: 430px) { .tr-translation-languages { grid-template-columns: 1fr; } .tr-translation-dialog { scrollbar-gutter: stable; } }
@media (max-width: 360px) { .tr-toolbar, .tr-toolbar.is-collapsed { gap: 2px; padding: 4px; border-radius: 14px; } .tr-toolbar-actions { gap: 2px; } .tr-toolbar-drag, .tr-toolbar-collapse, .tr-toolbar .tr-button { width: 30px; min-width: 30px; padding: 0; } }
`;

  // src/ui/dom.js
  function element(tag, { className, text, attributes = {} } = {}) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== void 0) node.textContent = text;
    for (const [name, value] of Object.entries(attributes)) {
      if (value !== void 0 && value !== null) node.setAttribute(name, String(value));
    }
    return node;
  }
  function button(label, title, onClick, className = "tr-button") {
    const node = element("button", { className, text: label, attributes: { type: "button", title } });
    node.addEventListener("click", onClick);
    return node;
  }

  // src/ui/root.js
  function createUiRoot() {
    const host = element("div", { attributes: { "data-translator-ui": "" } });
    document.documentElement.append(host);
    const shadow = host.attachShadow({ mode: "open" });
    const style = element("style", { text: uiStyles });
    const root = element("div", { className: "tr-root", attributes: { "data-translator-ui": "" } });
    shadow.append(style, root);
    return { host, shadow, root };
  }

  // src/ui/toolbar.js
  var EDGE_GAP = 12;
  var EDGE_SNAP_DISTANCE = 28;
  var TOOLBAR_MODE = Object.freeze({
    EXPANDED: "expanded",
    COLLAPSED: "collapsed",
    EDGE_LEFT: "edge-left",
    EDGE_RIGHT: "edge-right"
  });
  function chevronIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 18 18");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M10.75 5.5 7 9l3.75 3.5");
    svg.append(path);
    return svg;
  }
  function dragIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 18 18");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    for (const [cx, cy] of [[6, 4], [12, 4], [6, 9], [12, 9], [6, 14], [12, 14]]) {
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", String(cx));
      dot.setAttribute("cy", String(cy));
      dot.setAttribute("r", "1.3");
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
  var Toolbar = class {
    constructor(root, t, actions, { position = null, mode, collapsed = false, edgeRestoreMode = TOOLBAR_MODE.EXPANDED, edgeCenterY = null, autoTranslateForSite = false, onStateChange = () => {
    } } = {}) {
      this.t = t;
      this.onStateChange = onStateChange;
      this.mode = normalizeMode(mode, { collapsed });
      this.edgeRestoreMode = [TOOLBAR_MODE.EXPANDED, TOOLBAR_MODE.COLLAPSED].includes(edgeRestoreMode) ? edgeRestoreMode : TOOLBAR_MODE.EXPANDED;
      this.edgeCenterY = Number.isFinite(Number(edgeCenterY)) ? Number(edgeCenterY) : null;
      this.preferredPosition = position;
      this.autoTranslateForSite = Boolean(autoTranslateForSite);
      this.onToggleSiteAutoTranslate = actions.onToggleSiteAutoTranslate || (() => {
      });
      this.bar = element("nav", { className: "tr-toolbar", attributes: { "aria-label": t("translatePage") } });
      this.dragHandle = button("", t("dragToolbar"), (event) => event.preventDefault(), "tr-toolbar-drag");
      this.dragHandle.append(dragIcon());
      this.actions = element("div", { className: "tr-toolbar-actions" });
      this.actions.append(
        button("\u6587", t("translatePage"), actions.translatePage),
        button("\u25C9", t("translateVisible"), actions.translateVisible),
        button("", t(this.autoTranslateForSite ? "disableAutoTranslateForSite" : "enableAutoTranslateForSite"), () => this.toggleSiteAutoTranslate(), "tr-toolbar-site-auto"),
        button("\u2301", t("inputTranslate"), actions.openInput),
        button("\u21BA", t("restore"), actions.restore),
        button("\u2699", t("settings"), actions.openSettings)
      );
      this.siteAutoButton = this.actions.querySelector(".tr-toolbar-site-auto");
      this.actions.addEventListener("pointerdown", (event) => event.target.closest?.(".tr-button")?.classList.add("tr-pointer-focused"));
      this.actions.addEventListener("keydown", () => this.actions.querySelectorAll(".tr-pointer-focused").forEach((node) => node.classList.remove("tr-pointer-focused")));
      this.collapseButton = button("", t("collapseToolbar"), () => this.toggleCollapsed(), "tr-toolbar-collapse");
      this.collapseButton.append(chevronIcon());
      this.bar.append(this.dragHandle, this.actions, this.collapseButton);
      this.dragHandle.addEventListener("pointerdown", (event) => this.startDrag(event));
      this.onResize = () => {
        cancelAnimationFrame(this.resizeFrame);
        this.resizeFrame = requestAnimationFrame(() => this.place());
      };
      window.addEventListener("resize", this.onResize, { passive: true });
      window.visualViewport?.addEventListener("resize", this.onResize, { passive: true });
      root.append(this.bar);
      this.renderMode();
      requestAnimationFrame(() => this.place());
    }
    get isEdgeHidden() {
      return this.mode === TOOLBAR_MODE.EDGE_LEFT || this.mode === TOOLBAR_MODE.EDGE_RIGHT;
    }
    get collapsed() {
      return this.mode === TOOLBAR_MODE.COLLAPSED;
    }
    toggleSiteAutoTranslate() {
      this.setSiteAutoTranslateEnabled(!this.autoTranslateForSite);
      this.onToggleSiteAutoTranslate(this.autoTranslateForSite);
    }
    setSiteAutoTranslateEnabled(enabled) {
      this.autoTranslateForSite = Boolean(enabled);
      this.renderSiteAutoTranslate();
    }
    toggleCollapsed() {
      if (this.isEdgeHidden) {
        this.restoreFromEdge();
        return;
      }
      this.setMode(this.mode === TOOLBAR_MODE.COLLAPSED ? TOOLBAR_MODE.EXPANDED : TOOLBAR_MODE.COLLAPSED);
    }
    restoreFromEdge() {
      const edge = this.mode;
      const centerY = this.edgeCenterY ?? this.currentPosition.top + this.bar.offsetHeight / 2;
      this.mode = this.edgeRestoreMode;
      this.edgeCenterY = null;
      this.renderMode();
      requestAnimationFrame(() => {
        const width = this.bar.offsetWidth;
        this.preferredPosition = {
          left: edge === TOOLBAR_MODE.EDGE_LEFT ? EDGE_GAP : viewportWidth() - width - EDGE_GAP,
          top: centerY - this.bar.offsetHeight / 2
        };
        this.place();
        this.persist();
      });
    }
    setMode(mode, persist = true) {
      const previous = this.currentPosition && !this.isEdgeHidden ? { ...this.currentPosition, width: this.bar.offsetWidth } : null;
      this.mode = normalizeMode(mode);
      this.renderMode();
      if (persist) this.persist();
      requestAnimationFrame(() => {
        if (previous) {
          const isLeftAnchored = previous.left + previous.width / 2 < viewportWidth() / 2;
          this.preferredPosition = {
            left: isLeftAnchored ? previous.left : previous.left + previous.width - this.bar.offsetWidth,
            top: previous.top
          };
        }
        this.place();
      });
    }
    renderMode() {
      const edgeLeft = this.mode === TOOLBAR_MODE.EDGE_LEFT;
      const edgeRight = this.mode === TOOLBAR_MODE.EDGE_RIGHT;
      this.bar.classList.toggle("is-collapsed", this.mode === TOOLBAR_MODE.COLLAPSED);
      this.bar.classList.toggle("is-edge-hidden", edgeLeft || edgeRight);
      this.bar.classList.toggle("is-hidden-left", edgeLeft);
      const key = this.isEdgeHidden ? "showToolbar" : this.mode === TOOLBAR_MODE.COLLAPSED ? "expandToolbar" : "collapseToolbar";
      this.collapseButton.setAttribute("title", this.t(key));
      this.collapseButton.setAttribute("aria-label", this.t(key));
      this.renderSiteAutoTranslate();
    }
    renderSiteAutoTranslate() {
      if (!this.siteAutoButton) return;
      const actionKey = this.autoTranslateForSite ? "disableAutoTranslateForSite" : "enableAutoTranslateForSite";
      const statusKey = this.autoTranslateForSite ? "siteAutoTranslateStatusEnabled" : "siteAutoTranslateStatusDisabled";
      this.siteAutoButton.classList.toggle("is-active", this.autoTranslateForSite);
      this.siteAutoButton.setAttribute("title", this.t(statusKey));
      this.siteAutoButton.setAttribute("aria-label", this.t(actionKey));
      this.siteAutoButton.textContent = "A";
    }
    place(position = this.preferredPosition) {
      if (position) this.preferredPosition = { left: position.left, top: position.top };
      const availableWidth = viewportWidth();
      const preferred = this.preferredPosition || { left: availableWidth - this.bar.offsetWidth - 20, top: window.innerHeight - this.bar.offsetHeight - 20 };
      const width = this.bar.offsetWidth;
      const height = this.bar.offsetHeight;
      const maxLeft = Math.max(EDGE_GAP, availableWidth - width - EDGE_GAP);
      const maxTop = Math.max(EDGE_GAP, window.innerHeight - height - EDGE_GAP);
      const left = this.mode === TOOLBAR_MODE.EDGE_LEFT ? 0 : this.mode === TOOLBAR_MODE.EDGE_RIGHT ? availableWidth - width : Math.max(EDGE_GAP, Math.min(maxLeft, preferred.left));
      const requestedTop = this.isEdgeHidden && this.edgeCenterY !== null ? this.edgeCenterY - height / 2 : preferred.top;
      const top = Math.max(EDGE_GAP, Math.min(maxTop, requestedTop));
      this.currentPosition = { left, top };
      this.bar.style.left = `${Math.round(left)}px`;
      this.bar.style.top = `${Math.round(top)}px`;
      this.bar.style.right = "auto";
      this.bar.style.bottom = "auto";
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
        this.bar.classList.add("is-dragging");
        this.place({ left: origin.left + deltaX, top: origin.top + deltaY });
      };
      const end = () => {
        document.removeEventListener("pointermove", move, true);
        document.removeEventListener("pointerup", end, true);
        this.bar.classList.remove("is-dragging");
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
      document.addEventListener("pointermove", move, true);
      document.addEventListener("pointerup", end, true);
    }
    persist() {
      this.onStateChange({
        toolbarMode: this.mode,
        toolbarEdgeRestoreMode: this.edgeRestoreMode,
        toolbarEdgeCenterY: this.edgeCenterY,
        toolbarCollapsed: this.mode === TOOLBAR_MODE.COLLAPSED,
        toolbarPosition: this.preferredPosition || this.currentPosition
      });
    }
    destroy() {
      window.removeEventListener("resize", this.onResize);
      window.visualViewport?.removeEventListener("resize", this.onResize);
      cancelAnimationFrame(this.resizeFrame);
      this.bar.remove();
    }
  };

  // src/ui/toast.js
  function toastIcon() {
    const icon = element("span", { className: "tr-toast-icon", attributes: { "aria-hidden": "true" } });
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 18 18");
    svg.setAttribute("focusable", "false");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "m4.5 9.2 2.85 2.85 6.15-6.4");
    svg.append(path);
    icon.append(svg);
    return icon;
  }
  var Toast = class {
    constructor(root) {
      this.stack = element("div", { className: "tr-toast-stack" });
      root.append(this.stack);
    }
    show(message, { duration = 2200 } = {}) {
      clearTimeout(this.timer);
      this.current?.remove();
      const toast = element("div", {
        className: "tr-toast",
        attributes: { role: "status", "aria-live": "polite", "aria-atomic": "true" }
      });
      toast.append(toastIcon(), element("span", { className: "tr-toast-message", text: message }));
      this.stack.append(toast);
      this.current = toast;
      this.timer = setTimeout(() => {
        if (this.current !== toast) return;
        toast.remove();
        this.current = null;
        this.timer = null;
      }, duration);
    }
  };

  // src/ui/custom-select.js
  var CustomSelect = class {
    constructor({ label, value, options }) {
      this.options = options;
      this.value = value;
      this.field = element("div", { className: "tr-field tr-combobox" });
      this.field.append(element("span", { className: "tr-field-label", text: label }));
      this.trigger = element("button", {
        className: "tr-combobox-trigger",
        attributes: { type: "button", "aria-haspopup": "listbox", "aria-expanded": "false", "aria-label": label }
      });
      this.valueLabel = element("span", { className: "tr-combobox-value" });
      this.chevron = element("span", { className: "tr-combobox-chevron", attributes: { "aria-hidden": "true" } });
      this.trigger.append(this.valueLabel, this.chevron);
      this.menu = element("div", { className: "tr-combobox-menu", attributes: { role: "listbox", "aria-label": label, hidden: "" } });
      this.optionButtons = /* @__PURE__ */ new Map();
      for (const [optionValue, optionLabel] of options) {
        const option = element("button", {
          className: "tr-combobox-option",
          text: optionLabel,
          attributes: { type: "button", role: "option", "data-value": optionValue }
        });
        option.addEventListener("click", () => {
          this.setValue(optionValue);
          this.field.dispatchEvent(new Event("change", { bubbles: true }));
          this.close();
          this.trigger.focus();
        });
        option.addEventListener("keydown", (event) => this.handleOptionKey(event, optionValue));
        this.optionButtons.set(optionValue, option);
        this.menu.append(option);
      }
      this.trigger.addEventListener("click", () => this.toggle());
      this.trigger.addEventListener("keydown", (event) => this.handleTriggerKey(event));
      this.field.append(this.trigger, this.menu);
      this.setValue(value);
    }
    setValue(value) {
      const selected = this.options.find(([optionValue]) => optionValue === value) || this.options[0];
      this.value = selected[0];
      this.valueLabel.textContent = selected[1];
      for (const [optionValue, button2] of this.optionButtons) {
        const active = optionValue === this.value;
        button2.classList.toggle("is-selected", active);
        button2.setAttribute("aria-selected", String(active));
      }
    }
    toggle() {
      if (this.isOpen) this.close();
      else this.open();
    }
    open({ focusSelected = false } = {}) {
      if (this.isOpen) return;
      this.isOpen = true;
      this.menu.hidden = false;
      this.field.classList.add("is-open");
      this.trigger.setAttribute("aria-expanded", "true");
      this.outsideHandler = (event) => {
        if (!event.composedPath().includes(this.field)) this.close();
      };
      document.addEventListener("pointerdown", this.outsideHandler, true);
      if (focusSelected) this.optionButtons.get(this.value)?.focus();
    }
    close() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.menu.hidden = true;
      this.field.classList.remove("is-open");
      this.trigger.setAttribute("aria-expanded", "false");
      document.removeEventListener("pointerdown", this.outsideHandler, true);
      this.outsideHandler = null;
    }
    handleTriggerKey(event) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        this.open({ focusSelected: true });
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.toggle();
      } else if (event.key === "Escape") {
        this.close();
      }
    }
    handleOptionKey(event, optionValue) {
      const index = this.options.findIndex(([value]) => value === optionValue);
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const offset = event.key === "ArrowDown" ? 1 : -1;
        const next = this.options[(index + offset + this.options.length) % this.options.length][0];
        this.optionButtons.get(next)?.focus();
      } else if (event.key === "Escape") {
        event.preventDefault();
        this.close();
        this.trigger.focus();
      }
    }
    destroy() {
      this.close();
    }
  };

  // src/ui/switch.js
  var ToggleSwitch = class {
    constructor(label, checked) {
      this.field = element("button", {
        className: "tr-switch-row",
        attributes: { type: "button", role: "switch", "aria-label": label }
      });
      this.label = element("span", { className: "tr-switch-label", text: label });
      this.track = element("span", { className: "tr-switch-track", attributes: { "aria-hidden": "true" } });
      this.thumb = element("span", { className: "tr-switch-thumb", attributes: { "aria-hidden": "true" } });
      this.icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.icon.setAttribute("class", "tr-switch-icon");
      this.icon.setAttribute("viewBox", "0 0 16 16");
      this.icon.setAttribute("fill", "none");
      this.icon.setAttribute("stroke", "currentColor");
      this.icon.setAttribute("stroke-width", "2.2");
      this.icon.setAttribute("stroke-linecap", "round");
      this.icon.setAttribute("stroke-linejoin", "round");
      this.iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      this.icon.append(this.iconPath);
      this.thumb.append(this.icon);
      this.track.append(this.thumb);
      this.field.append(this.label, this.track);
      this.field.addEventListener("click", () => this.setChecked(!this.checked));
      this.setChecked(checked);
    }
    setChecked(checked) {
      this.checked = Boolean(checked);
      this.field.classList.toggle("is-checked", this.checked);
      this.field.setAttribute("aria-checked", String(this.checked));
      this.iconPath.setAttribute("d", this.checked ? "M3 8.25 6.5 11.5 13 4.75" : "M5 5 11 11M11 5 5 11");
    }
  };

  // src/ui/dialog.js
  var Dialog = class {
    constructor(root) {
      this.root = root;
    }
    show({ title, content, actions = [], onClose }) {
      this.close();
      this.onClose = onClose;
      const overlay = element("div", { className: "tr-overlay", attributes: { role: "presentation" } });
      const panel = element("section", { className: "tr-dialog tr-dialog--scrollable", attributes: { role: "dialog", "aria-modal": "true" } });
      const contentArea = element("div", { className: "tr-dialog-content" });
      contentArea.append(content);
      panel.append(element("h2", { className: "tr-dialog-title", text: title }), contentArea);
      if (actions.length) {
        const actionBar = element("div", { className: "tr-actions" });
        actions.forEach((action) => actionBar.append(button(action.label, action.label, action.onClick, `tr-button${action.primary ? " tr-primary" : ""}`)));
        panel.append(actionBar);
      }
      overlay.append(panel);
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) this.close();
      });
      this.stopKeyboardPropagation = (event) => event.stopPropagation();
      panel.addEventListener("keydown", this.stopKeyboardPropagation);
      panel.addEventListener("keypress", this.stopKeyboardPropagation);
      panel.addEventListener("keyup", this.stopKeyboardPropagation);
      this.onKeyDown = (event) => {
        if (event.key === "Escape") this.close();
      };
      document.addEventListener("keydown", this.onKeyDown, true);
      this.root.append(overlay);
      this.overlay = overlay;
      return panel;
    }
    close() {
      this.onClose?.();
      this.onClose = null;
      this.overlay?.remove();
      this.overlay = null;
      if (this.onKeyDown) document.removeEventListener("keydown", this.onKeyDown, true);
      this.onKeyDown = null;
      this.stopKeyboardPropagation = null;
    }
  };
  function selectField(label, value, allowAuto = true) {
    return new CustomSelect({
      label,
      value,
      options: LANGUAGE_OPTIONS.filter(([code]) => allowAuto || code !== "auto")
    });
  }
  function textField(label, value, type = "number", attributes = {}) {
    const field = element("label", { className: "tr-field", text: label });
    const input = element("input", { className: "tr-input", attributes: { type, value, ...attributes } });
    field.append(input);
    return { field, input };
  }
  function openSettings(dialog, t, settings, onSave) {
    const content = element("form");
    const source = selectField(t("sourceLanguage"), settings.sourceLanguage);
    const target = selectField(t("targetLanguage"), settings.targetLanguage, false);
    const auto = new ToggleSwitch(t("autoTranslate"), settings.autoTranslate);
    const dynamic = new ToggleSwitch(t("translateDynamic"), settings.translateDynamic);
    const selection = new ToggleSwitch(t("showSelectionButton"), settings.showSelectionButton);
    const cache = new ToggleSwitch(t("cacheEnabled"), settings.cacheEnabled);
    const batch = textField(t("batchSize"), settings.batchSize);
    batch.input.min = "1";
    batch.input.max = "100";
    const timeout = textField(t("timeoutMs"), settings.timeoutMs);
    timeout.input.min = "3000";
    timeout.input.max = "60000";
    timeout.input.step = "1000";
    content.append(source.field, target.field, auto.field, dynamic.field, selection.field, cache.field, batch.field, timeout.field);
    dialog.show({
      title: t("settings"),
      content,
      onClose: () => {
        source.destroy();
        target.destroy();
      },
      actions: [
        { label: t("cancel"), onClick: () => dialog.close() },
        {
          label: t("save"),
          primary: true,
          onClick: async () => {
            await onSave({
              ...settings,
              sourceLanguage: source.value,
              targetLanguage: target.value,
              autoTranslate: auto.checked,
              translateDynamic: dynamic.checked,
              showSelectionButton: selection.checked,
              cacheEnabled: cache.checked,
              batchSize: Number(batch.input.value),
              timeoutMs: Number(timeout.input.value)
            });
            dialog.close();
          }
        }
      ]
    });
  }

  // src/selection/popup.js
  function languageSelect(label, value, allowAuto = true) {
    return new CustomSelect({
      label,
      value,
      options: LANGUAGE_OPTIONS.filter(([code]) => allowAuto || code !== "auto")
    });
  }
  function copyIconButton(label, onClick) {
    const node = button("", label, onClick, "tr-translation-copy");
    node.setAttribute("aria-label", label);
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 20 20");
    icon.setAttribute("aria-hidden", "true");
    const back = document.createElementNS("http://www.w3.org/2000/svg", "path");
    back.setAttribute("d", "M6.5 5V3.75A1.75 1.75 0 0 1 8.25 2h6A1.75 1.75 0 0 1 16 3.75v6A1.75 1.75 0 0 1 14.25 11.5H13");
    const front = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    front.setAttribute("x", "4");
    front.setAttribute("y", "6.5");
    front.setAttribute("width", "9.5");
    front.setAttribute("height", "11");
    front.setAttribute("rx", "1.75");
    icon.append(back, front);
    node.append(icon);
    return node;
  }
  var TranslationInputPopup = class {
    constructor(root, t, toast, { getSettings, translate }) {
      this.root = root;
      this.t = t;
      this.toast = toast;
      this.getSettings = getSettings;
      this.translate = translate;
    }
    open({ text = "", autoTranslate = false } = {}) {
      this.close();
      const settings = this.getSettings();
      this.source = languageSelect(this.t("sourceLanguage"), settings.sourceLanguage, true);
      this.target = languageSelect(this.t("targetLanguage"), settings.targetLanguage, false);
      const overlay = element("div", { className: "tr-overlay", attributes: { role: "presentation" } });
      const panel = element("section", { className: "tr-dialog tr-translation-dialog", attributes: { role: "dialog", "aria-modal": "true", "aria-label": this.t("inputTranslate") } });
      const header = element("div", { className: "tr-translation-header" });
      header.append(element("h2", { className: "tr-dialog-title", text: this.t("inputTranslate") }), button("\xD7", this.t("close"), () => this.close(), "tr-selection-close"));
      this.input = element("textarea", { className: "tr-translation-input", attributes: { rows: 5, placeholder: this.t("inputPlaceholder"), "aria-label": this.t("inputTranslate") } });
      this.input.value = text;
      this.result = element("p", { className: "tr-translation-result", text: this.t("translationPlaceholder"), attributes: { "data-state": "placeholder" } });
      this.copyButton = copyIconButton(this.t("copy"), () => this.copyResult());
      this.copyButton.disabled = true;
      this.resultHeader = element("div", { className: "tr-translation-result-header" });
      this.resultHeader.append(element("span", { className: "tr-selection-section-label", text: this.t("translation") }), this.copyButton);
      this.resultSection = element("section", { className: "tr-translation-result-section" });
      this.resultSection.append(this.resultHeader, this.result);
      this.translateButton = button(this.t("translate"), this.t("translate"), () => this.run(), "tr-button tr-primary");
      const actions = element("div", { className: "tr-actions" });
      actions.append(this.translateButton);
      this.languages = element("div", { className: "tr-translation-languages" });
      this.languages.append(this.source.field, this.target.field);
      this.hint = element("p", { className: "tr-translation-hint", text: this.t("inputShortcut") });
      const content = element("div", { className: "tr-translation-content" });
      content.append(this.languages, this.input, this.hint, this.resultSection);
      panel.append(header, content, actions);
      overlay.append(panel);
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) this.close();
      });
      this.keyHandler = (event) => {
        if (event.key === "Escape") this.close();
      };
      this.input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
          event.preventDefault();
          this.run();
        }
      });
      this.input.addEventListener("input", () => this.resetResult());
      document.addEventListener("keydown", this.keyHandler, true);
      this.root.append(overlay);
      this.overlay = overlay;
      if (autoTranslate && text.trim()) queueMicrotask(() => this.run());
      else this.input.focus();
    }
    async run() {
      if (!this.overlay || !this.source || !this.target) return;
      const input = this.input;
      const source = this.source;
      const target = this.target;
      const result = this.result;
      const resultSection = this.resultSection;
      const translateButton = this.translateButton;
      const text = input?.value.trim();
      if (!text) {
        input?.focus();
        return;
      }
      if (this.busy) return;
      this.busy = true;
      translateButton.disabled = true;
      translateButton.textContent = "\u2026";
      this.result.textContent = this.t("translating");
      this.result.dataset.state = "loading";
      this.copyButton.disabled = true;
      try {
        const translation = await this.translate(text, { sourceLanguage: source.value, targetLanguage: target.value });
        if (this.result !== result) return;
        result.textContent = translation;
        result.dataset.state = "translated";
        this.copyButton.disabled = false;
      } catch (error) {
        if (this.result === result) {
          result.textContent = this.t("translationPlaceholder");
          result.dataset.state = "placeholder";
          if (this.copyButton) this.copyButton.disabled = true;
        }
        console.error("[translator-userscript]", error);
      } finally {
        this.busy = false;
        if (this.translateButton === translateButton) {
          translateButton.disabled = false;
          translateButton.textContent = this.t("translate");
        }
      }
    }
    async copyResult() {
      const text = this.result?.dataset.state === "translated" ? this.result.textContent : "";
      if (!text) return;
      try {
        await copyText(text);
        return;
      } catch {
        return;
      }
    }
    resetResult() {
      if (!this.result || this.busy) return;
      this.result.textContent = this.t("translationPlaceholder");
      this.result.dataset.state = "placeholder";
      if (this.copyButton) this.copyButton.disabled = true;
    }
    close() {
      this.source?.destroy();
      this.target?.destroy();
      this.source = null;
      this.target = null;
      this.overlay?.remove();
      this.overlay = null;
      this.input = null;
      this.result = null;
      this.resultSection = null;
      this.translateButton = null;
      this.copyButton = null;
      if (this.keyHandler) document.removeEventListener("keydown", this.keyHandler, true);
      this.keyHandler = null;
      this.busy = false;
    }
  };

  // src/selection/selection.js
  function getSelectedText() {
    return window.getSelection()?.toString().trim() || "";
  }
  var SelectionTranslator = class {
    constructor(root, { getSettings, onOpen, onNewSelection = () => {
    }, t }) {
      this.getSettings = getSettings;
      this.onOpen = onOpen;
      this.onNewSelection = onNewSelection;
      this.root = root;
      this.value = "";
      this.anchor = null;
      this.suppressedSelection = null;
      this.button = button("", t("selectionTranslate"), () => this.translateCurrent(), "tr-selection-button");
      this.button.addEventListener("pointerdown", (event) => event.preventDefault());
      root.append(this.button);
      this.onSelectionChange = () => this.refresh();
      this.onMouseUp = () => setTimeout(() => this.refresh(), 0);
      this.onTouchEnd = () => setTimeout(() => this.refresh(), 0);
      document.addEventListener("selectionchange", this.onSelectionChange);
      document.addEventListener("mouseup", this.onMouseUp);
      document.addEventListener("touchend", this.onTouchEnd, { passive: true });
    }
    refresh() {
      if (!this.getSettings().showSelectionButton) return this.hide();
      const selection = window.getSelection();
      const value = getSelectedText();
      if (!value || value.length > 5e3 || !selection.rangeCount) return this.hide();
      const range = selection.getRangeAt(0);
      const common = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;
      if (common?.closest?.("[data-translator-ui]")) return this.hide();
      const rects = range.getClientRects();
      const rect = rects[rects.length - 1] || range.getBoundingClientRect();
      if (!rect || !rect.width && !rect.height) return this.hide();
      if (this.isSuppressedSelection(value, range)) {
        this.value = value;
        this.button.classList.remove("is-visible");
        return;
      }
      this.suppressedSelection = null;
      if (this.value !== value) this.onNewSelection();
      this.value = value;
      this.anchor = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
      this.positionButton(this.anchor);
      this.button.classList.add("is-visible");
    }
    positionButton(rect) {
      const size = 26;
      const gap = 8;
      let left = rect.right + gap;
      let top = rect.bottom + gap;
      if (left + size > window.innerWidth - gap) left = rect.left - size - gap;
      if (left < gap) left = Math.max(gap, Math.min(window.innerWidth - size - gap, rect.left + (rect.width - size) / 2));
      if (top + size > window.innerHeight - gap) top = rect.top - size - gap;
      this.button.style.left = `${Math.round(Math.max(gap, Math.min(window.innerWidth - size - gap, left)))}px`;
      this.button.style.top = `${Math.round(Math.max(gap, Math.min(window.innerHeight - size - gap, top)))}px`;
    }
    hide() {
      this.value = "";
      this.anchor = null;
      this.suppressedSelection = null;
      this.button.classList.remove("is-visible");
    }
    translateCurrent() {
      const text = this.value;
      const anchor = this.anchor;
      if (!text || !anchor) return;
      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      this.suppressedSelection = range ? {
        text,
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      } : null;
      this.value = "";
      this.anchor = null;
      this.button.classList.remove("is-visible");
      this.onOpen(text, anchor);
    }
    isSuppressedSelection(value, range) {
      const previous = this.suppressedSelection;
      return Boolean(previous && previous.text === value && previous.startContainer === range.startContainer && previous.startOffset === range.startOffset && previous.endContainer === range.endContainer && previous.endOffset === range.endOffset);
    }
    destroy() {
      document.removeEventListener("selectionchange", this.onSelectionChange);
      document.removeEventListener("mouseup", this.onMouseUp);
      document.removeEventListener("touchend", this.onTouchEnd);
      this.button.remove();
    }
  };

  // src/main.js
  async function bootstrap() {
    if (window.self !== window.top) return;
    if (document.contentType?.includes("xml")) return;
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
      onProgress: (count) => toast.show(t("translated", { count })),
      onError: (error) => console.error("[translator-userscript]", error)
    });
    const popup = new TranslationInputPopup(root, t, toast, {
      getSettings: () => settings,
      translate: (text, overrides) => controller.translateText(text, overrides)
    });
    const runPage = async () => {
      toast.show(t("translating"), { duration: 6e4 });
      try {
        await controller.translatePage();
      } catch (error) {
        console.error("[translator-userscript]", error);
      }
    };
    const runVisible = async () => {
      toast.show(t("translating"), { duration: 6e4 });
      try {
        await controller.translateVisible();
      } catch (error) {
        console.error("[translator-userscript]", error);
      }
    };
    const restore = () => {
      const count = controller.restore();
      toast.show(t("restored", { count }));
    };
    const siteHostname = normalizeHostname(location.hostname);
    const isSiteAutoTranslateEnabled = () => shouldAutoTranslateSite(siteHostname, settings);
    const applySiteAutoTranslateChange = async (previousEnabled) => {
      const enabled = isSiteAutoTranslateEnabled();
      if (enabled === previousEnabled) return;
      if (enabled) await runPage();
      else restore();
    };
    const saveSettings = async (next) => {
      const previousEnabled = isSiteAutoTranslateEnabled();
      settings = await settingsStore.save(next);
      controller.refreshDynamicObserver();
      toolbar?.setSiteAutoTranslateEnabled(isSiteAutoTranslateEnabled());
      await applySiteAutoTranslateChange(previousEnabled);
    };
    const showSettings = () => openSettings(dialog, t, settings, saveSettings);
    const openInput = () => popup.open();
    const setSiteAutoTranslate = async (enabled) => {
      const previousEnabled = isSiteAutoTranslateEnabled();
      settings = await settingsStore.save({
        ...settings,
        siteAutoTranslatePreferences: { ...settings.siteAutoTranslatePreferences, [siteHostname]: enabled }
      });
      toolbar?.setSiteAutoTranslateEnabled(isSiteAutoTranslateEnabled());
      toast.show(t(enabled ? "siteAutoTranslateEnabled" : "siteAutoTranslateDisabled"));
      await applySiteAutoTranslateChange(previousEnabled);
    };
    const runSelection = () => {
      const text = getSelectedText();
      if (!text) {
        toast.show(t("noSelection"));
        return;
      }
      popup.open({ text, autoTranslate: true });
    };
    const saveToolbarState = (patch) => {
      const next = { ...settings, ...patch };
      return settingsStore.save(next).then((saved) => {
        settings = saved;
        return saved;
      });
    };
    toolbar = new Toolbar(root, t, {
      translatePage: runPage,
      translateVisible: runVisible,
      openInput,
      restore,
      openSettings: showSettings,
      onToggleSiteAutoTranslate: setSiteAutoTranslate
    }, {
      position: settings.toolbarPosition,
      mode: settings.toolbarMode,
      edgeRestoreMode: settings.toolbarEdgeRestoreMode,
      edgeCenterY: settings.toolbarEdgeCenterY,
      collapsed: settings.toolbarCollapsed,
      autoTranslateForSite: isSiteAutoTranslateEnabled(),
      onStateChange: saveToolbarState
    });
    new SelectionTranslator(root, {
      getSettings: () => settings,
      onOpen: (text) => popup.open({ text, autoTranslate: true }),
      onNewSelection: () => popup.close(),
      t
    });
    api.registerMenuCommand(t("menuTranslatePage"), runPage);
    api.registerMenuCommand(t("menuTranslateSelection"), runSelection);
    api.registerMenuCommand(t("translateVisible"), runVisible);
    api.registerMenuCommand(t("inputTranslate"), openInput);
    api.registerMenuCommand(t("restore"), restore);
    api.registerMenuCommand(t("settings"), showSettings);
    if (isSiteAutoTranslateEnabled()) {
      await whenIdle();
      runPage();
    }
  }
  bootstrap().catch((error) => console.error("[translator-userscript]", error));
})();
