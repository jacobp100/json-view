import { parseWithAst } from 'json-half-parse';
import { debounce } from './util';
import Output from './components/output';

const container = document.getElementById('container');
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
  const { clientX, clientY } = ('touches' in e) ? e.touches[0] : e;
  const { clientWidth, clientHeight } = document.documentElement;

  const isHorizontal = window.getComputedStyle(container).flexDirection === 'row';

  const dividerPosition = isHorizontal
    ? (clientX / clientWidth * 100)
    : (clientY / clientHeight * 100);

  textarea.style.flexBasis = `${dividerPosition}%`;
  output.style.flexBasis = `${100 - dividerPosition}%`;

  window.getSelection().removeAllRanges(); // Dragging the slider causes random selections
  e.preventDefault(); // Stop the refresh dropdown when dragging downwards on Android phone
};

divider.addEventListener('mousedown', () => {
  document.addEventListener('mousemove', adjustWidths);
});

document.addEventListener('mouseup', () => {
  document.removeEventListener('mousemove', adjustWidths);
});

divider.addEventListener('touchstart', () => {
  document.addEventListener('touchmove', adjustWidths);
});

document.addEventListener('touchend', () => {
  document.removeEventListener('touchmove', adjustWidths);
});

document.addEventListener('click', ({ target }) => {
  if (target.matches('a.start')) {
    target.parentElement.classList.toggle('hidden');
  } else if (target.matches('a.error')) {
    const offset = Number(target.getAttribute('data-offset'));
    textarea.setSelectionRange(offset, offset);
  }
});
