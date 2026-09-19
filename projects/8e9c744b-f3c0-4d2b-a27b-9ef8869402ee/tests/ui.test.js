import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('صفحه اصلی RTL و عناصر اصلی فروشگاه را دارد',()=>{const html=fs.readFileSync('index.html','utf8');assert.match(html,/dir="rtl"/);assert.match(html,/id="product-grid"/);assert.match(html,/id="open-cart"/);assert.match(html,/id="search"/)});
test('استایل واکنش‌گراست',()=>{const css=fs.readFileSync('styles.css','utf8');assert.match(css,/@media/);assert.match(css,/grid-template-columns/)});
