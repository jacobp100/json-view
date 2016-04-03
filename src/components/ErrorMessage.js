export default ({ message, location }) => {
  if (!message) return '';

  const locationStr = `(line: ${location.line} column: ${location.column})`;
  return `<a href="#" class="error" data-offset=${location.offset}>${message} ${locationStr}</a>`;
};
