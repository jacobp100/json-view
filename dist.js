(function () {
  'use strict';

  var babelHelpers = {};

  babelHelpers.slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  babelHelpers;

  var debounce = function debounce(fn, delay) {
    var timeout = null;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(fn, delay);
    };
  };

  /* eslint no-use-before-define: [0] */

  var valueStart = '<span class="value">';
  var valueEnd = '</span>';
  var valueSeparator = '<span class="separator">,</span>' + valueEnd + valueStart;

  var arrayStart = '<span class="array"><a class="start">[</a>';
  var arrayEnd = '<span class="end">]</span></span>';
  var objectStart = '<span class="object"><a class="start">{</a>';
  var objectEnd = '<span class="end">}</span></span>';
  var abruptEnd = '</span>';

  var wrapContents = function wrapContents(elementsHtml, placeholder) {
    return '<span class="contents">' + elementsHtml + '</span><span class="collapse">' + placeholder + '</span>';
  };

  var renderObjectKey = function renderObjectKey(key) {
    return '<span class="key">"' + key + '"</span><span class="colon">: </span>';
  };
  var renderObjectEntry = function renderObjectEntry(_ref) {
    var _ref2 = babelHelpers.slicedToArray(_ref, 2);

    var key = _ref2[0];
    var value = _ref2[1];
    return renderObjectKey(key) + render(value);
  };

  var renderTypes = {
    number: function number(match) {
      return '<span class="number">' + match + '</span>';
    },
    string: function string(match) {
      return '<span class="string">' + match + '</span>';
    },
    boolean: function boolean(match) {
      return '<span class="boolean">' + match + '</span>';
    },
    null: function _null(match) {
      return '<span class="null">' + match + '</span>';
    },
    array: function array(match, value, isComplete) {
      var elementsHtml = valueStart + value.map(render).join(valueSeparator) + valueEnd;
      var contents = value.length ? wrapContents(elementsHtml, value.length) : '';
      return arrayStart + contents + (isComplete ? arrayEnd : abruptEnd);
    },
    object: function object(match, value, isComplete) {
      var elementsHtml = valueStart + value.map(renderObjectEntry).join(valueSeparator) + valueEnd;
      var contents = value.length ? wrapContents(elementsHtml, '&hellip;') : '';
      return objectStart + contents + (isComplete ? objectEnd : abruptEnd);
    }
  };

  var render = function render(value) {
    return renderTypes[value.type](value.match, value.value, value.isComplete);
  };

  var Json = (function (_ref3) {
    var json = _ref3.json;
    return json ? render(json) : '';
  })

  var ErrorMessage = (function (_ref) {
    var message = _ref.message;
    return message ? '<div class="error">' + message + '</div>' : '';
  })

  var RemainingText = (function (_ref) {
    var remainingText = _ref.remainingText;
    return remainingText ? '<div class="remaining-text">' + remainingText + '</div>' : '';
  })

  var Output = (function (_ref) {
    var json = _ref.json;
    var message = _ref.message;
    var remainingText = _ref.remainingText;
    return Json({ json: json }) + ErrorMessage({ message: message }) + RemainingText({ remainingText: remainingText });
  })

  /* eslint no-use-before-define: [0] */

  var whiteSpace = /^[\s\n\t]+/;
  var stringRe = /^(?:"(?:\\"|[^"])+"|'(?:\\'|[^'])+')/;
  var numberRe = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[Ee][+-]?[0-9]+)?/;
  var nullRe = /^null/;
  var booleanRe = /^(?:true|false)/;
  var arrayStartRe = /^\[/;
  var arrayEndRe = /^\]/;
  var objectStartRe = /^\{/;
  var objectEndRe = /^\}/;
  var keySeparatorRe = /^\:/;
  var separatorRe = /^,/;

  var stringTransformer = function stringTransformer(text) {
    return text.substring(1, text.length - 1);
  };

  var simpleValueRegexps = [['string', stringRe, stringTransformer], ['number', numberRe, Number], ['boolean', booleanRe, function (value) {
    return value === 'true';
  }], ['null', nullRe, function () {
    return null;
  }]];

  var unexpectedToken = function unexpectedToken(remainingText, value) {
    return ['Unexpected token: "' + remainingText[0] + '"', remainingText, value];
  };

  var advanceOne = function advanceOne(text) {
    return text.substring(1);
  };
  var advanceText = function advanceText(text, value) {
    return text.substring(value.length);
  };
  var advanceWhitespace = function advanceWhitespace(text) {
    return text.replace(whiteSpace, '');
  };

  var parseCommaSeparated = function parseCommaSeparated(type, fn, endRe) {
    return function (text) {
      var remainingText = text;
      var shouldMatchComma = false;

      var value = [];

      var output = function output(isComplete) {
        return { type: type, value: value, isComplete: isComplete };
      };

      while (true) {
        // eslint-disable-line
        remainingText = advanceWhitespace(remainingText);

        if (!remainingText) {
          return ['Unexpected end of input', '', output(false)];
        }

        if (endRe.test(remainingText)) {
          if (shouldMatchComma && value.length > 0 || !shouldMatchComma && value.length === 0) {
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
          var _fn = fn(remainingText);

          var _fn2 = babelHelpers.slicedToArray(_fn, 3);

          var err = _fn2[0];
          var nextRemainingText = _fn2[1];
          var element = _fn2[2];

          remainingText = nextRemainingText;
          shouldMatchComma = true;

          if (element) {
            // Objects and arrays will return a partially completed value, primitives will not
            value.push(element);
          }

          if (err) {
            return [err, nextRemainingText, output(false)];
          }
        }
      }
    };
  };

  var parseObjectEntry = function parseObjectEntry(trimmedText) {
    var remainingText = trimmedText;

    var keyMatch = trimmedText.match(stringRe);
    if (!keyMatch) {
      return ['Expected a key', trimmedText];
    }
    var key = stringTransformer(keyMatch[0]);
    remainingText = advanceText(trimmedText, keyMatch[0]);
    remainingText = advanceWhitespace(remainingText);

    if (!keySeparatorRe.test(remainingText)) {
      return unexpectedToken(remainingText);
    }
    remainingText = advanceOne(remainingText);
    remainingText = advanceWhitespace(remainingText);

    var _parseValue = parseValue(remainingText);

    var _parseValue2 = babelHelpers.slicedToArray(_parseValue, 3);

    var err = _parseValue2[0];
    var nextRemainingText = _parseValue2[1];
    var value = _parseValue2[2];


    return [err, nextRemainingText, [key, value]];
  };

  var parseValue = function parseValue(text) {
    var remainingText = advanceWhitespace(text);

    var simpleValue = simpleValueRegexps.reduce(function (value, _ref) {
      var _ref2 = babelHelpers.slicedToArray(_ref, 3);

      var type = _ref2[0];
      var regexp = _ref2[1];
      var transformer = _ref2[2];

      if (value) {
        return value;
      }

      var match = remainingText.match(regexp);
      return match ? { type: type, match: match[0], value: transformer(match[0]) } : null;
    }, null);

    if (simpleValue) {
      var match = simpleValue.match;

      return [null, advanceText(text, match), simpleValue];
    } else if (arrayStartRe.test(remainingText)) {
      return matchArray(advanceOne(text));
    } else if (objectStartRe.test(remainingText)) {
      return matchObject(advanceOne(text));
    }
    return unexpectedToken(text);
  };

  var matchObject = parseCommaSeparated('object', parseObjectEntry, objectEndRe);
  var matchArray = parseCommaSeparated('array', parseValue, arrayEndRe);

  var parseWithAst = function parseWithAst(text) {
    var _parseValue3 = parseValue(text);

    var _parseValue4 = babelHelpers.slicedToArray(_parseValue3, 3);

    var message = _parseValue4[0];
    var remainingText = _parseValue4[1];
    var value = _parseValue4[2];

    var error = message ? { message: message, remainingText: remainingText } : null;
    return { error: error, value: value };
  };

  var textarea = document.getElementById('textarea');
  var output = document.getElementById('output');
  var divider = document.getElementById('divider');
  var error = document.getElementById('error');

  textarea.addEventListener('input', debounce(function () {
    var value = textarea.value;


    if (value.match(/^\s*$/)) {
      output.innerHTML = '';
      return;
    }

    var _parseWithAst = parseWithAst(value);

    var e = _parseWithAst.error;
    var json = _parseWithAst.value;

    var message = e ? e.message : null;
    var remainingText = e ? e.remainingText : null;
    output.innerHTML = Output({ json: json, message: message, remainingText: remainingText });
    if (!e) {
      error.classList.remove('visible');
    } else {
      error.textContent = e.message;
      error.classList.add('visible');
    }
  }, 200));

  var adjustWidths = function adjustWidths(e) {
    var _divider$getBoundingC = divider.getBoundingClientRect();

    var width = _divider$getBoundingC.width;

    var dividerPosition = (e.clientX - width / 2) / document.body.clientWidth * 100;
    textarea.style.width = dividerPosition + '%';
    output.style.width = 100 - dividerPosition + '%';
  };

  divider.addEventListener('mousedown', function () {
    document.addEventListener('mousemove', adjustWidths);
  });

  document.addEventListener('mouseup', function () {
    document.removeEventListener('mousemove', adjustWidths);
  });

  document.addEventListener('click', function (_ref) {
    var target = _ref.target;

    if (target.matches('a.start')) {
      target.parentElement.classList.toggle('hidden');
    }
  });

}());