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
  Row,
  Col,
  message, Radio,
} from 'antd';
import _ from 'lodash'
import {findDOMNode} from "react-dom";
import {formatMessage} from 'umi-plugin-react/locale';
import {DeskTopManageType} from "@/constants/constants";
import SearchInput from "@/myComponents/SearchInput";
import {fetchServices, fetchUsers} from "@/utils/dictionaryutils";
import {folderNamePattern} from "../../../constants/Pattern";

const {TextArea} = Input;
const FormItem = Form.Item;

@Form.create()
class DesktopManageAddFolderDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      desktopType: this.props.desktopType,
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
   *确认按钮
   * @param e
   */
  handleSubmit = e => {
    e.preventDefault();
    let that = this;

    const {dispatch, form: {validateFields}, onSuccess} = that.props;
    const {desktopType} = that.state
    validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        this.updateLoadind(true)
        if (_.isEmpty(desktopType)) {
          that.handleDone();
          return;
        }
        fieldsValue['folder_type'] = desktopType
        dispatch({
          type: DISPATCH.desktopManage.addNewFolder,
          payload: fieldsValue,
          callback: (res) => {
            if (res.r === 'ok') {
              onSuccess();
              that.handleDone();
              message.success(`${formatMessage({id: 'app.cb.globalApp.addSuccess'})}！`)
            } else {
              // that.setState({
              //   failure: true,
              //   failureReason: res.msg
              // });
              message.error(`${formatMessage({id: 'app.cb.globalApp.addError'})} ${res?.msg}!`)
            }
            this.updateLoadind(false)
          }
        });

      }
    )
    ;
  }

  // 获取服务列表
  fetchSearchInputServer = (value, callback) => {
    const {dispatch} = this.props
    const that = this;
    if (dispatch) {
      fetchServices(dispatch, value, (mData) => {
        callback(mData)
      })
    }
  }

  render() {
    let that = this;
    const {
      form: {getFieldDecorator},
    } = that.props;

    let {desktopType, loading} = that.state;
    const {failure, failureReason} = that.state;
    console.log('current desktopType is ', desktopType)

    const modalFooter = failure
      ? {footer: null, onCancel: that.handleDone}
      : {
        onCancel: this.handleCancel,
        footer: [
          <Button key="cancel" onClick={that.handleCancel}>
            {formatMessage({id: 'app.cb.globalApp.cancel'})}
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
            {formatMessage({id: 'app.cb.globalApp.add'})}
          </Button>,
        ]
      }


    const getModalContent = () => {
      const {desktopType} = this.state;
      const typeDes = desktopType == DeskTopManageType.computer ? formatMessage({id: 'app.cb.desktopmanage.computerDesktop'}) :
        formatMessage({id: 'app.cb.desktopmanage.phoneDesktop'})
      const topTip =
        formatMessage({id: 'app.cb.desktopmanage.addFolderTip'}, {desktopType: typeDes})
      let view =
        <div>
          <Row plan={24} style={{marginBottom:"12px"}}>
            <Col span={24} offset={6}><span>{topTip}</span></Col>
          </Row>
          <Form onSubmit={this.handleSubmit}>

            <FormItem label={formatMessage({id: 'app.cb.desktopmanage.folder'})} {...that.formLayout}>
              {getFieldDecorator('folder_name', {
                rules: [
                  {required: true, message: `${formatMessage({id:'app.cb.globalApp.pleaseInput'})}${formatMessage({id:'app.cb.desktopmanage.folder'})}${formatMessage({id:'app.cb.devicemanage.manage.name'})}`},
                  {
                    pattern: folderNamePattern,
                    message: formatMessage({id: 'app.cb.desktopmanage.addfolder.placeholder'})
                  }
                ],
              })(<Input placeholder={formatMessage({id: 'app.cb.desktopmanage.addfolder.placeholder'})}/>)}
            </FormItem>
          </Form>
        </div>
      return view


    };
    return (
      <Modal
        title={formatMessage({id: 'app.cb.globalApp.add'})}
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

DesktopManageAddFolderDialog.propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
DesktopManageAddFolderDialog.defaultProps = {
  onDismiss: () => {
    console.log('//todo->DesktopManageAddFolderDialog:onDismiss');
  },
  onSuccess: () => {
    console.log('//todo->DesktopManageAddFolderDialog:onSuccess');
  },
  removeDialog: () => {
    console.log('//todo->DesktopManageAddFolderDialog:removeDialog');
  }
};

const mapStateToProps = ({desktopManage}) => {
  return {desktopManage: desktopManage}
};

export default connect(mapStateToProps)(DesktopManageAddFolderDialog)
