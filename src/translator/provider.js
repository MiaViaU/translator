export class ProviderError extends Error {
  constructor(message, { status = 0, cause } = {}) {
    super(message, { cause });
    this.name = 'ProviderError';
    this.status = status;
  }

  get isAuthorizationError() {
    return this.status === 401 || this.status === 403;
  }

  get isRetryable() {
    return this.status === 0 || this.status >= 500;
  }
}

export class TranslationProvider {
  async translate() {
    throw new Error('Provider 必须实现 translate()');
  }

  async translateBatch() {
    throw new Error('Provider 必须实现 translateBatch()');
  }

  async detect() {
    throw new Error('Provider 必须实现 detect()');
  }
}
