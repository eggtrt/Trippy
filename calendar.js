// Set to December 2025 to show sample data
let currentDate = new Date(2025, 11, 15); // 2025년 12월 15일 (샘플 데이터 날짜)
let currentView = 'month';

// Sample trip data from main page (제주도 3박 4일) - 2025년 12월 기준
const sampleTripData = {
  startDate: '2025-12-15',
  endDate: '2025-12-18',
  events: [
    // Day 1 (12월 15일 월요일)
    { date: '2025-12-15', time: '08:00', title: '공항 도착', type: '이동', category: 'move' },
    { date: '2025-12-15', time: '09:00', title: '렌터카 픽업', type: '이동', category: 'move' },
    { date: '2025-12-15', time: '10:00', title: '호텔 체크인', type: '숙소', category: 'accommodation' },
    { date: '2025-12-15', time: '12:30', title: '점심 식사', type: '식사', category: 'meal' },
    { date: '2025-12-15', time: '14:00', title: '용두암 관광', type: '관광', category: 'sightseeing' },
    { date: '2025-12-15', time: '18:00', title: '저녁 식사', type: '식사', category: 'meal' },
    // Day 2 (12월 16일 화요일)
    { date: '2025-12-16', time: '08:00', title: '성산일출봉', type: '관광', category: 'sightseeing', duration: 2 },
    { date: '2025-12-16', time: '11:00', title: '우도 투어', type: '관광', category: 'sightseeing' },
    { date: '2025-12-16', time: '12:30', title: '점심 식사', type: '식사', category: 'meal' },
    { date: '2025-12-16', time: '14:00', title: '카멜리아힐', type: '관광', category: 'sightseeing' },
    // Day 3 (12월 17일 수요일)
    { date: '2025-12-17', time: '09:00', title: '한라산 등반', type: '관광', category: 'sightseeing' },
    { date: '2025-12-17', time: '12:30', title: '점심 식사', type: '식사', category: 'meal' },
    { date: '2025-12-17', time: '14:00', title: '카페 투어', type: '관광', category: 'sightseeing', duration: 2 },
    { date: '2025-12-17', time: '18:00', title: '저녁 식사', type: '식사', category: 'meal' },
    // Day 4 (12월 18일 목요일)
    { date: '2025-12-18', time: '08:00', title: '섭지코지', type: '관광', category: 'sightseeing' },
    { date: '2025-12-18', time: '10:00', title: '해녀의 집', type: '관광', category: 'sightseeing' },
    { date: '2025-12-18', time: '12:30', title: '점심 식사', type: '식사', category: 'meal' },
    { date: '2025-12-18', time: '14:00', title: '천지연폭포', type: '관광', category: 'sightseeing' },
    { date: '2025-12-18', time: '18:00', title: '저녁 식사', type: '식사', category: 'meal' },
    // Day 5 (12월 19일 금요일)
    { date: '2025-12-19', time: '08:00', title: '공항 출발', type: '이동', category: 'move' }
  ]
};

// Initialize sample data if no events exist
function initializeSampleData() {
  // Always initialize sample data for 2025-12
  const calendarEvents = [];
  
  sampleTripData.events.forEach(event => {
    const [year, month, day] = event.date.split('-');
    const [hours, minutes] = event.time.split(':');
    const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    const duration = event.duration || 1;
    const endDate = new Date(eventDate.getTime() + duration * 60 * 60 * 1000);
    
    const colorMap = {
      'meal': '#ea4335',
      'sightseeing': '#4285f4',
      'move': '#34a853',
      'accommodation': '#fbbc04'
    };
    
    calendarEvents.push({
      title: event.title,
      startDate: eventDate.toISOString(),
      endDate: endDate.toISOString(),
      type: event.type,
      category: event.category,
      color: colorMap[event.category]
    });
  });
  
  localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
  console.log('=== Sample Data Initialized ===');
  console.log('Total events:', calendarEvents.length);
  console.log('All events:', calendarEvents);
  
  // Verify data
  const saved = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
  console.log('Saved to localStorage:', saved.length, 'events');
  saved.forEach((e, i) => {
    const d = new Date(e.startDate);
    console.log(`Event ${i+1}: ${e.title} - ${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`);
  });
}

// Initialize calendar
function initCalendar() {
  initializeSampleData();
  
  // Debug: Check if events are loaded
  const events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
  console.log('=== Calendar Debug ===');
  console.log('Total events in localStorage:', events.length);
  if (events.length > 0) {
    console.log('First event:', events[0]);
    const dec15Events = events.filter(e => {
      const d = new Date(e.startDate);
      return d.getFullYear() === 2025 && d.getMonth() === 11 && d.getDate() === 15;
    });
    console.log('Events for 2025-12-15:', dec15Events.length, dec15Events);
    
    // Test getEventsForHour
    const testDate = new Date(2025, 11, 15, 8, 0);
    const hour8Events = getEventsForHour(testDate, 8);
    console.log('Events for 2025-12-15 8시:', hour8Events);
    
    // Verify all dates
    events.forEach(e => {
      const d = new Date(e.startDate);
      console.log(`Event: ${e.title} - ${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`);
    });
  } else {
    console.error('No events found in localStorage!');
  }
  
  renderCalendar();
  loadEvents();
  checkLoginStatus();
  setupScrollSync();
}

// Setup scroll synchronization for time columns
function setupScrollSync() {
  const weekView = document.getElementById('weekView');
  const dayView = document.getElementById('dayView');
  
  if (weekView && weekView.classList.contains('active')) {
    const timeColumn = weekView.querySelector('.cal-time-column');
    const gridWeek = weekView.querySelector('.cal-grid-week');
    
    if (timeColumn && gridWeek) {
      // Only sync from grid to time column (one way)
      gridWeek.addEventListener('scroll', () => {
        timeColumn.scrollTop = gridWeek.scrollTop;
      });
    }
  }
  
  if (dayView && dayView.classList.contains('active')) {
    const timeColumn = dayView.querySelector('.cal-time-column-day');
    const dayColumn = dayView.querySelector('.cal-day-column-single');
    
    if (timeColumn && dayColumn) {
      // Only sync from day column to time column (one way)
      dayColumn.addEventListener('scroll', () => {
        timeColumn.scrollTop = dayColumn.scrollTop;
      });
    }
  }
}

// Render calendar based on current view
function renderCalendar() {
  if (currentView === 'month') {
    renderMonthView();
  } else if (currentView === 'week') {
    renderWeekView();
  } else if (currentView === 'day') {
    renderDayView();
  }
}

// Generate time slots (0-24시)
function generateTimeSlots(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Clear existing slots except header
  const header = container.querySelector('.cal-time-header');
  container.innerHTML = '';
  if (header) container.appendChild(header);
  
  // Generate 24 hour slots
  for (let hour = 0; hour < 24; hour++) {
    const timeSlot = document.createElement('div');
    timeSlot.className = 'cal-time-slot';
    
    if (hour === 0) {
      timeSlot.textContent = 'AM 12시';
    } else if (hour < 12) {
      timeSlot.textContent = `AM ${hour}시`;
    } else if (hour === 12) {
      timeSlot.textContent = 'PM 12시';
    } else {
      timeSlot.textContent = `PM ${hour - 12}시`;
    }
    
    container.appendChild(timeSlot);
  }
}

// Month View
function renderMonthView() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Update header
  document.getElementById('currentDateDisplay').textContent = `${year}년 ${month + 1}월`;
  
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
    
    // Add events for this day (only in month view)
    const events = getEventsForDate(year, month + 1, day);
    if (events.length > 0) {
      const eventsContainer = document.createElement('div');
      eventsContainer.className = 'cal-day-events';
      
      // Sort events by time
      events.sort((a, b) => {
        const timeA = new Date(a.startDate).getHours();
        const timeB = new Date(b.startDate).getHours();
        return timeA - timeB;
      });
      
      // Show up to 3 events, or show "+N more" if more
      const displayEvents = events.slice(0, 3);
      displayEvents.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'cal-event-main';
        eventDiv.style.background = event.color || '#4285f4';
        eventDiv.textContent = event.title;
        eventDiv.setAttribute('title', event.title);
        eventsContainer.appendChild(eventDiv);
      });
      
      if (events.length > 3) {
        const moreDiv = document.createElement('div');
        moreDiv.className = 'cal-event-more';
        moreDiv.textContent = `+${events.length - 3}개 더`;
        eventsContainer.appendChild(moreDiv);
      }
      
      dayElement.appendChild(eventsContainer);
    }
    
    calDaysGrid.appendChild(dayElement);
  }
}

// Week View (Monday to Sunday)
function renderWeekView() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();
  
  // Get Monday of current week
  const currentDay = new Date(year, month, date);
  const dayOfWeek = currentDay.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days
  const monday = new Date(year, month, date + mondayOffset);
  
  // Update header
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  document.getElementById('weekTitle').textContent = 
    `${monday.getFullYear()}년 ${monday.getMonth() + 1}월 ${monday.getDate()}일 - ${sunday.getMonth() + 1}월 ${sunday.getDate()}일`;
  
  // Generate time slots
  generateTimeSlots('weekTimeColumn');
  
  // Day names (월~일)
  const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
  const weekDaysHeader = document.getElementById('weekDaysHeader');
  weekDaysHeader.innerHTML = '';
  
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    
    const dayHeader = document.createElement('div');
    dayHeader.className = 'cal-day-header';
    if (i === 0) dayHeader.classList.add('active');
    
    const dayName = document.createElement('div');
    dayName.className = 'cal-day-name';
    dayName.textContent = dayNames[i];
    
    const dayDateNum = document.createElement('div');
    dayDateNum.className = 'cal-day-date';
    dayDateNum.textContent = dayDate.getDate();
    
    dayHeader.appendChild(dayName);
    dayHeader.appendChild(dayDateNum);
    weekDaysHeader.appendChild(dayHeader);
  }
  
  // Week grid
  const weekGrid = document.getElementById('weekGrid');
  weekGrid.innerHTML = '';
  
  // Create 7 day columns (월~일)
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    
    const dayColumn = document.createElement('div');
    dayColumn.className = 'cal-day-column';
    
    // Create 24 hour slots (0-23시)
    for (let hour = 0; hour < 24; hour++) {
      const hourSlot = document.createElement('div');
      hourSlot.className = 'cal-hour-slot';
      hourSlot.setAttribute('data-hour', hour);
      
      // Get events for this hour
      const events = getEventsForHour(dayDate, hour);
      events.forEach(event => {
        const eventBlock = createEventBlock(event);
        hourSlot.appendChild(eventBlock);
      });
      
      dayColumn.appendChild(hourSlot);
    }
    
    weekGrid.appendChild(dayColumn);
  }
  
  // Setup scroll sync after rendering
  setTimeout(() => {
    setupScrollSync();
    // Force alignment check
    alignWeekColumns();
  }, 200);
}

// Force column alignment for week view
function alignWeekColumns() {
  const weekView = document.getElementById('weekView');
  if (!weekView || !weekView.classList.contains('active')) return;
  
  const header = weekView.querySelector('.cal-days-header');
  const grid = weekView.querySelector('.cal-grid-week');
  
  if (header && grid) {
    // Get computed widths from header
    const headerCols = header.querySelectorAll('.cal-day-header');
    const gridCols = grid.querySelectorAll('.cal-day-column');
    
    if (headerCols.length === gridCols.length && headerCols.length === 7) {
      // Set exact widths to match
      headerCols.forEach((col, i) => {
        const width = col.getBoundingClientRect().width;
        if (gridCols[i]) {
          gridCols[i].style.width = width + 'px';
          gridCols[i].style.minWidth = width + 'px';
          gridCols[i].style.maxWidth = width + 'px';
        }
      });
    }
  }
}

// Day View
function renderDayView() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();
  
  const dayDate = new Date(year, month, date);
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  
  // Update header
  document.getElementById('dayTitle').textContent = 
    `${year}년 ${month + 1}월 ${date}일 ${dayNames[dayDate.getDay()]}`;
  
  // Generate time slots
  generateTimeSlots('dayTimeColumn');
  
  // Day column
  const dayColumn = document.getElementById('dayColumn');
  dayColumn.innerHTML = '';
  
  // Create 24 hour slots (0-23시)
  for (let hour = 0; hour < 24; hour++) {
    const hourSlot = document.createElement('div');
    hourSlot.className = 'cal-hour-slot';
    hourSlot.setAttribute('data-hour', hour);
    
    // Get events for this hour
    const events = getEventsForHour(dayDate, hour);
    events.forEach(event => {
      const eventBlock = createEventBlock(event);
      hourSlot.appendChild(eventBlock);
    });
    
    dayColumn.appendChild(hourSlot);
  }
  
  // Setup scroll sync after rendering
  setTimeout(() => {
    setupScrollSync();
  }, 200);
}

// Create event block for week/day view
function createEventBlock(event) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  
  const startHour = startDate.getHours();
  const startMin = startDate.getMinutes();
  const endHour = endDate.getHours();
  const endMin = endDate.getMinutes();
  
  // Calculate position and height
  const startPosition = (startMin / 60) * 100;
  const duration = (endHour - startHour) + (endMin - startDate.getMinutes()) / 60;
  const height = duration * 100;
  
  // Get category class
  const categoryClass = getCategoryClass(event.category || event.type);
  
  // Format time
  const timeStr = formatTimeRange(startHour, startMin, endHour, endMin);
  
  const eventBlock = document.createElement('div');
  eventBlock.className = `cal-event-block ${categoryClass}`;
  eventBlock.style.top = `${startPosition}%`;
  eventBlock.style.height = `${height}%`;
  
  const eventTitle = document.createElement('div');
  eventTitle.className = 'cal-event-title';
  eventTitle.textContent = event.title;
  
  const eventTime = document.createElement('div');
  eventTime.className = 'cal-event-time';
  eventTime.textContent = timeStr;
  
  eventBlock.appendChild(eventTitle);
  eventBlock.appendChild(eventTime);
  
  return eventBlock;
}

// Get category class from event type
function getCategoryClass(type) {
  if (!type) return 'category-sightseeing';
  if (type.includes('식사') || type === '식사' || type === 'meal') return 'category-meal';
  if (type.includes('이동') || type === '이동' || type === 'move') return 'category-move';
  if (type.includes('숙소') || type === '숙소' || type === 'accommodation') return 'category-accommodation';
  return 'category-sightseeing';
}

// Format time range
function formatTimeRange(startHour, startMin, endHour, endMin) {
  const period1 = startHour < 12 ? 'AM' : 'PM';
  const hour1 = startHour > 12 ? startHour - 12 : startHour === 0 ? 12 : startHour === 12 ? 12 : startHour;
  const period2 = endHour < 12 ? 'AM' : 'PM';
  const hour2 = endHour > 12 ? endHour - 12 : endHour === 0 ? 12 : endHour === 12 ? 12 : endHour;
  
  return `${period1} ${hour1}시~${period2} ${hour2}시`;
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

// Get events for specific hour
function getEventsForHour(date, hour) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const allEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
  const filtered = allEvents.filter(event => {
    if (!event.startDate) return false;
    const eventDate = new Date(event.startDate);
    if (isNaN(eventDate.getTime())) return false;
    
    const eventYear = eventDate.getFullYear();
    const eventMonth = eventDate.getMonth() + 1;
    const eventDay = eventDate.getDate();
    const eventHour = eventDate.getHours();
    
    return eventYear === year && eventMonth === month && eventDay === day && eventHour === hour;
  });
  
  return filtered;
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
  
  // Group events by trip
  const trips = {};
  events.forEach(event => {
    const date = new Date(event.startDate);
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    if (!trips[dateKey]) {
      trips[dateKey] = [];
    }
    trips[dateKey].push(event);
  });
  
  Object.keys(trips).sort().forEach(dateKey => {
    const tripEvents = trips[dateKey];
    const firstEvent = tripEvents[0];
    const eventDiv = document.createElement('div');
    eventDiv.className = 'calendar-event-item';
    eventDiv.innerHTML = `
      <div class="event-color" style="background: ${firstEvent.color || '#4285f4'};"></div>
      <div class="event-info">
        <div class="event-title">${firstEvent.title}</div>
        <div class="event-date">${formatDate(firstEvent.startDate)}</div>
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

// Navigate calendar (month/week/day)
window.navigateCalendar = function(direction) {
  if (currentView === 'month') {
    currentDate.setMonth(currentDate.getMonth() + direction);
  } else if (currentView === 'week') {
    currentDate.setDate(currentDate.getDate() + (direction * 7));
  } else if (currentView === 'day') {
    currentDate.setDate(currentDate.getDate() + direction);
  }
  renderCalendar();
};

// Toggle view
window.toggleView = function(view) {
  currentView = view;
  
  // Update view buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-view') === view) {
      btn.classList.add('active');
    }
  });
  
  // Show/hide views
  document.getElementById('monthView').classList.toggle('active', view === 'month');
  document.getElementById('weekView').classList.toggle('active', view === 'week');
  document.getElementById('dayView').classList.toggle('active', view === 'day');
  
  // Show/hide sidebar (only for month view)
  document.getElementById('calendarSidebar').style.display = view === 'month' ? 'block' : 'none';
  
  renderCalendar();
  
  // Setup scroll sync after view change
  setTimeout(() => {
    setupScrollSync();
    if (view === 'week') {
      alignWeekColumns();
    }
  }, 200);
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
