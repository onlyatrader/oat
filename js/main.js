/* ============================================
   ONLY A TRADER - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initHeroCanvas();
    initWaitlistForm();
});

/* --- Navbar scroll effect --- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* --- Mobile menu toggle --- */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* --- Scroll animations (Intersection Observer) --- */
function initScrollAnimations() {
    // Add fade-in class to animatable elements
    const selectors = [
        '.section-header',
        '.about-main p',
        '.about-card',
        '.disclaimer',
        '.feature-card',
        '.education-content',
        '.form-card',
        '.hero-stats'
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('fade-in');
        });
    });

    // Add stagger class to grid containers
    document.querySelectorAll('.features-grid, .about-aside').forEach(el => {
        el.classList.add('stagger-children');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* --- Hero background canvas (subtle chart lines) --- */
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    }

    function drawCandlestickChart(yBase, amplitude, speed, opacity) {
        const w = canvas.width / (window.devicePixelRatio || 1);
        const segments = 60;
        const segWidth = w / segments;

        ctx.strokeStyle = `rgba(37, 99, 235, ${opacity * 0.3})`;
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
            const x = i * segWidth;
            const noise = Math.sin(i * 0.3 + time * speed) * amplitude
                        + Math.sin(i * 0.7 + time * speed * 0.5) * amplitude * 0.5
                        + Math.sin(i * 0.15 + time * speed * 0.3) * amplitude * 0.8;
            const y = yBase + noise;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Draw subtle "candles" at intervals
        for (let i = 2; i < segments; i += 3) {
            const x = i * segWidth;
            const noise = Math.sin(i * 0.3 + time * speed) * amplitude
                        + Math.sin(i * 0.7 + time * speed * 0.5) * amplitude * 0.5;
            const y = yBase + noise;
            const candleHeight = Math.sin(i * 0.5 + time * speed * 0.3) * amplitude * 0.4;

            ctx.fillStyle = candleHeight > 0
                ? `rgba(37, 99, 235, ${opacity * 0.15})`
                : `rgba(217, 119, 6, ${opacity * 0.12})`;

            ctx.fillRect(x - 1.5, y, 3, candleHeight);

            // Wick
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x, y - Math.abs(candleHeight) * 0.3);
            ctx.lineTo(x, y + candleHeight + Math.abs(candleHeight) * 0.3);
            ctx.stroke();
        }
    }

    function drawGrid(opacity) {
        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);

        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 0.3;

        // Horizontal lines
        for (let y = 0; y < h; y += 80) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Vertical lines
        for (let x = 0; x < w; x += 80) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
    }

    function animate() {
        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);

        ctx.clearRect(0, 0, w, h);

        drawGrid(0.015);

        // Multiple chart lines at different positions
        drawCandlestickChart(h * 0.3, 30, 0.008, 0.6);
        drawCandlestickChart(h * 0.55, 25, 0.006, 0.4);
        drawCandlestickChart(h * 0.75, 20, 0.01, 0.3);

        time++;
        animationId = requestAnimationFrame(animate);
    }

    resize();
    animate();

    window.addEventListener('resize', () => {
        resize();
    });

    // Pause animation when not visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    });

    heroObserver.observe(canvas.parentElement.parentElement);
}

/* --- Waitlist form --- */
function initWaitlistForm() {
    const form = document.getElementById('waitlistForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('nameInput').value.trim();
        const email = document.getElementById('emailInput').value.trim();

        if (!name || !email) return;

        // Replace this with your actual form submission logic
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        btn.textContent = 'Kaydedildi!';
        btn.style.background = '#10b981';
        btn.disabled = true;

        form.reset();

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });
}

/* --- Smooth scroll for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
