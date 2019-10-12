import React,{Component}  from "react";
import {Switch,Route} from "dva/router";
import DeviceList from '../DeviceList/index'
import AccessDevice from '../AccessDevice/index'
import AddDevice from '../AddDevice/index'
import Manage from '../Manage/index'
import Details from '../Details/index'

export default class extends Component{
  render() {
    return(
      <Switch>
        <Route path={this.props.match.url} component={AccessDevice} exact={true}/>
        <Route path={`${this.props.match.url}/deviceList`} component={DeviceList} exact={true}/>
        <Route path={`${this.props.match.url}/add`} component={AddDevice} exact={true}/>
        <Route path={`${this.props.match.url}/manage`} component={Manage} exact={true}/>
        <Route path={`${this.props.match.url}/details`} component={Details} exact={true}/>
      </Switch>
    )
  }
}
