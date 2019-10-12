import {isEmpty} from "./StringUtil";

/**
 * 精确检索
 * @param json
 * @param keys
 * @returns {json}
 */
export const formatFilter = function (json, ...keys) {
  if (!json || Object.keys(json).length <= 0) {
    return json
  }
  let _obj = JSON.parse(JSON.stringify(json));
  if (!('filter' in _obj)) {
    _obj['filter'] = {}
  }
  for (let k in json) {
    if (keys.indexOf(k) !== -1) {
      if (isEmpty(json[k])) {
        continue;
      }
      _obj.filter[k] = json[k];
    } else {
      _obj[k] = json[k]
    }
  }
  return _obj;
};

/***
 * 多参数精确检索
 * @param json
 * @param keys
 * @returns {json}
 */
export const formatFilterMulti = function (json, ...keys) {
  if (!json || Object.keys(json).length <= 0) {
    return json
  }
  let _obj = JSON.parse(JSON.stringify(json));
  if (!('filter' in _obj)) {
    _obj['filter'] = {}
  }
  for (let k in json) {
    if (keys.indexOf(k) !== -1) {
      if (isEmpty(json[k])) {
        continue;
      }
      _obj.filter[k] = json[k].split(',');
    } else {
      _obj[k] = json[k]
    }
  }
  return _obj;
};

/**
 * 模糊检索
 * @param json
 * @param keys
 * @returns {json}
 */
export const formatSearch = function (json, ...keys) {
  if (!json || Object.keys(json).length <= 0) {
    return json
  }
  let _obj = JSON.parse(JSON.stringify(json));
  if (!('search' in _obj)) {
    _obj['search'] = {}
  }
  for (let k in json) {
    if (keys.indexOf(k) !== -1) {
      if (isEmpty(json[k])) {
        continue;
      }
      _obj.search[k] = json[k];
    } else {
      _obj[k] = json[k]
    }
  }
  return _obj;
};

/***
 * 清除filter与search之外的参数
 * @param json
 */
export const clearParams = function (json, ...paramNames) {
  let mJson = {}
  console.log('clearParams');
  Object.assign(mJson, json)
  for (let k in json) {
    if (k !== 'filter' && k !== 'search' && k !== 'currentPage' && k !== "pageSize" && paramNames.indexOf(k) != -1) {
      console.log('clearParams:', k);
      // if (isEmpty(json[k])) {
      console.log('it is empty', k)
      delete mJson[k]
      // }
    }
  }
  return mJson
}
