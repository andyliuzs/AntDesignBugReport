import {Button, Card, List, Row, Col, Input, Form} from 'antd';
import React, {Component} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {connect} from 'dva';
import styles from './style.less';
import {findDOMNode} from 'react-dom';
import {formatMessage} from 'umi-plugin-react/locale';
import PageHeaderSearchAndBtn from '../../../myComponents/PageHeaderSearchAndBtn';
import {DISPATCH, EventAction} from '../../../constants/DvaAndApiConfig';
import router from 'umi/router';
import {RouterPath, DeviceType} from '../../../constants/constants';
import {Link} from 'umi';
import {itemRender} from '../../../utils/uiutil';
import Event from '@/utils/Event';
import defaultIcon from '@/assets/serviceDefaultIcon.png';
import _ from 'lodash';

const {Search} = Input;
import TextMarquee from '@/myComponents/TextMarquee';
import {bytesToSize} from '@/utils/utils';

@connect(({deviceManage, loading}) => ({
  deviceManage,
  loading: loading.models.deviceManage,
}))
class AccessDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: undefined,
      accessData: {},
    };
  }

  componentDidMount() {
    this.refreshTable();
    Event.addListener(EventAction.deviceManage.notifyUpdateSpeed, this.updateSpeed);
    Event.addListener(
      EventAction.deviceManage.notifyUpdateDeviceStatus,
      this.notifyUpdateDeviceStatus,
    );
    Event.addListener(EventAction.socket.reconnect, this.socketReconnect);
  }

  updateSpeed = speedData => {
    console.log('receive notifyUpdateSpeed', speedData);
    const speedItemId = _.keys(speedData)[0];
    const {dispatch} = this.props;
    let accessData = this.state.accessData;
    let isChange = false;
    if (speedData[speedItemId]) {
      _.forEach(this.state.accessData.list, (item, index) => {
        if (item.id == speedItemId) {
          accessData.list[index].rx = bytesToSize(speedData[speedItemId]['rx']);
          accessData.list[index].tx = bytesToSize(speedData[speedItemId]['tx']);
          isChange = true;
          return;
        }
      });
      if (isChange) {
        this.setState({
          accessData: {
            list: accessData?.list,
          },
        });
      }
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('componentDidUpdate');
  }

  refreshTable = () => {
    const {dispatch} = this.props;
    dispatch({
      type: DISPATCH.deviceManage.accessDevicesList,
      payload: {search: this.state.key, ignorePage: true, stat: true},
      callback: res => {
        _.forEach(res.list, item => {
          item.rx = '10B';
          item.tx = '12B';
        });
        this.setState({accessData: res});
      },
    });
  };

  componentWillUnmount() {
    Event.off(EventAction.deviceManage.notifyUpdateSpeed, this.updateSpeed);
    Event.off(EventAction.deviceManage.notifyUpdateDeviceStatus, this.notifyUpdateDeviceStatus);
    Event.off(EventAction.socket.reconnect, this.socketReconnect);
  }

  notifyUpdateDeviceStatus = _data => {
    console.log('accessDevice receive notifyUpdateDeviceStatus', _data);
  };
  socketReconnect = () => {
    console.log('accessDevicereceive socketReconnect  refresh data');
  };

  showAddDevicePage = () => {
    setTimeout(() => {
      this.addBtn.blur();
    }, 0);
    console.log('add device');
  };

  onSearch = value => {
    this.setState(
      {
        key: value,
      },
      () => {
        this.refreshTable();
      },
    );
    console.log('onSearch value', value);
  };

  onClickItemManage = (record, e) => {
    console.log('click item record is', record);
  };

  onClickItemDetail = (record, e) => {
  };
  // openServerDevices=(device,e)=>{
  //   console.log('openServerDevices',device)
  //   router.push({
  //     pathname: `${RouterPath.DEVICE_MANAGE_MANAGE}?deviceId=${device?.id}&deviceType=${DeviceType.ServiceDeviceType}`,
  //     params: {
  //       currentDevice: device,
  //     },
  //   });
  // }
  // openUserDevices=(device,e)=>{
  //   console.log('openUserDevices',device)
  //   router.push({
  //     pathname: `${RouterPath.DEVICE_MANAGE_MANAGE}?deviceId=${device?.id}&deviceType=${DeviceType.UserDeviceType}`,
  //     params: {
  //       currentDevice: device,
  //     },
  //   });
  // }
  render() {
    const {
      loading,
      // deviceManage: {accessData}
    } = this.props;
    const {accessData} = this.state;
    if (!_.isEmpty(accessData) && (accessData.list?.length || 0) > 0)
      console.log('accessData render is ', accessData);
    const addBtn = (
      <Link to={RouterPath.DEVICE_MANAGE_ADD_DEVICE}>
        <Button icon="plus" type="primary">
          {' '}
          {formatMessage({id: 'app.cb.devicemanage.addDevice'})}
        </Button>
      </Link>
    );
    const routes = [
      {
        patch: '/',
        breadcrumbName: formatMessage({id: 'app.cb.devicemanage.breadcrumb.devicemanage'}),
      },
      {
        path: RouterPath.DEVICE_MANAGE,
        breadcrumbName: formatMessage({id: 'app.cb.devicemanage.breadcrumb.accessdevice'}),
      },
    ];
    const content = <PageHeaderSearchAndBtn leftButton={addBtn} onSearch={this.onSearch}/>;

    const CardInfo = ({item1, item2, device}) => {
      return (
        <Row>
          {item1 && (
            <Col span={10}>
              <Link
                to={`${RouterPath.DEVICE_MANAGE_DEVICE_LIST}?deviceId=${device?.id}&deviceType=${item1.deviceType}&deviceName=${device?.name}&deviceAvatar=${device.icon}`}
              >
                <div className={styles.cardInfoItem}>
                  <span>{item1.title}</span>
                  <p>{item1.value}</p>
                </div>
              </Link>
            </Col>
          )}
          {item2 && (
            <Col span={14}>
              <Link
                to={`${RouterPath.DEVICE_MANAGE_DEVICE_LIST}?deviceId=${device?.id}&deviceType=${item2.deviceType}&deviceName=${device?.name}&deviceAvatar=${device.icon}`}
              >
                <div className={styles.cardInfoItem}>
                  <span>{item2.title}</span>
                  <p>{item2.value}</p>
                </div>
              </Link>
            </Col>
          )}
        </Row>
      );
    };
    return (
      <PageHeaderWrapper
        content={content}
        title={false}
        breadcrumb={{routes: routes, itemRender}}
      >
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{
              gutter: 24,
              lg: 3,
              md: 2,
              sm: 1,
              xs: 1,
            }}
            dataSource={accessData.list}
            renderItem={item => {
              if (item && item.id) {
                let txItemMessage =
                  formatMessage({id: 'app.cb.devicemanage.uplinkSpeed'}) + ':' + item.tx;
                let rxItemMessage =
                  formatMessage({id: 'app.cb.devicemanage.downwardSpeed'}) + ':' + item.rx;
                let rxTxDatas = [
                  {id: '1', message: txItemMessage},
                  {id: '2', message: rxItemMessage},
                ];
                return (
                  <List.Item key={item.id}>
                    <Card
                      hoverable
                      className={styles.card}
                      actions={[
                        <Link to={`${RouterPath.DEVICE_MANAGE_MANAGE}?switchId=${item?.id}`}>
                          {formatMessage({id: 'app.cb.globalApp.management'})}
                        </Link>
                        ,
                        <Link to={`${RouterPath.DEVICE_MANAGE_DETAILS}?switchId=${item?.id}`} >
                          {formatMessage({id: 'app.cb.globalApp.detail'})}
                        </Link>
                      ]}
                    >
                      <Card.Meta
                        avatar={
                          <div style={{width:'32px', height:'32px'}}>
                            <img
                              alt=""
                              style={{verticalAlign: 'middle', width:'32px',height:'32px'}}
                              className={styles.cardAvatar}
                              src={item?.icon ? item?.icon : defaultIcon}
                            />
                          </div>
                        }
                        title={
                          <div>
                            <span className={styles.cardMetalTitle}>{item.name}</span>
                            <TextMarquee datas={rxTxDatas}/>
                          </div>
                        }
                        description={
                          <CardInfo
                            item1={{
                              title: formatMessage({id: 'app.cb.devicemanage.serviceDevice'}),
                              value: `${item?.server_count+item?.switch_count}${formatMessage({
                                id: 'app.cb.globalApp.nDesk',
                              })}`,
                              deviceType: DeviceType.ServerDeviceType.key,
                            }}
                            item2={{
                              title: formatMessage({id: 'app.cb.devicemanage.userDevice'}),
                              value: `${item?.user_count}${formatMessage({
                                id: 'app.cb.globalApp.nDesk',
                              })}`,
                              deviceType: DeviceType.UserDeviceType.key,
                            }}
                            device={item}
                          />
                        }
                      />
                    </Card>
                  </List.Item>
                );
              }
            }}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(AccessDevice);
