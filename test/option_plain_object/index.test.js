import assert from 'assert';
import stylus from 'stylus';
import Promise from 'bluebird';
import path from 'path';
import _fs from 'fs';
import _rimraf from 'rimraf';

const rimraf = Promise.promisify(_rimraf);
const fs = Promise.promisifyAll(_fs);

const OUT_PATH = path.resolve(__dirname, './vars.js');
const SOURCE_PATH = path.resolve(__dirname, './vars.styl');

describe('plainObject option:', () => {
  describe('from value', () => {
    let vars;
    let nestedVars;
    let varsTuple;
    let varsList;
    before(() => {
      return Promise
        .try(() => rimraf(OUT_PATH))
        .then(() => fs.readFileAsync(SOURCE_PATH, 'utf8'))
        .then(stylusStr => {
          stylus(stylusStr)
            .use(require(path.resolve(process.cwd(), './src/index.js'))())
            .render(() => {
              vars = require(OUT_PATH).varObj;
              nestedVars = vars.varNestedObj;
              varsTuple = vars.varObjTuple;
              varsList = vars.varObjList;
            });
        });
    });

    it('number', () => {
      assert.strictEqual(vars.varNumber, 123);
    });

    it('string', () => {
      assert.strictEqual(vars.varString, 'some text');
    });

    it('ident', () => {
      assert.strictEqual(vars.varIdent, 'auto');
    });

    it('unit', () => {
      assert.strictEqual(vars.varUnit, 456);
    });

    it('rgba', () => {
      assert.deepEqual(vars.varRgba, [11, 22, 33, .4]);
    });

    it('list', () => {
      assert.deepEqual(vars.varList, [1, 2, 3, 4]);
    });

    it('tuple', () => {
      assert.deepEqual(vars.varTuple, [1, 2, 3, 4]);
    });

    it('tuple list', () => {
      assert.deepEqual(vars.varTupleList, [[1, 2, 3, 4], [5, 6, 7, 8]]);
    });

    it('list tuple', () => {
      assert.deepEqual(vars.varListTuple, [[1, 2, 3, 4], [5, 6, 7, 8]]);
    });

    it('tuples', () => {
      assert.deepEqual(vars.varTuples, [[1, 2, 3, 4], [5, 6, 7, 8]]);
    });

    it('lists', () => {
      assert.deepEqual(vars.varLists, [[1, 2, 3, 4], [5, 6, 7, 8]]);
    });

    describe('nested values', () => {
      it('number', () => {
        assert.strictEqual(nestedVars.varNumber, 123);
      });

      it('string', () => {
        assert.strictEqual(nestedVars.varString, 'some text');
      });

      it('ident', () => {
        assert.strictEqual(nestedVars.varIdent, 'auto');
      });

      it('unit', () => {
        assert.strictEqual(nestedVars.varUnit, 456);
      });

      it('rgba', () => {
        assert.deepEqual(nestedVars.varRgba, [11, 22, 33, .4]);
      });

      it('list', () => {
        assert.deepEqual(nestedVars.varList, [1, 2, 3, 4]);
      });

      it('tuple', () => {
        assert.deepEqual(nestedVars.varTuple, [1, 2, 3, 4]);
      });

      it('tuple list', () => {
        assert.deepEqual(nestedVars.varTupleList, [[1, 2, 3, 4], [5, 6, 7, 8]]);
      });

      it('list tuple', () => {
        assert.deepEqual(nestedVars.varListTuple, [[1, 2, 3, 4], [5, 6, 7, 8]]);
      });

      it('tuples', () => {
        assert.deepEqual(nestedVars.varTuples, [[1, 2, 3, 4], [5, 6, 7, 8]]);
      });

      it('lists', () => {
        assert.deepEqual(nestedVars.varLists, [[1, 2, 3, 4], [5, 6, 7, 8]]);
      });
    });

    describe('nested tuple', () => {
      it('number', () => {
        assert.strictEqual(varsTuple[0].varNumber, 123);
        assert.strictEqual(varsTuple[1].varNumber, 123);
      });

      it('string', () => {
        assert.strictEqual(varsTuple[0].varString, 'some text');
        assert.strictEqual(varsTuple[1].varString, 'some text');
      });

      it('ident', () => {
        assert.strictEqual(varsTuple[0].varIdent, 'auto');
        assert.strictEqual(varsTuple[1].varIdent, 'auto');
      });

      it('unit', () => {
        assert.strictEqual(varsTuple[0].varUnit, 456);
        assert.strictEqual(varsTuple[1].varUnit, 456);
      });

      it('rgba', () => {
        assert.deepEqual(varsTuple[0].varRgba, [11, 22, 33, .4]);
        assert.deepEqual(varsTuple[1].varRgba, [11, 22, 33, .4]);
      });

      it('list', () => {
        assert.deepEqual(varsTuple[0].varList, [1, 2, 3, 4]);
        assert.deepEqual(varsTuple[1].varList, [1, 2, 3, 4]);
      });

      it('tuple', () => {
        assert.deepEqual(varsTuple[0].varTuple, [1, 2, 3, 4]);
        assert.deepEqual(varsTuple[1].varTuple, [1, 2, 3, 4]);
      });

      it('tuple list', () => {
        assert.deepEqual(varsTuple[0].varTupleList, [[1, 2, 3, 4], [5, 6, 7, 8]]);
        assert.deepEqual(varsTuple[1].varTupleList, [[1, 2, 3, 4], [5, 6, 7, 8]]);
      });

      it('list tuple', () => {
        assert.deepEqual(varsTuple[0].varListTuple, [[1, 2, 3, 4], [5, 6, 7, 8]]);
        assert.deepEqual(varsTuple[1].varListTuple, [[1, 2, 3, 4], [5, 6, 7, 8]]);
      });

      it('tuples', () => {
        assert.deepEqual(varsTuple[0].varTuples, [[1, 2, 3, 4], [5, 6, 7, 8]]);
        assert.deepEqual(varsTuple[1].varTuples, [[1, 2, 3, 4], [5, 6, 7, 8]]);
      });

      it('lists', () => {
        assert.deepEqual(varsTuple[0].varLists, [[1, 2, 3, 4], [5, 6, 7, 8]]);
        assert.deepEqual(varsTuple[1].varLists, [[1, 2, 3, 4], [5, 6, 7, 8]]);
      });
    });

    describe('nested list', () => {
      it('number', () => {
        assert.strictEqual(varsList[0].varNumber, 123);
        assert.strictEqual(varsList[1].varNumber, 123);
      });

      it('string', () => {
        assert.strictEqual(varsList[0].varString, 'some text');
        assert.strictEqual(varsList[1].varString, 'some text');
      });

      it('ident', () => {
        assert.strictEqual(varsList[0].varIdent, 'auto');
        assert.strictEqual(varsList[1].varIdent, 'auto');
      });

      it('unit', () => {
        assert.strictEqual(varsList[0].varUnit, 456);
        assert.strictEqual(varsList[1].varUnit, 456);
      });

      it('rgba', () => {
        assert.deepEqual(varsList[0].varRgba, [11, 22, 33, .4]);
        assert.deepEqual(varsList[1].varRgba, [11, 22, 33, .4]);
      });

      it('list', () => {
        assert.deepEqual(varsList[0].varList, [1, 2, 3, 4]);
        assert.deepEqual(varsList[1].varList, [1, 2, 3, 4]);
      });

      it('tuple', () => {
        assert.deepEqual(varsList[0].varTuple, [1, 2, 3, 4]);
        assert.deepEqual(varsList[1].varTuple, [1, 2, 3, 4]);
      });

      it('tuple list', () => {
        assert.deepEqual(varsList[0].varTupleList, [[1, 2, 3, 4], [5, 6, 7, 8]]);
        assert.deepEqual(varsList[1].varTupleList, [[1, 2, 3, 4], [5, 6, 7, 8]]);
      });

      it('list tuple', () => {
        assert.deepEqual(varsList[0].varListTuple, [[1, 2, 3, 4], [5, 6, 7, 8]]);
        assert.deepEqual(varsList[1].varListTuple, [[1, 2, 3, 4], [5, 6, 7, 8]]);
      });

      it('tuples', () => {
        assert.deepEqual(varsList[0].varTuples, [[1, 2, 3, 4], [5, 6, 7, 8]]);
        assert.deepEqual(varsList[1].varTuples, [[1, 2, 3, 4], [5, 6, 7, 8]]);
      });

      it('lists', () => {
        assert.deepEqual(varsList[0].varLists, [[1, 2, 3, 4], [5, 6, 7, 8]]);
        assert.deepEqual(varsList[1].varLists, [[1, 2, 3, 4], [5, 6, 7, 8]]);
      });
    });
  });
});
