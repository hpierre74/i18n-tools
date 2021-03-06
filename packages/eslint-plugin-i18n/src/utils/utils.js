const fs = require('fs');
const path = require('path');

const recursiveGet = (object, keys, index) => {
  if (keys.length - index === 1) {
    return object[keys[index]];
  }

  return object[keys[index]] ? recursiveGet(object[keys[index]], keys, index + 1) : undefined;
};

exports.has = (object, key) => !!recursiveGet(object, key.split('.'), 0);

exports.get = (object, key) => recursiveGet(object, key.split('.'), 0);

exports.getKeyValue = key => {
  if (key.type === 'Literal') {
    return key.value;
  } else if (key.type === 'TemplateLiteral' && key.quasis.length === 1) {
    return key.quasis[0].value.cooked;
  }

  return null;
};

const expireAt = {};
const langConfig = {};

exports.getLangConfig = (config, languagesKey) => {
  if (!expireAt[languagesKey] || expireAt[languagesKey] <= Date.now() || config.disableCache) {
    langConfig[languagesKey] = config[languagesKey].map(({ name, translationPath }) => {
      try {
        const langFile = JSON.parse(fs.readFileSync(path.resolve(`${process.cwd()}/${translationPath}`)).toString());

        return {
          name,
          translation: langFile,
        };
      } catch (e) {
        return {
          name,
          translation: null,
        };
      }
    });
    expireAt[languagesKey] = Date.now() + (config.translationsCacheTTL || 500);
  }

  return langConfig[languagesKey];
};

const useTranslateParams = ['data', 'number', 'general', 'renderers'];

exports.areWeUsingUseTranslate = node => {
  if (!node || !node.properties) {
    return [false, null];
  }

  const params = node.properties.reduce((acc, property) => {
    if (useTranslateParams.includes(property.key.name)) {
      return Object.assign(acc, { [property.key.name]: property });
    }

    return acc;
  }, {});

  const usingHook = Object.keys(params).length;

  return [usingHook, params];
};
