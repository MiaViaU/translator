function asPromise(callbackRequest, details) {
  return new Promise((resolve, reject) => {
    callbackRequest({
      ...details,
      onload: resolve,
      onerror: (error) => reject(Object.assign(new Error('网络请求失败'), { response: error, status: error?.status || 0 })),
      ontimeout: (error) => reject(Object.assign(new Error('请求超时'), { response: error, status: error?.status || 0 })),
      onabort: (error) => reject(Object.assign(new Error('请求已取消'), { response: error, status: error?.status || 0 })),
    });
  });
}

export function createGmApi(scope = globalThis) {
  const modern = scope.GM;
  return {
    async getValue(key, fallback) {
      if (modern?.getValue) return modern.getValue(key, fallback);
      if (typeof scope.GM_getValue === 'function') return scope.GM_getValue(key, fallback);
      return fallback;
    },
    async setValue(key, value) {
      if (modern?.setValue) return modern.setValue(key, value);
      if (typeof scope.GM_setValue === 'function') return scope.GM_setValue(key, value);
      return undefined;
    },
    registerMenuCommand(label, handler) {
      if (modern?.registerMenuCommand) return modern.registerMenuCommand(label, handler);
      if (typeof scope.GM_registerMenuCommand === 'function') return scope.GM_registerMenuCommand(label, handler);
      return undefined;
    },
    request(details) {
      if (modern?.xmlHttpRequest) return Promise.resolve(modern.xmlHttpRequest(details));
      if (typeof scope.GM_xmlhttpRequest === 'function') return asPromise(scope.GM_xmlhttpRequest, details);
      return Promise.reject(new Error('当前脚本管理器不支持跨域请求'));
    },
  };
}
