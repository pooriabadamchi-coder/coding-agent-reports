(function (global) {
  const projects = [
    { name: 'Luma Finance', category: 'product' },
    { name: 'Pulse Systems', category: 'platform' },
    { name: 'Arc Mobility', category: 'product' }
  ];

  function filterProjects(category) {
    return category === 'all' ? projects.slice() : projects.filter(function (project) { return project.category === category; });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  }

  function init() {
    const menuButton = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.site-nav');
    if (menuButton && nav) {
      menuButton.addEventListener('click', function () {
        const open = nav.classList.toggle('open');
        menuButton.setAttribute('aria-expanded', String(open));
      });
      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); });
      });
    }

    document.querySelectorAll('.filter').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('.filter').forEach(function (item) { item.classList.remove('active'); });
        button.classList.add('active');
        const selected = button.dataset.filter;
        document.querySelectorAll('.project-card').forEach(function (card) {
          card.hidden = selected !== 'all' && card.dataset.category !== selected;
        });
      });
    });

    const form = document.querySelector('.contact-form');
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = form.elements.name.value.trim();
        const email = form.elements.email.value.trim();
        const message = form.elements.message.value.trim();
        const status = form.querySelector('.form-status');
        if (!name || !validateEmail(email) || !message) {
          status.textContent = 'Please complete your name, a valid email, and project details.';
          status.style.color = '#b34d3c';
          return;
        }
        status.textContent = 'Thanks! Your inquiry is ready to be reviewed.';
        status.style.color = '#6a8110';
        form.reset();
      });
    }

    const copyButton = document.querySelector('.email-copy');
    if (copyButton) {
      copyButton.addEventListener('click', async function () {
        const email = copyButton.dataset.email;
        try { await navigator.clipboard.writeText(email); copyButton.innerHTML = 'Email copied <span>✓</span>'; }
        catch (error) { window.location.href = 'mailto:' + email; }
      });
    }
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }

  global.PortfolioApp = { projects: projects, filterProjects: filterProjects, validateEmail: validateEmail };
  if (typeof module !== 'undefined' && module.exports) module.exports = global.PortfolioApp;
  if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', init);
})(typeof window !== 'undefined' ? window : globalThis);
