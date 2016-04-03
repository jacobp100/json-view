export const debounce = (fn, delay) => {
  let timeout = null;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
};

export const keyPairs = (obj) => (
  obj.reduce((out, pair) => {
    out[pair[0]] = pair; // eslint-disable-line
    return out;
  }, {})
);
