export default ({ message, location }) => (
  message
    ? `<a class="error" data-offset=${location.offset}>${message}</a>`
    : ''
);
