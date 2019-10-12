import React from "react";
import styles from './index.less'
import {Row, Col, Radio} from 'antd';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";

let chart;
const SHOW_TYPE = {
  DAY: 'day',
  MIN: 'min',
}

class OutgoingChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showType: SHOW_TYPE.MIN,
      mData: this.props.mData || {}
    }
  }

  componentWillUnmount() {

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {showType, mData} = this.state
    if (showType == SHOW_TYPE.MIN && _.isEqual(prevState.mData.min, mData.min)) {
      return false;
    }
    if (showType == SHOW_TYPE.DAY && _.isEqual(prevState.mData.day, mData.day)) {
      return false;
    }
    return true;
  }

  componentDidMount() {
  }

  onShowTypeChange = (e) => {
    console.log('onShowTypeChange', e.target.value)
    this.setState({
      showType: e.target.value,
    })
  }

  render() {

    const {scale, height, bottomAxisData} = this.props

    const {showType, mData} = this.state
    const timeLabel = {
      // 设置文本的显示样式，还可以是个回调函数，回调函数的参数为该坐标轴对应字段的数值
      formatter(text, item, index) {
        return '' // 不显示x轴坐标
      },

    }
    console.log('mData', mData)
    return (


      <div className={styles.chart}>
        <Chart
          height={height || 250}
          data={mData[showType] || []}
          scale={scale}
          forceFit
          onGetG2Instance={g2Chart => {
            chart = g2Chart;
          }}
        >
          <Axis
            name='time'
            label={timeLabel}
            tickLine={null}
          />
          <Axis name='speed'/>
          <Tooltip/>
          <Legend/>

          <Geom type="area" position="time*speed" shape="smooth" />
          <Geom type="line" position="time*speed" size={2} shape="smooth"/>
        </Chart>
        <div className={styles.bottomAxisStyle}>
          <Row style={{width: '100%'}}>
            <Col span={8} className={styles.leftTextStyle}>
              {showType == SHOW_TYPE.MIN ? '60s' : '24h'}
            </Col>
            <Col span={8} className={styles.centerTextStyle}>
              {showType == SHOW_TYPE.DAY && '12h'}
            </Col>
            <Col span={8} className={styles.rightTextStyle}>
              0
            </Col>
          </Row>
        </div>
        <Radio.Group defaultValue={showType} className={styles.typeSwitchStyle} onChange={this.onShowTypeChange}>
          <Radio.Button value={SHOW_TYPE.MIN}>60s</Radio.Button>
          <Radio.Button value={SHOW_TYPE.DAY}>24h</Radio.Button>
        </Radio.Group>
      </div>


    );
  }
}

export default OutgoingChart
