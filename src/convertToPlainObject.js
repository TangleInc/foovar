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
  case 'type':
    return convertToPlainObjectFromType(foovarValue);
  case 'tree':
    return convertToPlainObjectFromTree(foovarValue);
  }
}

function isNoRecursiveValue(v) {
  return v == null || typeof v === 'string' || typeof v === 'boolean' || typeof v === 'number';
}

function convertToPlainObjectFromTree(foovarValue) {
  var { css, type } = foovarValue;
  var value = foovarValue;
  if (foovarValue.__is_foovarValue) {
    value = foovarValue();
  }
  if (isNoRecursiveValue(value)) {
    return { value, css, type };
  } else if (Array.isArray(value)) {
    return { value: value.map(convertToPlainObjectFromValue), css, type };
  } else {
    return {
      value: Object.keys(value)
      .reduce((acc, k) => {
        acc[k] = convertToPlainObjectFromTree(value[k]);
        return acc;
      }, {}),
      css,
      type
    };
  }
}

function convertToPlainObjectFromValue(foovarValue) {
  if (foovarValue.__is_foovarValue) {
    foovarValue = foovarValue();
  }
  if (isNoRecursiveValue(foovarValue)) {
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
  if (foovarValue.__is_foovarValue) {
    const foovarCss = foovarValue.css;
    const foovarType = foovarValue.type;
    foovarValue = foovarValue();
    if (foovarValue == null || typeof foovarValue === 'boolean') {
      return void 0;
    } else if (foovarType === 'tuple' || foovarType === 'list' || foovarType === 'hash') {
      return convertToPlainObjectFromCss(foovarValue);
    } else {
      return foovarCss;
    }
  } else {
    if (isNoRecursiveValue(foovarValue)) {
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

function convertToPlainObjectFromType(foovarValue) {
  if (foovarValue.__is_foovarValue) {
    const foovarType = foovarValue.type;
    foovarValue = foovarValue();
    if (foovarValue === void 0) {
      return void 0;
    } else if (foovarType === 'tuple' || foovarType === 'list' || foovarType === 'hash') {
      return convertToPlainObjectFromType(foovarValue);
    } else {
      return foovarType;
    }
  } else {
    if (isNoRecursiveValue(foovarValue)) {
      return foovarValue;
    } else if (Array.isArray(foovarValue)) {
      return foovarValue.map(convertToPlainObjectFromType);
    } else {
      return Object.keys(foovarValue)
      .reduce((acc, k) => {
        acc[k] = convertToPlainObjectFromType(foovarValue[k]);
        return acc;
      }, {});
    }
  }
}

module.exports = convertToPlainObject;
