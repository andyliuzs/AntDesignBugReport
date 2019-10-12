import React, {PureComponent} from 'react'
import {connect} from 'dva';
import PropTypes from 'prop-types'
import styles from "../StandardListForm.less";
import _ from 'lodash'
import {
  Row,
  Col,
  Form,
  Button,
  Modal, message, Input,
} from 'antd';
import moment from "moment";
import MyStandardTable from "../../MyStandardTable";
import {BindType, UIConfig, UserType} from "../../../constants/constants";
import {formatMessage} from 'umi-plugin-react/locale';
import {DISPATCH} from "../../../constants/DvaAndApiConfig";
import {stringify} from "qs";

const {Search} = Input

@Form.create()
class TagSettingDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      current: this.props.current || {},
      tableData: [],
      showTableData: [],
      selectedRows: [],
      oldSelectedRows:[],
    };
  }

  columns = [
    {
      title: formatMessage({id: 'app.cb.labelmanager.setting.username'}),
      dataIndex: 'username',
      width: "33%",
    },
    {
      title: formatMessage({id: 'app.cb.globalApp.name'}),
      dataIndex: 'realname',
      width: "33%",
    },
    {
      title: formatMessage({id: 'app.cb.globalApp.note'}),
      dataIndex: 'note',
    }
  ]

  componentDidMount() {
    this.refreshTable();
  }


  refreshTable = () => {
    const that = this;
    const {dispatch} = this.props
    const {current} = this.state
    console.log('tag setting refreshtable')
    dispatch({
      type: DISPATCH.tagManage.tagUserList,
      payload: {id:current.id,ignorePage:true,withUnbound:true},
      callback: (res) => {
        if (res.r === 'ok' && _.has(res, 'list')) {
          let selectArr = [];
          res.list.forEach((item)=>{
            if(item.is_bind){
              selectArr.push(item);
            }
          })
          console.log('refreshtable response',res)
          this.setState({
            tableData: res.list,
            showTableData: res.list,
            oldSelectedRows:selectArr,
            selectedRows:selectArr
          })
        } else {
          this.setState({
            tableData: [],
          })
        }
      }
    });
  }
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    }, () => {
      console.log('selected rows', this.state.selectedRows)
    });
  };

  getUnSelectRows = ()=>{
    const {oldSelectedRows,selectedRows} = this.state;
    _.forEach(oldSelectedRows, (item, index) => {
      const targetItemId = _.indexOf(targetKeys, item.id)
      if (targetItemId >= 0) {
        targetKeyAndType.push({id: item.id, peer_type: item.peer_type})
      }
    })
  }
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
    this.props.onDismiss();
    this.props.removeDialog();
  };


  handleDone = () => {
    console.error(':::::::::::::::::handleDone');
    this.props.onSuccess();
    this.dismiss()
  };

  handleCancel = () => {
    this.dismiss()
  };
  // search
  handleSearch = e => {
    let filterValue = e.target.value
    setTimeout(() => {
      let newDatas = []
      _.forEach(this.state.tableData, (item) => {
        if (stringify(item).indexOf(filterValue) >= 0) {
          newDatas.push(item)
        }
      })
      this.setState({
        showTableData: newDatas
      })
    }, 300)
  };

  handleOk = () => {
    const that = this;
    const {dispatch} = this.props
    const {current, selectedRows,oldSelectedRows} = this.state

    if (selectedRows.length <= 0) {
      return;
    }
    const binds =[]
    const unBinds =[]
    _.forEach(selectedRows, (item) => {
      const findItemIndex = _.findIndex(oldSelectedRows,(o)=>{
        return  o.id == item.id
      });
      if(findItemIndex<0){
        binds.push( {"bind_id":item.id})
      }

    })
    _.forEach(oldSelectedRows,(item)=>{
      const sIndex = _.findIndex(selectedRows,(o)=>{
        return o.id == item.id
      })
      if(sIndex<0){
        unBinds.push({"bind_id":item.id})
      }
    })
    console.log('binds rows', binds)
    dispatch({
      type: DISPATCH.tagManage.updateTagUserList,
      payload: {tag_id: current.id,binds:JSON.stringify(binds),unbinds:JSON.stringify(unBinds)},
      callback: (res) => {
        console.log('bindAll response', res)
        if (res.r === 'ok') {
          message.success(formatMessage({id: 'app.cb.globalApp.settingSuccess'}))
          that.handleDone()
        } else {
          message.error(`${formatMessage({id: 'app.cb.globalApp.settingError'})}${res?.msg}` )
        }
      }
    });
  }

  render() {
    let that = this;
    let {showTableData, selectedRows} = that.state;
    let {tableLoading, bindLoading} = this.props

    const data = showTableData ? {
      list: showTableData,
      pagination: {pageSize: showTableData.length}
    } : {};
    const modalFooter = {
      onCancel: this.handleCancel,
      footer: [
        <Button key="cancel" onClick={that.handleCancel}>
          {formatMessage({id: 'app.cb.globalApp.cancel'})}
        </Button>,
        <Button key="submit" loading={bindLoading} type="primary" onClick={this.handleOk}>
          {formatMessage({id: 'app.cb.globalApp.ok'})}
        </Button>,
      ]
    }
    const getModalContent = () => {
      let view =
        <div>
          <Row>
            <Col lg={{span: 12}} md={{span: 12}} sm={{span: 24}}>
              <span>{formatMessage({id: 'app.cb.labelmanager.setting.pleaseChoiceUser'})}</span>
            </Col>
            <Col lg={{span: 12}} md={{span: 12}} sm={{span: 24}}>
              <Search
                className={styles.tagSettingSearch}
                placeholder={formatMessage({id: 'app.cb.globalApp.pleaseInput'})}
                onChange={this.handleSearch}
              />
            </Col>
          </Row>
          <Row style={{marginTop: '8px', marginBottom: '12px'}}>
            <Col>
              <div className={styles.detailTable} style={{minHeight: `${UIConfig.dialog.settingTableHeight}px`}}>
                <MyStandardTable
                  columns={this.columns}
                  selectedRows={selectedRows}
                  loading={tableLoading}
                  rowKey={'id'}
                  pagination={false}
                  scroll={{y: UIConfig.dialog.settingTableHeight}}
                  haveTopAlert={false}
                  size="small"
                  onSelectRow={this.handleSelectRows}
                  haveBatchOperation={true}
                  data={data}/>
              </div>
            </Col>
          </Row>

        </div>
      return view
    };

    return (
      <Modal
        title={formatMessage({id: 'app.cb.globalApp.setting'})}
        width={640}
        bodyStyle={{padding: '28px  40px'}
        }
        destroyOnClose
        visible={that.state.visible}
        afterClose={that.onAfterClose}
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

TagSettingDialog.propTypes = {
  onDismiss: PropTypes.func,
  onSuccess: PropTypes.func.isRequired,
  removeDialog: PropTypes.func.isRequired,
};
TagSettingDialog.defaultProps = {
  onDismiss: () => {
    console.log('//todo->TagSettingDialog:onDismiss');
  },
  removeDialog: () => {
    console.log('//todo->TagSettingDialog:removeDialog');
  }
};

const mapStateToProps = ({tagManage, loading}) => {
  return {
    tagManage: tagManage,
    tableLoading: loading.effects[DISPATCH.tagManage.tagUserList],
    bindLoading: loading.effects[DISPATCH.tagManage.updateTagUserList]
  }
};

export default connect(mapStateToProps)(TagSettingDialog)
