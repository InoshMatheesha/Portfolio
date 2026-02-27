
// ========== VARIABLES ==========
const typedTextElement = document.getElementById('typed-text');
const themeToggle = document.getElementById('theme-toggle');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const cursorFollower = document.querySelector('.cursor-follower');

// Hide cursor follower (removed for professional look)
if (cursorFollower) {
    cursorFollower.style.display = 'none';
}

// Typing animation texts
const typingTexts = [
    'Building secure systems...',
    'Researching USB HID attacks...',
    'Exploring email security...',
    'Creating browser extensions...',
    'Automating security tools...',
    'Penetration testing...'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

// ========== TYPING ANIMATION ==========
function typeText() {
    const currentText = typingTexts[textIndex];

    if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typingSpeed = 500;
    }

    setTimeout(typeText, typingSpeed);
}

// Start typing animation
setTimeout(typeText, 1000);

// ========== THEME TOGGLE ==========
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLightMode = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
}

themeToggle.addEventListener('click', toggleTheme);

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = document.querySelector('.glass-nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== NAVIGATION ACTIVE STATE ==========
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ========== CARD HOVER GLOW EFFECT (Subtle) ==========
const glassCards = document.querySelectorAll('.glass-card');

glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ========== 3D TILT ON ALL CARDS ==========
const tiltCards = document.querySelectorAll('.showcase-card, .project-card, .article-card, .contact-info, .contact-form');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;   // max ±6deg
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ========== PROJECT ICON CURSOR-REACTIVE 3D ==========
document.querySelectorAll('.project-icon-wrap').forEach(wrap => {
    const icon = wrap.querySelector('.project-icon');

    wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width  / 2;
        const cy = rect.height / 2;

        // Normalise -1 → +1 relative to center
        const nx = (x - cx) / cx;
        const ny = (y - cy) / cy;

        // Map to degrees: horizontal cursor → rotateY, vertical → rotateX
        const ry =  nx * 28;   // max ±28deg left-right
        const rx = -ny * 22;   // max ±22deg up-down

        icon.style.setProperty('--icon-rx', `${ry}deg`);
        icon.style.setProperty('--icon-ry', `${rx}deg`);

        // Specular highlight position relative to icon
        const iRect = icon.getBoundingClientRect();
        const ix = ((e.clientX - iRect.left) / iRect.width)  * 100;
        const iy = ((e.clientY - iRect.top)  / iRect.height) * 100;
        icon.style.setProperty('--shine-x', `${ix}%`);
        icon.style.setProperty('--shine-y', `${iy}%`);
    });

    wrap.addEventListener('mouseleave', () => {
        // Spring back smoothly
        icon.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s ease';
        icon.style.setProperty('--icon-rx', '0deg');
        icon.style.setProperty('--icon-ry', '0deg');

        // Revert to snappy transition after spring-back
        setTimeout(() => {
            icon.style.transition = '';
        }, 620);
    });
});

// ========== 3D MIST SCROLL REVEAL ==========
const scrollElements = document.querySelectorAll('[data-scroll]');
let lastScrollY = window.scrollY;

const scrollObserver = new IntersectionObserver((entries) => {
    const scrollingDown = window.scrollY >= lastScrollY;
    lastScrollY = window.scrollY;

    entries.forEach(entry => {
        const el = entry.target;
        const anim = el.dataset.scroll;

        if (entry.isIntersecting) {
            // Remove directional class so CSS base hidden state takes over briefly,
            // then add is-visible to crystallise
            el.classList.remove('from-top');
            // tiny rAF so the browser registers the class removal before re-adding visible
            requestAnimationFrame(() => {
                requestAnimationFrame(() => el.classList.add('is-visible'));
            });
        } else {
            el.classList.remove('is-visible');
            // When leaving viewport apply directional from-top for up-scroll re-entry
            if (!scrollingDown) {
                el.classList.add('from-top');
            } else {
                el.classList.remove('from-top');
            }
        }
    });
}, {
    threshold: 0.10,
    rootMargin: '0px 0px -50px 0px'
});

window.addEventListener('scroll', () => { lastScrollY = window.scrollY; }, { passive: true });

scrollElements.forEach(el => scrollObserver.observe(el));

// ========== GRADIENT MESH ANIMATION (Subtle) ==========
const gradientMesh = document.querySelector('.gradient-mesh');
if (gradientMesh) {
    let hue = 0;
    setInterval(() => {
        hue = (hue + 0.5) % 360;  // Slower hue rotation
        gradientMesh.style.filter = `hue-rotate(${hue}deg)`;
    }, 100);
}

// ========== CONTACT FORM SUBMISSION ==========
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Show loading state
        formStatus.textContent = 'Sending...';
        formStatus.className = 'form-status';
        formStatus.style.display = 'block';

        try {
            // Discord Webhook (encoded)
            const _0x = ['aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQ0NDQxNTc0MzI4NTI2NDU5NC9NMk5IeTFMZVZPd2xuc3Y2SjlyVHJwOUNaZE1qbXVJQ2hsSGlG', 'WkpTMEwydUFiYlhROTY4cGlLZkZGelB1bzM3c01EZw=='];
            const webhookUrl = atob(_0x[0] + _0x[1]);

            const embed = {
                embeds: [{
                    title: '📬 New Portfolio Contact Message',
                    color: 0x00f5ff,
                    fields: [
                        {
                            name: '👤 Name',
                            value: formData.name,
                            inline: true
                        },
                        {
                            name: '📧 Email',
                            value: formData.email,
                            inline: true
                        },
                        {
                            name: '📋 Subject',
                            value: formData.subject,
                            inline: false
                        },
                        {
                            name: '💬 Message',
                            value: formData.message,
                            inline: false
                        }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: 'Sent from Portfolio Contact Form'
                    }
                }]
            };

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(embed)
            });

            if (response.ok) {
                formStatus.textContent = '✅ Message sent successfully!';
                formStatus.className = 'form-status success';
                contactForm.reset();

                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            formStatus.textContent = '❌ Failed to send message. Please try again.';
            formStatus.className = 'form-status error';
        }
    });
}

// ========== RIPPLE EFFECT ON BUTTONS ==========
const buttons = document.querySelectorAll('.cta-btn, .glass-btn');

buttons.forEach(button => {
    button.addEventListener('click', function (e) {
        // Remove any existing ripples first
        const existingRipples = this.querySelectorAll('.ripple');
        existingRipples.forEach(r => r.remove());
        
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.5s ease-out forwards;
            pointer-events: none;
            z-index: 0;
        `;
        ripple.className = 'ripple';

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 500);
    });
});

// Add ripple CSS
const style = document.createElement('style');
style.textContent = `
    .cta-btn, .glass-btn {
        position: relative !important;
        overflow: hidden !important;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== SCROLL PROGRESS INDICATOR ==========
function updateScrollProgress() {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    // Can be used for progress bar if needed
}

window.addEventListener('scroll', updateScrollProgress);

// ========== PERFORMANCE OPTIMIZATION ==========
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('scroll', debounce(() => {
    updateActiveNav();
    updateScrollProgress();
}, 10));

// ========== EASTER EGG (Console Message) ==========
console.log(
    '%c🔐 Cyber Security Portfolio',
    'font-size: 24px; font-weight: bold; color: #00f5ff; text-shadow: 0 0 10px #00f5ff;'
);
console.log(
    '%c👋 Hey there! Interested in security? Let\'s connect!',
    'font-size: 14px; color: #ff00ff;'
);
console.log(
    '%c🔗 GitHub: https://github.com/InoshMatheesha',
    'font-size: 12px; color: #00f5ff;'
);

// ========== LOADING ANIMATION ==========
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ========== MOBILE MENU TOGGLE ==========
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinksContainer = document.querySelector('.nav-links');

if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });
}

console.log('🚀 Portfolio loaded successfully!');
