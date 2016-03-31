/* eslint no-use-before-define: [0] */

const whiteSpace = /^[\s\n\t]+/;
const stringRe = /^(?:"(?:\\"|[^"])+"|'(?:\\'|[^'])+')/;
const numberRe = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[Ee][+-]?[0-9]+)?/;
const nullRe = /^null/;
const booleanRe = /^(?:true|false)/;
const arrayStartRe = /^\[/;
const arrayEndRe = /^\]/;
const objectStartRe = /^\{/;
const objectEndRe = /^\}/;
const keySeparatorRe = /^\:/;
const separatorRe = /^,/;

const stringTransformer = text => text.substring(1, text.length - 1);

const simpleValueRegexps = [
  ['string', stringRe, stringTransformer],
  ['number', numberRe, Number],
  ['boolean', booleanRe, value => value === 'true'],
  ['null', nullRe, () => null],
];

const unexpectedToken = (remainingText, value) =>
  [`Unexpected token: "${remainingText[0]}"`, remainingText, value];

const advanceOne = text => text.substring(1);
const advanceText = (text, value) => text.substring(value.length);
const advanceWhitespace = text => text.replace(whiteSpace, '');

const parseCommaSeparated = (type, fn, endRe) => text => {
  let remainingText = text;
  let shouldMatchComma = false;

  const value = [];

  const output = isComplete => ({ type, value, isComplete });

  while (true) { // eslint-disable-line
    remainingText = advanceWhitespace(remainingText);

    if (!remainingText) {
      return ['Unexpected end of input', '', output(false)];
    }

    if (endRe.test(remainingText)) {
      if ((shouldMatchComma && value.length > 0) || (!shouldMatchComma && value.length === 0)) {
        return [null, advanceOne(remainingText), output(true)];
      }
      return unexpectedToken(remainingText, output(false));
    } else if (shouldMatchComma) {
      if (!separatorRe.test(remainingText)) {
        return unexpectedToken(remainingText, output(false));
      }
      remainingText = advanceOne(remainingText);
      shouldMatchComma = false;
    } else {
      const [err, nextRemainingText, element] = fn(remainingText);
      remainingText = nextRemainingText;
      value.push(element);
      shouldMatchComma = true;

      if (err) {
        return [err, nextRemainingText, output(false)];
      }
    }
  }
};

const parseObjectEntry = trimmedText => {
  let remainingText = trimmedText;

  const keyMatch = trimmedText.match(stringRe);
  if (!keyMatch) { return ['Expected a key', trimmedText]; }
  const key = stringTransformer(keyMatch[0]);
  remainingText = advanceText(trimmedText, keyMatch[0]);
  remainingText = advanceWhitespace(remainingText);

  if (!keySeparatorRe.test(remainingText)) { return unexpectedToken(remainingText); }
  remainingText = advanceOne(remainingText);
  remainingText = advanceWhitespace(remainingText);

  const [err, nextRemainingText, value] = parseValue(remainingText);

  return [err, nextRemainingText, [key, value]];
};

const parseValue = text => {
  const remainingText = advanceWhitespace(text);

  const simpleValue = simpleValueRegexps.reduce((value, [type, regexp, transformer]) => {
    if (value) { return value; }

    const match = remainingText.match(regexp);
    return match
      ? { type, match: match[0], value: transformer(match[0]) }
      : null;
  }, null);

  if (simpleValue) {
    const { match } = simpleValue;
    return [null, advanceText(text, match), simpleValue];
  } else if (arrayStartRe.test(remainingText)) {
    return matchArray(advanceOne(text));
  } else if (objectStartRe.test(remainingText)) {
    return matchObject(advanceOne(text));
  }
  return unexpectedToken(text);
};

const matchObject = parseCommaSeparated('object', parseObjectEntry, objectEndRe);
const matchArray = parseCommaSeparated('array', parseValue, arrayEndRe);


const resolveAst = ({ type, value }) => {
  if (type === 'array') {
    return value.map(resolveAst);
  } else if (type === 'object') {
    value.reduce((out, [key, elementValue]) => {
      out[key] = resolveAst(elementValue); // eslint-disable-line
      return out;
    }, {});
  }
  return value;
};

export const parseWithAst = text => {
  const [message, remainingText, value] = parseValue(text);
  const error = message ? { message, remainingText } : null;
  return { error, value };
};

export const parse = text => {
  const { error, value: astValue } = parseWithAst(text);
  const value = astValue && resolveAst(astValue);
  return { error, value };
};
