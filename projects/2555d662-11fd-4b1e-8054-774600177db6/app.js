const products = [
  { id: 'n1', brand: 'Nike', name: 'ایر زوم پگاسوس', price: 4850000, stock: 4, sizes: [40, 41, 42, 43, 44], color: 'آبی' },
  { id: 'n2', brand: 'Nike', name: 'ایر فورس ۱', price: 5200000, stock: 3, sizes: [41, 42, 43, 44], color: 'سفید' },
  { id: 'n3', brand: 'Nike', name: 'متکان ترینر', price: 6100000, stock: 5, sizes: [40, 42, 43, 45], color: 'مشکی' },
  { id: 'a1', brand: 'Adidas', name: 'اولترا بوست لایت', price: 5750000, stock: 4, sizes: [40, 41, 42, 44, 45], color: 'خاکستری' },
  { id: 'a2', brand: 'Adidas', name: 'سوپرنوا رایز', price: 4300000, stock: 6, sizes: [41, 42, 43, 44], color: 'سبز' },
  { id: 'a3', brand: 'Adidas', name: 'آلفا بونس', price: 3900000, stock: 2, sizes: [40, 41, 42], color: 'نارنجی' }
];

function productById(id) { return products.find((product) => product.id === id); }
function calculateTotal(cart) {
  return cart.reduce((sum, item) => {
    const product = productById(item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}
function canIncrease(item) {
  const product = productById(item.id);
  return Boolean(product && item.qty < product.stock);
}

if (typeof module !== 'undefined') module.exports = { products, calculateTotal, canIncrease };

if (typeof document !== 'undefined') {
  const $ = (selector) => document.querySelector(selector);
  const money = (value) => new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
  let cart = JSON.parse(localStorage.getItem('kicks-cart') || '[]');
  let brand = 'all';
  let query = '';
  let sort = 'default';

  function save() { localStorage.setItem('kicks-cart', JSON.stringify(cart)); }
  function visibleProducts() {
    let list = products.filter((p) => (brand === 'all' || p.brand === brand) && `${p.brand} ${p.name}`.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'cheap') list = list.sort((a, b) => a.price - b.price);
    if (sort === 'expensive') list = list.sort((a, b) => b.price - a.price);
    if (sort === 'name') list = list.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
    return list;
  }
  function renderProducts() {
    $('#products').innerHTML = visibleProducts().map((p) => `<article class="card">
      <div class="shoe-image ${p.brand.toLowerCase()}"><span>👟</span><b>${p.brand}</b></div>
      <div class="card-body"><div class="tag">${p.brand}</div><h3>${p.name}</h3><p class="muted">رنگ ${p.color} · موجودی ${p.stock} جفت</p>
      <div class="price">${money(p.price)}</div><label>سایز <select data-size="${p.id}">${p.sizes.map((s) => `<option value="${s}">${s}</option>`).join('')}</select></label>
      <button class="primary add" data-id="${p.id}">افزودن به سبد</button></div></article>`).join('') || '<p class="empty">محصولی با این مشخصات پیدا نشد.</p>';
    document.querySelectorAll('.add').forEach((button) => button.addEventListener('click', () => add(button.dataset.id)));
  }
  function add(id) {
    const size = Number($(`[data-size="${id}"]`).value);
    const item = cart.find((entry) => entry.id === id && entry.size === size);
    if (item) { if (!canIncrease(item)) return alert('موجودی این محصول تکمیل شده است.'); item.qty++; }
    else cart.push({ id, size, qty: 1 });
    save(); renderCart(); openCart();
  }
  function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    $('#cart-count').textContent = count;
    $('#cart-total').textContent = money(calculateTotal(cart));
    $('#cart-items').innerHTML = cart.length ? cart.map((item, index) => { const p = productById(item.id); return `<div class="cart-item"><div><strong>${p.name}</strong><small>سایز ${item.size} · ${money(p.price)}</small></div><div class="quantity"><button data-action="minus" data-index="${index}">−</button><b>${item.qty}</b><button data-action="plus" data-index="${index}">+</button><button class="remove" data-action="remove" data-index="${index}">حذف</button></div></div>`; }).join('') : '<p class="empty">سبد خرید شما خالی است.</p>';
    document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => change(Number(button.dataset.index), button.dataset.action)));
  }
  function change(index, action) {
    const item = cart[index];
    if (action === 'remove') cart.splice(index, 1);
    else if (action === 'minus' && item.qty > 1) item.qty--;
    else if (action === 'plus' && canIncrease(item)) item.qty++;
    save(); renderCart();
  }
  function openCart() { $('#drawer').classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); }
  function closeCart() { $('#drawer').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); }
  $('#search').addEventListener('input', (e) => { query = e.target.value; renderProducts(); });
  $('#brand').addEventListener('change', (e) => { brand = e.target.value; renderProducts(); });
  $('#sort').addEventListener('change', (e) => { sort = e.target.value; renderProducts(); });
  $('#cart-button').addEventListener('click', openCart); $('#close-cart').addEventListener('click', closeCart);
  $('#checkout').addEventListener('click', () => { if (!cart.length) return alert('سبد خرید خالی است.'); const method = document.querySelector('input[name="payment"]:checked').value; alert(`سفارش شما با پرداخت ${method === 'credit' ? 'اعتباری نمایشی' : 'نقدی'} ثبت شد.`); cart = []; save(); renderCart(); closeCart(); });
  renderProducts(); renderCart();
}
