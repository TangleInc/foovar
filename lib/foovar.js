'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _StylusExpression = require('./StylusExpression.js');

var _StylusExpression2 = _interopRequireDefault(_StylusExpression);

var _FoovarValue = require('./FoovarValue.js');

var _FoovarValue2 = _interopRequireDefault(_FoovarValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function foovarFuncFactory(globalOptions) {
  globalOptions = globalOptions || {};

  return function foovarFunc(outPath, options) {
    var _this = this;

    var TEST = process.env.BABEL_ENV === '__foovar_internal_test__';
    outPath = new _StylusExpression2.default(outPath).unwrap();
    if (outPath.constructorName !== 'String') {
      console.error('foovar outPath arg must be string');
      return;
    }
    outPath = outPath.val.trim();
    var fullPath = /^\//.test(outPath) ? outPath : _path2.default.resolve(process.cwd(), outPath);

    var localOptions = optionsResolver(options);
    var include = localOptions.include,
        exclude = localOptions.exclude,
        noGeneratedLog = localOptions.noGeneratedLog,
        compress = localOptions.compress,
        plainObject = localOptions.plainObject,
        propertyCase = localOptions.propertyCase;


    var incReg = localOptions.hasOwnProperty('include') ? include && include.constructorName === 'String' && new RegExp(include.val) : globalOptions.include;
    var excReg = localOptions.hasOwnProperty('exclude') ? exclude && exclude.constructorName === 'String' && new RegExp(exclude.val) : globalOptions.exclude;
    var noGen = localOptions.hasOwnProperty('noGen') ? noGeneratedLog && noGeneratedLog.val : globalOptions.noGen;
    var comp = localOptions.hasOwnProperty('compress') ? compress && !!compress.val : !!globalOptions.compress;
    _FoovarValue2.default.case = localOptions.hasOwnProperty('propertyCase') ? propertyCase && propertyCase.val : globalOptions.propertyCase;
    if (!localOptions.hasOwnProperty('plainObject')) {
      plainObject = { val: globalOptions.plainObject || null };
    }

    var FoovarValueCase = _FoovarValue2.default.case && '\'' + _FoovarValue2.default.case + '\'';

    var plain = void 0;
    if (plainObject == null || plainObject.val == null) {
      plain = false;
    } else {
      switch (plainObject.val) {
        case 'css':
        case 'type':
        case 'tree':
          plain = '\'' + plainObject.val + '\'';
          break;
        default:
          plain = "'value'";
      }
    }

    _mkdirp2.default.sync(_path2.default.dirname(fullPath));
    var ignoreKeys = ['column', 'filename', 'lineno', 'mixin', 'preserve', 'property', 'quote', 'rest'];
    var replacer = function replacer(k, v) {
      return ~ignoreKeys.indexOf(k) ? void 0 : v;
    };
    var body = Object.keys(this.global.scope.locals).map(function (k) {
      return [k, _this.global.scope.locals[k]];
    }).filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          k = _ref2[0],
          v = _ref2[1];

      if (v instanceof Function) return false;
      if (incReg && !incReg.test(k)) return false;
      if (excReg && excReg.test(k)) return false;
      return true;
    }).map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          k = _ref4[0],
          v = _ref4[1];

      var foovarValueStr = 'new F(new S(' + JSON.stringify(v, replacer, 0) + ',true),{case:' + FoovarValueCase + '})';
      if (plain) {
        foovarValueStr = 'p(' + foovarValueStr + ',{from:' + plain + '})';
      }
      return '\'' + _FoovarValue2.default.resolvePropertyKey(k) + '\':' + foovarValueStr.replace(/^(.+)$/gm, '$1');
    }).join(comp ? ',' : ',\n');

    var requirePathForFoovarValue = TEST ? '\'' + _path2.default.resolve(process.cwd(), 'src/FoovarValue.js') + '\'' : '\'foovar/lib/FoovarValue\'';
    var requirePathForStylusExpression = TEST ? '\'' + _path2.default.resolve(process.cwd(), 'src/StylusExpression.js') + '\'' : '\'foovar/lib/StylusExpression\'';
    var requirePathForConvertToPlainObject = TEST ? '\'' + _path2.default.resolve(process.cwd(), 'src/convertToPlainObject.js') + '\'' : '\'foovar/lib/convertToPlainObject\'';
    var requireConvertToPlainObject = plain ? 'var p=require(' + requirePathForConvertToPlainObject + ');' : '';
    var setPropertyCase = 'F.case=' + (FoovarValueCase || null) + ';';
    var codeStr = '(function(){var F=require(' + requirePathForFoovarValue + ');' + setPropertyCase + 'var S=require(' + requirePathForStylusExpression + ');' + requireConvertToPlainObject + 'module.exports={' + (comp ? '' : '\n') + body + '};})();';

    if (typeof globalOptions.writeFile === 'function') {
      globalOptions.writeFile(fullPath, codeStr);
    } else {
      _fs2.default.writeFileSync(fullPath, codeStr, 'utf8');
    }
    if (!noGen) {
      console.log('foovar: generated ' + fullPath);
    }
  };

  function optionsResolver(options) {
    options = new _StylusExpression2.default(options || new this.renderer.nodes.Object()).unwrap();
    if (options.constructorName !== 'Object') {
      console.error('foovar options arg must be object');
      return {};
    }
    return Object.keys(options.vals).reduce(function (unwrapped, k) {
      unwrapped[k] = options.vals[k] && new _StylusExpression2.default(options.vals[k]).unwrap();
      return unwrapped;
    }, {});
  }
};