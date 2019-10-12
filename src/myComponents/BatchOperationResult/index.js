import React, {Fragment} from 'react';
import classNames from 'classnames';
import {Card, Icon, Spin, Alert, Col, Row} from 'antd';
import styles from './index.less';

export default function BatchOperationResult({
                                               className,
                                               showItem,
                                               ...restProps
                                             }) {
  const iconMap = {
    error: <Icon className={styles.error} type="close-circle" theme="filled"/>,
    success: <Icon className={styles.success} type="check-circle" theme="filled"/>,
    info: <Icon className={styles.info} type="info-circle" theme="filled"/>,
  };
  const clsString = classNames(styles.batchOperationResult, className);
  return (
    <div className={clsString} {...restProps}>
      <Alert
        style={{marginBottom: '34px'}}
        message={
          <div
            className={styles.headerStyle}>{iconMap[showItem.topAlert.iconType]}<span>{showItem.topAlert.alertText}</span>
          </div>
        }
        type={showItem.topAlert.iconType}
      />
      <div style={{padding: '0 15px'}}>
        <Row>
          <Col lg={{span: 24}} md={{span: 16}} sm={{span: 10}} style={{marginBottom: '24px'}}>
            <span style={{fontWeight: 600}}>{showItem.title}</span>
          </Col>
        </Row>
        {showItem.details && showItem.details.length > 0 &&
        showItem.details.map((item, index) =>
          <Row key={`item${index}`}>
            <Col lg={{span: 24}} md={{span: 16}} sm={{span: 10}}>
              <div
                className={styles.detailStyle}>{item.iconType && iconMap[item.iconType]}<span>{item.text}</span>
              </div>
            </Col>
          </Row>)
        }
      </div>
      <div style={{height: '60px'}}></div>
    </div>
  );
}
