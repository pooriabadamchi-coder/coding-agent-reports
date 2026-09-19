import test from 'node:test';
import assert from 'node:assert/strict';
import {products,addToCart,changeQty,cartTotal,creditInstallment,cleanCart} from '../app.js';

test('محصولات هر دو برند را دارد',()=>{assert.ok(products.some(p=>p.brand==='آدیداس'));assert.ok(products.some(p=>p.brand==='نایک'))});
test('جست‌وجوی نام یا برند قابل انجام است',()=>{assert.ok(products.filter(p=>(p.name+' '+p.brand).includes('نایک')).length>=2)});
test('بدون سایز افزودن ممکن نیست',()=>{assert.throws(()=>addToCart([], 'a1'),/سایز/)});
test('افزودن سایزدار و ادغام آیتم مشابه',()=>{let c=addToCart([],'a1',42,1);c=addToCart(c,'a1',42,2);assert.equal(c.length,1);assert.equal(c[0].qty,3)});
test('عبور از موجودی ممنوع است',()=>{assert.throws(()=>addToCart([],'a2',40,4),/موجودی/)});
test('تغییر تعداد و حذف کار می‌کند',()=>{let c=addToCart([],'a1',42,2);c=changeQty(c,0,-1);assert.equal(c[0].qty,1);c=changeQty(c,0,-1);assert.equal(c.length,0)});
test('جمع کل و قسط چهارم درست است',()=>{const c=addToCart([],'a1',42,2);const total=cartTotal(c);assert.equal(total,9700000);assert.equal(creditInstallment(total),2425000)});
test('سبد نامعتبر پاک‌سازی می‌شود',()=>{assert.equal(cleanCart([{id:'bad',size:40,qty:2},{id:'a1',size:42,qty:99}]).length,1);assert.equal(cleanCart([{id:'a1',size:42,qty:99}])[0].qty,7)});
