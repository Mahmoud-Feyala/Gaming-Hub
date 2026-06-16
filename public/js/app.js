'use strict';

// ============================================
// VIEW — UI Components & Helpers
// ============================================
const View = {
  // Render Stars
  renderStars(rating, interactive = false) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;

    let html = `<div class="stars${interactive ? ' interactive-stars' : ''}">`;

    for (let i = 1; i <= 5; i++) {
      if (i <= full) {
        html += `<span class="star filled" data-val="${i}">★</span>`;
      } else if (i === full + 1 && half) {
        html += `<span class="star half" data-val="${i}">★</span>`;
      } else {
        html += `<span class="star" data-val="${i}">★</span>`;
      }
    }

    html += `</div>`;
    return html;
  },

  // Toast Messages
  showToast(message, type = 'info') {
    const container =
      document.querySelector('.toast-container') ||
      (() => {
        const c = document.createElement('div');
        c.className = 'toast-container';
        document.body.appendChild(c);
        return c;
      })();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3200);
  },

  // Open Modal
  openModal(content) {
    const overlay = document.createElement('div');

    overlay.className = 'modal-overlay';

    overlay.innerHTML = `
      <div class="modal">
        ${content}
      </div>
    `;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    document.body.appendChild(overlay);

    return overlay;
  }
};

// ============================================
// APP — Frontend Routing & Event Listeners
// ============================================
const App = {

  init() {
    this.setupMobileNav();
    this.setupActiveNav();
    this.setupThemeToggle();
    this.setupStarInteractions();
    this.setupSearchFilter();
    this.dispatch();
  },

  // ============================================
  // ROUTING
  // ============================================
  dispatch() {
    const path = window.location.pathname.toLowerCase();

    if (path === '/' || path === '/index.html') {
      this.initHome();
    }

    else if (path.startsWith('/games')) {
      this.initGames();
    }

    else if (path.startsWith('/game-details')) {
      this.initGameDetails();
    }

    else if (path.startsWith('/library')) {
      this.initLibrary();
    }

    else if (path.startsWith('/admin-games')) {
      this.initAdminGames();
    }

    else if (path.startsWith('/admin-add-game')) {
      this.initAdminAddGame();
    }

    else if (path.startsWith('/admin')) {
      this.initAdminDashboard();
    }

    else if (path.startsWith('/login')) {
      this.initLogin();
    }

    else if (path.startsWith('/register')) {
      this.initRegister();
    }
  },

  // ============================================
  // ACTIVE NAVBAR
  // ============================================
  setupActiveNav() {
    const currentPath = window.location.pathname.toLowerCase();

    document.querySelectorAll('.nav-link').forEach(link => {

      const linkPath = link.getAttribute('href').toLowerCase();

      // remove active from all
      link.classList.remove('active');

      // Home
      if (
        (currentPath === '/' || currentPath === '/index.html') &&
        linkPath === '/'
      ) {
        link.classList.add('active');
      }

      // Other pages
      else if (
        currentPath.startsWith(linkPath) &&
        linkPath !== '/'
      ) {
        link.classList.add('active');
      }
    });
  },

  // ============================================
  // MOBILE NAV
  // ============================================
  // ============================================
  // THEME TOGGLER
  setupThemeToggle() {
    const themeButton = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('site-theme');
    const theme = savedTheme || 'dark';

    const applyTheme = (value) => {
      document.documentElement.dataset.theme = value;
      if (themeButton) {
        themeButton.textContent = value === 'dark' ? 'Light Mode' : 'Dark Mode';
        themeButton.setAttribute('aria-label', value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      }
      localStorage.setItem('site-theme', value);
    };

    applyTheme(theme);

    if (themeButton) {
      themeButton.addEventListener('click', () => {
        applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
      });
    }
  },

  // ============================================
  // MOBILE NAV
  setupMobileNav() {

    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.navbar-nav');

    if (hamburger && mobileMenu) {

      hamburger.addEventListener('click', () => {

        const isOpen =
          mobileMenu.classList.contains('mobile-open');

        if (isOpen) {
          mobileMenu.classList.remove('mobile-open');
        }

        else {
          mobileMenu.classList.add('mobile-open');
        }
      });
    }
  },

  // ============================================
  // SEARCH & FILTER
  // ============================================
  setupSearchFilter() {

    const searchInput = document.querySelector('.search-input');
    const filterButtons = Array.from(document.querySelectorAll('.filter-tag'));
    const gamesGrid = document.getElementById('games-grid');
    const gamesCount = document.getElementById('games-count');
    let activeFilter = 'all';
    let activeQuery = '';
    const batchSize = 20;
    let shownCount = batchSize;

    const updateGamesCount = (visibleCount) => {
      if (gamesCount) {
        const total = document.querySelectorAll('.game-card').length;
        gamesCount.textContent = `Showing ${visibleCount} of ${total} games`;
      }
    };

    const applySearchFilter = () => {
      const cards = Array.from(document.querySelectorAll('.game-card'));
      const query = activeQuery.trim().toLowerCase();

      let visibleCount = 0;

      cards.forEach(card => {
        const idx = parseInt(card.dataset.index || '0', 10);
        const title = (card.dataset.title || '').toLowerCase();
        const genre = (card.dataset.genre || '').toLowerCase();
        const developer = (card.dataset.developer || '').toLowerCase();

        const matchesQuery = !query ||
          title.includes(query) ||
          genre.includes(query) ||
          developer.includes(query);

        const matchesFilter =
          activeFilter === 'all' ||
          genre === activeFilter;

        const shouldShow = matchesQuery && matchesFilter;

        if (!shouldShow) {
          card.style.display = 'none';
        } else {
          // If there is an active query or filter other than 'all', show all matching results
          if (query || activeFilter !== 'all') {
            card.style.display = '';
            visibleCount += 1;
          } else {
            // Enforce pagination when no filter/search is active
            if (idx < shownCount) {
              card.style.display = '';
              visibleCount += 1;
            } else {
              card.style.display = 'none';
            }
          }
        }
      });

      updateGamesCount(visibleCount);

      if (gamesGrid) {
        const emptyMessage = gamesGrid.querySelector('.no-results-message');

        if (visibleCount === 0) {
          if (!emptyMessage) {
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.style.gridColumn = '1 / -1';
            message.style.textAlign = 'center';
            message.style.padding = '40px';
            message.style.border = '2px dashed rgba(17,17,17,0.3)';
            message.style.borderRadius = '8px';
            message.style.fontFamily = 'var(--font-mono)';
            message.style.color = 'rgba(17,17,17,0.6)';
            message.textContent = 'No games found. Try a different search or filter.';
            gamesGrid.appendChild(message);
          }
        } else if (emptyMessage) {
          emptyMessage.remove();
        }
      }
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        activeQuery = e.target.value;
        applySearchFilter();
      });
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        activeFilter = btn.dataset.filter || 'all';
        applySearchFilter();
      });
    });

    applySearchFilter();

    // Expose pagination control to other App methods
    App.gamesPagination = {
      increase() {
        const total = document.querySelectorAll('.game-card').length;
        shownCount = Math.min(total, shownCount + batchSize);
        applySearchFilter();
      },
      isAllShown() {
        return shownCount >= document.querySelectorAll('.game-card').length;
      }
    };
  },

  // ============================================
  // STAR INTERACTIONS
  // ============================================
  setupStarInteractions() {

    document.querySelectorAll('.interactive-stars').forEach(container => {

      const stars = container.querySelectorAll('.star');

      let selectedRating = 0;

      stars.forEach((star, index) => {

        star.addEventListener('mouseover', () => {

          stars.forEach((s, i) => {
            s.classList.toggle('filled', i <= index);
          });

        });

        star.addEventListener('mouseout', () => {

          stars.forEach((s, i) => {
            s.classList.toggle('filled', i < selectedRating);
          });

        });

        star.addEventListener('click', () => {

          selectedRating = index + 1;

          const input = container
            .closest('form')
            ?.querySelector('input[name="rating"]');

          if (input) {
            input.value = selectedRating;
          }
        });
      });
    });
  },

  // ============================================
  // USER PAGES
  // ============================================
  initHome() {
    console.log('Home page loaded');
  },

  initGames() {
    // Pagination: Load more button handling
    const loadBtn = document.getElementById('loadMoreBtn');

    if (loadBtn) {
      loadBtn.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        const prevText = btn.textContent;
        btn.textContent = 'Loading...';

        setTimeout(() => {
          if (App.gamesPagination) {
            App.gamesPagination.increase();
          }

          // hide button if all shown
          if (App.gamesPagination && App.gamesPagination.isAllShown()) {
            btn.style.display = 'none';
          } else {
            btn.disabled = false;
            btn.textContent = prevText;
          }
        }, 400);
      });
    }

    console.log('Games page loaded');
  },

  initGameDetails() {

    const params = new URLSearchParams(window.location.search);

    const gameId = params.get('id');

    console.log('Game Details ID:', gameId);

    const addLibraryForm = document.getElementById('add-to-library-form');

    window.handleAddToLibraryClick = (e, formGameId) => {
      e.preventDefault();
      View.showToast('Game added to your library!', 'success');
      setTimeout(() => addLibraryForm?.submit(), 250);
    };

    const reviewForm =
      document.getElementById('add-review-form');

    if (reviewForm) {

      reviewForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        const text =
          reviewForm.querySelector('[name="review-text"]')?.value;

        const rating =
          reviewForm.querySelector('[name="rating"]')?.value || 5;

        if (!text.trim()) {

          View.showToast(
            'Please write your review!',
            'error'
          );

          return;
        }

        View.showToast(
          'Sending review to backend...',
          'info'
        );
      });
    }
  },

  initLibrary() {

    console.log('Library page loaded');

    document.querySelectorAll('.tab-btn').forEach(btn => {

      btn.addEventListener('click', () => {

        document.querySelectorAll('.tab-btn')
          .forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        const tab = btn.dataset.tab;

        console.log('Library tab:', tab);
      });
    });
  },

  // ============================================
  // ADMIN PAGES
  // ============================================
  initAdminDashboard() {
    console.log('Admin Dashboard loaded');
  },

  initAdminGames() {

    const tableBody =
      document.getElementById('admin-table-body');

    if (tableBody) {

      tableBody.addEventListener('click', (e) => {

        if (e.target.classList.contains('btn-danger')) {

          const gameId = e.target.dataset.id;

          if (confirm(
            'Are you sure you want to delete this game?'
          )) {

            View.showToast(
              `Game deleted (Backend API needed)`,
              'error'
            );
          }
        }
      });
    }
  },

  initAdminAddGame() {

    const addForm =
      document.getElementById('add-game-form');

    if (addForm) {

      addForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        const formData = new FormData(addForm);

        const data =
          Object.fromEntries(formData.entries());

        View.showToast(
          'Preparing to send data to backend API...',
          'info'
        );

        console.log('Game Data payload:', data);
      });
    }
  },

  // ============================================
  // LOGIN
  // ============================================
  initLogin() {

    const form =
      document.getElementById('login-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {

      e.preventDefault();

      const btn =
        form.querySelector('[type="submit"]');

      btn.textContent = 'Logging in...';

      btn.disabled = true;

      setTimeout(() => {

        View.showToast(
          'Backend connection required',
          'info'
        );

        btn.disabled = false;

        btn.textContent = 'Login to Account →';

      }, 1000);
    });
  },

  // ============================================
  // REGISTER
  // ============================================
  initRegister() {

    const form =
      document.getElementById('register-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {

      e.preventDefault();

      const pass =
        form.querySelector('[name="password"]')?.value;

      const confirm =
        form.querySelector('[name="confirm"]')?.value;

      if (pass !== confirm) {

        View.showToast(
          'Passwords do not match!',
          'error'
        );

        return;
      }

      const btn =
        form.querySelector('[type="submit"]');

      btn.textContent = 'Creating account...';

      btn.disabled = true;

      setTimeout(() => {

        View.showToast(
          'Backend connection required',
          'info'
        );

        btn.disabled = false;

        btn.textContent = 'Create Free Account →';

      }, 1000);
    });

    // Password Strength
    const passInput =
      form.querySelector('[name="password"]');

    const strengthBar =
      document.getElementById('password-strength');

    if (passInput && strengthBar) {

      passInput.addEventListener('input', (e) => {

        const val = e.target.value;

        let strength = 0;

        if (val.length >= 8) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++;

        const colors = [
          '#FF4444',
          '#FF6B35',
          '#FFC107',
          '#22C55E'
        ];

        strengthBar.style.width =
          `${strength * 25}%`;

        strengthBar.style.background =
          colors[strength - 1] || '#ddd';
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {

  /* ── Slider + Dots ── */
  const slides = document.querySelectorAll('.slider-image');
  const dotsContainer = document.getElementById('sliderDots');

  if (slides.length && dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');
    let current = 0;

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    setInterval(() => goTo((current + 1) % slides.length), 4000);
  }

  /* ── Back to Top ── */
  const backBtn = document.getElementById('backToTop');

  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('visible', window.scrollY > 400);
    });

    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});

// ============================================
// BOOT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});