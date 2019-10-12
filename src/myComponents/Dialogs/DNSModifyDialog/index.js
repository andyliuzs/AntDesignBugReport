import ReactDOM from "react-dom";
import React from 'react'
import {Modal, Button,Form,Input,message} from 'antd';
import {formatMessage} from 'umi-plugin-react/locale';
import {DISPATCH} from "../../../constants/DvaAndApiConfig";
import { ipv6OrIpv4Pattern} from "../../../constants/Pattern";

@Form.create()
class DNSModifyDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:true,
      loading:false,
      current:this.props.current || {},
    };
  }

  handleCancel = ()=> {
    this.setState({
      visible: false,
    });
  };

  onAfterClose=()=>{
    console.log('onAfterClose:::::::::::::::');
    this.props.removeDialog();
  };

  updateLoadind = loading =>{
    this.setState({
      loading,
    });
  }

  handlerModify=()=>{
    let that = this;

    const {dispatch, form: {validateFields}, success} = that.props;
    const {current} = that.state
    const oldValue = current ? current.value : '';
    const postData = {};
    validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        if(fieldsValue.value === oldValue){
          this.handleCancel();
          return;
        }
        this.updateLoadind(true);
        postData[current.key] = fieldsValue.value;
        dispatch({
          type: DISPATCH.settingManage.modifyDNS,
          payload: postData,
          callback: (res) => {
            if (res.r === 'ok') {
              success();
              this.handleCancel();
              message.success(formatMessage({id: 'app.globalApp.modifySuccess'}));
            } else {
              message.error(formatMessage({id: 'app.globalApp.modifyFailed'}));
            }
            this.updateLoadind(false)
          }
        });
      }
    )
    ;
  }

  render() {
    const {loading,current} = this.state;
    const maskClose = !this.state.loading;

    const modalFooter = {footer:  [
      <Button key="back" onClick={this.handleCancel}>
        {formatMessage({id: 'app.cb.globalApp.cancel'})}
      </Button>,
      <Button key="submit" type="primary"  loading={loading} onClick={this.handlerModify}>
        {formatMessage({id: 'app.cb.globalApp.modify'})}
      </Button>,
      ]};
    const { getFieldDecorator } = this.props.form;
    const moddalContent = <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} onSubmit={this.handlerModify}>
      <Form.Item label={formatMessage({id: 'app.cb.settingManage.ipAddress'})} style={{marginBottom:'0'}}>
        {getFieldDecorator('value', {
          initialValue: current.value,
          rules: [
            {required: true, message: formatMessage({id: 'app.cb.settingManage.pleaseEnterIpAddress'})},
            {
              pattern: ipv6OrIpv4Pattern,
              message: formatMessage({id: 'app.cb.outgoingManage.pleaseInputLegalIp'})
            }
           ],
        })(<Input />)}
      </Form.Item>
    </Form>;
    return (
      <Modal
        title={formatMessage({id: 'app.cb.globalApp.modify'})}
        centered
        width={420}
        bodyStyle={{ padding: '64 24'},{fontSize:'14'},{color:'rgba(0, 0, 0, 0.847059)'}}
        visible={this.state.visible}
        onCancel={this.handleCancel}
        afterClose={this.onAfterClose}
        maskClosable={maskClose}
        keyboard={maskClose}
        closable={maskClose}
        destroyOnClose
        {...modalFooter}
      >
        {moddalContent}
      </Modal>
    );
  }
}

const showModifyDialog = {
  show(dnsData,dispatch,onSuccess) {
    // console.log('versionData::::::::::',versionData);
    const div = document.createElement('div');
    document.body.appendChild(div);

    const removeDialog = function () {
      console.log('removeDialog::::::::::::');
      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
    };

    ReactDOM.render(<DNSModifyDialog
      current={dnsData}
      dispatch={dispatch}
      success={onSuccess}
      removeDialog={removeDialog}
    />, div);
  },
};
export default showModifyDialog
