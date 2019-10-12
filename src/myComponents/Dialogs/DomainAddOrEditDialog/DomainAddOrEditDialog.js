import React, {PureComponent} from 'react'
import {connect} from 'dva';
import PropTypes from 'prop-types'
import styles from "../StandardListForm.less";
import Result from '@/myComponents/MyResult';
import {DISPATCH} from '../../../constants/DvaAndApiConfig.jsx'
import {adminNamePattern} from "../../../constants/Pattern.jsx";
import {
  Form,
  Input,
  Button,
  Modal,
  message, Radio,
} from 'antd';
import _ from 'lodash'
import {findDOMNode} from "react-dom";
import {formatMessage} from 'umi-plugin-react/locale';
import Row from "antd/lib/grid/row";
import {atomicDomainPattern} from "../../../constants/Pattern";

const {TextArea} = Input;
const FormItem = Form.Item;

@Form.create()
class DomainAddOrEditDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      failure: false,// 是否操作失败了
      failureReason: '',// 失败原因
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
          if (current.domain === fieldsValue.domain) {
            that.handleDone();
            return;
          }

          fieldsValue.id = id;

          //编辑
          dispatch({
            type: DISPATCH.domainManage.domainUpdate,
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
                message.error(`${formatMessage({id: 'app.cb.globalApp.editError'})} ${res?.msg}!`)
              }
              this.updateLoadind(false)
            }
          });
        } else {
          console.log('add user params:', fieldsValue)
          // 添加
          dispatch({
              type: DISPATCH.domainManage.domainAdd,
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
    let that = this;
    const {
      form: {getFieldDecorator},
    } = that.props;

    let {current, loading} = that.state;
    const {failure, failureReason} = that.state;
    console.log('current user is ',current)
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
      let view = <Form onSubmit={this.handleSubmit}>

        <FormItem label={formatMessage({id: 'app.cb.globalApp.domain'})} {...that.formLayout}>
          {getFieldDecorator('name', {
            rules: [
              {required: true, message: formatMessage({id: 'app.cb.domainmanage.domainlist.tip.plaseInputDomain'})},
              {
                pattern: atomicDomainPattern,
                message: formatMessage({id: 'app.cb.domainmanage.domainlist.tip.IllegalDomain'})
              }
            ],
            initialValue: current.name,
          })(<Input placeholder={formatMessage({id: 'app.cb.domainmanage.domainlist.tip.tagComposition'})}/>)}
        </FormItem>
        <div style={{height:"60px"}}/>{/*撑起*/}
      </Form>;
      return view


    };
    return (
      <Modal
        title={(current && current.id) ? formatMessage({id: 'app.cb.domainmanage.domainlist.editdomain'}) : formatMessage({id: 'app.cb.domainmanage.domainlist.adddomain'})}
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

DomainAddOrEditDialog.propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
DomainAddOrEditDialog.defaultProps = {
  onDismiss: () => {
    console.log('//todo->DomainAddOrEditDialog:onDismiss');
  },
  onSuccess: () => {
    console.log('//todo->DomainAddOrEditDialog:onSuccess');
  },
  removeDialog: () => {
    console.log('//todo->DomainAddOrEditDialog:removeDialog');
  }
};

const mapStateToProps = ({domainManage}) => {
  return {domainManage: domainManage}
};

export default connect(mapStateToProps)(DomainAddOrEditDialog)
