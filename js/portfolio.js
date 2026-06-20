(function () {
  'use strict';

  // Typing animation
  const typingEl = document.getElementById('typing-animation');
  if (typingEl) {
    const texts = [
      'WordPress Developer',
      'Custom Theme Expert',
      'REST API Specialist',
      'Performance Optimizer'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = texts[textIndex];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === current.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        delay = 400;
      }

      setTimeout(type, delay);
    }

    type();
  }

  // Navbar scroll effect
  const navbar = document.getElementById('ftco-navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#ftco-nav .nav-link');

  window.addEventListener('scroll', function () {
    let current = '';
    sections.forEach(function (section) {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.parentElement.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.parentElement.classList.add('active');
      }
    });
  });

  // Hero & above-fold content — show immediately without scroll
  $('.hero-modern .ftco-animate, #home-section .ftco-animate').addClass('fadeInUp ftco-animated');

  // Mobile nav toggle animation (desktop uses Bootstrap collapse)
  const navToggle = document.querySelector('.js-fh5co-nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      this.classList.toggle('active');
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 992) {
          navToggle.classList.remove('active');
          const navCollapse = document.getElementById('ftco-nav');
          if (navCollapse && navCollapse.classList.contains('show')) {
            navCollapse.classList.remove('show');
          }
        }
      });
    });
  }

  // Project filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCols = document.querySelectorAll('#projects-grid > div');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      projectCols.forEach(function (col) {
        const card = col.querySelector('.project-card');
        if (!card) return;
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          col.style.display = '';
        } else {
          col.style.display = 'none';
        }
      });
    });
  });

  // Scroll to top button
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
