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
})