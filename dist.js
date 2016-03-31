(function () {
  'use strict';

  var debounce = function (fn, delay) {
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

  var wrapContents = function (elementsHtml, placeholder) {
    return '<span class="contents">' + elementsHtml + '</span><span class="collapse">' + placeholder + '</span>';
  };

  var renderObjectKey = function (key) {
    return '<span class="key">"' + key + '"</span><span class="colon">: </span>';
  };
  var renderObjectEntry = function (_ref) {
    var key = _ref[0];
    var value = _ref[1];
    return renderObjectKey(key) + render(value);
  };

  var renderTypes = {
    number: function (match) {
      return '<span class="number">' + match + '</span>';
    },
    string: function (match) {
      return '<span class="string">' + match + '</span>';
    },
    boolean: function (match) {
      return '<span class="boolean">' + match + '</span>';
    },
    null: function (match) {
      return '<span class="null">' + match + '</span>';
    },
    array: function (match, value, isComplete) {
      var elementsHtml = valueStart + value.map(render).join(valueSeparator) + valueEnd;
      var contents = value.length ? wrapContents(elementsHtml, value.length) : '';
      return arrayStart + contents + (isComplete ? arrayEnd : abruptEnd);
    },
    object: function (match, value, isComplete) {
      var elementsHtml = valueStart + value.map(renderObjectEntry).join(valueSeparator) + valueEnd;
      var contents = value.length ? wrapContents(elementsHtml, '&hellip;') : '';
      return objectStart + contents + (isComplete ? objectEnd : abruptEnd);
    }
  };

  var render = function (value) {
    return renderTypes[value.type](value.match, value.value, value.isComplete);
  };

  var Json = (function (_ref2) {
    var json = _ref2.json;
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

  var stringTransformer = function (text) {
    return text.substring(1, text.length - 1);
  };

  var simpleValueRegexps = [['string', stringRe, stringTransformer], ['number', numberRe, Number], ['boolean', booleanRe, function (value) {
    return value === 'true';
  }], ['null', nullRe, function () {
    return null;
  }]];

  var unexpectedToken = function (remainingText, value) {
    return ['Unexpected token: "' + remainingText[0] + '"', remainingText, value];
  };

  var advanceOne = function (text) {
    return text.substring(1);
  };
  var advanceText = function (text, value) {
    return text.substring(value.length);
  };
  var advanceWhitespace = function (text) {
    return text.replace(whiteSpace, '');
  };

  var parseCommaSeparated = function (type, fn, endRe) {
    return function (text) {
      var remainingText = text;
      var shouldMatchComma = false;

      var value = [];

      var output = function (isComplete) {
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

          var err = _fn[0];
          var nextRemainingText = _fn[1];
          var element = _fn[2];

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

  var parseObjectEntry = function (trimmedText) {
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

    var err = _parseValue[0];
    var nextRemainingText = _parseValue[1];
    var value = _parseValue[2];


    return [err, nextRemainingText, [key, value]];
  };

  var parseValue = function (text) {
    var remainingText = advanceWhitespace(text);

    var simpleValue = simpleValueRegexps.reduce(function (value, _ref) {
      var type = _ref[0];
      var regexp = _ref[1];
      var transformer = _ref[2];

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

  var parseWithAst = function (text) {
    var _parseValue2 = parseValue(text);

    var message = _parseValue2[0];
    var remainingText = _parseValue2[1];
    var value = _parseValue2[2];

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

  var adjustWidths = function (e) {
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