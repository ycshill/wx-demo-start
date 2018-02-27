var app = getApp();
var util = require('../../utils/util.js');

Page({

  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow: true,
    searchPanelShow: false,
    searchResult: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('电影');
    var inTheatersUrl = `${app.globalData.g_dobanBaseUrl}/v2/movie/in_theaters?start=0&count=3`;
    var comingSoonUrl = `${app.globalData.g_dobanBaseUrl}/v2/movie/coming_soon?start=0&count=3`;
    var top250 = `${app.globalData.g_dobanBaseUrl}/v2/movie/top250?start=0&count=3`;

    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映');
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映');
    this.getMovieListData(top250, 'top250', 'Top250');
  },

  getMovieListData(url, setedKey, categoryTitle) {
    const that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('成功');
        that.processData(res.data, setedKey, categoryTitle);
      },
      fail: function (exp) {
        console.log(exp);
        console.log('失败！');
      }
    })
  },

  processData: function (moviesData, setedKey, categoryTitle) {
    let movies = [];
    for (let idx in moviesData.subjects) {
      let subject = moviesData.subjects[idx];
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

    // 利用对象的动态属性
    var readyData = {};
    readyData[setedKey] = {
      movies: movies,
      categoryTitle: categoryTitle,
    };

    this.setData(readyData);
  },
  onMoreTap(event) {
    wx.navigateTo({
      url: `./more-movie/more-movie?category=${event.currentTarget.dataset.category}`,
    })
  },

  /**
   * 搜索框获取焦点
   */
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true,
    });
  },
  /**
   * 搜索页面点击取消
   */
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
    });
  },
  /**
   * 搜索内容
   */
  onBindConfirm: function (event) {
    // 获取输入框的输入的值
    const text = event.detail.value;
    const searchUrl = `${app.globalData.g_dobanBaseUrl}/v2/movie/search?q=${text}`;
    this.getMovieListData(searchUrl, 'searchResult', '');
  },
  
  /**
  * 跳转详情页面
  */
  onMovieTap: function (event) {
    // 注意： dataset中的大写要写成小写
    wx.navigateTo({
      url: `./movie-detail/movie-detail?id=${event.currentTarget.dataset.movieid}`,
    })
  },
})