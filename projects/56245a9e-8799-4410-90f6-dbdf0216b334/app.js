const PRODUCTS = [
  { id: 'a-ultra', name: 'اولترا بوست ران', brand: 'آدیداس', category: 'کفش ورزشی مردانه', price: 4850000, image: '👟', sizes: [40, 41, 42, 43, 44], stockBySize: { 40: 3, 41: 6, 42: 4, 43: 2, 44: 0 }, description: 'سبک و مناسب دویدن روزانه', badge: 'پرفروش' },
  { id: 'a-forum', name: 'فوروم لو کلاسیک', brand: 'آدیداس', category: 'کفش ورزشی مردانه', price: 3950000, image: '👟', sizes: [40, 41, 42, 43], stockBySize: { 40: 2, 41: 3, 42: 5, 43: 1 }, description: 'طراحی کلاسیک با راحتی بالا', badge: 'جدید' },
  { id: 'n-pegasus', name: 'پگاسوس ۴۰', brand: 'نایک', category: 'کفش ورزشی مردانه', price: 5200000, image: '👟', sizes: [40, 41, 42, 43, 44], stockBySize: { 40: 4, 41: 5, 42: 3, 43: 2, 44: 1 }, description: 'بالشتک‌گذاری نرم برای تمرین', badge: 'محبوب' },
  { id: 'n-airmax', name: 'ایر مکس اکسس', brand: 'نایک', category: 'کفش ورزشی مردانه', price: 6100000, image: '👟', sizes: [41, 42, 43, 44, 45], stockBySize: { 41: 2, 42: 0, 43: 4, 44: 2, 45: 1 }, description: 'استایل شهری و کفی انعطاف‌پذیر' }
];

const toman = value => `${Number(value).toLocaleString('fa-IR')} تومان`;
const itemKey = (productId, size) => `${productId}:${size}`;

function filterProducts(products, brand = 'all', query = '', sort = 'newest') {
  const text = String(query).trim().toLowerCase();
  const result = products.filter(product =>
    (brand === 'all' || !brand || product.brand === brand) &&
    (!text || `${product.name} ${product.brand}`.toLowerCase().includes(text))
  );
  if (sort === 'price-low') return result.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') return result.sort((a, b) => b.price - a.price);
  return result;
}

function productFor(id) {
  return PRODUCTS.find(product => product.id === id);
}

function stockFor(product, size) {
  return Number(product && product.stockBySize && product.stockBySize[size]) || 0;
}

function addToCart(cart, product, size, quantity = 1) {
  if (!product) throw new Error('محصول پیدا نشد');
  if (!product.sizes.includes(Number(size))) throw new Error('سایز را انتخاب کنید');
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error('تعداد باید عدد صحیح مثبت باشد');
  const available = stockFor(product, Number(size));
  if (!available) throw new Error('این سایز ناموجود است');
  const key = itemKey(product.id, Number(size));
  const existing = cart.find(item => itemKey(item.productId, item.size) === key);
  const nextQuantity = (existing ? existing.quantity : 0) + quantity;
  if (nextQuantity > available) throw new Error('تعداد درخواستی از موجودی بیشتر است');
  if (existing) return cart.map(item => item === existing ? { ...item, quantity: nextQuantity } : item);
  return [...cart, { productId: product.id, size: Number(size), quantity }];
}

function changeQuantity(cart, key, delta) {
  const index = cart.findIndex(item => itemKey(item.productId, item.size) === key);
  if (index < 0 || !Number.isInteger(delta)) return cart;
  const item = cart[index];
  const product = productFor(item.productId);
  const quantity = item.quantity + delta;
  if (quantity <= 0) return cart.filter((_, currentIndex) => currentIndex !== index);
  if (!product || quantity > stockFor(product, item.size)) return cart;
  return cart.map((entry, currentIndex) => currentIndex === index ? { ...entry, quantity } : entry);
}

function cartTotals(cart) {
  const subtotal = cart.reduce((sum, item) => {
    const product = productFor(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  return { subtotal, shipping: 0, total: subtotal };
}

function installment(total) {
  return Math.floor(Number(total) / 4);
}

function sanitizeCart(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.reduce((valid, item) => {
    const product = productFor(item && item.productId);
    const size = Number(item && item.size);
    const quantity = Number(item && item.quantity);
    if (product && product.sizes.includes(size) && Number.isInteger(quantity) && quantity > 0) {
      const available = stockFor(product, size);
      if (available > 0) {
        const existing = valid.find(entry => itemKey(entry.productId, entry.size) === itemKey(product.id, size));
        if (existing) existing.quantity = Math.min(available, existing.quantity + quantity);
        else valid.push({ productId: product.id, size, quantity: Math.min(quantity, available) });
      }
    }
    return valid;
  }, []);
}

function validateCartStock(cart) {
  return Array.isArray(cart) && cart.every(item => {
    const product = productFor(item.productId);
    return product && product.sizes.includes(Number(item.size)) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= stockFor(product, item.size);
  });
}

if (typeof module !== 'undefined') module.exports = { PRODUCTS, filterProducts, addToCart, changeQuantity, cartTotals, installment, sanitizeCart, validateCartStock, itemKey };

if (typeof document !== 'undefined') {
  let cart = [];
  try { cart = sanitizeCart(JSON.parse(localStorage.getItem('ghadamno-cart') || '[]')); } catch (_) { cart = []; }
  let selectedSizes = {};
  let activeBrand = 'all';
  const $ = selector => document.querySelector(selector);
  const save = () => { try { localStorage.setItem('ghadamno-cart', JSON.stringify(cart)); } catch (_) {} };
  const showToast = message => { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); };
  const renderProducts = () => {
    const products = filterProducts(PRODUCTS, activeBrand, $('#search-input').value, $('#sort-select').value);
    $('#result-count').textContent = `${products.length.toLocaleString('fa-IR')} محصول`;
    $('#empty-products').classList.toggle('hidden', products.length > 0);
    $('#product-grid').innerHTML = products.map(product => {
      const chosen = selectedSizes[product.id];
      const totalStock = Object.values(product.stockBySize).reduce((sum, count) => sum + count, 0);
      return `<article class="product-card"><div class="product-visual"><span class="hero-shoe">${product.image}</span><span class="badge">${product.badge}</span></div><div class="product-info"><span class="brand-name">${product.brand}</span><h3>${product.name}</h3><p class="description">${product.description}</p><span class="stock ${totalStock ? '' : 'out'}">${totalStock ? `موجودی: ${totalStock.toLocaleString('fa-IR')} عدد` : 'ناموجود'}</span><div class="size-row">${product.sizes.map(size => `<button class="size-button ${chosen === size ? 'selected' : ''}" data-size="${size}" data-product="${product.id}" ${!stockFor(product, size) ? 'disabled' : ''}>${size.toLocaleString('fa-IR')}</button>`).join('')}</div><div class="card-bottom"><span class="price">${toman(product.price)}</span><button class="add-button" data-add="${product.id}" ${!totalStock || !chosen ? 'disabled' : ''}>افزودن</button></div></div></article>`;
    }).join('');
  };
  const renderCart = () => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    $('#cart-count').textContent = count.toLocaleString('fa-IR');
    $('#cart-empty').classList.toggle('hidden', !cart.length);
    $('#cart-footer').classList.toggle('hidden', !cart.length);
    $('#cart-items').innerHTML = cart.map(item => { const product = productFor(item.productId); return `<div class="cart-item"><span class="mini-image">${product.image}</span><div><h4>${product.name}</h4><p>${product.brand} | سایز ${item.size} | ${toman(product.price)}</p><div class="quantity"><button data-change="-1" data-key="${itemKey(item.productId, item.size)}">−</button><b>${item.quantity.toLocaleString('fa-IR')}</b><button data-change="1" data-key="${itemKey(item.productId, item.size)}">+</button><button class="remove-item" data-remove="${itemKey(item.productId, item.size)}">حذف</button></div></div><span class="item-price">${toman(product.price * item.quantity)}</span></div>`; }).join('');
    $('#subtotal').textContent = toman(cartTotals(cart).total);
  };
  const openCart = () => { $('#cart-drawer').classList.add('open'); $('#cart-drawer').setAttribute('aria-hidden', 'false'); $('#drawer-backdrop').classList.remove('hidden'); };
  const closeCart = () => { $('#cart-drawer').classList.remove('open'); $('#cart-drawer').setAttribute('aria-hidden', 'true'); $('#drawer-backdrop').classList.add('hidden'); };
  const updatePayment = () => { const total = cartTotals(cart).total; const credit = document.querySelector('input[name="payment"]:checked').value === 'credit'; $('#payment-summary').innerHTML = credit ? `<strong>مبلغ کل: ${toman(total)}</strong><div class="installments">${[1, 2, 3, 4].map(number => `<span>قسط ${number}: ${toman(installment(total))}</span>`).join('')}</div>` : `<strong>مبلغ قابل پرداخت: ${toman(total)}</strong>`; };
  document.addEventListener('click', event => {
    const sizeButton = event.target.closest('[data-size]');
    if (sizeButton) { selectedSizes[sizeButton.dataset.product] = Number(sizeButton.dataset.size); renderProducts(); return; }
    const add = event.target.closest('[data-add]');
    if (add) { try { cart = addToCart(cart, productFor(add.dataset.add), selectedSizes[add.dataset.add], 1); save(); renderCart(); showToast('محصول به سبد خرید اضافه شد'); } catch (error) { showToast(error.message); } return; }
    const change = event.target.closest('[data-change]');
    if (change) { cart = changeQuantity(cart, change.dataset.key, Number(change.dataset.change)); save(); renderCart(); return; }
    const remove = event.target.closest('[data-remove]');
    if (remove) { cart = cart.filter(item => itemKey(item.productId, item.size) !== remove.dataset.remove); save(); renderCart(); }
  });
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { activeBrand = button.dataset.brand; document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button)); renderProducts(); }));
  $('#search-input').addEventListener('input', renderProducts); $('#sort-select').addEventListener('change', renderProducts); $('#open-cart').addEventListener('click', openCart); $('#close-cart').addEventListener('click', closeCart); $('#drawer-backdrop').addEventListener('click', closeCart); $('#back-products').addEventListener('click', closeCart);
  $('#checkout-button').addEventListener('click', () => { if (!validateCartStock(cart)) { showToast('موجودی سبد تغییر کرده است'); cart = sanitizeCart(cart); save(); renderCart(); return; } $('#checkout-modal').classList.remove('hidden'); updatePayment(); });
  document.querySelector('.modal-close').addEventListener('click', () => $('#checkout-modal').classList.add('hidden')); document.querySelectorAll('input[name="payment"]').forEach(input => input.addEventListener('change', updatePayment));
  $('#place-order').addEventListener('click', () => { if (!validateCartStock(cart)) { $('#checkout-message').textContent = 'موجودی یکی از کالاها کافی نیست.'; return; } $('#checkout-message').textContent = 'سفارش نمایشی شما با موفقیت ثبت شد.'; cart = []; save(); renderCart(); });
  renderProducts(); renderCart();
}