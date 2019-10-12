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
  Modal,
  Descriptions
} from 'antd';
import moment from "moment";
import MyStandardTable from "../../MyStandardTable";
import {UIConfig, UserType} from "../../../constants/constants";
import {formatMessage} from 'umi-plugin-react/locale';
import {getUserDevices} from "../../../utils/dictionaryutils";
import {getOnLineTime} from "../../../utils/utils";
import {DISPATCH} from "../../../constants/DvaAndApiConfig";

@Form.create()
class UserDetailDialog extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      current: this.props.current || {},
      tableData: []
    };
  }

  columns = [
    {
      title: formatMessage({id: 'app.cb.usermanage.accessDevice'}),
      dataIndex: 'switchs',
      width: "33%",
    },
    {
      title: formatMessage({id: 'app.cb.usermanage.typeOf'}),
      dataIndex: 'type',
      width: "33%",
      render: (val,record) =>{
        return <span>{val}{formatMessage({id:'app.cb.devicemanage.manage.device'})}</span>
      }
    },
    {
      title: formatMessage({id: 'app.cb.usermanage.onLineOrOffLine'}),
      dataIndex: 'last_time',
      render: (text, record) =>{
        return <span>{getOnLineTime(new Date().getTime(),record)}</span>
      }
    }
  ]

  componentDidMount() {
    console.log('userdetaildialog comm did mount', this.state.current)
    const {dispatch} = this.props
    getUserDevices(dispatch, this.state.current.id, (res) => {
      console.log('userdevices',res)
      this.setState({
        tableData: res?.datas
      })
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
    this.dismiss()
  };

  handleCancel = () => {
    //todo
    this.dismiss()
  };


  render() {
    let that = this;
    let {loading} = this.props
    let {current, tableData } = that.state;

    const data = tableData ? {
      list: tableData,
      pagination: {pageSize: tableData.length}
    } : {};
    console.log('tabledata', tableData)
    const modalFooter = {
      onCancel: this.handleCancel,
      footer: [
        <Button key="submit" type="primary" onClick={this.handleDone}>
          {formatMessage({id: 'app.cb.globalApp.ok'})}
        </Button>,
      ]
    }


    const getModalContent = () => {
      let view =
        <div>
          <Row style={{marginBottom: '12px'}}>
            <Col lg={{span: 8}} md={{span: 8}} sm={{span: 24}}>
              <span className={styles.detailsHead}>{formatMessage({id: 'app.cb.usermanage.basicUserInfo'})}</span>
            </Col>
          </Row>
          <Descriptions size="small" col="2" style={{margin: "8px"}}>
            <Descriptions.Item
              label={formatMessage({id: 'app.cb.globalApp.userName'})}>{current.username}</Descriptions.Item>
            <Descriptions.Item
              label={formatMessage({id: 'app.cb.globalApp.name'})}> {current.realname}</Descriptions.Item>
            <Descriptions.Item
              label={formatMessage({id: 'app.cb.globalApp.phone'})}> {current.telephone}</Descriptions.Item>
            <Descriptions.Item
              label={formatMessage({id: 'app.cb.globalApp.role'})}> {UserType[current.is_admin]?.desc}</Descriptions.Item>
            <Descriptions.Item label={formatMessage({id: 'app.cb.globalApp.note'})}> {current.note}</Descriptions.Item>
          </Descriptions>
          <Row style={{marginTop: '28px', marginBottom: '12px'}}>
            <Col lg={{span: 8}} md={{span: 8}} sm={{span: 24}}>
              <span className={styles.detailsHead}>{formatMessage({id: 'app.cb.usermanage.userDeviceInfo'})}</span>
            </Col>
          </Row>
          <Row style={{marginTop: '28px', marginBottom: '12px'}}>
            <Col>
              <div className={styles.detailTable}>
                <MyStandardTable
                  columns={this.columns}
                  selectedRows={[]}
                  loading={loading}
                  rowKey={'index'}
                  pagination={false}
                  scroll={{y: UIConfig.dialog.detailTableHeight}}
                  haveTopAlert={false}
                  size="small"
                  haveBatchOperation={false}
                  data={data}/>
              </div>
            </Col>
          </Row>

        </div>
      return view
    };

    return (
      <Modal
        title={formatMessage({id: 'app.cb.usermanage.userDetails'})}
        width={640}
        bodyStyle={{padding: '28px  40px'}}
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

UserDetailDialog.propTypes = {
  onDismiss: PropTypes.func,
  removeDialog: PropTypes.func.isRequired,
};
UserDetailDialog.defaultProps = {
  onDismiss: () => {
    console.log('//todo->UserDetailDialog:onDismiss');
  },
  removeDialog: () => {
    console.log('//todo->UserDetailDialog:removeDialog');
  }
};

const mapStateToProps = ({userManageModel,loading}) => {
  return {userManageModel: userManageModel,loading:loading.effects[DISPATCH.userManage.userDevices]}
};

export default connect()(UserDetailDialog)
