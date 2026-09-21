const products = [
  {id:1,brand:'adidas',brandName:'آدیداس',name:'Ultraboost Light',price:4890000,stock:7,sizes:[40,41,42,43,44],color:'#d9e7df',accent:'#172027'},
  {id:2,brand:'nike',brandName:'نایک',name:'Air Max Pulse',price:4250000,stock:5,sizes:[41,42,43,44],color:'#e7ddd6',accent:'#ef6c3b'},
  {id:3,brand:'adidas',brandName:'آدیداس',name:'Runfalcon 3.0',price:2790000,stock:10,sizes:[39,40,41,42,43],color:'#dfe3ed',accent:'#315f91'},
  {id:4,brand:'nike',brandName:'نایک',name:'Revolution 7',price:3150000,stock:0,sizes:[40,41,42,43],color:'#e5e5e5',accent:'#20252b'},
  {id:5,brand:'adidas',brandName:'آدیداس',name:'Adizero SL',price:3980000,stock:4,sizes:[41,42,43,44,45],color:'#eee0d6',accent:'#c74b32'},
  {id:6,brand:'nike',brandName:'نایک',name:'Pegasus 40',price:5350000,stock:6,sizes:[40,41,42,43,44],color:'#dce7e9',accent:'#218a91'}
];
let cart = loadCart();
let selectedBrand = 'all';
let searchTerm = '';
let sortMode = 'featured';
let toastTimer;
const $ = selector => document.querySelector(selector);
const toman = value => new Intl.NumberFormat('fa-IR').format(value);
const imageFor = product => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 330"><rect width="500" height="330" rx="28" fill="${product.color}"/><path d="M91 209c35-4 67-30 83-75l30-73c8-19 28-28 43-15l71 83c18 21 57 34 89 47 34 14 51 33 54 55H70c-2-12 5-20 21-22z" fill="${product.accent}"/><path d="M86 232h374c2 12-1 22-17 26H84c-19 0-24-12 2-26z" fill="#fff"/><path d="M196 78l66 76M184 99l60 70M172 119l52 62" stroke="#fff" stroke-width="10" opacity=".75"/><circle cx="379" cy="238" r="7" fill="${product.color}"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
function loadCart(){
  try { return JSON.parse(localStorage.getItem('kafshino-cart')) || []; }
  catch { return []; }
}
function saveCart(){ localStorage.setItem('kafshino-cart', JSON.stringify(cart)); }
function getProduct(id){ return products.find(product => product.id === Number(id)); }
function cartQuantityFor(id, exceptKey = '') { return cart.filter(item => item.productId === id && item.key !== exceptKey).reduce((sum,item) => sum + item.quantity, 0); }
function filteredProducts(){
  let result = products.filter(product => (selectedBrand === 'all' || product.brand === selectedBrand) && `${product.name} ${product.brandName}`.toLowerCase().includes(searchTerm.toLowerCase()));
  if(sortMode === 'priceAsc') result.sort((a,b) => a.price-b.price);
  if(sortMode === 'priceDesc') result.sort((a,b) => b.price-a.price);
  if(sortMode === 'name') result.sort((a,b) => a.name.localeCompare(b.name));
  return result;
}
function renderProducts(){
  const list = filteredProducts();
  $('#resultCount').textContent = `${toman(list.length)} محصول`;
  $('#productsGrid').innerHTML = list.map(product => {
    const unavailable = product.stock === 0;
    return `<article class="product-card" data-id="${product.id}">
      <div class="product-image"><img src="${imageFor(product)}" alt="کفش ${product.name} ${product.brandName}"><span class="brand-tag">${product.brandName}</span></div>
      <div class="product-info"><h3 class="product-title">${product.name}</h3>
      <div class="product-meta"><span>کفش ورزشی مردانه</span><span class="stock ${unavailable?'out':''}">${unavailable?'ناموجود':`${toman(product.stock)} عدد موجود`}</span></div>
      <div class="price">${toman(product.price)} <small>تومان</small></div>
      <span class="size-label">سایز را انتخاب کنید:</span><div class="sizes">${product.sizes.map(size => `<button class="size-button" type="button" data-size="${size}" ${unavailable?'disabled':''}>${size}</button>`).join('')}</div>
      <button class="add-button" type="button" ${unavailable?'disabled':''}>${unavailable?'به‌زودی موجود می‌شود':'افزودن به سبد خرید'}</button></div></article>`;
  }).join('');
  $('#emptyState').classList.toggle('hidden', list.length > 0);
}
function renderCart(){
  const totalItems = cart.reduce((sum,item) => sum + item.quantity, 0);
  $('#cartCount').textContent = toman(totalItems);
  $('#cartTotal').textContent = `${toman(cart.reduce((sum,item) => sum + getProduct(item.productId).price * item.quantity, 0))} تومان`;
  $('#cartContent').innerHTML = cart.length ? cart.map(item => { const product=getProduct(item.productId); return `<div class="cart-item"><img class="cart-item-image" src="${imageFor(product)}" alt="${product.name}"><div><h4>${product.name}</h4><p>سایز ${item.size} · ${product.brandName}</p><div class="quantity"><button type="button" data-action="decrease" data-key="${item.key}" aria-label="کاهش تعداد">−</button><b>${toman(item.quantity)}</b><button type="button" data-action="increase" data-key="${item.key}" aria-label="افزایش تعداد">+</button><button class="remove-item" type="button" data-action="remove" data-key="${item.key}">حذف</button></div></div><span class="item-price">${toman(product.price * item.quantity)} ت</span></div>`; }).join('') : '<div class="cart-empty"><div class="empty-icon">🛍️</div><strong>سبد خرید شما خالی است</strong><span>محصول مورد علاقه‌تان را به سبد اضافه کنید.</span></div>';
  $('#cartFooter').classList.toggle('hidden', cart.length === 0);
  const total = cart.reduce((sum,item) => sum + getProduct(item.productId).price * item.quantity, 0);
  $('#installmentText').textContent = `۴ قسط ${toman(Math.ceil(total/4))} تومانی`;
}
function addToCart(productId,size){
  const product=getProduct(productId); if(!size){ showToast('لطفاً ابتدا یک سایز انتخاب کنید'); return; }
  if(cartQuantityFor(productId) >= product.stock){ showToast('تعداد انتخاب‌شده به سقف موجودی رسیده است'); return; }
  const key=`${productId}-${size}`; const item=cart.find(entry=>entry.key===key);
  if(item) item.quantity++; else cart.push({key,productId,size,quantity:1});
  saveCart(); renderCart(); showToast('محصول به سبد خرید اضافه شد');
}
function showToast(message){ const toast=$('#toast'); toast.textContent=message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('show'),2600); }
function toggleCart(open){ $('#cartDrawer').classList.toggle('open',open); $('#overlay').classList.toggle('hidden',!open); $('#cartDrawer').setAttribute('aria-hidden',String(!open)); if(open) $('#closeCart').focus(); }
$('#productsGrid').addEventListener('click', event => { const card=event.target.closest('.product-card'); if(!card) return; if(event.target.classList.contains('size-button')){ card.querySelectorAll('.size-button').forEach(button=>button.classList.remove('selected')); event.target.classList.add('selected'); return; } if(event.target.classList.contains('add-button')) addToCart(Number(card.dataset.id), card.querySelector('.size-button.selected')?.dataset.size); });
$('#cartContent').addEventListener('click', event => { const button=event.target.closest('[data-action]'); if(!button)return; const item=cart.find(entry=>entry.key===button.dataset.key); if(!item)return; const product=getProduct(item.productId); if(button.dataset.action==='remove') cart=cart.filter(entry=>entry.key!==item.key); if(button.dataset.action==='decrease'){item.quantity--; if(item.quantity<1) cart=cart.filter(entry=>entry.key!==item.key);} if(button.dataset.action==='increase'){if(cartQuantityFor(item.productId,item.key)>=product.stock) return showToast('موجودی این محصول کافی نیست'); item.quantity++;} saveCart(); renderCart(); });
$('#searchInput').addEventListener('input', event => {searchTerm=event.target.value.trim(); renderProducts();});
$('.filters').addEventListener('click', event => {if(!event.target.dataset.brand)return; selectedBrand=event.target.dataset.brand; document.querySelectorAll('.filter-button').forEach(button=>button.classList.toggle('active',button.dataset.brand===selectedBrand)); renderProducts();});
$('#sortSelect').addEventListener('change', event => {sortMode=event.target.value; renderProducts();});
$('#openCart').addEventListener('click',()=>toggleCart(true)); $('#closeCart').addEventListener('click',()=>toggleCart(false)); $('#overlay').addEventListener('click',()=>toggleCart(false));
document.querySelectorAll('input[name="payment"]').forEach(input=>input.addEventListener('change',()=>document.querySelectorAll('.payment-option').forEach(option=>option.classList.toggle('selected',option.querySelector('input').checked))));
$('#checkoutButton').addEventListener('click',()=>showToast('این بخش نمایشی است؛ پرداخت واقعی انجام نمی‌شود.'));
renderProducts(); renderCart();