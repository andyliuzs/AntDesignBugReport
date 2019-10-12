import React from 'react';
import { PaginationConfig, SorterResult, TableCurrentDataSource } from 'antd/lib/table';

export interface MyStandardTableProps {
  columns: any;
  onSelectRow: (row: any) => void;
  data: any;
  rowKey?: string;
  selectedRows: any[];
  onChange?: (
    pagination: PaginationConfig,
    filters: Record<keyof any, string[]>,
    sorter: SorterResult<any>,
    extra?: TableCurrentDataSource<any>
  ) => void;
  loading?: boolean;
  haveBatchOperation?:boolean;
  haveTopAlert?:boolean;
}

export default class MyStandardTable extends React.Component<MyStandardTableProps, any> {}
