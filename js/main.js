// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Smooth Scrolling
const scrollLinks = document.querySelectorAll('a.scroll-link');
scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetPosition = document.querySelector(targetId).offsetTop;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

// Canvas Animation for Hero Section
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Add your animation code here
    requestAnimationFrame(animate);
}
animate();

// Form Handling for Waitlist
const form = document.querySelector('.waitlist-form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    // Process form data here (e.g., send to server)
});

// Additional Interactive Features
// Add any other interactive features here