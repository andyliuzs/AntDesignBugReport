/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import router from 'umi/router';
import { notification } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import {IEVersion} from "./utils";

const getCodeMessage =(code,defaultMsg)=>{
  const message = formatMessage({id:`app.globalApp.httpResponse.${code}`}) || `${code} ${defaultMsg}`
  console.log('getCodeMessage',code ,message)
  return  message
}
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response } = error;

  if (response && response.status) {
    const errorText = getCodeMessage(response.status, response.statusText);
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });

    // pro 4.0已经不提供这个逻辑  自己手动加入的
    if (status === 403) {
      router.push('/exception/exception403');
      return;
    }
    // if (status <= 504 && status >= 500) {
    //   router.push('/exception/exception500');
    //   return;
    // }
    // if (status >= 404 && status < 422) {
    //   router.push('/exception/exception404');
    // }
  }
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

request.interceptors.request.use((url, options) => {
  console.log('interceptors options', options)
  let lastUrl;
  let isIE = IEVersion() > -1
  //只有IE需要处理刷新数据
  if (isIE && options && options['method'] === 'get') {
    let pIndex = _.indexOf(url, "?")
    if (pIndex !== -1) {
      if (pIndex === url.length - 1) {
        lastUrl = `${url}t=${new Date().getTime()}`
      } else {
        lastUrl = `${url}&t=${new Date().getTime()}`
      }
    } else {
      lastUrl = `${url}?t=${new Date().getTime()}`
    }
  } else {
    lastUrl = url;
  }
  // http请求头加入客户端类型
  options['headers'] ={...options['headers'],...{_clinet:'web'}}
  console.log('interceptors lastUrl=', lastUrl)
  return (
    {
      url: lastUrl,
      options: {...options, interceptors: true},
    }
  );
});
export default request;
