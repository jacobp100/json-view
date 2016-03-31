export const debounce = (fn, delay) => {
  let timeout = null;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
};
