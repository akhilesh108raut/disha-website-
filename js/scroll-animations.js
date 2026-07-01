/* ============================================================
   PREMIUM SCROLL ANIMATION ENGINE
   Smooth reveal animations triggered on scroll
   ============================================================ */

const ScrollAnimations = {
  init() {
    this.observeElements();
    this.handleScrollbar();
    this.setupSmoothScroll();
  },

  observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    });

    document.querySelectorAll('.scroll-up, .scroll-left, .scroll-right, .scroll-fade').forEach((el) => {
      observer.observe(el);
    });

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });
  },

  handleScrollbar() {
    let scrollTimeout;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Scrollbar hide logic here if needed
      }, 1000);
    }, { passive: true });
  },

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  },

  // Parallax effect for background elements
  setupParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      parallaxElements.forEach((el) => {
        const speed = el.getAttribute('data-parallax') || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, { passive: true });
  },

  // Counter animation for statistics
  animateCounter(element, target, duration = 2000) {
    const start = Date.now();
    const initial = parseInt(element.textContent) || 0;
    const increment = (target - initial) / (duration / 16);

    const animate = () => {
      const elapsed = Date.now() - start;
      const value = Math.min(initial + increment * (elapsed / 16), target);

      if (value !== target) {
        element.textContent = Math.floor(value);
        requestAnimationFrame(animate);
      } else {
        element.textContent = target;
      }
    };

    animate();
  },
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  ScrollAnimations.init();
});

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }
});
