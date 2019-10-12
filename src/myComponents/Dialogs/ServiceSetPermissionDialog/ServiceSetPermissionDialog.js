import React, {PureComponent} from 'react'
import {connect} from 'dva';
import PropTypes from 'prop-types'
import styles from "../StandardListForm.less";
import Result from '@/myComponents/MyResult';
import {DISPATCH} from '../../../constants/DvaAndApiConfig.jsx'
import {ResponseDataResult, ServiceAclStatus, ServiceType} from '../../../constants/constants'
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  message, Radio, Descriptions, Select, Spin,
} from 'antd';
import _ from 'lodash'
import {findDOMNode} from "react-dom";
import {AddServiceSteps, ServicePermissionType, ServiceRoleType, UserType} from "../../../constants/constants";
import {formatMessage} from 'umi-plugin-react/locale';
import TableTransfer from "@/myComponents/TableTransFer";

const {Option} = Select;
const {TextArea} = Input;
const FormItem = Form.Item;
const rolesOptions = [{label: UserType[0].desc, value: UserType[0].key}, {
  label: UserType[1].desc,
  value: UserType[1].key
}]

@Form.create()
class ServiceSetPermissionDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      oldCurrent: {...this.props.current} || {},
      current: this.props.current || {},
      loading: false,
      disAccessServices: [],
      oldDisAccessService:[],
      targetKeys: [],// 已经在目标框中的数据
      oldTargetKeys: [],
    };
  }

  componentDidMount() {
    const {current} = this.state
    console.log('current and acl', current)
    if (current && current.acl_status == ServicePermissionType.Control.key) {
      this.fetchAllDevices()
    }
  }

  fetchAllDevices = () => {
    console.log('fetchAllDevices')
    const {dispatch} = this.props
    const {current} = this.state
    dispatch({
      type: DISPATCH.serviceManage.deviceList,
      payload: {id: current.id},
      callback: (res) => {
        console.log('fetchAllDevices', res)
        if (res.r == ResponseDataResult.OK) {
          let targetKeys = []
          let disAccessServices = []

          _.forEach(res?.datas, (item, index) => {
            item['key'] = item.id,
              disAccessServices.push(item)
            if (item.access) {
              targetKeys.push(item.id)
            }
          })
          this.setState({
            targetKeys: targetKeys,
            oldTargetKeys: _.concat(targetKeys,[]),
            disAccessServices: disAccessServices,
            oldDisAccessService:_.concat(disAccessServices,[])
          })
        }
      }
    });
  }

  leftTableColumns = [
    {
      dataIndex: 'name',
      title: formatMessage({id: 'app.cb.devicemanage.manage.name'}),
      render: val => {
        if (val && val.length > 8) {
          return <span>${val.slice(0, 8)}...</span>
        } else {
          return <span>{val}</span>
        }
      }
    },
    {
      dataIndex: 'peer_type',
      title: formatMessage({id: 'app.cb.usermanage.typeOf'}),
      render: val => <span>{ServiceRoleType[val]?.desc || '--'}</span>,
    },
    {
      dataIndex: 'note',
      title: formatMessage({id: 'app.cb.globalApp.note'}),
      render: val => {
        if (val && val.length > 8) {
          return <span>{`${val.slice(0, 8)}...`}</span>
        } else {
          return <span>{val}</span>
        }
      }
    },
  ];

  rightTableColumns = [
    {
      dataIndex: 'name',
      title: formatMessage({id: 'app.cb.devicemanage.manage.name'}),
    },
  ];

  formLayout = {
    labelCol: {span: 3},
    wrapperCol: {span: 12},
  };


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

  updateLoadind = (loading) => {
    this.setState({
      loading: loading
    })
  }


  /**
   * 处理新建和编辑对话框的确认按钮
   * @param e
   */
  handleSubmit = e => {
    e.preventDefault();
    let that = this;

    const {dispatch, form: {validateFields}, onSuccess} = that.props;
    const {oldDisAccessService, current, oldCurrent, oldTargetKeys, targetKeys} = that.state

    validateFields((err, values) => {
      console.log('values', values)
      if (!err) {
        if (current?.id == null) {
          this.handleDone()
          return;
        }
        if (current.acl_status == ServicePermissionType.Control.key) {
          if (_.isEqual(oldTargetKeys, targetKeys)) {
            // 代表没变化
            console.log('权限设置数据无变化')
            this.handleDone()
            return
          }
        } else if (current.acl_status == oldCurrent.acl_status) {
          console.log('规则未发生变化', current.acl_status, oldCurrent.acl_status)
          this.handleDone()
          return;
        }


        let removeRolesIds = []
        if (_.isEmpty(oldTargetKeys)) {
          removeRolesIds = []
        } else if (_.isEqual(oldTargetKeys, targetKeys)) {
          removeRolesIds = []
        } else {
          if (_.isEmpty(targetKeys)) {
            removeRolesIds = oldTargetKeys
          } else {
            _(oldTargetKeys).forEach((itm) => {
              {
                if (_.indexOf(targetKeys, itm) < 0) {
                  removeRolesIds.push(itm)
                }
              }
            })
          }
        }
        let targetKeyAndType = [], removeKeyAndType = [];
        if (current.acl_status == ServicePermissionType.Control.key) {
          // _.forEach(targetKeys, (iId, index) => {
          //   let itemIndex = _.findIndex(oldDisAccessService, (innerItem) => {
          //     return innerItem.id == iId
          //   })
          //   if (itemIndex >= 0) {
          //     targetKeyAndType.push({id: iId, type: oldDisAccessService[itemIndex]})
          //   }
          // })
          _.forEach(oldDisAccessService, (item, index) => {
            const targetItemId = _.indexOf(targetKeys, item.id)
            const removeItemId = _.indexOf(removeRolesIds, item.id)
            console.log('targetItemid',targetItemId,removeItemId)
            if (targetItemId >= 0) {
              targetKeyAndType.push({id: item.id, peer_type: item.peer_type})
            }
            if (removeItemId >= 0) {
              removeKeyAndType.push({id: item.id, peer_type: item.peer_type})
            }
          })
        }
        values['id'] = current.id
        values['acl_status'] = current.acl_status
        values['access_peers'] = targetKeyAndType
        values['remove_access_peers'] = removeKeyAndType

        console.log('setrole values is ', values)
        this.updateLoadind(true)
        if (dispatch) {
          dispatch({
            type: DISPATCH.serviceManage.setServiceRole,
            payload: {...values},
            callback: (res) => {
              if (res.r === ResponseDataResult.OK) {
                onSuccess();
                that.handleDone();
                message.success(`${formatMessage({id: 'app.cb.globalApp.settingSuccess'})}！`)
              } else {
                // that.setState({
                //   failure: true,
                //   failureReason: res.msg
                // });
                message.error(`${formatMessage({id: 'app.cb.globalApp.settingError'})} ${res?.msg}!`)
              }
              this.updateLoadind(false)
            }
          });
        } else {
          this.handleDone()
          console.log('dispatch is null')
        }
      }
    });
  };
  onSelChange = (value) => {
    console.log('onSelChange', value)
    const {current} = this.state
    current.acl_status = value
    this.setState(
      {
        current: current
      }
    )
    if (value == ServicePermissionType.Control.key) {
      this.fetchAllDevices()
    } else {
      this.setState({
        targetKeys: [],
        disAccessServices: [],
        oldDisAccessService:[],
      }, () => {
        console.log('clear target and disAccessServices data')
      })
    }
  }
  handleTransferChange = (nextTargetKeys) => {
    console.log('handleTransferChange', nextTargetKeys);
    this.setState({targetKeys: nextTargetKeys});
  };

  render() {
    let that = this;
    const {
      form: {getFieldDecorator},
      tableLoading,

    } = that.props;
    let {targetKeys, disAccessServices, oldTargetKeys, current, loading} = that.state;
    const okBtnText = (current && current.id) ? formatMessage({id: 'app.cb.globalApp.ok'}) : formatMessage({id: 'app.cb.globalApp.add'})
    const modalFooter = {
      onCancel: this.handleCancel,
      footer: [
        <Button key="cancel" onClick={that.handleCancel}>
          {formatMessage({id: 'app.cb.globalApp.cancel'})}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
          {okBtnText}
        </Button>,
      ]
    }
    const operations = [formatMessage({id: 'app.cb.servicemanage.joinRight'}),
      formatMessage({id: 'app.cb.servicemanage.joinLeft'})];
    const locale = {
      itemUnit: formatMessage({id: 'app.globalApp.item'}),
      itemsUnit: formatMessage({id: 'app.globalApp.item'}),
      searchPlaceholder: formatMessage({id: 'app.cb.globalApp.pleaseInput'}),
    }
    console.log('targetkeys', targetKeys)
    const getModalContent = () => {

      const view =
        <div>
          <Descriptions size="small" col="2">
            <Descriptions.Item
              label={formatMessage({id: 'app.cb.servicemanage.serviceName'})}
            >{current.name}
            </Descriptions.Item>
            <Descriptions.Item
              label={formatMessage({id: 'app.cb.servicemanage.servicetype'})}>
              {(ServiceType[_.findKey(ServiceType, {key: current.type})])?.desc || '--'}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions size="small">
            <Descriptions.Item
              label={formatMessage({id: 'app.cb.servicemanage.devicePermissions'})}
            >
              <Select dropdownMatchSelectWidth={false} defaultValue={current.acl_status} placeholder={formatMessage({id: 'app.cb.globalApp.pleaseSel'})}
                      onChange={this.onSelChange}>
                <Option value={ServicePermissionType.Open.key}>{ServicePermissionType.Open.desc}</Option>
                <Option value={ServicePermissionType.Block.key}>{ServicePermissionType.Block.desc}</Option>
                <Option value={ServicePermissionType.Control.key}>{ServicePermissionType.Control.desc}</Option>
              </Select>
            </Descriptions.Item>
          </Descriptions>

          <Spin spinning={tableLoading}>
            <TableTransfer
              dataSource={disAccessServices}
              targetKeys={targetKeys}
              pagination={true}
              operations={operations}
              showSearch={true}
              locale={locale}
              tableKey={'id'}
              onChange={this.handleTransferChange}
              filterOption={(inputValue, item) => {
                let nameIndexOf = item.name?.indexOf(inputValue)
                let noteIndexOf = item.note?.indexOf(inputValue)
                let peer_typeIndexof = (ServiceRoleType[item.peer_type]?.desc || '')?.indexOf(inputValue)
                if (nameIndexOf == undefined) {
                  nameIndexOf = -1;
                }
                if (noteIndexOf == undefined) {
                  noteIndexOf = -1;
                }
                if (peer_typeIndexof == undefined) {
                  peer_typeIndexof = -1;
                }

                return nameIndexOf !== -1 || noteIndexOf !== -1 || peer_typeIndexof !== -1
              }
              }
              leftColumns={this.leftTableColumns}
              rightColumns={this.rightTableColumns}
            />
          </Spin>

        </div>
      return view;
    }
    return (
      <Modal
        title={formatMessage({id: 'app.cb.globalApp.setpermission'})}
        width={'50%'}
        bodyStyle={{padding: '28px  40px'}}
        destroyOnClose
        visible={that.state.visible}
        afterClose={that.onAfterClose}
        {...modalFooter}
      >
        {getModalContent()}
      </Modal>
    );
  }
}

ServiceSetPermissionDialog.propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
ServiceSetPermissionDialog.defaultProps = {
  onDismiss: () => {
    console.log('//todo->ServiceSetPermissionDialog:onDismiss');
  },
  onSuccess: () => {
    console.log('//todo->ServiceSetPermissionDialog:onSuccess');
  },
  removeDialog: () => {
    console.log('//todo->ServiceSetPermissionDialog:removeDialog');
  }
};

const mapStateToProps = ({serviceManage, loading}) => {
  return {
    serviceManage: serviceManage,
    tableLoading: loading.effects[DISPATCH.serviceManage.deviceList] || false,
  }

};

export default connect(mapStateToProps)(ServiceSetPermissionDialog)
