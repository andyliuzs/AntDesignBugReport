import React, {PureComponent, Fragment} from 'react'
import {connect} from 'dva';
import PropTypes from 'prop-types'
import {
  Form,
  Button,
  Modal,
  Row,
  Col
} from 'antd';
import {formatMessage} from 'umi-plugin-react/locale';

class NetMapDeviceDetailsDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  formLayout = {
    labelCol: {span: 7},
    wrapperCol: {span: 12},
  };

  dismiss = () => {
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
    this.dismiss()
  };

  render() {
    let that = this;
    const {
      netTopology: {node},
      current
    } = that.props;

    const modalFooter = {
      onCancel: this.handleCancel,
      footer: [
        <Button type="primary" onClick={this.handleCancel}>
          {formatMessage({id: 'app.cb.globalApp.ok'})}
        </Button>,
      ]
    };

    return (
      <Modal
        title={'设备管理'}
        width={640}
        bodyStyle={{padding: '28px 0', maxHeight:'300px', overflowY:'auto', }}
        destroyOnClose
        visible={that.state.visible}
        afterClose={that.onAfterClose}
        {...modalFooter}
      >
        {current.map((device, index)=>{
          return (
            <Fragment>
              <Row>
                <Col span={6} offset={4}>
                  <span style={{fontSize:'14px', color:'#333333'}}>设备{index+1}</span>
                </Col>
              </Row>
              <Form>
                <Form.Item style={{marginBottom: '5px'}} {...this.formLayout}
                           label={'备注'}>
                  {device['type'] || ''}
                </Form.Item>
                <Form.Item style={{marginBottom: '5px'}} {...this.formLayout} label={'版本'}>
                  {node['node_version'] || ''}
                </Form.Item>
                <Form.Item style={{marginBottom: '5px'}} {...this.formLayout} label={'IPv6'}>
                  {device['ip6'] || ''}
                </Form.Item>
              </Form>
            </Fragment>
          )
        })}
      </Modal>
    );
  }
}

NetMapDeviceDetailsDialog.propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
NetMapDeviceDetailsDialog.defaultProps = {
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

const mapStateToProps = ({netTopology}) => {
  return {netTopology: netTopology}
};

export default connect(mapStateToProps)(NetMapDeviceDetailsDialog)
