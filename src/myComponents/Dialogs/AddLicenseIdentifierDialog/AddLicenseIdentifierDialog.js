import React, {PureComponent} from 'react'
import {connect} from 'dva';
import PropTypes from 'prop-types'
import {Modal, Upload, Icon, message, Progress, Button, Form, Col, Descriptions, Row} from "antd";
import styles from "../StandardListForm.less";
import axios from 'axios';
import MyResult from '@/myComponents/MyResult';

const Dragger = Upload.Dragger;
import {formatMessage} from 'umi-plugin-react/locale';
import {API_URL, DISPATCH} from "../../../constants/DvaAndApiConfig";
import moment from "moment";

const ADD_LICENSE_IDENTIFIER_STEP = {
  STEP_CHECK: 'check', // 许可证check页
  STEP_CHECK_PROGRESS: 'check_progress', // 许可证正在上传
  STEP_CHECK_FAILED: 'check_failed', // 许可证上传失败
  STEP_CHECK_SUCCESS: 'check_success',// 许可证上传成功并返回结果
  STEP_ADD_SUCCESS: 'add_success', // 添加许可正成功
  STEP_ADD_FAILED: 'add_failed'// 许可证添加失败

}

@Form.create()
class AddLicenseIdentifierDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      upload_status: {// 上传状态
        status: ADD_LICENSE_IDENTIFIER_STEP.STEP_CHECK,
        progress: 0,
        reason: '',
        result:{},
      },
      files: [],
      loading: false,
      nowTime:this.props.nowTime || new Date().getTime
    };
  }


  dismiss = () => {
    this.setState({
      visible: false,
    });
  };

  onAfterClose = () => {
    this.props.onDismiss();
    this.props.removeDialog();
  };

  handleOk = () => {
    this.dismiss()
  };

  handleCancel = () => {
    this.dismiss()
  };

  handleUpload = () => {
    if (this.state.files.length <= 0) {
      message.destroy();
      message.warn(formatMessage({id:'app.cb.licenseManage.pleaseSelFile'}));
      return
    }
    let that = this;

    const formData = new FormData();

    // TODO 暂时只支持单个文件上传
    formData.append('files', this.state.files[0]['originFileObj']);
    this.updateLoadind(true);
    axios
      .post(
        API_URL.licenseManage.checkLicense,
        formData,
        {
          onUploadProgress: ({total, loaded}) => {
            let _upload_status = JSON.parse(JSON.stringify(that.state.upload_status));
            _upload_status.progress = parseInt(Math.round(loaded / total * 100).toFixed(2), 10);
            // 上传完成,显示正在解析中
            if (_upload_status.progress === 100) {
              _upload_status.status = ADD_LICENSE_IDENTIFIER_STEP.STEP_CHECK_PROGRESS
            }
            that.setState({
              upload_status: _upload_status
            });
          },
        })
      .then(({data: res}) => {
        if (res.r === 'ok') {
          console.log('upload result', res);
          that.setState({
            upload_status: {// 上传状态
              status: ADD_LICENSE_IDENTIFIER_STEP.STEP_CHECK_SUCCESS,
              progress: 0,
              reason: '',
              result: res.data
            },
          });
        } else {
          message.error(formatMessage({id:'app.cb.licenseManage.checkLicenseError'})+','+res?.msg)
          that.setState({
            upload_status: {// 上传状态
              status: ADD_LICENSE_IDENTIFIER_STEP.STEP_CHECK_FAILED,
              progress: 0,
              reason: res.msg
            },
          })
        }
        this.updateLoadind(false)
      })
      .catch((err) => {
        this.updateLoadind(false);
        message.error(formatMessage({id:'app.globalApp.netBusy'}))
        that.setState({
          upload_status: {// 上传状态
            status: ADD_LICENSE_IDENTIFIER_STEP.STEP_CHECK_FAILED,
            progress: 0,
            reason: formatMessage({id:'app.globalApp.netBusy'})
          },
        })
      });
  };
  handleAddLicense = () => {
    const {dispatch} = this.props;
    const {upload_status} = this.state;
    this.updateLoadind(true);
    const params = {licence:upload_status.result.licence};
    setTimeout(() => {
      dispatch({
        type: DISPATCH.licenseManage.add,
        payload: params,
        callback: (res) => {
          if (res.r === "ok") {
            this.setState({
              upload_status: {// 上传状态
                status: ADD_LICENSE_IDENTIFIER_STEP.STEP_ADD_SUCCESS,
                progress: 0,
              },
            });
            this.props.onSuccess();
          } else {
            message.error(formatMessage({id:'app.cb.licenseManage.addFailed'})+',' + res.msg);
          }
          this.updateLoadind(false)
        }
      });
    }, 1000)

  };

  updateLoadind = (loading) => {
    this.setState({
      loading: loading
    })
  };
  render() {
    let that = this;
    let {loading,upload_status} = this.state;
    let dragger_props = {
      name: 'file',
      multiple: false,//多选文件
      onChange(info) {
        console.log('info', 'info');

        that.setState({
          files: info.fileList
        });
      },
      beforeUpload(file, fileList) {
        return false
      }
    };

    let modalFooter = {footer: null, onCancel: this.handleCancel};

    if (that.state.upload_status.status === ADD_LICENSE_IDENTIFIER_STEP.STEP_CHECK ||
      that.state.upload_status.status === ADD_LICENSE_IDENTIFIER_STEP.STEP_CHECK_FAILED ||
      that.state.upload_status.status === ADD_LICENSE_IDENTIFIER_STEP.STEP_CHECK_PROGRESS) {
      modalFooter = {
        onCancel: this.handleCancel,
        footer: [
          <Button key="cancel" onClick={this.handleCancel}>
            {formatMessage({id:  'app.cb.globalApp.cancel'})}
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleUpload}>
            {formatMessage({id:'app.cb.licenseManage.check'})}
          </Button>,
        ]
      }
    } else if (that.state.upload_status.status === ADD_LICENSE_IDENTIFIER_STEP.STEP_CHECK_SUCCESS ||
      that.state.upload_status.status === ADD_LICENSE_IDENTIFIER_STEP.STEP_ADD_FAILED) {
      modalFooter = {
        onCancel: this.handleCancel,
        footer: [
          <Button key="cancel" onClick={this.handleCancel}>
            {formatMessage({id:  'app.cb.globalApp.cancel'})}
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleAddLicense}>
            {formatMessage({id:'app.cb.globalApp.add'})}
          </Button>,
        ]
      }
    } else if (that.state.upload_status.status === ADD_LICENSE_IDENTIFIER_STEP.STEP_ADD_SUCCESS) {
      modalFooter = {
        onCancel: this.handleCancel,
        footer: [
          <Button key="submit" type="primary" onClick={this.handleCancel}>
            {formatMessage({id:'app.cb.globalApp.ok'})}
          </Button>,
        ]
      }
    } else {
      modalFooter = {footer: null, onCancel: this.handleCancel};
    }
    const getCanUseDate =()=>{
      if(upload_status.result?.use_period>=12) {
        const canUseYearFloat = (parseFloat(upload_status.result?.use_period || '0') / parseFloat('12')).toFixed(2).toString()
        const canUseYearStr = canUseYearFloat.lastIndexOf('.00') >= 0 ? canUseYearFloat.substring(0, canUseYearFloat.length - 3) : canUseYearFloat
        return canUseYearStr+formatMessage({id:'app.cb.globalApp.year'})
      }else{
        return upload_status.result?.use_period+formatMessage({id:'app.cb.globalApp.month'})
      }
    }
    //
    const CheckResultView = () => {
      return (
        <div>
          <Row>
            <Col span={3}></Col>
            <Col span={19}>
              <Descriptions size="small" column={2} style={{margin: "8px"}}>
                <Descriptions.Item
                  label={formatMessage({id:'app.cb.licenseManage.company'})}
                >
                  {upload_status.result.user}
                </Descriptions.Item>
                <Descriptions.Item
                  label={formatMessage({id:'app.cb.licenseManage.licenseName'})}>
                  {upload_status.result.licence_name}
                </Descriptions.Item>
                <Descriptions.Item
                  label={formatMessage({id:'app.cb.licenseManage.userNumber'})}>
                  {upload_status.result.user_num}
                </Descriptions.Item>
                <Descriptions.Item
                  label={formatMessage({id: 'app.cb.licenseManage.periodOfUse'})}>
                  {getCanUseDate()}
                </Descriptions.Item>
                <Descriptions.Item
                  label={formatMessage({id:'app.cb.licenseManage.effectiveDate'})}>
                  {`${moment(upload_status.result.failure_time).format('YYYY-MM-DD HH:mm')},请在有效截止日期前使用`}
                </Descriptions.Item>
              </Descriptions>
              <Descriptions size="small" column={2} style={{margin: "8px"}}>
                <Descriptions.Item
                  label={formatMessage({id: 'app.cb.licenseManage.certificate'})}
                >
                  {upload_status.result.licence}
                </Descriptions.Item>

              </Descriptions>
            </Col>
            <Col span={2}></Col>
          </Row>
        </div>
      )
    }
    // eslint-disable-next-line consistent-return
    const getContent = () => {
      if (that.state.upload_status.status === ADD_LICENSE_IDENTIFIER_STEP.STEP_CHECK ||
        that.state.upload_status.status === ADD_LICENSE_IDENTIFIER_STEP.STEP_CHECK_FAILED ||
        that.state.upload_status.status === ADD_LICENSE_IDENTIFIER_STEP.STEP_CHECK_PROGRESS) {
        let _disabled = true;
        if (that.state.files.length <= 0) {
          _disabled = false;
        }
        return (
          <div className={styles.draggerStyle}>
            <Dragger {...dragger_props} disabled={_disabled} accept={'.license'}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox"/>
              </p>
              <p className="ant-upload-text">{formatMessage({id:'app.globalApp.drageAndUploadFile'})}</p>
              <p className="ant-upload-hint">{`${formatMessage({id:'app.globalApp.supportFileType'})}：.license`}</p>
            </Dragger>
            {
              that.state.upload_status.progress <= 0 ? (<div/>) :
                (<Progress percent={that.state.upload_status.progress} size="small" showInfo={false}/>)
            }
            <div style={{height:'50px'}}></div>
          </div>
        )
      } else if (that.state.upload_status.status === ADD_LICENSE_IDENTIFIER_STEP.STEP_CHECK_SUCCESS ||
        that.state.upload_status.status === ADD_LICENSE_IDENTIFIER_STEP.STEP_ADD_FAILED) {
        // 验证完成显示结果
        return <CheckResultView/>
      } else if (that.state.upload_status.status === ADD_LICENSE_IDENTIFIER_STEP.STEP_ADD_SUCCESS) {
        // 添加成功显示
        return (
          <div>
            <MyResult
              type="success"
              title={formatMessage({id:  'app.cb.licenseManage.addLicenseSuccess'})}
              description={''}
              className={styles.formResult}
            />
            <div style={{height: '50px'}}/>
          </div>
        )
      }
    };

    return (
      <Modal
        title={formatMessage({id:'app.cb.licenseManage.addLicense'})}
        className={styles.addLicenseDialog}
        width={680}
        destroyOnClose
        visible={this.state.visible}
        {...modalFooter}
        afterClose={that.onAfterClose}
      >
        {
          getContent()
        }

      </Modal>
    );
  }

}

AddLicenseIdentifierDialog.propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
AddLicenseIdentifierDialog.defaultProps = {
  onDismiss: () => {
    console.log('//todo->AddLicenseIdentifierDialog:onDismiss');
  },
  onSuccess: () => {
    console.log('//todo->AddLicenseIdentifierDialog:onSuccess');
  },
  removeDialog: () => {
    console.log('//todo->AddLicenseIdentifierDialog:removeDialog');
  }
};

const mapStateToProps = ({licenseManage, loading}) => {
  return {licenseManage, loading: loading.effects[DISPATCH.licenseManage.add]}
};

export default connect(mapStateToProps)(AddLicenseIdentifierDialog)
