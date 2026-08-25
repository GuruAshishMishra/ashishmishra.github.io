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

  // Project filters + Load More
  const INITIAL_VISIBLE = 6;
  const LOAD_MORE_COUNT = 3;
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCols = Array.from(document.querySelectorAll('#projects-grid > div'));
  const loadMoreBtn = document.getElementById('load-more-projects');

  let currentFilter = 'all';
  let visibleCount = INITIAL_VISIBLE;

  function getMatchingCols() {
    return projectCols.filter(function (col) {
      const card = col.querySelector('.project-card');
      if (!card) return false;
      const category = card.getAttribute('data-category');
      return currentFilter === 'all' || category === currentFilter;
    });
  }

  function renderProjects() {
    const matching = getMatchingCols();
    const grid = document.getElementById('projects-grid');

    projectCols.forEach(function (col) {
      col.style.display = 'none';
    });

    matching.forEach(function (col, index) {
      if (index < visibleCount) {
        col.style.display = '';
      }
    });

    if (loadMoreBtn) {
      loadMoreBtn.classList.toggle('is-hidden', matching.length <= visibleCount);
    }

    if (grid) {
      grid.classList.add('is-ready');
    }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter');
      visibleCount = INITIAL_VISIBLE;
      renderProjects();
    });
  });

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      visibleCount += LOAD_MORE_COUNT;
      renderProjects();
    });
  }

  renderProjects();

  // Complete project archive from CSV
  (function initProjectArchive() {
    const tbody = document.getElementById('archive-tbody');
    const countEl = document.getElementById('archive-count');
    const searchEl = document.getElementById('archive-search');
    if (!tbody) return;

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function normalizeUrl(raw) {
      const value = (raw || '').trim();
      if (!value) return '';
      if (/^https?:\/\//i.test(value)) return value;
      return 'https://' + value.replace(/^\/\//, '');
    }

    function displayHost(url) {
      try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace(/^www\./, '');
        const path = parsed.pathname.replace(/\/$/, '');
        if (path) return host + path;
        return host;
      } catch (e) {
        return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
      }
    }

    function renderRows(projects, query) {
      const term = (query || '').trim().toLowerCase();
      const filtered = projects.filter(function (project) {
        if (!term) return true;
        return (
          displayHost(project.url).toLowerCase().indexOf(term) !== -1 ||
          project.theme.toLowerCase().indexOf(term) !== -1
        );
      });

      if (!filtered.length) {
        tbody.innerHTML = '<tr><td colspan="3">No matching projects found.</td></tr>';
        return;
      }

      tbody.innerHTML = filtered.map(function (project, index) {
        const host = escapeHtml(displayHost(project.url));
        return (
          '<tr>' +
            '<td>' + (index + 1) + '</td>' +
            '<td><a href="' + escapeHtml(project.url) + '" target="_blank" rel="noopener noreferrer">' + host + '</a></td>' +
            '<td>' + escapeHtml(project.theme) + '</td>' +
          '</tr>'
        );
      }).join('');
    }

    const projects = (window.PROJECT_ARCHIVE || []).map(function (project) {
      return {
        url: normalizeUrl(project.url),
        theme: project.theme || '-'
      };
    });

    if (!projects.length) {
      tbody.innerHTML = '<tr><td colspan="3">Project list could not be loaded. <a href="Project-list.csv" download>Download CSV</a></td></tr>';
      return;
    }

    if (countEl) countEl.textContent = String(projects.length);
    renderRows(projects);
    if (searchEl) {
      searchEl.addEventListener('input', function () {
        renderRows(projects, searchEl.value);
      });
    }
  })();

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
