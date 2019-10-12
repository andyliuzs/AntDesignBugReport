import React, {PureComponent} from 'react'
import {connect} from 'dva';
import PropTypes from 'prop-types'
// eslint-disable-next-line no-unused-vars
import {
  Form,
  Input,
  Button,
  Modal,
  message,
} from 'antd';
import {formatMessage} from 'umi-plugin-react/locale';
import styles from "../StandardListForm.less";
// eslint-disable-next-line import/extensions
import {DISPATCH} from '../../../constants/DvaAndApiConfig.jsx'
import {namePattern, outgoingNamePattern} from "@/constants/Pattern";

const {TextArea} = Input;

@Form.create()
class UpdateOutgoingNameDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      current: this.props.current || {},
      loading: false,
    };
  }

  componentDidMount() {
  }


  formLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 16},
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
      loading
    })
  }


  /**
   * 处理新建和编辑对话框的确认按钮
   * @param e
   */
  handleSubmit = e => {
    e.preventDefault();
    const that = this;

    const {dispatch, form: {validateFields}, onSuccess} = that.props;
    const {current} = that.state
    validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        this.updateLoadind(true)
        console.log('edit outgoingname params:', fieldsValue)
        if (current.name === fieldsValue.name) {
          that.handleDone();
          console.log('没变化不需要修改')
          return;
        }

        const playLoad = {};
        playLoad.id = current.id
        playLoad.name = fieldsValue.name
        console.log('playload is ', playLoad)
        // 编辑
        dispatch({
          type: DISPATCH.outgoingManage.updateName,
          payload: playLoad,
          callback: (res) => {
            if (res.r === 'ok') {
              onSuccess();
              that.handleDone();
              message.success(`${formatMessage({id: 'app.cb.globalApp.editSuccess'})}！`)
            } else {
              message.error(`${formatMessage({id: 'app.cb.globalApp.editError'})}${',' + res.msg}`)
            }
            this.updateLoadind(false)
          }
        });
      }
    )
    ;
  }


  render() {
    let that = this;
    const {
      form: {getFieldDecorator},
    } = that.props;

    let {current, loading, saveImgUploading, selImg} = that.state;

    const modalFooter = {
      onCancel: this.handleCancel,
      footer: [
        <Button key="cancel" onClick={that.handleCancel}>
          {formatMessage({id: 'app.cb.globalApp.cancel'})}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
          {formatMessage({id: 'app.cb.globalApp.modify'})}
        </Button>,
      ]
    }

    const getModalContent = () => {
      let view = <Form onSubmit={this.handleSubmit}>

        <Form.Item {...this.formLayout} label={formatMessage({id: 'app.cb.outgoingManage.name'})}>
          {getFieldDecorator('name', {
            initialValue: current?.name,
            rules: [
              {
                required: true,
                message: formatMessage({id: 'app.cb.outgoingManage.pleaseInputName'}),
              },
              {
                pattern: outgoingNamePattern,
                message: formatMessage({id: 'app.cb.outgoingManage.pleaseInputLegalName'})
              }
            ],
          })(
            <Input placeholder={formatMessage({id: 'app.cb.outgoingManage.pleaseInputName'})} />
          )}
        </Form.Item>
      </Form>;
      return view
    };
    return (
      <Modal
        title={formatMessage({id: 'app.cb.outgoingManage.modifyName'})}
        width={640}
        bodyStyle={{padding: '28px 0 0'}}
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

UpdateOutgoingNameDialog
  .propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
UpdateOutgoingNameDialog
  .defaultProps = {
  onDismiss: () => {
    console.log('//todo->UpdateOutgoingNameDialog:onDismiss');
  },
  onSuccess: () => {
    console.log('//todo->UpdateOutgoingNameDialog:onSuccess');
  },
  removeDialog: () => {
    console.log('//todo->UpdateOutgoingNameDialog:removeDialog');
  }
};

const
  mapStateToProps = ({outgoingManage}) => {
    return {outgoingManage: outgoingManage}
  };

export default connect(mapStateToProps)

(
  UpdateOutgoingNameDialog
)
