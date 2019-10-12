
const API_SERVER = '';
const API_DEV_SERVER =  '127.0.0.1:3000'
const api_no_pagination = true; //本地列表分页自动转换
const isDev = true;
export default {
  API_SERVER: API_SERVER,
  API_DEV_SERVER: API_DEV_SERVER,
  api_no_pagination: api_no_pagination,
  isDev: isDev,
  getServerUrl: () => {
    return `http://${isDev ? API_DEV_SERVER : API_SERVER}`;
  },
  getSocketServerUrl: () => {
    return `ws://${isDev ? API_DEV_SERVER : API_SERVER}`;
  },
};
