import {Button, Result, Descriptions, Col, Row, Tabs, Form} from 'antd';
import React from 'react';
import {connect} from 'dva';
import styles from './index.less';
import {Link} from "umi";
import QRCode from 'qrcode.react';

const {TabPane} = Tabs;
import {Base64} from 'js-base64'
import {formatMessage} from 'umi-plugin-react/locale';
import {
  AddDeviceConnInfoType,
  AddDeviceConnMethodType,
  DeviceType, NewAccessDevice,
  RouterPath
} from "../../../../../constants/constants";
import _ from "lodash";
import {DISPATCH} from "@/constants/DvaAndApiConfig";

@connect(({deviceManage}) => ({
  data: deviceManage.adStepStatus,
}))
class Step3 extends React.Component {
  // const {data, dispatch} = props;
  //
  // if (!data) {
  //   return null;
  // }

  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data || {}
    }
  }


  render() {
    const {data} = this.state;
    const {deviceType, accessMethod, peerDeviceId, adResult} = data
    let resultTitle, encryptText , activateCodeView, qrcodeView;
    let deviceName = adResult?.deviceName

    // 是否显示接出成功
    let showConnectToSuccess = deviceType == DeviceType.SwitchDeviceType.key && accessMethod == AddDeviceConnMethodType.ConnectToType.key
    // 显示接入成功
    let showAccessSuccess = deviceType == DeviceType.SwitchDeviceType.key && accessMethod == AddDeviceConnMethodType.AccessType.key && peerDeviceId && peerDeviceId != NewAccessDevice
    if (showConnectToSuccess) {
      resultTitle = formatMessage({id: 'app.cb.devicemanage.connToDeviceSuccess'}, {deviceName})

      // } else if (showAccessSuccess) {
      //   resultTitle = formatMessage({id: 'app.cb.devicemanage.accessDeviceSuccess'}, {deviceName})
    } else {
      // 添加成功
      resultTitle = formatMessage({id: 'app.cb.globalApp.addSuccess'})
      console.log('adResult is ', adResult)
      const et = {};
      et['address'] = adResult.activate_ip
      et['code'] = adResult.code
      et['name'] = adResult?.user?.username
      // 加密文本
      encryptText = JSON.stringify(et)
      encryptText = Base64.encode(encryptText);
      // 二维码
      qrcodeView = <div className={styles.tabInnerStyle}><QRCode value={encryptText}
                                                                 style={{marginLeft: 'auto', marginRight: 'auto'}}/>
      </div>
      // 激活码
      activateCodeView = <div className={styles.tabInnerStyle}>
        <Descriptions column={1}>
          <Descriptions.Item
            label={formatMessage({id: 'app.cb.devicemanage.activationCode'})}> {adResult?.code}</Descriptions.Item>
          <Descriptions.Item
            label={formatMessage({id: 'app.cb.devicemanage.inboundIp'})}> {adResult?.activate_ip}</Descriptions.Item>
        </Descriptions>
      </div>

    }
    const infoUserName = adResult.user.username // deviceType == DeviceType.UserDeviceType.key? adResult.user.username:deviceType==DeviceType.ServerDeviceType.key?
    const infoDeviceType = DeviceType[_.findKey(DeviceType, {key: deviceType}) || 'UserDeviceType']
    const infoStatus = formatMessage({id: 'app.cb.devicemanage.manage.inactivated'})
    const information = (
      <div className={styles.information}>
        <Descriptions column={2}>
          <Descriptions.Item
            label={formatMessage({id: 'app.cb.devicemanage.manage.name'})}> {infoUserName}</Descriptions.Item>
          <Descriptions.Item
            label={formatMessage({id: 'app.cb.devicemanage.deviceType'})}> {infoDeviceType.desc}</Descriptions.Item>
          <Descriptions.Item
            label={formatMessage({id: 'app.cb.globalApp.status'})}> {infoStatus}</Descriptions.Item>
        </Descriptions>
        <Row style={{marginTop: '16px', marginBottom: '16px'}}>
          <Col lg={{span: 6}} md={{span: 6}} sm={{span: 24}}>
            <span className={styles.header}>{formatMessage({id: 'app.cb.devicemanage.connectionInfo'})}：</span>
          </Col>
        </Row>
        <Tabs defaultActiveKey={AddDeviceConnInfoType.EncryptText.key}>
          <TabPane tab={AddDeviceConnInfoType.EncryptText.desc} key={AddDeviceConnInfoType.EncryptText.key}>
            <div className={styles.tabInnerStyle}>
              {encryptText}
            </div>
          </TabPane>
          <TabPane tab={AddDeviceConnInfoType.QRCode.desc} key={AddDeviceConnInfoType.QRCode.key}>
            {qrcodeView}
          </TabPane>
          <TabPane tab={AddDeviceConnInfoType.ActivationCode.desc} key={AddDeviceConnInfoType.ActivationCode.key}>
            {activateCodeView}
          </TabPane>
        </Tabs>
      </div>
    );
    const extra = (
      <Link to={RouterPath.DEVICE_MANAGE}>
        <Button type="primary" size='large'>
          {formatMessage({id: 'app.cb.globalApp.complete'})}
        </Button>
      </Link>
    );
    return (
      <Result
        status="success"
        title={resultTitle}
        subTitle=""
        extra={extra}
        style={(showConnectToSuccess || showAccessSuccess) ? {marginTop: '100px'} : {}}
        className={styles.result}
      >
        {!(showConnectToSuccess || showAccessSuccess) && information}
      </Result>
    );
  }
};

export default Step3;
