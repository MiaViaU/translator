import { normalizeSettings } from '../config/defaults.js';

const SETTINGS_KEY = 'translator.settings.v1';

export class SettingsStore {
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
}
