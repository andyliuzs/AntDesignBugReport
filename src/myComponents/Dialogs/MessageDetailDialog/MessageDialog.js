import React, {PureComponent} from 'react'
import {formatMessage} from 'umi-plugin-react/locale';
import {Button, Modal} from "antd";
import styles from "../StandardListForm.less";

class DemoDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible:true,
      current:this.props.current
    };
  }

  dismiss = ()=>{
    this.setState({
      visible:false
    });
  };

  onAfterClose=()=>{
    this.props.removeDialog();
  };

  render() {
    const that = this;
    const msgItemData = that.state.current;
    console.log(msgItemData.des);
    const modalFooter = {footer:  [
      <Button key="submit" type="primary" onClick={that.dismiss}>
        {formatMessage({id: 'app.cb.globalApp.gotIt'})}
      </Button>,
      ], onOk: this.handleDone };
    return (
      <Modal
        title={formatMessage({id: 'app.cb.messageManage.messageDetail'})}
        className={styles.standardListForm}
        centered
        width={520}
        bodyStyle={{ padding: '64 24',
          color:'rgba(0, 0, 0, 0.427451)'}}
        destroyOnClose
        closable={false}
        visible={that.state.visible}
        {...modalFooter}
        afterClose={that.onAfterClose}
      >
        <div>{that.props.current.des}</div>

      </Modal>
    );
  }
}
export default DemoDialog
