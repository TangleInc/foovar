import FoovarValue from './FoovarValue.js';

function convertToPlainObject(foovarValue, options) {
  options = Object.assign({
    from: 'value'
  }, options);

  switch (options.from) {
  case 'value':
    return convertToPlainObjectFromValue(foovarValue);
  case 'css':
    return convertToPlainObjectFromCss(foovarValue);
  }
}

function convertToPlainObjectFromValue(foovarValue) {
  if (foovarValue instanceof FoovarValue) {
    foovarValue = foovarValue();
  }
  if (foovarValue == null || typeof foovarValue === 'string' || typeof foovarValue === 'number') {
    return foovarValue;
  } else if (Array.isArray(foovarValue)) {
    return foovarValue.map(convertToPlainObjectFromValue);
  } else {
    return Object.keys(foovarValue)
    .reduce((acc, k) => {
      acc[k] = convertToPlainObjectFromValue(foovarValue[k]);
      return acc;
    }, {});
  }
}

function convertToPlainObjectFromCss(foovarValue) {
  if (foovarValue instanceof FoovarValue) {
    const foovarCss = foovarValue.css;
    const foovarType = foovarValue.type;
    foovarValue = foovarValue();
    if (foovarValue == null) {
      return foovarValue;
    } else if (foovarType === 'tuple' || foovarType === 'list' || foovarType === 'hash') {
      return convertToPlainObjectFromCss(foovarValue);
    } else {
      return foovarCss;
    }
  } else {
    if (foovarValue == null || typeof foovarValue === 'string' || typeof foovarValue === 'number') {
      return foovarValue;
    } else if (Array.isArray(foovarValue)) {
      return foovarValue.map(convertToPlainObjectFromCss);
    } else {
      return Object.keys(foovarValue)
      .reduce((acc, k) => {
        acc[k] = convertToPlainObjectFromCss(foovarValue[k]);
        return acc;
      }, {});
    }
  }
}

module.exports = convertToPlainObject;
