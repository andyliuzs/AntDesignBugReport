import React, {PureComponent, Fragment} from 'react';
import {Table, Alert} from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({...column, total: 0});
    }
  });
  return totalList;
}

class MyStandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const {columns} = props;
    const needTotalList = initTotalList(columns);
    const selRowKeys  = this.getPropsSelRowKeys(props)
    this.state = {
      firstEnter:true,// 第一次进入
      selectedRowKeys: selRowKeys,
      needTotalList,
    };
  }

  getPropsSelRowKeys=(props)=>{
    const {selectedRows} = props
    const selRowKeys = [];
    _.forEach(selectedRows,(item)=>{
      selRowKeys.push(item.id)
    })
    console.log('selected row is ',selectedRows)
    return selRowKeys
  }
  static getDerivedStateFromProps(nextProps,state) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }else if(nextProps.selectedRows.length >0 && state.firstEnter){
      const {selectedRows} = nextProps
      const selRowKeys = [];
      _.forEach(selectedRows,(item)=>{
        selRowKeys.push(item.id)
      })
      return {
        firstEnter:false,
        selectedRowKeys: selRowKeys,
      }
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let {needTotalList} = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const {onSelectRow} = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({selectedRowKeys, needTotalList});
  };

  handleTableChange = (pagination, filters, sorter) => {
    const {onChange} = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const {selectedRowKeys, needTotalList} = this.state;
    const {data = {}, rowKey, haveBatchOperation = true, haveTopAlert = true, ...rest} = this.props;
    const {list = [], pagination} = data;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    const alertView = haveTopAlert ? <div className={styles.tableAlert}>
      <Alert
        message={
          <Fragment>
            已选择 <a style={{fontWeight: 600}}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
            {needTotalList.map(item => (
              <span style={{marginLeft: 8}} key={item.dataIndex}>
                    {item.title}
                总计&nbsp;
                <span style={{fontWeight: 600}}>
                      {item.render ? item.render(item.total) : item.total}
                    </span>
                  </span>
            ))}
            <a onClick={this.cleanSelectedKeys} style={{marginLeft: 24}}>
              清空
            </a>
          </Fragment>
        }
        type="info"
        showIcon
      />
    </div> : <div/>
    const tableView = haveBatchOperation ?

      <Table
        rowKey={rowKey || 'key'}
        rowSelection={rowSelection}
        dataSource={list}
        pagination={paginationProps}
        onChange={this.handleTableChange}
        {...rest}
      /> : <Table
        rowKey={rowKey || 'key'}
        dataSource={list}
        pagination={paginationProps}
        onChange={this.handleTableChange}
        {...rest}/>
    return (
      <div className={styles.MyStandardTable}>
        {alertView}
        {tableView}
      </div>
    );
  }
}

export default MyStandardTable;
