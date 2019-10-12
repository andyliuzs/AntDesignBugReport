import React, {PureComponent, Fragment} from 'react';
import {Table, Input, Button, Popconfirm, Form, Alert} from 'antd';
import styles from './index.less'

const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({editing}, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const {record, saveRecord} = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      saveRecord({...record, ...values});
    });
  };

  renderCell = form => {
    this.form = form;
    const {children, dataIndex, record, title} = this.props;
    const {editing} = this.state;
    return editing ? (
      <Form.Item style={{margin: 0}}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save}/>)}
      </Form.Item>
    ) : (
      <div
        className={styles.editableCellValueWrap}
        style={{paddingRight: 24}}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      saveRecord,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({...column, total: 0});
    }
  });
  return totalList;
}

class EditableTable extends PureComponent {
  constructor(props) {
    super(props);
    const {columns} = props;
    const needTotalList = initTotalList(columns);
    this.state = {
      selectedRowKeys: [],
      needTotalList,
      columns: this.props.columns || []
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
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

  saveRecord = row => {
    console.log('save record default function',row)
  };

  render() {
    const {selectedRowKeys, needTotalList} = this.state;
    const {data = {}, rowKey, haveBatchOperation = true, haveTopAlert = true,saveRecord, ...rest} = this.props;
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
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          saveRecord: saveRecord || this.saveRecord,
        }),
      };
    });
    //delete get from props columns
    if (rest.columns) {
      delete rest.columns
    }
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
    </div> : <div></div>
    const tableView = haveBatchOperation ?

      <Table
        rowKey={rowKey || 'key'}
        rowSelection={rowSelection}
        dataSource={list}
        pagination={paginationProps}
        components={components}
        columns={columns}
        rowClassName={() => {
          return styles.editableRow
        }}
        onChange={this.handleTableChange}
        {...rest}
      /> : <Table
        rowKey={rowKey || 'key'}
        dataSource={list}
        pagination={paginationProps}
        columns={columns}
        components={components}
        rowClassName={() => {
          return styles.editableRow
        }}
        onChange={this.handleTableChange}
        {...rest}/>


    console.log('tableview:', tableView)
    return (
      <div className={styles.EditableTable}>
        {alertView}
        {tableView}
      </div>
    );


  }
}

export default EditableTable;
