import request from '@/utils/request';
import {API_URL} from "../constants/DvaAndApiConfig";

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request(API_URL.user.adminInfo);
}

export async function queryNotices() {
  return request('/api/notices');
}
