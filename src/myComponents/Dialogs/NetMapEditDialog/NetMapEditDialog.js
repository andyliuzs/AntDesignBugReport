import React, {PureComponent} from 'react'
import {connect} from 'dva';
import PropTypes from 'prop-types'
import {DISPATCH} from '../../../constants/DvaAndApiConfig.jsx'
import {adminNamePattern} from "../../../constants/Pattern.jsx";
import {
  Form,
  Input,
  Button,
  Modal,
  message,
  Checkbox
} from 'antd';
import {formatMessage} from 'umi-plugin-react/locale';
import {getFileMd5} from "@/utils/utils";
import {notePattern} from "../../../constants/Pattern";
import _ from 'lodash'
import {ResponseDataResult} from "../../../constants/constants";

const {TextArea} = Input;

@Form.create()
class NetMapEditDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      current: this.props.current || {},
      loading: false,

      allTagOptions: [],//所有的标签
      selectedTagIds: [],//已经选中的标签
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
    //todo
    this.dismiss()
  };

  componentDidMount() {
    const {
      netTopology: {tags, node},
    } = this.props;

    let _selected_tag_ids = [], _all_tag_options = [];
    let _selected_tags = node.tags?.split(',') || [];

    for (let item of tags) {
      _selected_tags.every((tag) => {
        if (item.name == tag) {
          _selected_tag_ids.push(item.id);
          return false
        }
        return true
      });
      _all_tag_options.push({label: item.name, value: item.id})
    }
    this.setState({
      allTagOptions: _all_tag_options,//所有的标签
      selectedTagIds: _selected_tag_ids,//已经选中的标签
    })
  }

  /**
   * 处理新建和编辑对话框的确认按钮
   * @param e
   */
  handleSubmit = e => {
    e.preventDefault();
    let that = this;

    const {dispatch, form: {validateFields}, onSuccess, netTopology: {tags, node},} = that.props;
    const {selectedTagIds} = that.state;
    validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      let _fieldsValue = _.clone(fieldsValue);

      let _newSelectedTags = fieldsValue['tag_ids'].length>0?_.difference(fieldsValue['tag_ids'], selectedTagIds):selectedTagIds;
      if(_newSelectedTags.length<=0){
        delete _fieldsValue['tag_ids']
      }else {
        _fieldsValue['tag_ids'] = JSON.stringify(_fieldsValue['tag_ids'])
      }
      if(fieldsValue['note'] == node['note']){
        delete _fieldsValue['note']
      }
      console.log('fieldsValue', _fieldsValue);
      this.setState({
        loading:true
      });
      if(Object.keys(_fieldsValue).length>0){
        _fieldsValue['id'] = node['node_id'];
        dispatch({
          type: DISPATCH.netTopology.updateNode,
          params: {..._fieldsValue},
          callback: (res) => {
            if (res.r == ResponseDataResult.OK) {
              onSuccess();
              this.handleDone()
            }else {
              message.error("更新失败："+res.msg||res.code)
            }
          }
        })
      }else {
        this.handleCancel()
      }
    });
  };

  render() {
    let that = this;
    const {
      form: {getFieldDecorator},
      netTopology: {tags, node},
    } = that.props;

    let {current, loading, allTagOptions, selectedTagIds} = that.state;
    const modalFooter = {
      onCancel: this.handleCancel,
      footer: [
        <Button key="cancel" onClick={that.handleCancel}>
          {formatMessage({id: 'app.cb.globalApp.cancel'})}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
          {formatMessage({id: 'app.cb.globalApp.ok'})}
        </Button>,
      ]
    };

    const getModalContent = () => {
      return (<Form onSubmit={this.handleSubmit}>
        <Form.Item style={{marginBottom: '5px'}} {...this.formLayout}
                   label={formatMessage({id: 'app.cb.servicemanage.serviceName'})}>
          {node['server_name'] || '--'}
        </Form.Item>
        <Form.Item style={{marginBottom: '5px'}} {...this.formLayout} label={'版本'}>
          {node['node_version'] || '--'}
        </Form.Item>
        <Form.Item style={{marginBottom: '5px'}} {...this.formLayout} label={'IPv6'}>
          {node['node_ip'] || '--'}
        </Form.Item>
        <Form.Item style={{marginBottom: '15px'}} {...this.formLayout}
                   label={formatMessage({id: 'app.cb.globalApp.note'})}>
          {getFieldDecorator('note', {
            initialValue: node['note'] || '',
            rules: [
              {
                pattern: notePattern,
                message: formatMessage({id: 'app.globalApp.pleaseInputLegalNote'})
              }
            ]
          })(<TextArea placeholder={formatMessage({id: 'app.cb.servicemanage.pleaseEnterIntroduction'})} rows={1}
                       autosize/>)}
        </Form.Item>
        <Form.Item style={{marginBottom: '0px'}} {...this.formLayout}
                   label={'用户组'}>
          {getFieldDecorator('tag_ids', {
            initialValue: selectedTagIds,
          })(<Checkbox.Group
            options={allTagOptions}
          />)}
        </Form.Item>
      </Form>);
    };
    return (
      <Modal
        title={"详情"}
        width={640}
        bodyStyle={{padding: '28px 0'}}
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

NetMapEditDialog.propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
NetMapEditDialog.defaultProps = {
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

export default connect(mapStateToProps)(NetMapEditDialog)
