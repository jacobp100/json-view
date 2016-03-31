(function () {
  'use strict';

  var babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };
  babelHelpers;

  var debounce = function debounce(fn, delay) {
    var timeout = null;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(fn, delay);
    };
  };

  /* eslint no-use-before-define: [0] */

  var separator = '<span class="separator">,</span>';

  var arrayStart = '<span class="array"><a class="start">[</a>';
  var arrayEnd = '<span class="end">]</span></span>';
  var objectStart = '<span class="object"><a class="start">{</a>';
  var objectEnd = '<span class="end">}</span></span>';

  var wrapContents = function wrapContents(elementsHtml) {
    return '<span class="contents">' + elementsHtml + '</span><span class="collapse">...</span>';
  };

  var renderArrayValue = function renderArrayValue(input) {
    return '<span class="array"><a class="start">[</a>' + render(input) + '<span class="end">]</span></span>';
  };
  var renderObjectKey = function renderObjectKey(key) {
    return '<span class="key">"' + key + '"</span><span class="colon">: </span>';
  };
  var renderObjectValue = function renderObjectValue(value) {
    return '<span class="object"><a class="start">{</a>' + render(value) + '<span class="end">}</span></span>';
  };
  var renderObjectEntry = function renderObjectEntry(key, value) {
    return renderObjectKey(key) + renderObjectValue(value);
  };

  var render = function render(value) {
    var valueType = typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value);
    if (valueType === 'number') {
      return '<span class="number">' + value + '</span>';
    } else if (valueType === 'string') {
      return '<span class="string">"' + value + '"</span>';
    } else if (value === null) {
      return '<span class="null">' + value + '</span>';
    } else if (Array.isArray(value)) {
      var elementsHtml = value.map(renderArrayValue).join(separator);
      var contents = value.length ? wrapContents(elementsHtml) : '';
      return arrayStart + contents + arrayEnd;
    } else if ((typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) === 'object') {
      var keys = Object.keys(value);
      var _elementsHtml = keys.map(function (key) {
        return renderObjectEntry(key, value[key]);
      }).join(separator);
      var _contents = keys.length ? wrapContents(_elementsHtml) : '';
      return objectStart + _contents + objectEnd;
    }
    throw new Error('Unexpected JSON value');
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

    try {
      var json = JSON.parse(value);
      output.innerHTML = render(json);
      error.classList.remove('visible');
    } catch (e) {
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