// ============================================
// CYBER BENTO GRID - PROFESSIONAL JAVASCRIPT
// Refined Animations and Interactions
// ============================================

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
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
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

// ========== SCROLL REVEAL ANIMATION ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.bento-card, .project-card, .section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

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
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.className = 'ripple';

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple CSS
const style = document.createElement('style');
style.textContent = `
    .cta-btn, .glass-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
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
