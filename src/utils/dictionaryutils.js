import {DISPATCH} from "../constants/DvaAndApiConfig";
import _ from 'lodash'
import {NewAccessDevice, ResponseDataResult, ServiceAclStatus} from "../constants/constants";

/**
 * 获取设备中的服务列表
 * @param dispatch
 * @param cb
 */
export const fetchServices = (dispatch, value, cb) => {
  dispatch({
    type: DISPATCH.deviceManage.searchServiceList,
    payload: {...value},
    callback: (res) => {
      const data = [];
      if (res.r === ResponseDataResult.OK) {
        res.datas.forEach(item => {
          data.push({
            value: item.peer_id,
            text: item.peer_name,
          });
        })
      }
      cb(data)
      console.log('fetchServices result is', data)
    }
  });
}


/**
 * 获取用户列表
 * @param dispatch
 * @param cb
 */
export const fetchUsers = (dispatch, value, cb) => {
  dispatch({
    type: DISPATCH.deviceManage.searchUserList,
    payload: {...{key: value}},
    callback: (res) => {
      const data = [];
      if (res.r === ResponseDataResult.OK) {
        res.datas.forEach(item => {
          data.push({
            value: item.peer_id,
            text: item.peer_name,
          });
        })
      }
      cb(data)
      console.log('fetchUsers result is', data)
    }
  });
}


/**
 * 获取接入（网口）设备列表
 * @param dispatch
 * @param cb
 */
export const fetchAccessDevices = (dispatch, value, cb,removeId = -1) => {
  dispatch({
    type: DISPATCH.deviceManage.searchAccessDeviceList,
    payload: {...{search: value, ignorePage: true,}},
    callback: (res) => {
      const data = [];
      if (res.r === ResponseDataResult.OK) {
        res.list.forEach(item => {
         if(removeId != item.id){
           data.push({
             value: item.id,
             text: item.name,
           });
         }
        })
      }
      cb(data)
      console.log('fetchAccessServices result is', data)
    }
  });
}


/**
 * 获取服务列表
 * @param dispatch
 * @param cb
 */
export const fetchPeerAccessDevices = (dispatch, value, cb,removeId = -1) => {
  dispatch({
    type: DISPATCH.deviceManage.searchPeerAccessDeviceList,
    payload: {...{search: value,ignorePage: true,}},
    callback: (res) => {
      const data = [{text:NewAccessDevice.desc,value:NewAccessDevice.key}];
      if (res.r === ResponseDataResult.OK) {
        res.list.forEach(item => {
          console.log('remove id is ',removeId)
          if(removeId != item.id){
            data.push({
              value: item.id,
              text: item.name,
            });
          }
        })
      }
      cb(data)
      console.log('fetchPeerAccessDevices result is', data)
    }
  });
}



/**
 * 获取用户设备列表
 * @param dispatch
 * @param cb
 */
export const getUserDevices = (dispatch, userId, callback) => {
  dispatch({
    type: DISPATCH.userManage.userDevices,
    payload: {userId: userId},
    callback: (res) => {
      callback(res)
    }
  });
}

