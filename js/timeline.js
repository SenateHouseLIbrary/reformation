(function (root) {
  root.TL = {VERSION: '0.1', _originalL: root.TL}
}(this));
TL.debug = !1;
TL.Bind = function (fn, obj) {
  return function () {
    return fn.apply(obj, arguments)
  }
};
trace = function (msg) {
  if (TL.debug) {
    if (window.console) {
      console.log(msg)
    }
    else if (typeof (jsTrace) != 'undefined') {
      jsTrace.send(msg)
    }
    else {
    }
  }
}

function TL_Error(message_key, detail) {
  this.name = 'TL.Error';
  this.message = message_key || 'error';
  this.message_key = this.message;
  this.detail = detail || '';
  var e = new Error();
  if (e.hasOwnProperty('stack')) {
    this.stack = e.stack
  }
}

TL_Error.prototype = Object.create(Error.prototype);
TL_Error.prototype.constructor = TL_Error;
TL.Error = TL_Error;
TL.Util = {
  mergeData: function (data_main, data_to_merge) {
    var x;
    for (x in data_to_merge) {
      if (Object.prototype.hasOwnProperty.call(data_to_merge, x)) {
        data_main[x] = data_to_merge[x]
      }
    }
    return data_main
  }, extend: function (dest) {
    var sources = Array.prototype.slice.call(arguments, 1);
    for (var j = 0, len = sources.length, src; j < len; j++) {
      src = sources[j] || {};
      TL.Util.mergeData(dest, src)
    }
    return dest
  }, isEven: function (n) {
    return n == parseFloat(n) ? !(n % 2) : void 0
  }, isTrue: function (s) {
    if (s == null) {
      return !1;
    }
    return s == !0 || String(s).toLowerCase() == 'true' || Number(s) == 1
  }, findArrayNumberByUniqueID: function (id, array, prop, defaultVal) {
    var _n = defaultVal || 0;
    for (var i = 0; i < array.length; i++) {
      if (array[i].data[prop] == id) {
        _n = i
      }
    }
    ;
    return _n
  }, convertUnixTime: function (str) {
    var _date, _months, _year, _month, _day, _time, _date_array = [],
      _date_str = {
        ymd: "",
        time: "",
        time_array: [],
        date_array: [],
        full_array: []
      };
    _date_str.ymd = str.split(" ")[0];
    _date_str.time = str.split(" ")[1];
    _date_str.date_array = _date_str.ymd.split("-");
    _date_str.time_array = _date_str.time.split(":");
    _date_str.full_array = _date_str.date_array.concat(_date_str.time_array)
    for (var i = 0; i < _date_str.full_array.length; i++) {
      _date_array.push(parseInt(_date_str.full_array[i]))
    }
    _date = new Date(_date_array[0], _date_array[1], _date_array[2], _date_array[3], _date_array[4], _date_array[5]);
    _months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    _year = _date.getFullYear();
    _month = _months[_date.getMonth()];
    _day = _date.getDate();
    _time = _month + ', ' + _day + ' ' + _year;
    return _time
  }, setData: function (obj, data) {
    obj.data = TL.Util.extend({}, obj.data, data);
    if (obj.data.unique_id === "") {
      obj.data.unique_id = TL.Util.unique_ID(6)
    }
  }, stamp: (function () {
    var lastId = 0, key = '_tl_id';
    return function (obj) {
      obj[key] = obj[key] || ++lastId;
      return obj[key]
    }
  }()), isArray: (function () {
    if (Array.isArray) {
      return Array.isArray
    }
    var objectToStringFn = Object.prototype.toString,
      arrayToStringResult = objectToStringFn.call([]);
    return function (subject) {
      return objectToStringFn.call(subject) === arrayToStringResult
    }
  }()), getRandomNumber: function (range) {
    return Math.floor(Math.random() * range)
  }, unique_ID: function (size, prefix) {
    var getRandomNumber = function (range) {
      return Math.floor(Math.random() * range)
    };
    var getRandomChar = function () {
      var chars = "abcdefghijklmnopqurstuvwxyz";
      return chars.substr(getRandomNumber(32), 1)
    };
    var randomID = function (size) {
      var str = "";
      for (var i = 0; i < size; i++) {
        str += getRandomChar()
      }
      return str
    };
    if (prefix) {
      return prefix + "-" + randomID(size)
    }
    else {
      return "tl-" + randomID(size)
    }
  }, ensureUniqueKey: function (obj, candidate) {
    if (!candidate) {
      candidate = TL.Util.unique_ID(6)
    }
    if (!(candidate in obj)) {
      return candidate
    }
    var root = candidate.match(/^(.+)(-\d+)?$/)[1];
    var similar_ids = [];
    for (key in obj) {
      if (key.match(/^(.+?)(-\d+)?$/)[1] == root) {
        similar_ids.push(key)
      }
    }
    candidate = root + "-" + (similar_ids.length + 1);
    for (var counter = similar_ids.length; similar_ids.indexOf(candidate) != -1; counter++) {
      candidate = root + '-' + counter
    }
    return candidate
  }, htmlify: function (str) {
    if (str.match(/<p>[\s\S]*?<\/p>/)) {
      return str
    }
    else {
      return "<p>" + str + "</p>"
    }
  }, linkify: function (text, targets, is_touch) {
    var make_link = function (url, link_text, prefix) {
      if (!prefix) {
        prefix = ""
      }
      var MAX_LINK_TEXT_LENGTH = 30;
      if (link_text && link_text.length > MAX_LINK_TEXT_LENGTH) {
        link_text = link_text.substring(0, MAX_LINK_TEXT_LENGTH) + "\u2026"
      }
      return prefix + "<a class='tl-makelink' href='" + url + "' onclick='void(0)'>" + link_text + "</a>"
    }
    var urlPattern = /\b(?:https?|ftp):\/\/([a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/gim;
    var pseudoUrlPattern = /(^|[^\/>])(www\.[\S]+(\b|$))/gim;
    var emailAddressPattern = /([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/gim;
    return text.replace(urlPattern, function (match, url_sans_protocol, offset, string) {
      if (offset > 0) {
        var prechar = string[offset - 1];
        if (prechar == '"' || prechar == "'" || prechar == "=") {
          return match
        }
      }
      return make_link(match, url_sans_protocol)
    }).replace(pseudoUrlPattern, function (match, beforePseudo, pseudoUrl, offset, string) {
      return make_link('http://' + pseudoUrl, pseudoUrl, beforePseudo)
    }).replace(emailAddressPattern, function (match, email, offset, string) {
      return make_link('mailto:' + email, email)
    })
  }, unlinkify: function (text) {
    if (!text) {
      return text;
    }
    text = text.replace(/<a\b[^>]*>/i, "");
    text = text.replace(/<\/a>/i, "");
    return text
  }, getParamString: function (obj) {
    var params = [];
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        params.push(i + '=' + obj[i])
      }
    }
    return '?' + params.join('&')
  }, formatNum: function (num, digits) {
    var pow = Math.pow(10, digits || 5);
    return Math.round(num * pow) / pow
  }, falseFn: function () {
    return !1
  }, requestAnimFrame: (function () {
    function timeoutDefer(callback) {
      window.setTimeout(callback, 1000 / 60)
    }

    var requestFn = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || timeoutDefer;
    return function (callback, context, immediate, contextEl) {
      callback = context ? TL.Util.bind(callback, context) : callback;
      if (immediate && requestFn === timeoutDefer) {
        callback()
      }
      else {
        requestFn(callback, contextEl)
      }
    }
  }()), bind: function (fn, obj) {
    return function () {
      return fn.apply(obj, arguments)
    }
  }, template: function (str, data) {
    return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
      var value = data[key];
      if (!data.hasOwnProperty(key)) {
        throw new TL.Error("template_value_err", str)
      }
      return value
    })
  }, hexToRgb: function (hex) {
    if (TL.Util.css_named_colors[hex.toLowerCase()]) {
      hex = TL.Util.css_named_colors[hex.toLowerCase()]
    }
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }, rgbToHex: function (rgb) {
    var r, g, b;
    if (typeof (rgb) == 'object') {
      r = rgb.r;
      g = rgb.g;
      b = rgb.b
    }
    else if (typeof (rgb.match) == 'function') {
      var parts = rgb.match(/^rgb\((\d+),(\d+),(\d+)\)$/);
      if (parts) {
        r = parts[1];
        g = parts[2];
        b = parts[3]
      }
    }
    if (isNaN(r) || isNaN(b) || isNaN(g)) {
      throw new TL.Error("invalid_rgb_err")
    }
    return "#" + TL.Util.intToHexString(r) + TL.Util.intToHexString(g) + TL.Util.intToHexString(b)
  }, colorObjToHex: function (o) {
    var parts = [o.r, o.g, o.b];
    return TL.Util.rgbToHex("rgb(" + parts.join(',') + ")")
  }, css_named_colors: {
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "aqua": "#00ffff",
    "aquamarine": "#7fffd4",
    "azure": "#f0ffff",
    "beige": "#f5f5dc",
    "bisque": "#ffe4c4",
    "black": "#000000",
    "blanchedalmond": "#ffebcd",
    "blue": "#0000ff",
    "blueviolet": "#8a2be2",
    "brown": "#a52a2a",
    "burlywood": "#deb887",
    "cadetblue": "#5f9ea0",
    "chartreuse": "#7fff00",
    "chocolate": "#d2691e",
    "coral": "#ff7f50",
    "cornflowerblue": "#6495ed",
    "cornsilk": "#fff8dc",
    "crimson": "#dc143c",
    "cyan": "#00ffff",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9",
    "darkgreen": "#006400",
    "darkkhaki": "#bdb76b",
    "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00",
    "darkorchid": "#9932cc",
    "darkred": "#8b0000",
    "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f",
    "darkslateblue": "#483d8b",
    "darkslategray": "#2f4f4f",
    "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3",
    "deeppink": "#ff1493",
    "deepskyblue": "#00bfff",
    "dimgray": "#696969",
    "dodgerblue": "#1e90ff",
    "firebrick": "#b22222",
    "floralwhite": "#fffaf0",
    "forestgreen": "#228b22",
    "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc",
    "ghostwhite": "#f8f8ff",
    "gold": "#ffd700",
    "goldenrod": "#daa520",
    "gray": "#808080",
    "green": "#008000",
    "greenyellow": "#adff2f",
    "honeydew": "#f0fff0",
    "hotpink": "#ff69b4",
    "indianred": "#cd5c5c",
    "indigo": "#4b0082",
    "ivory": "#fffff0",
    "khaki": "#f0e68c",
    "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5",
    "lawngreen": "#7cfc00",
    "lemonchiffon": "#fffacd",
    "lightblue": "#add8e6",
    "lightcoral": "#f08080",
    "lightcyan": "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgray": "#d3d3d3",
    "lightgreen": "#90ee90",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightseagreen": "#20b2aa",
    "lightskyblue": "#87cefa",
    "lightslategray": "#778899",
    "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0",
    "lime": "#00ff00",
    "limegreen": "#32cd32",
    "linen": "#faf0e6",
    "magenta": "#ff00ff",
    "maroon": "#800000",
    "mediumaquamarine": "#66cdaa",
    "mediumblue": "#0000cd",
    "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370db",
    "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a",
    "mediumturquoise": "#48d1cc",
    "mediumvioletred": "#c71585",
    "midnightblue": "#191970",
    "mintcream": "#f5fffa",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "navy": "#000080",
    "oldlace": "#fdf5e6",
    "olive": "#808000",
    "olivedrab": "#6b8e23",
    "orange": "#ffa500",
    "orangered": "#ff4500",
    "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa",
    "palegreen": "#98fb98",
    "paleturquoise": "#afeeee",
    "palevioletred": "#db7093",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "peru": "#cd853f",
    "pink": "#ffc0cb",
    "plum": "#dda0dd",
    "powderblue": "#b0e0e6",
    "purple": "#800080",
    "rebeccapurple": "#663399",
    "red": "#ff0000",
    "rosybrown": "#bc8f8f",
    "royalblue": "#4169e1",
    "saddlebrown": "#8b4513",
    "salmon": "#fa8072",
    "sandybrown": "#f4a460",
    "seagreen": "#2e8b57",
    "seashell": "#fff5ee",
    "sienna": "#a0522d",
    "silver": "#c0c0c0",
    "skyblue": "#87ceeb",
    "slateblue": "#6a5acd",
    "slategray": "#708090",
    "snow": "#fffafa",
    "springgreen": "#00ff7f",
    "steelblue": "#4682b4",
    "tan": "#d2b48c",
    "teal": "#008080",
    "thistle": "#d8bfd8",
    "tomato": "#ff6347",
    "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3",
    "white": "#ffffff",
    "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00",
    "yellowgreen": "#9acd32"
  }, ratio: {
    square: function (size) {
      var s = {w: 0, h: 0}
      if (size.w > size.h && size.h > 0) {
        s.h = size.h;
        s.w = size.h
      }
      else {
        s.w = size.w;
        s.h = size.w
      }
      return s
    }, r16_9: function (size) {
      if (size.w !== null && size.w !== "") {
        return Math.round((size.w / 16) * 9)
      }
      else if (size.h !== null && size.h !== "") {
        return Math.round((size.h / 9) * 16)
      }
      else {
        return 0
      }
    }, r4_3: function (size) {
      if (size.w !== null && size.w !== "") {
        return Math.round((size.w / 4) * 3)
      }
      else if (size.h !== null && size.h !== "") {
        return Math.round((size.h / 3) * 4)
      }
    }
  }, getObjectAttributeByIndex: function (obj, index) {
    if (typeof obj != 'undefined') {
      var i = 0;
      for (var attr in obj) {
        if (index === i) {
          return obj[attr]
        }
        i++
      }
      return ""
    }
    else {
      return ""
    }
  }, getUrlVars: function (string) {
    var str, vars = [], hash, hashes;
    str = string.toString();
    if (str.match('&#038;')) {
      str = str.replace("&#038;", "&")
    }
    else if (str.match('&#38;')) {
      str = str.replace("&#38;", "&")
    }
    else if (str.match('&amp;')) {
      str = str.replace("&amp;", "&")
    }
    hashes = str.slice(str.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1]
    }
    return vars
  }, trim: function (str) {
    if (str && typeof (str.replace) == 'function') {
      return str.replace(/^\s+|\s+$/g, '')
    }
    return ""
  }, slugify: function (str) {
    str = TL.Util.trim(str);
    str = str.toLowerCase();
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
    }
    str = str.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    str = str.replace(/^([0-9])/, '_$1');
    return str
  }, maxDepth: function (ary) {
    var stack = [];
    var max_depth = 0;
    for (var i = 0; i < ary.length; i++) {
      stack.push(ary[i]);
      if (stack.length > 1) {
        var top = stack[stack.length - 1]
        var bottom_idx = -1;
        for (var j = 0; j < stack.length - 1; j++) {
          if (stack[j][1] < top[0]) {
            bottom_idx = j
          }
        }
        ;
        if (bottom_idx >= 0) {
          stack = stack.slice(bottom_idx + 1)
        }
      }
      if (stack.length > max_depth) {
        max_depth = stack.length
      }
    }
    ;
    return max_depth
  }, pad: function (val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
      val = "0" + val;
    }
    return val
  }, intToHexString: function (i) {
    return TL.Util.pad(parseInt(i, 10).toString(16))
  }, findNextGreater: function (list, current, default_value) {
    for (var i = 0; i < list.length; i++) {
      if (current < list[i]) {
        return list[i]
      }
    }
    return (default_value) ? default_value : current
  }, findNextLesser: function (list, current, default_value) {
    for (var i = list.length - 1; i >= 0; i--) {
      if (current > list[i]) {
        return list[i]
      }
    }
    return (default_value) ? default_value : current
  }, isEmptyObject: function (o) {
    var properties = []
    if (Object.keys) {
      properties = Object.keys(o)
    }
    else {
      for (var p in o) {
        if (Object.prototype.hasOwnProperty.call(o, p)) {
          properties.push(p);
        }
      }
    }
    for (var i = 0; i < properties.length; i++) {
      var k = properties[i];
      if (o[k] != null && typeof o[k] != "string") {
        return !1;
      }
      if (TL.Util.trim(o[k]).length != 0) {
        return !1
      }
    }
    return !0
  }, parseYouTubeTime: function (s) {
    if (typeof (s) == 'string') {
      parts = s.match(/^\s*(\d+h)?(\d+m)?(\d+s)?\s*/i);
      if (parts) {
        var hours = parseInt(parts[1]) || 0;
        var minutes = parseInt(parts[2]) || 0;
        var seconds = parseInt(parts[3]) || 0;
        return seconds + (minutes * 60) + (hours * 60 * 60)
      }
    }
    else if (typeof (s) == 'number') {
      return s
    }
    return 0
  }, transformImageURL: function (url) {
    return url.replace(/(.*)www.dropbox.com\/(.*)/, '$1dl.dropboxusercontent.com/$2')
  }, base58: (function (alpha) {
    var alphabet = alpha || '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
      base = alphabet.length;
    return {
      encode: function (enc) {
        if (typeof enc !== 'number' || enc !== parseInt(enc)) {
          throw '"encode" only accepts integers.';
        }
        var encoded = '';
        while (enc) {
          var remainder = enc % base;
          enc = Math.floor(enc / base);
          encoded = alphabet[remainder].toString() + encoded
        }
        return encoded
      }, decode: function (dec) {
        if (typeof dec !== 'string') {
          throw '"decode" only accepts strings.';
        }
        var decoded = 0;
        while (dec) {
          var alphabetPosition = alphabet.indexOf(dec[0]);
          if (alphabetPosition < 0) {
            throw '"decode" can\'t find "' + dec[0] + '" in the alphabet: "' + alphabet + '"';
          }
          var powerOf = dec.length - 1;
          decoded += alphabetPosition * (Math.pow(base, powerOf));
          dec = dec.substring(1)
        }
        return decoded
      }
    }
  })()
};
(function (TL) {
  var Zepto = (function () {
    var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice,
      filter = emptyArray.filter, document = window.document,
      elementDisplay = {}, classCache = {}, cssNumber = {
        'column-count': 1,
        'columns': 1,
        'font-weight': 1,
        'line-height': 1,
        'opacity': 1,
        'z-index': 1,
        'zoom': 1
      }, fragmentRE = /^\s*<(\w+|!)[^>]*>/,
      singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
      tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
      rootNodeRE = /^(?:body|html)$/i, capitalRE = /([A-Z])/g,
      methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
      adjacencyOperators = ['after', 'prepend', 'before', 'append'],
      table = document.createElement('table'),
      tableRow = document.createElement('tr'), containers = {
        'tr': document.createElement('tbody'),
        'tbody': table,
        'thead': table,
        'tfoot': table,
        'td': tableRow,
        'th': tableRow,
        '*': document.createElement('div')
      }, readyRE = /complete|loaded|interactive/,
      classSelectorRE = /^\.([\w-]+)$/, idSelectorRE = /^#([\w-]*)$/,
      simpleSelectorRE = /^[\w-]*$/, class2type = {},
      toString = class2type.toString, zepto = {}, camelize, uniq,
      tempParent = document.createElement('div'), propMap = {
        'tabindex': 'tabIndex',
        'readonly': 'readOnly',
        'for': 'htmlFor',
        'class': 'className',
        'maxlength': 'maxLength',
        'cellspacing': 'cellSpacing',
        'cellpadding': 'cellPadding',
        'rowspan': 'rowSpan',
        'colspan': 'colSpan',
        'usemap': 'useMap',
        'frameborder': 'frameBorder',
        'contenteditable': 'contentEditable'
      }, isArray = Array.isArray || function (object) {
        return object instanceof Array
      }
    zepto.matches = function (element, selector) {
      if (!selector || !element || element.nodeType !== 1) {
        return !1
      }
      var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector
      if (matchesSelector) {
        return matchesSelector.call(element, selector)
      }
      var match, parent = element.parentNode, temp = !parent
      if (temp) {
        (parent = tempParent).appendChild(element)
      }
      match = ~zepto.qsa(parent, selector).indexOf(element)
      temp && tempParent.removeChild(element)
      return match
    }

    function type(obj) {
      return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
    }

    function isFunction(value) {
      return type(value) == "function"
    }

    function isWindow(obj) {
      return obj != null && obj == obj.window
    }

    function isDocument(obj) {
      return obj != null && obj.nodeType == obj.DOCUMENT_NODE
    }

    function isObject(obj) {
      return type(obj) == "object"
    }

    function isPlainObject(obj) {
      return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
    }

    function likeArray(obj) {
      return typeof obj.length == 'number'
    }

    function compact(array) {
      return filter.call(array, function (item) {
        return item != null
      })
    }

    function flatten(array) {
      return array.length > 0 ? $.fn.concat.apply([], array) : array
    }

    camelize = function (str) {
      return str.replace(/-+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : ''
      })
    }

    function dasherize(str) {
      return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/_/g, '-').toLowerCase()
    }

    uniq = function (array) {
      return filter.call(array, function (item, idx) {
        return array.indexOf(item) == idx
      })
    }

    function classRE(name) {
      return name in classCache ? classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
    }

    function maybeAddPx(name, value) {
      return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
    }

    function defaultDisplay(nodeName) {
      var element, display
      if (!elementDisplay[nodeName]) {
        element = document.createElement(nodeName)
        document.body.appendChild(element)
        display = getComputedStyle(element, '').getPropertyValue("display")
        element.parentNode.removeChild(element)
        display == "none" && (display = "block")
        elementDisplay[nodeName] = display
      }
      return elementDisplay[nodeName]
    }

    function children(element) {
      return 'children' in element ? slice.call(element.children) : $.map(element.childNodes, function (node) {
        if (node.nodeType == 1) {
          return node
        }
      })
    }

    zepto.fragment = function (html, name, properties) {
      var dom, nodes, container
      if (singleTagRE.test(html)) {
        dom = $(document.createElement(RegExp.$1))
      }
      if (!dom) {
        if (html.replace) {
          html = html.replace(tagExpanderRE, "<$1></$2>")
        }
        if (name === undefined) {
          name = fragmentRE.test(html) && RegExp.$1
        }
        if (!(name in containers)) {
          name = '*'
        }
        container = containers[name]
        container.innerHTML = '' + html
        dom = $.each(slice.call(container.childNodes), function () {
          container.removeChild(this)
        })
      }
      if (isPlainObject(properties)) {
        nodes = $(dom)
        $.each(properties, function (key, value) {
          if (methodAttributes.indexOf(key) > -1) {
            nodes[key](value)
          }
          else {
            nodes.attr(key, value)
          }
        })
      }
      return dom
    }
    zepto.Z = function (dom, selector) {
      dom = dom || []
      dom.__proto__ = $.fn
      dom.selector = selector || ''
      return dom
    }
    zepto.isZ = function (object) {
      return object instanceof zepto.Z
    }
    zepto.init = function (selector, context) {
      var dom
      if (!selector) {
        return zepto.Z()
      }
      else if (typeof selector == 'string') {
        selector = selector.trim()
        if (selector[0] == '<' && fragmentRE.test(selector)) {
          dom = zepto.fragment(selector, RegExp.$1, context), selector = null
        }
        else if (context !== undefined) {
          return $(context).find(selector)
        }
        else {
          dom = zepto.qsa(document, selector)
        }
      }
      else if (isFunction(selector)) {
        return $(document).ready(selector)
      }
      else if (zepto.isZ(selector)) {
        return selector
      }
      else {
        if (isArray(selector)) {
          dom = compact(selector)
        }
        else if (isObject(selector)) {
          dom = [selector], selector = null
        }
        else if (fragmentRE.test(selector)) {
          dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
        }
        else if (context !== undefined) {
          return $(context).find(selector)
        }
        else {
          dom = zepto.qsa(document, selector)
        }
      }
      return zepto.Z(dom, selector)
    }
    $ = function (selector, context) {
      return zepto.init(selector, context)
    }

    function extend(target, source, deep) {
      for (key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
          if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
            target[key] = {}
          }
          if (isArray(source[key]) && !isArray(target[key])) {
            target[key] = []
          }
          extend(target[key], source[key], deep)
        }
        else if (source[key] !== undefined) {
          target[key] = source[key]
        }
      }
    }

    $.extend = function (target) {
      var deep, args = slice.call(arguments, 1)
      if (typeof target == 'boolean') {
        deep = target
        target = args.shift()
      }
      args.forEach(function (arg) {
        extend(target, arg, deep)
      })
      return target
    }
    zepto.qsa = function (element, selector) {
      var found, maybeID = selector[0] == '#',
        maybeClass = !maybeID && selector[0] == '.',
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
        isSimple = simpleSelectorRE.test(nameOnly)
      return (isDocument(element) && isSimple && maybeID) ? ((found = element.getElementById(nameOnly)) ? [found] : []) : (element.nodeType !== 1 && element.nodeType !== 9) ? [] : slice.call(isSimple && !maybeID ? maybeClass ? element.getElementsByClassName(nameOnly) : element.getElementsByTagName(selector) : element.querySelectorAll(selector))
    }

    function filtered(nodes, selector) {
      return selector == null ? $(nodes) : $(nodes).filter(selector)
    }

    $.contains = function (parent, node) {
      return parent !== node && parent.contains(node)
    }

    function funcArg(context, arg, idx, payload) {
      return isFunction(arg) ? arg.call(context, idx, payload) : arg
    }

    function setAttribute(node, name, value) {
      value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
    }

    function className(node, value) {
      var klass = node.className, svg = klass && klass.baseVal !== undefined
      if (value === undefined) {
        return svg ? klass.baseVal : klass
      }
      svg ? (klass.baseVal = value) : (node.className = value)
    }

    function deserializeValue(value) {
      var num
      try {
        return value ? value == "true" || (value == "false" ? !1 : value == "null" ? null : !/^0/.test(value) && !isNaN(num = Number(value)) ? num : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value
      }
      catch (e) {
        return value
      }
    }

    $.type = type
    $.isFunction = isFunction
    $.isWindow = isWindow
    $.isArray = isArray
    $.isPlainObject = isPlainObject
    $.isEmptyObject = function (obj) {
      var name
      for (name in obj) {
        return !1
      }
      return !0
    }
    $.inArray = function (elem, array, i) {
      return emptyArray.indexOf.call(array, elem, i)
    }
    $.camelCase = camelize
    $.trim = function (str) {
      return str == null ? "" : String.prototype.trim.call(str)
    }
    $.uuid = 0
    $.support = {}
    $.expr = {}
    $.map = function (elements, callback) {
      var value, values = [], i, key
      if (likeArray(elements)) {
        for (i = 0; i < elements.length; i++) {
          value = callback(elements[i], i)
          if (value != null) {
            values.push(value)
          }
        }
      }
      else {
        for (key in elements) {
          value = callback(elements[key], key)
          if (value != null) {
            values.push(value)
          }
        }
      }
      return flatten(values)
    }
    $.each = function (elements, callback) {
      var i, key
      if (likeArray(elements)) {
        for (i = 0; i < elements.length; i++) {
          if (callback.call(elements[i], i, elements[i]) === !1) {
            return elements
          }
        }
      }
      else {
        for (key in elements) {
          if (callback.call(elements[key], key, elements[key]) === !1) {
            return elements
          }
        }
      }
      return elements
    }
    $.grep = function (elements, callback) {
      return filter.call(elements, callback)
    }
    if (window.JSON) {
      $.parseJSON = JSON.parse
    }
    $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
      class2type["[object " + name + "]"] = name.toLowerCase()
    })
    $.fn = {
      forEach: emptyArray.forEach,
      reduce: emptyArray.reduce,
      push: emptyArray.push,
      sort: emptyArray.sort,
      indexOf: emptyArray.indexOf,
      concat: emptyArray.concat,
      map: function (fn) {
        return $($.map(this, function (el, i) {
          return fn.call(el, i, el)
        }))
      },
      slice: function () {
        return $(slice.apply(this, arguments))
      },
      ready: function (callback) {
        if (readyRE.test(document.readyState) && document.body) {
          callback($)
        }
        else {
          document.addEventListener('DOMContentLoaded', function () {
            callback($)
          }, !1)
        }
        return this
      },
      get: function (idx) {
        return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
      },
      toArray: function () {
        return this.get()
      },
      size: function () {
        return this.length
      },
      remove: function () {
        return this.each(function () {
          if (this.parentNode != null) {
            this.parentNode.removeChild(this)
          }
        })
      },
      each: function (callback) {
        emptyArray.every.call(this, function (el, idx) {
          return callback.call(el, idx, el) !== !1
        })
        return this
      },
      filter: function (selector) {
        if (isFunction(selector)) {
          return this.not(this.not(selector))
        }
        return $(filter.call(this, function (element) {
          return zepto.matches(element, selector)
        }))
      },
      add: function (selector, context) {
        return $(uniq(this.concat($(selector, context))))
      },
      is: function (selector) {
        return this.length > 0 && zepto.matches(this[0], selector)
      },
      not: function (selector) {
        var nodes = []
        if (isFunction(selector) && selector.call !== undefined) {
          this.each(function (idx) {
            if (!selector.call(this, idx)) {
              nodes.push(this)
            }
          })
        }
        else {
          var excludes = typeof selector == 'string' ? this.filter(selector) : (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
          this.forEach(function (el) {
            if (excludes.indexOf(el) < 0) {
              nodes.push(el)
            }
          })
        }
        return $(nodes)
      },
      has: function (selector) {
        return this.filter(function () {
          return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size()
        })
      },
      eq: function (idx) {
        return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1)
      },
      first: function () {
        var el = this[0]
        return el && !isObject(el) ? el : $(el)
      },
      last: function () {
        var el = this[this.length - 1]
        return el && !isObject(el) ? el : $(el)
      },
      find: function (selector) {
        var result, $this = this
        if (typeof selector == 'object') {
          result = $(selector).filter(function () {
            var node = this
            return emptyArray.some.call($this, function (parent) {
              return $.contains(parent, node)
            })
          })
        }
        else if (this.length == 1) {
          result = $(zepto.qsa(this[0], selector))
        }
        else {
          result = this.map(function () {
            return zepto.qsa(this, selector)
          })
        }
        return result
      },
      closest: function (selector, context) {
        var node = this[0], collection = !1
        if (typeof selector == 'object') {
          collection = $(selector)
        }
        while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector))) {
          node = node !== context && !isDocument(node) && node.parentNode
        }
        return $(node)
      },
      parents: function (selector) {
        var ancestors = [], nodes = this
        while (nodes.length > 0) {
          nodes = $.map(nodes, function (node) {
            if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
              ancestors.push(node)
              return node
            }
          })
        }
        return filtered(ancestors, selector)
      },
      parent: function (selector) {
        return filtered(uniq(this.pluck('parentNode')), selector)
      },
      children: function (selector) {
        return filtered(this.map(function () {
          return children(this)
        }), selector)
      },
      contents: function () {
        return this.map(function () {
          return slice.call(this.childNodes)
        })
      },
      siblings: function (selector) {
        return filtered(this.map(function (i, el) {
          return filter.call(children(el.parentNode), function (child) {
            return child !== el
          })
        }), selector)
      },
      empty: function () {
        return this.each(function () {
          this.innerHTML = ''
        })
      },
      pluck: function (property) {
        return $.map(this, function (el) {
          return el[property]
        })
      },
      show: function () {
        return this.each(function () {
          this.style.display == "none" && (this.style.display = '')
          if (getComputedStyle(this, '').getPropertyValue("display") == "none") {
            this.style.display = defaultDisplay(this.nodeName)
          }
        })
      },
      replaceWith: function (newContent) {
        return this.before(newContent).remove()
      },
      wrap: function (structure) {
        var func = isFunction(structure)
        if (this[0] && !func) {
          var dom = $(structure).get(0),
            clone = dom.parentNode || this.length > 1
        }
        return this.each(function (index) {
          $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(!0) : dom)
        })
      },
      wrapAll: function (structure) {
        if (this[0]) {
          $(this[0]).before(structure = $(structure))
          var children
          while ((children = structure.children()).length) {
            structure = children.first()
          }
          $(structure).append(this)
        }
        return this
      },
      wrapInner: function (structure) {
        var func = isFunction(structure)
        return this.each(function (index) {
          var self = $(this), contents = self.contents(),
            dom = func ? structure.call(this, index) : structure
          contents.length ? contents.wrapAll(dom) : self.append(dom)
        })
      },
      unwrap: function () {
        this.parent().each(function () {
          $(this).replaceWith($(this).children())
        })
        return this
      },
      clone: function () {
        return this.map(function () {
          return this.cloneNode(!0)
        })
      },
      hide: function () {
        return this.css("display", "none")
      },
      toggle: function (setting) {
        return this.each(function () {
          var el = $(this);
          (setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
        })
      },
      prev: function (selector) {
        return $(this.pluck('previousElementSibling')).filter(selector || '*')
      },
      next: function (selector) {
        return $(this.pluck('nextElementSibling')).filter(selector || '*')
      },
      html: function (html) {
        return arguments.length === 0 ? (this.length > 0 ? this[0].innerHTML : null) : this.each(function (idx) {
          var originHtml = this.innerHTML
          $(this).empty().append(funcArg(this, html, idx, originHtml))
        })
      },
      text: function (text) {
        return arguments.length === 0 ? (this.length > 0 ? this[0].textContent : null) : this.each(function () {
          this.textContent = (text === undefined) ? '' : '' + text
        })
      },
      attr: function (name, value) {
        var result
        return (typeof name == 'string' && value === undefined) ? (this.length == 0 || this[0].nodeType !== 1 ? undefined : (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() : (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result) : this.each(function (idx) {
          if (this.nodeType !== 1) {
            return
          }
          if (isObject(name)) {
            for (key in name) {
              setAttribute(this, key, name[key])
            }
          }
          else {
            setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
          }
        })
      },
      removeAttr: function (name) {
        return this.each(function () {
          this.nodeType === 1 && setAttribute(this, name)
        })
      },
      prop: function (name, value) {
        name = propMap[name] || name
        return (value === undefined) ? (this[0] && this[0][name]) : this.each(function (idx) {
          this[name] = funcArg(this, value, idx, this[name])
        })
      },
      data: function (name, value) {
        var data = this.attr('data-' + name.replace(capitalRE, '-$1').toLowerCase(), value)
        return data !== null ? deserializeValue(data) : undefined
      },
      val: function (value) {
        return arguments.length === 0 ? (this[0] && (this[0].multiple ? $(this[0]).find('option').filter(function () {
          return this.selected
        }).pluck('value') : this[0].value)) : this.each(function (idx) {
          this.value = funcArg(this, value, idx, this.value)
        })
      },
      offset: function (coordinates) {
        if (coordinates) {
          return this.each(function (index) {
            var $this = $(this),
              coords = funcArg(this, coordinates, index, $this.offset()),
              parentOffset = $this.offsetParent().offset(), props = {
                top: coords.top - parentOffset.top,
                left: coords.left - parentOffset.left
              }
            if ($this.css('position') == 'static') {
              props.position = 'relative'
            }
            $this.css(props)
          })
        }
        if (this.length == 0) {
          return null
        }
        var obj = this[0].getBoundingClientRect()
        return {
          left: obj.left + window.pageXOffset,
          top: obj.top + window.pageYOffset,
          width: Math.round(obj.width),
          height: Math.round(obj.height)
        }
      },
      css: function (property, value) {
        if (arguments.length < 2) {
          var element = this[0], computedStyle = getComputedStyle(element, '')
          if (!element) {
            return
          }
          if (typeof property == 'string') {
            return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
          }
          else if (isArray(property)) {
            var props = {}
            $.each(isArray(property) ? property : [property], function (_, prop) {
              props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
            })
            return props
          }
        }
        var css = ''
        if (type(property) == 'string') {
          if (!value && value !== 0) {
            this.each(function () {
              this.style.removeProperty(dasherize(property))
            })
          }
          else {
            css = dasherize(property) + ":" + maybeAddPx(property, value)
          }
        }
        else {
          for (key in property) {
            if (!property[key] && property[key] !== 0) {
              this.each(function () {
                this.style.removeProperty(dasherize(key))
              })
            }
            else {
              css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
            }
          }
        }
        return this.each(function () {
          this.style.cssText += ';' + css
        })
      },
      index: function (element) {
        return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
      },
      hasClass: function (name) {
        if (!name) {
          return !1
        }
        return emptyArray.some.call(this, function (el) {
          return this.test(className(el))
        }, classRE(name))
      },
      addClass: function (name) {
        if (!name) {
          return this
        }
        return this.each(function (idx) {
          classList = []
          var cls = className(this), newName = funcArg(this, name, idx, cls)
          newName.split(/\s+/g).forEach(function (klass) {
            if (!$(this).hasClass(klass)) {
              classList.push(klass)
            }
          }, this)
          classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
        })
      },
      removeClass: function (name) {
        return this.each(function (idx) {
          if (name === undefined) {
            return className(this, '')
          }
          classList = className(this)
          funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
            classList = classList.replace(classRE(klass), " ")
          })
          className(this, classList.trim())
        })
      },
      toggleClass: function (name, when) {
        if (!name) {
          return this
        }
        return this.each(function (idx) {
          var $this = $(this), names = funcArg(this, name, idx, className(this))
          names.split(/\s+/g).forEach(function (klass) {
            (when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass)
          })
        })
      },
      scrollTop: function (value) {
        if (!this.length) {
          return
        }
        var hasScrollTop = 'scrollTop' in this[0]
        if (value === undefined) {
          return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
        }
        return this.each(hasScrollTop ? function () {
          this.scrollTop = value
        } : function () {
          this.scrollTo(this.scrollX, value)
        })
      },
      scrollLeft: function (value) {
        if (!this.length) {
          return
        }
        var hasScrollLeft = 'scrollLeft' in this[0]
        if (value === undefined) {
          return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
        }
        return this.each(hasScrollLeft ? function () {
          this.scrollLeft = value
        } : function () {
          this.scrollTo(value, this.scrollY)
        })
      },
      position: function () {
        if (!this.length) {
          return
        }
        var elem = this[0], offsetParent = this.offsetParent(),
          offset = this.offset(),
          parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
            top: 0,
            left: 0
          } : offsetParent.offset()
        offset.top -= parseFloat($(elem).css('margin-top')) || 0
        offset.left -= parseFloat($(elem).css('margin-left')) || 0
        parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0
        parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0
        return {
          top: offset.top - parentOffset.top,
          left: offset.left - parentOffset.left
        }
      },
      offsetParent: function () {
        return this.map(function () {
          var parent = this.offsetParent || document.body
          while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static") {
            parent = parent.offsetParent
          }
          return parent
        })
      }
    }
    $.fn.detach = $.fn.remove;
    ['width', 'height'].forEach(function (dimension) {
      var dimensionProperty = dimension.replace(/./, function (m) {
        return m[0].toUpperCase()
      })
      $.fn[dimension] = function (value) {
        var offset, el = this[0]
        if (value === undefined) {
          return isWindow(el) ? el['inner' + dimensionProperty] : isDocument(el) ? el.documentElement['scroll' + dimensionProperty] : (offset = this.offset()) && offset[dimension]
        }
        else {
          return this.each(function (idx) {
            el = $(this)
            el.css(dimension, funcArg(this, value, idx, el[dimension]()))
          })
        }
      }
    })

    function traverseNode(node, fun) {
      fun(node)
      for (var key in node.childNodes) {
        traverseNode(node.childNodes[key], fun)
      }
    }

    adjacencyOperators.forEach(function (operator, operatorIndex) {
      var inside = operatorIndex % 2
      $.fn[operator] = function () {
        var argType, nodes = $.map(arguments, function (arg) {
          argType = type(arg)
          return argType == "object" || argType == "array" || arg == null ? arg : zepto.fragment(arg)
        }), parent, copyByClone = this.length > 1
        if (nodes.length < 1) {
          return this
        }
        return this.each(function (_, target) {
          parent = inside ? target : target.parentNode
          target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null
          nodes.forEach(function (node) {
            if (copyByClone) {
              node = node.cloneNode(!0)
            }
            else if (!parent) {
              return $(node).remove()
            }
            traverseNode(parent.insertBefore(node, target), function (el) {
              if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' && (!el.type || el.type === 'text/javascript') && !el.src) {
                window['eval'].call(window, el.innerHTML)
              }
            })
          })
        })
      }
      $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
        $(html)[operator](this)
        return this
      }
    })
    zepto.Z.prototype = $.fn
    zepto.uniq = uniq
    zepto.deserializeValue = deserializeValue
    $.zepto = zepto
    return $
  })()
  window.Zepto = Zepto
  window.$ === undefined && (window.$ = Zepto);
  (function ($) {
    var $$ = $.zepto.qsa, _zid = 1, undefined, slice = Array.prototype.slice,
      isFunction = $.isFunction, isString = function (obj) {
        return typeof obj == 'string'
      }, handlers = {}, specialEvents = {},
      focusinSupported = 'onfocusin' in window,
      focus = {focus: 'focusin', blur: 'focusout'},
      hover = {mouseenter: 'mouseover', mouseleave: 'mouseout'}
    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

    function zid(element) {
      return element._zid || (element._zid = _zid++)
    }

    function findHandlers(element, event, fn, selector) {
      event = parse(event)
      if (event.ns) {
        var matcher = matcherFor(event.ns)
      }
      return (handlers[zid(element)] || []).filter(function (handler) {
        return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector)
      })
    }

    function parse(event) {
      var parts = ('' + event).split('.')
      return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
    }

    function matcherFor(ns) {
      return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
    }

    function eventCapture(handler, captureSetting) {
      return handler.del && (!focusinSupported && (handler.e in focus)) || !!captureSetting
    }

    function realEvent(type) {
      return hover[type] || (focusinSupported && focus[type]) || type
    }

    function add(element, events, fn, data, selector, delegator, capture) {
      var id = zid(element), set = (handlers[id] || (handlers[id] = []))
      events.split(/\s/).forEach(function (event) {
        if (event == 'ready') {
          return $(document).ready(fn)
        }
        var handler = parse(event)
        handler.fn = fn
        handler.sel = selector
        if (handler.e in hover) {
          fn = function (e) {
            var related = e.relatedTarget
            if (!related || (related !== this && !$.contains(this, related))) {
              return handler.fn.apply(this, arguments)
            }
          }
        }
        handler.del = delegator
        var callback = delegator || fn
        handler.proxy = function (e) {
          e = compatible(e)
          if (e.isImmediatePropagationStopped()) {
            return
          }
          e.data = data
          var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
          if (result === !1) {
            e.preventDefault(), e.stopPropagation()
          }
          return result
        }
        handler.i = set.length
        set.push(handler)
        if ('addEventListener' in element) {
          element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
        }
      })
    }

    function remove(element, events, fn, selector, capture) {
      var id = zid(element);
      (events || '').split(/\s/).forEach(function (event) {
        findHandlers(element, event, fn, selector).forEach(function (handler) {
          delete handlers[id][handler.i]
          if ('removeEventListener' in element) {
            element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
          }
        })
      })
    }

    $.event = {add: add, remove: remove}
    $.proxy = function (fn, context) {
      if (isFunction(fn)) {
        var proxyFn = function () {
          return fn.apply(context, arguments)
        }
        proxyFn._zid = zid(fn)
        return proxyFn
      }
      else if (isString(context)) {
        return $.proxy(fn[context], fn)
      }
      else {
        throw new TypeError("expected function")
      }
    }
    $.fn.bind = function (event, data, callback) {
      return this.on(event, data, callback)
    }
    $.fn.unbind = function (event, callback) {
      return this.off(event, callback)
    }
    $.fn.one = function (event, selector, data, callback) {
      return this.on(event, selector, data, callback, 1)
    }
    var returnTrue = function () {
      return !0
    }, returnFalse = function () {
      return !1
    }, ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/, eventMethods = {
      preventDefault: 'isDefaultPrevented',
      stopImmediatePropagation: 'isImmediatePropagationStopped',
      stopPropagation: 'isPropagationStopped'
    }

    function compatible(event, source) {
      if (source || !event.isDefaultPrevented) {
        source || (source = event)
        $.each(eventMethods, function (name, predicate) {
          var sourceMethod = source[name]
          event[name] = function () {
            this[predicate] = returnTrue
            return sourceMethod && sourceMethod.apply(source, arguments)
          }
          event[predicate] = returnFalse
        })
        if (source.defaultPrevented !== undefined ? source.defaultPrevented : 'returnValue' in source ? source.returnValue === !1 : source.getPreventDefault && source.getPreventDefault()) {
          event.isDefaultPrevented = returnTrue
        }
      }
      return event
    }

    function createProxy(event) {
      var key, proxy = {originalEvent: event}
      for (key in event) {
        if (!ignoreProperties.test(key) && event[key] !== undefined) {
          proxy[key] = event[key]
        }
      }
      return compatible(proxy, event)
    }

    $.fn.delegate = function (selector, event, callback) {
      return this.on(event, selector, callback)
    }
    $.fn.undelegate = function (selector, event, callback) {
      return this.off(event, selector, callback)
    }
    $.fn.live = function (event, callback) {
      $(document.body).delegate(this.selector, event, callback)
      return this
    }
    $.fn.die = function (event, callback) {
      $(document.body).undelegate(this.selector, event, callback)
      return this
    }
    $.fn.on = function (event, selector, data, callback, one) {
      var autoRemove, delegator, $this = this
      if (event && !isString(event)) {
        $.each(event, function (type, fn) {
          $this.on(type, selector, data, fn, one)
        })
        return $this
      }
      if (!isString(selector) && !isFunction(callback) && callback !== !1) {
        callback = data, data = selector, selector = undefined
      }
      if (isFunction(data) || data === !1) {
        callback = data, data = undefined
      }
      if (callback === !1) {
        callback = returnFalse
      }
      return $this.each(function (_, element) {
        if (one) {
          autoRemove = function (e) {
            remove(element, e.type, callback)
            return callback.apply(this, arguments)
          }
        }
        if (selector) {
          delegator = function (e) {
            var evt, match = $(e.target).closest(selector, element).get(0)
            if (match && match !== element) {
              evt = $.extend(createProxy(e), {
                currentTarget: match,
                liveFired: element
              })
              return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
            }
          }
        }
        add(element, event, callback, data, selector, delegator || autoRemove)
      })
    }
    $.fn.off = function (event, selector, callback) {
      var $this = this
      if (event && !isString(event)) {
        $.each(event, function (type, fn) {
          $this.off(type, selector, fn)
        })
        return $this
      }
      if (!isString(selector) && !isFunction(callback) && callback !== !1) {
        callback = selector, selector = undefined
      }
      if (callback === !1) {
        callback = returnFalse
      }
      return $this.each(function () {
        remove(this, event, callback, selector)
      })
    }
    $.fn.trigger = function (event, args) {
      event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
      event._args = args
      return this.each(function () {
        if ('dispatchEvent' in this) {
          this.dispatchEvent(event)
        }
        else {
          $(this).triggerHandler(event, args)
        }
      })
    }
    $.fn.triggerHandler = function (event, args) {
      var e, result
      this.each(function (i, element) {
        e = createProxy(isString(event) ? $.Event(event) : event)
        e._args = args
        e.target = element
        $.each(findHandlers(element, event.type || event), function (i, handler) {
          result = handler.proxy(e)
          if (e.isImmediatePropagationStopped()) {
            return !1
          }
        })
      })
      return result
    };
    ('focusin focusout load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select keydown keypress keyup error').split(' ').forEach(function (event) {
      $.fn[event] = function (callback) {
        return callback ? this.bind(event, callback) : this.trigger(event)
      }
    });
    ['focus', 'blur'].forEach(function (name) {
      $.fn[name] = function (callback) {
        if (callback) {
          this.bind(name, callback)
        }
        else {
          this.each(function () {
            try {
              this[name]()
            }
            catch (e) {
            }
          })
        }
        return this
      }
    })
    $.Event = function (type, props) {
      if (!isString(type)) {
        props = type, type = props.type
      }
      var event = document.createEvent(specialEvents[type] || 'Events'),
        bubbles = !0
      if (props) {
        for (var name in props) {
          (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        }
      }
      event.initEvent(type, bubbles, !0)
      return compatible(event)
    }
  })(Zepto);
  (function ($) {
    var jsonpID = 0, document = window.document, key, name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i, jsonType = 'application/json',
      htmlType = 'text/html', blankRE = /^\s*$/

    function triggerAndReturn(context, eventName, data) {
      var event = $.Event(eventName)
      $(context).trigger(event, data)
      return !event.isDefaultPrevented()
    }

    function triggerGlobal(settings, context, eventName, data) {
      if (settings.global) {
        return triggerAndReturn(context || document, eventName, data)
      }
    }

    $.active = 0

    function ajaxStart(settings) {
      if (settings.global && $.active++ === 0) {
        triggerGlobal(settings, null, 'ajaxStart')
      }
    }

    function ajaxStop(settings) {
      if (settings.global && !(--$.active)) {
        triggerGlobal(settings, null, 'ajaxStop')
      }
    }

    function ajaxBeforeSend(xhr, settings) {
      var context = settings.context
      if (settings.beforeSend.call(context, xhr, settings) === !1 || triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === !1) {
        return !1
      }
      triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
    }

    function ajaxSuccess(data, xhr, settings, deferred) {
      var context = settings.context, status = 'success'
      settings.success.call(context, data, status, xhr)
      if (deferred) {
        deferred.resolveWith(context, [data, status, xhr])
      }
      triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
      ajaxComplete(status, xhr, settings)
    }

    function ajaxError(error, type, xhr, settings, deferred) {
      var context = settings.context
      settings.error.call(context, xhr, type, error)
      if (deferred) {
        deferred.rejectWith(context, [xhr, type, error])
      }
      triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
      ajaxComplete(type, xhr, settings)
    }

    function ajaxComplete(status, xhr, settings) {
      var context = settings.context
      settings.complete.call(context, xhr, status)
      triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
      ajaxStop(settings)
    }

    function empty() {
    }

    $.ajaxJSONP = function (options, deferred) {
      if (!('type' in options)) {
        return $.ajax(options)
      }
      var _callbackName = options.jsonpCallback,
        callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
        script = document.createElement('script'),
        originalCallback = window[callbackName], responseData,
        abort = function (errorType) {
          $(script).triggerHandler('error', errorType || 'abort')
        }, xhr = {abort: abort}, abortTimeout
      if (deferred) {
        deferred.promise(xhr)
      }
      $(script).on('load error', function (e, errorType) {
        clearTimeout(abortTimeout)
        $(script).off().remove()
        if (e.type == 'error' || !responseData) {
          ajaxError(null, errorType || 'error', xhr, options, deferred)
        }
        else {
          ajaxSuccess(responseData[0], xhr, options, deferred)
        }
        window[callbackName] = originalCallback
        if (responseData && $.isFunction(originalCallback)) {
          originalCallback(responseData[0])
        }
        originalCallback = responseData = undefined
      })
      if (ajaxBeforeSend(xhr, options) === !1) {
        abort('abort')
        return xhr
      }
      window[callbackName] = function () {
        responseData = arguments
      }
      script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
      document.head.appendChild(script)
      if (options.timeout > 0) {
        abortTimeout = setTimeout(function () {
          abort('timeout')
        }, options.timeout)
      }
      return xhr
    }
    $.ajaxSettings = {
      type: 'GET',
      beforeSend: empty,
      success: empty,
      error: empty,
      complete: empty,
      context: null,
      global: !0,
      xhr: function () {
        return new window.XMLHttpRequest()
      },
      accepts: {
        script: 'text/javascript, application/javascript, application/x-javascript',
        json: jsonType,
        xml: 'application/xml, text/xml',
        html: htmlType,
        text: 'text/plain'
      },
      crossDomain: !1,
      timeout: 0,
      processData: !0,
      cache: !0
    }

    function mimeToDataType(mime) {
      if (mime) {
        mime = mime.split(';', 2)[0]
      }
      return mime && (mime == htmlType ? 'html' : mime == jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text'
    }

    function appendQuery(url, query) {
      if (query == '') {
        return url
      }
      return (url + '&' + query).replace(/[&?]{1,2}/, '?')
    }

    function serializeData(options) {
      if (options.processData && options.data && $.type(options.data) != "string") {
        options.data = $.param(options.data, options.traditional)
      }
      if (options.data && (!options.type || options.type.toUpperCase() == 'GET')) {
        options.url = appendQuery(options.url, options.data), options.data = undefined
      }
    }

    $.ajax = function (options) {
      var settings = $.extend({}, options || {}),
        deferred = $.Deferred && $.Deferred()
      for (key in $.ajaxSettings) {
        if (settings[key] === undefined) {
          settings[key] = $.ajaxSettings[key]
        }
      }
      ajaxStart(settings)
      if (!settings.crossDomain) {
        settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host
      }
      if (!settings.url) {
        settings.url = window.location.toString()
      }
      serializeData(settings)
      if (settings.cache === !1) {
        settings.url = appendQuery(settings.url, '_=' + Date.now())
      }
      var dataType = settings.dataType,
        hasPlaceholder = /\?.+=\?/.test(settings.url)
      if (dataType == 'jsonp' || hasPlaceholder) {
        if (!hasPlaceholder) {
          settings.url = appendQuery(settings.url, settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === !1 ? '' : 'callback=?')
        }
        return $.ajaxJSONP(settings, deferred)
      }
      var mime = settings.accepts[dataType], headers = {},
        setHeader = function (name, value) {
          headers[name.toLowerCase()] = [name, value]
        },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(), nativeSetHeader = xhr.setRequestHeader,
        abortTimeout
      if (deferred) {
        deferred.promise(xhr)
      }
      if (!settings.crossDomain) {
        setHeader('X-Requested-With', 'XMLHttpRequest')
      }
      setHeader('Accept', mime || '*/*')
      if (mime = settings.mimeType || mime) {
        if (mime.indexOf(',') > -1) {
          mime = mime.split(',', 2)[0]
        }
        xhr.overrideMimeType && xhr.overrideMimeType(mime)
      }
      if (settings.contentType || (settings.contentType !== !1 && settings.data && settings.type.toUpperCase() != 'GET')) {
        setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')
      }
      if (settings.headers) {
        for (name in settings.headers) {
          setHeader(name, settings.headers[name])
        }
      }
      xhr.setRequestHeader = setHeader
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          xhr.onreadystatechange = empty
          clearTimeout(abortTimeout)
          var result, error = !1
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
            dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
            result = xhr.responseText
            try {
              if (dataType == 'script') {
                (1, eval)(result)
              }
              else if (dataType == 'xml') {
                result = xhr.responseXML
              }
              else if (dataType == 'json') {
                result = blankRE.test(result) ? null : $.parseJSON(result)
              }
            }
            catch (e) {
              error = e
            }
            if (error) {
              ajaxError(error, 'parsererror', xhr, settings, deferred)
            }
            else {
              ajaxSuccess(result, xhr, settings, deferred)
            }
          }
          else {
            ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
          }
        }
      }
      if (ajaxBeforeSend(xhr, settings) === !1) {
        xhr.abort()
        ajaxError(null, 'abort', xhr, settings, deferred)
        return xhr
      }
      if (settings.xhrFields) {
        for (name in settings.xhrFields) {
          xhr[name] = settings.xhrFields[name]
        }
      }
      var async = 'async' in settings ? settings.async : !0
      xhr.open(settings.type, settings.url, async, settings.username, settings.password)
      for (name in headers) {
        nativeSetHeader.apply(xhr, headers[name])
      }
      if (settings.timeout > 0) {
        abortTimeout = setTimeout(function () {
          xhr.onreadystatechange = empty
          xhr.abort()
          ajaxError(null, 'timeout', xhr, settings, deferred)
        }, settings.timeout)
      }
      xhr.send(settings.data ? settings.data : null)
      return xhr
    }

    function parseArguments(url, data, success, dataType) {
      var hasData = !$.isFunction(data)
      return {
        url: url,
        data: hasData ? data : undefined,
        success: !hasData ? data : $.isFunction(success) ? success : undefined,
        dataType: hasData ? dataType || success : success
      }
    }

    $.get = function (url, data, success, dataType) {
      return $.ajax(parseArguments.apply(null, arguments))
    }
    $.post = function (url, data, success, dataType) {
      var options = parseArguments.apply(null, arguments)
      options.type = 'POST'
      return $.ajax(options)
    }
    $.getJSON = function (url, data, success) {
      var options = parseArguments.apply(null, arguments)
      options.dataType = 'json'
      return $.ajax(options)
    }
    $.fn.load = function (url, data, success) {
      if (!this.length) {
        return this
      }
      var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success), callback = options.success
      if (parts.length > 1) {
        options.url = parts[0], selector = parts[1]
      }
      options.success = function (response) {
        self.html(selector ? $('<div>').html(response.replace(rscript, "")).find(selector) : response)
        callback && callback.apply(self, arguments)
      }
      $.ajax(options)
      return this
    }
    var escape = encodeURIComponent

    function serialize(params, obj, traditional, scope) {
      var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
      $.each(obj, function (key, value) {
        type = $.type(value)
        if (scope) {
          key = traditional ? scope : scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
        }
        if (!scope && array) {
          params.add(value.name, value.value)
        }
        else if (type == "array" || (!traditional && type == "object")) {
          serialize(params, value, traditional, key)
        }
        else {
          params.add(key, value)
        }
      })
    }

    $.param = function (obj, traditional) {
      var params = []
      params.add = function (k, v) {
        this.push(escape(k) + '=' + escape(v))
      }
      serialize(params, obj, traditional)
      return params.join('&').replace(/%20/g, '+')
    }
  })(Zepto);
  (function ($) {
    $.fn.serializeArray = function () {
      var result = [], el
      $([].slice.call(this.get(0).elements)).each(function () {
        el = $(this)
        var type = el.attr('type')
        if (this.nodeName.toLowerCase() != 'fieldset' && !this.disabled && type != 'submit' && type != 'reset' && type != 'button' && ((type != 'radio' && type != 'checkbox') || this.checked)) {
          result.push({name: el.attr('name'), value: el.val()})
        }
      })
      return result
    }
    $.fn.serialize = function () {
      var result = []
      this.serializeArray().forEach(function (elm) {
        result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
      })
      return result.join('&')
    }
    $.fn.submit = function (callback) {
      if (callback) {
        this.bind('submit', callback)
      }
      else if (this.length) {
        var event = $.Event('submit')
        this.eq(0).trigger(event)
        if (!event.isDefaultPrevented()) {
          this.get(0).submit()
        }
      }
      return this
    }
  })(Zepto);
  (function ($) {
    if (!('__proto__' in {})) {
      $.extend($.zepto, {
        Z: function (dom, selector) {
          dom = dom || []
          $.extend(dom, $.fn)
          dom.selector = selector || ''
          dom.__Z = !0
          return dom
        }, isZ: function (object) {
          return $.type(object) === 'array' && '__Z' in object
        }
      })
    }
    try {
      getComputedStyle(undefined)
    }
    catch (e) {
      var nativeGetComputedStyle = getComputedStyle;
      window.getComputedStyle = function (element, pseudoElement) {
        try {
          return nativeGetComputedStyle(element, pseudoElement)
        }
        catch (e) {
          return null
        }
      }
    }
  })(Zepto)
  TL.getJSON = Zepto.getJSON;
  TL.ajax = Zepto.ajax
})(TL)
TL.Class = function () {
};
TL.Class.extend = function (props) {
  var NewClass = function () {
    if (this.initialize) {
      this.initialize.apply(this, arguments)
    }
  };
  var F = function () {
  };
  F.prototype = this.prototype;
  var proto = new F();
  proto.constructor = NewClass;
  NewClass.prototype = proto;
  NewClass.superclass = this.prototype;
  for (var i in this) {
    if (this.hasOwnProperty(i) && i !== 'prototype' && i !== 'superclass') {
      NewClass[i] = this[i]
    }
  }
  if (props.statics) {
    TL.Util.extend(NewClass, props.statics);
    delete props.statics
  }
  if (props.includes) {
    TL.Util.extend.apply(null, [proto].concat(props.includes));
    delete props.includes
  }
  if (props.options && proto.options) {
    props.options = TL.Util.extend({}, proto.options, props.options)
  }
  TL.Util.extend(proto, props);
  NewClass.extend = TL.Class.extend;
  NewClass.include = function (props) {
    TL.Util.extend(this.prototype, props)
  };
  return NewClass
};
TL.Events = {
  addEventListener: function (type, fn, context) {
    var events = this._tl_events = this._tl_events || {};
    events[type] = events[type] || [];
    events[type].push({action: fn, context: context || this});
    return this
  }, hasEventListeners: function (type) {
    var k = '_tl_events';
    return (k in this) && (type in this[k]) && (this[k][type].length > 0)
  }, removeEventListener: function (type, fn, context) {
    if (!this.hasEventListeners(type)) {
      return this
    }
    for (var i = 0, events = this._tl_events, len = events[type].length; i < len; i++) {
      if ((events[type][i].action === fn) && (!context || (events[type][i].context === context))) {
        events[type].splice(i, 1);
        return this
      }
    }
    return this
  }, fireEvent: function (type, data) {
    if (!this.hasEventListeners(type)) {
      return this
    }
    var event = TL.Util.mergeData({type: type, target: this}, data);
    var listeners = this._tl_events[type].slice();
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].action.call(listeners[i].context || this, event)
    }
    return this
  }
};
TL.Events.on = TL.Events.addEventListener;
TL.Events.off = TL.Events.removeEventListener;
TL.Events.fire = TL.Events.fireEvent;
(function () {
  var ua = navigator.userAgent.toLowerCase(), doc = document.documentElement,
    ie = 'ActiveXObject' in window, webkit = ua.indexOf('webkit') !== -1,
    phantomjs = ua.indexOf('phantom') !== -1,
    android23 = ua.search('android [23]') !== -1,
    mobile = typeof orientation !== 'undefined',
    msPointer = navigator.msPointerEnabled && navigator.msMaxTouchPoints && !window.PointerEvent,
    pointer = (window.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints) || msPointer,
    ie3d = ie && ('transition' in doc.style),
    webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23,
    gecko3d = 'MozPerspective' in doc.style,
    opera3d = 'OTransition' in doc.style, opera = window.opera;
  var retina = 'devicePixelRatio' in window && window.devicePixelRatio > 1;
  if (!retina && 'matchMedia' in window) {
    var matches = window.matchMedia('(min-resolution:144dpi)');
    retina = matches && matches.matches
  }
  var touch = !window.L_NO_TOUCH && !phantomjs && (pointer || 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch));
  TL.Browser = {
    ie: ie,
    ua: ua,
    ie9: Boolean(ie && ua.match(/MSIE 9/i)),
    ielt9: ie && !document.addEventListener,
    webkit: webkit,
    firefox: (ua.indexOf('gecko') !== -1) && !webkit && !window.opera && !ie,
    android: ua.indexOf('android') !== -1,
    android23: android23,
    chrome: ua.indexOf('chrome') !== -1,
    edge: ua.indexOf('edge/') !== -1,
    ie3d: ie3d,
    webkit3d: webkit3d,
    gecko3d: gecko3d,
    opera3d: opera3d,
    any3d: !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs,
    mobile: mobile,
    mobileWebkit: mobile && webkit,
    mobileWebkit3d: mobile && webkit3d,
    mobileOpera: mobile && window.opera,
    touch: !!touch,
    msPointer: !!msPointer,
    pointer: !!pointer,
    retina: !!retina,
    orientation: function () {
      var w = window.innerWidth, h = window.innerHeight,
        _orientation = "portrait";
      if (w > h) {
        _orientation = "landscape"
      }
      if (Math.abs(window.orientation) == 90) {
      }
      trace(_orientation);
      return _orientation
    }
  }
}());
TL.Load = (function (doc) {
  var loaded = [];

  function isLoaded(url) {
    var i = 0, has_loaded = !1;
    for (i = 0; i < loaded.length; i++) {
      if (loaded[i] == url) {
        has_loaded = !0
      }
    }
    if (has_loaded) {
      return !0
    }
    else {
      loaded.push(url);
      return !1
    }
  }

  return {
    css: function (urls, callback, obj, context) {
      if (!isLoaded(urls)) {
        TL.LoadIt.css(urls, callback, obj, context)
      }
      else {
        callback()
      }
    }, js: function (urls, callback, obj, context) {
      if (!isLoaded(urls)) {
        TL.LoadIt.js(urls, callback, obj, context)
      }
      else {
        callback()
      }
    }
  }
})(this.document);
TL.LoadIt = (function (doc) {
  var env, head, pending = {}, pollCount = 0, queue = {css: [], js: []},
    styleSheets = doc.styleSheets;

  function createNode(name, attrs) {
    var node = doc.createElement(name), attr;
    for (attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        node.setAttribute(attr, attrs[attr])
      }
    }
    return node
  }

  function finish(type) {
    var p = pending[type], callback, urls;
    if (p) {
      callback = p.callback;
      urls = p.urls;
      urls.shift();
      pollCount = 0;
      if (!urls.length) {
        callback && callback.call(p.context, p.obj);
        pending[type] = null;
        queue[type].length && load(type)
      }
    }
  }

  function getEnv() {
    var ua = navigator.userAgent;
    env = {async: doc.createElement('script').async === !0};
    (env.webkit = /AppleWebKit\//.test(ua)) || (env.ie = /MSIE/.test(ua)) || (env.opera = /Opera/.test(ua)) || (env.gecko = /Gecko\//.test(ua)) || (env.unknown = !0)
  }

  function load(type, urls, callback, obj, context) {
    var _finish = function () {
      finish(type)
    }, isCSS = type === 'css', nodes = [], i, len, node, p, pendingUrls, url;
    env || getEnv();
    if (urls) {
      urls = typeof urls === 'string' ? [urls] : urls.concat();
      if (isCSS || env.async || env.gecko || env.opera) {
        queue[type].push({
          urls: urls,
          callback: callback,
          obj: obj,
          context: context
        })
      }
      else {
        for (i = 0, len = urls.length; i < len; ++i) {
          queue[type].push({
            urls: [urls[i]],
            callback: i === len - 1 ? callback : null,
            obj: obj,
            context: context
          })
        }
      }
    }
    if (pending[type] || !(p = pending[type] = queue[type].shift())) {
      return
    }
    head || (head = doc.head || doc.getElementsByTagName('head')[0]);
    pendingUrls = p.urls;
    for (i = 0, len = pendingUrls.length; i < len; ++i) {
      url = pendingUrls[i];
      if (isCSS) {
        node = env.gecko ? createNode('style') : createNode('link', {
          href: url,
          rel: 'stylesheet'
        })
      }
      else {
        node = createNode('script', {src: url});
        node.async = !1
      }
      node.className = 'lazyload';
      node.setAttribute('charset', 'utf-8');
      if (env.ie && !isCSS) {
        node.onreadystatechange = function () {
          if (/loaded|complete/.test(node.readyState)) {
            node.onreadystatechange = null;
            _finish()
          }
        }
      }
      else if (isCSS && (env.gecko || env.webkit)) {
        if (env.webkit) {
          p.urls[i] = node.href;
          pollWebKit()
        }
        else {
          node.innerHTML = '@import "' + url + '";';
          pollGecko(node)
        }
      }
      else {
        node.onload = node.onerror = _finish
      }
      nodes.push(node)
    }
    for (i = 0, len = nodes.length; i < len; ++i) {
      head.appendChild(nodes[i])
    }
  }

  function pollGecko(node) {
    var hasRules;
    try {
      hasRules = !!node.sheet.cssRules
    }
    catch (ex) {
      pollCount += 1;
      if (pollCount < 200) {
        setTimeout(function () {
          pollGecko(node)
        }, 50)
      }
      else {
        hasRules && finish('css')
      }
      return
    }
    finish('css')
  }

  function pollWebKit() {
    var css = pending.css, i;
    if (css) {
      i = styleSheets.length;
      while (--i >= 0) {
        if (styleSheets[i].href === css.urls[0]) {
          finish('css');
          break
        }
      }
      pollCount += 1;
      if (css) {
        if (pollCount < 200) {
          setTimeout(pollWebKit, 50)
        }
        else {
          finish('css')
        }
      }
    }
  }

  return {
    css: function (urls, callback, obj, context) {
      load('css', urls, callback, obj, context)
    }, js: function (urls, callback, obj, context) {
      load('js', urls, callback, obj, context)
    }
  }
})(this.document);
TL.TimelineConfig = TL.Class.extend({
  includes: [], initialize: function (data) {
    this.title = '';
    this.scale = '';
    this.events = [];
    this.eras = [];
    this.event_dict = {};
    this.messages = {errors: [], warnings: []};
    if (typeof data === 'object' && data.events) {
      this.scale = data.scale;
      this.events = [];
      this._ensureValidScale(data.events);
      if (data.title) {
        var title_id = this._assignID(data.title);
        this._tidyFields(data.title);
        this.title = data.title;
        this.event_dict[title_id] = this.title
      }
      for (var i = 0; i < data.events.length; i++) {
        try {
          this.addEvent(data.events[i], !0)
        }
        catch (e) {
          this.logError(e)
        }
      }
      if (data.eras) {
        for (var i = 0; i < data.eras.length; i++) {
          try {
            this.addEra(data.eras[i], !0)
          }
          catch (e) {
            this.logError("Era " + i + ": " + e)
          }
        }
      }
      TL.DateUtil.sortByDate(this.events);
      TL.DateUtil.sortByDate(this.eras)
    }
  }, logError: function (msg) {
    trace(msg);
    this.messages.errors.push(msg)
  }, getErrors: function (sep) {
    if (sep) {
      return this.messages.errors.join(sep)
    }
    else {
      return this.messages.errors
    }
  }, validate: function () {
    if (typeof (this.events) == "undefined" || typeof (this.events.length) == "undefined" || this.events.length == 0) {
      this.logError("Timeline configuration has no events.")
    }
    for (var i = 0; i < this.eras.length; i++) {
      if (typeof (this.eras[i].start_date) == 'undefined' || typeof (this.eras[i].end_date) == 'undefined') {
        var era_identifier;
        if (this.eras[i].text && this.eras[i].text.headline) {
          era_identifier = this.eras[i].text.headline
        }
        else {
          era_identifier = "era " + (i + 1)
        }
        this.logError("All eras must have start and end dates. [" + era_identifier + "]")
      }
    }
  }, isValid: function () {
    return this.messages.errors.length == 0
  }, addEvent: function (data, defer_sort) {
    var event_id = this._assignID(data);
    if (typeof (data.start_date) == 'undefined') {
      throw new TL.Error("missing_start_date_err", event_id)
    }
    else {
      this._processDates(data);
      this._tidyFields(data)
    }
    this.events.push(data);
    this.event_dict[event_id] = data;
    if (!defer_sort) {
      TL.DateUtil.sortByDate(this.events)
    }
    return event_id
  }, addEra: function (data, defer_sort) {
    var event_id = this._assignID(data);
    if (typeof (data.start_date) == 'undefined') {
      throw new TL.Error("missing_start_date_err", event_id)
    }
    else {
      this._processDates(data);
      this._tidyFields(data)
    }
    this.eras.push(data);
    this.event_dict[event_id] = data;
    if (!defer_sort) {
      TL.DateUtil.sortByDate(this.eras)
    }
    return event_id
  }, _assignID: function (slide) {
    var slide_id = slide.unique_id;
    if (!TL.Util.trim(slide_id)) {
      slide_id = (slide.text) ? TL.Util.slugify(slide.text.headline) : null
    }
    slide.unique_id = TL.Util.ensureUniqueKey(this.event_dict, slide_id);
    return slide.unique_id
  }, _makeUniqueIdentifiers: function (title_id, array) {
    var used = [title_id];
    for (var i = 0; i < array.length; i++) {
      if (TL.Util.trim(array[i].unique_id)) {
        array[i].unique_id = TL.Util.slugify(array[i].unique_id);
        if (used.indexOf(array[i].unique_id) == -1) {
          used.push(array[i].unique_id)
        }
        else {
          array[i].unique_id = ''
        }
      }
    }
    ;
    if (used.length != (array.length + 1)) {
      for (var i = 0; i < array.length; i++) {
        if (!array[i].unique_id) {
          var slug = (array[i].text) ? TL.Util.slugify(array[i].text.headline) : null;
          if (!slug) {
            slug = TL.Util.unique_ID(6)
          }
          if (used.indexOf(slug) != -1) {
            slug = slug + '-' + i
          }
          used.push(slug);
          array[i].unique_id = slug
        }
      }
    }
  }, _ensureValidScale: function (events) {
    if (!this.scale) {
      trace("Determining scale dynamically");
      this.scale = "human";
      for (var i = 0; i < events.length; i++) {
        if (events[i].scale == 'cosmological') {
          this.scale = 'cosmological';
          break
        }
        if (events[i].start_date && typeof (events[i].start_date.year) != "undefined") {
          var d = new TL.BigDate(events[i].start_date);
          var year = d.data.date_obj.year;
          if (year < -271820 || year > 275759) {
            this.scale = "cosmological";
            break
          }
        }
      }
    }
    var dateCls = TL.DateUtil.SCALE_DATE_CLASSES[this.scale];
    if (!dateCls) {
      this.logError("Don't know how to process dates on scale " + this.scale)
    }
  }, _processDates: function (slide_or_era) {
    var dateCls = TL.DateUtil.SCALE_DATE_CLASSES[this.scale];
    if (!(slide_or_era.start_date instanceof dateCls)) {
      var start_date = slide_or_era.start_date;
      slide_or_era.start_date = new dateCls(start_date);
      if (typeof (slide_or_era.end_date) != 'undefined' && !(slide_or_era.end_date instanceof dateCls)) {
        var end_date = slide_or_era.end_date;
        var equal = !0;
        for (property in start_date) {
          equal = equal && (start_date[property] == end_date[property])
        }
        if (equal) {
          trace("End date same as start date is redundant; dropping end date");
          delete slide_or_era.end_date
        }
        else {
          slide_or_era.end_date = new dateCls(end_date)
        }
      }
    }
  }, getEarliestDate: function () {
    var date = this.events[0].start_date;
    if (this.eras && this.eras.length > 0) {
      if (this.eras[0].start_date.isBefore(date)) {
        return this.eras[0].start_date
      }
    }
    return date
  }, getLatestDate: function () {
    var dates = [];
    for (var i = 0; i < this.events.length; i++) {
      if (this.events[i].end_date) {
        dates.push({date: this.events[i].end_date})
      }
      else {
        dates.push({date: this.events[i].start_date})
      }
    }
    for (var i = 0; i < this.eras.length; i++) {
      if (this.eras[i].end_date) {
        dates.push({date: this.eras[i].end_date})
      }
      else {
        dates.push({date: this.eras[i].start_date})
      }
    }
    TL.DateUtil.sortByDate(dates, 'date');
    return dates.slice(-1)[0].date
  }, _tidyFields: function (slide) {
    function fillIn(obj, key, default_value) {
      if (!default_value) {
        default_value = '';
      }
      if (!obj.hasOwnProperty(key)) {
        obj[key] = default_value
      }
    }

    if (slide.group) {
      slide.group = TL.Util.trim(slide.group)
    }
    if (!slide.text) {
      slide.text = {}
    }
    fillIn(slide.text, 'text');
    fillIn(slide.text, 'headline')
  }
});
(function (TL) {
  function parseGoogleSpreadsheetURL(url) {
    parts = {key: null, worksheet: 0}
    var key_pat = /\bkey=([-_A-Za-z0-9]+)&?/i;
    var url_pat = /docs.google.com\/spreadsheets(.*?)\/d\//;
    if (url.match(key_pat)) {
      parts.key = url.match(key_pat)[1]
    }
    else if (url.match(url_pat)) {
      var pos = url.search(url_pat) + url.match(url_pat)[0].length;
      var tail = url.substr(pos);
      parts.key = tail.split('/')[0]
      if (url.match(/\?gid=(\d+)/)) {
        parts.worksheet = url.match(/\?gid=(\d+)/)[1]
      }
    }
    else if (url.match(/^\b[-_A-Za-z0-9]+$/)) {
      parts.key = url
    }
    if (parts.key) {
      return parts
    }
    else {
      return null
    }
  }

  function extractGoogleEntryData_V1(item) {
    var item_data = {}
    for (k in item) {
      if (k.indexOf('gsx$') == 0) {
        item_data[k.substr(4)] = item[k].$t
      }
    }
    if (TL.Util.isEmptyObject(item_data)) {
      return null;
    }
    var d = {
      media: {
        caption: item_data.mediacaption || '',
        credit: item_data.mediacredit || '',
        url: item_data.media || '',
        thumbnail: item_data.mediathumbnail || ''
      },
      text: {headline: item_data.headline || '', text: item_data.text || ''},
      group: item_data.tag || '',
      type: item_data.type || ''
    }
    if (item_data.startdate) {
      d.start_date = TL.Date.parseDate(item_data.startdate)
    }
    if (item_data.enddate) {
      d.end_date = TL.Date.parseDate(item_data.enddate)
    }
    return d
  }

  function extractGoogleEntryData_V3(item) {
    function clean_integer(s) {
      if (s) {
        return s.replace(/[\s,]+/g, '')
      }
    }

    var item_data = {}
    for (k in item) {
      if (k.indexOf('gsx$') == 0) {
        item_data[k.substr(4)] = TL.Util.trim(item[k].$t)
      }
    }
    if (TL.Util.isEmptyObject(item_data)) {
      return null;
    }
    var d = {
      media: {
        caption: item_data.mediacaption || '',
        credit: item_data.mediacredit || '',
        url: item_data.media || '',
        thumbnail: item_data.mediathumbnail || ''
      },
      text: {headline: item_data.headline || '', text: item_data.text || ''},
      start_date: {
        year: clean_integer(item_data.year),
        month: clean_integer(item_data.month) || '',
        day: clean_integer(item_data.day) || ''
      },
      end_date: {
        year: clean_integer(item_data.endyear) || '',
        month: clean_integer(item_data.endmonth) || '',
        day: clean_integer(item_data.endday) || ''
      },
      display_date: item_data.displaydate || '',
      type: item_data.type || ''
    }
    if (item_data.time) {
      TL.Util.mergeData(d.start_date, TL.DateUtil.parseTime(item_data.time))
    }
    if (item_data.endtime) {
      TL.Util.mergeData(d.end_date, TL.DateUtil.parseTime(item_data.endtime))
    }
    if (item_data.group) {
      d.group = item_data.group
    }
    if (d.end_date.year == '') {
      var bad_date = d.end_date;
      delete d.end_date;
      if (bad_date.month != '' || bad_date.day != '' || bad_date.time != '') {
        var label = d.text.headline || trace("Invalid end date for spreadsheet row. Must have a year if any other date fields are specified.");
        trace(item)
      }
    }
    if (item_data.background) {
      if (item_data.background.match(/^(https?:)?\/\/?/)) {
        d.background = {'url': item_data.background}
      }
      else {
        d.background = {'color': item_data.background}
      }
    }
    return d
  }

  var getGoogleItemExtractor = function (data) {
    if (typeof data.feed.entry === 'undefined' || data.feed.entry.length == 0) {
      throw new TL.Error("empty_feed_err")
    }
    var entry = data.feed.entry[0];
    if (typeof entry.gsx$startdate !== 'undefined') {
      return extractGoogleEntryData_V1
    }
    else if (typeof entry.gsx$year !== 'undefined') {
      var headers_V3 = ['month', 'day', 'time', 'endmonth', 'endyear', 'endday', 'endtime', 'displaydate', 'headline', 'text', 'media', 'mediacredit', 'mediacaption', 'mediathumbnail', 'type', 'group', 'background'];
      return extractGoogleEntryData_V3
    }
    throw new TL.Error("invalid_data_format_err")
  }
  var buildGoogleFeedURL = function (parts) {
    return "https://spreadsheets.google.com/feeds/list/" + parts.key + "/1/public/values?alt=json"
  }
  var jsonFromGoogleURL = function (url) {
    var url = buildGoogleFeedURL(parseGoogleSpreadsheetURL(url));
    var timeline_config = {'events': []};
    var data = TL.ajax({url: url, async: !1});
    data = JSON.parse(data.responseText);
    return googleFeedJSONtoTimelineJSON(data)
  }
  var googleFeedJSONtoTimelineJSON = function (data) {
    var timeline_config = {
      'events': [],
      'errors': [],
      'warnings': [],
      'eras': []
    }
    var extract = getGoogleItemExtractor(data);
    for (var i = 0; i < data.feed.entry.length; i++) {
      try {
        var event = extract(data.feed.entry[i]);
        if (event) {
          var row_type = 'event';
          if (typeof (event.type) != 'undefined') {
            row_type = event.type;
            delete event.type
          }
          if (row_type == 'title') {
            if (!timeline_config.title) {
              timeline_config.title = event
            }
            else {
              timeline_config.warnings.push("Multiple title slides detected.");
              timeline_config.events.push(event)
            }
          }
          else if (row_type == 'era') {
            timeline_config.eras.push(event)
          }
          else {
            timeline_config.events.push(event)
          }
        }
      }
      catch (e) {
        if (e.message) {
          e = e.message
        }
        timeline_config.errors.push(e + " [" + i + "]")
      }
    }
    ;
    return timeline_config
  }
  var makeConfig = function (url, callback) {
    var tc, key = parseGoogleSpreadsheetURL(url);
    if (key) {
      try {
        var json = jsonFromGoogleURL(url)
      }
      catch (e) {
        tc = new TL.TimelineConfig();
        if (e.name == 'NetworkError') {
          tc.logError(new TL.Error("network_err"))
        }
        else if (e.name == 'TL.Error') {
          tc.logError(e)
        }
        else {
          tc.logError(new TL.Error("unknown_read_err", e.name))
        }
        callback(tc);
        return
      }
      tc = new TL.TimelineConfig(json);
      if (json.errors) {
        for (var i = 0; i < json.errors.length; i++) {
          tc.logError(json.errors[i])
        }
      }
      callback(tc)
    }
    else {
      TL.ajax({
        url: url, dataType: 'json', success: function (data) {
          try {
            tc = new TL.TimelineConfig(data)
          }
          catch (e) {
            tc = new TL.TimelineConfig();
            tc.logError(e)
          }
          callback(tc)
        }, error: function (xhr, errorType, error) {
          tc = new TL.TimelineConfig();
          if (errorType == 'parsererror') {
            var error = new TL.Error("invalid_url_err")
          }
          else {
            var error = new TL.Error("unknown_read_err", errorType)
          }
          tc.logError(error);
          callback(tc)
        }
      })
    }
  }
  TL.ConfigFactory = {
    parseGoogleSpreadsheetURL: parseGoogleSpreadsheetURL,
    googleFeedJSONtoTimelineJSON: googleFeedJSONtoTimelineJSON,
    fromGoogle: function (url) {
      console.warn("TL.ConfigFactory.fromGoogle is deprecated and will be removed soon. Use TL.ConfigFactory.makeConfig(url,callback)")
      return jsonFromGoogleURL(url)
    },
    makeConfig: makeConfig,
  }
})(TL)
TL.Language = function (options) {
  for (k in TL.Language.languages.en) {
    this[k] = TL.Language.languages.en[k]
  }
  if (options && options.language && typeof (options.language) == 'string' && options.language != 'en') {
    var code = options.language;
    if (!(code in TL.Language.languages)) {
      if (/\.json$/.test(code)) {
        var url = code
      }
      else {
        var fragment = "/locale/" + code + ".json";
        var script_path = options.script_path || TL.Timeline.source_path;
        if (/\/$/.test(script_path)) {
          fragment = fragment.substr(1)
        }
        var url = script_path + fragment
      }
      var self = this;
      var xhr = TL.ajax({url: url, async: !1});
      if (xhr.status == 200) {
        TL.Language.languages[code] = JSON.parse(xhr.responseText)
      }
      else {
        throw "Could not load language [" + code + "]: " + xhr.statusText
      }
    }
    TL.Util.mergeData(this, TL.Language.languages[code])
  }
}
TL.Language.formatNumber = function (val, mask) {
  if (mask.match(/%(\.(\d+))?f/)) {
    var match = mask.match(/%(\.(\d+))?f/);
    var token = match[0];
    if (match[2]) {
      val = val.toFixed(match[2])
    }
    return mask.replace(token, val)
  }
  return mask
}
TL.Language.prototype.mergeData = function (lang_json) {
  for (k in TL.Language.languages.en) {
    if (lang_json[k]) {
      if (typeof (this[k]) == 'object') {
        TL.Util.mergeData(lang_json[k], this[k])
      }
      else {
        this[k] = lang_json[k]
      }
    }
  }
}
TL.Language.fallback = {messages: {}};
TL.Language.prototype.getMessage = function (k) {
  return this.messages[k] || TL.Language.fallback.messages[k] || k
}
TL.Language.prototype._ = TL.Language.prototype.getMessage;
TL.Language.prototype.formatDate = function (date, format_name) {
  if (date.constructor == Date) {
    return this.formatJSDate(date, format_name)
  }
  if (date.constructor == TL.BigYear) {
    return this.formatBigYear(date, format_name)
  }
  if (date.data && date.data.date_obj) {
    return this.formatDate(date.data.date_obj, format_name)
  }
  trace("Unfamiliar date presented for formatting");
  return date.toString()
}
TL.Language.prototype.formatBigYear = function (bigyear, format_name) {
  var the_year = bigyear.year;
  var format_list = this.bigdateformats[format_name] || this.bigdateformats.fallback;
  if (format_list) {
    for (var i = 0; i < format_list.length; i++) {
      var tuple = format_list[i];
      if (Math.abs(the_year / tuple[0]) > 1) {
        return TL.Language.formatNumber(Math.abs(the_year / tuple[0]), tuple[1])
      }
    }
    ;
    return the_year.toString()
  }
  else {
    trace("Language file dateformats missing cosmological. Falling back.");
    return TL.Language.formatNumber(the_year, format_name)
  }
}
TL.Language.prototype.formatJSDate = function (js_date, format_name) {
  var self = this;
  var formatPeriod = function (fmt, value) {
    var formats = self.period_labels[fmt];
    if (formats) {
      var fmt = (value < 12) ? formats[0] : formats[1]
    }
    return "<span class='tl-timeaxis-timesuffix'>" + fmt + "</span>"
  }
  var utc = !1,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g;
  if (!format_name) {
    format_name = 'full'
  }
  var mask = this.dateformats[format_name] || TL.Language.fallback.dateformats[format_name];
  if (!mask) {
    mask = format_name
  }
  var _ = utc ? "getUTC" : "get", d = js_date[_ + "Date"](),
    D = js_date[_ + "Day"](), m = js_date[_ + "Month"](),
    y = js_date[_ + "FullYear"](), H = js_date[_ + "Hours"](),
    M = js_date[_ + "Minutes"](), s = js_date[_ + "Seconds"](),
    L = js_date[_ + "Milliseconds"](),
    o = utc ? 0 : js_date.getTimezoneOffset(), year = "", flags = {
      d: d,
      dd: TL.Util.pad(d),
      ddd: this.date.day_abbr[D],
      dddd: this.date.day[D],
      m: m + 1,
      mm: TL.Util.pad(m + 1),
      mmm: this.date.month_abbr[m],
      mmmm: this.date.month[m],
      yy: String(y).slice(2),
      yyyy: (y < 0 && this.has_negative_year_modifier()) ? Math.abs(y) : y,
      h: H % 12 || 12,
      hh: TL.Util.pad(H % 12 || 12),
      H: H,
      HH: TL.Util.pad(H),
      M: M,
      MM: TL.Util.pad(M),
      s: s,
      ss: TL.Util.pad(s),
      l: TL.Util.pad(L, 3),
      L: TL.Util.pad(L > 99 ? Math.round(L / 10) : L),
      t: formatPeriod('t', H),
      tt: formatPeriod('tt', H),
      T: formatPeriod('T', H),
      TT: formatPeriod('TT', H),
      Z: utc ? "UTC" : (String(js_date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
      o: (o > 0 ? "-" : "+") + TL.Util.pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
      S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
    };
  var formatted = mask.replace(TL.Language.DATE_FORMAT_TOKENS, function ($0) {
    return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1)
  });
  return this._applyEra(formatted, y)
}
TL.Language.prototype.has_negative_year_modifier = function () {
  return Boolean(this.era_labels.negative_year.prefix || this.era_labels.negative_year.suffix)
}
TL.Language.prototype._applyEra = function (formatted_date, original_year) {
  var labels = (original_year < 0) ? this.era_labels.negative_year : this.era_labels.positive_year;
  var result = '';
  if (labels.prefix) {
    result += '<span>' + labels.prefix + '</span> '
  }
  result += formatted_date;
  if (labels.suffix) {
    result += ' <span>' + labels.suffix + '</span>'
  }
  return result
}
TL.Language.DATE_FORMAT_TOKENS = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
TL.Language.languages = {
  en: {
    name: "English",
    lang: "en",
    api: {wikipedia: "en"},
    messages: {
      loading: "Loading",
      wikipedia: "From Wikipedia, the free encyclopedia",
      error: "Error",
      contract_timeline: "Contract Timeline",
      return_to_title: "Return to Title",
      loading_content: "Loading Content",
      expand_timeline: "Expand Timeline",
      loading_timeline: "Loading Timeline... ",
      swipe_to_navigate: "Swipe to Navigate<br><span class='tl-button'>OK</span>",
      unknown_read_err: "An unexpected error occurred trying to read your spreadsheet data",
      invalid_url_err: "Unable to read Timeline data. Make sure your URL is for a Google Spreadsheet or a Timeline JSON file.",
      network_err: "Unable to read your Google Spreadsheet. Make sure you have published it to the web.",
      empty_feed_err: "No data entries found",
      missing_start_date_err: "Missing start_date",
      invalid_data_format_err: "Header row has been modified.",
      date_compare_err: "Can't compare TL.Dates on different scales",
      invalid_scale_err: "Invalid scale",
      invalid_date_err: "Invalid date: month, day and year must be numbers.",
      invalid_separator_error: "Invalid time: misuse of : or . as separator.",
      invalid_hour_err: "Invalid time (hour)",
      invalid_minute_err: "Invalid time (minute)",
      invalid_second_err: "Invalid time (second)",
      invalid_fractional_err: "Invalid time (fractional seconds)",
      invalid_second_fractional_err: "Invalid time (seconds and fractional seconds)",
      invalid_year_err: "Invalid year",
      flickr_notfound_err: "Photo not found or private",
      flickr_invalidurl_err: "Invalid Flickr URL",
      imgur_invalidurl_err: "Invalid Imgur URL",
      twitter_invalidurl_err: "Invalid Twitter URL",
      twitter_load_err: "Unable to load Tweet",
      twitterembed_invalidurl_err: "Invalid Twitter Embed url",
      wikipedia_load_err: "Unable to load Wikipedia entry",
      youtube_invalidurl_err: "Invalid YouTube URL",
      spotify_invalid_url: "Invalid Spotify URL",
      template_value_err: "No value provided for variable",
      invalid_rgb_err: "Invalid RGB argument",
      time_scale_scale_err: "Don't know how to get date from time for scale",
      axis_helper_no_options_err: "Axis helper must be configured with options",
      axis_helper_scale_err: "No AxisHelper available for scale",
      invalid_integer_option: "Invalid option value—must be a whole number."
    },
    date: {
      month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      month_abbr: ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."],
      day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      day_abbr: ["Sun.", "Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."]
    },
    era_labels: {
      positive_year: {prefix: '', suffix: ''},
      negative_year: {prefix: '', suffix: 'BCE'}
    },
    period_labels: {
      t: ['a', 'p'],
      tt: ['am', 'pm'],
      T: ['A', 'P'],
      TT: ['AM', 'PM']
    },
    dateformats: {
      year: "yyyy",
      month_short: "mmm",
      month: "mmmm yyyy",
      full_short: "mmm d",
      full: "mmmm d',' yyyy",
      time: "h:MM:ss TT' <small>'mmmm d',' yyyy'</small>'",
      time_short: "h:MM:ss TT",
      time_no_seconds_short: "h:MM TT",
      time_no_minutes_short: "h TT",
      time_no_seconds_small_date: "h:MM TT' <small>'mmmm d',' yyyy'</small>'",
      time_milliseconds: "l",
      full_long: "mmm d',' yyyy 'at' h:MM TT",
      full_long_small_date: "h:MM TT' <small>mmm d',' yyyy'</small>'"
    },
    bigdateformats: {
      fallback: [[1000000000, "%.2f billion years ago"], [1000000, "%.1f million years ago"], [1000, "%.1f thousand years ago"], [1, "%f years ago"]],
      compact: [[1000000000, "%.2f bya"], [1000000, "%.1f mya"], [1000, "%.1f kya"], [1, "%f years ago"]],
      verbose: [[1000000000, "%.2f billion years ago"], [1000000, "%.1f million years ago"], [1000, "%.1f thousand years ago"], [1, "%f years ago"]]
    }
  }
}
TL.Language.fallback = new TL.Language();
TL.I18NMixins = {
  getLanguage: function () {
    if (this.options && this.options.language) {
      return this.options.language
    }
    trace("Expected a language option");
    return TL.Language.fallback
  }, _: function (msg) {
    return this.getLanguage()._(msg)
  }
}
TL.Easings = {
  ease: [0.25, 0.1, 0.25, 1.0],
  linear: [0.00, 0.0, 1.00, 1.0],
  easein: [0.42, 0.0, 1.00, 1.0],
  easeout: [0.00, 0.0, 0.58, 1.0],
  easeinout: [0.42, 0.0, 0.58, 1.0]
};
TL.Ease = {
  KeySpline: function (a) {
    this.get = function (aX) {
      if (a[0] == a[1] && a[2] == a[3]) {
        return aX;
      }
      return CalcBezier(GetTForX(aX), a[1], a[3])
    }

    function A(aA1, aA2) {
      return 1.0 - 3.0 * aA2 + 3.0 * aA1
    }

    function B(aA1, aA2) {
      return 3.0 * aA2 - 6.0 * aA1
    }

    function C(aA1) {
      return 3.0 * aA1
    }

    function CalcBezier(aT, aA1, aA2) {
      return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT
    }

    function GetSlope(aT, aA1, aA2) {
      return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1)
    }

    function GetTForX(aX) {
      var aGuessT = aX;
      for (var i = 0; i < 4; ++i) {
        var currentSlope = GetSlope(aGuessT, a[0], a[2]);
        if (currentSlope == 0.0) {
          return aGuessT;
        }
        var currentX = CalcBezier(aGuessT, a[0], a[2]) - aX;
        aGuessT -= currentX / currentSlope
      }
      return aGuessT
    }
  }, easeInSpline: function (t) {
    var spline = new TL.Ease.KeySpline(TL.Easings.easein);
    return spline.get(t)
  }, easeInOutExpo: function (t) {
    var spline = new TL.Ease.KeySpline(TL.Easings.easein);
    return spline.get(t)
  }, easeOut: function (t) {
    return Math.sin(t * Math.PI / 2)
  }, easeOutStrong: function (t) {
    return (t == 1) ? 1 : 1 - Math.pow(2, -10 * t)
  }, easeIn: function (t) {
    return t * t
  }, easeInStrong: function (t) {
    return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1))
  }, easeOutBounce: function (pos) {
    if ((pos) < (1 / 2.75)) {
      return (7.5625 * pos * pos)
    }
    else if (pos < (2 / 2.75)) {
      return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75)
    }
    else if (pos < (2.5 / 2.75)) {
      return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375)
    }
    else {
      return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375)
    }
  }, easeInBack: function (pos) {
    var s = 1.70158;
    return (pos) * pos * ((s + 1) * pos - s)
  }, easeOutBack: function (pos) {
    var s = 1.70158;
    return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1
  }, bounce: function (t) {
    if (t < (1 / 2.75)) {
      return 7.5625 * t * t
    }
    if (t < (2 / 2.75)) {
      return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75
    }
    if (t < (2.5 / 2.75)) {
      return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375
    }
    return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375
  }, bouncePast: function (pos) {
    if (pos < (1 / 2.75)) {
      return (7.5625 * pos * pos)
    }
    else if (pos < (2 / 2.75)) {
      return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75)
    }
    else if (pos < (2.5 / 2.75)) {
      return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375)
    }
    else {
      return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375)
    }
  }, swingTo: function (pos) {
    var s = 1.70158;
    return (pos -= 1) * pos * ((s + 1) * pos + s) + 1
  }, swingFrom: function (pos) {
    var s = 1.70158;
    return pos * pos * ((s + 1) * pos - s)
  }, elastic: function (pos) {
    return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1
  }, spring: function (pos) {
    return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6))
  }, blink: function (pos, blinks) {
    return Math.round(pos * (blinks || 5)) % 2
  }, pulse: function (pos, pulses) {
    return (-Math.cos((pos * ((pulses || 5) - .5) * 2) * Math.PI) / 2) + .5
  }, wobble: function (pos) {
    return (-Math.cos(pos * Math.PI * (9 * pos)) / 2) + 0.5
  }, sinusoidal: function (pos) {
    return (-Math.cos(pos * Math.PI) / 2) + 0.5
  }, flicker: function (pos) {
    var pos = pos + (Math.random() - 0.5) / 5;
    return easings.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos)
  }, mirror: function (pos) {
    if (pos < 0.5) {
      return easings.sinusoidal(pos * 2);
    }
    else {
      return easings.sinusoidal(1 - (pos - 0.5) * 2)
    }
  }, easeInQuad: function (t) {
    return t * t
  }, easeOutQuad: function (t) {
    return t * (2 - t)
  }, easeInOutQuad: function (t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }, easeInCubic: function (t) {
    return t * t * t
  }, easeOutCubic: function (t) {
    return (--t) * t * t + 1
  }, easeInOutCubic: function (t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }, easeInQuart: function (t) {
    return t * t * t * t
  }, easeOutQuart: function (t) {
    return 1 - (--t) * t * t * t
  }, easeInOutQuart: function (t) {
    return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
  }, easeInQuint: function (t) {
    return t * t * t * t * t
  }, easeOutQuint: function (t) {
    return 1 + (--t) * t * t * t * t
  }, easeInOutQuint: function (t) {
    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
  }
};
TL.Animate = function (el, options) {
  var animation = new tlanimate(el, options), webkit_timeout;
  return animation
};
window.tlanimate = (function () {
  var doc = document, win = window, perf = win.performance,
    perfNow = perf && (perf.now || perf.webkitNow || perf.msNow || perf.mozNow),
    now = perfNow ? function () {
      return perfNow.call(perf)
    } : function () {
      return +new Date()
    }, html = doc.documentElement, fixTs = !1, thousand = 1000,
    rgbOhex = /^rgb\(|#/, relVal = /^([+\-])=([\d\.]+)/,
    numUnit = /^(?:[\+\-]=?)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/,
    rotate = /rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/,
    scale = /scale\(((?:[+\-]=)?([\d\.]+))\)/,
    skew = /skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/,
    translate = /translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/,
    unitless = {lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, transform: 1};
  var transform = function () {
    var styles = doc.createElement('a').style,
      props = ['webkitTransform', 'MozTransform', 'OTransform', 'msTransform', 'Transform'],
      i;
    for (i = 0; i < props.length; i++) {
      if (props[i] in styles) {
        return props[i]
      }
    }
  }();
  var opacity = function () {
    return typeof doc.createElement('a').style.opacity !== 'undefined'
  }();
  var getStyle = doc.defaultView && doc.defaultView.getComputedStyle ? function (el, property) {
    property = property == 'transform' ? transform : property
    property = camelize(property)
    var value = null, computed = doc.defaultView.getComputedStyle(el, '');
    computed && (value = computed[property]);
    return el.style[property] || value
  } : html.currentStyle ? function (el, property) {
    property = camelize(property)
    if (property == 'opacity') {
      var val = 100
      try {
        val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity
      }
      catch (e1) {
        try {
          val = el.filters('alpha').opacity
        }
        catch (e2) {
        }
      }
      return val / 100
    }
    var value = el.currentStyle ? el.currentStyle[property] : null
    return el.style[property] || value
  } : function (el, property) {
    return el.style[camelize(property)]
  }
  var frame = function () {
    return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame || win.oRequestAnimationFrame || function (callback) {
      win.setTimeout(function () {
        callback(+new Date())
      }, 17)
    }
  }()
  var children = []
  frame(function (timestamp) {
    fixTs = timestamp > 1e12 != now() > 1e12
  })

  function has(array, elem, i) {
    if (Array.prototype.indexOf) {
      return array.indexOf(elem)
    }
    for (i = 0; i < array.length; ++i) {
      if (array[i] === elem) {
        return i
      }
    }
  }

  function render(timestamp) {
    var i, count = children.length
    if (perfNow && timestamp > 1e12) {
      timestamp = now()
    }
    if (fixTs) {
      timestamp = now()
    }
    for (i = count; i--;) {
      children[i](timestamp)
    }
    children.length && frame(render)
  }

  function live(f) {
    if (children.push(f) === 1) {
      frame(render)
    }
  }

  function die(f) {
    var rest, index = has(children, f)
    if (index >= 0) {
      rest = children.slice(index + 1)
      children.length = index
      children = children.concat(rest)
    }
  }

  function parseTransform(style, base) {
    var values = {}, m
    if (m = style.match(rotate)) {
      values.rotate = by(m[1], base ? base.rotate : null)
    }
    if (m = style.match(scale)) {
      values.scale = by(m[1], base ? base.scale : null)
    }
    if (m = style.match(skew)) {
      values.skewx = by(m[1], base ? base.skewx : null);
      values.skewy = by(m[3], base ? base.skewy : null)
    }
    if (m = style.match(translate)) {
      values.translatex = by(m[1], base ? base.translatex : null);
      values.translatey = by(m[3], base ? base.translatey : null)
    }
    return values
  }

  function formatTransform(v) {
    var s = ''
    if ('rotate' in v) {
      s += 'rotate(' + v.rotate + 'deg) '
    }
    if ('scale' in v) {
      s += 'scale(' + v.scale + ') '
    }
    if ('translatex' in v) {
      s += 'translate(' + v.translatex + 'px,' + v.translatey + 'px) '
    }
    if ('skewx' in v) {
      s += 'skew(' + v.skewx + 'deg,' + v.skewy + 'deg)'
    }
    return s
  }

  function rgb(r, g, b) {
    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
  }

  function toHex(c) {
    var m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    return (m ? rgb(m[1], m[2], m[3]) : c).replace(/#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3')
  }

  function camelize(s) {
    return s.replace(/-(.)/g, function (m, m1) {
      return m1.toUpperCase()
    })
  }

  function fun(f) {
    return typeof f == 'function'
  }

  function nativeTween(t) {
    return Math.sin(t * Math.PI / 2)
  }

  function tween(duration, fn, done, ease, from, to) {
    ease = fun(ease) ? ease : morpheus.easings[ease] || nativeTween
    var time = duration || thousand, self = this, diff = to - from,
      start = now(), stop = 0, end = 0

    function run(t) {
      var delta = t - start
      if (delta > time || stop) {
        to = isFinite(to) ? to : 1
        stop ? end && fn(to) : fn(to)
        die(run)
        return done && done.apply(self)
      }
      isFinite(to) ? fn((diff * ease(delta / time)) + from) : fn(ease(delta / time))
    }

    live(run)
    return {
      stop: function (jump) {
        stop = 1
        end = jump
        if (!jump) {
          done = null
        }
      }
    }
  }

  function bezier(points, pos) {
    var n = points.length, r = [], i, j
    for (i = 0; i < n; ++i) {
      r[i] = [points[i][0], points[i][1]]
    }
    for (j = 1; j < n; ++j) {
      for (i = 0; i < n - j; ++i) {
        r[i][0] = (1 - pos) * r[i][0] + pos * r[parseInt(i + 1, 10)][0]
        r[i][1] = (1 - pos) * r[i][1] + pos * r[parseInt(i + 1, 10)][1]
      }
    }
    return [r[0][0], r[0][1]]
  }

  function nextColor(pos, start, finish) {
    var r = [], i, e, from, to
    for (i = 0; i < 6; i++) {
      from = Math.min(15, parseInt(start.charAt(i), 16))
      to = Math.min(15, parseInt(finish.charAt(i), 16))
      e = Math.floor((to - from) * pos + from)
      e = e > 15 ? 15 : e < 0 ? 0 : e
      r[i] = e.toString(16)
    }
    return '#' + r.join('')
  }

  function getTweenVal(pos, units, begin, end, k, i, v) {
    if (k == 'transform') {
      v = {}
      for (var t in begin[i][k]) {
        v[t] = (t in end[i][k]) ? Math.round(((end[i][k][t] - begin[i][k][t]) * pos + begin[i][k][t]) * thousand) / thousand : begin[i][k][t]
      }
      return v
    }
    else if (typeof begin[i][k] == 'string') {
      return nextColor(pos, begin[i][k], end[i][k])
    }
    else {
      v = Math.round(((end[i][k] - begin[i][k]) * pos + begin[i][k]) * thousand) / thousand
      if (!(k in unitless)) {
        v += units[i][k] || 'px'
      }
      return v
    }
  }

  function by(val, start, m, r, i) {
    return (m = relVal.exec(val)) ? (i = parseFloat(m[2])) && (start + (m[1] == '+' ? 1 : -1) * i) : parseFloat(val)
  }

  function morpheus(elements, options) {
    var els = elements ? (els = isFinite(elements.length) ? elements : [elements]) : [],
      i, complete = options.complete, duration = options.duration,
      ease = options.easing, points = options.bezier, begin = [], end = [],
      units = [], bez = [], originalLeft, originalTop
    if (points) {
      originalLeft = options.left;
      originalTop = options.top;
      delete options.right;
      delete options.bottom;
      delete options.left;
      delete options.top
    }
    for (i = els.length; i--;) {
      begin[i] = {}
      end[i] = {}
      units[i] = {}
      if (points) {
        var left = getStyle(els[i], 'left'), top = getStyle(els[i], 'top'),
          xy = [by(fun(originalLeft) ? originalLeft(els[i]) : originalLeft || 0, parseFloat(left)), by(fun(originalTop) ? originalTop(els[i]) : originalTop || 0, parseFloat(top))]
        bez[i] = fun(points) ? points(els[i], xy) : points
        bez[i].push(xy)
        bez[i].unshift([parseInt(left, 10), parseInt(top, 10)])
      }
      for (var k in options) {
        switch (k) {
          case 'complete':
          case 'duration':
          case 'easing':
          case 'bezier':
            continue
        }
        var v = getStyle(els[i], k), unit,
          tmp = fun(options[k]) ? options[k](els[i]) : options[k]
        if (typeof tmp == 'string' && rgbOhex.test(tmp) && !rgbOhex.test(v)) {
          delete options[k];
          continue
        }
        begin[i][k] = k == 'transform' ? parseTransform(v) : typeof tmp == 'string' && rgbOhex.test(tmp) ? toHex(v).slice(1) : parseFloat(v)
        end[i][k] = k == 'transform' ? parseTransform(tmp, begin[i][k]) : typeof tmp == 'string' && tmp.charAt(0) == '#' ? toHex(tmp).slice(1) : by(tmp, parseFloat(v));
        (typeof tmp == 'string') && (unit = tmp.match(numUnit)) && (units[i][k] = unit[1])
      }
    }
    return tween.apply(els, [duration, function (pos, v, xy) {
      for (i = els.length; i--;) {
        if (points) {
          xy = bezier(bez[i], pos)
          els[i].style.left = xy[0] + 'px'
          els[i].style.top = xy[1] + 'px'
        }
        for (var k in options) {
          v = getTweenVal(pos, units, begin, end, k, i)
          k == 'transform' ? els[i].style[transform] = formatTransform(v) : k == 'opacity' && !opacity ? (els[i].style.filter = 'alpha(opacity=' + (v * 100) + ')') : (els[i].style[camelize(k)] = v)
        }
      }
    }, complete, ease])
  }

  morpheus.tween = tween
  morpheus.getStyle = getStyle
  morpheus.bezier = bezier
  morpheus.transform = transform
  morpheus.parseTransform = parseTransform
  morpheus.formatTransform = formatTransform
  morpheus.easings = {}
  return morpheus
})();
TL.Point = function (x, y, round) {
  this.x = (round ? Math.round(x) : x);
  this.y = (round ? Math.round(y) : y)
};
TL.Point.prototype = {
  add: function (point) {
    return this.clone()._add(point)
  }, _add: function (point) {
    this.x += point.x;
    this.y += point.y;
    return this
  }, subtract: function (point) {
    return this.clone()._subtract(point)
  }, _subtract: function (point) {
    this.x -= point.x;
    this.y -= point.y;
    return this
  }, divideBy: function (num, round) {
    return new TL.Point(this.x / num, this.y / num, round)
  }, multiplyBy: function (num) {
    return new TL.Point(this.x * num, this.y * num)
  }, distanceTo: function (point) {
    var x = point.x - this.x, y = point.y - this.y;
    return Math.sqrt(x * x + y * y)
  }, round: function () {
    return this.clone()._round()
  }, _round: function () {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this
  }, clone: function () {
    return new TL.Point(this.x, this.y)
  }, toString: function () {
    return 'Point(' + TL.Util.formatNum(this.x) + ', ' + TL.Util.formatNum(this.y) + ')'
  }
};
TL.DomMixins = {
  show: function (animate) {
    if (animate) {
    }
    else {
      this._el.container.style.display = "block"
    }
  }, hide: function (animate) {
    this._el.container.style.display = "none"
  }, addTo: function (container) {
    container.appendChild(this._el.container);
    this.onAdd()
  }, removeFrom: function (container) {
    container.removeChild(this._el.container);
    this.onRemove()
  }, animatePosition: function (pos, el) {
    var ani = {duration: this.options.duration, easing: this.options.ease};
    for (var name in pos) {
      if (pos.hasOwnProperty(name)) {
        ani[name] = pos[name] + "px"
      }
    }
    if (this.animator) {
      this.animator.stop()
    }
    this.animator = TL.Animate(el, ani)
  }, onLoaded: function () {
    this.fire("loaded", this.data)
  }, onAdd: function () {
    this.fire("added", this.data)
  }, onRemove: function () {
    this.fire("removed", this.data)
  }, setPosition: function (pos, el) {
    for (var name in pos) {
      if (pos.hasOwnProperty(name)) {
        if (el) {
          el.style[name] = pos[name] + "px"
        }
        else {
          this._el.container.style[name] = pos[name] + "px"
        }
      }
    }
  }, getPosition: function () {
    return TL.Dom.getPosition(this._el.container)
  }
};
TL.Dom = {
  get: function (id) {
    return (typeof id === 'string' ? document.getElementById(id) : id)
  }, getByClass: function (id) {
    if (id) {
      return document.getElementsByClassName(id)
    }
  }, create: function (tagName, className, container) {
    var el = document.createElement(tagName);
    el.className = className;
    if (container) {
      container.appendChild(el)
    }
    return el
  }, createText: function (content, container) {
    var el = document.createTextNode(content);
    if (container) {
      container.appendChild(el)
    }
    return el
  }, getTranslateString: function (point) {
    return TL.Dom.TRANSLATE_OPEN + point.x + 'px,' + point.y + 'px' + TL.Dom.TRANSLATE_CLOSE
  }, setPosition: function (el, point) {
    el._tl_pos = point;
    if (TL.Browser.webkit3d) {
      el.style[TL.Dom.TRANSFORM] = TL.Dom.getTranslateString(point);
      if (TL.Browser.android) {
        el.style['-webkit-perspective'] = '1000';
        el.style['-webkit-backface-visibility'] = 'hidden'
      }
    }
    else {
      el.style.left = point.x + 'px';
      el.style.top = point.y + 'px'
    }
  }, getPosition: function (el) {
    var pos = {x: 0, y: 0}
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      pos.x += el.offsetLeft
      pos.y += el.offsetTop
      el = el.offsetParent
    }
    return pos
  }, testProp: function (props) {
    var style = document.documentElement.style;
    for (var i = 0; i < props.length; i++) {
      if (props[i] in style) {
        return props[i]
      }
    }
    return !1
  }
};
TL.Util.mergeData(TL.Dom, {
  TRANSITION: TL.Dom.testProp(['transition', 'webkitTransition', 'OTransition', 'MozTransition', 'msTransition']),
  TRANSFORM: TL.Dom.testProp(['transformProperty', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']),
  TRANSLATE_OPEN: 'translate' + (TL.Browser.webkit3d ? '3d(' : '('),
  TRANSLATE_CLOSE: TL.Browser.webkit3d ? ',0)' : ')'
});
TL.DomUtil = {
  get: function (id) {
    return (typeof id === 'string' ? document.getElementById(id) : id)
  }, getStyle: function (el, style) {
    var value = el.style[style];
    if (!value && el.currentStyle) {
      value = el.currentStyle[style]
    }
    if (!value || value === 'auto') {
      var css = document.defaultView.getComputedStyle(el, null);
      value = css ? css[style] : null
    }
    return (value === 'auto' ? null : value)
  }, getViewportOffset: function (element) {
    var top = 0, left = 0, el = element, docBody = document.body;
    do {
      top += el.offsetTop || 0;
      left += el.offsetLeft || 0;
      if (el.offsetParent === docBody && TL.DomUtil.getStyle(el, 'position') === 'absolute') {
        break
      }
      el = el.offsetParent
    } while (el);
    el = element;
    do {
      if (el === docBody) {
        break
      }
      top -= el.scrollTop || 0;
      left -= el.scrollLeft || 0;
      el = el.parentNode
    } while (el);
    return new TL.Point(left, top)
  }, create: function (tagName, className, container) {
    var el = document.createElement(tagName);
    el.className = className;
    if (container) {
      container.appendChild(el)
    }
    return el
  }, disableTextSelection: function () {
    if (document.selection && document.selection.empty) {
      document.selection.empty()
    }
    if (!this._onselectstart) {
      this._onselectstart = document.onselectstart;
      document.onselectstart = TL.Util.falseFn
    }
  }, enableTextSelection: function () {
    document.onselectstart = this._onselectstart;
    this._onselectstart = null
  }, hasClass: function (el, name) {
    return (el.className.length > 0) && new RegExp("(^|\\s)" + name + "(\\s|$)").test(el.className)
  }, addClass: function (el, name) {
    if (!TL.DomUtil.hasClass(el, name)) {
      el.className += (el.className ? ' ' : '') + name
    }
  }, removeClass: function (el, name) {
    el.className = el.className.replace(/(\S+)\s*/g, function (w, match) {
      if (match === name) {
        return ''
      }
      return w
    }).replace(/^\s+/, '')
  }, setOpacity: function (el, value) {
    if (TL.Browser.ie) {
      el.style.filter = 'alpha(opacity=' + Math.round(value * 100) + ')'
    }
    else {
      el.style.opacity = value
    }
  }, testProp: function (props) {
    var style = document.documentElement.style;
    for (var i = 0; i < props.length; i++) {
      if (props[i] in style) {
        return props[i]
      }
    }
    return !1
  }, getTranslateString: function (point) {
    return TL.DomUtil.TRANSLATE_OPEN + point.x + 'px,' + point.y + 'px' + TL.DomUtil.TRANSLATE_CLOSE
  }, getScaleString: function (scale, origin) {
    var preTranslateStr = TL.DomUtil.getTranslateString(origin),
      scaleStr = ' scale(' + scale + ') ',
      postTranslateStr = TL.DomUtil.getTranslateString(origin.multiplyBy(-1));
    return preTranslateStr + scaleStr + postTranslateStr
  }, setPosition: function (el, point) {
    el._tl_pos = point;
    if (TL.Browser.webkit3d) {
      el.style[TL.DomUtil.TRANSFORM] = TL.DomUtil.getTranslateString(point);
      if (TL.Browser.android) {
        el.style['-webkit-perspective'] = '1000';
        el.style['-webkit-backface-visibility'] = 'hidden'
      }
    }
    else {
      el.style.left = point.x + 'px';
      el.style.top = point.y + 'px'
    }
  }, getPosition: function (el) {
    return el._tl_pos
  }
};
TL.DomEvent = {
  addListener: function (obj, type, fn, context) {
    var id = TL.Util.stamp(fn), key = '_tl_' + type + id;
    if (obj[key]) {
      return
    }
    var handler = function (e) {
      return fn.call(context || obj, e || TL.DomEvent._getEvent())
    };
    if (TL.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
      this.addDoubleTapListener(obj, handler, id)
    }
    else if ('addEventListener' in obj) {
      if (type === 'mousewheel') {
        obj.addEventListener('DOMMouseScroll', handler, !1);
        obj.addEventListener(type, handler, !1)
      }
      else if ((type === 'mouseenter') || (type === 'mouseleave')) {
        var originalHandler = handler,
          newType = (type === 'mouseenter' ? 'mouseover' : 'mouseout');
        handler = function (e) {
          if (!TL.DomEvent._checkMouse(obj, e)) {
            return
          }
          return originalHandler(e)
        };
        obj.addEventListener(newType, handler, !1)
      }
      else {
        obj.addEventListener(type, handler, !1)
      }
    }
    else if ('attachEvent' in obj) {
      obj.attachEvent("on" + type, handler)
    }
    obj[key] = handler
  }, removeListener: function (obj, type, fn) {
    var id = TL.Util.stamp(fn), key = '_tl_' + type + id, handler = obj[key];
    if (!handler) {
      return
    }
    if (TL.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
      this.removeDoubleTapListener(obj, id)
    }
    else if ('removeEventListener' in obj) {
      if (type === 'mousewheel') {
        obj.removeEventListener('DOMMouseScroll', handler, !1);
        obj.removeEventListener(type, handler, !1)
      }
      else if ((type === 'mouseenter') || (type === 'mouseleave')) {
        obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, !1)
      }
      else {
        obj.removeEventListener(type, handler, !1)
      }
    }
    else if ('detachEvent' in obj) {
      obj.detachEvent("on" + type, handler)
    }
    obj[key] = null
  }, _checkMouse: function (el, e) {
    var related = e.relatedTarget;
    if (!related) {
      return !0
    }
    try {
      while (related && (related !== el)) {
        related = related.parentNode
      }
    }
    catch (err) {
      return !1
    }
    return (related !== el)
  }, _getEvent: function () {
    var e = window.event;
    if (!e) {
      var caller = arguments.callee.caller;
      while (caller) {
        e = caller['arguments'][0];
        if (e && window.Event === e.constructor) {
          break
        }
        caller = caller.caller
      }
    }
    return e
  }, stopPropagation: function (e) {
    if (e.stopPropagation) {
      e.stopPropagation()
    }
    else {
      e.cancelBubble = !0
    }
  }, disableClickPropagation: function (el) {
    TL.DomEvent.addListener(el, TL.Draggable.START, TL.DomEvent.stopPropagation);
    TL.DomEvent.addListener(el, 'click', TL.DomEvent.stopPropagation);
    TL.DomEvent.addListener(el, 'dblclick', TL.DomEvent.stopPropagation)
  }, preventDefault: function (e) {
    if (e.preventDefault) {
      e.preventDefault()
    }
    else {
      e.returnValue = !1
    }
  }, stop: function (e) {
    TL.DomEvent.preventDefault(e);
    TL.DomEvent.stopPropagation(e)
  }, getWheelDelta: function (e) {
    var delta = 0;
    if (e.wheelDelta) {
      delta = e.wheelDelta / 120
    }
    if (e.detail) {
      delta = -e.detail / 3
    }
    return delta
  }
};
TL.StyleSheet = TL.Class.extend({
  includes: [TL.Events], _el: {}, initialize: function () {
    this.style = document.createElement("style");
    this.style.appendChild(document.createTextNode(""));
    document.head.appendChild(this.style);
    this.sheet = this.style.sheet
  }, addRule: function (selector, rules, index) {
    var _index = 0;
    if (index) {
      _index = index
    }
    if ("insertRule" in this.sheet) {
      this.sheet.insertRule(selector + "{" + rules + "}", _index)
    }
    else if ("addRule" in this.sheet) {
      this.sheet.addRule(selector, rules, _index)
    }
  }, onLoaded: function (error) {
    this._state.loaded = !0;
    this.fire("loaded", this.data)
  }
});
TL.Date = TL.Class.extend({
  initialize: function (data, format, format_short) {
    if (typeof (data) == 'number') {
      this.data = {format: "yyyy mmmm", date_obj: new Date(data)}
    }
    else if (Date == data.constructor) {
      this.data = {format: "yyyy mmmm", date_obj: data}
    }
    else {
      this.data = JSON.parse(JSON.stringify(data));
      this._createDateObj()
    }
    this._setFormat(format, format_short)
  }, setDateFormat: function (format) {
    this.data.format = format
  }, getDisplayDate: function (language, format) {
    if (this.data.display_date) {
      return this.data.display_date
    }
    if (!language) {
      language = TL.Language.fallback
    }
    if (language.constructor != TL.Language) {
      trace("First argument to getDisplayDate must be TL.Language");
      language = TL.Language.fallback
    }
    var format_key = format || this.data.format;
    return language.formatDate(this.data.date_obj, format_key)
  }, getMillisecond: function () {
    return this.getTime()
  }, getTime: function () {
    return this.data.date_obj.getTime()
  }, isBefore: function (other_date) {
    if (!this.data.date_obj.constructor == other_date.data.date_obj.constructor) {
      throw new TL.Error("date_compare_err")
    }
    if ('isBefore' in this.data.date_obj) {
      return this.data.date_obj.isBefore(other_date.data.date_obj)
    }
    return this.data.date_obj < other_date.data.date_obj
  }, isAfter: function (other_date) {
    if (!this.data.date_obj.constructor == other_date.data.date_obj.constructor) {
      throw new TL.Error("date_compare_err")
    }
    if ('isAfter' in this.data.date_obj) {
      return this.data.date_obj.isAfter(other_date.data.date_obj)
    }
    return this.data.date_obj > other_date.data.date_obj
  }, floor: function (scale) {
    var d = new Date(this.data.date_obj.getTime());
    for (var i = 0; i < TL.Date.SCALES.length; i++) {
      TL.Date.SCALES[i][2](d);
      if (TL.Date.SCALES[i][0] == scale) {
        return new TL.Date(d)
      }
    }
    ;
    throw new TL.Error("invalid_scale_err", scale)
  }, _getDateData: function () {
    var _date = {
      year: 0,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
    TL.Util.mergeData(_date, this.data);
    var DATE_PARTS = TL.Date.DATE_PARTS;
    for (var ix in DATE_PARTS) {
      var x = TL.Util.trim(_date[DATE_PARTS[ix]]);
      if (!x.match(/^-?\d*$/)) {
        throw new TL.Error("invalid_date_err", DATE_PARTS[ix] + " = '" + _date[DATE_PARTS[ix]] + "'")
      }
      var parsed = parseInt(_date[DATE_PARTS[ix]]);
      if (isNaN(parsed)) {
        parsed = (ix == 4 || ix == 5) ? 1 : 0
      }
      _date[DATE_PARTS[ix]] = parsed
    }
    if (_date.month > 0 && _date.month <= 12) {
      _date.month = _date.month - 1
    }
    return _date
  }, _createDateObj: function () {
    var _date = this._getDateData();
    this.data.date_obj = new Date(_date.year, _date.month, _date.day, _date.hour, _date.minute, _date.second, _date.millisecond);
    if (this.data.date_obj.getFullYear() != _date.year) {
      this.data.date_obj.setFullYear(_date.year)
    }
  }, findBestFormat: function (variant) {
    var eval_array = TL.Date.DATE_PARTS, format = "";
    for (var i = 0; i < eval_array.length; i++) {
      if (this.data[eval_array[i]]) {
        if (variant) {
          if (!(variant in TL.Date.BEST_DATEFORMATS)) {
            variant = 'short'
          }
        }
        else {
          variant = 'base'
        }
        return TL.Date.BEST_DATEFORMATS[variant][eval_array[i]]
      }
    }
    ;
    return ""
  }, _setFormat: function (format, format_short) {
    if (format) {
      this.data.format = format
    }
    else if (!this.data.format) {
      this.data.format = this.findBestFormat()
    }
    if (format_short) {
      this.data.format_short = format_short
    }
    else if (!this.data.format_short) {
      this.data.format_short = this.findBestFormat(!0)
    }
  }
});
TL.Date.makeDate = function (data) {
  var date = new TL.Date(data);
  if (!isNaN(date.getTime())) {
    return date
  }
  return new TL.BigDate(data)
}
TL.BigYear = TL.Class.extend({
  initialize: function (year) {
    this.year = parseInt(year);
    if (isNaN(this.year)) {
      throw new TL.Error('invalid_year_err', year)
    }
  }, isBefore: function (that) {
    return this.year < that.year
  }, isAfter: function (that) {
    return this.year > that.year
  }, getTime: function () {
    return this.year
  }
});
(function (cls) {
  cls.SCALES = [['millisecond', 1, function (d) {
  }], ['second', 1000, function (d) {
    d.setMilliseconds(0)
  }], ['minute', 1000 * 60, function (d) {
    d.setSeconds(0)
  }], ['hour', 1000 * 60 * 60, function (d) {
    d.setMinutes(0)
  }], ['day', 1000 * 60 * 60 * 24, function (d) {
    d.setHours(0)
  }], ['month', 1000 * 60 * 60 * 24 * 30, function (d) {
    d.setDate(1)
  }], ['year', 1000 * 60 * 60 * 24 * 365, function (d) {
    d.setMonth(0)
  }], ['decade', 1000 * 60 * 60 * 24 * 365 * 10, function (d) {
    var real_year = d.getFullYear();
    d.setFullYear(real_year - (real_year % 10))
  }], ['century', 1000 * 60 * 60 * 24 * 365 * 100, function (d) {
    var real_year = d.getFullYear();
    d.setFullYear(real_year - (real_year % 100))
  }], ['millennium', 1000 * 60 * 60 * 24 * 365 * 1000, function (d) {
    var real_year = d.getFullYear();
    d.setFullYear(real_year - (real_year % 1000))
  }]];
  cls.DATE_PARTS = ["millisecond", "second", "minute", "hour", "day", "month", "year"];
  var ISO8601_SHORT_PATTERN = /^([\+-]?\d+?)(-\d{2}?)?(-\d{2}?)?$/;
  var ISO8601_PATTERN = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
  cls.parseISODate = function (str) {
    var d = new Date(str);
    if (isNaN(d)) {
      throw new TL.Error("invalid_date_err", str)
    }
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hour: d.getHours(),
      minute: d.getMinutes(),
      second: d.getSeconds(),
      millisecond: d.getMilliseconds()
    }
  }
  cls.parseDate = function (str) {
    if (str.match(ISO8601_SHORT_PATTERN)) {
      var parts = str.match(ISO8601_SHORT_PATTERN).slice(1);
      var d = {year: parts[0].replace('+', '')}
      if (parts[1]) {
        d.month = parts[1].replace('-', '')
      }
      if (parts[2]) {
        d.day = parts[2].replace('-', '')
      }
      return d
    }
    if (str.match(ISO8601_PATTERN)) {
      return cls.parseISODate(str)
    }
    if (str.match(/^\-?\d+$/)) {
      return {year: str}
    }
    var parsed = {}
    if (str.match(/\d+\/\d+\/\d+/)) {
      var date = str.match(/\d+\/\d+\/\d+/)[0];
      str = TL.Util.trim(str.replace(date, ''));
      var date_parts = date.split('/');
      parsed.month = date_parts[0];
      parsed.day = date_parts[1];
      parsed.year = date_parts[2]
    }
    if (str.match(/\d+\/\d+/)) {
      var date = str.match(/\d+\/\d+/)[0];
      str = TL.Util.trim(str.replace(date, ''));
      var date_parts = date.split('/');
      parsed.month = date_parts[0];
      parsed.year = date_parts[1]
    }
    if (str.match(':')) {
      var time_parts = str.split(':');
      parsed.hour = time_parts[0];
      parsed.minute = time_parts[1];
      if (time_parts[2]) {
        second_parts = time_parts[2].split('.');
        parsed.second = second_parts[0];
        parsed.millisecond = second_parts[1]
      }
    }
    return parsed
  }
  cls.BEST_DATEFORMATS = {
    base: {
      millisecond: 'time_short',
      second: 'time',
      minute: 'time_no_seconds_small_date',
      hour: 'time_no_seconds_small_date',
      day: 'full',
      month: 'month',
      year: 'year',
      decade: 'year',
      century: 'year',
      millennium: 'year',
      age: 'fallback',
      epoch: 'fallback',
      era: 'fallback',
      eon: 'fallback',
      eon2: 'fallback'
    },
    short: {
      millisecond: 'time_short',
      second: 'time_short',
      minute: 'time_no_seconds_short',
      hour: 'time_no_minutes_short',
      day: 'full_short',
      month: 'month_short',
      year: 'year',
      decade: 'year',
      century: 'year',
      millennium: 'year',
      age: 'fallback',
      epoch: 'fallback',
      era: 'fallback',
      eon: 'fallback',
      eon2: 'fallback'
    }
  }
})(TL.Date)
TL.BigDate = TL.Date.extend({
  initialize: function (data, format, format_short) {
    if (TL.BigYear == data.constructor) {
      this.data = {date_obj: data}
    }
    else {
      this.data = JSON.parse(JSON.stringify(data));
      this._createDateObj()
    }
    this._setFormat(format, format_short)
  }, _createDateObj: function () {
    var _date = this._getDateData();
    this.data.date_obj = new TL.BigYear(_date.year)
  }, floor: function (scale) {
    for (var i = 0; i < TL.BigDate.SCALES.length; i++) {
      if (TL.BigDate.SCALES[i][0] == scale) {
        var floored = TL.BigDate.SCALES[i][2](this.data.date_obj);
        return new TL.BigDate(floored)
      }
    }
    ;
    throw new TL.Error("invalid_scale_err", scale)
  }
});
(function (cls) {
  var AGE = 1000000;
  var EPOCH = AGE * 10;
  var ERA = EPOCH * 10;
  var EON = ERA * 10;
  var Floorer = function (unit) {
    return function (a_big_year) {
      var year = a_big_year.getTime();
      return new TL.BigYear(Math.floor(year / unit) * unit)
    }
  }
  cls.SCALES = [['year', 1, new Floorer(1)], ['decade', 10, new Floorer(10)], ['century', 100, new Floorer(100)], ['millennium', 1000, new Floorer(1000)], ['age', AGE, new Floorer(AGE)], ['epoch', EPOCH, new Floorer(EPOCH)], ['era', ERA, new Floorer(ERA)], ['eon', EON, new Floorer(EON)]]
})(TL.BigDate)
TL.DateUtil = {
  get: function (id) {
    return (typeof id === 'string' ? document.getElementById(id) : id)
  }, sortByDate: function (array, prop_name) {
    var prop_name = prop_name || 'start_date';
    array.sort(function (a, b) {
      if (a[prop_name].isBefore(b[prop_name])) {
        return -1;
      }
      if (a[prop_name].isAfter(b[prop_name])) {
        return 1;
      }
      return 0
    })
  }, parseTime: function (time_str) {
    var parsed = {hour: null, minute: null, second: null, millisecond: null}
    var period = null;
    var match = time_str.match(/(\s*[AaPp]\.?[Mm]\.?\s*)$/);
    if (match) {
      period = TL.Util.trim(match[0]);
      time_str = TL.Util.trim(time_str.substring(0, time_str.lastIndexOf(period)))
    }
    var parts = [];
    var no_separators = time_str.match(/^\s*(\d{1,2})(\d{2})\s*$/);
    if (no_separators) {
      parts = no_separators.slice(1)
    }
    else {
      parts = time_str.split(':');
      if (parts.length == 1) {
        parts = time_str.split('.')
      }
    }
    if (parts.length > 4) {
      throw new TL.Error("invalid_separator_error")
    }
    parsed.hour = parseInt(parts[0]);
    if (period && period.toLowerCase()[0] == 'p' && parsed.hour != 12) {
      parsed.hour += 12
    }
    else if (period && period.toLowerCase()[0] == 'a' && parsed.hour == 12) {
      parsed.hour = 0
    }
    if (isNaN(parsed.hour) || parsed.hour < 0 || parsed.hour > 23) {
      throw new TL.Error("invalid_hour_err", parsed.hour)
    }
    if (parts.length > 1) {
      parsed.minute = parseInt(parts[1]);
      if (isNaN(parsed.minute)) {
        throw new TL.Error("invalid_minute_err", parsed.minute)
      }
    }
    if (parts.length > 2) {
      var sec_parts = parts[2].split(/[\.,]/);
      parts = sec_parts.concat(parts.slice(3))
      if (parts.length > 2) {
        throw new TL.Error("invalid_second_fractional_err")
      }
      parsed.second = parseInt(parts[0]);
      if (isNaN(parsed.second)) {
        throw new TL.Error("invalid_second_err")
      }
      if (parts.length == 2) {
        var frac_secs = parseInt(parts[1]);
        if (isNaN(frac_secs)) {
          throw new TL.Error("invalid_fractional_err")
        }
        parsed.millisecond = 100 * frac_secs
      }
    }
    return parsed
  }, SCALE_DATE_CLASSES: {human: TL.Date, cosmological: TL.BigDate}
};
TL.Draggable = TL.Class.extend({
  includes: TL.Events,
  _el: {},
  mousedrag: {
    down: "mousedown",
    up: "mouseup",
    leave: "mouseleave",
    move: "mousemove"
  },
  touchdrag: {
    down: "touchstart",
    up: "touchend",
    leave: "mouseleave",
    move: "touchmove"
  },
  initialize: function (drag_elem, options, move_elem) {
    this._el = {drag: drag_elem, move: drag_elem};
    if (move_elem) {
      this._el.move = move_elem
    }
    this.options = {
      enable: {x: !0, y: !0},
      constraint: {top: !1, bottom: !1, left: !1, right: !1},
      momentum_multiplier: 2000,
      duration: 1000,
      ease: TL.Ease.easeInOutQuint
    };
    this.animator = null;
    this.dragevent = this.mousedrag;
    if (TL.Browser.touch) {
      this.dragevent = this.touchdrag
    }
    this.data = {
      sliding: !1,
      direction: "none",
      pagex: {start: 0, end: 0},
      pagey: {start: 0, end: 0},
      pos: {start: {x: 0, y: 0}, end: {x: 0, y: 0}},
      new_pos: {x: 0, y: 0},
      new_pos_parent: {x: 0, y: 0},
      time: {start: 0, end: 0},
      touch: !1
    };
    TL.Util.mergeData(this.options, options)
  },
  enable: function (e) {
    this.data.pos.start = 0;
    this._el.move.style.left = this.data.pos.start.x + "px";
    this._el.move.style.top = this.data.pos.start.y + "px";
    this._el.move.style.position = "absolute"
  },
  disable: function () {
    TL.DomEvent.removeListener(this._el.drag, this.dragevent.down, this._onDragStart, this);
    TL.DomEvent.removeListener(this._el.drag, this.dragevent.up, this._onDragEnd, this)
  },
  stopMomentum: function () {
    if (this.animator) {
      this.animator.stop()
    }
  },
  updateConstraint: function (c) {
    this.options.constraint = c
  },
  _onDragStart: function (e) {
    if (TL.Browser.touch) {
      if (e.originalEvent) {
        this.data.pagex.start = e.originalEvent.touches[0].screenX;
        this.data.pagey.start = e.originalEvent.touches[0].screenY
      }
      else {
        this.data.pagex.start = e.targetTouches[0].screenX;
        this.data.pagey.start = e.targetTouches[0].screenY
      }
    }
    else {
      this.data.pagex.start = e.pageX;
      this.data.pagey.start = e.pageY
    }
    if (this.options.enable.x) {
      this._el.move.style.left = this.data.pagex.start - (this._el.move.offsetWidth / 2) + "px"
    }
    if (this.options.enable.y) {
      this._el.move.style.top = this.data.pagey.start - (this._el.move.offsetHeight / 2) + "px"
    }
    this.data.pos.start = TL.Dom.getPosition(this._el.drag);
    this.data.time.start = new Date().getTime();
    this.fire("dragstart", this.data);
    TL.DomEvent.addListener(this._el.drag, this.dragevent.move, this._onDragMove, this);
    TL.DomEvent.addListener(this._el.drag, this.dragevent.leave, this._onDragEnd, this)
  },
  _onDragEnd: function (e) {
    this.data.sliding = !1;
    TL.DomEvent.removeListener(this._el.drag, this.dragevent.move, this._onDragMove, this);
    TL.DomEvent.removeListener(this._el.drag, this.dragevent.leave, this._onDragEnd, this);
    this.fire("dragend", this.data);
    this._momentum()
  },
  _onDragMove: function (e) {
    e.preventDefault();
    this.data.sliding = !0;
    if (TL.Browser.touch) {
      if (e.originalEvent) {
        this.data.pagex.end = e.originalEvent.touches[0].screenX;
        this.data.pagey.end = e.originalEvent.touches[0].screenY
      }
      else {
        this.data.pagex.end = e.targetTouches[0].screenX;
        this.data.pagey.end = e.targetTouches[0].screenY
      }
    }
    else {
      this.data.pagex.end = e.pageX;
      this.data.pagey.end = e.pageY
    }
    this.data.pos.end = TL.Dom.getPosition(this._el.drag);
    this.data.new_pos.x = -(this.data.pagex.start - this.data.pagex.end - this.data.pos.start.x);
    this.data.new_pos.y = -(this.data.pagey.start - this.data.pagey.end - this.data.pos.start.y);
    if (this.options.enable.x) {
      this._el.move.style.left = this.data.new_pos.x + "px"
    }
    if (this.options.enable.y) {
      this._el.move.style.top = this.data.new_pos.y + "px"
    }
    this.fire("dragmove", this.data)
  },
  _momentum: function () {
    var pos_adjust = {x: 0, y: 0, time: 0}, pos_change = {x: 0, y: 0, time: 0},
      swipe = !1, swipe_direction = "";
    if (TL.Browser.touch) {
    }
    pos_adjust.time = (new Date().getTime() - this.data.time.start) * 10;
    pos_change.time = (new Date().getTime() - this.data.time.start) * 10;
    pos_change.x = this.options.momentum_multiplier * (Math.abs(this.data.pagex.end) - Math.abs(this.data.pagex.start));
    pos_change.y = this.options.momentum_multiplier * (Math.abs(this.data.pagey.end) - Math.abs(this.data.pagey.start));
    pos_adjust.x = Math.round(pos_change.x / pos_change.time);
    pos_adjust.y = Math.round(pos_change.y / pos_change.time);
    this.data.new_pos.x = Math.min(this.data.pos.end.x + pos_adjust.x);
    this.data.new_pos.y = Math.min(this.data.pos.end.y + pos_adjust.y);
    if (!this.options.enable.x) {
      this.data.new_pos.x = this.data.pos.start.x
    }
    else if (this.data.new_pos.x < 0) {
      this.data.new_pos.x = 0
    }
    if (!this.options.enable.y) {
      this.data.new_pos.y = this.data.pos.start.y
    }
    else if (this.data.new_pos.y < 0) {
      this.data.new_pos.y = 0
    }
    if (pos_change.time < 3000) {
      swipe = !0
    }
    if (Math.abs(pos_change.x) > 10000) {
      this.data.direction = "left";
      if (pos_change.x > 0) {
        this.data.direction = "right"
      }
    }
    if (Math.abs(pos_change.y) > 10000) {
      this.data.direction = "up";
      if (pos_change.y > 0) {
        this.data.direction = "down"
      }
    }
    this._animateMomentum();
    if (swipe) {
      this.fire("swipe_" + this.data.direction, this.data)
    }
  },
  _animateMomentum: function () {
    var pos = {x: this.data.new_pos.x, y: this.data.new_pos.y}, animate = {
      duration: this.options.duration,
      easing: TL.Ease.easeOutStrong
    };
    if (this.options.enable.y) {
      if (this.options.constraint.top || this.options.constraint.bottom) {
        if (pos.y > this.options.constraint.bottom) {
          pos.y = this.options.constraint.bottom
        }
        else if (pos.y < this.options.constraint.top) {
          pos.y = this.options.constraint.top
        }
      }
      animate.top = Math.floor(pos.y) + "px"
    }
    if (this.options.enable.x) {
      if (this.options.constraint.left || this.options.constraint.right) {
        if (pos.x > this.options.constraint.left) {
          pos.x = this.options.constraint.left
        }
        else if (pos.x < this.options.constraint.right) {
          pos.x = this.options.constraint.right
        }
      }
      animate.left = Math.floor(pos.x) + "px"
    }
    this.animator = TL.Animate(this._el.move, animate);
    this.fire("momentum", this.data)
  }
});
TL.Swipable = TL.Class.extend({
  includes: TL.Events,
  _el: {},
  mousedrag: {
    down: "mousedown",
    up: "mouseup",
    leave: "mouseleave",
    move: "mousemove"
  },
  touchdrag: {
    down: "touchstart",
    up: "touchend",
    leave: "mouseleave",
    move: "touchmove"
  },
  initialize: function (drag_elem, move_elem, options) {
    this._el = {drag: drag_elem, move: drag_elem};
    if (move_elem) {
      this._el.move = move_elem
    }
    this.options = {
      snap: !1,
      enable: {x: !0, y: !0},
      constraint: {top: !1, bottom: !1, left: 0, right: !1},
      momentum_multiplier: 2000,
      duration: 1000,
      ease: TL.Ease.easeInOutQuint
    };
    this.animator = null;
    this.dragevent = this.mousedrag;
    if (TL.Browser.touch) {
      this.dragevent = this.touchdrag
    }
    this.data = {
      sliding: !1,
      direction: "none",
      pagex: {start: 0, end: 0},
      pagey: {start: 0, end: 0},
      pos: {start: {x: 0, y: 0}, end: {x: 0, y: 0}},
      new_pos: {x: 0, y: 0},
      new_pos_parent: {x: 0, y: 0},
      time: {start: 0, end: 0},
      touch: !1
    };
    TL.Util.mergeData(this.options, options)
  },
  enable: function (e) {
    TL.DomEvent.addListener(this._el.drag, this.dragevent.down, this._onDragStart, this);
    TL.DomEvent.addListener(this._el.drag, this.dragevent.up, this._onDragEnd, this);
    this.data.pos.start = 0;
    this._el.move.style.left = this.data.pos.start.x + "px";
    this._el.move.style.top = this.data.pos.start.y + "px";
    this._el.move.style.position = "absolute"
  },
  disable: function () {
    TL.DomEvent.removeListener(this._el.drag, this.dragevent.down, this._onDragStart, this);
    TL.DomEvent.removeListener(this._el.drag, this.dragevent.up, this._onDragEnd, this)
  },
  stopMomentum: function () {
    if (this.animator) {
      this.animator.stop()
    }
  },
  updateConstraint: function (c) {
    this.options.constraint = c
  },
  _onDragStart: function (e) {
    if (this.animator) {
      this.animator.stop()
    }
    if (TL.Browser.touch) {
      if (e.originalEvent) {
        this.data.pagex.start = e.originalEvent.touches[0].screenX;
        this.data.pagey.start = e.originalEvent.touches[0].screenY
      }
      else {
        this.data.pagex.start = e.targetTouches[0].screenX;
        this.data.pagey.start = e.targetTouches[0].screenY
      }
    }
    else {
      this.data.pagex.start = e.pageX;
      this.data.pagey.start = e.pageY
    }
    if (this.options.enable.x) {
    }
    if (this.options.enable.y) {
    }
    this.data.pos.start = {
      x: this._el.move.offsetLeft,
      y: this._el.move.offsetTop
    };
    this.data.time.start = new Date().getTime();
    this.fire("dragstart", this.data);
    TL.DomEvent.addListener(this._el.drag, this.dragevent.move, this._onDragMove, this);
    TL.DomEvent.addListener(this._el.drag, this.dragevent.leave, this._onDragEnd, this)
  },
  _onDragEnd: function (e) {
    this.data.sliding = !1;
    TL.DomEvent.removeListener(this._el.drag, this.dragevent.move, this._onDragMove, this);
    TL.DomEvent.removeListener(this._el.drag, this.dragevent.leave, this._onDragEnd, this);
    this.fire("dragend", this.data);
    this._momentum()
  },
  _onDragMove: function (e) {
    var change = {x: 0, y: 0}
    this.data.sliding = !0;
    if (TL.Browser.touch) {
      if (e.originalEvent) {
        this.data.pagex.end = e.originalEvent.touches[0].screenX;
        this.data.pagey.end = e.originalEvent.touches[0].screenY
      }
      else {
        this.data.pagex.end = e.targetTouches[0].screenX;
        this.data.pagey.end = e.targetTouches[0].screenY
      }
    }
    else {
      this.data.pagex.end = e.pageX;
      this.data.pagey.end = e.pageY
    }
    change.x = this.data.pagex.start - this.data.pagex.end;
    change.y = this.data.pagey.start - this.data.pagey.end;
    this.data.pos.end = {
      x: this._el.drag.offsetLeft,
      y: this._el.drag.offsetTop
    };
    this.data.new_pos.x = -(change.x - this.data.pos.start.x);
    this.data.new_pos.y = -(change.y - this.data.pos.start.y);
    if (this.options.enable.x && (Math.abs(change.x) > Math.abs(change.y))) {
      e.preventDefault();
      this._el.move.style.left = this.data.new_pos.x + "px"
    }
    if (this.options.enable.y && (Math.abs(change.y) > Math.abs(change.y))) {
      e.preventDefault();
      this._el.move.style.top = this.data.new_pos.y + "px"
    }
    this.fire("dragmove", this.data)
  },
  _momentum: function () {
    var pos_adjust = {x: 0, y: 0, time: 0}, pos_change = {x: 0, y: 0, time: 0},
      swipe_detect = {x: !1, y: !1}, swipe = !1, swipe_direction = "";
    this.data.direction = null;
    pos_adjust.time = (new Date().getTime() - this.data.time.start) * 10;
    pos_change.time = (new Date().getTime() - this.data.time.start) * 10;
    pos_change.x = this.options.momentum_multiplier * (Math.abs(this.data.pagex.end) - Math.abs(this.data.pagex.start));
    pos_change.y = this.options.momentum_multiplier * (Math.abs(this.data.pagey.end) - Math.abs(this.data.pagey.start));
    pos_adjust.x = Math.round(pos_change.x / pos_change.time);
    pos_adjust.y = Math.round(pos_change.y / pos_change.time);
    this.data.new_pos.x = Math.min(this.data.new_pos.x + pos_adjust.x);
    this.data.new_pos.y = Math.min(this.data.new_pos.y + pos_adjust.y);
    if (!this.options.enable.x) {
      this.data.new_pos.x = this.data.pos.start.x
    }
    else if (this.options.constraint.left && this.data.new_pos.x > this.options.constraint.left) {
      this.data.new_pos.x = this.options.constraint.left
    }
    if (!this.options.enable.y) {
      this.data.new_pos.y = this.data.pos.start.y
    }
    else if (this.data.new_pos.y < 0) {
      this.data.new_pos.y = 0
    }
    if (pos_change.time < 2000) {
      swipe = !0
    }
    if (this.options.enable.x && this.options.enable.y) {
      if (Math.abs(pos_change.x) > Math.abs(pos_change.y)) {
        swipe_detect.x = !0
      }
      else {
        swipe_detect.y = !0
      }
    }
    else if (this.options.enable.x) {
      if (Math.abs(pos_change.x) > Math.abs(pos_change.y)) {
        swipe_detect.x = !0
      }
    }
    else {
      if (Math.abs(pos_change.y) > Math.abs(pos_change.x)) {
        swipe_detect.y = !0
      }
    }
    if (swipe_detect.x) {
      if (Math.abs(pos_change.x) > (this._el.drag.offsetWidth / 2)) {
        swipe = !0
      }
      if (Math.abs(pos_change.x) > 10000) {
        this.data.direction = "left";
        if (pos_change.x > 0) {
          this.data.direction = "right"
        }
      }
    }
    if (swipe_detect.y) {
      if (Math.abs(pos_change.y) > (this._el.drag.offsetHeight / 2)) {
        swipe = !0
      }
      if (Math.abs(pos_change.y) > 10000) {
        this.data.direction = "up";
        if (pos_change.y > 0) {
          this.data.direction = "down"
        }
      }
    }
    if (pos_change.time < 1000) {
    }
    else {
      this._animateMomentum()
    }
    if (swipe && this.data.direction) {
      this.fire("swipe_" + this.data.direction, this.data)
    }
    else if (this.data.direction) {
      this.fire("swipe_nodirection", this.data)
    }
    else if (this.options.snap) {
      this.animator.stop();
      this.animator = TL.Animate(this._el.move, {
        top: this.data.pos.start.y,
        left: this.data.pos.start.x,
        duration: this.options.duration,
        easing: TL.Ease.easeOutStrong
      })
    }
  },
  _animateMomentum: function () {
    var pos = {x: this.data.new_pos.x, y: this.data.new_pos.y}, animate = {
      duration: this.options.duration,
      easing: TL.Ease.easeOutStrong
    };
    if (this.options.enable.y) {
      if (this.options.constraint.top || this.options.constraint.bottom) {
        if (pos.y > this.options.constraint.bottom) {
          pos.y = this.options.constraint.bottom
        }
        else if (pos.y < this.options.constraint.top) {
          pos.y = this.options.constraint.top
        }
      }
      animate.top = Math.floor(pos.y) + "px"
    }
    if (this.options.enable.x) {
      if (this.options.constraint.left && pos.x >= this.options.constraint.left) {
        pos.x = this.options.constraint.left
      }
      if (this.options.constraint.right && pos.x < this.options.constraint.right) {
        pos.x = this.options.constraint.right
      }
      animate.left = Math.floor(pos.x) + "px"
    }
    this.animator = TL.Animate(this._el.move, animate);
    this.fire("momentum", this.data)
  }
});
TL.MenuBar = TL.Class.extend({
  includes: [TL.Events, TL.DomMixins],
  _el: {},
  initialize: function (elem, parent_elem, options) {
    this._el = {
      parent: {},
      container: {},
      button_backtostart: {},
      button_zoomin: {},
      button_zoomout: {},
      arrow: {},
      line: {},
      coverbar: {},
      grip: {}
    };
    this.collapsed = !1;
    if (typeof elem === 'object') {
      this._el.container = elem
    }
    else {
      this._el.container = TL.Dom.get(elem)
    }
    if (parent_elem) {
      this._el.parent = parent_elem
    }
    this.options = {
      width: 600,
      height: 600,
      duration: 1000,
      ease: TL.Ease.easeInOutQuint,
      menubar_default_y: 0
    };
    this.animator = {};
    TL.Util.mergeData(this.options, options);
    this._initLayout();
    this._initEvents()
  },
  show: function (d) {
    var duration = this.options.duration;
    if (d) {
      duration = d
    }
  },
  hide: function (top) {
  },
  toogleZoomIn: function (show) {
    if (show) {
      TL.DomUtil.removeClass(this._el.button_zoomin, 'tl-menubar-button-inactive')
    }
    else {
      TL.DomUtil.addClass(this._el.button_zoomin, 'tl-menubar-button-inactive')
    }
  },
  toogleZoomOut: function (show) {
    if (show) {
      TL.DomUtil.removeClass(this._el.button_zoomout, 'tl-menubar-button-inactive')
    }
    else {
      TL.DomUtil.addClass(this._el.button_zoomout, 'tl-menubar-button-inactive')
    }
  },
  setSticky: function (y) {
    this.options.menubar_default_y = y
  },
  setColor: function (inverted) {
    if (inverted) {
      this._el.container.className = 'tl-menubar tl-menubar-inverted'
    }
    else {
      this._el.container.className = 'tl-menubar'
    }
  },
  updateDisplay: function (w, h, a, l) {
    this._updateDisplay(w, h, a, l)
  },
  _onButtonZoomIn: function (e) {
    this.fire("zoom_in", e)
  },
  _onButtonZoomOut: function (e) {
    this.fire("zoom_out", e)
  },
  _onButtonBackToStart: function (e) {
    this.fire("back_to_start", e)
  },
  _initLayout: function () {
    this._el.button_zoomin = TL.Dom.create('span', 'tl-menubar-button', this._el.container);
    this._el.button_zoomout = TL.Dom.create('span', 'tl-menubar-button', this._el.container);
    this._el.button_backtostart = TL.Dom.create('span', 'tl-menubar-button', this._el.container);
    if (TL.Browser.mobile) {
      this._el.container.setAttribute("ontouchstart", " ")
    }
    this._el.button_backtostart.innerHTML = "<span class='tl-icon-goback'></span>";
    this._el.button_zoomin.innerHTML = "<span class='tl-icon-zoom-in'></span>";
    this._el.button_zoomout.innerHTML = "<span class='tl-icon-zoom-out'></span>"
  },
  _initEvents: function () {
    TL.DomEvent.addListener(this._el.button_backtostart, 'click', this._onButtonBackToStart, this);
    TL.DomEvent.addListener(this._el.button_zoomin, 'click', this._onButtonZoomIn, this);
    TL.DomEvent.addListener(this._el.button_zoomout, 'click', this._onButtonZoomOut, this)
  },
  _updateDisplay: function (width, height, animate) {
    if (width) {
      this.options.width = width
    }
    if (height) {
      this.options.height = height
    }
  }
});
TL.Message = TL.Class.extend({
  includes: [TL.Events, TL.DomMixins, TL.I18NMixins],
  _el: {},
  initialize: function (data, options, add_to_container) {
    this._el = {
      parent: {},
      container: {},
      message_container: {},
      loading_icon: {},
      message: {}
    };
    this.options = {
      width: 600,
      height: 600,
      message_class: "tl-message",
      message_icon_class: "tl-loading-icon"
    };
    this._add_to_container = add_to_container || {};
    TL.Util.mergeData(this.data, data);
    TL.Util.mergeData(this.options, options);
    this._el.container = TL.Dom.create("div", this.options.message_class);
    if (add_to_container) {
      add_to_container.appendChild(this._el.container);
      this._el.parent = add_to_container
    }
    this.animator = {};
    this._initLayout();
    this._initEvents()
  },
  updateMessage: function (t) {
    this._updateMessage(t)
  },
  updateDisplay: function (w, h) {
    this._updateDisplay(w, h)
  },
  _updateMessage: function (t) {
    if (!t) {
      this._el.message.innerHTML = this._('loading')
    }
    else {
      this._el.message.innerHTML = t
    }
    if (!this._el.parent.atrributes && this._add_to_container.attributes) {
      this._add_to_container.appendChild(this._el.container);
      this._el.parent = this._add_to_container
    }
  },
  _onMouseClick: function () {
    this.fire("clicked", this.options)
  },
  _onRemove: function () {
    this._el.parent = {}
  },
  _initLayout: function () {
    this._el.message_container = TL.Dom.create("div", "tl-message-container", this._el.container);
    this._el.loading_icon = TL.Dom.create("div", this.options.message_icon_class, this._el.message_container);
    this._el.message = TL.Dom.create("div", "tl-message-content", this._el.message_container);
    this._updateMessage()
  },
  _initEvents: function () {
    TL.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
    TL.DomEvent.addListener(this, 'removed', this._onRemove, this)
  },
  _updateDisplay: function (width, height, animate) {
  }
});
TL.MediaType = function (m, image_only) {
  var media = {}, media_types = [{
    type: "youtube",
    name: "YouTube",
    match_str: "^(https?:)?\/*(www.)?youtube|youtu\.be",
    cls: TL.Media.YouTube
  }, {
    type: "vimeo",
    name: "Vimeo",
    match_str: "^(https?:)?\/*(player.)?vimeo\.com",
    cls: TL.Media.Vimeo
  }, {
    type: "dailymotion",
    name: "DailyMotion",
    match_str: "^(https?:)?\/*(www.)?dailymotion\.com",
    cls: TL.Media.DailyMotion
  }, {
    type: "vine",
    name: "Vine",
    match_str: "^(https?:)?\/*(www.)?vine\.co",
    cls: TL.Media.Vine
  }, {
    type: "soundcloud",
    name: "SoundCloud",
    match_str: "^(https?:)?\/*(player.)?soundcloud\.com",
    cls: TL.Media.SoundCloud
  }, {
    type: "twitter",
    name: "Twitter",
    match_str: "^(https?:)?\/*(www.)?twitter\.com",
    cls: TL.Media.Twitter
  }, {
    type: "twitterembed",
    name: "TwitterEmbed",
    match_str: "<blockquote class=\"twitter-tweet\"",
    cls: TL.Media.TwitterEmbed
  }, {
    type: "googlemaps",
    name: "Google Map",
    match_str: /google.+?\/maps\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/search\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/place\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/dir\/([\w\W]+)\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)/,
    cls: TL.Media.GoogleMap
  }, {
    type: "googleplus",
    name: "Google+",
    match_str: "^(https?:)?\/*plus.google",
    cls: TL.Media.GooglePlus
  }, {
    type: "flickr",
    name: "Flickr",
    match_str: "^(https?:)?\/*(www.)?flickr.com\/photos",
    cls: TL.Media.Flickr
  }, {
    type: "flickr",
    name: "Flickr",
    match_str: "^(https?:\/\/)?flic.kr\/.*",
    cls: TL.Media.Flickr
  }, {
    type: "instagram",
    name: "Instagram",
    match_str: /^(https?:)?\/*(www.)?(instagr.am|^(https?:)?\/*(www.)?instagram.com)\/p\//,
    cls: TL.Media.Instagram
  }, {
    type: "profile",
    name: "Profile",
    match_str: /^(https?:)?\/*(www.)?instagr.am\/[a-zA-Z0-9]{2,}|^(https?:)?\/*(www.)?instagram.com\/[a-zA-Z0-9]{2,}/,
    cls: TL.Media.Profile
  }, {
    type: "documentcloud",
    name: "Document Cloud",
    match_str: /documentcloud.org\//,
    cls: TL.Media.DocumentCloud
  }, {
    type: "image",
    name: "Image",
    match_str: /(jpg|jpeg|png|gif|svg)(\?.*)?$/i,
    cls: TL.Media.Image
  }, {
    type: "imgur",
    name: "Imgur",
    match_str: /^.*imgur.com\/.+$/i,
    cls: TL.Media.Imgur
  }, {
    type: "googledocs",
    name: "Google Doc",
    match_str: "^(https?:)?\/*[^.]*.google.com\/[^\/]*\/d\/[^\/]*\/[^\/]*\?usp=sharing|^(https?:)?\/*drive.google.com\/open\?id=[^\&]*\&authuser=0|^(https?:)?\/*drive.google.com\/open\?id=[^\&]*|^(https?:)?\/*[^.]*.googledrive.com\/host\/[^\/]*\/",
    cls: TL.Media.GoogleDoc
  }, {
    type: "pdf",
    name: "PDF",
    match_str: /^.*\.pdf(\?.*)?(\#.*)?/,
    cls: TL.Media.PDF
  }, {
    type: "wikipedia",
    name: "Wikipedia",
    match_str: "^(https?:)?\/*(www.)?wikipedia\.org|^(https?:)?\/*([a-z][a-z].)?wikipedia\.org",
    cls: TL.Media.Wikipedia
  }, {
    type: "spotify",
    name: "spotify",
    match_str: "spotify",
    cls: TL.Media.Spotify
  }, {
    type: "iframe",
    name: "iFrame",
    match_str: "iframe",
    cls: TL.Media.IFrame
  }, {
    type: "storify",
    name: "Storify",
    match_str: "storify",
    cls: TL.Media.Storify
  }, {
    type: "blockquote",
    name: "Quote",
    match_str: "blockquote",
    cls: TL.Media.Blockquote
  }, {
    type: "imageblank",
    name: "Imageblank",
    match_str: "",
    cls: TL.Media.Image
  }];
  if (image_only) {
    if (m instanceof Array) {
      return !1
    }
    for (var i = 0; i < media_types.length; i++) {
      switch (media_types[i].type) {
        case "flickr":
        case "image":
        case "imgur":
        case "instagram":
          if (m.url.match(media_types[i].match_str)) {
            media = media_types[i];
            return media
          }
          break;
        default:
          break
      }
    }
  }
  else {
    for (var i = 0; i < media_types.length; i++) {
      if (m instanceof Array) {
        return media = {type: "slider", cls: TL.Media.Slider}
      }
      else if (m.url.match(media_types[i].match_str)) {
        media = media_types[i];
        return media
      }
    }
  }
  return !1
}
TL.Media = TL.Class.extend({
  includes: [TL.Events, TL.I18NMixins],
  _el: {},
  initialize: function (data, options, add_to_container) {
    this._el = {
      container: {},
      content_container: {},
      content: {},
      content_item: {},
      content_link: {},
      caption: null,
      credit: null,
      parent: {},
      link: null
    };
    this.player = null;
    this.timer = null;
    this.load_timer = null;
    this.message = null;
    this.media_id = null;
    this._state = {loaded: !1, show_meta: !1, media_loaded: !1};
    this.data = {
      unique_id: null,
      url: null,
      credit: null,
      caption: null,
      credit_alternate: null,
      caption_alternate: null,
      link: null,
      link_target: null
    };
    this.options = {
      api_key_flickr: "f2cc870b4d233dd0a5bfe73fd0d64ef0",
      api_key_googlemaps: "AIzaSyB9dW8e_iRrATFa8g24qB6BDBGdkrLDZYI",
      api_key_embedly: "",
      credit_height: 0,
      caption_height: 0,
      background: 0
    };
    this.animator = {};
    TL.Util.mergeData(this.options, options);
    TL.Util.mergeData(this.data, data);
    if (!this.options.background) {
      this._el.container = TL.Dom.create("div", "tl-media");
      if (this.data.unique_id) {
        this._el.container.id = this.data.unique_id
      }
      this._initLayout();
      if (add_to_container) {
        add_to_container.appendChild(this._el.container);
        this._el.parent = add_to_container
      }
    }
  },
  loadMedia: function () {
    var self = this;
    if (!this._state.loaded) {
      try {
        this.load_timer = setTimeout(function () {
          self.loadingMessage();
          self._loadMedia();
          self._updateDisplay()
        }, 1200)
      }
      catch (e) {
        trace("Error loading media for ", this._media);
        trace(e)
      }
    }
  },
  _updateMessage: function (msg) {
    if (this.message) {
      this.message.updateMessage(msg)
    }
  },
  loadingMessage: function () {
    this._updateMessage(this._('loading') + " " + this.options.media_name)
  },
  errorMessage: function (msg) {
    if (msg) {
      msg = this._('error') + ": " + msg
    }
    else {
      msg = this._('error')
    }
    this._updateMessage(msg)
  },
  updateMediaDisplay: function (layout) {
    if (this._state.loaded && !this.options.background) {
      if (TL.Browser.mobile) {
        this._el.content_item.style.maxHeight = (this.options.height / 2) + "px"
      }
      else {
        this._el.content_item.style.maxHeight = this.options.height - this.options.credit_height - this.options.caption_height - 30 + "px"
      }
      this._el.container.style.maxWidth = this.options.width + "px";
      if (TL.Browser.firefox) {
        if (this._el.content_item.offsetWidth > this._el.content_item.offsetHeight) {
        }
      }
      this._updateMediaDisplay(layout);
      if (this._state.media_loaded) {
        if (this._el.credit) {
          this._el.credit.style.width = this._el.content_item.offsetWidth + "px"
        }
        if (this._el.caption) {
          this._el.caption.style.width = this._el.content_item.offsetWidth + "px"
        }
      }
    }
  },
  _loadMedia: function () {
    this.onLoaded()
  },
  _updateMediaDisplay: function (l) {
    if (TL.Browser.firefox) {
      this._el.content_item.style.maxWidth = this.options.width + "px";
      this._el.content_item.style.width = "auto"
    }
  },
  _getMeta: function () {
  },
  _getImageURL: function (w, h) {
    return ""
  },
  show: function () {
  },
  hide: function () {
  },
  addTo: function (container) {
    container.appendChild(this._el.container);
    this.onAdd()
  },
  removeFrom: function (container) {
    container.removeChild(this._el.container);
    this.onRemove()
  },
  getImageURL: function (w, h) {
    return this._getImageURL(w, h)
  },
  updateDisplay: function (w, h, l) {
    this._updateDisplay(w, h, l)
  },
  stopMedia: function () {
    this._stopMedia()
  },
  loadErrorDisplay: function (message) {
    try {
      this._el.content.removeChild(this._el.content_item)
    }
    catch (e) {
    }
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-loaderror", this._el.content);
    this._el.content_item.innerHTML = "<div class='tl-icon-" + this.options.media_type + "'></div><p>" + message + "</p>";
    this.onLoaded(!0)
  },
  onLoaded: function (error) {
    this._state.loaded = !0;
    this.fire("loaded", this.data);
    if (this.message) {
      this.message.hide()
    }
    if (!(error || this.options.background)) {
      this.showMeta()
    }
    this.updateDisplay()
  },
  onMediaLoaded: function (e) {
    this._state.media_loaded = !0;
    this.fire("media_loaded", this.data);
    if (this._el.credit) {
      this._el.credit.style.width = this._el.content_item.offsetWidth + "px"
    }
    if (this._el.caption) {
      this._el.caption.style.width = this._el.content_item.offsetWidth + "px"
    }
  },
  showMeta: function (credit, caption) {
    this._state.show_meta = !0;
    if (this.data.credit && this.data.credit != "") {
      this._el.credit = TL.Dom.create("div", "tl-credit", this._el.content_container);
      this._el.credit.innerHTML = this.options.autolink == !0 ? TL.Util.linkify(this.data.credit) : this.data.credit;
      this.options.credit_height = this._el.credit.offsetHeight
    }
    if (this.data.caption && this.data.caption != "") {
      this._el.caption = TL.Dom.create("div", "tl-caption", this._el.content_container);
      this._el.caption.innerHTML = this.options.autolink == !0 ? TL.Util.linkify(this.data.caption) : this.data.caption;
      this.options.caption_height = this._el.caption.offsetHeight
    }
    if (!this.data.caption || !this.data.credit) {
      this.getMeta()
    }
  },
  getMeta: function () {
    this._getMeta()
  },
  updateMeta: function () {
    if (!this.data.credit && this.data.credit_alternate) {
      this._el.credit = TL.Dom.create("div", "tl-credit", this._el.content_container);
      this._el.credit.innerHTML = this.data.credit_alternate;
      this.options.credit_height = this._el.credit.offsetHeight
    }
    if (!this.data.caption && this.data.caption_alternate) {
      this._el.caption = TL.Dom.create("div", "tl-caption", this._el.content_container);
      this._el.caption.innerHTML = this.data.caption_alternate;
      this.options.caption_height = this._el.caption.offsetHeight
    }
    this.updateDisplay()
  },
  onAdd: function () {
    this.fire("added", this.data)
  },
  onRemove: function () {
    this.fire("removed", this.data)
  },
  _initLayout: function () {
    this.message = new TL.Message({}, this.options);
    this.message.addTo(this._el.container);
    this._el.content_container = TL.Dom.create("div", "tl-media-content-container", this._el.container);
    if (this.data.link && this.data.link != "") {
      this._el.link = TL.Dom.create("a", "tl-media-link", this._el.content_container);
      this._el.link.href = this.data.link;
      if (this.data.link_target && this.data.link_target != "") {
        this._el.link.target = this.data.link_target
      }
      else {
        this._el.link.target = "_blank"
      }
      this._el.content = TL.Dom.create("div", "tl-media-content", this._el.link)
    }
    else {
      this._el.content = TL.Dom.create("div", "tl-media-content", this._el.content_container)
    }
  },
  _updateDisplay: function (w, h, l) {
    if (w) {
      this.options.width = w
    }
    if (h) {
      this.options.height = h
    }
    if (l) {
      this.options.layout = l
    }
    if (this._el.credit) {
      this.options.credit_height = this._el.credit.offsetHeight
    }
    if (this._el.caption) {
      this.options.caption_height = this._el.caption.offsetHeight + 5
    }
    this.updateMediaDisplay(this.options.layout)
  },
  _stopMedia: function () {
  }
});
TL.Media.Blockquote = TL.Media.extend({
  includes: [TL.Events],
  _loadMedia: function () {
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-blockquote", this._el.content);
    this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";
    this.media_id = this.data.url;
    this._el.content_item.innerHTML = this.media_id;
    this.onLoaded()
  },
  updateMediaDisplay: function () {
  },
  _updateMediaDisplay: function () {
  }
});
TL.Media.DailyMotion = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var api_url, self = this;
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-dailymotion", this._el.content);
    if (this.data.url.match("video")) {
      this.media_id = this.data.url.split("video\/")[1].split(/[?&]/)[0]
    }
    else {
      this.media_id = this.data.url.split("embed\/")[1].split(/[?&]/)[0]
    }
    api_url = "https://www.dailymotion.com/embed/video/" + this.media_id + "?api=postMessage";
    this._el.content_item.innerHTML = "<iframe autostart='false' frameborder='0' width='100%' height='100%' src='" + api_url + "'></iframe>"
    this.onLoaded()
  }, _updateMediaDisplay: function () {
    this._el.content_item.style.height = TL.Util.ratio.r16_9({w: this._el.content_item.offsetWidth}) + "px"
  }, _stopMedia: function () {
    this._el.content_item.querySelector("iframe").contentWindow.postMessage('{"command":"pause","parameters":[]}', "*")
  }
});
TL.Media.DocumentCloud = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var self = this;
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-documentcloud tl-media-shadow", this._el.content);
    this._el.content_item.id = TL.Util.unique_ID(7)
    if (this.data.url.match(/\.html$/)) {
      this.data.url = this._transformURL(this.data.url)
    }
    else if (!(this.data.url.match(/.(json|js)$/))) {
      trace("DOCUMENT CLOUD IN URL BUT INVALID SUFFIX")
    }
    TL.Load.js(['https://assets.documentcloud.org/viewer/loader.js', 'https://assets.documentcloud.org/viewer/viewer.js'], function () {
      self.createMedia()
    })
  }, _transformURL: function (url) {
    return url.replace(/(.*)\.html$/, '$1.js')
  }, _updateMediaDisplay: function () {
    this._el.content_item.style.height = this.options.height + "px"
  }, createMedia: function () {
    DV.load(this.data.url, {
      container: '#' + this._el.content_item.id,
      showSidebar: !1
    });
    this.onLoaded()
  },
});
TL.Media.Flickr = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var api_url, self = this;
    try {
      this.establishMediaID();
      api_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + this.options.api_key_flickr + "&photo_id=" + this.media_id + "&format=json&jsoncallback=?";
      TL.getJSON(api_url, function (d) {
        if (d.stat == "ok") {
          self.sizes = d.sizes.size;
          if (!self.options.background) {
            self.createMedia()
          }
          self.onLoaded()
        }
        else {
          self.loadErrorDisplay(self._("flickr_notfound_err"))
        }
      })
    }
    catch (e) {
      self.loadErrorDisplay(self._(e.message_key))
    }
  }, establishMediaID: function () {
    if (this.data.url.match(/flic.kr\/.+/i)) {
      var encoded = this.data.url.split('/').slice(-1)[0];
      this.media_id = TL.Util.base58.decode(encoded)
    }
    else {
      var marker = 'flickr.com/photos/';
      var idx = this.data.url.indexOf(marker);
      if (idx == -1) {
        throw new TL.Error("flickr_invalidurl_err")
      }
      var pos = idx + marker.length;
      this.media_id = this.data.url.substr(pos).split("/")[1]
    }
  }, createMedia: function () {
    var self = this;
    this._el.content_link = TL.Dom.create("a", "", this._el.content);
    this._el.content_link.href = this.data.url;
    this._el.content_link.target = "_blank";
    this._el.content_item = TL.Dom.create("img", "tl-media-item tl-media-image tl-media-flickr tl-media-shadow", this._el.content_link);
    this._el.content_item.addEventListener('load', function (e) {
      self.onMediaLoaded()
    });
    this._el.content_item.src = this.getImageURL(this.options.width, this.options.height)
  }, getImageURL: function (w, h) {
    var best_size = this.size_label(h),
      source = this.sizes[this.sizes.length - 2].source;
    for (var i = 0; i < this.sizes.length; i++) {
      if (this.sizes[i].label == best_size) {
        source = this.sizes[i].source
      }
    }
    return source
  }, _getMeta: function () {
    var self = this, api_url;
    api_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=" + this.options.api_key_flickr + "&photo_id=" + this.media_id + "&format=json&jsoncallback=?";
    TL.getJSON(api_url, function (d) {
      self.data.credit_alternate = "<a href='" + self.data.url + "' target='_blank'>" + d.photo.owner.realname + "</a>";
      self.data.caption_alternate = d.photo.title._content + " " + d.photo.description._content;
      self.updateMeta()
    })
  }, size_label: function (s) {
    var _size = "";
    if (s <= 75) {
      if (s <= 0) {
        _size = "Large"
      }
      else {
        _size = "Thumbnail"
      }
    }
    else if (s <= 180) {
      _size = "Small"
    }
    else if (s <= 240) {
      _size = "Small 320"
    }
    else if (s <= 375) {
      _size = "Medium"
    }
    else if (s <= 480) {
      _size = "Medium 640"
    }
    else if (s <= 600) {
      _size = "Large"
    }
    else {
      _size = "Large"
    }
    return _size
  }
});
TL.Media.GoogleDoc = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var url, self = this;
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-iframe", this._el.content);
    if (this.data.url.match("open\?id\=")) {
      this.media_id = this.data.url.split("open\?id\=")[1];
      if (this.data.url.match("\&authuser\=0")) {
        url = this.media_id.match("\&authuser\=0")[0]
      }
    }
    else if (this.data.url.match(/file\/d\/([^/]*)\/?/)) {
      var doc_id = this.data.url.match(/file\/d\/([^/]*)\/?/)[1];
      url = 'https://drive.google.com/file/d/' + doc_id + '/preview'
    }
    else {
      url = this.data.url
    }
    this._el.content_item.innerHTML = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + url + "'></iframe>";
    this.onLoaded()
  }, _updateMediaDisplay: function () {
    this._el.content_item.style.height = this.options.height + "px"
  }
});
TL.Media.GooglePlus = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var api_url, self = this;
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-googleplus", this._el.content);
    this.media_id = this.data.url;
    api_url = this.media_id;
    this._el.content_item.innerHTML = "<iframe frameborder='0' width='100%' height='100%' src='" + api_url + "'></iframe>"
    this.onLoaded()
  }, _updateMediaDisplay: function () {
    this._el.content_item.style.height = this.options.height + "px"
  }
});
TL.Media.IFrame = TL.Media.extend({
  includes: [TL.Events],
  _loadMedia: function () {
    var api_url, self = this;
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-iframe", this._el.content);
    this.media_id = this.data.url;
    api_url = this.media_id;
    this._el.content_item.innerHTML = api_url;
    this.onLoaded()
  },
  _updateMediaDisplay: function () {
    this._el.content_item.style.height = this.options.height + "px"
  }
});
TL.Media.Image = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    this.loadingMessage();
    if (!this.options.background) {
      this.createMedia()
    }
    this.onLoaded()
  }, createMedia: function () {
    var self = this,
      image_class = "tl-media-item tl-media-image tl-media-shadow";
    if (this.data.url.match(/.png(\?.*)?$/) || this.data.url.match(/.svg(\?.*)?$/)) {
      image_class = "tl-media-item tl-media-image"
    }
    if (this.data.link) {
      this._el.content_link = TL.Dom.create("a", "", this._el.content);
      this._el.content_link.href = this.data.link;
      this._el.content_link.target = "_blank";
      this._el.content_item = TL.Dom.create("img", image_class, this._el.content_link)
    }
    else {
      this._el.content_item = TL.Dom.create("img", image_class, this._el.content)
    }
    this._el.content_item.addEventListener('load', function (e) {
      self.onMediaLoaded()
    });
    this._el.content_item.src = this.getImageURL()
  }, getImageURL: function (w, h) {
    return TL.Util.transformImageURL(this.data.url)
  }, _updateMediaDisplay: function (layout) {
    if (TL.Browser.firefox) {
      this._el.content_item.style.width = "auto"
    }
  }
});
TL.Media.Imgur = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    try {
      this.media_id = this.data.url.split('/').slice(-1)[0];
      if (!this.options.background) {
        this.createMedia()
      }
      this.onLoaded()
    }
    catch (e) {
      this.loadErrorDisplay(this._("imgur_invalidurl_err"))
    }
  }, createMedia: function () {
    var self = this;
    this._el.content_link = TL.Dom.create("a", "", this._el.content);
    this._el.content_link.href = this.data.url;
    this._el.content_link.target = "_blank";
    this._el.content_item = TL.Dom.create("img", "tl-media-item tl-media-image tl-media-imgur tl-media-shadow", this._el.content_link);
    this._el.content_item.addEventListener('load', function (e) {
      self.onMediaLoaded()
    });
    this._el.content_item.src = this.getImageURL()
  }, getImageURL: function (w, h) {
    return 'https://i.imgur.com/' + this.media_id + '.jpg'
  }
});
TL.Media.Instagram = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    this.media_id = this.data.url.split("\/p\/")[1].split("/")[0];
    if (!this.options.background) {
      this.createMedia()
    }
    this.onLoaded()
  }, createMedia: function () {
    var self = this;
    this._el.content_link = TL.Dom.create("a", "", this._el.content);
    this._el.content_link.href = this.data.url;
    this._el.content_link.target = "_blank";
    this._el.content_item = TL.Dom.create("img", "tl-media-item tl-media-image tl-media-instagram tl-media-shadow", this._el.content_link);
    this._el.content_item.addEventListener('load', function (e) {
      self.onMediaLoaded()
    });
    this._el.content_item.src = this.getImageURL(this._el.content.offsetWidth)
  }, getImageURL: function (w, h) {
    return "https://instagram.com/p/" + this.media_id + "/media/?size=" + this.sizes(w)
  }, _getMeta: function () {
    var self = this, api_url;
    api_url = "https://api.instagram.com/oembed?url=https://instagr.am/p/" + this.media_id + "&callback=?";
    TL.getJSON(api_url, function (d) {
      self.data.credit_alternate = "<a href='" + d.author_url + "' target='_blank'>" + d.author_name + "</a>";
      self.data.caption_alternate = d.title;
      self.updateMeta()
    })
  }, sizes: function (s) {
    var _size = "";
    if (s <= 150) {
      _size = "t"
    }
    else if (s <= 306) {
      _size = "m"
    }
    else {
      _size = "l"
    }
    return _size
  }
});
TL.Media.GoogleMap = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-map tl-media-shadow", this._el.content);
    this.media_id = this.data.url;
    this.mapframe = TL.Dom.create("iframe", "", this._el.content_item);
    window.stash = this;
    this.mapframe.width = "100%";
    this.mapframe.height = "100%";
    this.mapframe.frameBorder = "0";
    this.mapframe.src = this.makeGoogleMapsEmbedURL(this.media_id, this.options.api_key_googlemaps);
    this.onLoaded()
  }, _updateMediaDisplay: function () {
    if (this._state.loaded) {
      var dimensions = TL.Util.ratio.square({w: this._el.content_item.offsetWidth});
      this._el.content_item.style.height = dimensions.h + "px"
    }
  }, makeGoogleMapsEmbedURL: function (url, api_key) {
    var Streetview = !1;

    function determineMapMode(url) {
      function parseDisplayMode(display_mode, param_string) {
        if (display_mode.slice(-1) == "z") {
          param_string.zoom = display_mode
        }
        else if (display_mode.slice(-1) == "m") {
          param_string.zoom = 14;
          param_string.maptype = "satellite"
        }
        else if (display_mode.slice(-1) == "t") {
          Streetview = !0;
          if (mapmode == "place") {
            var center = url.match(regexes.place)[3] + "," + url.match(regexes.place)[4]
          }
          else {
            var center = param_string.center;
            delete param_string.center
          }
          param_string = {};
          param_string.location = center;
          streetview_params = display_mode.split(",");
          for (param in param_defs.streetview) {
            var i = parseInt(param) + 1;
            if (param_defs.streetview[param] == "pitch" && streetview_params[i] == "90t") {
              param_string[param_defs.streetview[param]] = 0
            }
            else {
              param_string[param_defs.streetview[param]] = streetview_params[i].slice(0, -1)
            }
          }
        }
        return param_string
      }

      function determineMapModeURL(mapmode, match) {
        var param_string = {};
        var url_root = match[1], display_mode = match[match.length - 1];
        for (param in param_defs[mapmode]) {
          var i = parseInt(param) + 2;
          if (param_defs[mapmode][param] == "center") {
            param_string[param_defs[mapmode][param]] = match[i] + "," + match[++i]
          }
          else {
            param_string[param_defs[mapmode][param]] = match[i]
          }
        }
        param_string = parseDisplayMode(display_mode, param_string);
        param_string.key = api_key;
        if (Streetview == !0) {
          mapmode = "streetview"
        }
        else {
        }
        return (url_root + "/embed/v1/" + mapmode + TL.Util.getParamString(param_string))
      }

      mapmode = "view";
      if (url.match(regexes.place)) {
        mapmode = "place"
      }
      else if (url.match(regexes.directions)) {
        mapmode = "directions"
      }
      else if (url.match(regexes.search)) {
        mapmode = "search"
      }
      return determineMapModeURL(mapmode, url.match(regexes[mapmode]))
    }

    var param_defs = {
      "view": ["center"],
      "place": ["q", "center"],
      "directions": ["origin", "destination", "center"],
      "search": ["q", "center"],
      "streetview": ["fov", "heading", "pitch"]
    };
    var root_url_regex = /(https:\/\/.+google.+?\/maps)/;
    var coords_regex = /@([-\d.]+),([-\d.]+)/;
    var address_regex = /([\w\W]+)/;
    var data_regex = /data=[\S]*/;
    var display_mode_regex = /,((?:[-\d.]+[zmayht],?)*)/;
    var regexes = {
      view: new RegExp(root_url_regex.source + "/" + coords_regex.source + display_mode_regex.source),
      place: new RegExp(root_url_regex.source + "/place/" + address_regex.source + "/" + coords_regex.source + display_mode_regex.source),
      directions: new RegExp(root_url_regex.source + "/dir/" + address_regex.source + "/" + address_regex.source + "/" + coords_regex.source + display_mode_regex.source),
      search: new RegExp(root_url_regex.source + "/search/" + address_regex.source + "/" + coords_regex.source + display_mode_regex.source)
    };
    return determineMapMode(url)
  }
});
TL.Media.PDF = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var url = TL.Util.transformImageURL(this.data.url), self = this;
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-iframe", this._el.content);
    var markup = "";
    if (TL.Browser.ie || TL.Browser.edge || url.match(/dl.dropboxusercontent.com/)) {
      markup = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='//docs.google.com/viewer?url=" + url + "&amp;embedded=true'></iframe>"
    }
    else {
      markup = "<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + url + "'></iframe>"
    }
    this._el.content_item.innerHTML = markup
    this.onLoaded()
  }, _updateMediaDisplay: function () {
    this._el.content_item.style.height = this.options.height + "px"
  }
});
TL.Media.Profile = TL.Media.extend({
  includes: [TL.Events],
  _loadMedia: function () {
    this._el.content_item = TL.Dom.create("img", "tl-media-item tl-media-image tl-media-profile tl-media-shadow", this._el.content);
    this._el.content_item.src = this.data.url;
    this.onLoaded()
  },
  _updateMediaDisplay: function (layout) {
    if (TL.Browser.firefox) {
      this._el.content_item.style.maxWidth = (this.options.width / 2) - 40 + "px"
    }
  }
});
TL.Media.Slider = TL.Media.extend({
  includes: [TL.Events],
  _loadMedia: function () {
    this._el.content_item = TL.Dom.create("img", "tl-media-item tl-media-image", this._el.content);
    this._el.content_item.src = this.data.url;
    this.onLoaded()
  }
});
var soundCoudCreated = !1;
TL.Media.SoundCloud = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var api_url, self = this;
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-soundcloud tl-media-shadow", this._el.content);
    this.media_id = this.data.url;
    api_url = "https://soundcloud.com/oembed?url=" + this.media_id + "&format=js&callback=?"
    TL.getJSON(api_url, function (d) {
      TL.Load.js("https://w.soundcloud.com/player/api.js", function () {
        self.createMedia(d)
      })
    })
  }, createMedia: function (d) {
    this._el.content_item.innerHTML = d.html;
    this.soundCloudCreated = !0;
    self.widget = SC.Widget(this._el.content_item.querySelector("iframe"));
    this.onLoaded()
  }, _stopMedia: function () {
    if (this.soundCloudCreated) {
      self.widget.pause()
    }
  }
});
TL.Media.Spotify = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var api_url, self = this;
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-spotify", this._el.content);
    if (this.data.url.match(/^spotify:track/) || this.data.url.match(/^spotify:user:.+:playlist:/)) {
      this.media_id = this.data.url
    }
    if (this.data.url.match(/spotify.com\/track\/(.+)/)) {
      this.media_id = "spotify:track:" + this.data.url.match(/spotify.com\/track\/(.+)/)[1]
    }
    else if (this.data.url.match(/spotify.com\/user\/(.+?)\/playlist\/(.+)/)) {
      var user = this.data.url.match(/spotify.com\/user\/(.+?)\/playlist\/(.+)/)[1];
      var playlist = this.data.url.match(/spotify.com\/user\/(.+?)\/playlist\/(.+)/)[2];
      this.media_id = "spotify:user:" + user + ":playlist:" + playlist
    }
    if (this.media_id) {
      api_url = "https://embed.spotify.com/?uri=" + this.media_id + "&theme=white&view=coverart";
      this.player = TL.Dom.create("iframe", "tl-media-shadow", this._el.content_item);
      this.player.width = "100%";
      this.player.height = "100%";
      this.player.frameBorder = "0";
      this.player.src = api_url;
      this.onLoaded()
    }
    else {
      this.loadErrorDisplay(this._('spotify_invalid_url'))
    }
  }, _updateMediaDisplay: function (l) {
    var _height = this.options.height, _player_height = 0, _player_width = 0;
    if (TL.Browser.mobile) {
      _height = (this.options.height / 2)
    }
    else {
      _height = this.options.height - this.options.credit_height - this.options.caption_height - 30
    }
    this._el.content_item.style.maxHeight = "none";
    trace(_height);
    trace(this.options.width)
    if (_height > this.options.width) {
      trace("height is greater")
      _player_height = this.options.width + 80 + "px";
      _player_width = this.options.width + "px"
    }
    else {
      trace("width is greater")
      trace(this.options.width)
      _player_height = _height + "px";
      _player_width = _height - 80 + "px"
    }
    this.player.style.width = _player_width;
    this.player.style.height = _player_height;
    if (this._el.credit) {
      this._el.credit.style.width = _player_width
    }
    if (this._el.caption) {
      this._el.caption.style.width = _player_width
    }
  }, _stopMedia: function () {
  }
});
TL.Media.Storify = TL.Media.extend({
  includes: [TL.Events],
  _loadMedia: function () {
    var content;
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-storify", this._el.content);
    this.media_id = this.data.url;
    content = "<iframe frameborder='0' width='100%' height='100%' src='" + this.media_id + "/embed'></iframe>";
    content += "<script src='" + this.media_id + ".js'></script>";
    this._el.content_item.innerHTML = content;
    this.onLoaded()
  },
  _updateMediaDisplay: function () {
    this._el.content_item.style.height = this.options.height + "px"
  }
});
TL.Media.Text = TL.Class.extend({
  includes: [TL.Events],
  _el: {
    container: {},
    content_container: {},
    content: {},
    headline: {},
    date: {}
  },
  data: {unique_id: "", headline: "headline", text: "text"},
  options: {title: !1},
  initialize: function (data, options, add_to_container) {
    TL.Util.setData(this, data);
    TL.Util.mergeData(this.options, options);
    this._el.container = TL.Dom.create("div", "tl-text");
    this._el.container.id = this.data.unique_id;
    this._initLayout();
    if (add_to_container) {
      add_to_container.appendChild(this._el.container)
    }
  },
  show: function () {
  },
  hide: function () {
  },
  addTo: function (container) {
    container.appendChild(this._el.container)
  },
  removeFrom: function (container) {
    container.removeChild(this._el.container)
  },
  headlineHeight: function () {
    return this._el.headline.offsetHeight + 40
  },
  addDateText: function (str) {
    this._el.date.innerHTML = str
  },
  onLoaded: function () {
    this.fire("loaded", this.data)
  },
  onAdd: function () {
    this.fire("added", this.data)
  },
  onRemove: function () {
    this.fire("removed", this.data)
  },
  _initLayout: function () {
    this._el.content_container = TL.Dom.create("div", "tl-text-content-container", this._el.container);
    this._el.date = TL.Dom.create("h3", "tl-headline-date", this._el.content_container);
    if (this.data.headline != "") {
      var headline_class = "tl-headline";
      if (this.options.title) {
        headline_class = "tl-headline tl-headline-title"
      }
      this._el.headline = TL.Dom.create("h2", headline_class, this._el.content_container);
      this._el.headline.innerHTML = this.data.headline
    }
    if (this.data.text != "") {
      var text_content = "";
      text_content += TL.Util.htmlify(this.options.autolink == !0 ? TL.Util.linkify(this.data.text) : this.data.text);
      trace(this.data.text);
      this._el.content = TL.Dom.create("div", "tl-text-content", this._el.content_container);
      this._el.content.innerHTML = text_content;
      trace(text_content);
      trace(this._el.content)
    }
    this.onLoaded()
  }
});
TL.Media.Twitter = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var api_url, self = this;
    this._el.content_item = TL.Dom.create("div", "tl-media-twitter", this._el.content);
    this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";
    if (this.data.url.match("status\/")) {
      this.media_id = this.data.url.split("status\/")[1]
    }
    else if (this.data.url.match("statuses\/")) {
      this.media_id = this.data.url.split("statuses\/")[1]
    }
    else {
      this.media_id = ""
    }
    api_url = "https://api.twitter.com/1/statuses/oembed.json?id=" + this.media_id + "&omit_script=true&include_entities=true&callback=?";
    TL.ajax({
      type: 'GET',
      url: api_url,
      dataType: 'json',
      success: function (d) {
        self.createMedia(d)
      },
      error: function (xhr, type) {
        var error_text = "";
        error_text += self._("twitter_load_err") + "<br/>" + self.media_id + "<br/>" + type;
        self.loadErrorDisplay(error_text)
      }
    })
  }, createMedia: function (d) {
    var tweet = "", tweet_text = "", tweetuser = "", tweet_status_temp = "",
      tweet_status_url = "", tweet_status_date = "";
    tweet_text = d.html.split("<\/p>\&mdash;")[0] + "</p></blockquote>";
    tweetuser = d.author_url.split("twitter.com\/")[1];
    tweet_status_temp = d.html.split("<\/p>\&mdash;")[1].split("<a href=\"")[1];
    tweet_status_url = tweet_status_temp.split("\"\>")[0];
    tweet_status_date = tweet_status_temp.split("\"\>")[1].split("<\/a>")[0];
    tweet_text = tweet_text.replace(/<a href/ig, '<a class="tl-makelink" target="_blank" href');
    tweet += tweet_text;
    tweet += "<div class='vcard'>";
    tweet += "<a href='" + tweet_status_url + "' class='twitter-date' target='_blank'>" + tweet_status_date + "</a>";
    tweet += "<div class='author'>";
    tweet += "<a class='screen-name url' href='" + d.author_url + "' target='_blank'>";
    tweet += "<span class='avatar'></span>";
    tweet += "<span class='fn'>" + d.author_name + " <span class='tl-icon-twitter'></span></span>";
    tweet += "<span class='nickname'>@" + tweetuser + "<span class='thumbnail-inline'></span></span>";
    tweet += "</a>";
    tweet += "</div>";
    tweet += "</div>";
    this._el.content_item.innerHTML = tweet;
    this.onLoaded()
  }, updateMediaDisplay: function () {
  }, _updateMediaDisplay: function () {
  }
});
TL.Media.TwitterEmbed = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var api_url, self = this;
    this._el.content_item = TL.Dom.create("div", "tl-media-twitter", this._el.content);
    this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";
    var found = this.data.url.match(/(status|statuses)\/(\d+)/);
    if (found && found.length > 2) {
      this.media_id = found[2]
    }
    else {
      self.loadErrorDisplay(self._("twitterembed_invalidurl_err"));
      return
    }
    api_url = "https://api.twitter.com/1/statuses/oembed.json?id=" + this.media_id + "&omit_script=true&include_entities=true&callback=?";
    TL.ajax({
      type: 'GET',
      url: api_url,
      dataType: 'json',
      success: function (d) {
        self.createMedia(d)
      },
      error: function (xhr, type) {
        var error_text = "";
        error_text += self._("twitter_load_err") + "<br/>" + self.media_id + "<br/>" + type;
        self.loadErrorDisplay(error_text)
      }
    })
  }, createMedia: function (d) {
    trace("create_media")
    var tweet = "", tweet_text = "", tweetuser = "", tweet_status_temp = "",
      tweet_status_url = "", tweet_status_date = "";
    tweet_text = d.html.split("<\/p>\&mdash;")[0] + "</p></blockquote>";
    tweetuser = d.author_url.split("twitter.com\/")[1];
    tweet_status_temp = d.html.split("<\/p>\&mdash;")[1].split("<a href=\"")[1];
    tweet_status_url = tweet_status_temp.split("\"\>")[0];
    tweet_status_date = tweet_status_temp.split("\"\>")[1].split("<\/a>")[0];
    tweet_text = tweet_text.replace(/<a href/ig, '<a target="_blank" href');
    tweet += tweet_text;
    tweet += "<div class='vcard'>";
    tweet += "<a href='" + tweet_status_url + "' class='twitter-date' target='_blank'>" + tweet_status_date + "</a>";
    tweet += "<div class='author'>";
    tweet += "<a class='screen-name url' href='" + d.author_url + "' target='_blank'>";
    tweet += "<span class='avatar'></span>";
    tweet += "<span class='fn'>" + d.author_name + " <span class='tl-icon-twitter'></span></span>";
    tweet += "<span class='nickname'>@" + tweetuser + "<span class='thumbnail-inline'></span></span>";
    tweet += "</a>";
    tweet += "</div>";
    tweet += "</div>";
    this._el.content_item.innerHTML = tweet;
    this.onLoaded()
  }, updateMediaDisplay: function () {
  }, _updateMediaDisplay: function () {
  }
});
TL.Media.Vimeo = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var api_url, self = this;
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-vimeo tl-media-shadow", this._el.content);
    this.media_id = this.data.url.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
    api_url = "https://player.vimeo.com/video/" + this.media_id + "?api=1&title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff";
    this.player = TL.Dom.create("iframe", "", this._el.content_item);
    this.player.addEventListener('load', function (e) {
      self.onMediaLoaded()
    });
    this.player.width = "100%";
    this.player.height = "100%";
    this.player.frameBorder = "0";
    this.player.src = api_url;
    this.player.setAttribute('allowfullscreen', '');
    this.player.setAttribute('webkitallowfullscreen', '');
    this.player.setAttribute('mozallowfullscreen', '');
    this.onLoaded()
  }, _updateMediaDisplay: function () {
    this._el.content_item.style.height = TL.Util.ratio.r16_9({w: this._el.content_item.offsetWidth}) + "px"
  }, _stopMedia: function () {
    try {
      this.player.contentWindow.postMessage(JSON.stringify({method: "pause"}), "https://player.vimeo.com")
    }
    catch (err) {
      trace(err)
    }
  }
});
TL.Media.Vine = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var api_url, self = this;
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-iframe tl-media-vine tl-media-shadow", this._el.content);
    this.media_id = this.data.url.split("vine.co/v/")[1];
    api_url = "https://vine.co/v/" + this.media_id + "/embed/simple";
    this._el.content_item.innerHTML = "<iframe frameborder='0' width='100%' height='100%' src='" + api_url + "'></iframe><script async src='https://platform.vine.co/static/scripts/embed.js' charset='utf-8'></script>"
    this.onLoaded()
  }, _updateMediaDisplay: function () {
    var size = TL.Util.ratio.square({
      w: this._el.content_item.offsetWidth,
      h: this.options.height
    });
    this._el.content_item.style.height = size.h + "px"
  }, _stopMedia: function () {
    this._el.content_item.querySelector("iframe").contentWindow.postMessage('pause', '*')
  }
});
TL.Media.Website = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var self = this;
    this.media_id = this.data.url.replace(/.*?:\/\//g, "");
    if (this.options.api_key_embedly) {
      api_url = "https://api.embed.ly/1/extract?key=" + this.options.api_key_embedly + "&url=" + this.media_id + "&callback=?";
      TL.getJSON(api_url, function (d) {
        self.createMedia(d)
      })
    }
    else {
      this.createCardContent()
    }
  }, createCardContent: function () {
    (function (w, d) {
      var id = 'embedly-platform', n = 'script';
      if (!d.getElementById(id)) {
        w.embedly = w.embedly || function () {
          (w.embedly.q = w.embedly.q || []).push(arguments)
        };
        var e = d.createElement(n);
        e.id = id;
        e.async = 1;
        e.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://cdn.embedly.com/widgets/platform.js';
        var s = d.getElementsByTagName(n)[0];
        s.parentNode.insertBefore(e, s)
      }
    })(window, document);
    var content = "<a href=\"" + this.data.url + "\" class=\"embedly-card\">" + this.data.url + "</a>";
    this._setContent(content)
  }, createMedia: function (d) {
    var content = "";
    content += "<h4><a href='" + this.data.url + "' target='_blank'>" + d.title + "</a></h4>";
    if (d.images) {
      if (d.images[0]) {
        trace(d.images[0].url);
        content += "<img src='" + d.images[0].url + "' />"
      }
    }
    if (d.favicon_url) {
      content += "<img class='tl-media-website-icon' src='" + d.favicon_url + "' />"
    }
    content += "<span class='tl-media-website-description'>" + d.provider_name + "</span><br/>";
    content += "<p>" + d.description + "</p>";
    this._setContent(content)
  }, _setContent: function (content) {
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-website", this._el.content);
    this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";
    this._el.content_item.innerHTML = content;
    this.onLoaded()
  }, updateMediaDisplay: function () {
  }, _updateMediaDisplay: function () {
  }
});
TL.Media.Wikipedia = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var api_url, api_language, self = this;
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-wikipedia", this._el.content);
    this._el.content_container.className = "tl-media-content-container tl-media-content-container-text";
    this.media_id = this.data.url.split("wiki\/")[1].split("#")[0].replace("_", " ");
    this.media_id = this.media_id.replace(" ", "%20");
    api_language = this.data.url.split("//")[1].split(".wikipedia")[0];
    api_url = "https://" + api_language + ".wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&redirects=&titles=" + this.media_id + "&exintro=1&format=json&callback=?";
    TL.ajax({
      type: 'GET',
      url: api_url,
      dataType: 'json',
      success: function (d) {
        self.createMedia(d)
      },
      error: function (xhr, type) {
        var error_text = "";
        error_text += self._("wikipedia_load_err") + "<br/>" + self.media_id + "<br/>" + type;
        self.loadErrorDisplay(error_text)
      }
    })
  }, createMedia: function (d) {
    var wiki = "";
    if (d.query) {
      var content = "", wiki = {
        entry: {},
        title: "",
        text: "",
        extract: "",
        paragraphs: 1,
        page_image: "",
        text_array: []
      };
      wiki.entry = TL.Util.getObjectAttributeByIndex(d.query.pages, 0);
      wiki.extract = wiki.entry.extract;
      wiki.title = wiki.entry.title;
      wiki.page_image = wiki.entry.thumbnail;
      if (wiki.extract.match("<p>")) {
        wiki.text_array = wiki.extract.split("<p>")
      }
      else {
        wiki.text_array.push(wiki.extract)
      }
      for (var i = 0; i < wiki.text_array.length; i++) {
        if (i + 1 <= wiki.paragraphs && i + 1 < wiki.text_array.length) {
          wiki.text += "<p>" + wiki.text_array[i + 1]
        }
      }
      content += "<span class='tl-icon-wikipedia'></span>";
      content += "<div class='tl-wikipedia-title'><h4><a href='" + this.data.url + "' target='_blank'>" + wiki.title + "</a></h4>";
      content += "<span class='tl-wikipedia-source'>" + this._('wikipedia') + "</span></div>";
      if (wiki.page_image) {
      }
      content += wiki.text;
      if (wiki.extract.match("REDIRECT")) {
      }
      else {
        this._el.content_item.innerHTML = content;
        this.onLoaded()
      }
    }
  }, updateMediaDisplay: function () {
  }, _updateMediaDisplay: function () {
  }
});
TL.Media.YouTube = TL.Media.extend({
  includes: [TL.Events], _loadMedia: function () {
    var self = this, url_vars;
    this.youtube_loaded = !1;
    this._el.content_item = TL.Dom.create("div", "tl-media-item tl-media-youtube tl-media-shadow", this._el.content);
    this._el.content_item.id = TL.Util.unique_ID(7)
    url_vars = TL.Util.getUrlVars(this.data.url);
    this.media_id = {};
    if (this.data.url.match('v=')) {
      this.media_id.id = url_vars.v
    }
    else if (this.data.url.match('\/embed\/')) {
      this.media_id.id = this.data.url.split("embed\/")[1].split(/[?&]/)[0]
    }
    else if (this.data.url.match(/v\/|v=|youtu\.be\//)) {
      this.media_id.id = this.data.url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]
    }
    else {
      trace("YOUTUBE IN URL BUT NOT A VALID VIDEO")
    }
    this.media_id.start = parseInt(url_vars.start);
    if (isNaN(this.media_id.start)) {
      this.media_id.start = TL.Util.parseYouTubeTime(url_vars.t)
    }
    this.media_id.end = parseInt(url_vars.end);
    this.media_id.hd = Boolean(typeof (url_vars.hd) != 'undefined');
    TL.Load.js('https://www.youtube.com/iframe_api', function () {
      self.createMedia()
    })
  }, _updateMediaDisplay: function () {
    this._el.content_item.style.height = TL.Util.ratio.r16_9({w: this.options.width}) + "px";
    this._el.content_item.style.width = this.options.width + "px"
  }, _stopMedia: function () {
    if (this.youtube_loaded) {
      try {
        if (this.player.getPlayerState() == YT.PlayerState.PLAYING) {
          this.player.pauseVideo()
        }
      }
      catch (err) {
        trace(err)
      }
    }
  }, createMedia: function () {
    var self = this;
    clearTimeout(this.timer);
    if (typeof YT != 'undefined' && typeof YT.Player != 'undefined') {
      this.player = new YT.Player(this._el.content_item.id, {
        playerVars: {
          enablejsapi: 1,
          color: 'white',
          autohide: 1,
          showinfo: 0,
          theme: 'light',
          start: this.media_id.start,
          end: this.media_id.end,
          fs: 0,
          rel: 0
        }, videoId: this.media_id.id, events: {
          onReady: function () {
            self.onPlayerReady();
            self.onLoaded()
          }, 'onStateChange': self.onStateChange
        }
      })
    }
    else {
      this.timer = setTimeout(function () {
        self.createMedia()
      }, 1000)
    }
  }, onPlayerReady: function (e) {
    this.youtube_loaded = !0;
    this._el.content_item = document.getElementById(this._el.content_item.id);
    this.onMediaLoaded()
  }, onStateChange: function (e) {
    if (e.data == YT.PlayerState.ENDED) {
      e.target.seekTo(0);
      e.target.pauseVideo()
    }
  }
});
TL.Slide = TL.Class.extend({
  includes: [TL.Events, TL.DomMixins, TL.I18NMixins],
  _el: {},
  initialize: function (data, options, title_slide) {
    this._el = {
      container: {},
      scroll_container: {},
      background: {},
      content_container: {},
      content: {}
    };
    this._media = null;
    this._mediaclass = {};
    this._text = {};
    this._background_media = null;
    this._state = {loaded: !1};
    this.has = {
      headline: !1,
      text: !1,
      media: !1,
      title: !1,
      background: {image: !1, color: !1, color_value: ""}
    }
    this.has.title = title_slide;
    this.data = {
      unique_id: null,
      background: null,
      start_date: null,
      end_date: null,
      location: null,
      text: null,
      media: null,
      autolink: !0
    };
    this.options = {
      duration: 1000,
      slide_padding_lr: 40,
      ease: TL.Ease.easeInSpline,
      width: 600,
      height: 600,
      skinny_size: 650,
      media_name: ""
    };
    this.active = !1;
    this.animator = {};
    TL.Util.mergeData(this.options, options);
    TL.Util.mergeData(this.data, data);
    this._initLayout();
    this._initEvents()
  },
  show: function () {
    this.animator = TL.Animate(this._el.slider_container, {
      left: -(this._el.container.offsetWidth * n) + "px",
      duration: this.options.duration,
      easing: this.options.ease
    })
  },
  hide: function () {
  },
  setActive: function (is_active) {
    this.active = is_active;
    if (this.active) {
      if (this.data.background) {
        this.fire("background_change", this.has.background)
      }
      this.loadMedia()
    }
    else {
      this.stopMedia()
    }
  },
  addTo: function (container) {
    container.appendChild(this._el.container)
  },
  removeFrom: function (container) {
    container.removeChild(this._el.container)
  },
  updateDisplay: function (w, h, l) {
    this._updateDisplay(w, h, l)
  },
  loadMedia: function () {
    var self = this;
    if (this._media && !this._state.loaded) {
      this._media.loadMedia();
      this._state.loaded = !0
    }
    if (this._background_media && !this._background_media._state.loaded) {
      this._background_media.on("loaded", function () {
        self._updateBackgroundDisplay()
      });
      this._background_media.loadMedia()
    }
  },
  stopMedia: function () {
    if (this._media && this._state.loaded) {
      this._media.stopMedia()
    }
  },
  getBackground: function () {
    return this.has.background
  },
  scrollToTop: function () {
    this._el.container.scrollTop = 0
  },
  getFormattedDate: function () {
    if (TL.Util.trim(this.data.display_date).length > 0) {
      return this.data.display_date
    }
    var date_text = "";
    if (!this.has.title) {
      if (this.data.end_date) {
        date_text = " &mdash; " + this.data.end_date.getDisplayDate(this.getLanguage())
      }
      if (this.data.start_date) {
        date_text = this.data.start_date.getDisplayDate(this.getLanguage()) + date_text
      }
    }
    return date_text
  },
  _initLayout: function () {
    this._el.container = TL.Dom.create("div", "tl-slide");
    if (this.has.title) {
      this._el.container.className = "tl-slide tl-slide-titleslide"
    }
    if (this.data.unique_id) {
      this._el.container.id = this.data.unique_id
    }
    this._el.scroll_container = TL.Dom.create("div", "tl-slide-scrollable-container", this._el.container);
    this._el.content_container = TL.Dom.create("div", "tl-slide-content-container", this._el.scroll_container);
    this._el.content = TL.Dom.create("div", "tl-slide-content", this._el.content_container);
    this._el.background = TL.Dom.create("div", "tl-slide-background", this._el.container);
    if (this.data.background) {
      if (this.data.background.url) {
        var media_type = TL.MediaType(this.data.background, !0);
        if (media_type) {
          this._background_media = new media_type.cls(this.data.background, {background: 1});
          this.has.background.image = !0;
          this._el.container.className += ' tl-full-image-background';
          this.has.background.color_value = "#000";
          this._el.background.style.display = "block"
        }
      }
      if (this.data.background.color) {
        this.has.background.color = !0;
        this._el.container.className += ' tl-full-color-background';
        this.has.background.color_value = this.data.background.color
      }
      if (this.data.background.text_background) {
        this._el.container.className += ' tl-text-background'
      }
    }
    if (this.data.media && this.data.media.url && this.data.media.url != "") {
      this.has.media = !0
    }
    if (this.data.text && this.data.text.text) {
      this.has.text = !0
    }
    if (this.data.text && this.data.text.headline) {
      this.has.headline = !0
    }
    if (this.has.media) {
      this.data.media.mediatype = TL.MediaType(this.data.media);
      this.options.media_name = this.data.media.mediatype.name;
      this.options.media_type = this.data.media.mediatype.type;
      this.options.autolink = this.data.autolink;
      this._media = new this.data.media.mediatype.cls(this.data.media, this.options)
    }
    if (this.has.text || this.has.headline) {
      this._text = new TL.Media.Text(this.data.text, {
        title: this.has.title,
        language: this.options.language,
        autolink: this.data.autolink
      });
      this._text.addDateText(this.getFormattedDate())
    }
    if (!this.has.text && !this.has.headline && this.has.media) {
      TL.DomUtil.addClass(this._el.container, 'tl-slide-media-only');
      this._media.addTo(this._el.content)
    }
    else if (this.has.headline && this.has.media && !this.has.text) {
      TL.DomUtil.addClass(this._el.container, 'tl-slide-media-only');
      this._text.addTo(this._el.content);
      this._media.addTo(this._el.content)
    }
    else if (this.has.text && this.has.media) {
      this._media.addTo(this._el.content);
      this._text.addTo(this._el.content)
    }
    else if (this.has.text || this.has.headline) {
      TL.DomUtil.addClass(this._el.container, 'tl-slide-text-only');
      this._text.addTo(this._el.content)
    }
    this.onLoaded()
  },
  _initEvents: function () {
  },
  _updateDisplay: function (width, height, layout) {
    var content_width, content_padding_left = this.options.slide_padding_lr,
      content_padding_right = this.options.slide_padding_lr;
    if (width) {
      this.options.width = width
    }
    else {
      this.options.width = this._el.container.offsetWidth
    }
    content_width = this.options.width - (this.options.slide_padding_lr * 2);
    if (TL.Browser.mobile && (this.options.width <= this.options.skinny_size)) {
      content_padding_left = 0;
      content_padding_right = 0;
      content_width = this.options.width
    }
    else if (layout == "landscape") {
    }
    else if (this.options.width <= this.options.skinny_size) {
      content_padding_left = 50;
      content_padding_right = 50;
      content_width = this.options.width - content_padding_left - content_padding_right
    }
    else {
    }
    this._el.content.style.paddingLeft = content_padding_left + "px";
    this._el.content.style.paddingRight = content_padding_right + "px";
    this._el.content.style.width = content_width + "px";
    if (height) {
      this.options.height = height
    }
    else {
      this.options.height = this._el.container.offsetHeight
    }
    if (this._media) {
      if (!this.has.text && this.has.headline) {
        this._media.updateDisplay(content_width, (this.options.height - this._text.headlineHeight()), layout)
      }
      else if (!this.has.text && !this.has.headline) {
        this._media.updateDisplay(content_width, this.options.height, layout)
      }
      else if (this.options.width <= this.options.skinny_size) {
        this._media.updateDisplay(content_width, this.options.height, layout)
      }
      else {
        this._media.updateDisplay(content_width / 2, this.options.height, layout)
      }
    }
    this._updateBackgroundDisplay()
  },
  _updateBackgroundDisplay: function () {
    if (this._background_media && this._background_media._state.loaded) {
      this._el.background.style.backgroundImage = "url('" + this._background_media.getImageURL(this.options.width, this.options.height) + "')"
    }
  }
});
TL.SlideNav = TL.Class.extend({
  includes: [TL.Events, TL.DomMixins],
  _el: {},
  initialize: function (data, options, add_to_container) {
    this._el = {
      container: {},
      content_container: {},
      icon: {},
      title: {},
      description: {}
    };
    this.mediatype = {};
    this.data = {title: "Navigation", description: "Description", date: "Date"};
    this.options = {direction: "previous"};
    this.animator = null;
    TL.Util.mergeData(this.options, options);
    TL.Util.mergeData(this.data, data);
    this._el.container = TL.Dom.create("div", "tl-slidenav-" + this.options.direction);
    if (TL.Browser.mobile) {
      this._el.container.setAttribute("ontouchstart", " ")
    }
    this._initLayout();
    this._initEvents();
    if (add_to_container) {
      add_to_container.appendChild(this._el.container)
    }
  },
  update: function (slide) {
    var d = {title: "", description: "", date: slide.getFormattedDate()};
    if (slide.data.text) {
      if (slide.data.text.headline) {
        d.title = slide.data.text.headline
      }
    }
    this._update(d)
  },
  setColor: function (inverted) {
    if (inverted) {
      this._el.content_container.className = 'tl-slidenav-content-container tl-slidenav-inverted'
    }
    else {
      this._el.content_container.className = 'tl-slidenav-content-container'
    }
  },
  _onMouseClick: function () {
    this.fire("clicked", this.options)
  },
  _update: function (d) {
    this.data = TL.Util.mergeData(this.data, d);
    this._el.title.innerHTML = TL.Util.unlinkify(this.data.title);
    this._el.description.innerHTML = TL.Util.unlinkify(this.data.date)
  },
  _initLayout: function () {
    this._el.content_container = TL.Dom.create("div", "tl-slidenav-content-container", this._el.container);
    this._el.icon = TL.Dom.create("div", "tl-slidenav-icon", this._el.content_container);
    this._el.title = TL.Dom.create("div", "tl-slidenav-title", this._el.content_container);
    this._el.description = TL.Dom.create("div", "tl-slidenav-description", this._el.content_container);
    this._el.icon.innerHTML = "&nbsp;"
    this._update()
  },
  _initEvents: function () {
    TL.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this)
  }
});
TL.StorySlider = TL.Class.extend({
  includes: [TL.Events, TL.I18NMixins],
  initialize: function (elem, data, options, init) {
    this._el = {
      container: {},
      background: {},
      slider_container_mask: {},
      slider_container: {},
      slider_item_container: {}
    };
    this._nav = {};
    this._nav.previous = {};
    this._nav.next = {};
    this.slide_spacing = 0;
    this._slides = [];
    this._swipable;
    this.preloadTimer;
    this._message;
    this.current_id = '';
    this.data = {};
    this.options = {
      id: "",
      layout: "portrait",
      width: 600,
      height: 600,
      default_bg_color: {r: 255, g: 255, b: 255},
      slide_padding_lr: 40,
      start_at_slide: 1,
      slide_default_fade: "0%",
      duration: 1000,
      ease: TL.Ease.easeInOutQuint,
      dragging: !0,
      trackResize: !0
    };
    if (typeof elem === 'object') {
      this._el.container = elem;
      this.options.id = TL.Util.unique_ID(6, "tl")
    }
    else {
      this.options.id = elem;
      this._el.container = TL.Dom.get(elem)
    }
    if (!this._el.container.id) {
      this._el.container.id = this.options.id
    }
    this.animator = null;
    TL.Util.mergeData(this.options, options);
    TL.Util.mergeData(this.data, data);
    if (init) {
      this.init()
    }
  },
  init: function () {
    this._initLayout();
    this._initEvents();
    this._initData();
    this._updateDisplay();
    this.goTo(this.options.start_at_slide);
    this._onLoaded()
  },
  _addSlide: function (slide) {
    slide.addTo(this._el.slider_item_container);
    slide.on('added', this._onSlideAdded, this);
    slide.on('background_change', this._onBackgroundChange, this)
  },
  _createSlide: function (d, title_slide, n) {
    var slide = new TL.Slide(d, this.options, title_slide);
    this._addSlide(slide);
    if (n < 0) {
      this._slides.push(slide)
    }
    else {
      this._slides.splice(n, 0, slide)
    }
  },
  _createSlides: function (array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].unique_id == "") {
        array[i].unique_id = TL.Util.unique_ID(6, "tl-slide")
      }
      this._createSlide(array[i], !1, -1)
    }
  },
  _removeSlide: function (slide) {
    slide.removeFrom(this._el.slider_item_container);
    slide.off('added', this._onSlideRemoved, this);
    slide.off('background_change', this._onBackgroundChange)
  },
  _destroySlide: function (n) {
    this._removeSlide(this._slides[n]);
    this._slides.splice(n, 1)
  },
  _findSlideIndex: function (n) {
    var _n = n;
    if (typeof n == 'string' || n instanceof String) {
      _n = TL.Util.findArrayNumberByUniqueID(n, this._slides, "unique_id")
    }
    return _n
  },
  updateDisplay: function (w, h, a, l) {
    this._updateDisplay(w, h, a, l)
  },
  createSlide: function (d, n) {
    this._createSlide(d, !1, n)
  },
  createSlides: function (array) {
    this._createSlides(array)
  },
  destroySlide: function (n) {
    this._destroySlide(n)
  },
  destroySlideId: function (id) {
    this.destroySlide(this._findSlideIndex(id))
  },
  goTo: function (n, fast, displayupdate) {
    n = parseInt(n);
    if (isNaN(n)) {
      n = 0;
    }
    var self = this;
    this.changeBackground({color_value: "", image: !1});
    if (this.preloadTimer) {
      clearTimeout(this.preloadTimer)
    }
    for (var i = 0; i < this._slides.length; i++) {
      this._slides[i].setActive(!1)
    }
    if (n < this._slides.length && n >= 0) {
      this.current_id = this._slides[n].data.unique_id;
      if (this.animator) {
        this.animator.stop()
      }
      if (this._swipable) {
        this._swipable.stopMomentum()
      }
      if (fast) {
        this._el.slider_container.style.left = -(this.slide_spacing * n) + "px";
        this._onSlideChange(displayupdate)
      }
      else {
        this.animator = TL.Animate(this._el.slider_container, {
          left: -(this.slide_spacing * n) + "px",
          duration: this.options.duration,
          easing: this.options.ease,
          complete: this._onSlideChange(displayupdate)
        })
      }
      this._slides[n].setActive(!0);
      if (this._slides[n + 1]) {
        this.showNav(this._nav.next, !0);
        this._nav.next.update(this._slides[n + 1])
      }
      else {
        this.showNav(this._nav.next, !1)
      }
      if (this._slides[n - 1]) {
        this.showNav(this._nav.previous, !0);
        this._nav.previous.update(this._slides[n - 1])
      }
      else {
        this.showNav(this._nav.previous, !1)
      }
      this.preloadTimer = setTimeout(function () {
        self.preloadSlides(n)
      }, this.options.duration)
    }
  },
  goToId: function (id, fast, displayupdate) {
    this.goTo(this._findSlideIndex(id), fast, displayupdate)
  },
  preloadSlides: function (n) {
    if (this._slides[n + 1]) {
      this._slides[n + 1].loadMedia();
      this._slides[n + 1].scrollToTop()
    }
    if (this._slides[n + 2]) {
      this._slides[n + 2].loadMedia();
      this._slides[n + 2].scrollToTop()
    }
    if (this._slides[n - 1]) {
      this._slides[n - 1].loadMedia();
      this._slides[n - 1].scrollToTop()
    }
    if (this._slides[n - 2]) {
      this._slides[n - 2].loadMedia();
      this._slides[n - 2].scrollToTop()
    }
  },
  next: function () {
    var n = this._findSlideIndex(this.current_id);
    if ((n + 1) < (this._slides.length)) {
      this.goTo(n + 1)
    }
    else {
      this.goTo(n)
    }
  },
  previous: function () {
    var n = this._findSlideIndex(this.current_id);
    if (n - 1 >= 0) {
      this.goTo(n - 1)
    }
    else {
      this.goTo(n)
    }
  },
  showNav: function (nav_obj, show) {
    if (this.options.width <= 500 && TL.Browser.mobile) {
    }
    else {
      if (show) {
        nav_obj.show()
      }
      else {
        nav_obj.hide()
      }
    }
  },
  changeBackground: function (bg) {
    var bg_color = {r: 256, g: 256, b: 256}, bg_color_rgb;
    if (bg.color_value && bg.color_value != "") {
      bg_color = TL.Util.hexToRgb(bg.color_value);
      if (!bg_color) {
        trace("Invalid color value " + bg.color_value);
        bg_color = this.options.default_bg_color
      }
    }
    else {
      bg_color = this.options.default_bg_color;
      bg.color_value = "rgb(" + bg_color.r + " , " + bg_color.g + ", " + bg_color.b + ")"
    }
    bg_color_rgb = bg_color.r + "," + bg_color.g + "," + bg_color.b;
    this._el.background.style.backgroundImage = "none";
    if (bg.color_value) {
      this._el.background.style.backgroundColor = bg.color_value
    }
    else {
      this._el.background.style.backgroundColor = "transparent"
    }
    if (bg_color.r < 255 || bg_color.g < 255 || bg_color.b < 255 || bg.image) {
      this._nav.next.setColor(!0);
      this._nav.previous.setColor(!0)
    }
    else {
      this._nav.next.setColor(!1);
      this._nav.previous.setColor(!1)
    }
  },
  _updateDisplay: function (width, height, animate, layout) {
    var nav_pos, _layout;
    if (typeof layout === 'undefined') {
      _layout = this.options.layout
    }
    else {
      _layout = layout
    }
    this.options.layout = _layout;
    this.slide_spacing = this.options.width * 2;
    if (width) {
      this.options.width = width
    }
    else {
      this.options.width = this._el.container.offsetWidth
    }
    if (height) {
      this.options.height = height
    }
    else {
      this.options.height = this._el.container.offsetHeight
    }
    nav_pos = (this.options.height / 2);
    this._nav.next.setPosition({top: nav_pos});
    this._nav.previous.setPosition({top: nav_pos});
    for (var i = 0; i < this._slides.length; i++) {
      this._slides[i].updateDisplay(this.options.width, this.options.height, _layout);
      this._slides[i].setPosition({left: (this.slide_spacing * i), top: 0})
    }
    ;this.goToId(this.current_id, !0, !0)
  },
  _updateDrawSlides: function () {
    var _layout = this.options.layout;
    for (var i = 0; i < this._slides.length; i++) {
      this._slides[i].updateDisplay(this.options.width, this.options.height, _layout);
      this._slides[i].setPosition({left: (this.slide_spacing * i), top: 0})
    }
    ;this.goToId(this.current_id, !0, !1)
  },
  _initLayout: function () {
    TL.DomUtil.addClass(this._el.container, 'tl-storyslider');
    this._el.slider_container_mask = TL.Dom.create('div', 'tl-slider-container-mask', this._el.container);
    this._el.background = TL.Dom.create('div', 'tl-slider-background tl-animate', this._el.container);
    this._el.slider_container = TL.Dom.create('div', 'tl-slider-container tlanimate', this._el.slider_container_mask);
    this._el.slider_item_container = TL.Dom.create('div', 'tl-slider-item-container', this._el.slider_container);
    this.options.width = this._el.container.offsetWidth;
    this.options.height = this._el.container.offsetHeight;
    this._nav.previous = new TL.SlideNav({
      title: "Previous",
      description: "description"
    }, {direction: "previous"});
    this._nav.next = new TL.SlideNav({
      title: "Next",
      description: "description"
    }, {direction: "next"});
    this._nav.next.addTo(this._el.container);
    this._nav.previous.addTo(this._el.container);
    this._el.slider_container.style.left = "0px";
    if (TL.Browser.touch) {
      this._swipable = new TL.Swipable(this._el.slider_container_mask, this._el.slider_container, {
        enable: {
          x: !0,
          y: !1
        }, snap: !0
      });
      this._swipable.enable();
      this._message = new TL.Message({}, {
        message_class: "tl-message-full",
        message_icon_class: "tl-icon-swipe-left"
      });
      this._message.updateMessage(this._("swipe_to_navigate"));
      this._message.addTo(this._el.container)
    }
  },
  _initEvents: function () {
    this._nav.next.on('clicked', this._onNavigation, this);
    this._nav.previous.on('clicked', this._onNavigation, this);
    if (this._message) {
      this._message.on('clicked', this._onMessageClick, this)
    }
    if (this._swipable) {
      this._swipable.on('swipe_left', this._onNavigation, this);
      this._swipable.on('swipe_right', this._onNavigation, this);
      this._swipable.on('swipe_nodirection', this._onSwipeNoDirection, this)
    }
  },
  _initData: function () {
    if (this.data.title) {
      this._createSlide(this.data.title, !0, -1)
    }
    this._createSlides(this.data.events)
  },
  _onBackgroundChange: function (e) {
    var n = this._findSlideIndex(this.current_id);
    var slide_background = this._slides[n].getBackground();
    this.changeBackground(e);
    this.fire("colorchange", slide_background)
  },
  _onMessageClick: function (e) {
    this._message.hide()
  },
  _onSwipeNoDirection: function (e) {
    this.goToId(this.current_id)
  },
  _onNavigation: function (e) {
    if (e.direction == "next" || e.direction == "left") {
      this.next()
    }
    else if (e.direction == "previous" || e.direction == "right") {
      this.previous()
    }
    this.fire("nav_" + e.direction, this.data)
  },
  _onSlideAdded: function (e) {
    trace("slideadded")
    this.fire("slideAdded", this.data)
  },
  _onSlideRemoved: function (e) {
    this.fire("slideRemoved", this.data)
  },
  _onSlideChange: function (displayupdate) {
    if (!displayupdate) {
      this.fire("change", {unique_id: this.current_id})
    }
  },
  _onMouseClick: function (e) {
  },
  _fireMouseEvent: function (e) {
    if (!this._loaded) {
      return
    }
    var type = e.type;
    type = (type === 'mouseenter' ? 'mouseover' : (type === 'mouseleave' ? 'mouseout' : type));
    if (!this.hasEventListeners(type)) {
      return
    }
    if (type === 'contextmenu') {
      TL.DomEvent.preventDefault(e)
    }
    this.fire(type, {latlng: "something", layerPoint: "something else"})
  },
  _onLoaded: function () {
    this.fire("loaded", this.data)
  }
});
TL.TimeNav = TL.Class.extend({
  includes: [TL.Events, TL.DomMixins],
  _el: {},
  initialize: function (elem, timeline_config, options, init) {
    this._el = {
      parent: {},
      container: {},
      slider: {},
      slider_background: {},
      line: {},
      marker_container_mask: {},
      marker_container: {},
      marker_item_container: {},
      timeaxis: {},
      timeaxis_background: {},
      attribution: {}
    };
    this.collapsed = !1;
    if (typeof elem === 'object') {
      this._el.container = elem
    }
    else {
      this._el.container = TL.Dom.get(elem)
    }
    this.config = timeline_config;
    this.options = {
      width: 600,
      height: 600,
      duration: 1000,
      ease: TL.Ease.easeInOutQuint,
      has_groups: !1,
      optimal_tick_width: 50,
      scale_factor: 2,
      marker_padding: 5,
      timenav_height_min: 150,
      marker_height_min: 30,
      marker_width_min: 100,
      zoom_sequence: [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
    };
    this.animator = null;
    this.ready = !1;
    this._markers = [];
    this._eras = [];
    this.has_eras = !1;
    this._groups = [];
    this._calculated_row_height = 100;
    this.current_id = "";
    this.timescale = {};
    this.timeaxis = {};
    this.axishelper = {};
    this.max_rows = 6;
    this.animate_css = !1;
    this._swipable;
    TL.Util.mergeData(this.options, options);
    if (init) {
      this.init()
    }
  },
  init: function () {
    this._initLayout();
    this._initEvents();
    this._initData();
    this._updateDisplay();
    this._onLoaded()
  },
  positionMarkers: function () {
    this._positionMarkers()
  },
  updateDisplay: function (w, h, a, l) {
    this._updateDisplay(w, h, a, l)
  },
  _getTimeScale: function () {
    var marker_height_min = 0;
    try {
      marker_height_min = parseInt(this.options.marker_height_min)
    }
    catch (e) {
      trace("Invalid value for marker_height_min option.");
      marker_height_min = 30
    }
    if (marker_height_min == 0) {
      trace("marker_height_min option must not be zero.")
      marker_height_min = 30
    }
    this.max_rows = Math.round((this.options.height - this._el.timeaxis_background.offsetHeight - (this.options.marker_padding)) / marker_height_min);
    if (this.max_rows < 1) {
      this.max_rows = 1
    }
    return new TL.TimeScale(this.config, {
      display_width: this._el.container.offsetWidth,
      screen_multiplier: this.options.scale_factor,
      max_rows: this.max_rows
    })
  },
  _updateTimeScale: function (new_scale) {
    this.options.scale_factor = new_scale;
    this._updateDrawTimeline()
  },
  zoomIn: function () {
    var new_scale = TL.Util.findNextGreater(this.options.zoom_sequence, this.options.scale_factor);
    this.setZoomFactor(new_scale)
  },
  zoomOut: function () {
    var new_scale = TL.Util.findNextLesser(this.options.zoom_sequence, this.options.scale_factor);
    this.setZoomFactor(new_scale)
  },
  setZoom: function (level) {
    var zoom_factor = this.options.zoom_sequence[level];
    if (typeof (zoom_factor) == 'number') {
      this.setZoomFactor(zoom_factor)
    }
    else {
      console.warn("Invalid zoom level. Please use an index number between 0 and " + (this.options.zoom_sequence.length - 1))
    }
  },
  setZoomFactor: function (factor) {
    if (factor <= this.options.zoom_sequence[0]) {
      this.fire("zoomtoggle", {zoom: "out", show: !1})
    }
    else {
      this.fire("zoomtoggle", {zoom: "out", show: !0})
    }
    if (factor >= this.options.zoom_sequence[this.options.zoom_sequence.length - 1]) {
      this.fire("zoomtoggle", {zoom: "in", show: !1})
    }
    else {
      this.fire("zoomtoggle", {zoom: "in", show: !0})
    }
    if (factor == 0) {
      console.warn("Zoom factor must be greater than zero. Using 0.1");
      factor = 0.1
    }
    this.options.scale_factor = factor;
    this.goToId(this.current_id, !this._updateDrawTimeline(!0), !0)
  },
  _createGroups: function () {
    var group_labels = this.timescale.getGroupLabels();
    if (group_labels) {
      this.options.has_groups = !0;
      for (var i = 0; i < group_labels.length; i++) {
        this._createGroup(group_labels[i])
      }
    }
  },
  _createGroup: function (group_label) {
    var group = new TL.TimeGroup(group_label);
    this._addGroup(group);
    this._groups.push(group)
  },
  _addGroup: function (group) {
    group.addTo(this._el.container)
  },
  _positionGroups: function () {
    if (this.options.has_groups) {
      var available_height = (this.options.height - this._el.timeaxis_background.offsetHeight),
        group_height = Math.floor((available_height / this.timescale.getNumberOfRows()) - this.options.marker_padding),
        group_labels = this.timescale.getGroupLabels();
      for (var i = 0, group_rows = 0; i < this._groups.length; i++) {
        var group_y = Math.floor(group_rows * (group_height + this.options.marker_padding));
        var group_hide = !1;
        if (group_y > (available_height - this.options.marker_padding)) {
          group_hide = !0
        }
        this._groups[i].setRowPosition(group_y, this._calculated_row_height + this.options.marker_padding / 2);
        this._groups[i].setAlternateRowColor(TL.Util.isEven(i), group_hide);
        group_rows += this._groups[i].data.rows
      }
    }
  },
  _addMarker: function (marker) {
    marker.addTo(this._el.marker_item_container);
    marker.on('markerclick', this._onMarkerClick, this);
    marker.on('added', this._onMarkerAdded, this)
  },
  _createMarker: function (data, n) {
    var marker = new TL.TimeMarker(data, this.options);
    this._addMarker(marker);
    if (n < 0) {
      this._markers.push(marker)
    }
    else {
      this._markers.splice(n, 0, marker)
    }
  },
  _createMarkers: function (array) {
    for (var i = 0; i < array.length; i++) {
      this._createMarker(array[i], -1)
    }
  },
  _removeMarker: function (marker) {
    marker.removeFrom(this._el.marker_item_container)
  },
  _destroyMarker: function (n) {
    this._removeMarker(this._markers[n]);
    this._markers.splice(n, 1)
  },
  _positionMarkers: function (fast) {
    for (var i = 0; i < this._markers.length; i++) {
      var pos = this.timescale.getPositionInfo(i);
      if (fast) {
        this._markers[i].setClass("tl-timemarker tl-timemarker-fast")
      }
      else {
        this._markers[i].setClass("tl-timemarker")
      }
      this._markers[i].setPosition({left: pos.start});
      this._markers[i].setWidth(pos.width)
    }
  },
  _calculateMarkerHeight: function (h) {
    return ((h / this.timescale.getNumberOfRows()) - this.options.marker_padding)
  },
  _calculateRowHeight: function (h) {
    return (h / this.timescale.getNumberOfRows())
  },
  _calculateAvailableHeight: function () {
    return (this.options.height - this._el.timeaxis_background.offsetHeight - (this.options.marker_padding))
  },
  _calculateMinimumTimeNavHeight: function () {
    return (this.timescale.getNumberOfRows() * this.options.marker_height_min) + this._el.timeaxis_background.offsetHeight + (this.options.marker_padding)
  },
  getMinimumHeight: function () {
    return this._calculateMinimumTimeNavHeight()
  },
  _assignRowsToMarkers: function () {
    var available_height = this._calculateAvailableHeight(),
      marker_height = this._calculateMarkerHeight(available_height);
    this._positionGroups();
    this._calculated_row_height = this._calculateRowHeight(available_height);
    for (var i = 0; i < this._markers.length; i++) {
      this._markers[i].setHeight(marker_height);
      var row = this.timescale.getPositionInfo(i).row;
      var marker_y = Math.floor(row * (marker_height + this.options.marker_padding)) + this.options.marker_padding;
      var remainder_height = available_height - marker_y + this.options.marker_padding;
      this._markers[i].setRowPosition(marker_y, remainder_height)
    }
  },
  _resetMarkersActive: function () {
    for (var i = 0; i < this._markers.length; i++) {
      this._markers[i].setActive(!1)
    }
  },
  _findMarkerIndex: function (n) {
    var _n = -1;
    if (typeof n == 'string' || n instanceof String) {
      _n = TL.Util.findArrayNumberByUniqueID(n, this._markers, "unique_id", _n)
    }
    return _n
  },
  _createEras: function (array) {
    for (var i = 0; i < array.length; i++) {
      this._createEra(array[i], -1)
    }
  },
  _createEra: function (data, n) {
    var era = new TL.TimeEra(data, this.options);
    this._addEra(era);
    if (n < 0) {
      this._eras.push(era)
    }
    else {
      this._eras.splice(n, 0, era)
    }
  },
  _addEra: function (era) {
    era.addTo(this._el.marker_item_container);
    era.on('added', this._onEraAdded, this)
  },
  _removeEra: function (era) {
    era.removeFrom(this._el.marker_item_container)
  },
  _destroyEra: function (n) {
    this._removeEra(this._eras[n]);
    this._eras.splice(n, 1)
  },
  _positionEras: function (fast) {
    var era_color = 0;
    for (var i = 0; i < this._eras.length; i++) {
      var pos = {start: 0, end: 0, width: 0};
      pos.start = this.timescale.getPosition(this._eras[i].data.start_date.getTime());
      pos.end = this.timescale.getPosition(this._eras[i].data.end_date.getTime());
      pos.width = pos.end - pos.start;
      if (fast) {
        this._eras[i].setClass("tl-timeera tl-timeera-fast")
      }
      else {
        this._eras[i].setClass("tl-timeera")
      }
      this._eras[i].setPosition({left: pos.start});
      this._eras[i].setWidth(pos.width);
      era_color++;
      if (era_color > 5) {
        era_color = 0
      }
      this._eras[i].setColor(era_color)
    }
  },
  createMarker: function (d, n) {
    this._createMarker(d, n)
  },
  createMarkers: function (array) {
    this._createMarkers(array)
  },
  destroyMarker: function (n) {
    this._destroyMarker(n)
  },
  destroyMarkerId: function (id) {
    this.destroyMarker(this._findMarkerIndex(id))
  },
  goTo: function (n, fast, css_animation) {
    var self = this, _ease = this.options.ease,
      _duration = this.options.duration, _n = (n < 0) ? 0 : n;
    this._resetMarkersActive();
    if (n >= 0 && n < this._markers.length) {
      this._markers[n].setActive(!0)
    }
    if (this.animator) {
      this.animator.stop()
    }
    if (fast) {
      this._el.slider.className = "tl-timenav-slider";
      this._el.slider.style.left = -this._markers[_n].getLeft() + (this.options.width / 2) + "px"
    }
    else {
      if (css_animation) {
        this._el.slider.className = "tl-timenav-slider tl-timenav-slider-animate";
        this.animate_css = !0;
        this._el.slider.style.left = -this._markers[_n].getLeft() + (this.options.width / 2) + "px"
      }
      else {
        this._el.slider.className = "tl-timenav-slider";
        this.animator = TL.Animate(this._el.slider, {
          left: -this._markers[_n].getLeft() + (this.options.width / 2) + "px",
          duration: _duration,
          easing: _ease
        })
      }
    }
    if (n >= 0 && n < this._markers.length) {
      this.current_id = this._markers[n].data.unique_id
    }
    else {
      this.current_id = ''
    }
  },
  goToId: function (id, fast, css_animation) {
    this.goTo(this._findMarkerIndex(id), fast, css_animation)
  },
  _onLoaded: function () {
    this.ready = !0;
    this.fire("loaded", this.config)
  },
  _onMarkerAdded: function (e) {
    this.fire("dateAdded", this.config)
  },
  _onEraAdded: function (e) {
    this.fire("eraAdded", this.config)
  },
  _onMarkerRemoved: function (e) {
    this.fire("dateRemoved", this.config)
  },
  _onMarkerClick: function (e) {
    this.goToId(e.unique_id);
    this.fire("change", {unique_id: e.unique_id})
  },
  _onMouseScroll: function (e) {
    var delta = 0, scroll_to = 0, constraint = {
      right: -(this.timescale.getPixelWidth() - (this.options.width / 2)),
      left: this.options.width / 2
    };
    if (!e) {
      e = window.event
    }
    if (e.originalEvent) {
      e = e.originalEvent
    }
    if (typeof e.wheelDeltaX != 'undefined') {
      delta = e.wheelDeltaY / 6;
      if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) {
        delta = e.wheelDeltaX / 6
      }
      else {
        delta = 0
      }
    }
    if (delta) {
      if (e.preventDefault) {
        e.preventDefault()
      }
      e.returnValue = !1
    }
    scroll_to = parseInt(this._el.slider.style.left.replace("px", "")) + delta;
    if (scroll_to > constraint.left) {
      scroll_to = constraint.left
    }
    else if (scroll_to < constraint.right) {
      scroll_to = constraint.right
    }
    if (this.animate_css) {
      this._el.slider.className = "tl-timenav-slider";
      this.animate_css = !1
    }
    this._el.slider.style.left = scroll_to + "px"
  },
  _onDragMove: function (e) {
    if (this.animate_css) {
      this._el.slider.className = "tl-timenav-slider";
      this.animate_css = !1
    }
  },
  _updateDisplay: function (width, height, animate) {
    if (width) {
      this.options.width = width
    }
    if (height && height != this.options.height) {
      this.options.height = height;
      this.timescale = this._getTimeScale()
    }
    this._assignRowsToMarkers();
    this._el.slider_background.style.width = this.timescale.getPixelWidth() + this.options.width + "px";
    this._el.slider_background.style.left = -(this.options.width / 2) + "px";
    this._el.slider.style.width = this.timescale.getPixelWidth() + this.options.width + "px";
    this._swipable.updateConstraint({
      top: !1,
      bottom: !1,
      left: (this.options.width / 2),
      right: -(this.timescale.getPixelWidth() - (this.options.width / 2))
    });
    this.goToId(this.current_id, !0)
  },
  _drawTimeline: function (fast) {
    this.timescale = this._getTimeScale();
    this.timeaxis.drawTicks(this.timescale, this.options.optimal_tick_width);
    this._positionMarkers(fast);
    this._assignRowsToMarkers();
    this._createGroups();
    this._positionGroups();
    if (this.has_eras) {
      this._positionEras(fast)
    }
  },
  _updateDrawTimeline: function (check_update) {
    var do_update = !1;
    if (check_update) {
      var temp_timescale = new TL.TimeScale(this.config, {
        display_width: this._el.container.offsetWidth,
        screen_multiplier: this.options.scale_factor,
        max_rows: this.max_rows
      });
      if (this.timescale.getMajorScale() == temp_timescale.getMajorScale() && this.timescale.getMinorScale() == temp_timescale.getMinorScale()) {
        do_update = !0
      }
    }
    else {
      do_update = !0
    }
    if (do_update) {
      this.timescale = this._getTimeScale();
      this.timeaxis.positionTicks(this.timescale, this.options.optimal_tick_width);
      this._positionMarkers();
      this._assignRowsToMarkers();
      this._positionGroups();
      if (this.has_eras) {
        this._positionEras()
      }
      this._updateDisplay()
    }
    else {
      this._drawTimeline(!0)
    }
    return do_update
  },
  _initLayout: function () {
    this._el.attribution = TL.Dom.create('div', 'tl-attribution', this._el.container);
    this._el.line = TL.Dom.create('div', 'tl-timenav-line', this._el.container);
    this._el.slider = TL.Dom.create('div', 'tl-timenav-slider', this._el.container);
    this._el.slider_background = TL.Dom.create('div', 'tl-timenav-slider-background', this._el.slider);
    this._el.marker_container_mask = TL.Dom.create('div', 'tl-timenav-container-mask', this._el.slider);
    this._el.marker_container = TL.Dom.create('div', 'tl-timenav-container', this._el.marker_container_mask);
    this._el.marker_item_container = TL.Dom.create('div', 'tl-timenav-item-container', this._el.marker_container);
    this._el.timeaxis = TL.Dom.create('div', 'tl-timeaxis', this._el.slider);
    this._el.timeaxis_background = TL.Dom.create('div', 'tl-timeaxis-background', this._el.container);
    this._el.attribution.innerHTML = "<a href='http://timeline.knightlab.com' target='_blank'><span class='tl-knightlab-logo'></span>Timeline JS</a>"
    this.timeaxis = new TL.TimeAxis(this._el.timeaxis, this.options);
    this._swipable = new TL.Swipable(this._el.slider_background, this._el.slider, {
      enable: {
        x: !0,
        y: !1
      },
      constraint: {
        top: !1,
        bottom: !1,
        left: (this.options.width / 2),
        right: !1
      },
      snap: !1
    });
    this._swipable.enable()
  },
  _initEvents: function () {
    this._swipable.on('dragmove', this._onDragMove, this);
    TL.DomEvent.addListener(this._el.container, 'mousewheel', this._onMouseScroll, this);
    TL.DomEvent.addListener(this._el.container, 'DOMMouseScroll', this._onMouseScroll, this)
  },
  _initData: function () {
    this._createMarkers(this.config.events);
    if (this.config.eras) {
      this.has_eras = !0;
      this._createEras(this.config.eras)
    }
    this._drawTimeline()
  }
});
TL.TimeMarker = TL.Class.extend({
  includes: [TL.Events, TL.DomMixins],
  _el: {},
  initialize: function (data, options) {
    this._el = {
      container: {},
      content_container: {},
      media_container: {},
      timespan: {},
      line_left: {},
      line_right: {},
      content: {},
      text: {},
      media: {},
    };
    this._text = {};
    this._state = {loaded: !1};
    this.data = {
      unique_id: "",
      background: null,
      date: {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        thumbnail: "",
        format: ""
      },
      text: {headline: "", text: ""},
      media: null
    };
    this.options = {
      duration: 1000,
      ease: TL.Ease.easeInSpline,
      width: 600,
      height: 600,
      marker_width_min: 100
    };
    this.active = !1;
    this.animator = {};
    this.has_end_date = !1;
    TL.Util.mergeData(this.options, options);
    TL.Util.mergeData(this.data, data);
    this._initLayout();
    this._initEvents()
  },
  show: function () {
  },
  hide: function () {
  },
  setActive: function (is_active) {
    this.active = is_active;
    if (this.active && this.has_end_date) {
      this._el.container.className = 'tl-timemarker tl-timemarker-with-end tl-timemarker-active'
    }
    else if (this.active) {
      this._el.container.className = 'tl-timemarker tl-timemarker-active'
    }
    else if (this.has_end_date) {
      this._el.container.className = 'tl-timemarker tl-timemarker-with-end'
    }
    else {
      this._el.container.className = 'tl-timemarker'
    }
  },
  addTo: function (container) {
    container.appendChild(this._el.container)
  },
  removeFrom: function (container) {
    container.removeChild(this._el.container)
  },
  updateDisplay: function (w, h) {
    this._updateDisplay(w, h)
  },
  loadMedia: function () {
    if (this._media && !this._state.loaded) {
      this._media.loadMedia();
      this._state.loaded = !0
    }
  },
  stopMedia: function () {
    if (this._media && this._state.loaded) {
      this._media.stopMedia()
    }
  },
  getLeft: function () {
    return this._el.container.style.left.slice(0, -2)
  },
  getTime: function () {
    return this.data.start_date.getTime()
  },
  getEndTime: function () {
    if (this.data.end_date) {
      return this.data.end_date.getTime()
    }
    else {
      return !1
    }
  },
  setHeight: function (h) {
    var text_line_height = 12, text_lines = 1;
    this._el.content_container.style.height = h + "px";
    this._el.timespan_content.style.height = h + "px";
    if (h <= 30) {
      this._el.content.className = "tl-timemarker-content tl-timemarker-content-small"
    }
    else {
      this._el.content.className = "tl-timemarker-content"
    }
    if (h <= 56) {
      TL.DomUtil.addClass(this._el.content_container, "tl-timemarker-content-container-small")
    }
    else {
      TL.DomUtil.removeClass(this._el.content_container, "tl-timemarker-content-container-small")
    }
    if (TL.Browser.webkit) {
      text_lines = Math.floor(h / (text_line_height + 2));
      if (text_lines < 1) {
        text_lines = 1
      }
      this._text.className = "tl-headline";
      this._text.style.webkitLineClamp = text_lines
    }
    else {
      text_lines = h / text_line_height;
      if (text_lines > 1) {
        this._text.className = "tl-headline tl-headline-fadeout"
      }
      else {
        this._text.className = "tl-headline"
      }
      this._text.style.height = (text_lines * text_line_height) + "px"
    }
  },
  setWidth: function (w) {
    if (this.data.end_date) {
      this._el.container.style.width = w + "px";
      if (w > this.options.marker_width_min) {
        this._el.content_container.style.width = w + "px";
        this._el.content_container.className = "tl-timemarker-content-container tl-timemarker-content-container-long"
      }
      else {
        this._el.content_container.style.width = this.options.marker_width_min + "px";
        this._el.content_container.className = "tl-timemarker-content-container"
      }
    }
  },
  setClass: function (n) {
    this._el.container.className = n
  },
  setRowPosition: function (n, remainder) {
    this.setPosition({top: n});
    this._el.timespan.style.height = remainder + "px";
    if (remainder < 56) {
    }
  },
  _onMarkerClick: function (e) {
    this.fire("markerclick", {unique_id: this.data.unique_id})
  },
  _initLayout: function () {
    this._el.container = TL.Dom.create("div", "tl-timemarker");
    if (this.data.unique_id) {
      this._el.container.id = this.data.unique_id + "-marker"
    }
    if (this.data.end_date) {
      this.has_end_date = !0;
      this._el.container.className = 'tl-timemarker tl-timemarker-with-end'
    }
    this._el.timespan = TL.Dom.create("div", "tl-timemarker-timespan", this._el.container);
    this._el.timespan_content = TL.Dom.create("div", "tl-timemarker-timespan-content", this._el.timespan);
    this._el.content_container = TL.Dom.create("div", "tl-timemarker-content-container", this._el.container);
    this._el.content = TL.Dom.create("div", "tl-timemarker-content", this._el.content_container);
    this._el.line_left = TL.Dom.create("div", "tl-timemarker-line-left", this._el.timespan);
    this._el.line_right = TL.Dom.create("div", "tl-timemarker-line-right", this._el.timespan);
    if (this.data.media) {
      this._el.media_container = TL.Dom.create("div", "tl-timemarker-media-container", this._el.content);
      var mtd = {url: this.data.media.thumbnail};
      var thumbnail_media_type = (this.data.media.thumbnail) ? TL.MediaType(mtd, !0) : null;
      if (thumbnail_media_type) {
        var thumbnail_media = new thumbnail_media_type.cls(mtd);
        thumbnail_media.on("loaded", function () {
          this._el.media = TL.Dom.create("img", "tl-timemarker-media", this._el.media_container);
          this._el.media.src = thumbnail_media.getImageURL()
        }.bind(this));
        thumbnail_media.loadMedia()
      }
      else {
        var media_type = TL.MediaType(this.data.media).type;
        this._el.media = TL.Dom.create("span", "tl-icon-" + media_type, this._el.media_container)
      }
    }
    this._el.text = TL.Dom.create("div", "tl-timemarker-text", this._el.content);
    this._text = TL.Dom.create("h2", "tl-headline", this._el.text);
    if (this.data.text.headline && this.data.text.headline != "") {
      this._text.innerHTML = TL.Util.unlinkify(this.data.text.headline)
    }
    else if (this.data.text.text && this.data.text.text != "") {
      this._text.innerHTML = TL.Util.unlinkify(this.data.text.text)
    }
    else if (this.data.media.caption && this.data.media.caption != "") {
      this._text.innerHTML = TL.Util.unlinkify(this.data.media.caption)
    }
    this.onLoaded()
  },
  _initEvents: function () {
    TL.DomEvent.addListener(this._el.container, 'click', this._onMarkerClick, this)
  },
  _updateDisplay: function (width, height, layout) {
    if (width) {
      this.options.width = width
    }
    if (height) {
      this.options.height = height
    }
  }
});
TL.TimeEra = TL.Class.extend({
  includes: [TL.Events, TL.DomMixins],
  _el: {},
  initialize: function (data, options) {
    this._el = {
      container: {},
      background: {},
      content_container: {},
      content: {},
      text: {}
    };
    this._text = {};
    this._state = {loaded: !1};
    this.data = {
      unique_id: "",
      date: {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        thumbnail: "",
        format: ""
      },
      text: {headline: "", text: ""}
    };
    this.options = {
      duration: 1000,
      ease: TL.Ease.easeInSpline,
      width: 600,
      height: 600,
      marker_width_min: 100
    };
    this.active = !1;
    this.animator = {};
    this.has_end_date = !1;
    TL.Util.mergeData(this.options, options);
    TL.Util.mergeData(this.data, data);
    this._initLayout();
    this._initEvents()
  },
  show: function () {
  },
  hide: function () {
  },
  setActive: function (is_active) {
  },
  addTo: function (container) {
    container.appendChild(this._el.container)
  },
  removeFrom: function (container) {
    container.removeChild(this._el.container)
  },
  updateDisplay: function (w, h) {
    this._updateDisplay(w, h)
  },
  getLeft: function () {
    return this._el.container.style.left.slice(0, -2)
  },
  getTime: function () {
    return this.data.start_date.getTime()
  },
  getEndTime: function () {
    if (this.data.end_date) {
      return this.data.end_date.getTime()
    }
    else {
      return !1
    }
  },
  setHeight: function (h) {
    var text_line_height = 12, text_lines = 1;
    this._el.content_container.style.height = h + "px";
    this._el.content.className = "tl-timeera-content";
    if (TL.Browser.webkit) {
      text_lines = Math.floor(h / (text_line_height + 2));
      if (text_lines < 1) {
        text_lines = 1
      }
      this._text.className = "tl-headline";
      this._text.style.webkitLineClamp = text_lines
    }
    else {
      text_lines = h / text_line_height;
      if (text_lines > 1) {
        this._text.className = "tl-headline tl-headline-fadeout"
      }
      else {
        this._text.className = "tl-headline"
      }
      this._text.style.height = (text_lines * text_line_height) + "px"
    }
  },
  setWidth: function (w) {
    if (this.data.end_date) {
      this._el.container.style.width = w + "px";
      if (w > this.options.marker_width_min) {
        this._el.content_container.style.width = w + "px";
        this._el.content_container.className = "tl-timeera-content-container tl-timeera-content-container-long"
      }
      else {
        this._el.content_container.style.width = this.options.marker_width_min + "px";
        this._el.content_container.className = "tl-timeera-content-container"
      }
    }
  },
  setClass: function (n) {
    this._el.container.className = n
  },
  setRowPosition: function (n, remainder) {
    this.setPosition({top: n});
    if (remainder < 56) {
    }
  },
  setColor: function (color_num) {
    this._el.container.className = 'tl-timeera tl-timeera-color' + color_num
  },
  _initLayout: function () {
    this._el.container = TL.Dom.create("div", "tl-timeera");
    if (this.data.unique_id) {
      this._el.container.id = this.data.unique_id + "-era"
    }
    if (this.data.end_date) {
      this.has_end_date = !0;
      this._el.container.className = 'tl-timeera tl-timeera-with-end'
    }
    this._el.content_container = TL.Dom.create("div", "tl-timeera-content-container", this._el.container);
    this._el.background = TL.Dom.create("div", "tl-timeera-background", this._el.content_container);
    this._el.content = TL.Dom.create("div", "tl-timeera-content", this._el.content_container);
    this._el.text = TL.Dom.create("div", "tl-timeera-text", this._el.content);
    this._text = TL.Dom.create("h2", "tl-headline", this._el.text);
    if (this.data.text.headline && this.data.text.headline != "") {
      this._text.innerHTML = TL.Util.unlinkify(this.data.text.headline)
    }
    this.onLoaded()
  },
  _initEvents: function () {
  },
  _updateDisplay: function (width, height, layout) {
    if (width) {
      this.options.width = width
    }
    if (height) {
      this.options.height = height
    }
  }
});
TL.TimeGroup = TL.Class.extend({
  includes: [TL.Events, TL.DomMixins], _el: {}, initialize: function (data) {
    this._el = {parent: {}, container: {}, message: {}};
    this.options = {width: 600, height: 600};
    this.data = {label: "", rows: 1};
    this._el.container = TL.Dom.create("div", "tl-timegroup");
    TL.Util.mergeData(this.data, data);
    this.animator = {};
    this._initLayout();
    this._initEvents()
  }, updateDisplay: function (w, h) {
  }, setRowPosition: function (n, h) {
    this.options.height = h * this.data.rows;
    this.setPosition({top: n});
    this._el.container.style.height = this.options.height + "px"
  }, setAlternateRowColor: function (alternate, hide) {
    var class_name = "tl-timegroup";
    if (alternate) {
      class_name += " tl-timegroup-alternate"
    }
    if (hide) {
      class_name += " tl-timegroup-hidden"
    }
    this._el.container.className = class_name
  }, _onMouseClick: function () {
    this.fire("clicked", this.options)
  }, _initLayout: function () {
    this._el.message = TL.Dom.create("div", "tl-timegroup-message", this._el.container);
    this._el.message.innerHTML = this.data.label
  }, _initEvents: function () {
    TL.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this)
  }, _updateDisplay: function (width, height, animate) {
  }
});
TL.TimeScale = TL.Class.extend({
  initialize: function (timeline_config, options) {
    var slides = timeline_config.events;
    this._scale = timeline_config.scale;
    options = TL.Util.mergeData({
      display_width: 500,
      screen_multiplier: 3,
      max_rows: null
    }, options);
    this._display_width = options.display_width;
    this._screen_multiplier = options.screen_multiplier;
    this._pixel_width = this._screen_multiplier * this._display_width;
    this._group_labels = undefined;
    this._positions = [];
    this._pixels_per_milli = 0;
    this._earliest = timeline_config.getEarliestDate().getTime();
    this._latest = timeline_config.getLatestDate().getTime();
    this._span_in_millis = this._latest - this._earliest;
    if (this._span_in_millis <= 0) {
      this._span_in_millis = this._computeDefaultSpan(timeline_config)
    }
    this._average = (this._span_in_millis) / slides.length;
    this._pixels_per_milli = this.getPixelWidth() / this._span_in_millis;
    this._axis_helper = TL.AxisHelper.getBestHelper(this);
    this._scaled_padding = (1 / this.getPixelsPerTick()) * (this._display_width / 2)
    this._computePositionInfo(slides, options.max_rows)
  }, _computeDefaultSpan: function (timeline_config) {
    if (timeline_config.scale == 'human') {
      var formats = {}
      for (var i = 0; i < timeline_config.events.length; i++) {
        var fmt = timeline_config.events[i].start_date.findBestFormat();
        formats[fmt] = (formats[fmt]) ? formats[fmt] + 1 : 1
      }
      ;
      for (var i = TL.Date.SCALES.length - 1; i >= 0; i--) {
        if (formats.hasOwnProperty(TL.Date.SCALES[i][0])) {
          var scale = TL.Date.SCALES[TL.Date.SCALES.length - 1];
          if (TL.Date.SCALES[i + 1]) {
            scale = TL.Date.SCALES[i + 1]
          }
          return scale[1]
        }
      }
      ;
      return 365 * 24 * 60 * 60 * 1000
    }
    return 200000
  }, getGroupLabels: function () {
    return (this._group_labels || [])
  }, getScale: function () {
    return this._scale
  }, getNumberOfRows: function () {
    return this._number_of_rows
  }, getPixelWidth: function () {
    return this._pixel_width
  }, getPosition: function (time_in_millis) {
    return (time_in_millis - this._earliest) * this._pixels_per_milli
  }, getPositionInfo: function (idx) {
    return this._positions[idx]
  }, getPixelsPerTick: function () {
    return this._axis_helper.getPixelsPerTick(this._pixels_per_milli)
  }, getTicks: function () {
    return {
      major: this._axis_helper.getMajorTicks(this),
      minor: this._axis_helper.getMinorTicks(this)
    }
  }, getDateFromTime: function (t) {
    if (this._scale == 'human') {
      return new TL.Date(t)
    }
    else if (this._scale == 'cosmological') {
      return new TL.BigDate(new TL.BigYear(t))
    }
    throw new TL.Error("time_scale_scale_err", this._scale)
  }, getMajorScale: function () {
    return this._axis_helper.major.name
  }, getMinorScale: function () {
    return this._axis_helper.minor.name
  }, _assessGroups: function (slides) {
    var groups = [];
    var empty_group = !1;
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].group) {
        if (groups.indexOf(slides[i].group) < 0) {
          groups.push(slides[i].group)
        }
        else {
          empty_group = !0
        }
      }
    }
    ;
    if (groups.length && empty_group) {
      groups.push('')
    }
    return groups
  }, _computeRowInfo: function (positions, rows_left) {
    var lasts_in_row = [];
    var n_overlaps = 0;
    for (var i = 0; i < positions.length; i++) {
      var pos_info = positions[i];
      var overlaps = [];
      delete pos_info.row;
      for (var j = 0; j < lasts_in_row.length; j++) {
        overlaps.push(lasts_in_row[j].end - pos_info.start);
        if (overlaps[j] <= 0) {
          pos_info.row = j;
          lasts_in_row[j] = pos_info;
          break
        }
      }
      if (typeof (pos_info.row) == 'undefined') {
        if (rows_left === null) {
          pos_info.row = lasts_in_row.length;
          lasts_in_row.push(pos_info)
        }
        else if (rows_left > 0) {
          pos_info.row = lasts_in_row.length;
          lasts_in_row.push(pos_info);
          rows_left--
        }
        else {
          var min_overlap = Math.min.apply(null, overlaps);
          var idx = overlaps.indexOf(min_overlap);
          pos_info.row = idx;
          if (pos_info.end > lasts_in_row[idx].end) {
            lasts_in_row[idx] = pos_info
          }
          n_overlaps++
        }
      }
    }
    return {n_rows: lasts_in_row.length, n_overlaps: n_overlaps}
  }, _computePositionInfo: function (slides, max_rows, default_marker_width) {
    default_marker_width = default_marker_width || 100;
    var groups = [];
    var empty_group = !1;
    for (var i = 0; i < slides.length; i++) {
      var pos_info = {start: this.getPosition(slides[i].start_date.getTime())};
      this._positions.push(pos_info);
      if (typeof (slides[i].end_date) != 'undefined') {
        var end_pos = this.getPosition(slides[i].end_date.getTime());
        pos_info.width = end_pos - pos_info.start;
        if (pos_info.width > default_marker_width) {
          pos_info.end = pos_info.start + pos_info.width
        }
        else {
          pos_info.end = pos_info.start + default_marker_width
        }
      }
      else {
        pos_info.width = default_marker_width;
        pos_info.end = pos_info.start + default_marker_width
      }
      if (slides[i].group) {
        if (groups.indexOf(slides[i].group) < 0) {
          groups.push(slides[i].group)
        }
      }
      else {
        empty_group = !0
      }
    }
    if (!(groups.length)) {
      var result = this._computeRowInfo(this._positions, max_rows);
      this._number_of_rows = result.n_rows
    }
    else {
      if (empty_group) {
        groups.push("")
      }
      var group_info = [];
      for (var i = 0; i < groups.length; i++) {
        group_info[i] = {
          label: groups[i],
          idx: i,
          positions: [],
          n_rows: 1,
          n_overlaps: 0
        }
      }
      for (var i = 0; i < this._positions.length; i++) {
        var pos_info = this._positions[i];
        pos_info.group = groups.indexOf(slides[i].group || "");
        pos_info.row = 0;
        var gi = group_info[pos_info.group];
        for (var j = gi.positions.length - 1; j >= 0; j--) {
          if (gi.positions[j].end > pos_info.start) {
            gi.n_overlaps++
          }
        }
        gi.positions.push(pos_info)
      }
      var n_rows = groups.length;
      while (!0) {
        var rows_left = Math.max(0, max_rows - n_rows);
        if (!rows_left) {
          break
        }
        group_info.sort(function (a, b) {
          if (a.n_overlaps > b.n_overlaps) {
            return -1
          }
          else if (a.n_overlaps < b.n_overlaps) {
            return 1
          }
          return a.idx - b.idx
        });
        if (!group_info[0].n_overlaps) {
          break
        }
        var n_rows = 0;
        for (var i = 0; i < group_info.length; i++) {
          var gi = group_info[i];
          if (gi.n_overlaps && rows_left) {
            var res = this._computeRowInfo(gi.positions, gi.n_rows + 1);
            gi.n_rows = res.n_rows;
            gi.n_overlaps = res.n_overlaps;
            rows_left--
          }
          n_rows += gi.n_rows
        }
      }
      this._number_of_rows = n_rows;
      this._group_labels = [];
      group_info.sort(function (a, b) {
        return a.idx - b.idx
      });
      for (var i = 0, row_offset = 0; i < group_info.length; i++) {
        this._group_labels.push({
          label: group_info[i].label,
          rows: group_info[i].n_rows
        });
        for (var j = 0; j < group_info[i].positions.length; j++) {
          var pos_info = group_info[i].positions[j];
          pos_info.row += row_offset
        }
        row_offset += group_info[i].n_rows
      }
    }
  }
});
TL.TimeAxis = TL.Class.extend({
  includes: [TL.Events, TL.DomMixins, TL.I18NMixins],
  _el: {},
  initialize: function (elem, options) {
    this._el = {container: {}, content_container: {}, major: {}, minor: {},};
    this._text = {};
    this._state = {loaded: !1};
    this.data = {};
    this.options = {
      duration: 1000,
      ease: TL.Ease.easeInSpline,
      width: 600,
      height: 600
    };
    this.active = !1;
    this.animator = {};
    this.axis_helper = {};
    this.minor_ticks = [];
    this.major_ticks = [];
    this.dateformat_lookup = {
      millisecond: 'time_milliseconds',
      second: 'time_short',
      minute: 'time_no_seconds_short',
      hour: 'time_no_minutes_short',
      day: 'full_short',
      month: 'month_short',
      year: 'year',
      decade: 'year',
      century: 'year',
      millennium: 'year',
      age: 'compact',
      epoch: 'compact',
      era: 'compact',
      eon: 'compact',
      eon2: 'compact'
    }
    if (typeof elem === 'object') {
      this._el.container = elem
    }
    else {
      this._el.container = TL.Dom.get(elem)
    }
    TL.Util.mergeData(this.options, options);
    this._initLayout();
    this._initEvents()
  },
  show: function () {
  },
  hide: function () {
  },
  addTo: function (container) {
    container.appendChild(this._el.container)
  },
  removeFrom: function (container) {
    container.removeChild(this._el.container)
  },
  updateDisplay: function (w, h) {
    this._updateDisplay(w, h)
  },
  getLeft: function () {
    return this._el.container.style.left.slice(0, -2)
  },
  drawTicks: function (timescale, optimal_tick_width) {
    var ticks = timescale.getTicks();
    var controls = {
      minor: {
        el: this._el.minor,
        dateformat: this.dateformat_lookup[ticks.minor.name],
        ts_ticks: ticks.minor.ticks,
        tick_elements: this.minor_ticks
      },
      major: {
        el: this._el.major,
        dateformat: this.dateformat_lookup[ticks.major.name],
        ts_ticks: ticks.major.ticks,
        tick_elements: this.major_ticks
      }
    }
    this._el.major.className = "tl-timeaxis-major";
    this._el.minor.className = "tl-timeaxis-minor";
    this._el.major.style.opacity = 0;
    this._el.minor.style.opacity = 0;
    this.major_ticks = this._createTickElements(ticks.major.ticks, this._el.major, this.dateformat_lookup[ticks.major.name]);
    this.minor_ticks = this._createTickElements(ticks.minor.ticks, this._el.minor, this.dateformat_lookup[ticks.minor.name], ticks.major.ticks);
    this.positionTicks(timescale, optimal_tick_width, !0);
    this._el.major.className = "tl-timeaxis-major tl-animate-opacity tl-timeaxis-animate-opacity";
    this._el.minor.className = "tl-timeaxis-minor tl-animate-opacity tl-timeaxis-animate-opacity";
    this._el.major.style.opacity = 1;
    this._el.minor.style.opacity = 1
  },
  _createTickElements: function (ts_ticks, tick_element, dateformat, ticks_to_skip) {
    tick_element.innerHTML = "";
    var skip_times = {};
    var yearZero = new Date(-1, 13, -30);
    skip_times[yearZero.getTime()] = !0;
    if (ticks_to_skip) {
      for (var i = 0; i < ticks_to_skip.length; i++) {
        skip_times[ticks_to_skip[i].getTime()] = !0
      }
    }
    var tick_elements = []
    for (var i = 0; i < ts_ticks.length; i++) {
      var ts_tick = ts_ticks[i];
      if (!(ts_tick.getTime() in skip_times)) {
        var tick = TL.Dom.create("div", "tl-timeaxis-tick", tick_element),
          tick_text = TL.Dom.create("span", "tl-timeaxis-tick-text tl-animate-opacity", tick);
        tick_text.innerHTML = ts_tick.getDisplayDate(this.getLanguage(), dateformat);
        tick_elements.push({
          tick: tick,
          tick_text: tick_text,
          display_date: ts_tick.getDisplayDate(this.getLanguage(), dateformat),
          date: ts_tick
        })
      }
    }
    return tick_elements
  },
  positionTicks: function (timescale, optimal_tick_width, no_animate) {
    if (no_animate) {
      this._el.major.className = "tl-timeaxis-major";
      this._el.minor.className = "tl-timeaxis-minor"
    }
    else {
      this._el.major.className = "tl-timeaxis-major tl-timeaxis-animate";
      this._el.minor.className = "tl-timeaxis-minor tl-timeaxis-animate"
    }
    this._positionTickArray(this.major_ticks, timescale, optimal_tick_width);
    this._positionTickArray(this.minor_ticks, timescale, optimal_tick_width)
  },
  _positionTickArray: function (tick_array, timescale, optimal_tick_width) {
    if (tick_array[1] && tick_array[0]) {
      var distance = (timescale.getPosition(tick_array[1].date.getMillisecond()) - timescale.getPosition(tick_array[0].date.getMillisecond())),
        fraction_of_array = 1;
      if (distance < optimal_tick_width) {
        fraction_of_array = Math.round(optimal_tick_width / timescale.getPixelsPerTick())
      }
      var show = 1;
      for (var i = 0; i < tick_array.length; i++) {
        var tick = tick_array[i];
        tick.tick.style.left = timescale.getPosition(tick.date.getMillisecond()) + "px";
        tick.tick_text.innerHTML = tick.display_date;
        if (fraction_of_array > 1) {
          if (show >= fraction_of_array) {
            show = 1;
            tick.tick_text.style.opacity = 1;
            tick.tick.className = "tl-timeaxis-tick"
          }
          else {
            show++;
            tick.tick_text.style.opacity = 0;
            tick.tick.className = "tl-timeaxis-tick tl-timeaxis-tick-hidden"
          }
        }
        else {
          tick.tick_text.style.opacity = 1;
          tick.tick.className = "tl-timeaxis-tick"
        }
      }
    }
  },
  _initLayout: function () {
    this._el.content_container = TL.Dom.create("div", "tl-timeaxis-content-container", this._el.container);
    this._el.major = TL.Dom.create("div", "tl-timeaxis-major", this._el.content_container);
    this._el.minor = TL.Dom.create("div", "tl-timeaxis-minor", this._el.content_container);
    this.onLoaded()
  },
  _initEvents: function () {
  },
  _updateDisplay: function (width, height, layout) {
    if (width) {
      this.options.width = width
    }
    if (height) {
      this.options.height = height
    }
  }
});
TL.AxisHelper = TL.Class.extend({
  initialize: function (options) {
    if (options) {
      this.scale = options.scale;
      this.minor = options.minor;
      this.major = options.major
    }
    else {
      throw new TL.Error("axis_helper_no_options_err")
    }
  }, getPixelsPerTick: function (pixels_per_milli) {
    return pixels_per_milli * this.minor.factor
  }, getMajorTicks: function (timescale) {
    return this._getTicks(timescale, this.major)
  }, getMinorTicks: function (timescale) {
    return this._getTicks(timescale, this.minor)
  }, _getTicks: function (timescale, option) {
    var factor_scale = timescale._scaled_padding * option.factor;
    var first_tick_time = timescale._earliest - factor_scale;
    var last_tick_time = timescale._latest + factor_scale;
    var ticks = []
    for (var i = first_tick_time; i < last_tick_time; i += option.factor) {
      ticks.push(timescale.getDateFromTime(i).floor(option.name))
    }
    return {name: option.name, ticks: ticks}
  }
});
(function (cls) {
  var HELPERS = {};
  var setHelpers = function (scale_type, scales) {
    HELPERS[scale_type] = [];
    for (var idx = 0; idx < scales.length - 1; idx++) {
      var minor = scales[idx];
      var major = scales[idx + 1];
      HELPERS[scale_type].push(new cls({
        scale: minor[3],
        minor: {name: minor[0], factor: minor[1]},
        major: {name: major[0], factor: major[1]}
      }))
    }
  };
  setHelpers('human', TL.Date.SCALES);
  setHelpers('cosmological', TL.BigDate.SCALES);
  cls.HELPERS = HELPERS;
  cls.getBestHelper = function (ts, optimal_tick_width) {
    if (typeof (optimal_tick_width) != 'number') {
      optimal_tick_width = 100
    }
    var ts_scale = ts.getScale();
    var helpers = HELPERS[ts_scale];
    if (!helpers) {
      throw new TL.Error("axis_helper_scale_err", ts_scale)
    }
    var prev = null;
    for (var idx = 0; idx < helpers.length; idx++) {
      var curr = helpers[idx];
      var pixels_per_tick = curr.getPixelsPerTick(ts._pixels_per_milli);
      if (pixels_per_tick > optimal_tick_width) {
        if (prev == null) {
          return curr;
        }
        var curr_dist = Math.abs(optimal_tick_width - pixels_per_tick);
        var prev_dist = Math.abs(optimal_tick_width - pixels_per_tick);
        if (curr_dist < prev_dist) {
          return curr
        }
        else {
          return prev
        }
      }
      prev = curr
    }
    return helpers[helpers.length - 1]
  }
})(TL.AxisHelper);
TL.Timeline = TL.Class.extend({
  includes: [TL.Events, TL.I18NMixins],
  initialize: function (elem, data, options) {
    var self = this;
    if (!options) {
      options = {}
    }
    ;this.version = "3.2.6";
    this.ready = !1;
    this._el = {container: {}, storyslider: {}, timenav: {}, menubar: {}};
    if (typeof elem === 'object') {
      this._el.container = elem
    }
    else {
      this._el.container = TL.Dom.get(elem)
    }
    this._storyslider = {};
    this._style_sheet = new TL.StyleSheet();
    this._timenav = {};
    this._menubar = {};
    this._loaded = {storyslider: !1, timenav: !1};
    this.config = null;
    this.options = {
      script_path: "",
      height: this._el.container.offsetHeight,
      width: this._el.container.offsetWidth,
      debug: !1,
      is_embed: !1,
      is_full_embed: !1,
      hash_bookmark: !1,
      default_bg_color: {r: 255, g: 255, b: 255},
      scale_factor: 2,
      layout: "landscape",
      timenav_position: "bottom",
      optimal_tick_width: 60,
      base_class: "tl-timeline",
      timenav_height: null,
      timenav_height_percentage: 25,
      timenav_mobile_height_percentage: 40,
      timenav_height_min: 175,
      marker_height_min: 30,
      marker_width_min: 100,
      marker_padding: 5,
      start_at_slide: 0,
      start_at_end: !1,
      menubar_height: 0,
      skinny_size: 650,
      medium_size: 800,
      relative_date: !1,
      use_bc: !1,
      duration: 1000,
      ease: TL.Ease.easeInOutQuint,
      dragging: !0,
      trackResize: !0,
      map_type: "stamen:toner-lite",
      slide_padding_lr: 100,
      slide_default_fade: "0%",
      zoom_sequence: [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
      language: "en",
      ga_property_id: null,
      track_events: ['back_to_start', 'nav_next', 'nav_previous', 'zoom_in', 'zoom_out']
    };
    this.animator_timenav = null;
    this.animator_storyslider = null;
    this.animator_menubar = null;
    this.message = new TL.Message({}, {message_class: "tl-message-full"}, this._el.container);
    if (typeof (options.default_bg_color) == "string") {
      var parsed = TL.Util.hexToRgb(options.default_bg_color);
      if (parsed) {
        options.default_bg_color = parsed
      }
      else {
        delete options.default_bg_color
        trace("Invalid default background color. Ignoring.")
      }
    }
    TL.Util.mergeData(this.options, options);
    window.addEventListener("resize", function (e) {
      self.updateDisplay()
    });
    TL.debug = this.options.debug;
    TL.DomUtil.addClass(this._el.container, 'tl-timeline');
    if (this.options.is_embed) {
      TL.DomUtil.addClass(this._el.container, 'tl-timeline-embed')
    }
    if (this.options.is_full_embed) {
      TL.DomUtil.addClass(this._el.container, 'tl-timeline-full-embed')
    }
    if (this.options.relative_date) {
      if (typeof (moment) !== 'undefined') {
        self._loadLanguage(data)
      }
      else {
        TL.Load.js(this.options.script_path + "/library/moment.js", function () {
          self._loadLanguage(data);
          trace("LOAD MOMENTJS")
        })
      }
    }
    else {
      self._loadLanguage(data)
    }
  },
  _translateError: function (e) {
    if (e.hasOwnProperty('stack')) {
      trace(e.stack)
    }
    if (e.message_key) {
      return this._(e.message_key) + (e.detail ? ' [' + e.detail + ']' : '')
    }
    return e
  },
  _loadLanguage: function (data) {
    try {
      this.options.language = new TL.Language(this.options);
      this._initData(data)
    }
    catch (e) {
      this.showMessage(this._translateError(e))
    }
  },
  goToId: function (id) {
    if (this.current_id != id) {
      this.current_id = id;
      this._timenav.goToId(this.current_id);
      this._storyslider.goToId(this.current_id, !1, !0);
      this.fire("change", {unique_id: this.current_id}, this)
    }
  },
  goTo: function (n) {
    if (this.config.title) {
      if (n == 0) {
        this.goToId(this.config.title.unique_id)
      }
      else {
        this.goToId(this.config.events[n - 1].unique_id)
      }
    }
    else {
      this.goToId(this.config.events[n].unique_id)
    }
  },
  goToStart: function () {
    this.goTo(0)
  },
  goToEnd: function () {
    var _n = this.config.events.length - 1;
    this.goTo(this.config.title ? _n + 1 : _n)
  },
  goToPrev: function () {
    this.goTo(this._getSlideIndex(this.current_id) - 1)
  },
  goToNext: function () {
    this.goTo(this._getSlideIndex(this.current_id) + 1)
  },
  add: function (data) {
    var unique_id = this.config.addEvent(data);
    var n = this._getEventIndex(unique_id);
    var d = this.config.events[n];
    this._storyslider.createSlide(d, this.config.title ? n + 1 : n);
    this._storyslider._updateDrawSlides();
    this._timenav.createMarker(d, n);
    this._timenav._updateDrawTimeline(!1);
    this.fire("added", {unique_id: unique_id})
  },
  remove: function (n) {
    if (n >= 0 && n < this.config.events.length) {
      if (this.config.events[n].unique_id == this.current_id) {
        if (n < this.config.events.length - 1) {
          this.goTo(n + 1)
        }
        else {
          this.goTo(n - 1)
        }
      }
      var event = this.config.events.splice(n, 1);
      delete this.config.event_dict[event[0].unique_id];
      this._storyslider.destroySlide(this.config.title ? n + 1 : n);
      this._storyslider._updateDrawSlides();
      this._timenav.destroyMarker(n);
      this._timenav._updateDrawTimeline(!1);
      this.fire("removed", {unique_id: event[0].unique_id})
    }
  },
  removeId: function (id) {
    this.remove(this._getEventIndex(id))
  },
  getData: function (n) {
    if (this.config.title) {
      if (n == 0) {
        return this.config.title
      }
      else if (n > 0 && n <= this.config.events.length) {
        return this.config.events[n - 1]
      }
    }
    else if (n >= 0 && n < this.config.events.length) {
      return this.config.events[n]
    }
    return null
  },
  getDataById: function (id) {
    return this.getData(this._getSlideIndex(id))
  },
  getSlide: function (n) {
    if (n >= 0 && n < this._storyslider._slides.length) {
      return this._storyslider._slides[n]
    }
    return null
  },
  getSlideById: function (id) {
    return this.getSlide(this._getSlideIndex(id))
  },
  getCurrentSlide: function () {
    return this.getSlideById(this.current_id)
  },
  updateDisplay: function () {
    if (this.ready) {
      this._updateDisplay()
    }
  },
  _calculateTimeNavHeight: function (timenav_height, timenav_height_percentage) {
    var height = 0;
    if (timenav_height) {
      height = timenav_height
    }
    else {
      if (this.options.timenav_height_percentage || timenav_height_percentage) {
        if (timenav_height_percentage) {
          height = Math.round((this.options.height / 100) * timenav_height_percentage)
        }
        else {
          height = Math.round((this.options.height / 100) * this.options.timenav_height_percentage)
        }
      }
    }
    if (this._timenav.ready) {
      if (this.options.timenav_height_min < this._timenav.getMinimumHeight()) {
        this.options.timenav_height_min = this._timenav.getMinimumHeight()
      }
    }
    if (height < this.options.timenav_height_min) {
      height = this.options.timenav_height_min
    }
    height = height - (this.options.marker_padding * 2);
    return height
  },
  _updateDisplay: function (timenav_height, animate, d) {
    var duration = this.options.duration,
      display_class = this.options.base_class, menu_position = 0, self = this;
    if (d) {
      duration = d
    }
    this.options.width = this._el.container.offsetWidth;
    this.options.height = this._el.container.offsetHeight;
    if (this.options.width <= this.options.skinny_size) {
      display_class += " tl-skinny";
      this.options.layout = "portrait"
    }
    else if (this.options.width <= this.options.medium_size) {
      display_class += " tl-medium";
      this.options.layout = "landscape"
    }
    else {
      this.options.layout = "landscape"
    }
    if (TL.Browser.touch) {
      this.options.layout = TL.Browser.orientation()
    }
    if (TL.Browser.mobile) {
      display_class += " tl-mobile";
      this.options.timenav_height = this._calculateTimeNavHeight(timenav_height, this.options.timenav_mobile_height_percentage)
    }
    else {
      this.options.timenav_height = this._calculateTimeNavHeight(timenav_height)
    }
    if (this.options.layout == "portrait") {
      display_class += " tl-layout-portrait"
    }
    else {
      display_class += " tl-layout-landscape"
    }
    this.options.storyslider_height = (this.options.height - this.options.timenav_height);
    if (this.options.timenav_position == "top") {
      menu_position = (Math.ceil(this.options.timenav_height) / 2) - (this._el.menubar.offsetHeight / 2) - (39 / 2)
    }
    else {
      menu_position = Math.round(this.options.storyslider_height + 1 + (Math.ceil(this.options.timenav_height) / 2) - (this._el.menubar.offsetHeight / 2) - (35 / 2))
    }
    if (animate) {
      this._el.timenav.style.height = Math.ceil(this.options.timenav_height) + "px";
      if (this.animator_storyslider) {
        this.animator_storyslider.stop()
      }
      this.animator_storyslider = TL.Animate(this._el.storyslider, {
        height: this.options.storyslider_height + "px",
        duration: duration / 2,
        easing: TL.Ease.easeOutStrong
      });
      if (this.animator_menubar) {
        this.animator_menubar.stop()
      }
      this.animator_menubar = TL.Animate(this._el.menubar, {
        top: menu_position + "px",
        duration: duration / 2,
        easing: TL.Ease.easeOutStrong
      })
    }
    else {
      this._el.timenav.style.height = Math.ceil(this.options.timenav_height) + "px";
      this._el.storyslider.style.height = this.options.storyslider_height + "px";
      this._el.menubar.style.top = menu_position + "px"
    }
    if (this.message) {
      this.message.updateDisplay(this.options.width, this.options.height)
    }
    this._timenav.updateDisplay(this.options.width, this.options.timenav_height, animate);
    this._storyslider.updateDisplay(this.options.width, this.options.storyslider_height, animate, this.options.layout);
    if (this.options.language.direction == 'rtl') {
      display_class += ' tl-rtl'
    }
    this._el.container.className = display_class
  },
  _updateHashBookmark: function (id) {
    var hash = "#" + "event-" + id.toString();
    if (window.location.protocol != 'file:') {
      window.history.replaceState(null, "Browsing TimelineJS", hash)
    }
    this.fire("hash_updated", {
      unique_id: this.current_id,
      hashbookmark: "#" + "event-" + id.toString()
    }, this)
  },
  _initData: function (data) {
    var self = this;
    if (typeof data == 'string') {
      var self = this;
      TL.ConfigFactory.makeConfig(data, function (config) {
        self.setConfig(config)
      })
    }
    else if (TL.TimelineConfig == data.constructor) {
      this.setConfig(data)
    }
    else {
      this.setConfig(new TL.TimelineConfig(data))
    }
  },
  setConfig: function (config) {
    this.config = config;
    this.config.validate();
    this._validateOptions();
    if (this.config.isValid()) {
      try {
        this._onDataLoaded()
      }
      catch (e) {
        this.showMessage("<strong>" + this._('error') + ":</strong> " + this._translateError(e))
      }
    }
    else {
      var translated_errs = [];
      for (var i = 0, errs = this.config.getErrors(); i < errs.length; i++) {
        translated_errs.push(this._translateError(errs[i]))
      }
      this.showMessage("<strong>" + this._('error') + ":</strong> " + translated_errs.join('<br>'))
    }
  },
  _validateOptions: function () {
    var INTEGER_PROPERTIES = ['timenav_height', 'timenav_height_min', 'marker_height_min', 'marker_width_min', 'marker_padding', 'start_at_slide', 'slide_padding_lr'];
    for (var i = 0; i < INTEGER_PROPERTIES.length; i++) {
      var opt = INTEGER_PROPERTIES[i];
      var value = this.options[opt];
      valid = !0;
      if (typeof (value) == 'number') {
        valid = (value == parseInt(value))
      }
      else if (typeof (value) == "string") {
        valid = (value.match(/^\s*(\-?\d+)?\s*$/))
      }
      if (!valid) {
        this.config.logError({
          message_key: 'invalid_integer_option',
          detail: opt
        })
      }
    }
  },
  _initLayout: function () {
    var self = this;
    this.message.removeFrom(this._el.container);
    this._el.container.innerHTML = "";
    if (this.options.timenav_position == "top") {
      this._el.timenav = TL.Dom.create('div', 'tl-timenav', this._el.container);
      this._el.storyslider = TL.Dom.create('div', 'tl-storyslider', this._el.container)
    }
    else {
      this._el.storyslider = TL.Dom.create('div', 'tl-storyslider', this._el.container);
      this._el.timenav = TL.Dom.create('div', 'tl-timenav', this._el.container)
    }
    this._el.menubar = TL.Dom.create('div', 'tl-menubar', this._el.container);
    this.options.width = this._el.container.offsetWidth;
    this.options.height = this._el.container.offsetHeight;
    this._el.storyslider.style.top = "1px";
    this.options.timenav_height = this._calculateTimeNavHeight(this.options.timenav_height);
    this._timenav = new TL.TimeNav(this._el.timenav, this.config, this.options);
    this._timenav.on('loaded', this._onTimeNavLoaded, this);
    this._timenav.on('update_timenav_min', this._updateTimeNavHeightMin, this);
    this._timenav.options.height = this.options.timenav_height;
    this._timenav.init();
    if (this.options.initial_zoom) {
      this.setZoom(this.options.initial_zoom)
    }
    this._storyslider = new TL.StorySlider(this._el.storyslider, this.config, this.options);
    this._storyslider.on('loaded', this._onStorySliderLoaded, this);
    this._storyslider.init();
    this._menubar = new TL.MenuBar(this._el.menubar, this._el.container, this.options);
    if (this.options.layout == "portrait") {
      this.options.storyslider_height = (this.options.height - this.options.timenav_height - 1)
    }
    else {
      this.options.storyslider_height = (this.options.height - 1)
    }
    this._updateDisplay(this._timenav.options.height, !0, 2000)
  },
  _initEvents: function () {
    this._timenav.on('change', this._onTimeNavChange, this);
    this._timenav.on('zoomtoggle', this._onZoomToggle, this);
    this._storyslider.on('change', this._onSlideChange, this);
    this._storyslider.on('colorchange', this._onColorChange, this);
    this._storyslider.on('nav_next', this._onStorySliderNext, this);
    this._storyslider.on('nav_previous', this._onStorySliderPrevious, this);
    this._menubar.on('zoom_in', this._onZoomIn, this);
    this._menubar.on('zoom_out', this._onZoomOut, this);
    this._menubar.on('back_to_start', this._onBackToStart, this)
  },
  _initGoogleAnalytics: function () {
    (function (i, s, o, g, r, a, m) {
      i.GoogleAnalyticsObject = r;
      i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
      a = s.createElement(o), m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    ga('create', this.options.ga_property_id, 'auto')
  },
  _initAnalytics: function () {
    if (this.options.ga_property_id === null) {
      return
    }
    this._initGoogleAnalytics();
    ga('send', 'pageview');
    var events = this.options.track_events;
    for (i = 0; i < events.length; i++) {
      var event_ = events[i];
      this.addEventListener(event_, function (e) {
        ga('send', 'event', e.type, 'clicked')
      })
    }
  },
  _onZoomToggle: function (e) {
    if (e.zoom == "in") {
      this._menubar.toogleZoomIn(e.show)
    }
    else if (e.zoom == "out") {
      this._menubar.toogleZoomOut(e.show)
    }
  },
  _getEventIndex: function (id) {
    for (var i = 0; i < this.config.events.length; i++) {
      if (id == this.config.events[i].unique_id) {
        return i
      }
    }
    return -1
  },
  _getSlideIndex: function (id) {
    if (this.config.title && this.config.title.unique_id == id) {
      return 0
    }
    for (var i = 0; i < this.config.events.length; i++) {
      if (id == this.config.events[i].unique_id) {
        return this.config.title ? i + 1 : i
      }
    }
    return -1
  },
  _onDataLoaded: function (e) {
    this.fire("dataloaded");
    this._initLayout();
    this._initEvents();
    this._initAnalytics();
    if (this.message) {
      this.message.hide()
    }
    this.ready = !0
  },
  showMessage: function (msg) {
    if (this.message) {
      this.message.updateMessage(msg)
    }
    else {
      trace("No message display available.")
      trace(msg)
    }
  },
  _onColorChange: function (e) {
    this.fire("color_change", {unique_id: this.current_id}, this);
    if (e.color || e.image) {
    }
    else {
    }
  },
  _onSlideChange: function (e) {
    if (this.current_id != e.unique_id) {
      this.current_id = e.unique_id;
      this._timenav.goToId(this.current_id);
      this._onChange(e)
    }
  },
  _onTimeNavChange: function (e) {
    if (this.current_id != e.unique_id) {
      this.current_id = e.unique_id;
      this._storyslider.goToId(this.current_id);
      this._onChange(e)
    }
  },
  _onChange: function (e) {
    this.fire("change", {unique_id: this.current_id}, this);
    if (this.options.hash_bookmark && this.current_id) {
      this._updateHashBookmark(this.current_id)
    }
  },
  _onBackToStart: function (e) {
    this._storyslider.goTo(0);
    this.fire("back_to_start", {unique_id: this.current_id}, this)
  },
  zoomIn: function () {
    this._timenav.zoomIn()
  },
  zoomOut: function () {
    this._timenav.zoomOut()
  },
  setZoom: function (level) {
    this._timenav.setZoom(level)
  },
  _onZoomIn: function (e) {
    this._timenav.zoomIn();
    this.fire("zoom_in", {zoom_level: this._timenav.options.scale_factor}, this)
  },
  _onZoomOut: function (e) {
    this._timenav.zoomOut();
    this.fire("zoom_out", {zoom_level: this._timenav.options.scale_factor}, this)
  },
  _onTimeNavLoaded: function () {
    this._loaded.timenav = !0;
    this._onLoaded()
  },
  _onStorySliderLoaded: function () {
    this._loaded.storyslider = !0;
    this._onLoaded()
  },
  _onStorySliderNext: function (e) {
    this.fire("nav_next", e)
  },
  _onStorySliderPrevious: function (e) {
    this.fire("nav_previous", e)
  },
  _onLoaded: function () {
    if (this._loaded.storyslider && this._loaded.timenav) {
      this.fire("loaded", this.config);
      if (this.options.hash_bookmark && window.location.hash != "") {
        this.goToId(window.location.hash.replace("#event-", ""))
      }
      else {
        if (TL.Util.isTrue(this.options.start_at_end) || this.options.start_at_slide > this.config.events.length) {
          this.goToEnd()
        }
        else {
          this.goTo(this.options.start_at_slide)
        }
        if (this.options.hash_bookmark) {
          this._updateHashBookmark(this.current_id)
        }
      }
    }
  }
});
TL.Timeline.source_path = (function () {
  var script_tags = document.getElementsByTagName('script');
  var src = script_tags[script_tags.length - 1].src;
  return src.substr(0, src.lastIndexOf('/'))
})()
