// index.js
Page({
  data: {
    // 用户信息
    userName: '',
    userLevel: 1,
    totalScore: 1250,
    studyDays: 7,
    
    // 练习进度
    practiceProgress: 65,
    todayPractice: 3,
    
    // 奖励系统
    recentBadges: [
      { id: 1, icon: '../../images/icons/avatar.png' },
      { id: 2, icon: '../../images/icons/avatar.png' }
    ],
    inviteCount: 2,
    
    // 今日推荐
    dailyRecommend: [
      {
        id: 1,
        icon: '🎵',
        title: '基础音标练习',
        description: '掌握48个国际音标',
        difficulty: '初级',
        score: 85
      },
      {
        id: 2,
        icon: '🗣️',
        title: '日常对话练习',
        description: '提升口语表达能力',
        difficulty: '中级',
        score: 92
      },
      {
        id: 3,
        icon: '📚',
        title: '商务英语发音',
        description: '专业场景发音训练',
        difficulty: '高级',
        score: 78
      }
    ],
    
    // 学习统计
    totalPractice: 156,
    avgScore: 82,
    bestScore: 95,
    
    // 云开发相关
    haveCreateCollection: false,
    title: "",
    content: ""
  },

  // 页面加载
  onLoad() {
    this.loadUserData();
    this.loadDailyRecommend();
  },

  // 加载用户数据
  loadUserData() {
    // 从本地存储获取用户数据
    const userData = wx.getStorageSync('userData') || {};
    this.setData({
      userName: userData.userName || '',
      userLevel: userData.userLevel || 1,
      totalScore: userData.totalScore || 0,
      studyDays: userData.studyDays || 0,
      totalPractice: userData.totalPractice || 0,
      avgScore: userData.avgScore || 0,
      bestScore: userData.bestScore || 0,
      practiceProgress: userData.practiceProgress || 0,
      todayPractice: userData.todayPractice || 0,
      inviteCount: userData.inviteCount || 0
    });
  },

  // 加载今日推荐
  loadDailyRecommend() {
    // 模拟从服务器获取推荐内容
    const recommend = [
      {
        id: 1,
        icon: '🎵',
        title: '基础音标练习',
        description: '掌握48个国际音标',
        difficulty: '初级',
        score: 85
      },
      {
        id: 2,
        icon: '🗣️',
        title: '日常对话练习',
        description: '提升口语表达能力',
        difficulty: '中级',
        score: 92
      },
      {
        id: 3,
        icon: '📚',
        title: '商务英语发音',
        description: '专业场景发音训练',
        difficulty: '高级',
        score: 78
      }
    ];
    this.setData({ dailyRecommend: recommend });
  },

  // 开始录音
  startRecording() {
    wx.navigateTo({
      url: '/pages/recording/index'
    });
  },

  // 开始练习
  startPractice(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/practice/index?id=${id}`
    });
  },

  // 页面跳转
  goToPage(e) {
    const page = e.currentTarget.dataset.page;
    const pages = {
      'practice': '/pages/practice/index',
      'analysis': '/pages/analysis/index',
      'rewards': '/pages/rewards/index',
      'social': '/pages/social/index'
    };
    
    if (pages[page]) {
      wx.navigateTo({
        url: pages[page]
      });
    }
  },

  // 旧方法保留（云开发相关）
  onClickPowerInfo(e) {
    const app = getApp()
    if(!app.globalData.env) {
      wx.showModal({
        title: '提示',
        content: '请在 `miniprogram/app.js` 中正确配置 `env` 参数'
      })
      return 
    }
    console.log("click e", e)
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    const selectedItem = powerList[index];
    console.log("selectedItem", selectedItem)
    if (selectedItem.link) {
      wx.navigateTo({
        url: `../web/index?url=${selectedItem.link}&title=${selectedItem.title}`,
      });
    } else if (selectedItem.type) {
      console.log("selectedItem", selectedItem)
      wx.navigateTo({
        url: `/pages/example/index?envId=${this.data.selectedEnv?.envId}&type=${selectedItem.type}`,
      });
    } else if (selectedItem.page) {
      wx.navigateTo({
        url: `/pages/${selectedItem.page}/index`,
      });
    } else if (
      selectedItem.title === '数据库' &&
      !this.data.haveCreateCollection
    ) {
      this.onClickDatabase(powerList,selectedItem);
    } else {
      selectedItem.showItem = !selectedItem.showItem;
      this.setData({
        powerList,
      });
    }
  },

  jumpPage(e) {
    const { type, page } = e.currentTarget.dataset;
    console.log("jump page", type, page)
    if (type) {
      wx.navigateTo({
        url: `/pages/example/index?envId=${this.data.selectedEnv?.envId}&type=${type}`,
      });
    } else {
      wx.navigateTo({
        url: `/pages/${page}/index?envId=${this.data.selectedEnv?.envId}`,
      });
    }
  },

  onClickDatabase(powerList,selectedItem) {
    wx.showLoading({
      title: '',
    });
    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'createCollection',
        },
      })
      .then((resp) => {
        if (resp.result.success) {
          this.setData({
            haveCreateCollection: true,
          });
        }
        selectedItem.showItem = !selectedItem.showItem;
        this.setData({
          powerList,
        });
        wx.hideLoading();
      })
      .catch((e) => {
        wx.hideLoading();
        const { errCode, errMsg } = e
        if (errMsg.includes('Environment not found')) {
          this.setData({
            showTip: true,
            title: "云开发环境未找到",
            content: "如果已经开通云开发，请检查环境ID与 `miniprogram/app.js` 中的 `env` 参数是否一致。"
          });
          return
        }
        if (errMsg.includes('FunctionName parameter could not be found')) {
          this.setData({
            showTip: true,
            title: "请上传云函数",
            content: "在'cloudfunctions/quickstartFunctions'目录右键，选择【上传并部署-云端安装依赖】，等待云函数上传完成后重试。"
          });
          return
        }
      });
  },
});
