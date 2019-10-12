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
import SearchInput from "@/myComponents/SearchInput";
import {fetchAccessDevices} from "@/utils/dictionaryutils";
import {ResponseDataResult} from "@/constants/constants";

const {TextArea} = Input;
const FormItem = Form.Item;

@Form.create()
class MoveDeviceDialog extends PureComponent {
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
    labelCol: {span: 7},
    wrapperCol: {span: 12},
  };


  dismiss = () => {
    console.log('dismiss')
    this.setState({
      failure: false,
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
    const that = this;
    const {dispatch, form: {validateFields}, onSuccess} = that.props;
    const {current} = that.state
    validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        console.log('move device params:', fieldsValue)
        this.updateLoadind(true)

        // 如果不变，直接关掉dialog
        // console.log('current region:',(current ? getRegionId(current) : undefined))
        // console.log('edit region:',fieldsValue.region)
        let playLoad = {};
        playLoad['switch_id'] = fieldsValue.deviceId;
        playLoad['src'] = current.id
        // 编辑
        dispatch({
          type: DISPATCH.deviceManage.manageMove,
          payload: playLoad,
          callback: (res) => {
            if (res.r === ResponseDataResult.OK) {
              onSuccess();
              that.handleDone();
              message.success(`${formatMessage({id: 'app.cb.devicemanage.manage.moveSuccess'})}`)
            } else {
              message.error(`${formatMessage({id: 'app.cb.devicemanage.manage.moveFailed'})} ${res?.msg}!`)
            }
            this.updateLoadind(false)
          }
        });

      }
    )
    ;
  }

  // 检索接入设备
  fetchSearchInputAccessDevices = (value, callback) => {
    const {dispatch} = this.props
    const that = this;
    fetchAccessDevices(dispatch, value, (mData) => {
      dispatch({
        type: DISPATCH.deviceManage.saveAdStepStatus,
        payload: {...that.state.data, ...{accessDeviceData: mData}},
      });
      callback(mData)
    })
  }

  render() {
    let that = this;
    const {
      form: {getFieldDecorator},
    } = that.props;

    let {current, loading} = that.state;
    console.log('current device is ', current)
    const modalFooter = {
      onCancel: this.handleCancel,
      footer: [
        <Button key="cancel" onClick={that.handleCancel}>
          {formatMessage({id: 'app.cb.globalApp.cancel'})}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
          {formatMessage({id: 'app.cb.globalApp.move'})}
        </Button>,
      ]
    }


    const getModalContent = () => {
      let view = <Form onSubmit={this.handleSubmit}>
        <FormItem label={formatMessage({id: 'app.cb.usermanage.accessDevice'})} {...that.formLayout}>
          {getFieldDecorator('deviceId', {
            rules: [
              {required: true, message: formatMessage({id: 'app.cb.devicemanage.plseaseSelAccessDevice'})},
            ],
            initialValue: current.name,
          })(<SearchInput placeholder={formatMessage({id: 'app.cb.globalApp.pleaseSel'})}
                          fetchFunction={this.fetchSearchInputAccessDevices}/>)}
        </FormItem>
        <div style={{height: "60px"}}/>
        {/*撑起*/}
      </Form>;
      return view
    };
    return (
      <Modal
        title={(current && current.id) ? formatMessage({id: 'app.cb.domainmanage.domainlist.editdomain'}) : formatMessage({id: 'app.cb.domainmanage.domainlist.adddomain'})}
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

MoveDeviceDialog.propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
MoveDeviceDialog.defaultProps = {
  onDismiss: () => {
    console.log('//todo->MoveDeviceDialog:onDismiss');
  },
  onSuccess: () => {
    console.log('//todo->MoveDeviceDialog:onSuccess');
  },
  removeDialog: () => {
    console.log('//todo->MoveDeviceDialog:removeDialog');
  }
};

const mapStateToProps = ({domainManage}) => {
  return {domainManage: domainManage}
};

export default connect(mapStateToProps)(MoveDeviceDialog)
