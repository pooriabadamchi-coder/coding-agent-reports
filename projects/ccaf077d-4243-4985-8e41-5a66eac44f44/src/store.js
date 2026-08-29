export const products = [
  {id:'ad-ultra', name:'Ultraboost Light', brand:'آدیداس', description:'سبک، نرم و مناسب دویدن روزانه', price:4850000, installment:1212500, stock:8, sizes:[40,41,42,43,44], popularity:98, color:'#172f70', image:shoeImage('#172f70','#8bb9ff')},
  {id:'ad-run', name:'Adizero SL', brand:'آدیداس', description:'سرعت بیشتر با کفی واکنش‌گرا', price:3650000, installment:912500, stock:5, sizes:[41,42,43,44,45], popularity:91, color:'#e94b35', image:shoeImage('#e94b35','#ffd2b8')},
  {id:'ad-force', name:'Runfalcon 3.0', brand:'آدیداس', description:'راحتی پایدار برای تمرین‌های طولانی', price:2790000, installment:697500, stock:12, sizes:[40,41,42,43], popularity:85, color:'#252b35', image:shoeImage('#252b35','#b8c2cf')},
  {id:'nk-pegasus', name:'Air Zoom Pegasus 40', brand:'نایک', description:'کلاسیک محبوب برای هر مسیر', price:5200000, installment:1300000, stock:4, sizes:[40,41,42,43,44], popularity:97, color:'#111827', image:shoeImage('#111827','#ff7043')},
  {id:'nk-revolution', name:'Revolution 7', brand:'نایک', description:'طراحی مینیمال با تنفس عالی', price:3180000, installment:795000, stock:10, sizes:[41,42,43,44,45], popularity:89, color:'#117a72', image:shoeImage('#117a72','#b7f0df')},
  {id:'nk-downshifter', name:'Downshifter 12', brand:'نایک', description:'انتخاب اقتصادی برای ورزش روزانه', price:2450000, installment:612500, stock:7, sizes:[40,41,42,44], popularity:78, color:'#6d42a8', image:shoeImage('#6d42a8','#ead7ff')}
];

function shoeImage(main, accent) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300"><rect width="500" height="300" rx="35" fill="${accent}"/><path d="M78 174c38-18 63-53 88-103l91 43c24 11 40 36 65 48l87 43c16 8 15 31-4 36H76c-33 0-30-52 2-67Z" fill="${main}"/><path d="M100 226h310c20 0 23 19 2 26H77c-20 0-22-26 23-26Z" fill="#fff"/><path d="M165 92l28 42m18-33 28 42m18-30 26 39" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".85"/><path d="M276 155c25 15 45 34 73 40" fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function cartKey(productId, size) { return `${productId}__${size}`; }
export function cartQuantity(cart, productId, size) { return cart.filter(item => item.productId === productId && item.size === size).reduce((sum, item) => sum + item.quantity, 0); }
export function addToCart(cart, product, size, quantity = 1, method = 'cash') {
  if (!product || !product.sizes.includes(Number(size))) throw new Error('سایز انتخاب‌شده موجود نیست');
  const existing = cart.find(item => item.productId === product.id && item.size === Number(size));
  const next = cartQuantity(cart, product.id, Number(size)) + quantity;
  if (next > product.stock) throw new Error('تعداد انتخاب‌شده بیشتر از موجودی انبار است');
  if (existing) return cart.map(item => item === existing ? {...item, quantity:item.quantity + quantity, method} : item);
  return [...cart, {productId:product.id, size:Number(size), quantity, method}];
}
export function updateCartQuantity(cart, productId, size, quantity, stock) {
  if (quantity <= 0) return cart.filter(item => !(item.productId === productId && item.size === size));
  if (quantity > stock) throw new Error('بیشتر از موجودی انبار نمی‌توانید انتخاب کنید');
  return cart.map(item => item.productId === productId && item.size === size ? {...item, quantity} : item);
}
export function cartTotals(cart, catalog = products) {
  return cart.reduce((result, item) => {
    const product = catalog.find(p => p.id === item.productId);
    if (!product) return result;
    result.count += item.quantity;
    result.total += product.price * item.quantity;
    result.installmentTotal += product.installment * item.quantity;
    return result;
  }, {count:0,total:0,installmentTotal:0});
}
