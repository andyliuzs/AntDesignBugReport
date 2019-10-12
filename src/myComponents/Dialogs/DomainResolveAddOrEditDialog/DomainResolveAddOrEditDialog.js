import React, {PureComponent} from 'react'
import {connect} from 'dva';
import PropTypes from 'prop-types'
import {
  Row,
  Col,
  Form,
  Icon,
  Input,
  Button,
  Modal,
  Tooltip,
  Select,
  message, Radio,
} from 'antd';
import _ from 'lodash'
import {findDOMNode} from "react-dom";
import {formatMessage} from 'umi-plugin-react/locale';
import styles from "../StandardListForm.less";
import Result from '@/myComponents/MyResult';
import {DISPATCH} from '../../../constants/DvaAndApiConfig.jsx'
import {adminNamePattern} from "../../../constants/Pattern.jsx";
import {DomainRecordType} from "../../../constants/constants";
import {folderNamePattern, notePattern} from "../../../constants/Pattern";

const {Option} = Select;
const {TextArea} = Input;
const FormItem = Form.Item;

@Form.create()
class DomainResolveAddOrEditDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      failure: false,// 是否操作失败了
      failureReason: '',// 失败原因
      current: this.props.current || {},
      currentDomain: this.props.currentDomain || '',
      loading: false,
    };
  }

  componentDidMount() {
  }


  formLayout = {
    labelCol: {span: 7},
    wrapperCol: {span: 12},
  };


  dismiss = () => {
    console.log('dismiss')
    this.setState({
      failure: false,
      failureReason: '',
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
    // todo
    this.dismiss()
  };

  updateLoadind = (loading) => {
    this.setState({
      loading
    })
  }


  /**
   * 处理新建和编辑对话框的确认按钮
   * @param e
   */
  handleSubmit = e => {
    e.preventDefault();
    const {dispatch, form: {validateFields}, onSuccess, currentDomain} = this.props;
    const {current} = this.state
    validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        this.updateLoadind(true)
        if (current && current?.name) {
          console.log('edit domain resolve params:', fieldsValue)
          // 如果不变，直接关掉dialog
          // console.log('current region:',(current ? getRegionId(current) : undefined))
          // console.log('edit region:',fieldsValue.region)
          if (current.type === fieldsValue.type &&
            current.subname === fieldsValue.subname &&
            current.ip === fieldsValue.ip &&
            current.note === fieldsValue.note) {
            this.handleDone();
            return;
          }
          fieldsValue['name'] = current?.name

          // 编辑
          dispatch({
            type: DISPATCH.domainManage.resolveUpdate,
            payload: fieldsValue,
            callback: (res) => {
              if (res.r === 'ok') {
                onSuccess();
                this.handleDone();
                message.success(`${formatMessage({id: 'app.cb.globalApp.editSuccess'})}！`)
              } else {
                // this.setState({
                //   failure: true,
                //   failureReason: res.msg
                // });
                message.error(`${formatMessage({id: 'app.cb.globalApp.editError'})} ${res?.msg}!`)
              }
              this.updateLoadind(false)
            }
          });
        } else {
          fieldsValue['name'] = currentDomain
          console.log('add domain resolve params:', fieldsValue)
          // 添加
          dispatch({
              type: DISPATCH.domainManage.resolveAdd,
              payload: fieldsValue,
              callback: (res) => {
                if (res.r === 'ok') {
                  onSuccess();
                  this.handleDone();
                  message.success(`${formatMessage({id: 'app.cb.globalApp.addSuccess'})}!`)
                } else {
                  // this.setState({
                  //   failure: true,
                  //   failureReason: res.msg
                  // });
                  message.error(`${formatMessage({id: 'app.cb.globalApp.addError'})} ${res?.msg}!`)
                }
                this.updateLoadind(false)
              }
            }
          );
        }
      }
    )
    ;
  }
  ;

  render() {
    const that = this;
    const {
      form: {getFieldDecorator},
    } = that.props;

    const {current, loading, currentDomain} = that.state;
    const {failure, failureReason} = that.state;
    const okBtnText = (current && current.name) ? formatMessage({id: 'app.cb.globalApp.edit'}) : formatMessage({id: 'app.cb.globalApp.resolve'})
    const modalFooter = failure
      ? {footer: null, onCancel: that.handleDone}
      : {
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

    let _is_edit_model = _.keys(current).length > 0
    const getModalContent = () => {
      if (failure) {
        const _action_fail = Object.keys(current).length > 0 ? formatMessage({id: 'app.cb.globalApp.editError'}) : formatMessage({id: 'app.cb.globalApp.addError'});
        return (
          <Result
            type="error"
            title={_action_fail}
            description={failureReason}
            actions={
              <Button type="primary" onClick={that.handleDone}>
                {formatMessage({id: 'app.cb.globalApp.gotIt'})}
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      const view = <Form onSubmit={this.handleSubmit}>
        <FormItem
          label={
            <span>
              {formatMessage({id: 'app.cb.domainmanage.resolvelist.recordtype'})}&nbsp;
              <Tooltip title={formatMessage({id: 'app.cb.domainmanage.resolvelist.recordtype.tooltip'})}>
                <Icon type="info-circle"/>
              </Tooltip>
            </span>}
          {...that.formLayout}
        >
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: formatMessage({id: "app.cb.domainmanage.resolvelist.please_select_recordtype"})
              },
            ],
            initialValue: current.type || DomainRecordType[0].key,
          })(<Select disabled={_is_edit_model}>
            {DomainRecordType.map(item => {
              return <Option key={item.key} value={item.key}>{item.desc}</Option>
            })}
          </Select>)}
        </FormItem>
        <FormItem label={formatMessage({id: 'app.cb.domainmanage.resolvelist.hostrecord'})} {...that.formLayout}>
          <Row gutter={8}>
            <Col span={14}>
              {getFieldDecorator('subname', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({id: 'app.cb.domainmanage.resolvelist.pleaseinputHostrecord'})
                  },

                ],
                initialValue: current.subname,
              })(<Input placeholder={formatMessage({id: 'app.cb.domainmanage.resolvelist.pleaseinputHostrecord'})} disabled={_is_edit_model}/>)}
            </Col>
            <Col span={10}>
              <span>{currentDomain || 'anet6.cc'}</span>
            </Col>
          </Row>
        </FormItem>
        <FormItem
          label={formatMessage({id: 'app.cb.domainmanage.resolvelist.recordvalue'})} {...that.formLayout}>
          {getFieldDecorator('ip', {
            initialValue: current.ip,
            rules: [
              {required: true, message: formatMessage({id: 'app.cb.domainmanage.resolvelist.pleaseInputRecordvalue'})}
            ]
          })(<Input placeholder={formatMessage({id: 'app.cb.domainmanage.resolvelist.pleaseInputRecordvalue'})}/>)}
        </FormItem>
        <FormItem label={formatMessage({id: 'app.cb.globalApp.note'})} {...that.formLayout}>
          {getFieldDecorator('note', {
            initialValue: current.note,
            rules:[
              {
                pattern: notePattern,
                message: formatMessage({id: 'app.globalApp.pleaseInputLegalNote'})
              }
            ]
          })(<TextArea placeholder={formatMessage({id: 'app.cb.domainmanage.resolvelist.note_please_holder'})}
                       rows={4}/>)}
        </FormItem>
      </Form>;
      return view


    };
    return (
      <Modal
        title={(current && current.id) ? formatMessage({id: 'app.cb.globalApp.edit'}) : formatMessage({id: 'app.cb.domainmanage.resolvelist.addresolve'})}
        width={640}
        bodyStyle={failure ? {padding: '72px 0'} : {padding: '28px 0 0'}}
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

DomainResolveAddOrEditDialog.propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
DomainResolveAddOrEditDialog.defaultProps = {
  onDismiss: () => {
    console.log('//todo->DomainResolveAddOrEditDialog:onDismiss');
  },
  onSuccess: () => {
    console.log('//todo->DomainResolveAddOrEditDialog:onSuccess');
  },
  removeDialog: () => {
    console.log('//todo->DomainResolveAddOrEditDialog:removeDialog');
  }
};

const mapStateToProps = ({domainManage}) => {
  return {domainManage}
};

export default connect(mapStateToProps)(DomainResolveAddOrEditDialog)
