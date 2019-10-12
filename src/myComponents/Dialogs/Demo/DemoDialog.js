import React, {PureComponent} from 'react'
import { connect } from 'dva';
import PropTypes from 'prop-types'
import {Button, Modal} from "antd";
import styles from "../StandardListForm.less";
import Result from '@/components/Result';

class DemoDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible:true
    };
  }

  dismiss = ()=>{
    this.setState({
      visible:false
    });
  };

  onAfterClose=()=>{
    this.props.onDismiss();
    this.props.removeDialog();
  };

  handleDone = () => {
    this.dismiss()
  };

  handleCancel = () => {
    //todo
  };

  render() {
    let that = this;
    const modalFooter = { footer: null, onCancel: this.handleDone };
    return (
      <Modal
        title={'title'}
        className={styles.standardListForm}
        width={640}
        bodyStyle={{ padding: '72px 0' }}
        destroyOnClose
        visible={this.state.visible}
        {...modalFooter}
        afterClose={that.onAfterClose}
      >
        <Result
          type="error"
          title={'failure title'}
          description={'failure reason'}
          actions={
            <Button type="primary" onClick={that.handleDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      </Modal>
    );
  }
}

DemoDialog.propTypes = {
  onDismiss:PropTypes.func,
  removeDialog:PropTypes.func.isRequired,
};
DemoDialog.defaultProps = {
  onDismiss:()=>{
    console.log('//todo->DemoDialog:onDismiss');
  },
  removeDialog:()=>{
    console.log('//todo->DemoDialog:removeDialog');
  }
};

const mapStateToProps = ({login}) => {
  return {login:login}
};

export default connect(mapStateToProps)(DemoDialog)
