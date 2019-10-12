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
  message, Modal, Card, Badge, Descriptions, Spin, Avatar
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
import {DevicesTypeName, DeviceType, ResponseDataResult, RouterPath, UserType} from "../../../constants/constants";
import {itemRender} from "../../../utils/uiutil";
import Event from "@/utils/Event";
import {getOnLineTime} from "@/utils/utils";
import DeviceDetailDialog from "@/myComponents/Dialogs/DeviceDetailDialog";
import SwitchDeviceEditDialog from "@/myComponents/Dialogs/SwitchDeviceEditDialog";
import _ from "lodash";
import router from "umi/router";
import deviceDefaultIcon from "@/assets/serviceDefaultIcon.png";

const {Search} = Input
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const onLineStatusMap = ['default', 'success', 'error'];


/* eslint react/no-multi-comp:0 */
@connect(({deviceManage, loading}) => {
  return ({
    deviceManage,
    detailLoading: loading.effects[DISPATCH.deviceManage.deviceDetail],
  })
})
class Manage extends Component {
  state = {
    nowTime: new Date().getTime(),
    selectedRows: [],
    searchValues: {
      filterValue: '', // 检索框
      tableValues: {}
    },// 表格区的筛选},
    // eslint-disable-next-line react/destructuring-assignment,react/no-unused-state
    switchId: this.props.history?.location?.query?.switchId || -1,
    currentSwitch: {},
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
        // return <span>{DevicesTypeName[record.device?.os || 'IS_NULL']}</span>
      const deviceDesc =   DeviceType[_.findKey(DeviceType, {key: record?.peer_type})]?.desc
        return <span>{deviceDesc}</span>
      }
    },
    {
      title: formatMessage({id: 'app.cb.devicemanage.manage.online_offline_time'}),
      dataIndex: 'time',
      sorter: true,
      render: (val, record) => {

        const isActivate = _.has(record, 'device');
        // eslint-disable-next-line no-nested-ternary
        const status = isActivate ? (record?.is_online ? onLineStatusMap[1] : onLineStatusMap[2]) : onLineStatusMap[0];
        // eslint-disable-next-line react/destructuring-assignment
        const text = isActivate ? getOnLineTime(this.state.nowTime, record) : formatMessage({id: 'app.cb.devicemanage.manage.inactivated'});
        return <Badge status={status} text={text}/>
      }
    },
    {
      title: formatMessage({id: 'app.cb.globalapp.operation'}),
      render: (text, record) => {

        return <Fragment>
          <a onClick={() => this.handleRelease(record)}>{formatMessage({id: 'app.cb.devicemanage.manage.release'})}</a>
          <Divider type="vertical"/>
          <a onClick={() => this.handleShowDetail(record)}>{formatMessage({id: 'app.cb.globalApp.detail'})}</a>
        </Fragment>
      },
    },
  ];

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.refreshInfo()
    this.refreshTable()
  }

  refreshInfo=()=>{
    const {dispatch} = this.props
    const {switchId} = this.state
    dispatch({
      type: DISPATCH.deviceManage.deviceDetail,
      payload: {id: switchId},
      callback: (res) => {
        if (res.r === 'ok') {
          this.setState({
            currentSwitch:res.data
          })
        }
      }
    });
  }

// table filter parameters change
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const tableValues = {...filters}
    if (sorter.field) {
      // eslint-disable-next-line no-underscore-dangle
      tableValues.sorter = `${sorter.field}_${sorter.order}`;
    }
    // 保存过滤和排序参数
    this.setState({
      searchValues: {
        tableValues,
        filterValue:this.state.searchValues.filterValue
      }
    });
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
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

  handleShowDetail = (record) => {
    console.log('show detail')
    DeviceDetailDialog.show(record, () => {

    })
  }


  // 解除
  handleRelease = (record) => {
    const {dispatch} = this.props;
    const icon = <Icon type='exclamation-circle' theme="filled"/>
    Modal.confirm({
      icon,
      title: formatMessage({id: 'app.cb.devicemanage.manage.release'}),
      content: formatMessage({id: 'app.cb.devicemanage.manage.releaseDesc'}),
      okText: formatMessage({id: 'app.cb.devicemanage.manage.release'}),
      cancelText: formatMessage({id: 'app.cb.globalApp.cancel'}),
      onOk: () => {
        // eslint-disable-next-line compat/compat
        return new Promise((resolve, reject) => {
          dispatch({
            type: DISPATCH.deviceManage.manageRelease,
            payload: {id: record.id},
            callback: (res) => {
              if (res.r === 'ok') {
                message.success(formatMessage({id: 'app.cb.devicemanage.manage.releaseSuccess'}))
                resolve()
              } else {
                message.error(`${formatMessage({id: 'app.cb.devicemanage.manage.releaseFailed'})},${res.msg}`)
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
    const {searchValues,switchId} = this.state;
    const search = {search: searchValues.filterValue}
    console.log('refreshTable', {...search, ...tableValues})
    dispatch({
      type: DISPATCH.deviceManage.manageList,
      payload: {
        ...search, ...tableValues,
        filter: {peer_type: DeviceType.SwitchDeviceType.key,switch:switchId}
      },
      callback: (res) => {
        if (res.r == ResponseDataResult.OK) {
          this.setState({
            nowTime: res.time,
          })
        }
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

  modifySwitchInfo = () => {
    // eslint-disable-next-line react/destructuring-assignment
    SwitchDeviceEditDialog.show(this.state.currentSwitch, () => {
    }, () => {
      console.log('需要刷新switch信息')
      this.refreshInfo()
    })
  }

  deleteAccessDevice = () => {
    const {dispatch} = this.props;
    const {currentSwitch} = this.state
    const icon = <Icon type='exclamation-circle' theme="filled"/>
    Modal.confirm({
      icon,
      title: formatMessage({id: 'app.cb.devicemanage.deleteDevice'}),
      content: formatMessage({id: 'app.cb.devicemanage.deleteAccessDeviceTip'}),
      okText: formatMessage({id: 'app.cb.globalApp.delete'}),
      cancelText: formatMessage({id: 'app.cb.globalApp.cancel'}),
      onOk: () => {
        // eslint-disable-next-line compat/compat
        return new Promise((resolve, reject) => {
          dispatch({
            type: DISPATCH.deviceManage.removeAccessDevice,
            payload: {id: currentSwitch.id},
            callback: (res) => {
              if (res.r === 'ok') {
                message.success(formatMessage({id: 'app.cb.globalApp.removeSuccess'}))
                console.log('删除成功后，要做的操作')
                router.push(RouterPath.DEVICE_MANAGE)
                resolve()
              } else {
                message.error(`${formatMessage({id: 'app.cb.globalApp.removeError'})},${res.msg}`)
                reject()
              }
            }
          });
        }).catch(() => console.log('del user error oops errors!'));

      },
    });
  }
  onLoadImgError=()=>{
    if(this.iconImgView){
      this.iconImgView.setAttribute('src',deviceDefaultIcon)
    }
  }

  render() {
    const {
      deviceManage: {manageData},
      loading,
      detailLoading,
    } = this.props;
    const {selectedRows, currentSwitch} = this.state;
    const routes = [
      {
        patch: '/',
        breadcrumbName: formatMessage({id: 'app.cb.devicemanage.breadcrumb.devicemanage'}),
      },
      {
        path: RouterPath.DEVICE_MANAGE,
        breadcrumbName: formatMessage({id: 'app.cb.devicemanage.breadcrumb.accessdevice'}),
        component:true,
      },
      {
        path: RouterPath.DEVICE_MANAGE_MANAGE,
        component: false,
        breadcrumbName: formatMessage({id: 'app.cb.devicemanage.accessDevices'}),
      }
    ];
    return (
      <PageHeaderWrapper
        title={formatMessage({id: 'app.cb.devicemanage.accessDevices'})}
        breadcrumb={{routes, itemRender}}
      >
        <div className={styles.manageTableList}>


          <Card bordered={false} style={{marginTop: 24,}}>
            <Spin spinning={detailLoading}>

              <Row>
                <Col span={22}>
                  <Descriptions
                    col="3"
                    style={{margin: "8px"}}
                    title={formatMessage({id: 'app.cb.devicemanage.basemessage'})}
                  >
                    <Descriptions.Item
                      label={formatMessage({id: 'app.cb.devicemanage.icon'})}
                    >
                      <img
                        alt=""
                        ref={component => this.iconImgView = findDOMNode(component)}
                        className={styles.iconStyle}
                        onError={this.onLoadImgError.bind(this)}
                        style={{verticalAlign: 'middle', width:'32px',height:'32px'}}
                        src={currentSwitch?.icon || deviceDefaultIcon}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={formatMessage({id: 'app.cb.devicemanage.manage.name'})}
                    >
                      {currentSwitch?.name}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={formatMessage({id: 'app.cb.devicemanage.ipAddress'})}
                    >
                      {currentSwitch?.ip4}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={formatMessage({id: 'app.cb.devicemanage.canAddDeviceNumber'})}
                    >
                      {currentSwitch?.connect_limit}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={2}>
                  <a style={{float: 'right', marginRight:'10px'}}
                     onClick={this.modifySwitchInfo}>{formatMessage({id: 'app.cb.globalApp.modify'})}</a>
                </Col>
              </Row>
              <Divider/>
              <div className={styles.haveRightBootomBtnDesc}>
                <Descriptions
                  col="1"
                  style={{margin: "8px"}}
                  title={formatMessage({id: 'app.cb.devicemanage.deviceStatus'})}
                >
                  <Descriptions.Item
                    style={{position: 'relative'}}
                    label={formatMessage({id: 'app.cb.devicemanage.accessStatus'})}
                  >
                    {currentSwitch?.enable===1?formatMessage({id:'app.cb.devicemanage.running'}):'--'}
                    <a
                      className={styles.leftBtn}
                      onClick={this.deleteAccessDevice}
                    >
                      {formatMessage({id: 'app.cb.devicemanage.deleteDevice'})}
                    </a>
                  </Descriptions.Item>
                </Descriptions>
              </div>
              <Divider/>
              <Descriptions
                col="3"
                style={{margin: "8px"}}
                title={formatMessage({id: 'app.cb.devicemanage.accessDevices'})}
              />
            </Spin>

            <MyStandardTable
              selectedRows={selectedRows}
              loading={loading}
              rowKey='id'
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
