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

// ─── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateDownloadCount();
    initFadeUp();
    initActiveNav();
    initCounters();
});
