Page({
  onTap: function () {
    wx.redirectTo ({
      url: '../posts/post',
      success: function () {
        console.log('success')
      },
      fail: function () {
        console.log('fail');
      },
      complete: function () {
        console.log('complete');
      }
    });
  },
  onHide: function () {
    console.log('on hide');
  },
  onUnload: function () {
    console.log('on unload');
  }
})