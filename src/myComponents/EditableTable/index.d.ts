import React from 'react';
import { PaginationConfig, SorterResult, TableCurrentDataSource } from 'antd/lib/table';

export interface EditableTableProps {
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

export default class StandardTable extends React.Component<EditableTableProps, any> {}
