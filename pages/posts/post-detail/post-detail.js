const detailInfo = require('../../../data/post-data.js');

Page({
  onLoad: function (options) {
    this.data.postId = options.id;
    this.data.detailInfo = detailInfo.postDatas[this.data.postId];

    this.setData({
      detailInfo: this.data.detailInfo,
      postId: this.data.postId,
    })

    wx.setStorageSync('key', {
      name: 'lily',
      age: 10
    });

    /**
     * 页面进来的时候，访问缓存，查看是否被收藏，如果没有收藏，则
     * 创建缓存，如果有根据缓则进行展示
     */
    var postsCollected = wx.getStorageSync('posts-collected');
    if (postsCollected) {
      this.data.collected = postsCollected[this.data.postId];
      this.setData({
        collected: this.data.collected
      })
    } else {
      postsCollected = {};
      postsCollected[this.data.postId] = false;
      wx.setStorageSync('posts-collected', postsCollected);
    }
  },
  onCollectionTap: function () {

    // 获取collected的状态
    const postsCollected = wx.getStorageSync('posts-collected');
    this.data.collected = postsCollected[this.data.postId];
    // 收藏变为未收藏，未收藏变为收藏
    this.data.collected = !this.data.collected;
    // 设置缓存和data中的数据
    postsCollected[this.data.postId] = this.data.collected;

    this.showModal(postsCollected);
  },
 
  showModal: function (postsCollected) {
    const that = this;
    wx.showModal({
      title: '收藏',
      content: this.data.collected?"收藏改文章":"取消收藏该文章",
      success: function(res) {
        if(res.confirm) {
          that.setData({
            collected: that.data.collected,
          });
          wx.setStorageSync('posts-collected', postsCollected);
        } else {
          console.log('失败！');
        }
      }
    })
  },
  showToast: function (postsCollected) {
    this.setData({
      collected: this.data.collected,
    });
    wx.setStorageSync('posts-collected', postsCollected);
    wx.showToast({
      title: this.data.collected ? "收藏成功" : "收藏失败",
      icon: "success",
      duration: 1000,
    })
  },
})