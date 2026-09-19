const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  });
});

const form = document.querySelector('#contact-form');
const message = document.querySelector('#form-message');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.querySelector('#email');
  if (!email.validity.valid || !email.value.trim()) {
    message.textContent = 'Please enter a valid email address.';
    message.style.color = '#b34d3e';
    email.focus();
    return;
  }
  message.textContent = 'Thanks — we will be in touch soon.';
  message.style.color = '#41805b';
  form.reset();
});
