export function element(tag, { className, text, attributes = {} } = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  for (const [name, value] of Object.entries(attributes)) {
    if (value !== undefined && value !== null) node.setAttribute(name, String(value));
  }
  return node;
}

export function button(label, title, onClick, className = 'tr-button') {
  const node = element('button', { className, text: label, attributes: { type: 'button', title } });
  node.addEventListener('click', onClick);
  return node;
}
