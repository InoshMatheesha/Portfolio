// ========== CUSTOM CURSOR & FOLLOWER (DESKTOP ONLY) ==========
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (cursor && follower && !isTouchDevice && window.innerWidth > 600) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state for custom cursor
  const hoverTargets = document.querySelectorAll('a, button, .btn, .skill-card, .project-card, .article-card, .contact-card-item, .social-icon-btn, input, textarea');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

// ========== THEME TOGGLE (LIGHT & DARK MODE) ==========
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }
}

// ========== NAVIGATION SCROLL & ACTIVE LINK ==========
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id], header[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Active section highlight
  let currentSectionId = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });

// ========== MOBILE OVERLAY MENU (ANDROID & IOS UI) ==========
const toggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileCloseBtn = document.getElementById('mobile-close');

function closeMobileMenu() {
  if (toggle && mobileMenu) {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function openMobileMenu() {
  if (toggle && mobileMenu) {
    toggle.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

// ========== TERMINAL AUTO-TYPING & INTERACTIVE CLI ==========
const typingLine = document.getElementById('typing-line');
if (typingLine) {
  const phrases = [
    'building tools to secure the digital world_',
    'engineering BadUSB payloads for research_',
    'developing ESP32 wireless security framework_',
    'documenting OWASP exploit paths on Medium_',
    'researching browser security extensions_'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isPaused) {
      setTimeout(() => {
        isPaused = false;
        isDeleting = true;
        type();
      }, 2200);
      return;
    }

    if (isDeleting) {
      typingLine.textContent = current.substring(0, charIndex - 1) + '_';
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      setTimeout(type, 30);
    } else {
      typingLine.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isPaused = true;
        type();
        return;
      }
      setTimeout(type, 55);
    }
  }

  setTimeout(type, 1200);
}

// Interactive CLI Command Line Input
const cliInput = document.getElementById('cli-input');
const terminalBody = document.getElementById('terminal');

if (cliInput && terminalBody) {
  cliInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = cliInput.value.trim().toLowerCase();
      cliInput.value = '';
      if (!command) return;

      // Append command line
      const cmdLine = document.createElement('div');
      cmdLine.className = 'line';
      cmdLine.innerHTML = `<span class="prompt">inosh@sec:~$</span> ${escapeHTML(command)}`;
      
      // Insert before prompt input line
      const inputLine = cliInput.closest('.prompt-input-line');
      terminalBody.insertBefore(cmdLine, inputLine);

      // Process command output
      let outputText = '';
      let isSuccess = false;

      switch (command) {
        case 'help':
          outputText = `Available commands:<br/>` +
            `[i] <span class="highlight">whoami</span> — Identity & background<br/>` +
            `[i] <span class="highlight">skills</span> — Security & tech stack<br/>` +
            `[i] <span class="highlight">projects</span> — Key projects list & link<br/>` +
            `[i] <span class="highlight">articles</span> — Medium research writeups<br/>` +
            `[i] <span class="highlight">contact</span> — Reach out & direct email<br/>` +
            `[i] <span class="highlight">clear</span> — Reset terminal log`;
          break;
        case 'whoami':
          outputText = `Inosh Matheesha — Cyber Security Undergraduate @ SLIIT University, Sri Lanka. Focus: Pentesting & Security Tool Engineering.`;
          isSuccess = true;
          break;
        case 'skills':
          outputText = `[i] <span class="highlight">Offensive</span>: Web Pentesting, BadUSB, ESP32 Deauth/Evil Twin<br/>` +
            `[i] <span class="highlight">Tooling</span>: Burp Suite, Nmap, Wireshark, Metasploit<br/>` +
            `[i] <span class="highlight">Dev</span>: Python, JavaScript, C/C++, Kotlin, PHP`;
          break;
        case 'projects':
          outputText = `1. ProMicro Payloads (Arduino BadUSB)<br/>` +
            `2. ZeNeOn ESP32 WiFi Framework<br/>` +
            `3. SecureShopCTF Lab<br/>` +
            `4. FreebieGamesFinder Extension<br/>` +
            `5. Exam Scheduler Android App<br/>` +
            `6. MooDeX — PC Gaming Hub (WPF App)`;
          isSuccess = true;
          break;
        case 'articles':
          outputText = `Medium Writeups: SecureShop CTF, OS Command Injection, File Upload Flaws, Path Traversal, XXE Injection, PortSwigger XSS Apprentice Labs.`;
          break;
        case 'contact':
          outputText = `Email: inoshmatheesha@gmail.com | Phone: +94 77 643 9435 | GitHub: @InoshMatheesha`;
          isSuccess = true;
          break;
        case 'clear':
          // Remove previous output lines except initial 3 lines and input line
          const lines = terminalBody.querySelectorAll('.line:not(.prompt-input-line)');
          lines.forEach((line, idx) => {
            if (idx > 2) line.remove();
          });
          return;
        case 'sudo':
          outputText = `[!] Permission denied: Ethical security operators only execute authorized commands.`;
          break;
        case 'matrix':
          outputText = `<span style="color:#00e5a0;">Wake up, Neo... The Matrix has you.</span>`;
          break;
        default:
          outputText = `Command not recognized: '${escapeHTML(command)}'. Type '<span class="highlight">help</span>' for available options.`;
          break;
      }

      const outLine = document.createElement('div');
      outLine.className = `line output ${isSuccess ? 'success' : ''}`;
      outLine.innerHTML = outputText;
      terminalBody.insertBefore(outLine, inputLine);

      // Scroll terminal to bottom
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// ========== 3D CARD TILT EFFECT (DESKTOP ONLY) ==========
if (!isTouchDevice && window.innerWidth > 900) {
  const tiltElements = document.querySelectorAll('.skill-card, .project-card, .article-card, .contact-card-item, .terminal-window, .code-block, .intern-card');

  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${percentX}%`);
      card.style.setProperty('--mouse-y', `${percentY}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

// ========== SCROLL REVEAL ANIMATIONS ==========
const revealElements = document.querySelectorAll('.skill-card, .project-card, .article-card, .contact-card-item, .code-block, .intern-card, .terminal-window, .skill-bars-container');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

revealElements.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.45s ease ${(i % 4) * 0.07}s, transform 0.45s ease ${(i % 4) * 0.07}s`;
  revealObserver.observe(el);
});

console.log('Inosh Matheesha // Cyber Security Portfolio Ready');
