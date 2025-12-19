// Plan creation flow
let planData = {
  region: null,
  regionId: null,
  days: null,
  nights: null,
  who: null,
  styles: []
};

// Chat mode data
let chatData = {
  region: null,
  days: null,
  nights: null,
  who: null,
  styles: []
};

// Step navigation
function goToStep(stepNum) {
  document.querySelectorAll('.plan-step').forEach(step => {
    step.classList.remove('active');
  });
  const stepId = stepNum === 0 ? 'step0' : stepNum === 'Loading' ? 'stepLoading' : stepNum === 'Chat' ? 'stepChat' : `step${stepNum}`;
  document.getElementById(stepId).classList.add('active');
}

// Step 0: Method Selection
document.querySelectorAll('.method-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.method-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    
    const method = card.getAttribute('data-method');
    setTimeout(() => {
      if (method === 'guided') {
        goToStep(1);
      } else if (method === 'chat') {
        goToStep('Chat');
      }
    }, 300);
  });
});

// Step 1: Region selection
document.querySelectorAll('.region-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    planData.region = btn.getAttribute('data-region');
    planData.regionId = btn.getAttribute('data-region-id');
    document.getElementById('nextStep1').disabled = false;
  });
});

document.getElementById('nextStep1').addEventListener('click', () => {
  goToStep(2);
});

// Step 2: Period selection
document.querySelectorAll('.period-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    planData.days = parseInt(btn.getAttribute('data-days'));
    planData.nights = parseInt(btn.getAttribute('data-nights'));
    document.getElementById('nextStep2').disabled = false;
    
    // Hide custom input when selecting preset
    document.getElementById('customPeriodInput').style.display = 'none';
    document.getElementById('customPeriodBtn').classList.remove('active');
  });
});

// Custom period input
const customPeriodBtn = document.getElementById('customPeriodBtn');
const customPeriodInput = document.getElementById('customPeriodInput');
const customNights = document.getElementById('customNights');
const customDays = document.getElementById('customDays');
const applyCustomPeriod = document.getElementById('applyCustomPeriod');

customPeriodBtn.addEventListener('click', () => {
  // Remove active from all preset buttons
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  
  // Toggle custom input
  const isVisible = customPeriodInput.style.display !== 'none';
  if (isVisible) {
    customPeriodInput.style.display = 'none';
    customPeriodBtn.classList.remove('active');
  } else {
    customPeriodInput.style.display = 'block';
    customPeriodBtn.classList.add('active');
    // Reset values
    customNights.value = '';
    customDays.value = '';
  }
});

// Auto-calculate days when nights is entered
customNights.addEventListener('input', (e) => {
  const nights = parseInt(e.target.value);
  if (nights >= 6 && !isNaN(nights)) {
    customDays.value = nights + 1;
  }
});

// Auto-calculate nights when days is entered
customDays.addEventListener('input', (e) => {
  const days = parseInt(e.target.value);
  if (days >= 7 && !isNaN(days)) {
    customNights.value = days - 1;
  }
});

applyCustomPeriod.addEventListener('click', () => {
  const nights = parseInt(customNights.value);
  const days = parseInt(customDays.value);
  
  if (nights >= 6 && days >= 7 && days === nights + 1) {
    planData.days = days;
    planData.nights = nights;
    document.getElementById('nextStep2').disabled = false;
    
    // Show success feedback
    applyCustomPeriod.textContent = '적용 완료!';
    applyCustomPeriod.style.background = 'linear-gradient(135deg, #34a853, #2d8f47)';
    setTimeout(() => {
      applyCustomPeriod.textContent = '적용하기';
      applyCustomPeriod.style.background = '';
    }, 1500);
  } else {
    alert('올바른 기간을 입력해주세요.\n6박 7일 이상, 일수는 박수+1이어야 합니다.');
  }
});

document.getElementById('nextStep2').addEventListener('click', () => {
  goToStep(3);
});

// Step 3: Who selection
document.querySelectorAll('.who-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.who-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    planData.who = btn.getAttribute('data-who');
    document.getElementById('nextStep3').disabled = false;
  });
});

document.getElementById('nextStep3').addEventListener('click', () => {
  goToStep(4);
});

// Step 4: Style selection (multiple)
document.querySelectorAll('.style-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    const style = btn.getAttribute('data-style');
    if (btn.classList.contains('active')) {
      if (!planData.styles.includes(style)) {
        planData.styles.push(style);
      }
    } else {
      planData.styles = planData.styles.filter(s => s !== style);
    }
    document.getElementById('nextStep4').disabled = planData.styles.length === 0;
  });
});

document.getElementById('nextStep4').addEventListener('click', () => {
  updateSummary();
  goToStep(5);
});

// Update summary
function updateSummary() {
  document.getElementById('summaryRegion').textContent = planData.region || '-';
  document.getElementById('summaryPeriod').textContent = `${planData.nights}박 ${planData.days}일` || '-';
  
  const whoMap = {
    'alone': '혼자',
    'couple': '연인',
    'friends': '친구',
    'family': '가족',
    'colleagues': '동료'
  };
  document.getElementById('summaryWho').textContent = whoMap[planData.who] || '-';
  
  const styleMap = {
    'activity': '체험·액티비티',
    'hotplace': 'SNS 핫플레이스',
    'nature': '자연과 함께',
    'landmark': '유명 관광지는 필수',
    'healing': '여유롭게 힐링',
    'culture': '문화·예술·역사',
    'local': '여행지 느낌 물씬',
    'shopping': '쇼핑은 열정적으로',
    'food': '관광보다 먹방'
  };
  document.getElementById('summaryStyle').textContent = planData.styles.map(s => styleMap[s]).join(', ') || '-';
}

// Step 5: AI Chat
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');

function addChatMessage(text, isUser = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${isUser ? 'user' : 'ai'}`;
  msgDiv.innerHTML = `
    ${!isUser ? '<div class="msg-avatar-small">트리피</div>' : ''}
    <div class="msg-bubble">${text}</div>
  `;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendChatBtn.addEventListener('click', () => {
  if (chatInput.value.trim()) {
    addChatMessage(chatInput.value, true);
    chatInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
      addChatMessage('알겠어! 그 정보도 반영해서 계획 짜줄게😊');
    }, 500);
  }
});

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendChatBtn.click();
  }
});

// Generate plan (Guided mode)
document.getElementById('generatePlanBtn').addEventListener('click', () => {
  goToStep('Loading');
  
  // Simulate plan generation
  setTimeout(() => {
    // Save to localStorage
    const tripId = 'trip_' + Date.now();
    const tripData = {
      id: tripId,
      ...planData,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(tripId, JSON.stringify(tripData));
    localStorage.setItem('currentTrip', tripId);
    
    // Redirect to schedule page
    window.location.href = 'schedule.html';
  }, 2000);
});

// Chat Mode Functions
const chatMessagesFull = document.getElementById('chatMessagesFull');
const chatInputFull = document.getElementById('chatInputFull');
const sendChatBtnFull = document.getElementById('sendChatBtnFull');
const generatePlanFromChatBtn = document.getElementById('generatePlanFromChatBtn');

function addChatMessageFull(text, isUser = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${isUser ? 'user' : 'ai'}`;
  msgDiv.innerHTML = `
    ${!isUser ? '<div class="msg-avatar">트리피</div>' : ''}
    <div class="msg-bubble">${text}</div>
  `;
  chatMessagesFull.appendChild(msgDiv);
  chatMessagesFull.scrollTop = chatMessagesFull.scrollHeight;
}

// Parse user message and extract information
function parseChatMessage(message) {
  const lowerMsg = message.toLowerCase();
  let updated = false;
  
  // Extract region
  const regions = {
    '도쿄': 'tokyo', '오사카': 'osaka', '후쿠오카': 'fukuoka', '오키나와': 'okinawa', '삿포로': 'sapporo',
    '제주': 'jeju', '부산': 'busan', '경주': 'gyeongju', '강릉': 'gangneung', '속초': 'gangneung', '전주': 'jeonju',
    '홍콩': 'hongkong', '타이베이': 'taipei', '상하이': 'shanghai', '베이징': 'beijing',
    '방콕': 'bangkok', '다낭': 'danang', '푸켓': 'phuket', '싱가포르': 'singapore',
    '파리': 'paris', '로마': 'rome', '런던': 'london', '바르셀로나': 'barcelona'
  };
  
  for (const [region, id] of Object.entries(regions)) {
    if (lowerMsg.includes(region.toLowerCase())) {
      chatData.region = region;
      chatData.regionId = id;
      updated = true;
      break;
    }
  }
  
  // Extract period
  if (lowerMsg.includes('당일') || lowerMsg.includes('당일치기')) {
    chatData.days = 1;
    chatData.nights = 0;
    updated = true;
  } else if (lowerMsg.includes('1박') || lowerMsg.includes('하루')) {
    chatData.days = 2;
    chatData.nights = 1;
    updated = true;
  } else if (lowerMsg.includes('2박') || lowerMsg.includes('이틀')) {
    chatData.days = 3;
    chatData.nights = 2;
    updated = true;
  } else if (lowerMsg.includes('3박') || lowerMsg.includes('사흘')) {
    chatData.days = 4;
    chatData.nights = 3;
    updated = true;
  } else if (lowerMsg.includes('4박')) {
    chatData.days = 5;
    chatData.nights = 4;
    updated = true;
  } else if (lowerMsg.includes('5박')) {
    chatData.days = 6;
    chatData.nights = 5;
    updated = true;
  }
  
  // Extract who
  if (lowerMsg.includes('혼자') || lowerMsg.includes('혼행')) {
    chatData.who = 'alone';
    updated = true;
  } else if (lowerMsg.includes('연인') || lowerMsg.includes('애인') || lowerMsg.includes('여자친구') || lowerMsg.includes('남자친구')) {
    chatData.who = 'couple';
    updated = true;
  } else if (lowerMsg.includes('친구')) {
    chatData.who = 'friends';
    updated = true;
  } else if (lowerMsg.includes('가족') || lowerMsg.includes('부모') || lowerMsg.includes('아이')) {
    chatData.who = 'family';
    updated = true;
  } else if (lowerMsg.includes('동료') || lowerMsg.includes('회사')) {
    chatData.who = 'colleagues';
    updated = true;
  }
  
  // Extract styles
  const styleKeywords = {
    'activity': ['체험', '액티비티', '활동'],
    'hotplace': ['핫플', '인스타', 'sns', '유명한'],
    'nature': ['자연', '산', '바다', '숲'],
    'landmark': ['관광지', '명소', '유명한 곳'],
    'healing': ['힐링', '휴식', '여유'],
    'culture': ['문화', '예술', '역사', '박물관'],
    'local': ['로컬', '현지', '여행지 느낌'],
    'shopping': ['쇼핑', '쇼핑몰', '마켓'],
    'food': ['먹방', '맛집', '음식', '식당']
  };
  
  for (const [style, keywords] of Object.entries(styleKeywords)) {
    if (keywords.some(keyword => lowerMsg.includes(keyword))) {
      if (!chatData.styles.includes(style)) {
        chatData.styles.push(style);
        updated = true;
      }
    }
  }
  
  return updated;
}

function updateChatInfo() {
  document.getElementById('chatRegion').textContent = chatData.region || '-';
  if (chatData.days && chatData.nights !== null) {
    document.getElementById('chatPeriod').textContent = `${chatData.nights}박 ${chatData.days}일`;
  } else {
    document.getElementById('chatPeriod').textContent = '-';
  }
  
  const whoMap = {
    'alone': '혼자',
    'couple': '연인',
    'friends': '친구',
    'family': '가족',
    'colleagues': '동료'
  };
  document.getElementById('chatWho').textContent = whoMap[chatData.who] || '-';
  
  const styleMap = {
    'activity': '체험·액티비티',
    'hotplace': 'SNS 핫플레이스',
    'nature': '자연과 함께',
    'landmark': '유명 관광지는 필수',
    'healing': '여유롭게 힐링',
    'culture': '문화·예술·역사',
    'local': '여행지 느낌 물씬',
    'shopping': '쇼핑은 열정적으로',
    'food': '관광보다 먹방'
  };
  document.getElementById('chatStyle').textContent = chatData.styles.map(s => styleMap[s]).join(', ') || '-';
  
  // Enable generate button if we have minimum required info
  const hasMinInfo = chatData.region && chatData.days && chatData.who && chatData.styles.length > 0;
  generatePlanFromChatBtn.disabled = !hasMinInfo;
}

// Chat mode message handling
sendChatBtnFull.addEventListener('click', () => {
  if (chatInputFull.value.trim()) {
    const userMessage = chatInputFull.value.trim();
    addChatMessageFull(userMessage, true);
    chatInputFull.value = '';
    
    const infoUpdated = parseChatMessage(userMessage);
    updateChatInfo();
    
    // Simulate AI response
    setTimeout(() => {
      let aiResponse = '';
      if (infoUpdated) {
        aiResponse = '알겠어! 그 정보 반영했어. 더 필요한 정보가 있으면 말해줘! 😊';
      } else {
        const missing = [];
        if (!chatData.region) missing.push('도시');
        if (!chatData.days) missing.push('기간');
        if (!chatData.who) missing.push('동행자');
        if (chatData.styles.length === 0) missing.push('여행 스타일');
        
        if (missing.length > 0) {
          aiResponse = `${missing.join(', ')}에 대해 더 알려줄 수 있어? 예를 들어 "제주도로 3박 4일 여행 가고 싶어, 친구들이랑 힐링하고 싶어" 같은 식으로 말해줘!`;
        } else {
          aiResponse = '좋아! 더 추가하고 싶은 게 있으면 말해줘. 없으면 "계획 만들어줘"라고 하면 돼!';
        }
      }
      addChatMessageFull(aiResponse);
    }, 500);
  }
});

chatInputFull.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendChatBtnFull.click();
  }
});

// Generate plan from chat
generatePlanFromChatBtn.addEventListener('click', () => {
  goToStep('Loading');
  
  // Convert chat data to plan data format
  planData = {
    region: chatData.region,
    regionId: chatData.regionId || 'jeju', // fallback
    days: chatData.days,
    nights: chatData.nights,
    who: chatData.who,
    styles: chatData.styles
  };
  
  // Simulate plan generation
  setTimeout(() => {
    const tripId = 'trip_' + Date.now();
    const tripData = {
      id: tripId,
      ...planData,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(tripId, JSON.stringify(tripData));
    localStorage.setItem('currentTrip', tripId);
    
    window.location.href = 'schedule.html';
  }, 2000);
});

// Google Login
document.getElementById('loginBtn').addEventListener('click', () => {
  // In production, use Google OAuth 2.0
  // For MVP demo, simulate login
  const userName = prompt('Google 계정 이메일을 입력하세요 (데모용):');
  if (userName) {
    localStorage.setItem('userName', userName);
    localStorage.setItem('isLoggedIn', 'true');
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('userBtn').style.display = 'inline-flex';
    document.getElementById('userName').textContent = userName.split('@')[0];
  }
});

// Check login status
if (localStorage.getItem('isLoggedIn') === 'true') {
  document.getElementById('loginBtn').style.display = 'none';
  document.getElementById('userBtn').style.display = 'inline-flex';
  document.getElementById('userName').textContent = localStorage.getItem('userName')?.split('@')[0] || '사용자';
}

