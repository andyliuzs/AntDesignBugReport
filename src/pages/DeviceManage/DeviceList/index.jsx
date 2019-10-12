import {
  Button,
  Col,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Row,
  Radio,
  Select,
  message, Modal, Card, Badge, Avatar
} from 'antd';
import React, {Component, Fragment} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
// import PageHeaderWrapper from '@/myComponents/MyPageHeaderWrapper';
import {connect} from 'dva';
import moment from 'moment';
import {findDOMNode} from 'react-dom';
import MyStandardTable from '@/myComponents/MyStandardTable';
import styles from './style.less';
import {DISPATCH, EventAction} from "../../../constants/DvaAndApiConfig";
import {formatMessage} from 'umi-plugin-react/locale';
import PageHeaderSearchAndBtn from "../../../myComponents/PageHeaderSearchAndBtn";
import {DevicesTypeName, DeviceType, ResponseDataResult, RouterPath} from "../../../constants/constants";
import {itemRender} from "../../../utils/uiutil";
import Event from "@/utils/Event";
import {getOnLineTime} from "@/utils/utils";
import MoveDeviceDialog from "@/myComponents/Dialogs/MoveDeviceDialog";
import DeviceDetailDialog from "@/myComponents/Dialogs/DeviceDetailDialog";
import _ from 'lodash'
import deviceDefaultIcon from '@/assets/serviceDefaultIcon.png';

const {Search} = Input
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const onLineStatusMap = ['default', 'success', 'error'];


/* eslint react/no-multi-comp:0 */
@connect(({deviceManage}) => {
  return ({
    deviceManage,
  })
})
class Manage extends Component {
  state = {
    nowTime: new Date().getTime(),
    currentDevice: {
      deviceId: this.props.history?.location?.query?.deviceId || '',
      deviceType: this.props.history?.location?.query?.deviceType || '',
      deviceName: this.props.history?.location?.query?.deviceName || '',
      deviceAvatar: this.props.history?.location?.query?.deviceAvatar || '',
    },
    selectedRows: [],
    searchValues: {
      filterValue: '', // 检索框
      tableValues: {}
    },// 表格区的筛选},

    formValues: {},
    manageData: {
      list: [],
      pagination: {},
      stat: {
        user_count: 0,
        server_count: 0
      }
    },
    loading:false,
  };
  columns = [
    {
      title: formatMessage({id: 'app.cb.devicemanage.manage.name'}),
      dataIndex: 'name',
      render: (val, record) => {
        return <span>{record.user?.username}</span>
      }
    },
    {
      title: formatMessage({id: 'app.cb.devicemanage.manage.device'}),
      dataIndex: 'device',
      render: (val, record) => {
        return <span>{DevicesTypeName[record.device?.os || 'IS_NULL']}</span>
      }
    },
    {
      title: formatMessage({id: 'app.cb.devicemanage.manage.online_offline_time'}),
      dataIndex: 'time',
      render: (val, record) => {

        const isActivate = _.has(record, 'device');
        let status = isActivate ? (record?.is_online ? onLineStatusMap[1] : onLineStatusMap[2]) : onLineStatusMap[0];
        const text = isActivate ? getOnLineTime(this.state.nowTime, record) : formatMessage({id: 'app.cb.devicemanage.manage.inactivated'});
        return <Badge status={status} text={text}/>
      }
    },
    {
      title: formatMessage({id: 'app.cb.globalapp.operation'}),
      render: (text, record) => {
        const MoreBtn = ({item}) => (
          <Dropdown
            overlay={
              <Menu onClick={({key}) => this.moreAction(key, item)}>
                <Menu.Item key="details">{formatMessage({id: 'app.cb.globalApp.detail'})}</Menu.Item>
                <Menu.Item key="reset">{formatMessage({id: 'app.cb.globalApp.reset'})}</Menu.Item>
                <Menu.Item key="move">{formatMessage({id: 'app.cb.globalApp.move'})}</Menu.Item>
                {/* <Menu.Item key="disable">{formatMessage({id: 'app.cb.globalApp.set_disable'})}</Menu.Item> */}
              </Menu>
            }
          >
            <a>
              {formatMessage({id: 'app.cb.globalApp.more'})} <Icon type="down"/>
            </a>
          </Dropdown>
        );
        return <Fragment>
          <a onClick={() => this.handleRelease(record)}>{formatMessage({id: 'app.cb.devicemanage.manage.release'})}</a>
          <Divider type="vertical"/>
          <MoreBtn key="more" item={record}/>
        </Fragment>
      },
    },
    // {
    //   title: formatMessage({id: 'app.cb.globalapp.operation'}),
    //   render: (text, record) => {
    //     return <Fragment>
    //       <a onClick={() => this.handleDelete(record)}>{formatMessage({id: 'app.cb.globalApp.delete'})}</a>
    //       <Divider type="vertical"/>
    //       <a onClick={() => this.handleShowDetail(record)}>{formatMessage({id: 'app.cb.globalApp.detail'})}</a>
    //     </Fragment>
    //   },
    // },
  ];


  componentDidMount() {
    this.refreshTable()
    console.log('componentDidMount')
    console.log('currentDevice', this.state.currentDevice, this.props)
    Event.on(EventAction.deviceManage.notifyUpdateOnlineStatus, this.updateDeviceOnline)
    Event.on(EventAction.deviceManage.notifyUpdateOfflineStatus, this.updateDeviceOffline)
    Event.on(EventAction.deviceManage.notifyUpdateDeviceStatus, this.notifyUpdateDeviceStatus)
    Event.on(EventAction.socket.reconnect, this.socketReconnect)
  }

  componentWillUnmount() {
    Event.off(EventAction.deviceManage.notifyUpdateOnlineStatus, this.updateDeviceOnline)
    Event.off(EventAction.deviceManage.notifyUpdateOfflineStatus, this.updateDeviceOffline)
    Event.off(EventAction.deviceManage.notifyUpdateDeviceStatus, this.notifyUpdateDeviceStatus)
    Event.off(EventAction.socket.reconnect, this.socketReconnect)
    console.log('componentWillUnmount')
  }


  updateDeviceOnline = (onLinedata) => {

    let isChange = false;
    console.log('receive notifyUpdateOnlineStatus online', onLinedata)
    const {manageData} = this.state
    // eslint-disable-next-line no-undef
    _.forEach(onLinedata?.nis, (item, index) => {
      const localDataIndex = _.findIndex(manageData?.list, {id: item.id});
      if (localDataIndex >= 0) {
        manageData.list[localDataIndex].is_online = item;
        const device = {...manageData.list[localDataIndex].device}
        device.gone_time = item.device.gone_time;
        device.last_time = item.device.last_time;
        device.active_time = item.device.active_time;
        manageData.list[localDataIndex]['device'] = device
        isChange = true;
      }
    })

    if (isChange) {
      this.setState({
        manageData: manageData
      }, () => {
      })

    }

  }

  updateDeviceOffline = (offLineData) => {
    console.log('receive notifyUpdateOnlineStatus offline', offLineData )
    let isChange = false;
    const {manageData} = this.state
    // eslint-disable-next-line no-undef
    _.forEach(offLineData?.nis, (item, index) => {
      const localDataIndex = _.findIndex(manageData?.list, {id: item.id});
      if (localDataIndex >= 0) {

        const model = _.remove(_.keys( manageData.list[localDataIndex]), (item) => {
          return item !== 'is_online'
        })
        const newObj  = _.pick(manageData.list[localDataIndex], model);


        const device = {...newObj.device}
        device.gone_time = item.device.gone_time;
        device.last_time = item.device.last_time;
        device.active_time = item.device.active_time;
        newObj.device = device

        manageData.list[localDataIndex] = newObj

        isChange = true;
      }
    })

    if (isChange) {
      this.setState({
        manageData: manageData
      }, () => {
      })
    }

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (_.isEqual(prevState, this.state)) {
      console.log('数据相同，不刷新页面')
      return false;
    } else {
      return true;
    }
  }

  notifyUpdateDeviceStatus = (_data) => {
    this.refreshTable()
    console.log('receive notifyUpdateDeviceStatus', _data)

  }
  socketReconnect = () => {
    console.log('receive socketReconnect refresh data')
  }


  // table filter parameters change
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {formValues} = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const tableValues = {...filters}
    if (sorter.field) {
      tableValues.sorter = `${sorter.field}_${sorter.order}`;
    }
    // 保存过滤和排序参数
    this.setState({
      searchValues: {
        tableValues: tableValues,
        filterValue:this.state.searchValues.filterValue
      }
    });
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...tableValues,
    };
    console.log('handleStandardTableChange')
    this.refreshTable(params)
  };


  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
// 更多操作
  moreAction = (key, record) => {
    if (key === 'details') {
      this.handleShowDetail(record);
    } else if (key === 'reset') {
      this.handleReset(record)
    } else if (key === 'move') {
      this.handleMove(record)
    } else if (key === 'disable') {
      this.handleDisable(record)
    }
  };
  handleShowDetail = (record) => {
    console.log('show detail')
    DeviceDetailDialog.show(record, () => {
    })
  }

  handleReset = (record) => {
    const {dispatch} = this.props;
    let icon = <Icon type='exclamation-circle' theme={'filled'}/>
    let that = this;
    Modal.confirm({
      icon: icon,
      title: formatMessage({id: 'app.cb.globalApp.reset'}),
      content: formatMessage({id: 'app.cb.devicemanage.manage.resetDesc'}),
      okText: formatMessage({id: 'app.cb.globalApp.reset'}),
      cancelText: formatMessage({id: 'app.cb.globalApp.cancel'}),
      onOk: () => {
        return new Promise((resolve, reject) => {
          dispatch({
            type: DISPATCH.deviceManage.manageReset,
            payload: {id: record.id},
            callback: (res) => {
              if (res.r === 'ok') {
                message.success(formatMessage({id: 'app.cb.devicemanage.manage.resetSuccess'}))
                this.refreshTable()
                resolve()

              } else {
                message.error(`${formatMessage({id: 'app.cb.devicemanage.manage.resetFailed'})},` + res.msg)
                reject()
              }
            }
          });
        }).catch(() => console.log('del user error oops errors!'));
      },
    });
  }

  // 移动
  handleMove = (record) => {
    MoveDeviceDialog.show(record, () => {
    }, () => {
      this.refreshTable()
    })
  }

  // 禁用
  handleDisable = (record) => {
    const {dispatch} = this.props;
    let that = this;
    let icon = <Icon type='exclamation-circle' theme={'filled'}/>
    Modal.confirm({
      icon: icon,
      title: formatMessage({id: 'app.cb.globalApp.set_disable'}),
      content: formatMessage({id: 'app.cb.devicemanage.manage.disableDesc'}),
      okText: formatMessage({id: 'app.cb.globalApp.set_disable'}),
      cancelText: formatMessage({id: 'app.cb.globalApp.cancel'}),
      onOk: () => {
        return new Promise((resolve, reject) => {
          dispatch({
            type: DISPATCH.deviceManage.manageDisable,
            payload: {id: record.id},
            callback: (res) => {
              if (res.r === 'ok') {
                message.success(formatMessage({id: 'app.cb.devicemanage.manage.disableSuccess'}))
                that.refreshTable()
                resolve()
              } else {
                message.error(`${formatMessage({id: 'app.cb.devicemanage.manage.disableFailed'})},` + res.msg)
                reject()
              }
            }
          });
        }).catch(() => console.log('del user error oops errors!'));

      },
    });
  }

  // 解除
  handleRelease = (record) => {
    const {dispatch} = this.props;
    let icon = <Icon type='exclamation-circle' theme={'filled'}/>
    Modal.confirm({
      icon: icon,
      title: formatMessage({id: 'app.cb.devicemanage.manage.release'}),
      content: formatMessage({id: 'app.cb.devicemanage.manage.releaseDesc'}),
      okText: formatMessage({id: 'app.cb.devicemanage.manage.release'}),
      cancelText: formatMessage({id: 'app.cb.globalApp.cancel'}),
      onOk: () => {
        return new Promise((resolve, reject) => {
          dispatch({
            type: DISPATCH.deviceManage.manageRelease,
            payload: {id: record.id},
            callback: (res) => {
              if (res.r === 'ok') {
                message.success(formatMessage({id: 'app.cb.devicemanage.manage.releaseSuccess'}))
                this.refreshTable()
                resolve()
              } else {
                message.error(`${formatMessage({id: 'app.cb.devicemanage.manage.releaseFailed'})},` + res.msg)
                reject()
              }
            }
          });
        }).catch(() => console.log('del user error oops errors!'));

      },
    });
  }

  refreshTable = (tableValues = this.state.searchValues.tableValues) => {
    const {dispatch} = this.props;
    const {searchValues, currentDevice} = this.state;
    console.log('currentdevice',currentDevice)
    const search = {search: searchValues.filterValue}
    console.log('refreshTable', {...search, ...tableValues})
    this.setState({
      loading:true,
    })
    dispatch({
      type: DISPATCH.deviceManage.manageList,
      payload: {
        ...search, ...tableValues,
        filter: {switch: currentDevice.deviceId, peer_type: currentDevice.deviceType}
      },
      callback: (res) => {
        if (res.r == ResponseDataResult.OK) {
          this.setState({
            nowTime: res.time,
            manageData: res
          })
        }
        this.setState({
          loading:false,
        })
        console.log('refresh table', res)
      }
    });
  };

  onSearch = (value) => {
    console.log('onSearch value', value)
    this.setState({
      searchValues: {
        filterValue: value,
      }
    }, () => {
      this.refreshTable()
    })

  };

  render() {
    const {loading,manageData} =this.state
    const {selectedRows, currentDevice} = this.state;

    const pageHeaderContent = (<PageHeaderSearchAndBtn onSearch={this.onSearch}/>)
    const showDeviceType = ((currentDevice.deviceType == DeviceType.ServerDeviceType.key || currentDevice.deviceType == DeviceType.SwitchDeviceType.key) ?
      formatMessage({id: 'app.cb.devicemanage.serviceDevice'}) : formatMessage({id: 'app.cb.devicemanage.userDevice'}))
    const routes = [
      {
        patch: '/',
        breadcrumbName: formatMessage({id: 'app.cb.devicemanage.breadcrumb.devicemanage'}),
        component: false,
      },
      {
        path: RouterPath.DEVICE_MANAGE,
        component: true,
        breadcrumbName: formatMessage({id: 'app.cb.devicemanage.breadcrumb.accessdevice'}),
      },
      {
        path: RouterPath.DEVICE_MANAGE_DEVICE_LIST,
        breadcrumbName: showDeviceType,
      },
    ];
    const deviceCount = ((currentDevice.deviceType == DeviceType.ServerDeviceType.key || currentDevice.deviceType == DeviceType.SwitchDeviceType.key) ?
      manageData.stat?.server_count : manageData.stat?.user_count)
    return (
      <PageHeaderWrapper content={pageHeaderContent} title={false} breadcrumb={{routes: routes, itemRender}}>
        <div className={styles.manageTableList}>
          <Card bordered={false} style={{marginTop: 24,}}>
            <div className={styles.tableTopDesc}>
              <Row>
                <Col>
                    <img
                      alt=""
                      style={{verticalAlign: 'middle', width:'32px',height:'32px'}}
                      src={currentDevice?.deviceAvatar ||deviceDefaultIcon }
                    />
                  <span className={styles.title}>{currentDevice?.deviceName}</span>
                  <span
                    className={styles.desc}>{`${deviceCount} ${formatMessage({id: 'app.cb.globalApp.nDesk'})}${showDeviceType}`}</span>
                </Col>
              </Row>
            </div>
            <MyStandardTable
              selectedRows={selectedRows}
              loading={loading}
              rowKey={'id'}
              data={manageData}
              haveTopAlert={false}
              haveBatchOperation={false}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }


}

export default Form.create()(Manage);
