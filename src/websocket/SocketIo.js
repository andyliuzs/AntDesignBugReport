import _ from "lodash";
import io from "socket.io-client";
import serverConfig from "../../config/serverConfig";
import Event from "@/utils/Event";
import {DISPATCH, EventAction} from "@/constants/DvaAndApiConfig";
// eslint-disable-next-line no-unused-vars
let clientSocket
let request_list = {};
let connected = false
let globalDispatch = null
export const getConnected=()=>{
  return connected
}

const sendMessage = () => {
  if (connected && clientSocket) {
    Object.keys(request_list).forEach((urlKey) => {
      clientSocket.emit(urlKey, request_list[urlKey])
      delete request_list[urlKey];
      console.log('socket  send message', urlKey);
    })
  }
}
const notify = (_data) => {
  if (_data.type == 'message') {
    Event.emit(EventAction.message.notifyUpdateList)
  }
  Event.emit(EventAction.message.notifyGetUnReadCount)
}
const flow = {
  switch: (_data) => {
    // event.emit(constDefine.eventType.ws.ws_update_switch_flow, _data);
    Event.emit(EventAction.deviceManage.notifyUpdateSpeed,_data)
    // console.log('socket flow switch send data')
  },
  vnic: (_data) => {
    console.log('vnic flow:',_data);
    // event.emit(constDefine.eventType.ws.ws_update_out_flow, _data);
    if(globalDispatch!=null){
      globalDispatch({
        type: DISPATCH.global.saveOutgoingSpeeds,
        payload: {data:_data},
      });
    }
    Event.emit(EventAction.outgoingDevice.notifyUpdateSpeed,_data)
  }
}
const ni = {
  online: (_data) => {
    console.log('online----:', _data);
    // event.emit(constDefine.eventType.ws.ws_update_port_online_status, _data);
    Event.emit(EventAction.deviceManage.notifyUpdateOnlineStatus,_data)
  },
  ofline: (_data) => {
    console.log('ofline----:', _data);
    //  event.emit(constDefine.eventType.ws.ws_update_port_unline_status, _data);
    Event.emit(EventAction.deviceManage.notifyUpdateOfflineStatus,_data)
  },
  update: (_data) => {
    console.log('update----:', _data);
    //  event.emit(constDefine.eventType.ws.ws_update_port_data, _data);
    Event.emit(EventAction.deviceManage.notifyUpdateDeviceStatus,_data)
  }
}

const product = {
  upgrade_success: (_data) => {
    // event.emit(constDefine.eventType.version.version_update_switch_result,_data);
    Event.emit(EventAction.versionManage.notifySwitchUpdate,_data)
  },
  upgrade_fail: (_data) => {
    //  event.emit(constDefine.eventType.version.version_update_switch_result,_data);
    Event.emit(EventAction.versionManage.notifySwitchUpdate,_data)
  },
}
let tryOpenSocketTime;
const tryOpenSocket = () => {
  tryOpenSocketTime = setTimeout(() => {
    // eslint-disable-next-line no-use-before-define
   openSocket()
    // tryOpenSocketTime = undefined
    console.log('tryOpenSocket after 30s')
  }, 30 * 1000);
}
const closeTryOpenSocket = () => {
  if (tryOpenSocketTime) {
    clearTimeout(tryOpenSocketTime)
    tryOpenSocketTime = undefined
  }
}
const initSocket = () => {
  clientSocket = io(serverConfig.getSocketServerUrl(), {
    'force new connection': false,
    query: {
      type: "web"
    },
    reconnect: true,
    'reconnection delay': 200,
    'max reconnection attempts': 15
  })
  clientSocket.on('disconnect', (r) => {
    console.log('socket disconnect ', r)
   connected = false;
  });

  clientSocket.on('reconnect', () => {
    console.log('socket reconnect ')
    closeTryOpenSocket()
    //   event.emit(constDefine.eventType.ws.ws_reconnect);
    Event.emit(EventAction.socket.reconnect);
    connected = true;
  });
  clientSocket.on('reconnecting', function () {
    console.log("socket reconnecting");
  });

  clientSocket.on('connect', function (c) {
    closeTryOpenSocket()
    sendMessage()
    console.log('socket connect ', c)
    connected = true;
  });
  clientSocket.on('error', function (e) {
    console.log('socket  error', e);
  });
  clientSocket.on('reconnect_failed', function (e) {
    console.log('socket reconnect_failed', e);
  });
  clientSocket.on('notify', function (data) {
    notify(data);
  });
  clientSocket.on('flow', function (data) {
    console.log('ws listen flow:',data);
    if (data && _.has(flow, data.type)) {
      flow[data.type](data.data);
    }
  });
  clientSocket.on('ni', function (niData) {
    console.log('ws listen ni:',JSON.parse(JSON.stringify(niData)));
    if (niData && _.has(ni,niData.type)) {
      ni[niData.type](JSON.parse(JSON.stringify(niData.data)));
    }
  });
  clientSocket.on('product', function (productData) {
    console.log('ws listen product:', JSON.parse(JSON.stringify(productData)));
    if (productData && _.has(product,productData.type)) {
      product[productData.type](productData);
    }
  });
  clientSocket.on('failed', function (_data) {
    if (_data && _data.code == 20001) {
      console.log('socket  强制刷新客户端');
      // window.location.reload();
      tryOpenSocket();
    }
  });
  clientSocket.on('request_online', function (_data) {
    console.log('request_online', _data);
  });

  clientSocket.on('ping', () => {
    console.log('receive socket ping')
  });

  clientSocket.on('pong', (latency) => {
    console.log('receive socket pong', latency)
  });
  console.log('initSocket')
}

const closeSocket = () => {
  if (clientSocket) {
    clientSocket.close()
    clientSocket = undefined
    globalDispatch = null
    console.log('closeSocket')
  }
}
const openSocket = () => {
  if (clientSocket) {
    console.log('openSocket')
    clientSocket.open()
  } else {
    initSocket()
  }
}
const openSocketWitchDispatch = (dispatch) =>{
  globalDispatch = dispatch
  openSocket()
}
const sendGetOnline = () => {
  request_list.get_online = undefined;
  sendMessage()
}
export default {initSocket, openSocket,openSocketWitchDispatch, closeSocket, sendGetOnline}




