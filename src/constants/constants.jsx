import { formatMessage } from 'umi-plugin-react/locale';

export const ResponseDataResult = {
  OK: 'ok',
};
// UI config
export const UIConfig = {
  dialog: {
    detailTableHeight: 280,
    settingTableHeight: 300,
  },
  table: {
    detailTableHeight: 820,
  },
};

// 用户类型
export const UserType = [
  {
    key: 0,
    desc: formatMessage({ id: 'app.cb.globalApp.generalUser' }),
  },
  {
    key: 1,
    desc: formatMessage({ id: 'app.cb.globalApp.admin' }),
  },
];

// 域名记录类型
export const DomainRecordType = [
  {
    key: 'A',
    desc: formatMessage({ id: 'app.cb.domainmanage.resolvelist.recordtype_A_desc' }),
  },
  {
    key: 'AAAA',
    desc: formatMessage({ id: 'app.cb.domainmanage.resolvelist.recordtype_AAAA_desc' }),
  },
];
// 设备管理 设备类型
export const DeviceType = {
  UserDeviceType: { key: 'USER', desc: formatMessage({ id: 'app.cb.devicemanage.userDevice' }) },
  ServerDeviceType: {
    key: 'SERVER',
    desc: formatMessage({ id: 'app.cb.devicemanage.serviceDevice' }),
  },
  SwitchDeviceType: {
    key: 'SWITCH',
    desc: formatMessage({ id: 'app.cb.devicemanage.accessdevice' }),
  },
};
export const DevicesTypeName = {
  UBUNTU: 'ubuntu设备',
  SWITCH: '交换机子设备',
  WIN: 'Window设备',
  LINUX: 'Linux设备',
  IOS: 'IOS设备',
  DARWIN: 'Mac设备',
  ANDROID: 'Android设备',
  IS_NULL: '',
};

export const AddDeviceSteps = {
  Step1: { key: 0, desc: 'selDevice' },
  Step2: { key: 1, desc: 'selContent' },
  Step3: { key: 2, desc: 'complete' },
};

// 设备类型
export const ServiceType = {
  AtomicServiceType: {key: 'WEB_ANET', desc: formatMessage({id: 'app.cb.servicemanage.atomicservice'})},
  WebServiceType: {key: 'WEB', desc: formatMessage({id: 'app.cb.servicemanage.webservice'})},
  PhoneAppServiceType: {key: 'APP_PHONE', desc: formatMessage({id: 'app.cb.servicemanage.phoneappservice'})}
}

//  服务访问权限类别
export const ServicePermissionType = {
  Open: { key: 'open', desc: formatMessage({ id: 'app.cb.servicemanage.alowAllAccess' }) },
  Block: { key: 'block', desc: formatMessage({ id: 'app.cb.servicemanage.notAllowed'}) },
  Control: { key: 'control', desc: formatMessage({ id: 'app.cb.servicemanage.allowSomeAccess'}) },
};


//  离岸权限
export const OutgoingPermissionType = {
  Open: { key: 'open', desc: formatMessage({ id:    'app.cb.outgoingManage.allowAllOutgoing' }) },
  Block: { key: 'block', desc: formatMessage({ id:'app.cb.outgoingManage.notAllowOutgoing' }) },
  Control: { key: 'control', desc: formatMessage({ id: 'app.cb.outgoingManage.allowSomeOutgoing'  }) },
};

// 添加服务步骤
export const AddServiceSteps = {
  Step1: { key: 0, desc: 'selService' },
  Step2: { key: 1, desc: 'enterContent' },
  Step3: { key: 2, desc: 'permissionSet' },
  Step4: { key: 3, desc: 'complete' },
};
// 接入方式  接入 接出
export const AddDeviceConnMethodType = {
  AccessType: { key: 0, desc: formatMessage({ id: 'app.cb.devicemanage.access' }) }, // 接入
  ConnectToType: { key: 1, desc: formatMessage({ id: 'app.cb.devicemanage.connectTo' }) }, // 接出
};

//新的接入设备
export const NewAccessDevice = {key: -999, desc: formatMessage({id: 'app.cb.devicemanage.netAccessDevice'})}
// 连接信息 类型 加密文本 二维码 激活码
export const AddDeviceConnInfoType = {
  EncryptText: { key: '1', desc: formatMessage({ id: 'app.cb.devicemanage.encryptedText' }) },
  QRCode: { key: '2', desc: formatMessage({ id: 'app.cb.devicemanage.qrCode' }) },
  ActivationCode: { key: '3', desc: formatMessage({ id: 'app.cb.devicemanage.activationCode' }) },
};

// 桌面管理 类型
export const DeskTopManageType = { computer: 'pc', phone: 'phone' };

// path
export const RouterPath = {
  ROOT_PATH: '/',
  USER_MANAGE: '/usercenter/usermanage',
  USER_TAG_MANAGE: '/usercenter/tagmanage',
  DEVICE_MANAGE: '/devicemanage',
  NET_TOPOLOGY: '/nettopology',
  DEVICE_MANAGE_DEVICE_LIST: '/devicemanage/deviceList', // 交换机中-接入设备
  DEVICE_MANAGE_ADD_DEVICE: '/devicemanage/add',
  DEVICE_MANAGE_MANAGE: '/devicemanage/manage', // 管理
  DEVICE_MANAGE_DETAILS: '/devicemanage/details', // 详情
  DOMAIN_MANAGE_RESOLVE_LIST: '/domainmanage/resolvelist',
  SERVICE_MANAGE_LIST: '/servicemanage',
  SERVICE_MANAGE_ADD: '/servicemanage/add',
  DESKTOP_MANAGE: `/desktopmanage/${DeskTopManageType.computer}`,
  DESKTOP_MANAGE_COMPUTER: `/desktopmanage/${DeskTopManageType.computer}`,
  DESKTOP_MANAGE_PHONE: `/desktopmanage/${DeskTopManageType.phone}`,
  DESKTOP_MANAGE_PC_FOLDER: `/desktopmanage/${DeskTopManageType.computer}/folder`,
  DESKTOP_MANAGE_PHONE_FOLDER: `/desktopmanage/${DeskTopManageType.phone}/folder`,
  OUTGOING_MANAGE_LIST : '/outgoingdevices', // 离岸网卡列表
  OUTGOING_MANAGE_ADD : '/outgoingdevices/add',// 离岸添加页
  OUTGOING_MANAGE_MANAGE : '/outgoingdevices/manage',// 离岸管理页面
  LICENSE_MANAGE_LIST:'/systemmanage/licensemanage'// 许可证管理
}

// 绑定类型
export const BindType = {
  USER: 'USER',
  SERVER: 'SERVER',
  DEVICE: 'DEVICE',
};

// 服务规则
export const ServiceAclStatus = {
  block: '不允许设备访问',
  control: '允许部分设备访问',
  open: '允许所有设备访问',
};

// 服务规则类型
export const ServiceRoleType = {
  TAG: {key: "TAG", desc: '用户组'},
  USER: {key: "USER", desc: '用户'},
  SERVER: {key: "SERVER", desc: '服务'},
};


export const AcceptUploadType = {
  ImageAccept: '.jpg, .jpeg, .png',
  AppType: ".apk,.ipa",
}
export const FileMimes = {
  APK: 'application/vnd.android.package-archive',
  IPA: 'application/octet-stream.ipa',
  JPG: 'image/jpeg',
  PNG: 'image/png',
  JPEG: 'image/jpeg',
}



// 添加离岸点设置
export const AddOutgoingSteps = {
  Step1: { key: 0, desc: 'selAccessDevice' },
  Step2: { key: 1, desc: 'baseInfoSet' },
  Step3: { key: 2, desc: 'permissionSet' },
  Step4: { key: 3, desc: 'complete' },
};

