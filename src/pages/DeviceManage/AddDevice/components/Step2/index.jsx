import {Alert, Button, Descriptions, Divider, Statistic, Form, Input, Radio, message} from 'antd';
import React, {Fragment} from 'react';
import {connect} from 'dva';
import styles from './index.less';
import {DISPATCH} from "../../../../../constants/DvaAndApiConfig";
import {
  AddDeviceConnMethodType,
  AddDeviceSteps,
  DeviceType, NewAccessDevice,
  ResponseDataResult
} from "../../../../../constants/constants";
import {formatMessage} from 'umi-plugin-react/locale';
import _ from 'lodash'
import SearchInput from "../../../../../myComponents/SearchInput";
import {
  fetchAccessDevices,
  fetchPeerAccessDevices,
  fetchServices,
  fetchUsers
} from "../../../../../utils/dictionaryutils";
import {ipv4Pattern, length8Pattern} from "../../../../../constants/Pattern";

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
let selDeviceId = -1;
let selPeerServiceId = -1;

@connect(({deviceManage, loading}) => ({
  submitting: loading.effects[DISPATCH.deviceManage.addDevice],
  data: deviceManage.adStepStatus,
}))
@Form.create()
class Step2 extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.data})
  }

  onPrev = () => {
    const {dispatch, form: {getFieldsValue}} = this.props
    const that = this;
    const values = getFieldsValue();
    dispatch({
      type: DISPATCH.deviceManage.saveAdStepStatus,
      payload: {...that.state.data, ...values},
    });
    dispatch({
      type: DISPATCH.deviceManage.saveAdCurrentStep,
      payload: AddDeviceSteps.Step1.desc,
    });
  };

  onValidateForm = e => {
    e.preventDefault();
    const that = this;
    // var _post_data = {
    //   ni_id: _port_id,
    //   peer_type: _peer_type,
    //   peer_id: _peer_id,
    //   note: _note,
    //   name:_name,
    //   //本地更新需要数据，服务器暂时不需要
    //   //ni_id: _port_id,
    //   switch_id: inServerData.switch_id,
    //   in_server_id: portData.in_server_id,
    //   type:get_port_type_value()
    // }
    const {dispatch, form: {validateFields}} = this.props;
    const {data} = this.state
    validateFields((err, values) => {
      console.log('submit result = ', values)
      if (!err) {
        let playLoad = {};
        if (_.isEmpty(data.deviceType)) {
          message.error("device error!!")
          return;
        }
        let dispatchType = DISPATCH.deviceManage.addDevice;
        if (data.deviceType == DeviceType.UserDeviceType.key) {
          playLoad['peer_type'] = data.deviceType
          playLoad['switch_id'] = values.deviceId
          playLoad['peer_id'] = values.userId
          console.log('add user device', playLoad)
        } else if (data.deviceType == DeviceType.ServerDeviceType.key) {
          playLoad['switch_id'] = values.deviceId
          playLoad['peer_type'] = data.deviceType
          playLoad['peer_id'] = values.serverId
          console.log('add ServerDeviceType', playLoad)
        } else if (data.deviceType == DeviceType.SwitchDeviceType.key) {
          console.log('accessMethod', data.accessMethod)

          if (data.accessMethod == AddDeviceConnMethodType.AccessType.key) {
            playLoad['switch_id'] = values.deviceId
            playLoad['peer_type'] = data.deviceType
            playLoad['peer_id'] = values.peerDeviceId
          } else if (data.accessMethod == AddDeviceConnMethodType.ConnectToType.key) {
            playLoad['code'] = values.invateCode
            playLoad['ip'] = values.ip
            playLoad['peer_id'] = values.deviceId
            dispatchType = DISPATCH.deviceManage.addBindToDevice;
          }
          let newPlayLoad = {}
          if (playLoad['peer_id'] && playLoad['peer_id'] == NewAccessDevice.key) {
            const model = _.remove(_.keys(playLoad), (item) => {
              return item != 'peer_id'
            })
            newPlayLoad = _.pick(playLoad, model);
          } else {
            newPlayLoad = playLoad
          }
          playLoad = {...newPlayLoad}
          console.log('add user SwitchDeviceType', newPlayLoad)
        } else {
          message.error("device error!")
          return;
        }

  console.log('dispatch type is ',dispatchType)
        if (dispatch) {
          dispatch({
            type: dispatchType,
            payload: playLoad,
            callback: (res) => {
              if (res.r === ResponseDataResult.OK) {
                const pResult = {...that.state.data, ...values, ...{adResult: res.data}};
                console.log('ad result is ', pResult)
                dispatch({
                  type: DISPATCH.deviceManage.saveAdStepStatus,
                  payload: pResult,
                });
                dispatch({
                  type: DISPATCH.deviceManage.saveAdCurrentStep,
                  payload: AddDeviceSteps.Step3.desc,
                });
              } else {
                message.error(formatMessage({id: 'app.cb.devicemanage.addDeviceFailed'}))
              }
            }
          });
        }
      }
    });
  };

  // 服务设备检索
  fetchSearchInputServices = (value, callback) => {
    const {dispatch} = this.props
    const that = this;
    if (dispatch) {
      fetchServices(dispatch, value, (mData) => {
        dispatch({
          type: DISPATCH.deviceManage.saveAdStepStatus,
          payload: {...that.state.data, ...{serviceData: mData}},
        });
        callback(mData)
      })
    }
  }

  // 检索用户
  fetchSearchInputUsers = (value, callback) => {
    const {dispatch} = this.props
    const that = this;
    if (dispatch) {
      fetchUsers(dispatch, value, (mData) => {
        dispatch({
          type: DISPATCH.deviceManage.saveAdStepStatus,
          payload: {...that.state.data, ...{usersData: mData}},
        });
        callback(mData)
      })
    }
  }

  // 检索接入设备
  fetchSearchInputAccessDevices = (value, callback) => {
    const {dispatch} = this.props
    const that = this;
    fetchAccessDevices(dispatch, value, (mData) => {
      dispatch({
        type: DISPATCH.deviceManage.saveAdStepStatus,
        payload: {...that.state.data, ...{accessDeviceData: mData}},
      });
      callback(mData)
    }, selPeerServiceId)
  }

  // 检索对方接入设备
  fetchSearchPeerInputAccessDevices = (value, callback) => {
    const {dispatch} = this.props
    const that = this;
    fetchPeerAccessDevices(dispatch, value, (mData) => {
      dispatch({
        type: DISPATCH.deviceManage.saveAdStepStatus,
        payload: {...that.state.data, ...{peerAccessDeviceData: mData}},
      });
      callback(mData)
    }, selDeviceId)
  }

  onAccessMethodChange = e => {
    const that = this;
    const {dispatch} = this.props
    console.log('onAccessMethodChange', e.target.value);
    dispatch({
      type: DISPATCH.deviceManage.saveAdAccessMethodType,
      payload: {...that.state.data, ...{accessMethod: e.target.value}},
    });

  };

  handleDeviceChange = value => {
    selDeviceId = value;
  };

  handlePeerDeviceChange = value => {
    selPeerServiceId = value;
  };

  render() {
    const {submitting, form: {getFieldDecorator}} = this.props
    const {deviceType, accessMethod, userId, serverId, deviceId, peerDeviceId, invateCode, ip, serviceData, usersData, accessDeviceData, peerAccessDeviceData} = this.state.data;
    console.log('serviceData', serviceData)
    console.log('usersData', usersData)
    console.log('accessDeviceData', accessDeviceData)
    const deviceTypeObj = DeviceType[_.findKey(DeviceType, {key: deviceType}) || 'UserDeviceType']
    const accessDeviceALabel = <span>{formatMessage({id: 'app.cb.usermanage.accessDevice'})}<span
      style={{color: 'gray', fontWeight: '700'}}>
      {deviceTypeObj.key == DeviceType.SwitchDeviceType.key && '(A)'}
    </span></span>
    const accessDeviceBLabel = <span>{formatMessage({id: 'app.cb.usermanage.accessDevice'})}<span
      style={{color: 'gray', fontWeight: '700'}}>
      {deviceTypeObj.key == DeviceType.SwitchDeviceType.key && '(B)'}
    </span></span>
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label={formatMessage({id: 'app.cb.devicemanage.addDevice'})} required={false}>
            <span>{deviceTypeObj.desc}</span>
          </Form.Item>
          {(deviceTypeObj.key == DeviceType.UserDeviceType.key) &&
          <Form.Item {...formItemLayout} label={formatMessage({id: 'app.cb.globalApp.user'})}>
            {getFieldDecorator('userId', {
              initialValue: userId,
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'app.cb.devicemanage.pleaseSelUser'}),
                },
              ],
            })(
              <SearchInput placeholder={formatMessage({id: 'app.cb.devicemanage.pleaseSelUser'})}
                           fetchFunction={this.fetchSearchInputUsers} oldData={usersData || []}/>
            )}
          </Form.Item>}
          {(deviceTypeObj.key == DeviceType.ServerDeviceType.key) &&
          <Form.Item {...formItemLayout} label={formatMessage({id: 'app.cb.globalApp.Service'})}>
            {getFieldDecorator('serverId', {
              initialValue: serverId,
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'app.cb.devicemanage.pleaseSelAccessService'}),
                },
              ],
            })(
              <SearchInput placeholder={formatMessage({id: 'app.cb.devicemanage.pleaseSelAccessService'})}
                           fetchFunction={this.fetchSearchInputServices} oldData={serviceData || []}/>
            )}
          </Form.Item>}

          <Form.Item {...formItemLayout} label={accessDeviceALabel}>
            {getFieldDecorator('deviceId', {
              initialValue: deviceId,
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'app.cb.devicemanage.plseaseSelAccessDevice'}),
                },
              ],
            })(
              <SearchInput placeholder={formatMessage({id: 'app.cb.devicemanage.plseaseSelAccessDevice'})}
                           fetchFunction={this.fetchSearchInputAccessDevices} oldData={accessDeviceData || []}
                           onChange={this.handleDeviceChange}/>
            )}
          </Form.Item>
          {(deviceTypeObj.key == DeviceType.SwitchDeviceType.key) &&
          <Form.Item {...formItemLayout} label={formatMessage({id: 'app.cb.devicemanage.connectMethod'})}>
            {getFieldDecorator('connMethod', {
              initialValue: accessMethod,
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'app.cb.devicemanage.PleaseSelConnectMethod'}),
                },
              ],
            })(
              <Radio.Group onChange={this.onAccessMethodChange}>
                <Radio value={AddDeviceConnMethodType.AccessType.key}>{AddDeviceConnMethodType.AccessType.desc}</Radio>
                <Radio
                  value={AddDeviceConnMethodType.ConnectToType.key}>{AddDeviceConnMethodType.ConnectToType.desc}</Radio>
              </Radio.Group>
            )}
          </Form.Item>}
          {accessMethod == AddDeviceConnMethodType.AccessType.key && deviceTypeObj.key == DeviceType.SwitchDeviceType.key &&
          <Form.Item {...formItemLayout} label={accessDeviceBLabel}>
            {getFieldDecorator('peerDeviceId', {
              initialValue: peerDeviceId,
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'app.cb.devicemanage.plseaseSelAccessDevice'}),
                },
              ],
            })(
              <SearchInput defaultActiveFirstOption={true}
                           placeholder={formatMessage({id: 'app.cb.devicemanage.plseaseSelAccessDevice'})}
                           fetchFunction={this.fetchSearchPeerInputAccessDevices} oldData={peerAccessDeviceData || []}
                           onChange={this.handlePeerDeviceChange}/>
            )}
          </Form.Item>}
          {(accessMethod == AddDeviceConnMethodType.ConnectToType.key && deviceTypeObj.key == DeviceType.SwitchDeviceType.key) &&
          <Form.Item {...formItemLayout} label={formatMessage({id: 'app.cb.devicemanage.activationCode'})}>
            {getFieldDecorator('invateCode', {
              initialValue: invateCode,
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'app.cb.devicemanage.pleaseEnterActivationCode'}),
                },
                {
                  pattern: length8Pattern,
                  message: formatMessage({id: 'app.cb.devicemanage.illegalActivateCode'})
                }
              ],
            })(
              <Input placeholder={formatMessage({id: 'app.cb.devicemanage.pleaseEnterActivationCode'})}/>
            )}
          </Form.Item>}
          {(accessMethod == AddDeviceConnMethodType.ConnectToType.key && deviceTypeObj.key == DeviceType.SwitchDeviceType.key) &&
          <Form.Item {...formItemLayout} label={formatMessage({id: 'app.cb.devicemanage.inboundIp'})}>
            {getFieldDecorator('ip', {
              initialValue: ip,
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'app.cb.devicemanage.pleaseEnterIpAddress'}),
                },
                {
                  pattern: ipv4Pattern,
                  message: formatMessage({id: 'app.cb.devicemanage.illegalIp'})
                }
              ],
            })(
              <Input placeholder={formatMessage({id: 'app.cb.devicemanage.pleaseEnterIpAddress'})}/>
            )}
          </Form.Item>}
          <Form.Item
            style={{
              marginBottom: 8,
            }}
            wrapperCol={{
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={this.onValidateForm} loading={submitting}>
              {formatMessage({id: 'app.cb.globalApp.submit'})}
            </Button>
            <Button
              disabled={submitting}
              onClick={this.onPrev}
              style={{
                marginLeft: 8,
              }}
            >
              {formatMessage({id: 'app.cb.globalApp.previous'})}
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{margin: '40px 0 24px'}}/>
        {accessMethod == AddDeviceConnMethodType.AccessType.key && deviceTypeObj.key == DeviceType.SwitchDeviceType.key &&
        <div className={styles.desc}>
          <h3>{formatMessage({id: 'app.globalApp.description'})}</h3>
          <h3>{formatMessage({id: 'app.cb.devicemanage.connectMethod'})}</h3>
          <p>
            {formatMessage({id: 'app.cb.devicemanage.addDeviceStep2Desc1'})}
          </p>
          <p>
            {formatMessage({id: 'app.cb.devicemanage.addDeviceStep2Desc2'})}
          </p>
          <h3>{formatMessage({id: 'app.cb.devicemanage.accessdevice'})}</h3>
          <p>  {formatMessage({id: 'app.cb.devicemanage.addDeviceStep2Desc3'})}</p>
        </div>}
        {accessMethod == AddDeviceConnMethodType.ConnectToType.key && deviceTypeObj.key == DeviceType.SwitchDeviceType.key &&
        <div className={styles.desc}>
          <h3>{formatMessage({id: 'app.globalApp.description'})}</h3>
          <h3>{formatMessage({id: 'app.cb.devicemanage.accessdevice'})}(A)</h3>
          <p>
            {formatMessage({id: 'app.cb.devicemanage.addDeviceStep2Desc4'})}
          </p>
        </div>
        }
      </Fragment>
    );
  }
}

export default Step2
