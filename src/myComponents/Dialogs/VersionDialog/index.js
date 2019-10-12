import ReactDOM from "react-dom";
import React from 'react'
import moment from 'moment';
import {Modal, Button, Descriptions, message} from 'antd';
import {formatMessage} from 'umi-plugin-react/locale';
import {bytesToSize} from '@/utils/utils';
import {DISPATCH} from "../../../constants/DvaAndApiConfig";
import styles from "./style.less";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:true,
      versionData:this.props.versionData,
      loading:false,
    };
  }
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  onAfterClose=()=>{
    console.log('onAfterClose:::::::::::::::');
    this.props.removeDialog();
  };
  handlerSetLoading = loading =>{
    this.setState({
      loading: loading,
    });
  }
  handlerUpgrade=()=>{
    let that = this;
    const {dispatch,success} = this.props;
    this.handlerSetLoading(true);
    dispatch({
      type: DISPATCH.versionManage.upGradeDevice,
      payload: {id:this.state.versionData.id},
      callback: (res) => {
        if (res.r === 'ok') {
          success();
          that.handleCancel();
          // message.success(`${formatMessage({id: 'app.cb.versionManage.upgradeSuccess'})}！`)
        } else {
          message.error(`${formatMessage({id: 'app.cb.versionManage.upgradeFail'})}!`)
        }
        this.handlerSetLoading(false);
      }
    });
  }
  render() {

    const deviceVersion = this.state.versionData;
    let loading = this.state.loading;
    let maskClose = !this.state.loading;
    const name_txt = deviceVersion.name;
    const newVersion = deviceVersion.latest;
    const publishTime = moment(parseInt(newVersion.time)).format('YYYY-MM-DD HH:mm');
    const size = bytesToSize(newVersion.size);

    const modalFooter = {footer:  [
        <Button key="submit" type="primary"  loading={loading} onClick={this.handlerUpgrade}>
          {formatMessage({id: 'app.globalApp.upgrade'})}
        </Button>,
      ]};
    const bodyBaseInfo =
      <Descriptions title={formatMessage({id: 'app.cb.versionManage.newVersionInfo'})} column={2}>
        <Descriptions.Item label={formatMessage({id: 'app.cb.versionManage.deviceName'})}>{name_txt}</Descriptions.Item>
        <Descriptions.Item label={formatMessage({id: 'app.cb.versionManage.publishTime'})}>{publishTime}</Descriptions.Item>
        <Descriptions.Item label={formatMessage({id: 'app.globalApp.size'})}>{size}</Descriptions.Item>
      </Descriptions>;
    const versionDataContent =<div>
      <div className={'ant-descriptions-title'}>{formatMessage({id: 'app.cb.versionManage.newVersionContent'})}</div>
      <div>{newVersion.changelog}</div>
    </div>;
    return (<Modal
        title={formatMessage({id: 'app.globalApp.upgrade'})}
        centered
        width={520}
        bodyStyle={{ padding: '64 24'},{fontSize:14},{color:'rgba(0, 0, 0, 0.847059)'}}
        visible={this.state.visible}
        onCancel={this.handleCancel}
        afterClose={this.onAfterClose}
        maskClosable={maskClose}
        keyboard={maskClose}
        closable={maskClose}
        destroyOnClose
        {...modalFooter}
      >
        <div className={styles.upgradeBody}>
          <div>{bodyBaseInfo}</div>
          <div>{versionDataContent}</div>
        </div>
      </Modal>
    );
  }
}

export default {
  show(dispatch,versionData,onSuccess) {
    console.log('versionData::::::::::',versionData);
    const div = document.createElement('div');
    document.body.appendChild(div);

    const removeDialog = function () {
      console.log('removeDialog::::::::::::');
      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
    };

    ReactDOM.render(<App
      dispatch={dispatch}
      versionData={versionData}
      success={onSuccess}
      removeDialog={removeDialog}
    />, div);
  },
}
