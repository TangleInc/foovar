import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';
import StylusExpression from './StylusExpression.js';
import FoovarValue from './FoovarValue.js';

module.exports = function foovarFuncFactory(globalOptions) {
  globalOptions = globalOptions || {};

  return function foovarFunc(outPath, options) {
    const TEST = process.env.BABEL_ENV === '__foovar_internal_test__';
    outPath = new StylusExpression(outPath).unwrap();
    if (outPath.constructorName !== 'String') {
      console.error('foovar outPath arg must be string');
      return;
    }
    outPath = outPath.val.trim();
    const fullPath = /^\//.test(outPath) ? outPath : path.resolve(process.cwd(), outPath);

    const localOptions = optionsResolver(options);
    let { include, exclude, noGeneratedLog, compress, plainObject, propertyCase } = localOptions;

    const incReg = localOptions.hasOwnProperty('include')
      ? include && include.constructorName === 'String' && new RegExp(include.val)
      : globalOptions.include;
    const excReg = localOptions.hasOwnProperty('exclude')
      ? exclude && exclude.constructorName === 'String' && new RegExp(exclude.val)
      : globalOptions.exclude;
    const noGen = localOptions.hasOwnProperty('noGen')
      ? noGeneratedLog && noGeneratedLog.val
      : globalOptions.noGen;
    const comp = localOptions.hasOwnProperty('compress')
      ? compress && !!compress.val
      : !!globalOptions.compress;
    FoovarValue.case = localOptions.hasOwnProperty('propertyCase')
      ? propertyCase && propertyCase.val
      : globalOptions.propertyCase;
    if (!localOptions.hasOwnProperty('plainObject')) {
      plainObject = {val: globalOptions.plainObject || null};
    }

    const FoovarValueCase = FoovarValue.case && `'${ FoovarValue.case }'`;

    let plain;
    if (plainObject == null || plainObject.val == null) {
      plain = false;
    } else {
      switch (plainObject.val) {
      case 'css':
      case 'type':
      case 'tree':
        plain = `'${ plainObject.val }'`;
        break;
      default:
        plain = "'value'";
      }
    }

    mkdirp.sync(path.dirname(fullPath));
    const ignoreKeys = [
      'column',
      'filename',
      'lineno',
      'mixin',
      'preserve',
      'property',
      'quote',
      'rest',
    ];
    const replacer = (k, v) => {
      return ~ignoreKeys.indexOf(k) ? void 0 : v;
    };
    const body = Object.keys(this.global.scope.locals)
      .map(k => [k, this.global.scope.locals[k]])
      .filter(([k, v]) => {
        if (v instanceof Function) return false;
        if (incReg && !incReg.test(k)) return false;
        if (excReg && excReg.test(k)) return false;
        return true;
      })
      .map(([k, v]) => {
        let foovarValueStr = `new F(new S(${ JSON.stringify(v, replacer, 0) },true),{case:${ FoovarValueCase }})`;
        if (plain) {
          foovarValueStr = `p(${ foovarValueStr },{from:${ plain }})`;
        }
        return `'${ FoovarValue.resolvePropertyKey(k) }':${ foovarValueStr.replace(/^(.+)$/gm , '$1')}`;
      })
      .join(comp ? ',' : ',\n');

    const requirePathForFoovarValue = TEST ? `'${ path.resolve(process.cwd(), 'src/FoovarValue.js') }'` : '\'foovar/lib/FoovarValue\'';
    const requirePathForStylusExpression = TEST ? `'${ path.resolve(process.cwd(), 'src/StylusExpression.js') }'` : '\'foovar/lib/StylusExpression\'';
    const requirePathForConvertToPlainObject = TEST ? `'${ path.resolve(process.cwd(), 'src/convertToPlainObject.js') }'` : '\'foovar/lib/convertToPlainObject\'';
    const requireConvertToPlainObject = plain ? `var p=require(${requirePathForConvertToPlainObject});` : '';
    const setPropertyCase = `F.case=${FoovarValueCase || null};`;
    const codeStr = `(function(){var F=require(${requirePathForFoovarValue});${setPropertyCase}var S=require(${requirePathForStylusExpression});${requireConvertToPlainObject}module.exports={${ comp ? '' : '\n' }${ body }};})();`;

    if (typeof globalOptions.writeFile === 'function') {
      globalOptions.writeFile(fullPath, codeStr);
    } else {
      fs.writeFileSync(fullPath, codeStr, 'utf8');
    }
    if (!noGen) { console.log(`foovar: generated ${ fullPath }`); }
  };

  function optionsResolver(options) {
    options = new StylusExpression(options || new this.renderer.nodes.Object()).unwrap();
    if (options.constructorName !== 'Object') {
      console.error('foovar options arg must be object');
      return {};
    }
    return Object.keys(options.vals).reduce((unwrapped, k) => {
      unwrapped[k] = options.vals[k] && new StylusExpression(options.vals[k]).unwrap();
      return unwrapped;
    }, {});
  }
}
