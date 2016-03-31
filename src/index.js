import { debounce } from './util';
import render from './renderJSON';

const textarea = document.getElementById('textarea');
const output = document.getElementById('output');
const divider = document.getElementById('divider');
const error = document.getElementById('error');

textarea.addEventListener('input', debounce(() => {
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
}, 200));

const adjustWidths = e => {
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

document.addEventListener('click', ({ target }) => {
  if (target.matches('a.start')) {
    target.parentElement.classList.toggle('hidden');
  }
});
