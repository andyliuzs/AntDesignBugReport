import React from 'react';
import MyNoticeIconTab, { MyNoticeIconData } from './MyNoticeIconTab';

export interface MyNoticeIconProps {
  count?: number;
  bell?: React.ReactNode;
  className?: string;
  loading?: boolean;
  onClear?: (tabName: string) => void;
  onItemClick?: (item: MyNoticeIconData, tabProps: MyNoticeIconProps) => void;
  onViewMore?: (tabProps: MyNoticeIconProps, e: MouseEvent) => void;
  onTabChange?: (tabTile: string) => void;
  style?: React.CSSProperties;
  onPopupVisibleChange?: (visible: boolean) => void;
  popupVisible?: boolean;
  locale?: {
    emptyText: string;
    clear: string;
    viewMore: string;
    [key: string]: string;
  };
  clearClose?: boolean;
}

export default class MyNoticeIcon extends React.Component<MyNoticeIconProps, any> {
  public static Tab: typeof MyNoticeIconTab;
}
