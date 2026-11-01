/* ============================================================
   LET Reviewer PH - Website Scripts
   ============================================================ */

// ─── Navbar scroll effect ───────────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ─── Mobile menu ────────────────────────────────────────────
function toggleMobileMenu() {
    let nav = document.querySelector('.mobile-nav');

    // Create mobile nav on first call
    if (!nav) {
        nav = document.createElement('div');
        nav.className = 'mobile-nav';
        nav.innerHTML = `
            <a href="#features" onclick="closeMobileMenu()">Features</a>
            <a href="#subjects" onclick="closeMobileMenu()">Subjects</a>
            <a href="#download" onclick="closeMobileMenu()">Download</a>
            <a href="#faq"      onclick="closeMobileMenu()">FAQ</a>
        `;
        document.body.appendChild(nav);
    }

    nav.classList.toggle('open');

    // Animate hamburger lines
    const spans = document.querySelectorAll('.mobile-menu-btn span');
    const isOpen = nav.classList.contains('open');
    if (spans.length === 3) {
        spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
        spans[1].style.opacity  = isOpen ? '0' : '1';
        spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
    }
}

function closeMobileMenu() {
    const nav = document.querySelector('.mobile-nav');
    if (nav) nav.classList.remove('open');
    document.querySelectorAll('.mobile-menu-btn span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '1';
    });
}

// Close on outside click
document.addEventListener('click', e => {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.mobile-nav');
    if (nav && btn && !btn.contains(e.target) && !nav.contains(e.target)) {
        closeMobileMenu();
    }
});

// ─── Download counter ────────────────────────────────────────
function trackDownload() {
    const key = 'let_reviewer_downloads';
    const count = (parseInt(localStorage.getItem(key) || '0')) + 1;
    localStorage.setItem(key, count);
    updateDownloadCount();
}

function updateDownloadCount() {
    const el = document.getElementById('downloadCount');
    if (!el) return;
    const stored = parseInt(localStorage.getItem('let_reviewer_downloads') || '0');
    // Seed with a realistic base so it doesn't start from 0
    const displayed = stored + 142;
    el.textContent = displayed >= 1000
        ? (displayed / 1000).toFixed(1) + 'k'
        : displayed;
}

// ─── Scroll-driven fade-up animations ───────────────────────
function initFadeUp() {
    const targets = document.querySelectorAll(
        '.feature-card, .subject-category, .faq-item, .section-header, ' +
        '.download-info, .download-instructions'
    );

    targets.forEach(el => el.classList.add('fade-up'));

    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger delay based on position among siblings
                const siblings = Array.from(entry.target.parentElement.children);
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${idx * 70}ms`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach(el => observer.observe(el));
}

// ─── Active nav link highlight ──────────────────────────────
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => observer.observe(s));
}

// Active nav link style (injected once)
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--primary) !important; }`;
document.head.appendChild(style);

// ─── Animated counter for stats ─────────────────────────────
function animateCounter(el, target, suffix = '') {
    const duration = 1400;
    const start    = performance.now();
    const from     = 0;

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value    = Math.round(from + (target - from) * eased);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el   = entry.target;
                const text = el.textContent.trim();
                if (text === '29')   animateCounter(el, 29);
                if (text === '100%') { animateCounter(el, 100); el.dataset.suffix = '%'; }
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
}

// ─── Smooth scroll polyfill for older browsers ──────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ─── Admin password modal ────────────────────────────────────
const ADMIN_PASSWORD = 'Crisalameda09';

function openAdminModal(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('adminPassword').focus();
    }
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminError').style.display = 'none';
    }
}

function verifyAdminPassword() {
    const input = document.getElementById('adminPassword');
    const error = document.getElementById('adminError');
    const password = input.value.trim();
    
    if (!password) {
        showAdminError('Please enter a password');
        return;
    }
    
    if (password === ADMIN_PASSWORD) {
        // Password correct - set session and redirect to admin portal
        closeAdminModal();
        showSuccessNotification('✅ Access granted! Redirecting...');
        
        // Set session authentication
        sessionStorage.setItem('admin_authenticated', 'true');
        
        setTimeout(() => {
            window.location.href = 'dev-keygen.html?auth=true';
        }, 800);
    } else {
        // Wrong password
        showAdminError('❌ Incorrect password. Access denied.');
    }
}

function showAdminError(message) {
    const error = document.getElementById('adminError');
    error.textContent = message;
    error.style.display = 'block';
    
    // Shake animation
    const input = document.getElementById('adminPassword');
    input.style.animation = 'shake 0.5s';
    setTimeout(() => input.style.animation = '', 500);
}

// Close admin modal on outside click
window.addEventListener('click', e => {
    const adminModal = document.getElementById('adminModal');
    if (e.target === adminModal) {
        closeAdminModal();
    }
});

// Enter key to verify admin password
document.addEventListener('keypress', e => {
    const adminModal = document.getElementById('adminModal');
    if (adminModal && adminModal.style.display === 'flex' && e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.id === 'adminPassword') {
            verifyAdminPassword();
        }
    }
});

// ─── Code verification modal ─────────────────────────────────
function openCodeModal() {
    const modal = document.getElementById('codeModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('codeInput').focus();
    }
}

function closeCodeModal() {
    const modal = document.getElementById('codeModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('codeInput').value = '';
        document.getElementById('codeError').style.display = 'none';
    }
}

function verifyAndDownload() {
    const input = document.getElementById('codeInput');
    const code  = input.value.trim().toUpperCase();
    const btn   = document.querySelector('.btn-verify');

    if (!code || code.length !== 6) {
        showError('Please enter a 6-character code');
        return;
    }

    // Show loading state
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Verifying...'; }
    document.getElementById('codeError').style.display = 'none';

    window.CodeManager.verifyCode(code)
        .then(function(result) {
            if (!result.valid) {
                showError(result.message === 'Invalid code'
                    ? '❌ Invalid code. Please check and try again.'
                    : '⚠️ This code has already been used.');
                if (btn) { btn.disabled = false; btn.textContent = '✅ Verify & Download'; }
                return;
            }

            // Valid — mark as used then download
            return window.CodeManager.markCodeAsUsed(code).then(function() {
                trackDownload();
                closeCodeModal();
                showSuccessNotification('✅ Code verified! Download starting...');
                if (btn) { btn.disabled = false; btn.textContent = '✅ Verify & Download'; }
                setTimeout(function() {
                    const link = document.createElement('a');
                    link.href     = 'LETReviewer.apk';
                    link.download = 'LET-Reviewer-PH.apk';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }, 500);
            });
        })
        .catch(function(err) {
            console.error('Verify error:', err);
            showError('⚠️ Connection error. Please try again.');
            if (btn) { btn.disabled = false; btn.textContent = '✅ Verify & Download'; }
        });
}

function showError(message) {
    const error = document.getElementById('codeError');
    error.textContent = message;
    error.style.display = 'block';
    
    // Shake animation
    const input = document.getElementById('codeInput');
    input.style.animation = 'shake 0.5s';
    setTimeout(() => input.style.animation = '', 500);
}

function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Close modal on outside click
window.addEventListener('click', e => {
    const modal = document.getElementById('codeModal');
    if (e.target === modal) {
        closeCodeModal();
    }
});

// Enter key to verify
document.addEventListener('keypress', e => {
    const modal = document.getElementById('codeModal');
    if (modal && modal.style.display === 'flex' && e.key === 'Enter') {
        verifyAndDownload();
    }
});

// ─── Hidden developer access (Konami-style) ──────────────────
let clickSequence = [];
const secretPattern = ['logo-icon', 'logo-icon', 'logo-icon']; // Triple-click logo
let lastClickTime = 0;

document.addEventListener('click', e => {
    if (!e.target.classList.contains('logo-icon')) return;
    
    const now = Date.now();
    if (now - lastClickTime > 1000) {
        clickSequence = [];
    }
    lastClickTime = now;
    
    clickSequence.push('logo-icon');
    if (clickSequence.length > secretPattern.length) {
        clickSequence.shift();
    }
    
    if (JSON.stringify(clickSequence) === JSON.stringify(secretPattern)) {
        clickSequence = [];
        // Show admin modal instead of direct redirect
        openAdminModal();
    }
});

// ─── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateDownloadCount();
    initFadeUp();
    initActiveNav();
    initCounters();
});
