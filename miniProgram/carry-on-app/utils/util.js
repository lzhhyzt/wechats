const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const coverToStarsArray = function (stars) {
  var num = stars.toString().substring(0, 1)
  var array = []
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1)
    } else {
      array.push(0)
    }
  }
  return array
}

/**
  * 网络请求
  */
const http = function (url, callback) {
  wx.request({
    url: url,  // https://douban.uieee.com
    data: {},
    header: {
      "Content-Type": "json"
    },
    method: 'GET',
    success: function (res) {
      callback(res.data)
    },
    fail: function (error) {
      console.log('失败', error)
    }
  })
}

const coverToCastString = function (casts) {
  var castsjoin = ""
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / "
  }
  return castsjoin.substring(0, castsjoin.length - 2)
}

const convertToCastInfos = function (casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast)
  }
  return castsArray
}


/**
 * 判断某个变量/字符串是否在数组中
 */
const isInArray = function(str, arr) {
  var strArr = arr.join(",");
  return strArr.indexOf(str) !== -1;
}

/**
 * 删除数组中的某一元素
 */
const deleteElefromArray = function(str, arr) {
  let index;
  // 查找元素所在的位置
  for (let i =0; i < arr.length; i++) {
    if (arr[i] === str) {
      index = i;
    }
  }
  // 删除数组的指定元素
  arr.splice(index, 1);
  return arr;
}

/**
 * 时间格式化
 * 2018-09-15 转化为 09/16
 */
const formatDate = function(date) {
  let arr = date.split('-');
  let newDate = arr[1] + '/' + arr[2];
  return newDate;
}


/**
 * 分钟秒转变为秒
 */
const msChangeSeconds = function (time) {
  let arr = time.split('.')[0].split(':');
  let seconds = Number(arr[0]) * 60 + Number(arr[1]);
  return seconds;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  coverToStarsArray: coverToStarsArray,
  http: http,
  coverToCastString: coverToCastString,
  convertToCastInfos: convertToCastInfos,
  isInArray: isInArray,
  deleteElefromArray: deleteElefromArray,
  msChangeSeconds: msChangeSeconds
}
