import React, {PureComponent} from 'react'
import {connect} from 'dva';
import PropTypes from 'prop-types'
import styles from "../StandardListForm.less";
import _ from 'lodash'
import {
  Row,
  Col,
  Form,
  Button,
  Modal,
  Descriptions, Upload
} from 'antd';
import moment from "moment";
import MyStandardTable from "../../MyStandardTable";
import {ServicePermissionType, ServiceType, UIConfig, UserType} from "../../../constants/constants";
import {formatMessage} from 'umi-plugin-react/locale';
import {getOnLineTime} from "../../../utils/utils";

@Form.create()
class ServiceDetailDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      current: this.props.current || {},
    };
  }


  componentDidMount() {
    console.log('ServiceDetailDialog comm did mount', this.state.current)
  }


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


  render() {
    let that = this;
    let {current} = that.state;

    const modalFooter = {
      onCancel: this.handleCancel,
      footer: [
        <Button key="submit" type="primary" onClick={this.handleDone}>
          {formatMessage({id: 'app.cb.globalApp.ok'})}
        </Button>,
      ]
    }
   const serverTypeDesc = ServiceType[_.findKey(ServiceType, {key: current.type})].desc ||'--'
    const servicePermissionType = ServicePermissionType[_.upperFirst(current?.acl_status)]?.desc || '--'
    const getModalContent = () => {
      let view =
        <div>
          <Row style={{marginBottom: '12px'}}>
            <Col span={8}></Col>
            <Col span={8} style={{textAlign: 'center'}}>
              <Upload
                name="avatar"
                multiple={false}
                listType="picture-card"
                disabled={true}
                className={styles.detailUploadImg}
                showUploadList={false}
                beforeUpload={this.beforeImgUpload}
                onChange={this.handleImgUploadChange}
              >
                <img id='image' src={current?.icon} alt="" style={{width: '100%'}}/>
              </Upload>
            </Col>
            <Col span={8}></Col>
          </Row>
          <Descriptions size="small" column={2} style={{margin: "8px"}}>
            <Descriptions.Item
              label={formatMessage({id: 'app.cb.servicemanage.serviceName'})}>{current.name}</Descriptions.Item>
            <Descriptions.Item
              label={formatMessage({id: 'app.cb.servicemanage.servicetype'})}> {serverTypeDesc}</Descriptions.Item>
            <Descriptions.Item span={2}
                               label={formatMessage({id: 'app.cb.servicemanage.serviceAddress'})}> {current?.uri}</Descriptions.Item>
            <Descriptions.Item span={2}
                               label={formatMessage({id: 'app.cb.servicemanage.devicePermissions'})}> {servicePermissionType}</Descriptions.Item>
            <Descriptions.Item className={(current?.des?.length || 0) > 70 ? styles.detailNote : {}} span={2}
                               label={formatMessage({id: 'app.cb.servicemanage.serviceIntroduction'})}>{current?.des}</Descriptions.Item>
          </Descriptions>

        </div>
      return view
    };

    return (
      <Modal
        title={formatMessage({id:  'app.cb.globalApp.detail'})}
        width={640}
        bodyStyle={{padding: '28px  40px'}}
        destroyOnClose
        visible={that.state.visible}
        afterClose={that.onAfterClose}
        {...
          modalFooter
        }
      >
        {
          getModalContent()
        }
      </Modal>
    );
  }

}

ServiceDetailDialog.propTypes = {
  onDismiss: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
ServiceDetailDialog.defaultProps = {
  onDismiss: () => {
    console.log('//todo->ServiceDetailDialog:onDismiss');
  },
  removeDialog: () => {
    console.log('//todo->ServiceDetailDialog:removeDialog');
  }
};

const mapStateToProps = ({serviceManage}) => {
  return {serviceManage: serviceManage}
};

export default connect()(ServiceDetailDialog)
