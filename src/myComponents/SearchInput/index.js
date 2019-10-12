import {Select} from 'antd';
import querystring from 'querystring';
import {ResponseDataResult} from "../../constants/constants";
import {isAntDesignPro} from "@/utils/utils";

const {Option} = Select;

let timeout;
let currentValue;

class SearchInput extends React.Component {
  fetch = (isSearch, value, fetchFunction, callback) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    let isDifferent = currentValue !== value
    if (!isDifferent && !isSearch) {
      isDifferent = true
    }
    console.log('fetch search', isDifferent, isSearch)
    if (_.isEmpty(currentValue) || value)
      currentValue = value;

    if(_.has(this.props,'alwaysSearch') && this.props?.alwaysSearch){
      if(fetchFunction){
        fetchFunction(value, (responseArray) => {
          if (responseArray) {
            callback(responseArray)
          } else {
            callback([])
          }
        })
      }
    }else{
      function fake() {
        if (isDifferent && fetchFunction) {
          console.log('搜索关键字不同，需要检索', value)
          fetchFunction(value, (responseArray) => {
            if (responseArray) {
              callback(responseArray)
            } else {
              callback([])
            }
          })
        } else {
          callback(undefined)
        }
      }

      timeout = setTimeout(fake, 300);
    }
  }

  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: this.props.value || undefined,
      isSearch: false,
      loading: false,
    };
  }


  componentDidMount() {
    if (!_.isEmpty(this.props.oldData)) {
      this.setState({data: this.props.oldData})
    }
  }
  handleSearch = value => {
    this.setState({loading: true}, () => {
      this.fetch(this.state.isSearch, value, this.props.fetchFunction, (data) => {
        if (data != undefined) {
          this.setState({data: data, isSearch: true, loading: false}, () => {
          })
        } else {
          this.setState({loading: false}, () => {
          })
        }
      });
    })

  };

  handleChange = value => {
    this.setState({value: value});
    const {onChange} = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  onFocus = (e) => {
    this.handleSearch('')
  }

  render() {
    const disabled = this.props.disabled || false
    const {loading} = this.state;
    const options = this.state.data.map(d => <Option key={d.value} value={d.value}>{d.text}</Option>);
    return (
      <Select
        showSearch
        value={this.state.value}
        placeholder={this.props.placeholder}
        style={this.props.style}
        defaultActiveFirstOption={this.props.defaultActiveFirstOption||false}
        showArrow={false}
        loading={loading}
        disabled={disabled}
        onFocus={this.onFocus}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
      >
        {options}
      </Select>
    );
  }
}

export default SearchInput
