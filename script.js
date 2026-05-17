/* ═══════════════════════════════════════════════════════
   DUNGARPUR PROPERTY – D.S GROUP  |  script.js
═══════════════════════════════════════════════════════ */

/* ── GOLD PARTICLE SYSTEM ── */
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 70;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = -(Math.random() * 0.5 + 0.1);
    this.alpha = Math.random() * 0.6 + 0.1;
    this.life = 1;
    this.decay = Math.random() * 0.003 + 0.001;
    // random gold hues
    const hue = Math.floor(Math.random() * 15 + 38);
    this.color = `hsl(${hue}, 75%, 60%)`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    this.alpha = this.life * 0.7;
    if (this.life <= 0 || this.y < 0) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height; // spread initial positions
    particles.push(p);
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();
window.addEventListener('resize', () => { resizeCanvas(); });


/* ── HERO SLIDER ── */
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let sliderInterval;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function startSlider() {
  sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(sliderInterval);
    goToSlide(i);
    startSlider();
  });
});

startSlider();


/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});


/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
  document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const index = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

reveals.forEach(el => revealObserver.observe(el));


/* ── COUNTER ANIMATION ── */
const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;

function startCounters() {
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };
    requestAnimationFrame(update);
  });
}

const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    setTimeout(startCounters, 1400);
  }
}, { threshold: 0.5 });

const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);


/* ── PROPERTY FILTER ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const propCards = document.querySelectorAll('.prop-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    propCards.forEach(card => {
      const type = card.dataset.type;
      if (filter === 'all' || type === filter) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      } else {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  });
});


/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Send Enquiry ✈';
      btn.style.opacity = '1';
      btn.disabled = false;
      formSuccess.style.display = 'block';
      contactForm.reset();

      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 5000);
    }, 1200);
  });
}


/* ── SMOOTH SCROLL FOR ANCHOR LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ── GALLERY LIGHTBOX ── */
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:rgba(0,0,0,0.95);
      display:flex;align-items:center;justify-content:center;
      cursor:zoom-out;animation:fadeIn 0.3s ease;
      padding:2rem;
    `;
    const style = document.createElement('style');
    style.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}';
    document.head.appendChild(style);

    const lbImg = document.createElement('img');
    lbImg.src = img.src;
    lbImg.style.cssText = `
      max-width:90%;max-height:85vh;
      border-radius:12px;
      border:2px solid rgba(201,168,76,0.4);
      box-shadow:0 0 60px rgba(201,168,76,0.2);
      object-fit:contain;
    `;

    const close = document.createElement('button');
    close.innerHTML = '✕';
    close.style.cssText = `
      position:fixed;top:1.5rem;right:1.5rem;
      background:rgba(201,168,76,0.2);border:1px solid rgba(201,168,76,0.5);
      color:#c9a84c;width:44px;height:44px;border-radius:50%;
      font-size:1.1rem;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
    `;

    lightbox.appendChild(lbImg);
    lightbox.appendChild(close);
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    function closeLightbox() {
      document.body.removeChild(lightbox);
      document.body.style.overflow = '';
    }

    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    close.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); }, { once: true });
  });
});


/* ── CURSOR GLOW EFFECT (Desktop) ── */
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;pointer-events:none;z-index:9998;
    width:300px;height:300px;border-radius:50%;
    background:radial-gradient(circle,rgba(201,168,76,0.04) 0%,transparent 70%);
    transform:translate(-50%,-50%);
    transition:left 0.15s ease,top 0.15s ease;
    left:-999px;top:-999px;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}


/* ── ADD CSS TRANSITION ON PAGE LOAD ── */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 10);
});
