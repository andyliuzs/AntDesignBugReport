import React, {PureComponent} from 'react'
import {connect} from 'dva';
import PropTypes from 'prop-types'
import styles from "../StandardListForm.less";
import Result from '@/myComponents/MyResult';
import {DISPATCH} from '../../../constants/DvaAndApiConfig.jsx'
import {adminNamePattern} from "../../../constants/Pattern.jsx";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  message, Radio,
} from 'antd';
import _ from 'lodash'
import {findDOMNode} from "react-dom";
import {UserType} from "../../../constants/constants";
import {formatMessage} from 'umi-plugin-react/locale';
import {namePattern, notePattern} from "../../../constants/Pattern";

const {TextArea} = Input;
const FormItem = Form.Item;
const rolesOptions = [{label: UserType[0].desc, value: UserType[0].key}, {
  label: UserType[1].desc,
  value: UserType[1].key
}]

@Form.create()
class UserAddOrEditDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      failure: false,//是否操作失败了
      failureReason: '',//失败原因
      current: this.props.current || {},
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
    const {current} = that.state
    const id = current ? current.id : '';
    validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        this.updateLoadind(true)
        if (id) {
          console.log('edit user params:', fieldsValue)
          //如果不变，直接关掉dialog
          // console.log('current region:',(current ? getRegionId(current) : undefined))
          // console.log('edit region:',fieldsValue.region)
          if (current.username === fieldsValue.username &&
            current.realname === fieldsValue.realname &&
            current.telephone === fieldsValue.telephone &&
            current.is_admin === fieldsValue.is_admin &&
            current.note === fieldsValue.note) {
            that.handleDone();
            return;
          }

          fieldsValue.id = id;

          //编辑
          dispatch({
            type: DISPATCH.userManage.update,
            payload: fieldsValue,
            callback: (res) => {
              if (res.r === 'ok') {
                onSuccess();
                that.handleDone();
                message.success(`${formatMessage({id: 'app.cb.globalApp.editSuccess'})}！`)
              } else {
                // that.setState({
                //   failure: true,
                //   failureReason: res.msg
                // });
                message.error(formatMessage({id: 'app.cb.globalApp.editError'}))
              }
              this.updateLoadind(false)
            }
          });
        } else {
          console.log('add user params:', fieldsValue)
          // 添加
          dispatch({
              type: DISPATCH.userManage.add,
              payload: fieldsValue,
              callback: (res) => {
                if (res.r === 'ok') {
                  onSuccess();
                  that.handleDone();
                  message.success(`${formatMessage({id: 'app.cb.globalApp.addSuccess'})}!`)
                } else {
                  // this.setState({
                  //   failure: true,
                  //   failureReason: res.msg
                  // });
                  message.error(formatMessage({id: 'app.cb.globalApp.addError'}))
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
    let that = this;
    const {
      form: {getFieldDecorator},
    } = that.props;

    let {current, loading} = that.state;
    const {failure, failureReason} = that.state;
    const okBtnText = (current && current.id) ? formatMessage({id: 'app.cb.globalApp.ok'}) : formatMessage({id: 'app.cb.globalApp.add'})
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


    const getModalContent = () => {
      if (failure) {
        let _action_fail = Object.keys(current).length > 0 ? formatMessage({id: 'app.cb.globalApp.editError'}) : formatMessage({id: 'app.cb.globalApp.addError'});
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
      let _can_edit = _.keys(current).length > 0 ? false : true
      let view = <Form onSubmit={this.handleSubmit}>
        <FormItem label={formatMessage({id: 'app.cb.globalApp.userName'})} {...that.formLayout}>
          {getFieldDecorator('username', {
            rules: [
              {required: true, message: formatMessage({id: 'app.cb.usermanage.tip.pleaseInputUsername'})},
              {
                pattern: adminNamePattern,
                message: formatMessage({id: 'app.cb.usermanage.tip.IllegalUsername'})
              }
            ],
            initialValue: current.username,
          })(<Input placeholder={formatMessage({id: 'app.cb.usermanage.tip.userNameComposition'})} disabled={!_can_edit}/>)}
        </FormItem>
        <FormItem label={formatMessage({id: 'app.cb.globalApp.name'})} {...that.formLayout}>
          {getFieldDecorator('realname', {
            rules: [
              {required: false, message: ''},
              {
                pattern: namePattern,
                message: formatMessage({id: 'app.cb.usermanage.tip.IllegalName'})
              }
            ],
            initialValue: current.realname,
          })(<Input placeholder={formatMessage({id: 'app.cb.usermanage.tip.userNameComposition'})}/>)}
        </FormItem>
        <FormItem label={formatMessage({id: 'app.cb.globalApp.phone'})} {...that.formLayout}>
          {getFieldDecorator('telephone', {
            initialValue: current.telephone,
            rules: [
              {max: 15, message: formatMessage({id: 'app.cb.usermanage.tip.phoneInputMax'})}
            ]
          })(<Input placeholder={formatMessage({id: 'app.cb.globalApp.pleaseInput'})}/>)}
        </FormItem>
        <FormItem label={formatMessage({id: 'app.cb.globalApp.role'})} {...that.formLayout}>
          {getFieldDecorator('is_admin', {
            initialValue: current && current.id ? current.is_admin : rolesOptions[0].value
          })(<Radio.Group options={rolesOptions}/>)}
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
          })(<TextArea placeholder={formatMessage({id: 'app.cb.usermanage.tip.pleaseInputUserOther'})} rows={4}/>)}
        </FormItem>
      </Form>;
      return view


    };
    return (
      <Modal
        title={(current && current.id) ? formatMessage({id: 'app.cb.usermanage.editUser'}) : formatMessage({id: 'app.cb.usermanage.addUser'})}
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

UserAddOrEditDialog.propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
UserAddOrEditDialog.defaultProps = {
  onDismiss: () => {
    console.log('//todo->UserAddOrEditDialog:onDismiss');
  },
  onSuccess: () => {
    console.log('//todo->UserAddOrEditDialog:onSuccess');
  },
  removeDialog: () => {
    console.log('//todo->UserAddOrEditDialog:removeDialog');
  }
};

const mapStateToProps = ({userManage}) => {
  return {userManage: userManage}
};

export default connect(mapStateToProps)(UserAddOrEditDialog)
