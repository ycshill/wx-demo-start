// pages/movies/more-movie/more-movie.js
const app = getApp();
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle: '',
    requestUrl: '',
    totalCount: 0,
    movies: {},
    isEmpty: true, // 用于判断movies是不是空的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const category = options.category;
    this.setData({
      navigateTitle: category,
    });

    let dataUrl = '';
    switch (category) {
      case '正在热映':
        dataUrl = `${app.globalData.g_dobanBaseUrl}/v2/movie/in_theaters`;
        break;
      case '即将上映':
        dataUrl = `${app.globalData.g_dobanBaseUrl}/v2/movie/coming_soon`;
        break;
      case 'Top250':
        dataUrl = `${app.globalData.g_dobanBaseUrl}/v2/movie/top250`
        break;
    }

    this.setData({
      requestUrl: dataUrl,
    })
    util.http(dataUrl, this.processData);
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },

  /**
   * 处理加载数据
   */
  processData: function (data) {
    let movies = [], totalCount = 0;
    for (let idx in data.subjects) {
      let subject = data.subjects[idx];
      let title = subject.title;
      if (title.length > 6) {
        title = `${title.substring(0, 6)}...`;
      }
      let temp = {
        title: title,
        stars: util.coverToStarsArray(subject.rating.stars),
        coverageImgUrl: subject.images.large,
        movieId: subject.id,
        average: subject.rating.average,
      }
      movies.push(temp);
    }

    // 这段代码写得很好，如果绑定新加载的数据，就要和本来就有的数据合并在一起  
    let totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }

    this.setData({
      movies: totalMovies
    });

    totalCount += 20;
    this.setData({
      totalCount: totalCount,
    });
    wx.hideNavigationBarLoading();
  },

  /**
   * 下滑加载更多
   * 实现的思路是通过数据的start不断递增。
   */
  onScrollLower: function (event) {
    const nextUrl = `${this.data.requestUrl}?start=${this.data.totalCount}&count=20`;
    wx.showNavigationBarLoading();
    util.http(nextUrl, this.processData);
  },
  /**
   * 下拉刷新数据
   */
  onPullDownRefresh: function () {
    const nextUrl = `${this.data.requestUrl}?start=0&count=20`;
    wx.showNavigationBarLoading();
    this.data.totalCount = 0;
    this.data.movies = {};
    this.data.isEmpty = true;
    util.http(nextUrl, this.processData);
  },

  /**
 * 跳转详情页面
 */
  onMovieTap: function (event) {
    // 注意： dataset中的大写要写成小写
    wx.navigateTo({
      url: `../movie-detail/movie-detail?id=${event.currentTarget.dataset.movieid}`,
    })
  },
})