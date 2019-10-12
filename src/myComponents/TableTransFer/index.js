import React from 'react';
import {Input, Row, Col, Transfer, Table} from 'antd';

const {Search} = Input;
import styles from "./index.less";
import {formatMessage} from 'umi-plugin-react/locale';
import difference from 'lodash/difference';
import {UIConfig} from "@/constants/constants";

// Customize Table Transfer
export default function TableTransFer({leftColumns, rightColumns, pagination = true,loading=false,tableKey='id', ...restProps}) {
  return (<Transfer {...restProps} showSelectAll={false}>
      {({
          direction,
          filteredItems,
          onItemSelectAll,
          onItemSelect,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
        const columns = direction === 'left' ? leftColumns : rightColumns;

        const rowSelection = {
          getCheckboxProps: item => ({disabled: listDisabled || item.disabled}),
          onSelectAll(selected, selectedRows) {
            const treeSelectedKeys = selectedRows
              .filter(item => !item.disabled)
              .map(({key}) => key);
            const diffKeys = selected
              ? difference(treeSelectedKeys, listSelectedKeys)
              : difference(listSelectedKeys, treeSelectedKeys);
            onItemSelectAll(diffKeys, selected);
          },
          onSelect({key}, selected) {
            onItemSelect(key, selected);
          },
          selectedRowKeys: listSelectedKeys,
        };

        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            // scroll={{y: UIConfig.dialog.detailTableHeight}}
            dataSource={filteredItems}
            size="small"
            key={tableKey}
            loading={loading}
            pagination={pagination}
            style={{pointerEvents: listDisabled ? 'none' : null}}
            onRow={({key, disabled: itemDisabled}) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) return;
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
          />
        );
      }}
    </Transfer>
  )
};
