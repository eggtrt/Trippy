// Leaflet Map initialization (no API key required)
let map;
let markers = [];

function initMap() {
  // Default center (Jeju)
  const defaultCenter = [33.4996, 126.5312];
  
  // Initialize Leaflet map
  map = L.map('map').setView(defaultCenter, 12);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  // Load schedule items and add markers
  loadScheduleItems();
  
  // Day tab switching
  document.querySelectorAll('.day-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const day = tab.getAttribute('data-day');
      switchDay(day);
    });
  });
}

function loadScheduleItems() {
  const currentDay = document.querySelector('.day-schedule.active');
  if (!currentDay) return;

  const items = currentDay.querySelectorAll('.schedule-item');
  
  // Remove existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const latlngs = [];
  
  items.forEach((item, index) => {
    const lat = parseFloat(item.getAttribute('data-lat'));
    const lng = parseFloat(item.getAttribute('data-lng'));
    const time = item.getAttribute('data-time');
    const title = item.querySelector('h4').textContent;
    const description = item.querySelector('p').textContent;
    const type = item.querySelector('.item-type').textContent;

    // Marker color based on type
    let color = '#0bd19d';
    if (type === '식사') color = '#ff6b6b';
    else if (type === '숙소') color = '#4dabf7';
    else if (type === '이동') color = '#ffd43b';

    // Create custom icon
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">${index + 1}</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([lat, lng], { icon: icon }).addTo(map);

    // Popup content
    const popupContent = `
      <div style="padding: 8px; min-width: 200px;">
        <strong style="display: block; margin-bottom: 4px; font-size: 14px;">${time} - ${title}</strong>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${description}</p>
        <span style="display: inline-block; margin-top: 6px; padding: 4px 10px; background: ${color}; color: white; border-radius: 12px; font-size: 11px; font-weight: 600;">${type}</span>
      </div>
    `;

    marker.bindPopup(popupContent);
    markers.push(marker);
    latlngs.push([lat, lng]);
  });

  // Draw polyline route if we have multiple points
  if (latlngs.length > 1) {
    // Remove existing route if any
    if (window.routePolyline) {
      map.removeLayer(window.routePolyline);
    }
    
    window.routePolyline = L.polyline(latlngs, {
      color: '#0bd19d',
      weight: 4,
      opacity: 0.7,
      dashArray: '10, 10'
    }).addTo(map);
    
    // Fit map to show all markers
    if (latlngs.length > 0) {
      const group = new L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  } else if (latlngs.length === 1) {
    // If only one point, center on it
    map.setView(latlngs[0], 15);
  }
}

function switchDay(day) {
  // Update tabs
  document.querySelectorAll('.day-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  const activeTab = document.querySelector(`.day-tab[data-day="${day}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }

  // Update content
  document.querySelectorAll('.day-schedule').forEach(schedule => {
    schedule.classList.remove('active');
  });
  const activeSchedule = document.querySelector(`.day-schedule[data-day="${day}"]`);
  if (activeSchedule) {
    activeSchedule.classList.add('active');
  }

  // Reload map
  loadScheduleItems();
}

// Schedule item click
document.addEventListener('click', (e) => {
  const scheduleItem = e.target.closest('.schedule-item');
  if (scheduleItem && map) {
    const lat = parseFloat(scheduleItem.getAttribute('data-lat'));
    const lng = parseFloat(scheduleItem.getAttribute('data-lng'));
    map.setView([lat, lng], 15);
    
    // Open popup for corresponding marker
    markers.forEach(marker => {
      const markerLat = marker.getLatLng().lat;
      const markerLng = marker.getLatLng().lng;
      if (Math.abs(markerLat - lat) < 0.001 && Math.abs(markerLng - lng) < 0.001) {
        marker.openPopup();
      }
    });
  }
});

// Save schedule to calendar
document.getElementById('saveBtn').addEventListener('click', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    alert('먼저 Google 로그인을 해주세요.');
    return;
  }

  // Collect all schedule items
  const scheduleItems = [];
  document.querySelectorAll('.schedule-item').forEach(item => {
    const time = item.getAttribute('data-time');
    const title = item.querySelector('h4').textContent;
    const description = item.querySelector('p').textContent;
    const type = item.querySelector('.item-type').textContent;
    const lat = item.getAttribute('data-lat');
    const lng = item.getAttribute('data-lng');
    const day = item.closest('.day-schedule')?.getAttribute('data-day') || '0';
    
    scheduleItems.push({
      time,
      title,
      description,
      type,
      lat,
      lng,
      day: parseInt(day)
    });
  });

  // Get trip info
  const tripTitle = document.getElementById('tripTitle').textContent;
  const tripDates = document.getElementById('tripDates').textContent;
  
  // Parse dates
  const dateMatch = tripDates.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (!dateMatch) {
    alert('날짜 정보를 찾을 수 없습니다.');
    return;
  }
  
  const startDate = new Date(parseInt(dateMatch[1]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[3]));
  
  // Group by day and create calendar events
  const eventsByDay = {};
  scheduleItems.forEach(item => {
    if (!eventsByDay[item.day]) {
      eventsByDay[item.day] = [];
    }
    eventsByDay[item.day].push(item);
  });

  // Create calendar events
  const calendarEvents = [];
  Object.keys(eventsByDay).forEach(day => {
    const dayNum = parseInt(day);
    const eventDate = new Date(startDate);
    eventDate.setDate(eventDate.getDate() + dayNum);
    
    eventsByDay[day].forEach(item => {
      const [hours, minutes] = item.time.split(':');
      const eventDateTime = new Date(eventDate);
      eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
      
      calendarEvents.push({
        title: `${item.time} ${item.title}`,
        description: item.description,
        startDate: eventDateTime.toISOString(),
        endDate: new Date(eventDateTime.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
        type: item.type,
        color: getColorForType(item.type),
        location: item.lat && item.lng ? `${item.lat},${item.lng}` : null
      });
    });
  });

  // Save to localStorage
  const existingEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
  const newEvents = [...existingEvents, ...calendarEvents];
  localStorage.setItem('calendarEvents', JSON.stringify(newEvents));

  // Also save trip info
  const tripInfo = {
    title: tripTitle,
    startDate: startDate.toISOString(),
    endDate: new Date(startDate.getTime() + (scheduleItems.length > 0 ? Math.max(...Object.keys(eventsByDay).map(Number)) : 0) * 24 * 60 * 60 * 1000).toISOString(),
    events: calendarEvents
  };
  localStorage.setItem('lastTrip', JSON.stringify(tripInfo));

  alert('일정이 캘린더에 저장되었습니다!');
  
  // Update sync button
  document.getElementById('syncCalendarBtn').textContent = '✓ 저장 완료';
});

function getColorForType(type) {
  if (type === '식사') return '#ff6b6b';
  if (type === '숙소') return '#4dabf7';
  if (type === '이동') return '#ffd43b';
  return '#4285f4'; // Default blue
}

// Google Calendar sync
document.getElementById('syncCalendarBtn').addEventListener('click', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    alert('먼저 Google 로그인을 해주세요.');
    return;
  }

  // Check if schedule is saved
  const lastTrip = localStorage.getItem('lastTrip');
  if (!lastTrip) {
    alert('먼저 일정을 저장해주세요.');
    return;
  }

  // In production, use Google Calendar API
  // For MVP demo, show confirmation
  if (confirm('Google Calendar에 일정을 동기화하시겠습니까?')) {
    alert('일정이 Google Calendar에 추가되었습니다! (데모)');
    document.getElementById('syncCalendarBtn').textContent = '✓ 동기화 완료';
    document.getElementById('syncCalendarBtn').disabled = true;
  }
});

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    initMap();
  }, 100);
});
