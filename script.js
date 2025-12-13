(() => {
  // Check login status
  function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName');
    
    if (isLoggedIn && userName) {
      document.getElementById('loginBtn').style.display = 'none';
      document.getElementById('startPlanBtn').style.display = 'inline-flex';
      if (document.getElementById('userBtn')) {
        document.getElementById('userBtn').style.display = 'inline-flex';
        document.getElementById('userName').textContent = userName.split('@')[0];
      }
    }
  }

  // Check login and redirect
  window.checkLoginAndRedirect = function(url) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      alert('먼저 Google 로그인을 해주세요.');
      handleGoogleLogin();
      return;
    }
    window.location.href = url;
  };

  // Google Login Handler
  window.handleGoogleLogin = function() {
    // In production, use Google OAuth 2.0
    // For MVP demo, simulate login
    const email = prompt('Google 계정 이메일을 입력하세요 (데모용):');
    if (email && email.includes('@')) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', email);
      checkLoginStatus();
      
      // Show success message
      alert('로그인되었습니다!');
      
      // Reload to update UI
      if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        window.location.reload();
      }
    } else if (email) {
      alert('올바른 이메일 형식을 입력해주세요.');
    }
  };

  // Navigation active state
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.includes(href) || (currentPath === '/' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }

    link.addEventListener('click', (e) => {
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Initialize
  checkLoginStatus();
})();
