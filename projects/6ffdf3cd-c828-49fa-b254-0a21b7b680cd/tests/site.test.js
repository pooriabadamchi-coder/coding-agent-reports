const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

test('page has the main portfolio sections and assets', () => {
  assert.match(html, /id="work"/);
  assert.match(html, /id="services"/);
  assert.match(html, /id="about"/);
  assert.match(html, /id="contact"/);
  assert.match(html, /styles\.css/);
  assert.match(html, /script\.js/);
});

test('contact form has accessible email input and status message', () => {
  assert.match(html, /label for="email"/);
  assert.match(html, /id="email"[^>]*type="email"/);
  assert.match(html, /aria-live="polite"/);
});

test('responsive and interactive styles/scripts are present', () => {
  assert.match(css, /@media\(max-width:760px\)/);
  assert.match(js, /menuToggle/);
  assert.match(js, /form\.addEventListener/);
});
