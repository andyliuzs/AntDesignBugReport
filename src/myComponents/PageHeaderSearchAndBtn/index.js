import React from 'react';
import {Input,Row, Col} from 'antd';
const {Search} = Input;
import styles from "./index.less";
import {formatMessage} from 'umi-plugin-react/locale';

//头部居中搜索框与按钮组件
class PageHeaderSearchAndBtn extends React.Component {

  onSearch = (value) => {
    console.log('PageHeaderSearchAndBtn onSearch value', value)
  };
  constructor(props){
    super(props)
    this.state={
      onSearch : this.props.onSearch || this.onSearch
    }
  }
  componentDidMount() {
  }

  render() {
    const {onSearch} = this.state
    return <div className={styles.pageHeaderContent}>
      <Row type="flex" justify="center" align="bottom" className={styles.contentSearch}>
        <Col xs={24} sm={24} md={10}>
          <Search
            placeholder={formatMessage({id: 'app.cb.globalApp.pleaseInput'})}
            enterButton={formatMessage({id: 'app.cb.globalApp.search'})}
            size="large"
            onSearch={onSearch}
          />
        </Col>
      </Row>
      {this.props.leftButton && <Row type="flex" align="bottom" className={styles.addBtn}>
        <Col xs={24} sm={24} md={4}>
          {this.props.leftButton}
        </Col>
      </Row>}
    </div>
  }
}

export default PageHeaderSearchAndBtn;
