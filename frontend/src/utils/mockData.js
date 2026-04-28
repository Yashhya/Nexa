/**
 * mockData.js – Curated frontend mock products.
 * These mirror the backend seed.js products exactly.
 * Used for "You May Also Like" suggestions and offline fallback.
 */

const M = {
  iphone:     'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/iphone-x/model.gltf',
  macbook:    'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf',
  headphones: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/headphones/model.gltf',
  appleWatch: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/apple-watch/model.gltf',
  shoe:       'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/shoe-draco/model.gltf',
};

export const mockProducts = [
  // ── Electronics ──────────────────────────────────────────────────────────
  {
    _id: 'e1', name: 'Apple iPhone 15 Pro Max', category: 'Electronics', brand: 'Apple',
    price: 134900, originalPrice: 149900,
    description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and ProRes video.',
    shortDescription: 'A17 Pro chip · Titanium design · 5× Telephoto camera',
    stock: 50, ratings: 4.8, numReviews: 1247,
    isFeatured: true, isTrending: true, freeShipping: true,
    tags: ['iphone', 'apple', 'smartphone', '5g', 'pro-max'],
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&q=80',
      'https://images.unsplash.com/photo-1695048359536-df7d1a6e5338?w=1200&q=80',
    ],
    model3d: '',
    specifications: { Display: '6.7" Super Retina XDR, 120Hz', Chip: 'A17 Pro (3nm)', Camera: '48MP Main + 12MP Ultra Wide + 12MP 5× Telephoto', Battery: 'Up to 29 hrs video', Storage: '256 GB / 512 GB / 1 TB', OS: 'iOS 17' },
  },
  {
    _id: 'e2', name: 'Samsung Galaxy S24 Ultra', category: 'Electronics', brand: 'Samsung',
    price: 124999, originalPrice: 139999,
    description: 'Samsung Galaxy S24 Ultra with built-in S Pen, 200MP AI camera, and titanium frame.',
    shortDescription: 'Built-in S Pen · 200MP AI Camera · Titanium frame',
    stock: 45, ratings: 4.7, numReviews: 987,
    isFeatured: true, isTrending: true, freeShipping: true,
    tags: ['samsung', 'galaxy', 'smartphone', 's-pen', 'ultra'],
    thumbnail: 'https://images.unsplash.com/photo-1706439269756-7f09abb47a17?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1706439269756-7f09abb47a17?w=1200&q=80'],
    model3d: '',
    specifications: { Display: '6.8" Dynamic AMOLED 2X, 120Hz', Chip: 'Snapdragon 8 Gen 3', Camera: '200MP + 12MP + 10MP', Battery: '5000 mAh, 45W', Storage: '256 GB / 512 GB / 1 TB', OS: 'Android 14' },
  },
  {
    _id: 'e3', name: 'MacBook Pro 14" M3 Pro', category: 'Electronics', brand: 'Apple',
    price: 199900, originalPrice: 219900,
    description: 'MacBook Pro with M3 Pro chip, Liquid Retina XDR display, and up to 22 hours battery.',
    shortDescription: 'M3 Pro chip · Liquid Retina XDR · 22 hr battery',
    stock: 30, ratings: 4.9, numReviews: 567,
    isFeatured: true, freeShipping: true,
    tags: ['macbook', 'laptop', 'apple', 'm3', 'pro'],
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80',
      'https://images.unsplash.com/photo-1611186871525-2e2f45e0f7b7?w=1200&q=80',
    ],
    model3d: '',
    specifications: { Display: '14.2" Liquid Retina XDR', Chip: 'M3 Pro (12-core CPU)', RAM: '18 GB', Storage: '512 GB SSD', Battery: 'Up to 22 hours', Ports: '3× TB4, HDMI 2.1, SD, MagSafe 3' },
  },
  {
    _id: 'e4', name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', brand: 'Sony',
    price: 24990, originalPrice: 34990,
    description: 'Industry-leading noise cancellation with 8 microphones, 30-hour battery, and premium sound.',
    shortDescription: 'Industry-leading ANC · 30 hr battery · 8 microphones',
    stock: 80, ratings: 4.8, numReviews: 2341,
    isFeatured: true, freeShipping: true,
    tags: ['headphones', 'anc', 'sony', 'wireless', 'noise-cancelling'],
    thumbnail: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1200&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
    ],
    model3d: '',
    specifications: { 'Driver Unit': '30 mm', Frequency: '4 Hz – 40,000 Hz', Battery: '30 hrs (ANC on)', 'Quick Charge': '3 min = 3 hrs', Connectivity: 'Bluetooth 5.2', Weight: '250 g' },
  },
  {
    _id: 'e5', name: 'Apple Watch Series 9', category: 'Electronics', brand: 'Apple',
    price: 41900, originalPrice: 44900,
    description: 'Apple Watch Series 9 with S9 chip, Double Tap gesture, and Always-On Retina display.',
    shortDescription: 'S9 chip · Double Tap gesture · Always-On Retina 2000 nits',
    stock: 70, ratings: 4.7, numReviews: 1567,
    isFeatured: true, freeShipping: true,
    tags: ['smartwatch', 'apple', 'watch', 'health', 'fitness'],
    thumbnail: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&q=80',
      'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=1200&q=80',
    ],
    model3d: '',
    specifications: { Display: 'Always-On Retina LTPO OLED', Chip: 'S9 SiP', Health: 'ECG, Blood Oxygen, Temperature', Battery: '18 hours', Water: '50 metres', Cases: '41mm / 45mm' },
  },
  // ── Shoes ─────────────────────────────────────────────────────────────────
  {
    _id: 's1', name: 'Nike Air Max 270 React', category: 'Shoes', brand: 'Nike',
    price: 12995, originalPrice: 14995,
    description: 'Air Max cushioning meets React foam for ultimate comfort in a bold lifestyle design.',
    shortDescription: 'Air Max cushioning + React foam · Breathable upper',
    stock: 100, ratings: 4.6, numReviews: 1456,
    isFeatured: true,
    tags: ['nike', 'sneakers', 'airmax', 'running', 'react'],
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=80',
    ],
    model3d: '',
    specifications: { Upper: 'Engineered mesh', Midsole: 'React + Air Max 270', Outsole: 'Rubber', Closure: 'Lace-up', Sizes: 'UK 6 – 11' },
  },
  {
    _id: 's2', name: 'Adidas Ultraboost 23', category: 'Shoes', brand: 'Adidas',
    price: 16999, originalPrice: 18999,
    description: 'The most responsive Ultraboost yet – BOOST midsole, PRIMEKNIT+ upper, Continental grip.',
    shortDescription: 'BOOST midsole · PRIMEKNIT+ upper · Continental grip',
    stock: 75, ratings: 4.7, numReviews: 892,
    isFeatured: true, isTrending: true,
    tags: ['adidas', 'ultraboost', 'running', 'sneakers', 'boost'],
    thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=1200&q=80'],
    model3d: '',
    specifications: { Upper: 'PRIMEKNIT+', Midsole: 'Boost + LEP', Outsole: 'Continental™ Rubber', Drop: '10 mm', Sizes: 'UK 6 – 12' },
  },
  // ── Fashion ───────────────────────────────────────────────────────────────
  {
    _id: 'f1', name: 'Premium Biker Leather Jacket', category: 'Fashion', brand: 'LeatherCraft Co.',
    price: 9999, originalPrice: 14999,
    description: 'Handcrafted full-grain leather biker jacket with YKK zips and quilted lining.',
    shortDescription: 'Full-grain leather · YKK zips · Quilted lining',
    stock: 40, ratings: 4.6, numReviews: 328,
    isFeatured: true,
    tags: ['jacket', 'leather', 'biker', 'fashion', 'mens'],
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=1200&q=80',
    ],
    model3d: '',
    specifications: { Material: 'Full-grain leather', Lining: 'Quilted polyester', Closure: 'YKK asymmetric zip', Sizes: 'S / M / L / XL / XXL' },
  },
  {
    _id: 'f2', name: "Levi's 501 Original Jeans", category: 'Fashion', brand: "Levi's",
    price: 3999, originalPrice: 5999,
    description: "The original 501 since 1873 – straight leg, button fly, 12 oz stonewash denim.",
    shortDescription: 'Original straight-leg · Button fly · 12 oz stonewash denim',
    stock: 200, ratings: 4.5, numReviews: 1234,
    isFeatured: false, isTrending: true,
    tags: ['levis', 'jeans', 'denim', '501', 'fashion'],
    thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=1200&q=80'],
    model3d: '',
    specifications: { Fit: 'Straight', Rise: 'Mid-rise', Closure: 'Button fly', Material: '100% Cotton (12 oz)', Wash: 'Stonewash' },
  },
  // ── Watches ───────────────────────────────────────────────────────────────
  {
    _id: 'w1', name: 'Rolex Submariner Homage', category: 'Watches', brand: 'Tempo Luxe',
    price: 15999, originalPrice: 22999,
    description: 'Premium automatic dive watch – Swiss movement, sapphire crystal, 300m water resistant.',
    shortDescription: 'Swiss automatic · Sapphire crystal · 300 m water resistant',
    stock: 30, ratings: 4.7, numReviews: 456,
    isFeatured: true, freeShipping: true,
    tags: ['watch', 'automatic', 'diver', 'luxury', 'steel'],
    thumbnail: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=80',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d2e98?w=1200&q=80',
    ],
    model3d: '',
    specifications: { Movement: 'Automatic (Swiss-grade)', Crystal: 'Sapphire', Case: '41 mm stainless steel', Bezel: 'Ceramic rotating', 'Water Resistance': '300 m' },
  },
  {
    _id: 'w2', name: 'Samsung Galaxy Watch 6 Classic', category: 'Watches', brand: 'Samsung',
    price: 34999, originalPrice: 39999,
    description: 'Premium smartwatch with rotating bezel, ECG, Body Composition analysis, and Wear OS.',
    shortDescription: 'Rotating bezel · ECG + Body Composition · Wear OS',
    stock: 55, ratings: 4.6, numReviews: 621,
    isFeatured: true, freeShipping: true,
    tags: ['smartwatch', 'samsung', 'galaxy', 'health', 'wear-os'],
    thumbnail: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1200&q=80'],
    model3d: '',
    specifications: { Display: '1.5" Super AMOLED', OS: 'Wear OS 4', Health: 'ECG, Blood Pressure, SpO2', Battery: 'Up to 40 hours', Case: '47 mm', Water: '5ATM + IP68' },
  },
  // ── Accessories ──────────────────────────────────────────────────────────
  {
    _id: 'a1', name: 'Ray-Ban Aviator Classic', category: 'Accessories', brand: 'Ray-Ban',
    price: 9500, originalPrice: 11500,
    description: 'Original aviator sunglasses – G-15 glass lenses, gold frame, 100% UV400 protection.',
    shortDescription: 'G-15 glass lenses · Gold frame · 100% UV protection',
    stock: 120, ratings: 4.7, numReviews: 2345,
    isFeatured: true, isTrending: true, freeShipping: true,
    tags: ['ray-ban', 'sunglasses', 'aviator', 'uv', 'accessories'],
    thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&q=80'],
    model3d: '',
    specifications: { Frame: 'Gold metal', Lenses: 'G-15 green glass', UV: '100% UV400', Style: 'Aviator', 'Lens Width': '58 mm', Origin: 'Made in Italy' },
  },
  // ── Home Decor ────────────────────────────────────────────────────────────
  {
    _id: 'h1', name: 'Nordic Walnut Pendant Light', category: 'Home Decor', brand: 'LumiHome',
    price: 4999, originalPrice: 7999,
    description: 'Minimalist Nordic pendant light – genuine walnut wood, spun aluminium, E27 smart-bulb ready.',
    shortDescription: 'Walnut wood + aluminium · E27 fitting · Smart-bulb ready',
    stock: 60, ratings: 4.5, numReviews: 234,
    isFeatured: true,
    tags: ['light', 'pendant', 'nordic', 'home-decor', 'walnut'],
    thumbnail: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1200&q=80'],
    model3d: '',
    specifications: { Material: 'Walnut + Aluminium', Fitting: 'E27', 'Cable Length': '1.5 m (adj)', Diameter: '35 cm', 'Max Watt': '60 W' },
  },
  {
    _id: 'h2', name: 'Carrara Marble Coffee Table', category: 'Home Decor', brand: 'LuxeHome',
    price: 24999, originalPrice: 34999,
    description: 'Italian Carrara marble top with brushed gold steel base – a statement living room centrepiece.',
    shortDescription: 'Italian Carrara marble · Brushed gold base · Unique natural veining',
    stock: 20, ratings: 4.8, numReviews: 123,
    isFeatured: true,
    tags: ['table', 'marble', 'coffee-table', 'home-decor', 'luxury'],
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80'],
    model3d: '',
    specifications: { Top: 'Carrara marble (18 mm)', Base: 'Brushed gold steel', Diameter: '80 cm', Height: '45 cm', Weight: '28 kg' },
  },
];

/** Validate a product has all required fields before display */
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

export const validMockProducts = mockProducts.filter(validateProduct);
