import React from 'react';
// eslint-disable-next-line import/no-cycle
import PromiseRender from './PromiseRender';
import { CURRENT } from './renderAuthorize';

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 | Permission judgment } authority
 * @param { 你的权限 | Your permission description } currentAuthority
 * @param { 通过的组件 | Passing components } target
 * @param { 未通过的组件 | no pass components } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  // 没有判定权限.默认查看所有
  // Retirement authority, return target;
  if (!authority) {
    return target;
  }

  //针对 p1和p2两个平台特别处理，平台权限（p1和p2）高于用户权限
  if(Array.isArray(authority) && Array.isArray(currentAuthority)){
    if((authority.includes('p1') && currentAuthority.includes('p1')) || (authority.includes('p2') && currentAuthority.includes('p2'))){
    }else {
      return Exception;
    }
  }
  let _authority = [];
  for (let auth of authority){
    if(auth!=='p1' && auth!=='p2'){
      _authority.push(auth)
    }
  }
  let _currentAuthority = [];
  for (let item of currentAuthority){
    if(item!=='p1' && item!=='p2'){
      _currentAuthority.push(item)
    }
  }

  // 数组处理
  if (Array.isArray(_authority)) {
    if (Array.isArray(_currentAuthority)) {
      if (_currentAuthority.some(item => _authority.includes(item))) {
        return target;
      }
    } else if (_authority.includes(_currentAuthority)) {
      return target;
    }
    return Exception;
  }
  // string 处理
  if (typeof authority === 'string') {
    if (Array.isArray(currentAuthority)) {
      if (currentAuthority.some(item => authority === item)) {
        return target;
      }
    } else if (authority === currentAuthority) {
      return target;
    }
    return Exception;
  }
  // Promise 处理
  if (authority instanceof Promise) {
    return <PromiseRender ok={target} error={Exception} promise={authority} />;
  }
  // Function 处理
  if (typeof authority === 'function') {
    try {
      const bool = authority(currentAuthority);
      // 函数执行后返回值是 Promise
      if (bool instanceof Promise) {
        return <PromiseRender ok={target} error={Exception} promise={bool} />;
      }
      if (bool) {
        return target;
      }
      return Exception;
    } catch (error) {
      throw error;
    }
  }
  throw new Error('unsupported parameters');
};

export { checkPermissions };

const check = (authority, target, Exception) =>
  checkPermissions(authority, CURRENT, target, Exception);

export default check;
