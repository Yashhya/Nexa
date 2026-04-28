export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

export const truncate = (str, n = 60) => str?.length > n ? str.substr(0, n - 1) + '...' : str;

export const getDiscountPercent = (price, originalPrice) =>
  originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

export const getOrderStatusColor = (status) => {
  const map = {
    placed: 'cyan', confirmed: 'blue', processing: 'yellow',
    shipped: 'purple', out_for_delivery: 'orange', delivered: 'green',
    cancelled: 'red', returned: 'pink'
  };
  return map[status] || 'gray';
};

export const getOrderStatusLabel = (status) => {
  const map = {
    placed: 'Order Placed', confirmed: 'Confirmed', processing: 'Processing',
    shipped: 'Shipped', out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
    cancelled: 'Cancelled', returned: 'Returned'
  };
  return map[status] || status;
};

export const generateSessionId = () => 'sid_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();

export const debounce = (fn, delay) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};

export const CATEGORIES = [
  { name: 'Electronics', icon: '💻', slug: 'electronics', color: 'cyan' },
  { name: 'Fashion',     icon: '👗', slug: 'fashion',     color: 'pink' },
  { name: 'Shoes',       icon: '👟', slug: 'shoes',       color: 'orange' },
  { name: 'Watches',     icon: '⌚', slug: 'watches',     color: 'violet' },
  { name: 'Accessories', icon: '🕶️', slug: 'accessories', color: 'purple' },
  { name: 'Home Decor',  icon: '🏠', slug: 'home-decor',  color: 'emerald' },
];

/** Validate a product has all required fields before showing it */
export const validateProduct = (p) => {
  if (!p) return false;
  return !!(
    p.name?.trim() &&
    p.category?.trim() &&
    p.price > 0 &&
    p.description?.trim() &&
    p.stock >= 0 &&
    (p.thumbnail || (p.images && p.images.length > 0))
  );
};
