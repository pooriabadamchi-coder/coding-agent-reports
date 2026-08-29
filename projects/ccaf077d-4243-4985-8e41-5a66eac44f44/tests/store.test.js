import test from 'node:test';
import assert from 'node:assert/strict';
import {products, addToCart, updateCartQuantity, cartTotals} from '../src/store.js';

const shoe = products[0];
test('محصولات هر دو برند در داده‌های اولیه وجود دارند', () => {
  assert.ok(products.some(p => p.brand === 'آدیداس'));
  assert.ok(products.some(p => p.brand === 'نایک'));
});
test('افزودن محصول با سایز و روش خرید انجام می‌شود', () => {
  const cart = addToCart([], shoe, shoe.sizes[0], 2, 'credit');
  assert.deepEqual(cart[0], {productId:shoe.id, size:shoe.sizes[0], quantity:2, method:'credit'});
  assert.equal(cartTotals(cart).count, 2);
  assert.equal(cartTotals(cart).installmentTotal, shoe.installment * 2);
});
test('افزودن بدون سایز معتبر یا بیشتر از موجودی خطا می‌دهد', () => {
  assert.throws(() => addToCart([], shoe, 99), /سایز/);
  assert.throws(() => addToCart([], shoe, shoe.sizes[0], shoe.stock + 1), /موجودی/);
});
test('افزودن دوباره همان سایز ادغام و تغییر تعداد محدود می‌شود', () => {
  let cart = addToCart([], shoe, shoe.sizes[0], 2);
  cart = addToCart(cart, shoe, shoe.sizes[0], 1);
  assert.equal(cart[0].quantity, 3);
  cart = updateCartQuantity(cart, shoe.id, shoe.sizes[0], 0, shoe.stock);
  assert.equal(cart.length, 0);
});
test('جمع نقدی چند قلم درست محاسبه می‌شود', () => {
  const cart = [{productId:shoe.id,size:40,quantity:2,method:'cash'}, {productId:products[1].id,size:41,quantity:1,method:'cash'}];
  const totals = cartTotals(cart);
  assert.equal(totals.count, 3);
  assert.equal(totals.total, shoe.price * 2 + products[1].price);
});
