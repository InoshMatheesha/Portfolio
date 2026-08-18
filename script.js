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

  // Load saved theme preference (default: light mode)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
  }
}

// ========== NAVIGATION SCROLL & ACTIVE LINK ==========
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id], header[id]');

// Throttle scroll work with requestAnimationFrame to avoid layout thrashing
let scrollTicking = false;
let lastActiveId = '';

function onScroll() {
  const scrollY = window.scrollY;

  if (scrollY > 30) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Active section highlight
  let currentSectionId = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute('id');
    }
  });

  // Only touch the DOM when the active section actually changes
  if (currentSectionId !== lastActiveId) {
    lastActiveId = currentSectionId;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
    });
  }

  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(onScroll);
  }
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

// ========== SKILL BARS FILL & PERCENTAGE COUNTER ANIMATION ==========
const skillBarsContainer = document.querySelector('.skill-bars-container');

if (skillBarsContainer) {
  const barsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const barFills = entry.target.querySelectorAll('.bar-fill');
        const percentTexts = entry.target.querySelectorAll('.bar-percentage');

        barFills.forEach((fill, index) => {
          const targetPercent = fill.getAttribute('data-percent') || '0';
          setTimeout(() => {
            fill.style.width = targetPercent + '%';
          }, index * 120);
        });

        percentTexts.forEach((textEl, index) => {
          const target = parseInt(textEl.getAttribute('data-target') || '0', 10);
          setTimeout(() => {
            let start = 0;
            const duration = 1200;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;

            const timer = setInterval(() => {
              start += increment;
              if (start >= target) {
                textEl.textContent = target + '%';
                clearInterval(timer);
              } else {
                textEl.textContent = Math.floor(start) + '%';
              }
            }, stepTime);
          }, index * 120);
        });

        barsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  barsObserver.observe(skillBarsContainer);
}

// ========== GITHUB TELEMETRY (LIVE api.github.com STATS) ==========
(function () {
  const root = document.getElementById('gh-telemetry');
  if (!root) return;

  const USER = root.dataset.user;
  if (!USER) return;

  const REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // GitHub allows only 60 unauthenticated calls per hour per IP (shared across everyone behind it),
  // so this widget makes exactly 2 calls per refresh and caches the result.
  const CACHE_KEY = 'ghTelemetry:' + USER;
  const CACHE_TTL = 6 * 60 * 60 * 1000;   // treat cached data as fresh — skip the network entirely
  const CACHE_MAX = 30 * 24 * 60 * 60 * 1000; // still paint stale data rather than showing nothing

  // Baked-in fallback so the panel shows real figures even when the API is rate limited or offline
  const SNAPSHOT = {
    stats: { repos: 13, followers: 55, following: 34, stars: 6 },
    langs: [
      { name: 'PHP', bytes: 3 }, { name: 'JavaScript', bytes: 2 }, { name: 'C++', bytes: 2 },
      { name: 'TypeScript', bytes: 1 }, { name: 'Kotlin', bytes: 1 }, { name: 'C#', bytes: 1 }
    ],
    recent: [
      { name: 'MooDeX', lang: 'C#', date: '2026-08-13T10:38:47Z' },
      { name: 'Portfolio', lang: 'HTML', date: '2026-08-10T17:02:55Z' },
      { name: 'ZeNeOn-ESP32-WiFi-Framework', lang: 'C++', date: '2026-04-22T09:34:11Z' },
      { name: 'FreebieGamesFinder-Extension', lang: 'JavaScript', date: '2026-02-06T16:10:18Z' },
      { name: 'SecureShopCTF', lang: 'PHP', date: '2026-01-16T04:41:17Z' }
    ]
  };

  const LANG_COLORS = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#563d7c',
    Python: '#3572a5', 'C++': '#f34b7d', C: '#8e94a7', 'C#': '#a78bfa', Java: '#b07219',
    Kotlin: '#ffc14d', PHP: '#7b8cff', Shell: '#89e051', PowerShell: '#00f5ff',
    Batchfile: '#5a6077', Dockerfile: '#384d54', Go: '#00add8', Rust: '#dea584',
    Ruby: '#ff5c5c', Swift: '#f05138', Dart: '#00b4ab', Vue: '#41b883', SCSS: '#c6538c'
  };
  const PALETTE = ['#00e5a0', '#00f5ff', '#a78bfa', '#ffc14d', '#ff5c5c', '#38bdf8'];
  const colorFor = (lang, i) => LANG_COLORS[lang] || PALETTE[i % PALETTE.length];

  const pick = (name) => root.querySelector(`[data-gh="${name}"]`);
  const elNote = pick('note');
  const elLangs = pick('langs');
  const elRecent = pick('recent');
  let counted = false;

  function relTime(iso) {
    const date = new Date(iso);
    if (isNaN(date)) return '';
    const days = (Date.now() - date.getTime()) / 86400000;
    if (days < 1) return 'today';
    if (days < 30) return Math.round(days) + 'd ago';
    if (days < 365) return Math.round(days / 30) + 'mo ago';
    return Math.round(days / 365) + 'y ago';
  }

  function countUp(el, target) {
    if (!el) return;
    if (REDUCE) {
      el.textContent = target;
      return;
    }
    const from = parseInt(el.textContent, 10) || 0;
    const duration = 1200;
    let startTime = null;

    function step(now) {
      if (!startTime) startTime = now;
      const p = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function setNote(state, text) {
    if (!elNote) return;
    elNote.className = 'gh-note ' + state;
    elNote.innerHTML = '<span class="gh-note-dot" aria-hidden="true"></span>';
    elNote.appendChild(document.createTextNode(' ' + text));
  }

  function setStats(stats) {
    Object.keys(stats).forEach((key) => {
      const el = pick(key);
      if (!el) return;
      el.setAttribute('data-count', stats[key]);
      if (counted) countUp(el, stats[key]);
    });
  }

  function renderLangs(list) {
    if (!elLangs || !list.length) return;
    const total = list.reduce((sum, item) => sum + item.bytes, 0) || 1;
    const top = list.slice().sort((a, b) => b.bytes - a.bytes).slice(0, 6);

    elLangs.innerHTML = '';
    top.forEach((lang, i) => {
      const percent = (lang.bytes / total) * 100;
      const color = colorFor(lang.name, i);

      const row = document.createElement('div');
      const head = document.createElement('div');
      head.className = 'gh-lang-top';
      head.innerHTML =
        `<span class="gh-swatch" style="background:${color}"></span>` +
        `<span class="gh-lang-name"></span>` +
        `<span class="gh-lang-pct">${percent.toFixed(1)}%</span>`;
      head.querySelector('.gh-lang-name').textContent = lang.name;

      const track = document.createElement('div');
      track.className = 'gh-track';
      const fill = document.createElement('div');
      fill.className = 'gh-fill';
      fill.style.background = color;
      track.appendChild(fill);

      row.appendChild(head);
      row.appendChild(track);
      elLangs.appendChild(row);

      setTimeout(() => {
        fill.style.width = Math.max(percent, 1.5) + '%';
      }, REDUCE ? 0 : 120 + i * 90);
    });
  }

  function renderRecent(list) {
    if (!elRecent || !list.length) return;

    elRecent.innerHTML = '';
    list.slice(0, 5).forEach((repo, i) => {
      const li = document.createElement('li');

      const swatch = document.createElement('span');
      swatch.className = 'gh-swatch';
      swatch.style.background = colorFor(repo.lang, i);

      const link = document.createElement('a');
      link.href = `https://github.com/${encodeURIComponent(USER)}/${encodeURIComponent(repo.name)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = repo.name;

      const time = document.createElement('time');
      time.dateTime = repo.date;
      time.textContent = relTime(repo.date);

      li.appendChild(swatch);
      li.appendChild(link);
      li.appendChild(time);
      elRecent.appendChild(li);
    });
  }

  function paint(data) {
    setStats(data.stats);
    renderRecent(data.recent || []);
    renderLangs(data.langs || []);
  }

  // Animate the counters once the panel scrolls into view
  function animateCounters() {
    if (counted) return;
    counted = true;
    root.querySelectorAll('.gh-stat-num').forEach((el) => {
      countUp(el, parseInt(el.getAttribute('data-count'), 10) || 0);
    });
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  statsObserver.observe(root);

  function readCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && cached.stats && Date.now() - cached.time < CACHE_MAX) return cached;
    } catch (err) {
      /* corrupted or blocked storage — fall through to the network */
    }
    return null;
  }

  // Paint the best data available right away so the panel is never empty or zeroed
  const cache = readCache();
  paint(cache || SNAPSHOT);

  if (cache && Date.now() - cache.time < CACHE_TTL) {
    // Fresh enough — don't spend API calls at all
    setNote('is-cached', 'cached · synced ' + relTime(new Date(cache.time).toISOString()));
    return;
  }

  setNote('', 'syncing with api.github.com …');

  const api = (url) =>
    fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      });

  // Exactly two requests: the profile and the repo list. Language shares come from the repo
  // list itself, so no per-repository calls are needed.
  Promise.all([
    api(`https://api.github.com/users/${encodeURIComponent(USER)}`),
    api(`https://api.github.com/users/${encodeURIComponent(USER)}/repos?per_page=100&sort=updated`)
  ]).then(([user, repos]) => {
    if (!Array.isArray(repos)) throw new Error('unexpected payload');

    const owned = repos.filter((repo) => !repo.fork);

    const stats = {
      repos: user.public_repos || owned.length,
      followers: user.followers || 0,
      following: user.following || 0,
      stars: repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
    };

    const recent = owned.map((repo) => ({
      name: repo.name,
      lang: repo.language,
      date: repo.updated_at
    }));

    // Share of repositories per primary language
    const totals = {};
    owned.forEach((repo) => {
      if (repo.language) totals[repo.language] = (totals[repo.language] || 0) + 1;
    });
    const langs = Object.keys(totals).map((name) => ({ name, bytes: totals[name] }));

    setStats(stats);
    renderRecent(recent);
    renderLangs(langs);
    setNote('is-live', 'live · synced from api.github.com');

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), stats, recent, langs }));
    } catch (err) {
      /* storage full or blocked — the widget still works without a cache */
    }
  }).catch(() => {
    // Rate limited (60 calls/hour per IP) or offline — whatever was painted first still stands
    setNote('is-cached', cache
      ? 'offline · showing cached snapshot'
      : 'rate limited by GitHub · showing last known snapshot');
  });
})();

console.log('Inosh Matheesha // Cyber Security Portfolio Ready');
