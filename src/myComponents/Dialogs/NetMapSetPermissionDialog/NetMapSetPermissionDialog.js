import React, {PureComponent} from 'react'
import {connect} from 'dva';
import PropTypes from 'prop-types'
import Result from '@/myComponents/MyResult';
import {DISPATCH} from '../../../constants/DvaAndApiConfig.jsx'
import {ResponseDataResult, ServiceType} from '../../../constants/constants'
import {
  Row,
  Col,
  Form,
  Button,
  Modal,
  message, Descriptions, Select, Spin,
} from 'antd';
import _ from 'lodash'
import {ServicePermissionType, ServiceRoleType} from "../../../constants/constants";
import {formatMessage} from 'umi-plugin-react/locale';
import TableTransfer from "@/myComponents/TableTransFer";

const {Option} = Select;

@Form.create()
class NetMapSetPermissionDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      current: this.props.current || {},
      rules:this.props.rules,
      loading: false,
      disAccessServices: [],
      oldDisAccessService:[],
      targetKeys: [],// 已经在目标框中的数据
      oldTargetKeys: [],
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const {current, rules} = this.state
    console.log('current and acl', current, rules)

    let _targetId, _targetType;
    if (current['node_type'] === "SERVER") {//服务节点
      _targetId = current['server_id'];
      _targetType = "SERVER"
    } else {//用户节点
      _targetId = current['user_id'];
      _targetType = "USER"
    }
    if (!!_targetId &&  !!_targetType) {
      if(current.acl_status === ServicePermissionType.Control.key){
        this.fetchAllDevices();
        if(!rules){
          dispatch({
            type: DISPATCH.netTopology.whiteList,
            params: {target_type: _targetType, target_id: _targetId},
            callback: (res) => {
              if (res.r == ResponseDataResult.OK) {
                let _targetKeys = [];
                for(let item of res.rules){
                  _targetKeys.push(item.id)
                }
                this.setState({
                  rules: res.rules,
                  targetKeys:_targetKeys,
                  oldTargetKeys: _.concat(res.rules,[]),
                })
              }
            }
          });
        }else {
          let _targetKeys = [];
          for(let item of rules){
            _targetKeys.push(item.id)
          }
          this.setState({
            targetKeys:_targetKeys,
            oldTargetKeys: _.concat(rules,[]),
          })
        }
      }
    }
  }

  fetchAllDevices = () => {
    const {dispatch} = this.props;
    const {current, rules} = this.state;

    let _targetId, _targetType;
    if (current['node_type'] === "SERVER") {//服务节点
      _targetId = current['server_id'];
      _targetType = "SERVER"
    } else {//用户节点
      _targetId = current['user_id'];
      _targetType = "USER"
    }

    dispatch({
      type: DISPATCH.netTopology.ruleDisAccessPeers,
      params: {type:_targetType, id: _targetId},
      callback: (res) => {
        if (res.r == ResponseDataResult.OK) {
          let disAccessServices = []

          _.forEach(res?.datas, (item, index) => {
            item['key'] = item.id,
              disAccessServices.push(item)
            // if (item.access) {
            //   targetKeys.push(item.id)
            // }
          });

          let _targetKeys = [];
          for(let item of rules){
            _targetKeys.push(item.id)
          }

          this.setState({
            targetKeys: _targetKeys,
            oldTargetKeys: _.concat(rules,[]),
            disAccessServices: disAccessServices,
            oldDisAccessService:_.concat(disAccessServices,[])
          })
        }
      }
    });
  };

  leftTableColumns = [
    {
      dataIndex: 'name',
      title: formatMessage({id: 'app.cb.devicemanage.manage.name'}),
      render: val => {
        if (val && val.length > 8) {
          return <span title={val}>{val.slice(0, 8)}...</span>
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
    const {oldDisAccessService, current, oldTargetKeys, targetKeys, disAccessServices} = that.state;

    let _targetId, _targetType;
    if (current['node_type'] === "SERVER") {//服务节点
      _targetId = current['server_id'];
      _targetType = "SERVER"
    } else {//用户节点
      _targetId = current['user_id'];
      _targetType = "USER"
    }

    validateFields((err, values) => {
      console.log('values', values)
      if (!err) {
        if (current.acl_status == values.acl_status) {
          console.log('规则未发生变化', current.acl_status, values.acl_status)
          if (values.acl_status == ServicePermissionType.Control.key) {
            if (_.isEqual(oldTargetKeys, targetKeys)) {
              // 代表没变化
              console.log('权限设置数据无变化')
              this.handleDone()
              return
            }
          }else {
            console.log('规则未发生变化', current.acl_status, values.acl_status)
            this.handleDone()
            return;
          }
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

        if (values.acl_status == ServicePermissionType.Control.key) {
          for (let targetKeyId of targetKeys){
            let isNew = true;
            oldTargetKeys.every((item)=>{
              if(item.id === targetKeyId){
                isNew = false;
              }
              return isNew
            });
            if(isNew){
              oldDisAccessService.every((item)=>{
                if(item.id === targetKeyId){
                  targetKeyAndType.push({id: item.id, peer_type: item.peer_type})
                  return false
                }
                return true
              })
            }
          }
          for (let item of oldTargetKeys){
            const targetItemId = _.indexOf(targetKeys, item.id);
            if (targetItemId < 0) {
              removeKeyAndType.push(item['rule_id'])
            }
          }
        }

        values['target_id'] = _targetId;
        values['target_type'] = _targetType;
        values['acl_status'] = values.acl_status;
        values['access_peers'] = targetKeyAndType;
        values['remove_rule_ids'] = removeKeyAndType;

        this.updateLoadind(true);
        if (dispatch) {
          dispatch({
            type: DISPATCH.netTopology.editRule,
            params: {...values},
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
  };
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
    const getModalContent = () => {

      const view =
        <div>
          <Form hideRequiredMark>
            <Form.Item
              label={formatMessage({id: 'app.cb.servicemanage.devicePermissions'})}
              {...that.formLayout}
            >
              {getFieldDecorator('acl_status', {
                rules: [
                  {required: true, message: formatMessage({id: 'app.cb.globalApp.pleaseSel'})},
                ],
                initialValue: current.acl_status,
              })(<Select placeholder={formatMessage({id: 'app.cb.globalApp.pleaseSel'})}
                         onChange={this.onSelChange}>
                <Option value={ServicePermissionType.Open.key}>{ServicePermissionType.Open.desc}</Option>
                <Option value={ServicePermissionType.Block.key}>{ServicePermissionType.Block.desc}</Option>
                <Option value={ServicePermissionType.Control.key}>{ServicePermissionType.Control.desc}</Option>
              </Select>)}

            </Form.Item>
          </Form>
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

NetMapSetPermissionDialog.propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
NetMapSetPermissionDialog.defaultProps = {
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

const mapStateToProps = ({netTopology, loading}) => {
  return {
    netTopology: netTopology,
    tableLoading: loading.effects[DISPATCH.netTopology.list] || false,
  }
};

export default connect(mapStateToProps)(NetMapSetPermissionDialog)
