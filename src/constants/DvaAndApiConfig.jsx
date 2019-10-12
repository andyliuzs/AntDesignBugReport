/**
 *
 * API接口常量
 *
 * DISPATCH 常量
 *
 *
 * */

// api
export const API_URL = {
  // 针对 当前登录用户
  user: {
    adminInfo: '/api/user/info/admin', // 获取当前管理员信息
  },
  // 设备i管理
  deviceManage: {
    accessDevicesList: '/v2/api/sdn/sw/list', // '/api/sdn/sw/all',// 接入设备列表
    manageList: '/v2/api/sdn/ni/list', // 服务 /用户 设备列表
    manageRemoveSw: '', // 删除交换机
    addDevice: '/v2/api/sdn/ni/bind', // '/api/sdn/ni/bind/',
    deviceDetail: '/v2/api/sdn/sw/',// /v2/api/sdn/sw/:id交换机详情
    addBindToDevice: '/v2/api/sdn/ni/bindto',// 接出 接口
    searchUserList: '/api/sdn/ni/peers?type=USER', // 检索可绑定的用户列表
    searchServiceList: '/api/sdn/ni/peers?type=SERVER', // 检索服务列表
    searchAccessDeviceList: '/v2/api/sdn/sw/list', // 检索接入设备列表
    searchPeerAccessDeviceList: '/v2/api/sdn/sw/list',// 对方接入设备
    // http://starport.anet6.link/api/sdn/ni/unbind/:id
    manageRelease: '/api/sdn/ni/unbind/', // 解除绑定
    // http://starport.anet6.link/api/sdn/ni/rebind/:id
    manageReset: '/api/sdn/ni/rebind/', // 重置接口
    manageDisable: 'deviceManage/manageRelease', // 禁用接口
    manageMove: '/v2/api/sdn/ni/change', // 移动接口
    updateSwitchDeviceInfo: '/v2/api/sdn/sw/update',// 更新交换机信息
    removeAccessDevice: '/v2/api/sdn/sw/delete',// 管理-删除接入设备
  },

  // 用户中心-用户管理
  userManage: {
    list: '/v2/api/user/list',
    add: '/api/user/add',
    update: '/api/user/update',
    remove: '/api/user/remove',
    reset: '/api/user/reset',
    userDevices: '/api/user/device',
    listAll: '/api/rule',
  },
  // 网络拓扑
  netTopology: {
    getNode: '/v1/api/node',
    getTag:'/api/tag/query',
    search:'/search',
    searchNodePath:'/v1/api/node/path',
    whiteList:'/api/rule/whitelist',
    ruleDisAccessPeers:'/api/rule/disaccess_peers',
    editRule:'/api/rule/edit',
    updateNode:'/api/node/update',
    getMyDevice:'/api/device/my',
  },
  // 用户中心-标签管理
  tagManage: {
    list: '/api/tag/list',
    add: '/api/tag/add',
    update: '/api/tag/update',
    remove: '/api/tag/remove',
    bindAll: '/api/tag/bind_all',
    unBindAll: '/api/tag/unbind_all',
    bindUserList: '/api/tag/bind/user', // 获取标签下用户
    unBindUserList: '/api/tag/unbound/user',
    tagUserList:'/v2/api/tag/user/',
    updateTagUserList:'/v2/api/tag/user/update',// 更新标签下用户数据
  },
  domainManage: {
    domainList: '/v2/api/domain/list',
    domainAdd: '/api/domain/add',
    domainRemove: '/api/domain/delete',
    domainUpdate: '/api/domain/resolve/update',
    resolveList: '/v2/api/domain/resolve',// 域名解析列表
    resolveAdd: '/api/domain/resolve/add',
    resolveUpdate: '/api/domain/resolve/update',
    resolveRemove: '/api/domain/resolve/delete',
  },
  serviceManage: {
    serviceList: '/v2/api/service/list',
    remove: '/v2/api/service/remove/',
    uploadServiceInfo: '/v2/api/service/add',// 上传添加的服务信息
    setServiceRole: '/v2/api/service/access/update',
    updateService: '/v2/api/service/update',// 修改服务数据
    deviceList: '/v2/api/service/peers',// 权限设置中所有设备列表
  },
  desktopManage: {
    // get
    list: '/v2/api/launcher/folder/content/list', // 桌面列表
    // post folder_name folder_type：pc、phone
    addNewFolder: '/v2/api/launcher/folder/new', // 添加 桌面应用或文件夹
    // post id
    remove: '/v2/api/launcher/folder/content/remove',// 删除应用从桌面或者文件夹
    // folder_id folder_type service_id
    addAppToFolder: '/v2/api/launcher/folder/content/add',// 向文件夹中添加应用
  },
  messageManage: {
    messageList: '/v2/api/message/list'
  },
  logManage: {
    userLogList: '/v2/api/log/user/list',
    adminLogList: '/v2/api/log/admin/list'
  },
  versionManage: {
    accessDevicesList: '/v2/api/product/container/list',
    applicationList: '/v2/api/product/app/list',
    devicesUpgrade: '/v2/api/product/container/upgrade',
    applicationUpgrade: '/api/product/app/push'
  },
  outgoingManage: {
    outgoingList: '/v2/api/sdn/vnic/list',// 离岸网卡列表
    outgoingDetail: '/v2/api/sdn/vnic/',// 离岸详情
    add: '/v2/api/sdn/vnic/add',// 添加离岸网卡
    openOutgoing: '/api/sdn/vnic/enable', // 开启离岸网卡
    closeOutgoing: '/api/sdn/vnic/disenable',// 关闭离岸网卡
    unbindOutgoing: '/api/sdn/pni/disenable',// 解邦离岸网卡
    getPeers: '/v2/api/rule/peers', // 获取peers ?target_type=SERVER&target_id=1000
    getAccessTargets: '/v2/api/rule/peers/access', // 获取可访问target 的白名单 /v2/api/rule/peers/access/:target_type/:target_id
    updatePermission: '/v2/api/server/access/update', // 更新权限
    physicalPort: '/api/sdn/sw/all?physical_ni=1',// 获取交换机物理网口
    accessDeviceList: '/v2/api/sdn/sw/list?ignorePage=true', //  接入设备列表 ignorePage=true 不分页
    updateName: '/api/sdn/vnic/update'// 修改名称
  },
  licenseManage:{
    list:'/v2/api/licence/list',// 许可证列表
    remove:'/api/licence/delete/',// 删除
    identifier:'/api/licence/identifier',// 许可证标识
    checkLicense:'/api/licence/upload',// 验证许可证接口
    add:'/api/licence/add', // 添加证书
  },
  settingManage:{
    update_config:'/api/setting/edit',
    get_config:'/api/setting'
  }
}
export const DISPATCH = {

  // global
  global:{
    saveOutgoingSpeeds:'global/saveOutgoingSpeeds'// 存储离岸速度数据
  },
  // 针对 当前登录用户
  user: {
    adminInfo: 'user/adminInfo', // 获取当前管理员信息
  },
  // 设备i管理
  deviceManage: {
    accessDevicesList: 'deviceManage/accessDevicesList', // 接入设备列表
    manageList: 'deviceManage/manageList', // 服务 /用户 设备列表
    manageRemoveSw: 'deviceManage/manageRemoveSw',
    resetAdAllStatus: 'deviceManage/resetAdAllStatus', // 重置添加设备页数据
    saveAdCurrentStep: 'deviceManage/saveAdCurrentStep', // 本地数据临时存储 添加设备 当前步骤
    saveAdStepStatus: 'deviceManage/saveAdStepStatus', // 本地数据临时存储 添加设备 详细参数
    addDevice: 'deviceManage/addDevice',
    updateDevice: 'deviceManage/updateDevice',// 更新交换机
    deviceDetail: 'deviceManage/deviceDetail',// /v2/api/sdn/sw/:id交换机详情
    addBindToDevice: 'deviceManage/addBindToDevice',// 接出 接口/v2/api/sdn/ni/bindto
    searchServiceList: 'deviceManage/searchServiceList', // 检索服务列表
    searchUserList: 'deviceManage/searchUserList', // 检索可绑定的用户列表
    searchAccessDeviceList: 'deviceManage/searchAccessDeviceList', // 检索服务列表
    saveAdAccessMethodType: 'deviceManage/saveAdAccessMethodType',// 接入设备 接入方式类型
    searchPeerAccessDeviceList: 'deviceManage/searchPeerAccessDeviceList',// 对方接入设备
    updateAccessDevicesSpeed: 'deviceManage/updateAccessDevicesSpeed',// 更新上传下载
    manageRelease: 'deviceManage/manageRelease', // 解除绑定
    manageReset: 'deviceManage/manageReset', // 重置接口
    manageDisable: 'deviceManage/manageRelease', // 禁用接口
    manageMove: 'deviceManage/manageMove', // 移动接口
    updateSwitchDeviceInfo: 'deviceManage/updateSwitchDeviceInfo',// 更新交换机信息
    removeAccessDevice: 'deviceManage/removeAccessDevice',// 管理-删除接入设备

  },
  userManage: {
    list: 'userManage/fetch',
    add: 'userManage/add',
    update: 'userManage/update',
    remove: 'userManage/remove',
    reset: 'userManage/reset',
    userDevices: 'userManage/userDevices',
    listAll: 'userManage/fetchAll', // 无分页的, 获取所有
  },
  // 网络拓扑
  netTopology: {
    getNode: 'netTopology/getNode',
    getTag:'netTopology/getTag',
    setCurrentTag:'netTopology/setCurrentTag',
    setCurrentTagAll:'netTopology/setCurrentTagAll',
    setCurrentTagNotGrouped:'netTopology/setCurrentTagNotGrouped',
    search:'netTopology/search',
    searchNodePath:'netTopology/searchNodePath',
    whiteList:'netTopology/getWhiteList',
    ruleDisAccessPeers:'netTopology/getRuleDisAccessPeers',
    editRule:'netTopology/editRule',
    updateNode:'netTopology/updateNode',
    getMyDevice:'netTopology/getMyDevice',
  },
  tagManage: {
    list: 'tagManage/fetch',
    add: 'tagManage/add',
    update: 'tagManage/update',
    remove: 'tagManage/remove',
    bindAll: 'tagManage/bindAll',
    bindUserList: 'tagManage/bindUserList',
    unBindAll: 'tagManage/unBindAll',
    tagUserList: 'tagManage/tagUserList',
    updateTagUserList:'tagManage/updateTagUserList', // 更新标签下用户数据
  },
  domainManage: {
    domainList: 'domainManage/domainList',
    domainAdd: 'domainManage/domainAdd',
    domainRemove: 'domainManage/domainRemove',
    domainUpdate: 'domainManage/domainUpdate',
    resolveList: 'domainManage/resolveList', // 域名解析列表
    resolveAdd: 'domainManage/resolveAdd',
    resolveUpdate: 'domainManage/resolveUpdate',
    resolveRemove: 'domainManage/resolveRemove',
  },
  serviceManage: {
    serviceList: 'serviceManage/serviceList',
    remove: 'serviceManage/remove',
    resetAsAllStatus: 'serviceManage/resetAsAllStatus',// 重置添加服务页数据
    saveAsCurrentStep: 'serviceManage/saveAsCurrentStep', // 本地数据临时存储 添加服务 当前步骤
    saveAsStepStatus: 'serviceManage/saveAsStepStatus', // 本地数据临时存储 添加服务 详细参数
    saveImgUploading: 'serviceManage/saveImgUploading', // 存储正在上传img变量
    saveApkUploading: 'serviceManage/saveApkUploading', // 存储正在上传apk变量
    uploadServiceInfo: 'serviceManage/uploadServiceInfo', // 上传添加的服务信息
    setServiceRole: 'serviceManage/setServiceRole',
    updateService: 'serviceManage/updateService',
    deviceList: 'serviceManage/deviceList',// 获取设备列表
  },
  desktopManage: {
    // get
    list: 'desktopManage/list', // 桌面列表
    // post folder_name folder_type：pc、phone
    addNewFolder: 'desktopManage/addNewFolder', // 添加 桌面应用或文件夹
    // post id
    remove: 'desktopManage/remove', // 删除应用从桌面或者文件夹
    // folder_id folder_type service_id
    addAppToFolder: 'desktopManage/addAppToFolder',// 向文件夹中添加应用
    serviceList: 'desktopManage/serviceList',

  },
  messageManage: {
    messageList: 'messageManage/messageList'
  },
  logManage: {
    userLogList: 'logManage/userLogList',
    adminLogList: 'logManage/adminLogList'
  },
  versionManage: {
    accessDevicesList: 'versionManage/getAccessDeviceList',
    upGradeDevice: 'versionManage/upGradeDevice',
    applicationList: 'versionManage/getApplicationList',
    upGradeApplication: 'versionManage/upGradeApplication'
  },
  outgoingManage: {
    outgoingList: 'outgoingManage/outgoingList', // 离岸网卡列表
    outgoingDetail: 'outgoingManage/outgoingDetail',// 离岸详情
    add: 'outgoingManage/add',// 添加离岸网卡
    openOutgoing: 'outgoingManage/openOutgoing', // 开启离岸网卡
    closeOutgoing: 'outgoingManage/closeOutgoing',// 关闭离岸网卡
    unbindOutgoing: 'outgoingManage/unbindOutgoing',// 解邦离岸网卡
    getPeers: 'outgoingManage/getPeers', // 获取peers ?target_type=SERVER&target_id=1000
    getAccessTargets: 'outgoingManage/getAccessTargets', // 获取可访问target 的白名单 /v2/api/rule/peers/access/:target_type/:target_id
    updatePermission: 'outgoingManage/updatePermission', // 更新权限
    saveAdStepStatus: 'outgoingManage/saveAdStepStatus', // 本地数据临时存储 添加离岸点 详细参数
    resetAdAllStatus: 'outgoingManage/resetAdAllStatus',// 重置本地分布存储数据
    physicalPort: 'outgoingManage/physicalPort',// 获取物理网口接口
    accessDeviceList: 'outgoingManage/accessDeviceList',// 获取接入设备列表
    saveAdCurrentStep: 'outgoingManage/saveAdCurrentStep', // 本地数据临时存储 添加离岸网卡 当前步骤
    updateName: 'outgoingManage/updateName'// 修改名称
  },
licenseManage: {
  list: 'licenseManage/list',// 许可证列表
    remove: 'licenseManage/remove',
    identifier: 'licenseManage/identifier',// 许可证标识
    add: 'licenseManage/add',// 添加许可证
  },
  settingManage: {
    getSettingList:'settingManage/getSettingList',
    modifyDNS:'settingManage/modifyDNS',
  }
}

// *事件总线*//
export const EventAction = {
  // 消息管理
  message: {
    // 刷新消息列表action
    notifyUpdateList: 'EventAction.message.notifyUpdateList',
    // 获取未读消息个数 action
    notifyGetUnReadCount: 'EventAction.message.notifyGetUnReadCount',
  },
  // 设备管理
  deviceManage: {
    notifyUpdateSpeed: 'EventAction.deviceManage.notifyUpdateSpeed', // 提示更新接入设备列表中上传下载速度
    notifyUpdateOnlineStatus: 'EventAction.deviceManage.notifyUpdateOnlineStatus', // 提示更新设备在线状态
    notifyUpdateOfflineStatus: 'EventAction.deviceManage.notifyUpdateOfflineStatus', // 提示更新设备离线状态
    notifyUpdateDeviceStatus: 'EventAction.deviceManage.notifyUpdateDeviceStatus', // 提示更新指定接口数据
  },
  // 离岸网卡
  outgoingDevice: {
    notifyUpdateSpeed: 'EventAction.outgoingDevice.notifyUpdateSpeed',// 更新离岸网卡流量速度
  },

  versionManage: {
    notifySwitchUpdate: 'EventAction.versionManage.notifySwitchUpdate', // 提示交换机设备升级结果
  },
  socket: {
    reconnect: 'EventAction.socket.reconnect', // socket重新连接上
  },
};
