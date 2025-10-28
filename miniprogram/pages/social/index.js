// 社交功能页面
Page({
  data: {
    // 邀请统计
    inviteCount: 2,
    inviteReward: 200,

    // 当前排行榜标签
    currentRankTab: 'weekly',

    // 好友列表
    friends: [
      {
        id: 1,
        name: '小明',
        avatar: '../../images/icons/avatar.png',
        level: 5,
        score: 2100,
        online: true
      },
      {
        id: 2,
        name: '小红',
        avatar: '../../images/icons/avatar.png',
        level: 3,
        score: 1800,
        online: false
      }
    ],

    // 排行榜数据
    rankingList: [
      {
        id: 1,
        name: '张三',
        avatar: '../../images/icons/avatar.png',
        level: 8,
        score: 3500,
        rank: 1,
        isMe: false
      },
      {
        id: 2,
        name: '李四',
        avatar: '../../images/icons/avatar.png',
        level: 7,
        score: 3200,
        rank: 2,
        isMe: false
      },
      {
        id: 3,
        name: '王五',
        avatar: '../../images/icons/avatar.png',
        level: 6,
        score: 2800,
        rank: 3,
        isMe: false
      },
      {
        id: 4,
        name: '我',
        avatar: '../../images/icons/avatar.png',
        level: 3,
        score: 1250,
        rank: 4,
        isMe: true
      }
    ],

    // 挑战记录
    challenges: [
      {
        id: 1,
        type: '发音挑战',
        opponent: '小明',
        time: '2小时前',
        result: 'win',
        resultText: '胜利',
        myScore: 85,
        opponentScore: 78
      },
      {
        id: 2,
        type: '速度挑战',
        opponent: '小红',
        time: '1天前',
        result: 'lose',
        resultText: '失败',
        myScore: 72,
        opponentScore: 88
      }
    ],

    // 每日任务
    dailyTasks: [
      {
        id: 1,
        icon: '🎤',
        name: '完成3次练习',
        description: '每天至少完成3次发音练习',
        current: 2,
        target: 3,
        progress: 67,
        reward: 30,
        completed: false
      },
      {
        id: 2,
        icon: '⭐',
        name: '获得高分',
        description: '获得一次90分以上的练习',
        current: 0,
        target: 1,
        progress: 0,
        reward: 50,
        completed: false
      },
      {
        id: 3,
        icon: '👥',
        name: '邀请好友',
        description: '邀请1个新好友加入',
        current: 0,
        target: 1,
        progress: 0,
        reward: 100,
        completed: false
      },
      {
        id: 4,
        icon: '🏆',
        name: '挑战好友',
        description: '与好友进行1次挑战',
        current: 1,
        target: 1,
        progress: 100,
        reward: 40,
        completed: true
      }
    ]
  },

  onLoad() {
    this.loadUserData();
  },

  // 加载用户数据
  loadUserData() {
    const userData = wx.getStorageSync('userData') || {};
    this.setData({
      inviteCount: userData.inviteCount || 0,
      inviteReward: (userData.inviteCount || 0) * 100
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 邀请好友
  inviteFriend() {
    wx.showShareMenu({
      withShareTicket: true,
      success: () => {
        wx.showToast({
          title: '请分享给好友',
          icon: 'none'
        });
      },
      fail: () => {
        wx.showModal({
          title: '邀请好友',
          content: '请将小程序分享给好友，好友通过你的分享链接加入即可获得积分奖励',
          showCancel: false
        });
      }
    });
  },

  // 挑战好友
  challengeFriend(e) {
    const friendId = e.currentTarget.dataset.id;
    const friend = this.data.friends.find(f => f.id === friendId);
    
    wx.showModal({
      title: '发起挑战',
      content: `确定要挑战 ${friend.name} 吗？`,
      success: (res) => {
        if (res.confirm) {
          this.startChallenge(friend);
        }
      }
    });
  },

  // 开始挑战
  startChallenge(friend) {
    wx.navigateTo({
      url: `/pages/challenge/index?opponentId=${friend.id}&opponentName=${friend.name}`
    });
  },

  // 切换排行榜标签
  switchRankTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentRankTab: tab
    });
    this.loadRankingData(tab);
  },

  // 加载排行榜数据
  loadRankingData(tab) {
    // 模拟不同时间段的排行榜数据
    let rankingData = [];
    
    switch(tab) {
      case 'weekly':
        rankingData = [
          { id: 1, name: '张三', avatar: '../../images/icons/avatar.png', level: 8, score: 3500, rank: 1, isMe: false },
          { id: 2, name: '李四', avatar: '../../images/icons/avatar.png', level: 7, score: 3200, rank: 2, isMe: false },
          { id: 3, name: '王五', avatar: '../../images/icons/avatar.png', level: 6, score: 2800, rank: 3, isMe: false },
          { id: 4, name: '我', avatar: '../../images/icons/avatar.png', level: 3, score: 1250, rank: 4, isMe: true }
        ];
        break;
      case 'monthly':
        rankingData = [
          { id: 1, name: '赵六', avatar: '../../images/icons/avatar.png', level: 9, score: 4500, rank: 1, isMe: false },
          { id: 2, name: '钱七', avatar: '../../images/icons/avatar.png', level: 8, score: 4200, rank: 2, isMe: false },
          { id: 3, name: '孙八', avatar: '../../images/icons/avatar.png', level: 7, score: 3800, rank: 3, isMe: false },
          { id: 4, name: '我', avatar: '../../images/icons/avatar.png', level: 3, score: 1250, rank: 8, isMe: true }
        ];
        break;
      case 'all':
        rankingData = [
          { id: 1, name: '周九', avatar: '../../images/icons/avatar.png', level: 10, score: 5500, rank: 1, isMe: false },
          { id: 2, name: '吴十', avatar: '../../images/icons/avatar.png', level: 9, score: 5200, rank: 2, isMe: false },
          { id: 3, name: '郑十一', avatar: '../../images/icons/avatar.png', level: 9, score: 4800, rank: 3, isMe: false },
          { id: 4, name: '我', avatar: '../../images/icons/avatar.png', level: 3, score: 1250, rank: 15, isMe: true }
        ];
        break;
    }

    this.setData({
      rankingList: rankingData
    });
  }
});
