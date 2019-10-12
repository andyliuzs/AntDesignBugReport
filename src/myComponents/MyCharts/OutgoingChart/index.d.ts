import { CardProps } from 'antd/lib/card';
import React from 'react';

export interface OutgoingChartProps extends CardProps {
  mData?: Array;

}

export default class OutgoingChart extends React.Component<OutgoingChartProps, any> {}
