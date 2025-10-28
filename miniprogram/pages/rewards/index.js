// 奖励中心页面
Page({
  data: {
    // 用户信息
    totalScore: 1250,
    userLevel: 3,
    levelProgress: 65,
    currentTab: 'avatar',

    // 成就系统
    achievements: [
      {
        id: 1,
        name: '初学者',
        description: '完成第一次练习',
        icon: '../../images/icons/avatar.png',
        unlocked: true,
        reward: 10
      },
      {
        id: 2,
        name: '坚持不懈',
        description: '连续学习7天',
        icon: '../../images/icons/avatar.png',
        unlocked: true,
        reward: 50
      },
      {
        id: 3,
        name: '发音达人',
        description: '获得90分以上',
        icon: '../../images/icons/avatar.png',
        unlocked: false,
        reward: 100
      },
      {
        id: 4,
        name: '完美主义',
        description: '获得100分',
        icon: '../../images/icons/avatar.png',
        unlocked: false,
        reward: 200
      },
      {
        id: 5,
        name: '社交达人',
        description: '邀请5个好友',
        icon: '../../images/icons/avatar.png',
        unlocked: false,
        reward: 150
      },
      {
        id: 6,
        name: '学习狂人',
        description: '完成100次练习',
        icon: '../../images/icons/avatar.png',
        unlocked: false,
        reward: 300
      }
    ],

    // 头像框
    avatarFrames: [
      {
        id: 1,
        name: '经典边框',
        description: '简约大方的经典设计',
        preview: '../../images/icons/avatar.png',
        price: 100,
        owned: true
      },
      {
        id: 2,
        name: '金色边框',
        description: '闪耀的金色装饰',
        preview: '../../images/icons/avatar.png',
        price: 300,
        owned: false
      },
      {
        id: 3,
        name: '彩虹边框',
        description: '多彩的彩虹效果',
        preview: '../../images/icons/avatar.png',
        price: 500,
        owned: false
      },
      {
        id: 4,
        name: '钻石边框',
        description: '奢华的钻石装饰',
        preview: '../../images/icons/avatar.png',
        price: 1000,
        owned: false
      }
    ],

    // 背景
    backgrounds: [
      {
        id: 1,
        name: '默认背景',
        description: '清新的渐变背景',
        preview: '../../images/icons/avatar.png',
        price: 0,
        owned: true
      },
      {
        id: 2,
        name: '星空背景',
        description: '梦幻的星空主题',
        preview: '../../images/icons/avatar.png',
        price: 200,
        owned: false
      },
      {
        id: 3,
        name: '海洋背景',
        description: '宁静的海洋主题',
        preview: '../../images/icons/avatar.png',
        price: 400,
        owned: false
      },
      {
        id: 4,
        name: '森林背景',
        description: '自然的森林主题',
        preview: '../../images/icons/avatar.png',
        price: 600,
        owned: false
      }
    ],

    // 特效
    effects: [
      {
        id: 1,
        name: '无特效',
        description: '简洁的默认效果',
        preview: '../../images/icons/avatar.png',
        price: 0,
        owned: true
      },
      {
        id: 2,
        name: '闪烁特效',
        description: '闪亮的星星效果',
        preview: '../../images/icons/avatar.png',
        price: 150,
        owned: false
      },
      {
        id: 3,
        name: '粒子特效',
        description: '动态的粒子效果',
        preview: '../../images/icons/avatar.png',
        price: 300,
        owned: false
      },
      {
        id: 4,
        name: '光环特效',
        description: '神秘的光环效果',
        preview: '../../images/icons/avatar.png',
        price: 500,
        owned: false
      }
    ],

    // 积分获取方式
    scoreWays: [
      {
        id: 1,
        icon: '🎤',
        name: '完成练习',
        description: '每次完成发音练习',
        reward: '10-20'
      },
      {
        id: 2,
        icon: '⭐',
        name: '获得高分',
        description: '练习得分90分以上',
        reward: '50'
      },
      {
        id: 3,
        icon: '📅',
        name: '连续学习',
        description: '每天坚持学习',
        reward: '30'
      },
      {
        id: 4,
        icon: '👥',
        name: '邀请好友',
        description: '邀请好友一起学习',
        reward: '100'
      },
      {
        id: 5,
        icon: '🏆',
        name: '完成成就',
        description: '解锁各种成就徽章',
        reward: '10-300'
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
      totalScore: userData.totalScore || 0,
      userLevel: userData.userLevel || 1,
      levelProgress: userData.levelProgress || 0
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 切换标签页
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
  },

  // 查看成就详情
  viewAchievement(e) {
    const id = e.currentTarget.dataset.id;
    const achievement = this.data.achievements.find(item => item.id === id);
    
    if (achievement.unlocked) {
      wx.showModal({
        title: achievement.name,
        content: achievement.description + '\n\n奖励: ' + achievement.reward + '积分',
        showCancel: false
      });
    } else {
      wx.showModal({
        title: achievement.name,
        content: '尚未解锁\n\n' + achievement.description + '\n\n奖励: ' + achievement.reward + '积分',
        showCancel: false
      });
    }
  },

  // 购买物品
  buyItem(e) {
    const item = e.currentTarget.dataset.item;
    
    if (item.owned) {
      wx.showToast({
        title: '已拥有该物品',
        icon: 'none'
      });
      return;
    }

    if (this.data.totalScore < item.price) {
      wx.showModal({
        title: '积分不足',
        content: '您的积分不足，请通过练习获取更多积分',
        showCancel: false
      });
      return;
    }

    wx.showModal({
      title: '确认购买',
      content: `确定要花费 ${item.price} 积分购买 ${item.name} 吗？`,
      success: (res) => {
        if (res.confirm) {
          this.purchaseItem(item);
        }
      }
    });
  },

  // 执行购买
  purchaseItem(item) {
    // 扣除积分
    const newScore = this.data.totalScore - item.price;
    
    // 更新物品状态
    const itemType = this.data.currentTab;
    const items = this.data[itemType + 's'];
    const itemIndex = items.findIndex(i => i.id === item.id);
    
    if (itemIndex !== -1) {
      items[itemIndex].owned = true;
      this.setData({
        totalScore: newScore,
        [itemType + 's']: items
      });

      // 保存到本地存储
      this.saveUserData();

      wx.showToast({
        title: '购买成功',
        icon: 'success'
      });
    }
  },

  // 保存用户数据
  saveUserData() {
    const userData = wx.getStorageSync('userData') || {};
    userData.totalScore = this.data.totalScore;
    userData.userLevel = this.data.userLevel;
    userData.levelProgress = this.data.levelProgress;
    
    // 保存物品拥有状态
    userData.avatarFrames = this.data.avatarFrames;
    userData.backgrounds = this.data.backgrounds;
    userData.effects = this.data.effects;
    
    wx.setStorageSync('userData', userData);
  }
});
