/* eslint no-use-before-define: [0] */

const separator = '<span class="separator">,</span>';

const arrayStart = '<span class="array"><a class="start">[</a>';
const arrayEnd = '<span class="end">]</span></span>';
const objectStart = '<span class="object"><a class="start">{</a>';
const objectEnd = '<span class="end">}</span></span>';

const wrapContents = elementsHtml =>
  `<span class="contents">${elementsHtml}</span><span class="collapse">...</span>`;

const renderArrayValue = input =>
  `<span class="array"><a class="start">[</a>${render(input)}<span class="end">]</span></span>`;
const renderObjectKey = key =>
  `<span class="key">"${key}"</span><span class="colon">: </span>`;
const renderObjectValue = value =>
  `<span class="object"><a class="start">{</a>${render(value)}<span class="end">}</span></span>`;
const renderObjectEntry = (key, value) =>
  renderObjectKey(key) + renderObjectValue(value);

const render = value => {
  const valueType = typeof value;
  if (valueType === 'number') {
    return `<span class="number">${value}</span>`;
  } else if (valueType === 'string') {
    return `<span class="string">"${value}"</span>`;
  } else if (value === null) {
    return `<span class="null">${value}</span>`;
  } else if (Array.isArray(value)) {
    const elementsHtml = value.map(renderArrayValue).join(separator);
    const contents = value.length ? wrapContents(elementsHtml) : '';
    return arrayStart + contents + arrayEnd;
  } else if (typeof value === 'object') {
    const keys = Object.keys(value);
    const elementsHtml = keys.map(key => renderObjectEntry(key, value[key])).join(separator);
    const contents = keys.length ? wrapContents(elementsHtml) : '';
    return objectStart + contents + objectEnd;
  }
  throw new Error('Unexpected JSON value');
};

export default render;
