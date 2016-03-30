(function () {
  'use strict';

  function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports), module.exports; }


  var babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };
  babelHelpers;

  var isObject = __commonjs(function (module) {
    /**
     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value);
      return !!value && (type == 'object' || type == 'function');
    }

    module.exports = isObject;
  });

  var require$$0$1 = isObject && (typeof isObject === 'undefined' ? 'undefined' : babelHelpers.typeof(isObject)) === 'object' && 'default' in isObject ? isObject['default'] : isObject;

  var isFunction = __commonjs(function (module) {
    var isObject = require$$0$1;

    /** `Object#toString` result references. */
    var funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]';

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8 which returns 'object' for typed array and weak map constructors,
      // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
      var tag = isObject(value) ? objectToString.call(value) : '';
      return tag == funcTag || tag == genTag;
    }

    module.exports = isFunction;
  });

  var require$$1 = isFunction && (typeof isFunction === 'undefined' ? 'undefined' : babelHelpers.typeof(isFunction)) === 'object' && 'default' in isFunction ? isFunction['default'] : isFunction;

  var toNumber = __commonjs(function (module) {
    var isFunction = require$$1,
        isObject = require$$0$1;

    /** Used as references for various `Number` constants. */
    var NAN = 0 / 0;

    /** Used to match leading and trailing whitespace. */
    var reTrim = /^\s+|\s+$/g;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    var reIsOctal = /^0o[0-7]+$/i;

    /** Built-in method references without a dependency on `root`. */
    var freeParseInt = parseInt;

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3);
     * // => 3
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3');
     * // => 3
     */
    function toNumber(value) {
      if (isObject(value)) {
        var other = isFunction(value.valueOf) ? value.valueOf() : value;
        value = isObject(other) ? other + '' : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, '');
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }

    module.exports = toNumber;
  });

  var require$$0 = toNumber && (typeof toNumber === 'undefined' ? 'undefined' : babelHelpers.typeof(toNumber)) === 'object' && 'default' in toNumber ? toNumber['default'] : toNumber;

  var now = __commonjs(function (module) {
    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @type {Function}
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => logs the number of milliseconds it took for the deferred function to be invoked
     */
    var now = Date.now;

    module.exports = now;
  });

  var require$$1$1 = now && (typeof now === 'undefined' ? 'undefined' : babelHelpers.typeof(now)) === 'object' && 'default' in now ? now['default'] : now;

  var debounce = __commonjs(function (module) {
    var isObject = require$$0$1,
        now = require$$1$1,
        toNumber = require$$0;

    /** Used as the `TypeError` message for "Functions" methods. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeMax = Math.max;

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide an options object to indicate whether `func` should be invoked on
     * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent calls
     * to the debounced function return the result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify invoking on the leading
     *  edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
     *  delayed before it's invoked.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          leading = false,
          maxWait = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxWait = 'maxWait' in options && nativeMax(toNumber(options.maxWait) || 0, wait);
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function cancel() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (maxTimeoutId) {
          clearTimeout(maxTimeoutId);
        }
        lastCalled = 0;
        args = maxTimeoutId = thisArg = timeoutId = trailingCall = undefined;
      }

      function complete(isCalled, id) {
        if (id) {
          clearTimeout(id);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (isCalled) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = undefined;
          }
        }
      }

      function delayed() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0 || remaining > wait) {
          complete(trailingCall, maxTimeoutId);
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      }

      function flush() {
        if (timeoutId && trailingCall || maxTimeoutId && trailing) {
          result = func.apply(thisArg, args);
        }
        cancel();
        return result;
      }

      function maxDelayed() {
        complete(trailing, timeoutId);
      }

      function debounced() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!lastCalled && !maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled);

          var isCalled = (remaining <= 0 || remaining > maxWait) && (leading || maxTimeoutId);

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          } else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        } else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = undefined;
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    module.exports = debounce;
  });

  var debounce$1 = debounce && (typeof debounce === 'undefined' ? 'undefined' : babelHelpers.typeof(debounce)) === 'object' && 'default' in debounce ? debounce['default'] : debounce;

  var textarea = document.getElementById('textarea');
  var output = document.getElementById('output');
  var divider = document.getElementById('divider');
  var error = document.getElementById('error');

  var separator = '<span class="separator">,</span>';

  var arrayEntryStart = '<span class="value">';
  var objectEntryStart = '<span class="value">';
  var entryEnd = '</span>';
  var arrayJoiner = separator + entryEnd + arrayEntryStart;
  var objectJoiner = separator + entryEnd + objectEntryStart;

  var arrayStart = '<span class="array"><a class="start">[</a>';
  var arrayEnd = '<span class="end">]</span></span>';
  var objectStart = '<span class="object"><a class="start">{</a>';
  var objectEnd = '<span class="end">}</span></span>';

  var wrapContents = function wrapContents(elementsHtml) {
    return '<span class="contents">' + elementsHtml + '</span><span class="collapse">...</span>';
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
      var elementsHtml = arrayEntryStart + value.map(render).join(arrayJoiner) + entryEnd;
      var contents = value.length ? wrapContents(elementsHtml) : '';
      return arrayStart + contents + arrayEnd;
    } else if ((typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) === 'object') {
      var renderEntry = function renderEntry(key) {
        return '<span class="key">"' + key + '"</span><span class="colon">: </span>' + render(value[key]);
      };
      var keys = Object.keys(value);
      var _elementsHtml = objectEntryStart + keys.map(renderEntry).join(objectJoiner) + entryEnd;
      var _contents = keys.length ? wrapContents(_elementsHtml) : '';
      return objectStart + _contents + objectEnd;
    }
    throw new Error('Unexpected JSON value');
  };

  textarea.addEventListener('input', debounce$1(function () {
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