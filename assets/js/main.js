/* ===================================================
   AntyGravity Photography – Main JavaScript
   =================================================== */

// ─── Page Transition ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('.page-transition');

  // Exit animation on load
  if (overlay) {
    overlay.classList.add('exit');
    setTimeout(() => overlay.classList.remove('exit'), 600);
  }

  // Intercept internal links
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http') &&
        !href.startsWith('mailto') && !href.startsWith('tel') &&
        !href.startsWith('whatsapp')) {
      link.addEventListener('click', e => {
        e.preventDefault();
        if (overlay) {
          overlay.classList.add('enter');
          setTimeout(() => { window.location.href = href; }, 500);
        } else {
          window.location.href = href;
        }
      });
    }
  });
});

// ─── Navbar scroll ────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ─── Mobile Menu ──────────────────────────────────
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileOverlay = document.querySelector('.mobile-overlay');
const mobileClose = document.querySelector('.mobile-close');

function openMenu() {
  mobileMenu && mobileMenu.classList.add('open');
  mobileOverlay && mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu && mobileMenu.classList.remove('open');
  mobileOverlay && mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

menuToggle && menuToggle.addEventListener('click', openMenu);
mobileOverlay && mobileOverlay.addEventListener('click', closeMenu);
mobileClose && mobileClose.addEventListener('click', closeMenu);

// ─── Scroll Reveal Animations ─────────────────────
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

if (revealElements.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger child elements
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach((el, i) => {
    el.dataset.delay = el.dataset.delay || (i % 4) * 100;
    revealObserver.observe(el);
  });
}

// ─── Cursor Glow ──────────────────────────────────
const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

// ─── Lazy Image Loading ───────────────────────────
document.querySelectorAll('img[data-src]').forEach(img => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;
        image.src = image.dataset.src;
        image.removeAttribute('data-src');
        observer.unobserve(image);
      }
    });
  });
  observer.observe(img);
});

// ─── Lightbox ─────────────────────────────────────
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbImg = lightbox.querySelector('img');
  const lbClose = lightbox.querySelector('.lightbox-close');
  const lbPrev = lightbox.querySelector('.lightbox-prev');
  const lbNext = lightbox.querySelector('.lightbox-next');

  let images = [];
  let currentIdx = 0;

  function openLightbox(src, idx, imgList) {
    images = imgList;
    currentIdx = idx;
    lbImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIdx = (currentIdx + dir + images.length) % images.length;
    lbImg.src = images[currentIdx];
  }

  lbClose && lbClose.addEventListener('click', closeLightbox);
  lbPrev  && lbPrev.addEventListener('click',  () => navigate(-1));
  lbNext  && lbNext.addEventListener('click',  () => navigate(1));

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Attach click to all gallery items
  const galleryItems = document.querySelectorAll('.gallery-item');
  const srcs = Array.from(galleryItems).map(item => item.dataset.full || item.querySelector('img')?.src);

  galleryItems.forEach((item, idx) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => openLightbox(srcs[idx], idx, srcs));
  });
}

initLightbox();

// ─── Portfolio Filter ─────────────────────────────
function initPortfolioFilter() {
  const filters = document.querySelectorAll('.filter-btn');
  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      document.querySelectorAll('.gallery-item').forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.style.opacity = '0';
          item.style.pointerEvents = 'none';
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.pointerEvents = 'none';
          setTimeout(() => item.style.display = 'none', 300);
        }
        item.style.transition = 'opacity 0.3s ease';
      });
    });
  });
}

initPortfolioFilter();

// ─── Testimonial Slider ────────────────────────────
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-track');
  if (!slider) return;

  const slides = slider.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let current = 0;
  let autoplay;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function startAutoplay() {
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }

  // Initialize
  if (slides.length) {
    slides[0].classList.add('active');
    dots[0] && dots[0].classList.add('active');
    startAutoplay();

    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    prevBtn && prevBtn.addEventListener('click', () => { clearInterval(autoplay); goTo(current - 1); startAutoplay(); });
    nextBtn && nextBtn.addEventListener('click', () => { clearInterval(autoplay); goTo(current + 1); startAutoplay(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(autoplay); goTo(i); startAutoplay(); }));
  }
}

initTestimonialSlider();

// ─── Counter Animation ────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current) + (el.dataset.suffix || '');
      }, 16);

      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
}

initCounters();

// ─── Contact Form ─────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#4caf50';
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}

// ─── Parallax Hero ────────────────────────────────
const heroSection = document.querySelector('.hero');
if (heroSection && window.matchMedia('(min-width: 769px)').matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroImg = heroSection.querySelector('.hero-bg');
    if (heroImg) {
      heroImg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  }, { passive: true });
}

// ─── Active nav link ──────────────────────────────
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-link').forEach(link => {
  const linkPage = link.getAttribute('href');
  if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
    link.classList.add('active');
  }
});
