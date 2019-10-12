import React, {PureComponent} from 'react'
import {connect} from 'dva';
import PropTypes from 'prop-types'
import styles from "../StandardListForm.less";
import {DISPATCH} from '../../../constants/DvaAndApiConfig.jsx'
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  InputNumber,
  message, Upload, Icon,
} from 'antd';
import _ from 'lodash'
import {AcceptUploadType, FileMimes, ServiceType} from "../../../constants/constants";
import {formatMessage} from 'umi-plugin-react/locale';

const {TextArea} = Input;

@Form.create()
class SwitchDeviceEditDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      current: this.props.current || {},
      loading: false,
      selImg: false,
      imageFile: null,
      saveImgUploading: false,
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
    const {current, imageFile, selImg} = that.state
    validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        this.updateLoadind(true)
        console.log('edit switchdevice params:', fieldsValue)
        // console.log('current region:',(current ? getRegionId(current) : undefined))
        // console.log('edit region:',fieldsValue.region)
        if (current.name === fieldsValue.name &&
          current.ip4 === fieldsValue.ip4 &&
          selImg == false &&
          current.connect_limit === fieldsValue.connect_limit) {
          that.handleDone();
          console.log('没变化不需要修改')
          return;
        }

        let playLoad = {};
        let values = {};
        values.id = current.id
        values.name = fieldsValue.name
        values.ip4 = _.trim(fieldsValue.ip4)
        values.connect_limit = fieldsValue.connect_limit
        playLoad.values = values
        if (selImg) {
          playLoad.icon = imageFile
        }
        console.log('playload is ', playLoad)
        // 编辑
        dispatch({
          type: DISPATCH.deviceManage.updateSwitchDeviceInfo,
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


  beforeImgUpload = (file) => {
    const isJpgOrPng = file.type === FileMimes.JPG || file.type === FileMimes.PNG || file.type === FileMimes.JPEG

    if (!isJpgOrPng) {
      message.error(formatMessage({id: 'app.cb.globalApp.uploadImgTypeNotify'}));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(formatMessage({id: 'app.cb.globalApp.uploadImgTooLarge'}));
    }
    this.checkAddAttrToImgFile(file?.name)
    this.setState({
      saveImgUploading: true,
    })
    console.log('before upload img', file)
    return false
  }

  // 参考 文章https://blog.csdn.net/qq8241994/article/details/82857730
  handleImgUploadChange = info => {
    console.log('handleImgUploadChange', info)

    this.setState({
      saveImgUploading: false,
      selImg: true,
      imageFile: info.file
    }, () => {
      const reader = new FileReader();
      reader.onload = function (evt) {
        console.log('evt', evt, document.getElementById('image'))
        document.getElementById('image').src = evt.target.result;
        console.log(evt)
      }
      reader.readAsDataURL(info.file);
    })

  };

  onNumberChange = (number) => {
    console.log(number)
  }

  handleValidatorImgFile = (rule, value, callback) => {
    const imageFileValue = document.getElementById('icon').getAttribute('value');
    console.log('imgFile value is ', imageFileValue)
    if (imageFileValue) {
      callback()
      return
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback(formatMessage({id: 'app.cb.globalApp.pleaseUploadImg'}))
  }

  // TODO ant bug 无法 将拖拽的数据赋值给包裹的元素
   checkAddAttrToImgFile = (fileName) => {
    const divValueAttr = document.createAttribute("value"); // 创建属性
    divValueAttr.value = `${fileName}` // 设置属性值
    document.getElementById('icon').setAttributeNode(divValueAttr)
  }

  onLoadImgError=()=>{
    console.log('load img error')
  }

  onLoadedImg=()=>{
    console.log('load img onLoadedImg')
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
    const uploadButton = (
      <div>
        <Icon type={saveImgUploading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">{formatMessage({id: 'app.cb.globalApp.upload'})}</div>
      </div>
    );

    const getModalContent = () => {
      let view = <Form onSubmit={this.handleSubmit}>
        <Form.Item {...this.formLayout} label={formatMessage({id: 'app.cb.globalApp.uploadImg'})}>
          {getFieldDecorator('icon', {
            initialValue: current?.icon,
            rules: [
              {
                validator: this.handleValidatorImgFile
              }
            ],
          })(
            <Row>
              <Col lg={8} md={8} sm={24}>
                <Upload
                  name="avatar"
                  multiple={false}
                  listType="picture-card"
                  accept={AcceptUploadType.ImageAccept}
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.beforeImgUpload}
                  onChange={this.handleImgUploadChange}
                >
                  {(selImg || current.icon) ?
                    <img id='image' src={current?.icon} alt="" style={{width: '100%'}} onError={this.onLoadImgError.bind(this)} onLoad={this.onLoadedImg.bind(this)} /> : uploadButton}
                </Upload>
              </Col>
              <Col lg={16} md={16} sm={24} className={styles.imageUploadDesc}>
                <span>{formatMessage({id: 'app.cb.globalApp.uploadImgDesc'})}</span>
              </Col>
            </Row>
          )}
        </Form.Item>
        <Form.Item {...this.formLayout} label={formatMessage({id: 'app.cb.devicemanage.manage.name'})}>
          {getFieldDecorator('name', {
            initialValue: current?.name,
            rules: [
              {
                required: true,
                message: formatMessage({id: 'app.cb.servicemanage.pleaseEnterServiceName'}),
              },
            ],
          })(
            <Input placeholder={formatMessage({id: 'app.cb.servicemanage.pleaseEnterServiceName'})}/>
          )}
        </Form.Item>
        <Form.Item {...this.formLayout} label={formatMessage({id: 'app.cb.devicemanage.ipAddress'})}>
          {getFieldDecorator('ip4', {
            initialValue: current?.ip4,
            rules: [
              {
                required: true,
                message: formatMessage({id: 'app.cb.devicemanage.pleaseEnterIpAddress'}),
              },
            ],
          })(
            <Input placeholder={formatMessage({id: 'app.cb.devicemanage.pleaseEnterIpAddress'})}/>
          )}
        </Form.Item>
        <Form.Item {...this.formLayout} label={formatMessage({id: 'app.cb.devicemanage.canAddDeviceNumber'})}>
          {getFieldDecorator('connect_limit', {
            initialValue: current?.connect_limit,
            rules: [
              {
                required: true,
                message: formatMessage({id: 'app.cb.devicemanage.pleaseEnterLimitNnumber'}),
              },
            ],
          })(
            <InputNumber min={1} onChange={this.onNumberChange}/>
          )}
        </Form.Item>
      </Form>;
      return view
    };
    return (
      <Modal
        title={formatMessage({id: 'app.cb.servicemanage.editService'})}
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

SwitchDeviceEditDialog
  .propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
SwitchDeviceEditDialog
  .defaultProps = {
  onDismiss: () => {
    console.log('//todo->SwitchDeviceEditDialog:onDismiss');
  },
  onSuccess: () => {
    console.log('//todo->SwitchDeviceEditDialog:onSuccess');
  },
  removeDialog: () => {
    console.log('//todo->SwitchDeviceEditDialog:removeDialog');
  }
};

const
  mapStateToProps = ({deviceManage}) => {
    return {deviceManage: deviceManage}
  };

export default connect(mapStateToProps)

(
  SwitchDeviceEditDialog
)
