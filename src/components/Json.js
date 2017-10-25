/* eslint no-use-before-define: [0] */

import { keyPairs } from '../util';

const valueStart = '<span class="value">';
const valueEnd = '</span>';
const valueSeparator = `<span class="separator">,</span>${valueEnd}${valueStart}`;

const arrayStart = '<span class="array"><a class="start">[</a>';
const arrayEnd = '<span class="end">]</span></span>';
const objectStart = '<span class="object"><a class="start">{</a>';
const objectEnd = '<span class="end">}</span></span>';
const abruptEnd = '</span>';

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

// Taken from mustache (so I assume it's good)
const escapeHtml = (string) => String(string).replace(/[&<>"'`=\/]/g, s => entityMap[s]);

const wrapContents = (elementsHtml, placeholder) =>
  `<span class="contents">${elementsHtml}</span><span class="collapse">${placeholder}</span>`;

const renderObjectKey = (key, overwritten) => {
  const className = overwritten ? 'key overwritten' : 'key';
  return `<span class="${className}">"${escapeHtml(key)}"</span><span class="colon">: </span>`;
};
const renderObjectEntry = (objectKeys) => ([key, value]) => {
  const overwritten = objectKeys[key][1] !== value;
  return renderObjectKey(key, overwritten) + render(value);
};

const renderTypes = {
  string: match => `<span class="string">${escapeHtml(match)}</span>`,
  number: match => `<span class="number">${match}</span>`,
  boolean: match => `<span class="boolean">${match}</span>`,
  null: () => '<span class="null">null</span>',
  array(match, value, isComplete) {
    const elementsHtml = valueStart + value.map(render).join(valueSeparator) + valueEnd;
    const contents = value.length ? wrapContents(elementsHtml, value.length) : '';
    return arrayStart + contents + (isComplete ? arrayEnd : abruptEnd);
  },
  object(match, value, isComplete) {
    const objectKeys = keyPairs(value);
    const elementsHtml =
      valueStart +
      value.map(renderObjectEntry(objectKeys)).join(valueSeparator) +
      valueEnd;
    const contents = value.length ? wrapContents(elementsHtml, '&hellip;') : '';
    return objectStart + contents + (isComplete ? objectEnd : abruptEnd);
  },
};

const render = value => renderTypes[value.type](value.match, value.value, value.isComplete);

export default ({ json }) => (json ? render(json) : '');
