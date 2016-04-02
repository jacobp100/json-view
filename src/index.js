import { parseWithAst } from 'json-half-parse';
import { debounce } from './util';
import Output from './components/output';

const textarea = document.getElementById('textarea');
const output = document.getElementById('output');
const divider = document.getElementById('divider');

textarea.addEventListener('input', debounce(() => {
  const { value } = textarea;

  if (value.match(/^\s*$/)) {
    output.innerHTML = '';
    return;
  }

  const { error: e, value: json } = parseWithAst(value);
  const message = e ? e.message : null;
  const location = e ? e.location : null;
  const remainingText = e ? e.remainingText : null;
  output.innerHTML = Output({ json, message, location, remainingText });
}, 200));

const adjustWidths = e => {
  const { width } = divider.getBoundingClientRect();
  const dividerPosition = (e.clientX - width / 2) / document.body.clientWidth * 100;
  textarea.style.width = `${dividerPosition}%`;
  output.style.width = `${100 - dividerPosition}%`;
  window.getSelection().removeAllRanges(); // Dragging the slider causes random selections
};

divider.addEventListener('mousedown', () => {
  document.addEventListener('mousemove', adjustWidths);
});

document.addEventListener('mouseup', () => {
  document.removeEventListener('mousemove', adjustWidths);
});

document.addEventListener('click', ({ target }) => {
  if (target.matches('a.start')) {
    target.parentElement.classList.toggle('hidden');
  } else if (target.matches('a.error')) {
    const offset = Number(target.getAttribute('data-offset'));
    textarea.setSelectionRange(offset, offset);
  }
});
