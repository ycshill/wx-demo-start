const postDataInfo = require('../../data/post-data.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      postInfo: postDataInfo.postDatas
    });
  },
  onPostTap: function (event) {
    const curPostId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: `post-detail/post-detail?id=${curPostId}`,
    })
  },
  onSwipeTap: function (event) {
    // target 是当前点击的对象 ,currentTarget 是被捕获的对象
    // target 就是图像，currentTarget就是 swiper
    const curPostId = event.target.dataset.postid;
    wx.navigateTo({
      url: `post-detail/post-detail?id=${curPostId}`,
    })
  },
})