import { uiStyles } from '../styles/ui.js';
import { element } from './dom.js';

export function createUiRoot() {
  const host = element('div', { attributes: { 'data-translator-ui': '' } });
  document.documentElement.append(host);
  const shadow = host.attachShadow({ mode: 'open' });
  const style = element('style', { text: uiStyles });
  const root = element('div', { className: 'tr-root', attributes: { 'data-translator-ui': '' } });
  shadow.append(style, root);
  return { host, shadow, root };
}
