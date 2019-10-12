import { PureComponent } from 'react';
import { Row, Col, Icon, Input, Form, Button } from 'antd';
import styles from './InboundsAttrsEdit.less';
import React from 'react';

const FormItem = Form.Item;
let id = 1;

/**
 * 属性行
 */
class AttrItem extends PureComponent {
  remove = k => {
    const { form, inboundIndex } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue(`${inboundIndex}index`);
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      [`${inboundIndex}index`]: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form, inboundIndex } = this.props;
    const keys = form.getFieldValue(`${inboundIndex}index`);
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({ [`${inboundIndex}index`]: nextKeys });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      inboundIndex,
    } = this.props;

    getFieldDecorator(`${inboundIndex}index`, { initialValue: [0] });
    const keys = getFieldValue(`${inboundIndex}index`);

    const attrItems = keys.map((k, index) => (
      <FormItem {...{ labelCol: { span: 7 } }} label="属性" style={{ marginBottom: 0 }}>
        <Col span={13}>
          <FormItem style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
            {getFieldDecorator(`${inboundIndex}attrs[${k}][attrKey]`, {
              rules: [{ required: true, message: '请输入属性名' }],
              whitespace: true,
            })(<Input placeholder="属性名" />)}
          </FormItem>
          <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>=</span>
          <FormItem
            style={{
              display: 'inline-block',
              width: 'calc(50% - 12px)',
              paddingTop: '0',
              marginBottom: '0',
            }}
          >
            {getFieldDecorator(`${inboundIndex}attrs[${k}][attrValue]`, {
              rules: [{ required: true, message: '请输入属性值' }],
              whitespace: true,
            })(<Input placeholder="属性值" />)}
          </FormItem>
        </Col>
        <Icon
          onClick={() => this.remove(k)}
          className={styles.dynamicDeleteButton}
          type="minus-circle-o"
        />
      </FormItem>
    ));

    return (
      <div>
        {attrItems}
        <FormItem {...{ wrapperCol: { span: 13, offset: 7 } }}>
          <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
            <Icon type="plus" /> 添加属性
          </Button>
        </FormItem>
      </div>
    );
  }
}

/**
 * 多连接点属性编辑
 */
@Form.create()
class InboundsAttrsEdit extends PureComponent {
  componentDidMount() {
    this.props.onRef(this);
  }

  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('index');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      index: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('index');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({ index: nextKeys });
  };

  /**
   *
   *fieldsValue:
   *
   let data = {
      index: [0, 2],
      inbound: [
        {
          attrs: [
            {attrKey: '1', attrValue: 'a'},
            {attrKey: '2', attrValue: 'b'}
          ],
          index: [0, 2]
        },
        {
          attrs: [
            {attrKey: '3', attrValue: 'c'},
          ],
          index: [0]
        }
      ]
    };
   * @param callback
   */
  handleSubmit = callback => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let _inbounds_to_response = [];
      try {
        for (let inbound of fieldsValue.inbound) {
          if (inbound) {
            let _inbound = [];
            for (let attr of inbound.attrs) {
              if (attr) {
                //js数组如果中间某个元素被移除，剩余的元素角标index仍然不变，计算数组长度
                if (attr['attrKey'] && attr['attrValue']) {
                  _inbound.push(attr);
                }
              }
            }
            if (_inbound.length > 0) {
              _inbounds_to_response.push(_inbound);
            }
          }
        }
      } catch (e) {
        console.log('InboundsAttrsEdit', e);
      }

      if (callback) {
        callback(_inbounds_to_response);
      }
    });
  };

  render() {
    const { form } = this.props;

    form.getFieldDecorator('index', { initialValue: [0] });
    const index = form.getFieldValue('index');

    const inboundItems = index.map((k, index) => (
      <div>
        <Row>
          <Col span={5} offset={3}>
            <span>{'连接点' + (index + 1)}</span>
            <Icon
              onClick={() => this.remove(k)}
              className={styles.dynamicDeleteButton}
              type="minus-circle-o"
            />
          </Col>
        </Row>
        <AttrItem inboundIndex={'inbound[' + k + ']'} form={form} />
      </div>
    ));

    return (
      <Form>
        {inboundItems}
        <FormItem {...{ wrapperCol: { span: 15, offset: 5 } }}>
          <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
            <Icon type="plus" /> 添加连接点
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default InboundsAttrsEdit;
