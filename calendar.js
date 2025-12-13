let currentDate = new Date();
let currentView = 'month';

// Initialize calendar
function initCalendar() {
  renderCalendar();
  loadEvents();
  checkLoginStatus();
}

// Render calendar
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Update header
  document.getElementById('currentMonth').textContent = `${year}년 ${month + 1}월`;
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const calDaysGrid = document.getElementById('calDaysGrid');
  calDaysGrid.innerHTML = '';
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'cal-day-empty';
    calDaysGrid.appendChild(emptyDay);
  }
  
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'cal-day-main';
    dayElement.setAttribute('data-date', `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    
    const dayNum = document.createElement('div');
    dayNum.className = 'cal-day-num-main';
    dayNum.textContent = day;
    dayElement.appendChild(dayNum);
    
    // Check if today
    const today = new Date();
    if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
      dayElement.classList.add('cal-today');
    }
    
    // Add events for this day
    const events = getEventsForDate(year, month + 1, day);
    events.forEach(event => {
      const eventDiv = document.createElement('div');
      eventDiv.className = 'cal-event-main';
      eventDiv.style.background = event.color || '#4285f4';
      eventDiv.textContent = event.title;
      eventDiv.setAttribute('title', event.title);
      dayElement.appendChild(eventDiv);
    });
    
    calDaysGrid.appendChild(dayElement);
  }
}

// Get events for specific date
function getEventsForDate(year, month, day) {
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const allEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
  return allEvents.filter(event => {
    const eventDate = new Date(event.startDate);
    const eventYear = eventDate.getFullYear();
    const eventMonth = eventDate.getMonth() + 1;
    const eventDay = eventDate.getDate();
    return eventYear === year && eventMonth === month && eventDay === day;
  });
}

// Load events from localStorage
function loadEvents() {
  const events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
  const eventsContainer = document.getElementById('calendarEvents');
  eventsContainer.innerHTML = '';
  
  if (events.length === 0) {
    eventsContainer.innerHTML = '<p style="color: var(--muted); font-size: 14px; text-align: center; padding: 20px;">저장된 여행 일정이 없습니다.</p>';
    return;
  }
  
  events.forEach(event => {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'calendar-event-item';
    eventDiv.innerHTML = `
      <div class="event-color" style="background: ${event.color || '#4285f4'};"></div>
      <div class="event-info">
        <div class="event-title">${event.title}</div>
        <div class="event-date">${formatDate(event.startDate)} - ${formatDate(event.endDate)}</div>
      </div>
    `;
    eventsContainer.appendChild(eventDiv);
  });
}

// Format date
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

// Change month
window.changeMonth = function(direction) {
  currentDate.setMonth(currentDate.getMonth() + direction);
  renderCalendar();
};

// Go to today
window.goToToday = function() {
  currentDate = new Date();
  renderCalendar();
};

// Toggle view
window.toggleView = function(view) {
  currentView = view;
  // For now, only month view is implemented
  renderCalendar();
};

// Check login status
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userName = localStorage.getItem('userName');
  
  if (isLoggedIn && userName) {
    if (document.getElementById('userBtn')) {
      document.getElementById('userBtn').style.display = 'inline-flex';
      document.getElementById('userName').textContent = userName.split('@')[0];
    }
  }
}

// Google Calendar sync
document.getElementById('syncBtn').addEventListener('click', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    alert('먼저 Google 로그인을 해주세요.');
    return;
  }
  
  if (confirm('Google Calendar와 동기화하시겠습니까?')) {
    // In production, use Google Calendar API
    alert('Google Calendar와 동기화되었습니다! (데모)');
    document.getElementById('syncBtn').textContent = '✓ 동기화 완료';
  }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initCalendar();
});

