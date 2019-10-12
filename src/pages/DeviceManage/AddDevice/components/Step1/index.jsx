import { Button, Divider, Form, Input, Select } from 'antd';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import {formatMessage} from 'umi-plugin-react/locale';
const { Option } = Select;
import {DISPATCH} from "../../../../../constants/DvaAndApiConfig";
import {AddDeviceSteps, DeviceType} from "../../../../../constants/constants";
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const Step1 = props => {
  const { form, dispatch, data } = props;

  if (!data) {
    return null;
  }

  const { getFieldDecorator, validateFields } = form;

  const onValidateForm = () => {
    validateFields((err, values) => {
      if (!err && dispatch) {
        dispatch({
          type: DISPATCH.deviceManage.saveAdStepStatus,
          payload: values,
        });
        dispatch({
          type: DISPATCH.deviceManage.saveAdCurrentStep,
          payload: AddDeviceSteps.Step2.desc,
        });
      }
    });
  };

  return (
    <Fragment>
      <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
        <Form.Item {...formItemLayout} label={formatMessage({id:'app.cb.devicemanage.deviceType'})}>
          {getFieldDecorator('deviceType', {
            initialValue: data.deviceType,
            rules: [
              {
                required: true,
                message:formatMessage({id:'app.cb.devicemanage.pleaseSelDeviceType'}),
              },
            ],
          })(
            <Select placeholder={formatMessage({id:'app.cb.devicemanage.pleaseSelDeviceType'})}>
              <Option value={DeviceType.UserDeviceType.key}>{DeviceType.UserDeviceType.desc}</Option>
              <Option value={DeviceType.ServerDeviceType.key}>{DeviceType.ServerDeviceType.desc}</Option>
              <Option value={DeviceType.SwitchDeviceType.key}>{DeviceType.SwitchDeviceType.desc}</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm}>
            {formatMessage({id:'app.cb.globalApp.nextStep'})}
          </Button>
        </Form.Item>
      </Form>
      <Divider style={{ margin: '40px 0 24px' }} />
      <div className={styles.desc}>
        <h3>{formatMessage({id:'app.globalApp.description'})}</h3>
        <h4>{formatMessage({id:'app.cb.devicemanage.deviceType'})}</h4>
        <p>
          {formatMessage({id:  'app.cb.devicemanage.addDeviceStep1Desc'})}
        </p>

      </div>
    </Fragment>
  );
};

export default connect(({ deviceManage }) => ({
  data: deviceManage.adStepStatus,
}))(Form.create()(Step1));
