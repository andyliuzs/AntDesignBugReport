import {
  Divider,
  Form,
  Row,
  Col,
  Card, Descriptions, message, Avatar, Spin
} from 'antd';
import React, {Component, Fragment} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
// import PageHeaderWrapper from '@/myComponents/MyPageHeaderWrapper';
import {connect} from 'dva';
import {formatMessage} from 'umi-plugin-react/locale';
import styles from './style.less';
import { RouterPath} from "../../../constants/constants";
import {itemRender} from "../../../utils/uiutil";
import {DISPATCH} from "@/constants/DvaAndApiConfig";

/* eslint react/no-multi-comp:0 */
@connect(({deviceManage, loading}) => {
  return ({
    deviceManage,
    loading: loading.effects[DISPATCH.deviceManage.deviceDetail],
  })
})
class Details extends Component {
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

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.refreshInfo()
  }

  componentWillUnmount() {
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

  render() {
    const {
      loading
    } = this.props;
    const { currentSwitch} = this.state;

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
        path: RouterPath.DEVICE_MANAGE_DETAILS,
        component: false,
        breadcrumbName: formatMessage({id: 'app.cb.devicemanage.accessDeviceDetails'}),
      }
    ];
    return (
      <PageHeaderWrapper
        title={formatMessage({id: 'app.cb.devicemanage.accessDeviceDetails'})}
        breadcrumb={{routes, itemRender}}
      >
        <Spin spinning={loading}>
          <div className={styles.manageTableList}>
            <Card bordered={false} style={{marginTop: 24,}} >
              <Descriptions
                col="3"
                style={{margin: "8px"}}
                title={formatMessage({id: 'app.cb.devicemanage.basemessage'})}
              >
                <Descriptions.Item
                  label={formatMessage({id: 'app.cb.devicemanage.icon'})}
                >
                  <Avatar alt="" src={currentSwitch?.icon} icon={'cluster'} size="large"/>
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
              <Divider />
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
                </Descriptions.Item>
              </Descriptions>
              <Divider />

              <Descriptions
                col="3"
                style={{margin: "8px"}}
                title={formatMessage({id: 'app.cb.devicemanage.accessDeviceDetails'})}
              >

                <Descriptions.Item
                  label={formatMessage({id:  'app.cb.devicemanage.userDevice'})}
                >
                  {currentSwitch?.user_count|| "0"}{formatMessage({id: 'app.cb.globalApp.nDesk'})}
                </Descriptions.Item>

                <Descriptions.Item
                  label={formatMessage({id:  'app.cb.devicemanage.serviceDevice'})}
                >
                  {currentSwitch?.server_count|| "0"}{formatMessage({id: 'app.cb.globalApp.nDesk'})}
                </Descriptions.Item>

                <Descriptions.Item
                  label={formatMessage({id:  'app.cb.devicemanage.accessdevice'})}
                >
                  {currentSwitch?.switch_count|| "0"}{formatMessage({id: 'app.cb.globalApp.nDesk'})}
                </Descriptions.Item>
              </Descriptions>

            </Card>
          </div>
        </Spin>
      </PageHeaderWrapper>
    );
  }


}

export default Form.create()(Details);
