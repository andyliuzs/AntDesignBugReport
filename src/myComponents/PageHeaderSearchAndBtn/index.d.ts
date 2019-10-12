import { CardProps } from 'antd/lib/card';
import React from 'react';
import {PaginationConfig} from "antd/lib/pagination";
import {SorterResult, TableCurrentDataSource} from "antd/lib/table";

export interface PageHeaderSearchAndBtnProps {
  onSearch?: (
   value:string
  ) => void;
  leftButton?: React.ReactNode;
}

export default class PageHeaderSearchAndBtn extends React.Component<PageHeaderSearchAndBtnProps , any> {}
