// 评论星星,例如如果是3颗星，则是[1,1,1,0,0]
function coverToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  return array;
}

// http请求
function http(url, callback) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      callback(res.data)
    },
    fail: function () {
      console.log('失败！');
    }
  })
};

/**
 * 影人
 */
function coverToCastsString(casts) {
  let castsJoin = '';
  for (let idx in casts) {
    castsJoin = `${castsJoin}${casts[idx].name}/`;
  }
  return castsJoin.substring(0, castsJoin.length - 2);
}

/**
 * 影人图片
 */
function coverToCastInfos(casts) {
  let castsArray = [];
  for(let idx in casts) {
    let cast = {
      img: casts[idx].avatars? casts[idx].avatars : '',
      name:  casts[idx].name,
    }
    castsArray.push(cast);
  }
  return castsArray;
}

module.exports = {
  coverToStarsArray: coverToStarsArray,
  http: http,
  coverToCastsString: coverToCastsString,
  coverToCastInfos: coverToCastInfos,
}