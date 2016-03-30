const textarea = document.getElementById('textarea');
const output = document.getElementById('output');
const divider = document.getElementById('divider');
const error = document.getElementById('error');

const debounce = (delay, fn) => {
  let timer = null;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};

const separator = '<span class="separator">,</span>';

const arrayEntryStart = '<span class="value">';
const objectEntryStart = '<span class="value">';
const entryEnd = '</span>';
const arrayJoiner = separator + entryEnd + arrayEntryStart;
const objectJoiner = separator + entryEnd + objectEntryStart;

const arrayStart = '<span class="array"><a class="start">[</a>';
const arrayEnd = '<span class="end">]</span></span>';
const objectStart = '<span class="object"><a class="start">{</a>';
const objectEnd = '<span class="end">}</span></span>';

const render = value => {
  const valueType = typeof value;
  if (valueType === 'number') {
    return `<span class="number">${value}</span>`;
  } else if (valueType === 'string') {
    return `<span class="string">"${value}"</span>`;
  } else if (value === null) {
    return `<span class="null">${value}</span>`;
  } else if (Array.isArray(value)) {
    const elementsHtml = arrayEntryStart + value.map(render).join(arrayJoiner) + entryEnd;
    const contents = value.length ? `<span class="contents">${elementsHtml}</span>` : '';
    return arrayStart + contents + arrayEnd;
  } else if (typeof value === 'object') {
    const renderEntry = key =>
      `<span class="key">"${key}"</span><span class="colon">: </span>${render(value[key])}`;
    const keys = Object.keys(value);
    const elementsHtml = objectEntryStart + keys.map(renderEntry).join(objectJoiner) + entryEnd;
    const contents = keys.length ? `<span class="contents">${elementsHtml}</span>` : '';
    return objectStart + contents + objectEnd;
  }
  throw new Error('Unexpected JSON value');
};

textarea.addEventListener('input', debounce(200, () => {
  const { value } = textarea;

  if (value.match(/^\s*$/)) {
    output.innerHTML = '';
    return;
  }

  try {
    const json = JSON.parse(value);
    output.innerHTML = render(json);
    error.classList.remove('visible');
  } catch (e) {
    error.textContent = e.message;
    error.classList.add('visible');
  }
}));

const adjustWidths = (e) => {
  const { width } = divider.getBoundingClientRect();
  const dividerPosition = (e.clientX - width / 2) / document.body.clientWidth * 100;
  textarea.style.width = `${dividerPosition}%`;
  output.style.width = `${100 - dividerPosition}%`;
};

divider.addEventListener('mousedown', () => {
  document.addEventListener('mousemove', adjustWidths);
});

document.addEventListener('mouseup', () => {
  document.removeEventListener('mousemove', adjustWidths);
});
