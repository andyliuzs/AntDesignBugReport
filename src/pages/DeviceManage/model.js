import {
  accessDevicesList,
  manageList,
  manageRemoveSw,
  addDevice,
  searchServiceList,
  searchUserList,
  searchPeerAccessDeviceList,
  searchAccessDeviceList,
  manageRelease,
  manageReset,
  manageDisable,
  addBindToDevice,
  manageMove,
  updateSwitchDeviceInfo,
  removeAccessDevice,
  deviceDetail
} from './service';
import {AddDeviceConnMethodType, AddDeviceSteps, DeviceType, ResponseDataResult} from "../../constants/constants";


import {formatMessage} from 'umi-plugin-react/locale';

function formatResponse(response) {
  if (response) {
    return response
  }
  return {r: 'fail', msg: formatMessage({id: 'app.cb.globalApp.netbusy'})}
}


const Model = {
  namespace: 'deviceManage',
  state: {
    accessData: {
      list: [],
      pagination: {},
    },
    manageData: { // 服务设备 用户设备 列表
      list: [],
      pagination: {},
      stat: {
        user_count: 0,
        server_count: 0
      }
    },
    adCurrentStep: AddDeviceSteps.Step1.desc,// 添加设备 当前步骤
    adStepStatus: { // 添加设备详细参数
      deviceType: undefined,// DeviceType.UserDeviceType.key,
      accessMethod: AddDeviceConnMethodType.AccessType.key,// 接入设备 连接方式
      userId: undefined,
      deviceId1: undefined,
      deviceId2: undefined,
      serverId: undefined,
      invateCode: undefined,
      ip: undefined,
      adResult: {},
    },

    serviceList: [],// 检索服务列表
    userList: [], // 用户列表
    accessServiceList: [], // 选择列表接入设备列表
  },
  effects: {

    * accessDevicesList({payload, callback}, {call, put}) {
      const response = yield call(accessDevicesList, payload);
      if (response?.r === ResponseDataResult.OK) {
        yield put({
          type: 'queryAccessDevicesList',
          payload: response,
        });
      }
      console.log('accessDevicesList response', response)
      if (callback) {
        callback(formatResponse(response))
      }
    },
    * manageList({payload, callback}, {call, put}) {
      const response = yield call(manageList, payload);
      yield put({
        type: 'saveManageList',
        payload: response,
      });
      console.log('saveManageList response', response)
      if (callback) {
        callback(formatResponse(response))
      }
    },

    * manageRemoveSw({payload, callback}, {call}) {
      const response = yield call(manageRemoveSw, payload);
      if (callback) {
        callback(formatResponse(response))
      }
    },

    * addDevice({payload, callback}, {call, put}) {
      const response = yield call(addDevice, payload);
      if (response.r == ResponseDataResult.OK) {
        yield put({
          type: 'saveAddResult',
          payload: response.data,
        });
      }
      if (callback) {
        callback(formatResponse(response))
      }
    },

    * addBindToDevice({payload, callback}, {call, put}) {
      const response = yield call(addBindToDevice, payload);
      if (response.r == ResponseDataResult.OK) {
        yield put({
          type: 'saveAddResult',
          payload: response.data,
        });
      }
      if (callback) {
        callback(formatResponse(response))
      }
    },


    * deviceDetail({payload, callback}, {call, put}) {
      const response = yield call(deviceDetail, payload);
      if (callback) {
        callback(formatResponse(response))
      }
    },


    * searchServiceList({payload, callback}, {call, put}) {
      const response = yield call(searchServiceList, payload);
      yield put({
        type: 'saveServiceList',
        payload: response,
      });
      console.log('searchServiceList response', response)
      if (callback) {
        callback(formatResponse(response))
      }
    },

    * searchUserList({payload, callback}, {call, put}) {
      const response = yield call(searchUserList, payload);
      yield put({
        type: 'saveUserList',
        payload: response,
      });
      console.log('searchUserList response', response)
      if (callback) {
        callback(formatResponse(response))
      }
    },
    * searchAccessDeviceList({payload, callback}, {call, put}) {
      const response = yield call(searchAccessDeviceList, payload);
      yield put({
        type: 'saveAccessServiceList',
        payload: response,
      });
      console.log('searchAccessDeviceList response', response)
      if (callback) {
        callback(formatResponse(response))
      }
    },

    * searchPeerAccessDeviceList({payload, callback}, {call, put}) {
      console.log('searchPeerAccessDeviceList')
      const response = yield call(searchPeerAccessDeviceList, payload);
      yield put({
        type: 'savePeerAccessServiceList',
        payload: response,
      });
      console.log('searchPeerAccessDeviceList response', response)
      if (callback) {
        callback(formatResponse(response))
      }
    },

    * updateAccessDevicesSpeed({payload, callback}, {put}) {
      yield put({
        type: 'updateAccessDevicesSpeed',
        payload: payload,
      });
      console.log('updateAccessDevicesSpeed', payload)
      if (callback) {
        callback(formatResponse(payload))
      }
    },

    * manageRelease({payload, callback}, {call}) {
      const response = yield call(manageRelease, payload);
      if (callback) {
        callback(formatResponse(response))
      }
    },
    * manageReset({payload, callback}, {call}) {
      const response = yield call(manageReset, payload);
      if (callback) {
        callback(formatResponse(response))
      }
    },
    * manageDisable({payload, callback}, {call}) {
      const response = yield call(manageDisable, payload);
      if (callback) {
        callback(formatResponse(response))
      }
    },
    * manageMove({payload, callback}, {call}) {
      const response = yield call(manageMove, payload);
      if (callback) {
        callback(formatResponse(response))
      }
    },
    * updateSwitchDeviceInfo({payload, callback}, {call}) {
      const response = yield call(updateSwitchDeviceInfo, payload);
      if (callback) {
        callback(formatResponse(response))
      }
    },

    * removeAccessDevice({payload, callback}, {call}) {
      const response = yield call(removeAccessDevice, payload);
      if (callback) {
        callback(formatResponse(response))
      }
    },


  },
  reducers: {
    queryAccessDevicesList(state, action) {
      console.log('save action', action)
      return {...state, accessData: action.payload};
    },
    updateAccessDevicesSpeed(state, action) {
      return {...state, accessData: action.payload};
    },
    saveManageList(state, action) {
      return {...state, manageData: action.payload};
    },

    // ********* 添加设备相关 start ***********//
    resetAdAllStatus(state, {payload}) {
      console.log('resetAdAllStatus')
      return {
        ...state, adCurrentStep: AddDeviceSteps.Step1.desc,// 添加设备 当前步骤
        adStepStatus: { // 添加设备详细参数
          deviceType: undefined,// DeviceType.UserDeviceType.key,
          accessMethod: AddDeviceConnMethodType.AccessType.key,// 接入设备 连接方式
          userId: undefined,
          deviceId1: undefined,
          deviceId2: undefined,
          serviceId: undefined,
          invateCode: undefined,
          ip: undefined

        },
        adResult: {}
      };
    },
    saveAdCurrentStep(state, {payload}) {
      return {...state, adCurrentStep: payload};
    },
    saveAdStepStatus(state, {payload}) {
      return {...state, adStepStatus: {...state.adStepStatus, ...payload}};
    },
    saveAdAccessMethodType(state, {payload}) {
      return {...state, adStepStatus: {...state.adStepStatus, ...payload}};
    },
    // ********* 添加设备相关 end ***********//
    saveServiceList(state, action) {
      return {...state, serviceList: action.payload};
    },
    saveUserList(state, action) {
      return {...state, userList: action.payload};
    },
    saveAccessServiceList(state, action) {
      return {...state, accessServiceList: action.payload};
    },
    savePeerAccessServiceList(state, action) {
      return {...state, peerAccessServiceList: action.payload};
    },
  },
};
export default Model;
