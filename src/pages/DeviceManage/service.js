import request from '@/utils/request';
import {API_URL} from "../../constants/DvaAndApiConfig";
import {stringify} from "qs";

export async function accessDevicesList(params) {
  return request(`${API_URL.deviceManage.accessDevicesList}?${stringify(params)}`);
}

export async function manageList(params) {
  console.log('service manageList',params)
  return request(`${API_URL.deviceManage.manageList}?${stringify(params)}`);
}

// 删除交换机
export async function manageRemoveSw(params) {
  return request(API_URL.deviceManage.manageRemoveSw, {
    method: 'POST',
    data: {...params},
  });
}

export async function addDevice(params) {
  // add user
  // ni_id: 1274
  // peer_type: USER
  // peer_id: 10072
  // note:
  //   switch_id: 1
  // in_server_id: 25
  // type: in

   // add server  接入新的设备
  // ni_id: 1274
  // peer_type: SERVER
  // note: 备注
  // name: test
  // switch_id: 1
  // in_server_id: 25
  // type: in

  // add server 接入已有的设备
  // ni_id: 1274
  // peer_type: SERVER
  // peer_id: 8150
  // note:
  //   switch_id: 1
  // in_server_id: 25
  // type: in

  // add switch 交换机
  // ni_id: 1274
  // peer_type: SWITCH
  // peer_id: 100
  // note:
  // switch_id: 1
  // in_server_id: 25
  // type: in
  return request(API_URL.deviceManage.addDevice, {
    method: 'POST',
    data: {...params},
  });
}

export async function addBindToDevice(params) {
  return request(API_URL.deviceManage.addBindToDevice, {
    method: 'POST',
    data: {...params},
  });
}

export async function searchServiceList(params) {
  console.log('service searchServiceList')
  return request(`${API_URL.deviceManage.searchServiceList}&${stringify(params)}`);
}

export async function searchUserList(params) {
  console.log('service searchUserList')
  return request(`${API_URL.deviceManage.searchUserList}&${stringify(params)}`);
}


export async function searchAccessDeviceList(params) {
  console.log('service searchAccessDeviceList')
  return request(`${API_URL.deviceManage.searchAccessDeviceList}?${stringify(params)}`);
}
export async function searchPeerAccessDeviceList(params) {
  console.log('service searchPeerAccessDeviceList')
  return request(`${API_URL.deviceManage.searchPeerAccessDeviceList}?${stringify(params)}`);
}

// 解除
export async function manageRelease(params) {
  console.log('service manageRelease')
  return request(`${API_URL.deviceManage.manageRelease}${params.id}`);
}

// 重置
export async function manageReset(params) {
  console.log('service manageReset')
  return request(`${API_URL.deviceManage.manageReset}${params.id}`);
}
// 禁用
export async function manageDisable(params) {
  console.log('service manageDisable')
  return request(`${API_URL.deviceManage.manageDisable}${params.id}`);
}
// 移动
export async function manageMove(params) {
  console.log('service manageMove')
  return request(API_URL.deviceManage.manageMove, {
    method: 'POST',
    data: {...params},
  });
}

// 更新交换机设备信息
export async function updateSwitchDeviceInfo(params) {
  console.log('service updateSwitchDeviceInfo')
  const formData = new FormData();
  console.log('pararma', params)
  formData.append('icon',params.icon)
  formData.append('values',JSON.stringify(params.values));
  return request(API_URL.deviceManage.updateSwitchDeviceInfo, {
    method: 'POST',
    data: formData,
  });

}
// 删除设备
export async function removeAccessDevice(params) {
  console.log('service removeAccessDevice')
  return request(API_URL.deviceManage.removeAccessDevice,{
      method: 'POST',
      data: {...params},
  });
}
// 获取交换机详情
export async function deviceDetail(params) {
  console.log('service deviceDetail')
  return request(`${API_URL.deviceManage.deviceDetail}${params.id}`);
}
