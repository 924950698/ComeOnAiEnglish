// 发音分析页面
Page({
  data: {
    // 练习内容
    practiceText: '',
    overallScore: 0,
    scoreLevel: '',
    scoreFeedback: '',

    // 详细分析
    accuracyScore: 0,
    intonationScore: 0,
    rhythmScore: 0,
    fluencyScore: 0,

    // 发音准确度详情
    accuracyDetails: [],

    // 各项反馈
    intonationFeedback: '',
    rhythmFeedback: '',
    fluencyFeedback: '',

    // 改进建议
    suggestions: [],

    // 练习建议
    practiceSuggestions: []
  },

  onLoad(options) {
    const text = decodeURIComponent(options.text || '');
    const score = parseInt(options.score || 0);
    
    this.setData({
      practiceText: text,
      overallScore: score
    });

    this.generateAnalysis(score);
  },

  // 生成分析结果
  generateAnalysis(score) {
    // 模拟AI分析结果
    const analysis = this.simulateAIAnalysis(score);
    
    this.setData({
      ...analysis
    });
  },

  // 模拟AI分析
  simulateAIAnalysis(score) {
    // 根据总分计算各项分数
    const accuracyScore = Math.max(60, score - 10 + Math.floor(Math.random() * 20));
    const intonationScore = Math.max(60, score - 5 + Math.floor(Math.random() * 15));
    const rhythmScore = Math.max(60, score - 8 + Math.floor(Math.random() * 18));
    const fluencyScore = Math.max(60, score - 12 + Math.floor(Math.random() * 22));

    // 生成等级和反馈
    let scoreLevel = '';
    let scoreFeedback = '';
    
    if (score >= 90) {
      scoreLevel = '优秀';
      scoreFeedback = '发音非常标准！继续保持，你的英语发音已经很棒了。';
    } else if (score >= 80) {
      scoreLevel = '良好';
      scoreFeedback = '发音不错，建议多练习语调变化，让表达更自然。';
    } else if (score >= 70) {
      scoreLevel = '一般';
      scoreFeedback = '发音基本正确，建议多听标准发音，注意单词重音。';
    } else {
      scoreLevel = '需要改进';
      scoreFeedback = '建议从基础音标开始练习，多听多模仿标准发音。';
    }

    // 生成发音准确度详情
    const words = this.data.practiceText.split(' ');
    const accuracyDetails = words.map((word, index) => {
      const random = Math.random();
      let status = 'correct';
      let statusText = '正确';
      
      if (random < 0.2) {
        status = 'wrong';
        statusText = '错误';
      } else if (random < 0.4) {
        status = 'partial';
        statusText = '部分正确';
      }
      
      return {
        id: index,
        word: word,
        status: status,
        statusText: statusText
      };
    });

    // 生成各项反馈
    const intonationFeedback = this.getIntonationFeedback(intonationScore);
    const rhythmFeedback = this.getRhythmFeedback(rhythmScore);
    const fluencyFeedback = this.getFluencyFeedback(fluencyScore);

    // 生成改进建议
    const suggestions = this.generateSuggestions(score, accuracyScore, intonationScore, rhythmScore, fluencyScore);

    // 生成练习建议
    const practiceSuggestions = this.generatePracticeSuggestions(score);

    return {
      scoreLevel,
      scoreFeedback,
      accuracyScore,
      intonationScore,
      rhythmScore,
      fluencyScore,
      accuracyDetails,
      intonationFeedback,
      rhythmFeedback,
      fluencyFeedback,
      suggestions,
      practiceSuggestions
    };
  },

  // 语调反馈
  getIntonationFeedback(score) {
    if (score >= 90) {
      return '语调变化自然，重音把握准确，语音抑扬顿挫很好。';
    } else if (score >= 80) {
      return '语调基本正确，建议多练习疑问句和感叹句的语调变化。';
    } else if (score >= 70) {
      return '语调需要改进，注意句子末尾的语调变化，多听标准发音。';
    } else {
      return '语调问题较多，建议从基础语调开始练习，多模仿标准发音。';
    }
  },

  // 节奏反馈
  getRhythmFeedback(score) {
    if (score >= 90) {
      return '语速节奏把握得很好，停顿和连读都很自然。';
    } else if (score >= 80) {
      return '节奏基本正确，建议多练习连读和弱读。';
    } else if (score >= 70) {
      return '节奏需要改进，注意单词间的停顿和连读。';
    } else {
      return '节奏问题较多，建议放慢语速，多练习基础节奏。';
    }
  },

  // 流利度反馈
  getFluencyFeedback(score) {
    if (score >= 90) {
      return '表达非常流利，几乎没有停顿和重复。';
    } else if (score >= 80) {
      return '表达比较流利，偶尔有停顿但不影响理解。';
    } else if (score >= 70) {
      return '流利度一般，建议多练习，减少不必要的停顿。';
    } else {
      return '流利度需要提高，建议多练习，增强自信心。';
    }
  },

  // 生成改进建议
  generateSuggestions(overallScore, accuracyScore, intonationScore, rhythmScore, fluencyScore) {
    const suggestions = [];

    if (accuracyScore < 80) {
      suggestions.push({
        id: 1,
        icon: '🎯',
        title: '提高发音准确度',
        description: '多听标准发音，注意单词的每个音素，可以放慢语速练习。'
      });
    }

    if (intonationScore < 80) {
      suggestions.push({
        id: 2,
        icon: '🎵',
        title: '改善语音语调',
        description: '多练习疑问句和感叹句，注意句子重音和语调变化。'
      });
    }

    if (rhythmScore < 80) {
      suggestions.push({
        id: 3,
        icon: '⏱️',
        title: '优化语速节奏',
        description: '练习连读和弱读，注意单词间的停顿和连接。'
      });
    }

    if (fluencyScore < 80) {
      suggestions.push({
        id: 4,
        icon: '💬',
        title: '提升表达流利度',
        description: '多进行口语练习，减少停顿和重复，增强自信心。'
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        id: 5,
        icon: '🌟',
        title: '继续保持',
        description: '你的发音已经很棒了！继续保持练习，可以挑战更高难度的内容。'
      });
    }

    return suggestions;
  },

  // 生成练习建议
  generatePracticeSuggestions(score) {
    const suggestions = [];

    if (score < 70) {
      suggestions.push({
        id: 1,
        icon: '🔤',
        title: '基础音标练习',
        description: '从48个国际音标开始，打好发音基础',
        difficulty: '初级'
      });
    }

    if (score < 85) {
      suggestions.push({
        id: 2,
        icon: '📚',
        title: '单词发音练习',
        description: '练习常用单词的标准发音',
        difficulty: '初级'
      });
    }

    suggestions.push({
      id: 3,
      icon: '🗣️',
      title: '句子语调练习',
      description: '练习不同句型的语调变化',
      difficulty: '中级'
    });

    suggestions.push({
      id: 4,
      icon: '💼',
      title: '商务英语发音',
      description: '专业场景的发音训练',
      difficulty: '高级'
    });

    return suggestions;
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 开始练习
  startPractice(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/practice/index?id=${id}`
    });
  },

  // 重新练习
  retryPractice() {
    wx.navigateBack();
  },

  // 下一题
  nextPractice() {
    wx.navigateBack();
  }
});
