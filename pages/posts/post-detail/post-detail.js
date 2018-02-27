const detailInfo = require('../../../data/post-data.js');
const app = getApp();
Page({
  data: {
    isPlay: false,
  },
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

    if (app.globalData.g_isPlayMusic && app.globalData.g_currentMusicPostId === this.data.postId) {
      this.setData({
        isPlay: true,
      })
    }
    this.setAudioMusic();
  },
  onCollectionTap: function () {
    this.getPostsCollectedSync();
    // this.getPostsCollectedAsy();
  },
  
  // 设置音乐播放
  setAudioMusic: function () {
    // 音乐播放器，按钮的控制
    const that = this;
    wx.getBackgroundAudioManager().onPlay(() => {
      that.setData({
        isPlay: true,
      });
      app.globalData.g_isPlayMusic = true;
      app.globalData.g_currentMusicPostId = that.data.postId;
    });
    wx.getBackgroundAudioManager().onPause(() => {
      that.setData({
        isPlay: false,
      });
      app.globalData.g_isPlayMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
    wx.getBackgroundAudioManager().onStop(() => {
      that.setData({
        isPlay: false,
      });
      app.globalData.g_isPlayMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
  },
  // 同步方法
  getPostsCollectedSync: function () {
    // 获取collected的状态
    const postsCollected = wx.getStorageSync('posts-collected');
    this.data.collected = postsCollected[this.data.postId];
    // 收藏变为未收藏，未收藏变为收藏
    this.data.collected = !this.data.collected;
    // 设置缓存和data中的数据
    postsCollected[this.data.postId] = this.data.collected;

    this.showModal(postsCollected);
  },
  // 异步获取缓存的方法，一般来说，我们的异步会根据具体的业务来选择，没有
  // 没有特殊情况下，我们都是使用的都是同步。
  getPostsCollectedAsy: function () {
    var that = this;
    wx.getStorage({
      key: 'posts-collected',
      success: function (res) {
        const postsCollected = res.data;
        that.data.collected = postsCollected[that.data.postId];
        // 收藏变为未收藏，未收藏变为收藏
        that.data.collected = !that.data.collected;
        // 设置缓存和data中的数据
        postsCollected[that.data.postId] = that.data.collected;

        that.showModal(postsCollected);
      },
    })
  },

  showModal: function (postsCollected) {
    const that = this;
    wx.showModal({
      title: '收藏',
      content: this.data.collected ? "收藏改文章" : "取消收藏该文章",
      success: function (res) {
        if (res.confirm) {
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
  onShareTap: function () {
    const itemList = [
      '分享到朋友圈',
      '分享到微博',
      '分享到 QQ 空间',
      '分享到豆瓣'
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function (res) {
        wx.showModal({
          title: `用户${itemList[res.tapIndex]}`,
          content: '现在还么有办法实现分享功能,是否还取消'
        })
      }
    })
  },
  // 播放音乐
  onMusicTap: function () {
    const isPlay = this.data.isPlay;

    if (isPlay) {
      wx.getBackgroundAudioManager().pause();
      this.setData({
        isPlay: false,
      })
    } else {
      const backgroundAudioManager = wx.getBackgroundAudioManager();
      const musicInfo = detailInfo.postDatas[this.data.postId].music;
      backgroundAudioManager.title = musicInfo.title;
      backgroundAudioManager.epname = musicInfo.dataUrl;
      backgroundAudioManager.coverImgUrl = musicInfo.coverImgUrl
      backgroundAudioManager.src = musicInfo.dataUrl // 设置了 src 之后会自动播放

      this.setData({
        isPlay: true,
      })
    }

  },
})