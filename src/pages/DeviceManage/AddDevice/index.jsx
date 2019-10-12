import {Card, Steps} from 'antd';
import React, {Component} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {connect} from 'dva';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import styles from './style.less';
import {AddDeviceSteps, RouterPath} from "../../../constants/constants";
import _ from 'lodash'
import {formatMessage} from 'umi-plugin-react/locale';
import {itemRender} from "../../../utils/uiutil";
import {DISPATCH} from "../../../constants/DvaAndApiConfig";

const {Step} = Steps;

@connect(({deviceManage}) => ({
  adCurrentStep: deviceManage.adCurrentStep,
}))
class AddDevice extends Component {
  constructor(props) {
    super(props)
  }

  getCurrentStep() {
    const {adCurrentStep} = this.props;
    let step = AddDeviceSteps[_.findKey(AddDeviceSteps, {desc: adCurrentStep}) || 'Step1'].key
    console.log('add device step is ', adCurrentStep, step)
    return step
    // switch (adCurrentStep) {
    //   case AddDeviceSteps.Step1.desc:
    //     return AddDeviceSteps.Step1.key;
    //
    //   case AddDeviceSteps.Step1.desc:
    //     return 1;
    //
    //   case AddDeviceSteps.Step1.desc:
    //     return 2;
    //   default:
    //     return 0;
    // }
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: DISPATCH.deviceManage.resetAdAllStatus,
      payload: {},
    });
    console.log('componentWillUnmount cache data')
  }

  render() {
    const currentStep = this.getCurrentStep();
    let stepComponent, topContent;
    if (currentStep === AddDeviceSteps.Step2.key) {
      stepComponent = <Step2/>;
      topContent = formatMessage({id:'app.cb.devicemanage.selectContent'})
    } else if (currentStep === AddDeviceSteps.Step3.key) {
      stepComponent = <Step3/>;
    } else {
      stepComponent = <Step1/>;
      topContent = formatMessage({id: 'app.cb.devicemanage.addDevice.step1TopContent'});
    }
    const routes = [
      {
        patch: '/',
        breadcrumbName: formatMessage({id: 'app.cb.devicemanage.breadcrumb.devicemanage'}),
        component: false,
      },
      {
        path: RouterPath.DEVICE_MANAGE,
        component: true,
        breadcrumbName: formatMessage({id: 'app.cb.devicemanage.breadcrumb.accessdevice'}),
      },
      {
        path: RouterPath.DEVICE_MANAGE_ADD_DEVICE,
        breadcrumbName: formatMessage({id: 'app.cb.devicemanage.addDevice'}),
      },
    ];
    return (
      <PageHeaderWrapper title={formatMessage({id: 'app.cb.devicemanage.addDevice'})} content={topContent}
                         breadcrumb={{routes: routes, itemRender}}>
        <Card bordered={false}>
          <>
            <Steps current={currentStep} className={styles.steps}>
              <Step title={formatMessage({id: 'app.cb.devicemanage.selectDevice'})}/>
              <Step title={formatMessage({id: 'app.cb.devicemanage.selectContent'})}/>
              <Step title={formatMessage({id: 'app.cb.globalApp.complete'})}/>
            </Steps>
            {stepComponent}
          </>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AddDevice;
