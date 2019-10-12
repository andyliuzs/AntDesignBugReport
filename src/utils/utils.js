import {formatMessage} from 'umi-plugin-react/locale';
import SparkMD5 from "spark-md5";
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = path => reg.test(path);

const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

const isAntDesignProOrDev = () => {
  const {NODE_ENV} = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};

export {isAntDesignProOrDev, isAntDesignPro, isUrl};


// 字节转渲染数据
export const bytesToSize = (bytes) => {
  if (bytes === null || bytes === undefined || bytes === '' || bytes <= 0) {
    return '0 B';
  }
  if (bytes === 0) return '0 B';
  let k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = Math.floor(Math.log(bytes) / Math.log(k))
  //return (bytes / Math.pow(k, i)) + ' ' + sizes[i];
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
  //toPrecision(3) 后面保留两位小数，如1.00GB
}

// 检测IE浏览器版本
export const IEVersion = () => {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion == 7) {
      return 7;
    } else if (fIEVersion == 8) {
      return 8;
    } else if (fIEVersion == 9) {
      return 9;
    } else if (fIEVersion == 10) {
      return 10;
    } else {
      return 6;//IE版本<=7
    }
  } else if (isEdge) {
    return 'edge';//edge
  } else if (isIE11) {
    return 11; //IE11
  } else {
    return -1;//不是ie浏览器
  }
}

export const getOnLineTime = (nowTime, _item_data) => {
  var _str_1 = "";
  var _time = _item_data?.last_time, time_str = "";
  if (_item_data?.is_online) {
    // 如果日期为空 则 设置为last_time
    if(_item_data?.device?.last_time !=null){
      _time = _item_data?.device?.last_time
    }else {
      // 如果last_time 为空则设为当前时间
      if(_time==null){
      _time = nowTime
      }
    }
    _str_1 = formatMessage({id: 'app.cb.globalApp.onlineTime'});
  } else {
    if(_item_data?.device?.gone_time  !=null){
      _time = _item_data?.device?.gone_time
    }else {
      // 如果last_time 为空则设为当前时间
      if(_time==null){
        _time = nowTime
      }
    }
    _str_1 = formatMessage({id: 'app.cb.globalApp.offlineTime'});
  }
  if (!_time) {
    return "";
  }
  try {
    _time = parseInt(_time);
  } catch (e) {
    _time = 0;
  }
  if (_time == 0) {
    return "";
  }

  var _cur_time = nowTime;
  var date3 = _cur_time - _time;
  var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数

  //计算出相差天数
  var days = Math.floor(date3 / (24 * 3600 * 1000));

  var minutes = Math.floor(leave2 / (60 * 1000));
  var _year = Math.floor(days / 365);
  var month = Math.floor((days - 365 * _year) / 30);
  var leave_days = days - 365 * _year - 30 * month;


  if (_year > 0) {
    time_str = _year + formatMessage({id: 'app.cb.globalApp.year'});
  }
  if (month != 0) {
    time_str += month + formatMessage({id: 'app.cb.globalApp.month'});
  }
  if (leave_days != 0) {
    time_str += leave_days + formatMessage({id: 'app.cb.globalApp.day'});
  }
  if (hours > 0) {
    time_str += hours + formatMessage({id: 'app.cb.globalApp.hour'});
  }
  if (minutes >= 0) {
    time_str += minutes + formatMessage({id: 'app.cb.globalApp.minute'});
  }

  return _str_1 + ", " + time_str;
}

/**
 * 字符串插入数据
 * @param soure
 * @param start
 * @param newStr
 * @returns {*}
 */
export const stringInsert = (soure, start, newStr) => {
  return soure.slice(0, start) + newStr + soure.slice(start);
}


export const getFileMd5 = (ofile, callback) => {
  if (ofile == null || ofile == undefined) {
    callback(null)
    return;
  }
  var file = ofile;
  var tmp_md5;
  var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    // file = this.files[0],
    chunkSize = 8097152, // Read in chunks of 2MB
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0,
    spark = new SparkMD5.ArrayBuffer(),
    fileReader = new FileReader();

  fileReader.onload = function (e) {
    // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
    spark.append(e.target.result); // Append array buffer
    currentChunk++;
    var md5_progress = Math.floor((currentChunk / chunks) * 100);

    console.log(file.name + "  正在处理，请稍等," + "已完成" + md5_progress + "%");
    if (currentChunk < chunks) {
      loadNext();
    } else {
      tmp_md5 = spark.end();
      console.log('file md5 is ', tmp_md5)
      callback(tmp_md5)
    }
  };
  fileReader.onerror = function () {
    callback(null)
    console.warn('oops, get md5 something went wrong.');
  };

  function loadNext() {
    var start = currentChunk * chunkSize,
      end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }

  loadNext();
}
