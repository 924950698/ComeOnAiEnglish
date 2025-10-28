// 练习页面
Page({
  data: {
    // 练习信息
    practiceTitle: '发音练习',
    practiceId: '',
    currentIndex: 0,
    totalCount: 5,
    
    // 当前练习内容
    currentText: '',
    currentTranslation: '',
    
    // 录音状态
    isRecording: false,
    hasRecorded: false,
    recordingPath: '',
    
    // 评分结果
    showScore: false,
    score: 0,
    scoreLevel: '',
    accuracy: 0,
    intonation: 0,
    rhythm: 0,
    feedback: '',
    
    // 录音管理器
    recorderManager: null,
    
    // 练习数据
    practiceData: []
  },

  onLoad(options) {
    const id = options.id || '1';
    this.setData({
      practiceId: id,
      practiceTitle: this.getPracticeTitle(id)
    });
    
    this.initRecorder();
    this.loadPracticeData();
  },

  // 获取练习标题
  getPracticeTitle(id) {
    const titles = {
      '1': '基础音标练习',
      '2': '日常对话练习',
      '3': '商务英语发音',
      '4': '发音练习'
    };
    return titles[id] || '发音练习';
  },

  // 初始化录音管理器
  initRecorder() {
    this.setData({
      recorderManager: wx.getRecorderManager()
    });

    // 录音开始
    this.data.recorderManager.onStart(() => {
      console.log('录音开始');
    });

    // 录音结束
    this.data.recorderManager.onStop((res) => {
      console.log('录音结束', res);
      this.setData({
        hasRecorded: true,
        recordingPath: res.tempFilePath
      });
    });

    // 录音错误
    this.data.recorderManager.onError((err) => {
      console.error('录音错误', err);
      wx.showToast({
        title: '录音失败',
        icon: 'error'
      });
    });
  },

  // 加载练习数据
  loadPracticeData() {
    const practiceData = [
      {
        text: 'Hello, how are you today?',
        translation: '你好，你今天怎么样？'
      },
      {
        text: 'I am fine, thank you.',
        translation: '我很好，谢谢你。'
      },
      {
        text: 'What is your favorite color?',
        translation: '你最喜欢的颜色是什么？'
      },
      {
        text: 'I like blue very much.',
        translation: '我非常喜欢蓝色。'
      },
      {
        text: 'Nice to meet you.',
        translation: '很高兴认识你。'
      }
    ];

    this.setData({
      practiceData: practiceData,
      currentText: practiceData[0].text,
      currentTranslation: practiceData[0].translation
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 切换录音状态
  toggleRecording() {
    if (this.data.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  },

  // 开始录音
  startRecording() {
    this.data.recorderManager.start({
      duration: 10000, // 最长录音时间10秒
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'mp3'
    });

    this.setData({
      isRecording: true,
      showScore: false
    });
  },

  // 停止录音
  stopRecording() {
    this.data.recorderManager.stop();
    this.setData({
      isRecording: false
    });
  },

  // 播放录音
  playRecording() {
    if (!this.data.recordingPath) {
      wx.showToast({
        title: '没有录音文件',
        icon: 'error'
      });
      return;
    }

    wx.playVoice({
      filePath: this.data.recordingPath,
      success: () => {
        console.log('播放成功');
      },
      fail: (err) => {
        console.error('播放失败', err);
        wx.showToast({
          title: '播放失败',
          icon: 'error'
        });
      }
    });
  },

  // 获取评分
  getScore() {
    if (!this.data.recordingPath) {
      wx.showToast({
        title: '请先录音',
        icon: 'error'
      });
      return;
    }

    wx.showLoading({
      title: 'AI评分中...'
    });

    // 模拟AI评分过程
    setTimeout(() => {
      this.simulateAIScoring();
      wx.hideLoading();
    }, 2000);
  },

  // 模拟AI评分
  simulateAIScoring() {
    const score = Math.floor(Math.random() * 30) + 70; // 70-100分
    const accuracy = Math.floor(Math.random() * 20) + 75; // 75-95%
    const intonation = Math.floor(Math.random() * 20) + 70; // 70-90%
    const rhythm = Math.floor(Math.random() * 20) + 75; // 75-95%

    let scoreLevel = '';
    let feedback = '';

    if (score >= 90) {
      scoreLevel = '优秀';
      feedback = '发音非常标准！继续保持，你的英语发音已经很棒了。';
    } else if (score >= 80) {
      scoreLevel = '良好';
      feedback = '发音不错，建议多练习语调变化，让表达更自然。';
    } else if (score >= 70) {
      scoreLevel = '一般';
      feedback = '发音基本正确，建议多听标准发音，注意单词重音。';
    } else {
      scoreLevel = '需要改进';
      feedback = '建议从基础音标开始练习，多听多模仿标准发音。';
    }

    this.setData({
      showScore: true,
      score: score,
      scoreLevel: scoreLevel,
      accuracy: accuracy,
      intonation: intonation,
      rhythm: rhythm,
      feedback: feedback
    });

    // 保存练习记录
    this.savePracticeRecord(score);
  },

  // 保存练习记录
  savePracticeRecord(score) {
    const practiceRecord = {
      text: this.data.currentText,
      score: score,
      timestamp: new Date().getTime()
    };

    // 获取历史记录
    let history = wx.getStorageSync('practiceHistory') || [];
    history.push(practiceRecord);

    // 保存到本地存储
    wx.setStorageSync('practiceHistory', history);

    // 更新用户数据
    this.updateUserData(score);
  },

  // 更新用户数据
  updateUserData(score) {
    let userData = wx.getStorageSync('userData') || {};
    
    // 更新统计数据
    userData.totalPractice = (userData.totalPractice || 0) + 1;
    userData.todayPractice = (userData.todayPractice || 0) + 1;
    
    // 更新平均分
    const history = wx.getStorageSync('practiceHistory') || [];
    const scores = history.map(record => record.score);
    userData.avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // 更新最高分
    if (score > (userData.bestScore || 0)) {
      userData.bestScore = score;
    }

    // 更新积分
    userData.totalScore = (userData.totalScore || 0) + Math.floor(score / 10);

    // 保存用户数据
    wx.setStorageSync('userData', userData);
  },

  // 重新录音
  retryRecording() {
    this.setData({
      hasRecorded: false,
      recordingPath: '',
      showScore: false
    });
  },

  // 查看详细分析
  viewAnalysis() {
    wx.navigateTo({
      url: '/pages/analysis/index?text=' + encodeURIComponent(this.data.currentText) + '&score=' + this.data.score
    });
  },

  // 继续练习
  continuePractice() {
    const nextIndex = this.data.currentIndex + 1;
    
    if (nextIndex >= this.data.totalCount) {
      // 练习完成
      wx.showModal({
        title: '练习完成',
        content: '恭喜你完成了所有练习！',
        showCancel: false,
        success: () => {
          wx.navigateBack();
        }
      });
      return;
    }

    // 切换到下一题
    const nextText = this.data.practiceData[nextIndex];
    this.setData({
      currentIndex: nextIndex,
      currentText: nextText.text,
      currentTranslation: nextText.translation,
      hasRecorded: false,
      recordingPath: '',
      showScore: false
    });
  },

  // 上一题
  prevPractice() {
    if (this.data.currentIndex > 0) {
      const prevIndex = this.data.currentIndex - 1;
      const prevText = this.data.practiceData[prevIndex];
      this.setData({
        currentIndex: prevIndex,
        currentText: prevText.text,
        currentTranslation: prevText.translation,
        hasRecorded: false,
        recordingPath: '',
        showScore: false
      });
    }
  },

  // 下一题
  nextPractice() {
    this.continuePractice();
  },

  // 完成练习
  finishPractice() {
    wx.showModal({
      title: '完成练习',
      content: '恭喜你完成了所有练习！',
      showCancel: false,
      success: () => {
        wx.navigateBack();
      }
    });
  }
});