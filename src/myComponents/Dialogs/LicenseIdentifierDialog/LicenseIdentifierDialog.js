import React, {PureComponent} from 'react'
import {connect} from 'dva';
import PropTypes from 'prop-types'
import {formatMessage} from 'umi-plugin-react/locale';
import {
  Row,
  Col,
  Form,
  Button,
  Modal,
   Spin
} from 'antd';
import styles from "../StandardListForm.less";
import {ResponseDataResult} from "../../../constants/constants";
import {DISPATCH} from "../../../constants/DvaAndApiConfig";

@Form.create()
class LicenseIdentifierDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      identifier: null,
    };
  }


  componentDidMount() {
    this.getidentifier()
  }

  getidentifier = () => {
    const {dispatch} = this.props
    dispatch({
      type: DISPATCH.licenseManage.identifier,
      payload: {},
      callback: (res) => {
       if(res.r === ResponseDataResult.OK){
         this.setState({
           identifier:res.data
         })
       }
      }
    });
  }

  // eslint-disable-next-line react/sort-comp
  formLayout = {
    labelCol: {span: 7},
    wrapperCol: {span: 12},
  };


  dismiss = () => {
    console.log('dismiss')
    this.setState({
      visible: false,
    });
  };

  onAfterClose = () => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onDismiss();
    // eslint-disable-next-line react/destructuring-assignment
    this.props.removeDialog();
  };


  handleDone = () => {
    this.dismiss()
  };

  handleCancel = () => {
    this.dismiss()
  };


  render() {
    const {loading} = this.props
    // eslint-disable-next-line no-shadow
    const {identifier} = this.state;
    const modalFooter = {
      onCancel: this.handleCancel,
      footer: [
        <Button key="submit" type="primary" onClick={this.handleDone}>
          {formatMessage({id: 'app.cb.globalApp.ok'})}
        </Button>,
      ]
    }


    const getModalContent = () => {
      return <Spin spinning={loading} className={styles.innerTextCenter}>
        <Row style={{marginTop: '15px', marginBottom: '12px'}}>
          <Col style={{textAlign:'center'}}>
            <span>{formatMessage({id: 'app.cb.licenseManage.identifierDesc'})}</span>
          </Col>
          <Col style={{textAlign:'center', marginTop:'10px'}}>
            <span>{`${formatMessage({id: 'app.cb.licenseManage.licenseMark'})}:${identifier}`}</span>
          </Col>
        </Row>
      </Spin>


    };

    return (
      <Modal
        title={formatMessage({id: 'app.cb.licenseManage.licenseMark'})}
        width={640}
        bodyStyle={{padding: '28px  40px'}}
        destroyOnClose
        visible={this.state.visible}
        afterClose={this.onAfterClose}
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

LicenseIdentifierDialog.propTypes = {
  onDismiss: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
LicenseIdentifierDialog.defaultProps = {
  onDismiss: () => {
    console.log('//todo->LicenseIdentifierDialog:onDismiss');
  },
  // eslint-disable-next-line react/default-props-match-prop-types
  removeDialog: () => {
    console.log('//todo->LicenseIdentifierDialog:removeDialog');
  }
};

const mapStateToProps = ({licenseManage, loading}) => {
  return {licenseManage, loading: loading.effects[DISPATCH.licenseManage.identifier]}
};

export default connect(mapStateToProps)(LicenseIdentifierDialog)
