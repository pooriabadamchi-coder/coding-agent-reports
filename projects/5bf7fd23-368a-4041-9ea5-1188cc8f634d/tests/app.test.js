const test=require('node:test');const assert=require('node:assert/strict');const app=require('../app.js');
test('محصولات نمونه و موجودی کل دارند',()=>{assert.equal(app.products.length,6);assert.ok(app.stock(app.products[0])>0)});
test('قیمت به تومان فارسی قالب‌بندی می‌شود',()=>{assert.equal(app.formatPrice(4850000),'۴٬۸۵۰٬۰۰۰ تومان')});
test('فیلتر محصولات بر اساس نام و برند قابل استفاده است',()=>{const old=app.products.filter(p=>(p.name+' '+p.brand).includes('نایک'));assert.equal(old.length,3)});
test('هر محصول حداقل دو سایز و موجودی مستقل دارد',()=>{for(const p of app.products){assert.ok(Object.keys(p.sizes).length>=2);assert.ok(Object.values(p.sizes).every(n=>n>0))}});
test('موجودی کل برابر جمع موجودی سایزهاست',()=>{const p=app.products[1];assert.equal(app.stock(p),Object.values(p.sizes).reduce((a,b)=>a+b,0))});