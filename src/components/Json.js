/* eslint no-use-before-define: [0] */

const valueStart = '<span class="value">';
const valueEnd = '</span>';
const valueSeparator = `<span class="separator">,</span>${valueEnd}${valueStart}`;

const arrayStart = '<span class="array"><a class="start">[</a>';
const arrayEnd = '<span class="end">]</span></span>';
const objectStart = '<span class="object"><a class="start">{</a>';
const objectEnd = '<span class="end">}</span></span>';
const abruptEnd = '</span>';

const wrapContents = elementsHtml =>
  `<span class="contents">${elementsHtml}</span><span class="collapse">...</span>`;

const renderObjectKey = key =>
  `<span class="key">"${key}"</span><span class="colon">: </span>`;
const renderObjectEntry = ([key, value]) =>
  renderObjectKey(key) + render(value);

const renderTypes = {
  number: match => `<span class="number">${match}</span>`,
  string: match => `<span class="string">${match}</span>`,
  boolean: match => `<span class="boolean">${match}</span>`,
  null: match => `<span class="null">${match}</span>`,
  array(match, value, isComplete) {
    const elementsHtml = valueStart + value.map(render).join(valueSeparator) + valueEnd;
    const contents = value.length ? wrapContents(elementsHtml) : '';
    return arrayStart + contents + (isComplete ? arrayEnd : abruptEnd);
  },
  object(match, value, isComplete) {
    const elementsHtml = valueStart + value.map(renderObjectEntry).join(valueSeparator) + valueEnd;
    const contents = value.length ? wrapContents(elementsHtml) : '';
    return objectStart + contents + (isComplete ? objectEnd : abruptEnd);
  },
};

const render = value => renderTypes[value.type](value.match, value.value, value.isComplete);

export default ({ json }) => (json ? render(json) : '');
