import React from "react";
import {findDOMNode} from "react-dom";
import styles from "./index.less";
import _ from 'lodash'

class TextMarquee extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: this.props.datas || [],
      type: 1,  //1向上，2向左
      speed: 20,
      marqueeHeight: 30,   //滚动区域高度
      time: null,
      timeout: null,
      delay: 3000
    }
  }

  componentWillReceiveProps(nextProps) {
    let {list} = this.state
    if (!_.isEqual(nextProps.list, list)) {
      this.setState({list: nextProps.datas}, () => {
        // console.log('update state', this.state.list)
      })
    }
  }

  componentWillUnmount() {
    if(this.state.timeout){
      clearTimeout(this.state.timeout)
    }
    if(this.state.time){
      clearInterval(this.state.time)
    }
  }

  componentDidMount() {
    this.msg2.innerHTML = this.msg1.innerHTML
    if (this.state.type == 1) {
      this.scrollUp(this.msgBox);
    } else {
      this.scrollLeft(this.msgBox, this.msg1, this.msg2);
    }
  }

  scrollUp = (msgBox) => {
    msgBox.scrollTop = 0;
    let startScroll = () => {
      try{
        if (msgBox != null) {
          if(this.msg2!=null){
            this.msg2.innerHTML = this.msg1.innerHTML
          }
          msgBox.innerHTML = this.innerText.innerHTML
        }
      }catch (e) {

      }
      // console.log('innerview is ', msgBox.innerHTML)
      this.state.time = setInterval(scrollUp, this.state.speed)
      msgBox.scrollTop++;
    }
    let scrollUp = () => {

      if (msgBox.scrollTop % this.state.marqueeHeight == 0) {
        clearInterval(this.state.time)
        this.state.timeout = setTimeout(startScroll, this.state.delay)
      } else {
        msgBox.scrollTop++;
        if (msgBox.scrollTop >= msgBox.scrollHeight / 2) {
          msgBox.scrollTop = 0;
        }
      }
    }
    this.state.timeout = setTimeout(startScroll, this.state.delay)
  }
  scrollLeft = (msgBox, msg1, msg2) => {
    let marqueeLeft = () => {
      if (msg2.offsetWidth - msgBox.scrollLeft <= 0)   //offsetWidth 是对象的可见宽度
        msgBox.scrollLeft -= msg1.offsetWidth       //scrollWidth 是对象的实际内容的宽，不包边线宽度
      else {
        msgBox.scrollLeft++;
      }
    }
    let myMar = setInterval(marqueeLeft, this.state.speed)
    msgBox.onmouseover = function () {
      clearInterval(myMar)
    }
    myMar = setInterval(marqueeLeft, this.state.speed)
  }

  render() {

    return (
      <div className={styles.marquee}>
        <div className={this.state.type == 1 ? styles.scrollUp : styles.scrollLeft}
             ref={component => this.msgBox = findDOMNode(component)}>
          <div ref={component => this.innerText = findDOMNode(component)}><span className={styles.scrollBox1}
                                                                                ref={component => this.msg1 = findDOMNode(component)}>
                {
                  this.state.list.map((val, k) => {
                    return (
                      <span key={k}>{val.message}</span>
                    )
                  })
                }
          </span>
            <span className={styles.scrollBox2} ref={component => this.msg2 = findDOMNode(component)}></span></div>
        </div>
      </div>
    )
  }
}


export default TextMarquee;
