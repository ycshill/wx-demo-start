const app = getApp();
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const movieId = options.id;
    const url = `${app.globalData.g_dobanBaseUrl}/v2/movie/subject/${movieId}`
    util.http(url, this.processData);
  },
  /**
   * 数据处理
   */
  processData: function (data) {
    if(!data) return;
    let director = {
      avatar: '',
      name: '',
      id: '',
    }

    if(data.directors[0] != null) {
      if(data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large;
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }

    var movie = {
      movieImg: data.images? data.images.large : '',
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount:data.comments_count,
      year: data.year,
      generes: data.genres.join('/'),
      stars: util.coverToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.coverToCastsString(data.casts),
      castsInfo: util.coverToCastInfos(data.casts),
      summary:data.summary,
    }    
    
    this.setData({
      movie: movie,
    })
  },

  viewMoviePostImg: function (event) {
    const src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  }  
})