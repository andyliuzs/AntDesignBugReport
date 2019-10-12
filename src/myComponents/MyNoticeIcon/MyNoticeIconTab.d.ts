import { SkeletonProps } from 'antd/lib/skeleton';
import React from 'react';

export interface MyNoticeIconData {
  avatar?: string | React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  datetime?: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface MyNoticeIconTabProps {
  count?: number;
  emptyText?: React.ReactNode;
  emptyImage?: string;
  list?: MyNoticeIconData[];
  name?: string;
  showClear?: boolean;
  showViewMore?: boolean;
  style?: React.CSSProperties;
  title?: string;
  data?: any[];
  onClick: (item: any) => void;
  onClear: (item: any) => void;
  locale: any;
  onViewMore: (e: any) => void;
}

export default class MyNoticeIconTab extends React.Component<MyNoticeIconTabProps, any> {}
