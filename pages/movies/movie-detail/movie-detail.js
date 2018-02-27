import { Movie } from './class/Movie.js';

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
    const url = `${app.globalData.g_dobanBaseUrl}/v2/movie/subject/${movieId}`;
    const movie = new Movie(url);

    // const that = this;  
    // movie.getMovieData(function (movie) {
    //   that.setData({
    //     movie: movie,
    //   })
    // })

    // 将上面的代码改用箭头函数
    movie.getMovieData( (movie) => {
      this.setData({
        movie: movie,
      })
    });
  },
  viewMoviePostImg: function (event) {
    const src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  }
})