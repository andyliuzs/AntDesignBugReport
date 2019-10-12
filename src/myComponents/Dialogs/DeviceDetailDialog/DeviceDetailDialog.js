import React, {PureComponent} from 'react'
import {connect} from 'dva';
import PropTypes from 'prop-types'
import styles from "../StandardListForm.less";
import _ from 'lodash'
import {
  Row,
  Col,
  Form,
  Button,
  Modal,
  Descriptions, Upload, Tabs
} from 'antd';
import moment from "moment";
import MyStandardTable from "../../MyStandardTable";
import {
  AddDeviceConnInfoType,
  DevicesTypeName,
  DeviceType,
  ServicePermissionType,
  UIConfig,
  UserType
} from "../../../constants/constants";
import {Base64} from 'js-base64'
import {formatMessage} from 'umi-plugin-react/locale';
import {getOnLineTime} from "../../../utils/utils";
import QRCode from "qrcode.react";

const {TabPane} = Tabs;

class DeviceDetailDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      current: this.props.current || {},
    };
  }


  componentDidMount() {
    console.log('DeviceDetailDialog comm did mount', this.state.current)
  }


  dismiss = () => {
    console.log('dismiss')
    this.setState({
      visible: false,
    });
  };

  onAfterClose = () => {
    this.props.onDismiss();
    this.props.removeDialog();
  };


  handleDone = () => {
    this.dismiss()
  };

  handleCancel = () => {
    //todo
    this.dismiss()
  };


  render() {
    let that = this;
    let {current} = that.state;

    const modalFooter = {
      onCancel: this.handleCancel,
      footer: [
        <Button key="submit" type="primary" onClick={this.handleDone}>
          {formatMessage({id: 'app.cb.globalApp.ok'})}
        </Button>,
      ]
    }
    const isActivate = _.has(current, 'device');
    const statusText = isActivate ? getOnLineTime(new Date().getTime(), current) : formatMessage({id: 'app.cb.devicemanage.manage.inactivated'});
    const deviceTypeDesc = DeviceType[_.findKey(DeviceType, {key: current?.peer_type})]?.desc || '--'

    let encryptText, activateCodeView, qrcodeView;
    const et = {};
    et['address'] = current.activate_ip
    et['code'] = current.code
    et['name'] = current?.user?.username
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
          label={formatMessage({id: 'app.cb.devicemanage.activationCode'})}> {current?.code}</Descriptions.Item>
        <Descriptions.Item
          label={formatMessage({id: 'app.cb.devicemanage.inboundIp'})}> {current?.activate_ip}</Descriptions.Item>
      </Descriptions>
    </div>
    const getModalContent = () => {
      const view =
        <div className={styles.centerDetail}>
          <Row>
            <Col span={4}></Col>
            <Col span={16}>
              <Descriptions size="small" column={1} style={{margin: "8px"}}>
                <Descriptions.Item
                  label={formatMessage({id: 'app.cb.devicemanage.manage.name'})}>{current?.user?.username}</Descriptions.Item>
                <Descriptions.Item
                  label={formatMessage({id: 'app.cb.globalApp.status'})}> {statusText}</Descriptions.Item>
                <Descriptions.Item
                  label={formatMessage({id: 'app.cb.devicemanage.deviceType'})}>{deviceTypeDesc}</Descriptions.Item>
                {isActivate && <Descriptions.Item
                  label={formatMessage({id: 'app.cb.devicemanage.manage.device'})}>{DevicesTypeName[current.device?.os || 'IS_NULL']}</Descriptions.Item>}
                {isActivate && <Descriptions.Item
                  label={formatMessage({id: 'app.cb.globalApp.ipv6'})}> {current?.device?.ip6}</Descriptions.Item>}
              </Descriptions>
              {!isActivate &&  <Row style={{marginTop: '16px', marginBottom: '16px', marginLeft: '5px'}}>
                <Col lg={{span: 7}} md={{span: 7}} sm={{span: 24}}>
                  <span className={styles.header}>{formatMessage({id: 'app.cb.devicemanage.connectionInfo'})}：</span>
                </Col>
              </Row>}
            </Col>
            <Col span={4}></Col>
          </Row>
          {!isActivate && <div>

            <Row>
              <Col span={4}></Col>
              <Col span={18}>
                <Tabs defaultActiveKey={AddDeviceConnInfoType.EncryptText.key}>
                  <TabPane tab={AddDeviceConnInfoType.EncryptText.desc} key={AddDeviceConnInfoType.EncryptText.key}>
                    <div className={styles.tabInnerStyle}>
                      {encryptText}
                    </div>
                  </TabPane>
                  <TabPane tab={AddDeviceConnInfoType.QRCode.desc} key={AddDeviceConnInfoType.QRCode.key}>
                    {qrcodeView}
                  </TabPane>
                  <TabPane tab={AddDeviceConnInfoType.ActivationCode.desc}
                           key={AddDeviceConnInfoType.ActivationCode.key}>
                    {activateCodeView}
                  </TabPane>
                </Tabs>
              </Col>
              <Col span={2}></Col>
            </Row>
          </div>}
        </div>
      return view
    };

    return (
      <Modal
        title={formatMessage({id: 'app.cb.globalApp.detail'})}
        width={640}
        bodyStyle={{padding: '28px  40px'}}
        destroyOnClose
        visible={that.state.visible}
        afterClose={that.onAfterClose}
        {...
          modalFooter
        }
      >
        {
          getModalContent()
        }
      </Modal>
    );
  }
}


DeviceDetailDialog.propTypes = {
  onDismiss: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
DeviceDetailDialog.defaultProps = {
  onDismiss: () => {
    console.log('//todo->DeviceDetailDialog:onDismiss');
  },
  removeDialog: () => {
    console.log('//todo->DeviceDetailDialog:removeDialog');
  }
};

const mapStateToProps = ({deviceManage}) => {
  return {deviceManage: deviceManage}
};

export default connect()(DeviceDetailDialog)
