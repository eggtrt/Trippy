// Plan creation flow
let planData = {
  region: null,
  regionId: null,
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
  document.getElementById(`step${stepNum}`).classList.add('active');
}

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
  });
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

// Generate plan
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

