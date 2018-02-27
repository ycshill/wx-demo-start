Page({
  onTap: function () {
    wx.switchTab({
      url: '../posts/post',
      success:function(){
        console.log('chengogng');
      },
      fail: function () {
        console.log('shibai')
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