export default ({ message }) => (
  message
    ? `<div class="error">${message}</div>`
    : ''
);
