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
  message, Radio, Upload, Icon,
} from 'antd';
import _ from 'lodash'
import {findDOMNode} from "react-dom";
import {AcceptUploadType, FileMimes, ServiceType, UserType} from "../../../constants/constants";
import {formatMessage} from 'umi-plugin-react/locale';
import {getFileMd5} from "@/utils/utils";
import {notePattern, serviceNamePattern, urlPattern} from "../../../constants/Pattern";

const {TextArea} = Input;
const FormItem = Form.Item;
const rolesOptions = [{label: UserType[0].desc, value: UserType[0].key}, {
  label: UserType[1].desc,
  value: UserType[1].key
}]

@Form.create()
class ServiceEditDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      current: this.props.current || {},
      loading: false,
      selImg: false,
      imageFile: null,
      apkFile: null,
      selApkFileName: '',
      saveImgUploading: false,
      saveApkUploading: false,
    };
  }

  componentDidMount() {
    const {current} = this.state
    // if (current && current.uri) {
    //   this.setState({selImg: true})
    // }
    // if (current && current.apkUrl) {
    //   this.setState({selApkFileName:  current.apkUrl})
    // }
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
    const {current, imageFile, apkFile} = that.state
    validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        this.updateLoadind(true)
        console.log('current params,', current)
        console.log('edit user params:', fieldsValue)
        // console.log('current region:',(current ? getRegionId(current) : undefined))
        // console.log('edit region:',fieldsValue.region)
        if (current.name === fieldsValue.name &&
          (current.uri === fieldsValue.uri || !_.has(fieldsValue, 'uri')) &&
          imageFile == null &&
          ((current.type == ServiceType.PhoneAppServiceType.key && apkFile == null) || current.type != ServiceType.PhoneAppServiceType.key) &&
          current.des === fieldsValue.note) {
          that.handleDone();
          console.log('没变化不需要修改')
          return;
        }


        if (apkFile !== null) {
          getFileMd5(apkFile, (md5) => {
            this.editFields(md5, fieldsValue, onSuccess)
          })
        } else {
          this.editFields('', fieldsValue, onSuccess)
        }

      }
    )
    ;
  }

  editFields = (md5, fieldsValue, onSuccess) => {
    const {dispatch} = this.props
    const that = this;
    const {current, imageFile, apkFile} = that.state
    let playLoad = {};
    let values = {};
    values.id = current.id
    values.name = fieldsValue.name
    values.uri = _.trim(fieldsValue.uri)
    values.des = fieldsValue.note
    values.apk_md5 = md5
    playLoad.values = values
    if (imageFile) {
      playLoad.icon = imageFile
    }
    if (apkFile) {
      playLoad.apk = apkFile
    }
    console.log('playload is ', playLoad)
    //编辑
    dispatch({
      type: DISPATCH.serviceManage.updateService,
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


  beforeImgUpload = (file) => {
    const isJpgOrPng = file.type === FileMimes.JPG || file.type === FileMimes.PNG || file.type === FileMimes.JPEG;

    if (!isJpgOrPng) {
      message.error(formatMessage({id: 'app.cb.globalApp.uploadImgTypeNotify'}));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(formatMessage({id: 'app.cb.globalApp.uploadImgTooLarge'}));
    }

    this.setState({
      saveImgUploading: true,
    })
    return false
  }

  // 参考 文章https://blog.csdn.net/qq8241994/article/details/82857730
  handleImgUploadChange = info => {
    console.log('info', info)

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

  beforeApkUpload = (file) => {
    const isJpgOrPng = file.type === FileMimes.APK || file.type === FileMimes.IPA;

    if (!isJpgOrPng) {
      message.error(formatMessage({id: 'app.cb.globalApp.uploadAppFileNotify'}));
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error(formatMessage({id: 'app.cb.globalApp.uploadImgTooLarge'}));
    // }

    this.setState({
      saveApkUploading: true,
    })
    return false
  }

  handleApkUploadChange = info => {
    console.log('info', info)
    this.setState({
      selApkFileName: info?.file?.name,
      saveApkUploading: false,
      apkFile: info.file,
    }, () => {
      document.getElementById('selApkFileName').innerText = info?.file?.name
    })
  };
  validatorUri = (rule, value, callback) => {

    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    let cpValue = _.replace(value, "http://", ' ')
    cpValue = _.replace(value, 'https://', ' ')
   cpValue =  cpValue.trim()
    console.log('cpValue is ',cpValue,(_.startsWith(cpValue,'[') && _.endsWith(cpValue,']') && cpValue.length>2))
    if (urlPattern.test(value) || (_.startsWith(cpValue,'[') && _.endsWith(cpValue,']') && cpValue.length>2) || _.isEmpty(value)) {
      callback()
      return;
    }
    callback(formatMessage({id: 'app.cb.servicemanage.pleaseEnterLegalServiceAddress'}))
  }

  render() {
    let that = this;
    const {
      form: {getFieldDecorator},
    } = that.props;

    let {current, loading, saveApkUploading, saveImgUploading, selImg, selApkFileName} = that.state;
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
    const uploadButton = (
      <div>
        <Icon type={saveImgUploading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">{formatMessage({id: 'app.cb.globalApp.upload'})}</div>
      </div>
    );

    const getModalContent = () => {
      let _can_edit = _.keys(current).length > 0 ? false : true
      let view = <Form onSubmit={this.handleSubmit}>
        <Form.Item {...this.formLayout} label={formatMessage({id: 'app.cb.globalApp.uploadImg'})}>
          {getFieldDecorator('icon', {
            initialValue: current?.icon,
            rules: [
              {
                required: true,
                message: formatMessage({id: 'app.cb.globalApp.pleaseUploadImg'}),
              },

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
                    <img id='image' src={current?.icon} alt="" style={{width: '100%'}}/> : uploadButton}
                </Upload>
              </Col>
              <Col lg={16} md={16} sm={24} className={styles.imageUploadDesc}>
                <span>{formatMessage({id: 'app.cb.globalApp.uploadImgDesc'})}</span>
              </Col>
            </Row>
          )}
        </Form.Item>
        <Form.Item {...this.formLayout} label={formatMessage({id: 'app.cb.servicemanage.serviceName'})}>
          {getFieldDecorator('name', {
            initialValue: current?.name,
            rules: [
              {
                required: true,
                message: formatMessage({id: 'app.cb.servicemanage.pleaseEnterServiceName'}),
              },
              {
                pattern: serviceNamePattern,
                message: formatMessage({id: 'app.cb.servicemanage.pleaseInputLegalServiceName'})
              }
            ],
          })(
            <Input placeholder={formatMessage({id: 'app.cb.servicemanage.pleaseEnterServiceName'})}/>
          )}
        </Form.Item>
        {(current.type == ServiceType.AtomicServiceType.key || current.type == ServiceType.WebServiceType.key) &&
        <Form.Item {...this.formLayout} label={formatMessage({id: 'app.cb.servicemanage.serviceAddress'})}>
          {getFieldDecorator('uri', {
            initialValue: current?.uri,
            rules: [
              {
                required: true,
                message: formatMessage({id: 'app.cb.servicemanage.pleaseEnterServiceAddress'}),
              }, {
                validator: this.validatorUri,
              }
            ],
          })(
            <Input placeholder={formatMessage({id: 'app.cb.servicemanage.pleaseEnterServiceAddress'})}/>
          )}
        </Form.Item>
        }
        {current.type == ServiceType.PhoneAppServiceType.key &&
        <Form.Item {...this.formLayout} label={formatMessage({id: 'app.cb.servicemanage.serviceAddress'})}>
          {getFieldDecorator('apkFile', {
            initialValue: current?.other?.original_file_name,
            rules: [
              {
                required: true,
                message: formatMessage({id: 'app.cb.servicemanage.pleaseEnterServiceAddress'}),
              },
            ],
          })(
            <Row>
              <Col>
                <Upload beforeUpload={this.beforeApkUpload}
                        onChange={this.handleApkUploadChange}
                        multiple={false}
                        accept={AcceptUploadType.AppType}
                        showUploadList={false}>
                  <Button>
                    <Icon type="upload"/> {formatMessage({id: 'app.cb.servicemanage.uploadApkFile'})}
                  </Button>
                </Upload>
              </Col>
              <Col>
                <span id={'selApkFileName'}>{selApkFileName || current?.other?.original_file_name}</span>
              </Col>
            </Row>
          )}
        </Form.Item>}
        <Form.Item  {...this.formLayout} label={formatMessage({id: 'app.cb.servicemanage.serviceIntroduction'})}>
          {getFieldDecorator('note', {
            initialValue: current.des,
            rules: [
              {
                pattern: notePattern,
                message: formatMessage({id: 'app.globalApp.pleaseInputLegalNote'})
              }
            ]
          })(<TextArea placeholder={formatMessage({id: 'app.cb.servicemanage.pleaseEnterIntroduction'})} rows={4}/>)}
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

ServiceEditDialog
  .propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
ServiceEditDialog
  .defaultProps = {
  onDismiss: () => {
    console.log('//todo->ServiceEditDialog:onDismiss');
  },
  onSuccess: () => {
    console.log('//todo->ServiceEditDialog:onSuccess');
  },
  removeDialog: () => {
    console.log('//todo->ServiceEditDialog:removeDialog');
  }
};

const
  mapStateToProps = ({serviceManage}) => {
    return {serviceManage: serviceManage}
  };

export default connect(mapStateToProps)

(
  ServiceEditDialog
)
