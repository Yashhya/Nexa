require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');
const Coupon = require('./models/Coupon');
const Seller = require('./models/Seller');
const bcrypt = require('bcryptjs');

const categories = [
  { name: 'Electronics', slug: 'electronics', icon: '💻', order: 1 },
  { name: 'Fashion',     slug: 'fashion',     icon: '👗', order: 2 },
  { name: 'Shoes',       slug: 'shoes',       icon: '👟', order: 3 },
  { name: 'Watches',     slug: 'watches',     icon: '⌚', order: 4 },
  { name: 'Accessories', slug: 'accessories', icon: '🕶️', order: 5 },
  { name: 'Home Decor',  slug: 'home-decor',  icon: '🏠', order: 6 },
];




const products = [
  // ─── ELECTRONICS ─────────────────────────────────────────
  {
    name: 'Apple iPhone 15 Pro Max',
    category: 'Electronics', brand: 'Apple',
    price: 134900, originalPrice: 149900,
    description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and ProRes video. Features a 6.7-inch Super Retina XDR display with ProMotion technology, an advanced 5x Telephoto camera system, and all-day battery life. Crafted from aerospace-grade titanium for unmatched durability.',
    shortDescription: 'A17 Pro chip · Titanium design · 5× Telephoto camera',
    stock: 50, rating: 4.8, numReviews: 1247,
    isFeatured: true, isTrending: true, freeShipping: true,
    tags: ['iphone', 'apple', 'smartphone', '5g', 'pro-max'],
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&q=80',
      'https://images.unsplash.com/photo-1695048359536-df7d1a6e5338?w=1200&q=80',
    ],
    model3d: '',
    specifications: new Map([
      ['Display', '6.7" Super Retina XDR, 120Hz ProMotion'],
      ['Chip', 'A17 Pro (3nm)'],
      ['Camera', '48MP Main + 12MP Ultra Wide + 12MP 5× Telephoto'],
      ['Battery', '4422 mAh, Up to 29 hrs video'],
      ['Storage Options', '256 GB / 512 GB / 1 TB'],
      ['OS', 'iOS 17'],
      ['Build', 'Titanium frame, Ceramic Shield front'],
    ]),
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Electronics', brand: 'Samsung',
    price: 124999, originalPrice: 139999,
    description: 'Samsung Galaxy S24 Ultra redefines flagship phones with its built-in S Pen, titanium frame, and 200MP AI camera. The 6.8-inch Dynamic AMOLED 2X display delivers a breathtaking visual experience with 2600 nits peak brightness and Snapdragon 8 Gen 3 power.',
    shortDescription: 'Built-in S Pen · 200MP AI Camera · Titanium frame',
    stock: 45, rating: 4.7, numReviews: 987,
    isFeatured: true, isTrending: true, freeShipping: true,
    tags: ['samsung', 'galaxy', 'smartphone', 's-pen', 'ultra'],
    thumbnail: 'https://images.unsplash.com/photo-1706439269756-7f09abb47a17?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1706439269756-7f09abb47a17?w=1200&q=80'],
    model3d: '',
    specifications: new Map([
      ['Display', '6.8" Dynamic AMOLED 2X, 120Hz'],
      ['Chip', 'Snapdragon 8 Gen 3'],
      ['Camera', '200MP Main + 12MP Ultra Wide + 10MP Telephoto'],
      ['Battery', '5000 mAh, 45W wired charging'],
      ['Storage Options', '256 GB / 512 GB / 1 TB'],
      ['OS', 'Android 14 (One UI 6.1)'],
      ['Build', 'Titanium frame, Gorilla Glass Armor'],
    ]),
  },
  {
    name: 'MacBook Pro 14" M3 Pro',
    category: 'Electronics', brand: 'Apple',
    price: 199900, originalPrice: 219900,
    description: 'MacBook Pro with M3 Pro chip delivers exceptional performance for pro users. The stunning Liquid Retina XDR display, up to 22 hours of battery life, and the full suite of ports make this the ultimate pro laptop for creators, developers, and engineers.',
    shortDescription: 'M3 Pro chip · Liquid Retina XDR · 22 hr battery',
    stock: 30, rating: 4.9, numReviews: 567,
    isFeatured: true, freeShipping: true,
    tags: ['macbook', 'laptop', 'apple', 'm3', 'pro'],
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80',
      'https://images.unsplash.com/photo-1611186871525-2e2f45e0f7b7?w=1200&q=80',
    ],
    model3d: '',
    specifications: new Map([
      ['Display', '14.2" Liquid Retina XDR, 120Hz ProMotion'],
      ['Chip', 'Apple M3 Pro (12-core CPU, 18-core GPU)'],
      ['RAM', '18 GB Unified Memory'],
      ['Storage', '512 GB SSD'],
      ['Battery', 'Up to 22 hours'],
      ['Ports', '3× Thunderbolt 4, HDMI 2.1, SD card, MagSafe 3'],
      ['OS', 'macOS Sonoma'],
    ]),
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    category: 'Electronics', brand: 'Sony',
    price: 24990, originalPrice: 34990,
    description: 'Industry-leading noise cancellation headphones with 8 microphones and two processors. Enjoy 30-hour battery life, crystal-clear hands-free calling, and premium sound quality. The redesigned all-day comfort fit makes them perfect for extended listening sessions.',
    shortDescription: 'Industry-leading ANC · 30 hr battery · 8 microphones',
    stock: 80, rating: 4.8, numReviews: 2341,
    isFeatured: true, freeShipping: true,
    tags: ['headphones', 'anc', 'sony', 'wireless', 'noise-cancelling'],
    thumbnail: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1200&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
    ],
    model3d: '',
    specifications: new Map([
      ['Driver Unit', '30 mm dome type'],
      ['Frequency Response', '4 Hz – 40,000 Hz'],
      ['Battery Life', '30 hours (ANC on), 40 hours (ANC off)'],
      ['Quick Charge', '3 min = 3 hrs playback'],
      ['Connectivity', 'Bluetooth 5.2 + 3.5mm jack'],
      ['Weight', '250 g'],
      ['Microphones', '8 microphones for ANC and calls'],
    ]),
  },
  {
    name: 'Apple Watch Series 9',
    category: 'Electronics', brand: 'Apple',
    price: 41900, originalPrice: 44900,
    description: 'Apple Watch Series 9 features the breakthrough S9 chip and magical Double Tap gesture. With an Always-On Retina display that reaches 2000 nits, advanced health sensors including ECG and Blood Oxygen, and all-day battery life – it is the most capable Apple Watch ever made.',
    shortDescription: 'S9 chip · Double Tap gesture · Always-On Retina 2000 nits',
    stock: 70, rating: 4.7, numReviews: 1567,
    isFeatured: true, freeShipping: true,
    tags: ['smartwatch', 'apple', 'watch', 'health', 'fitness'],
    thumbnail: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&q=80',
      'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=1200&q=80',
    ],
    model3d: '',
    specifications: new Map([
      ['Display', 'Always-On Retina LTPO OLED, 2000 nits'],
      ['Chip', 'S9 SiP (dual-core)'],
      ['Health Sensors', 'ECG, Blood Oxygen, Temperature, Heart Rate'],
      ['Battery', '18 hours (up to 36 hrs Low Power Mode)'],
      ['Water Resistance', '50 metres'],
      ['Connectivity', 'GPS + LTE or GPS only'],
      ['Case Sizes', '41mm / 45mm'],
    ]),
  },

  // ─── SHOES ────────────────────────────────────────────────
  {
    name: 'Nike Air Max 270 React',
    category: 'Shoes', brand: 'Nike',
    price: 12995, originalPrice: 14995,
    description: 'Combining the exaggerated Air heel of the Air Max 270 with React foam, this shoe delivers the ultimate in cushioning comfort. The bold, modern design features a large window to showcase the Air unit, and a sleek, breathable upper built for all-day wear.',
    shortDescription: 'Air Max cushioning + React foam · Breathable upper',
    stock: 100, rating: 4.6, numReviews: 1456,
    isFeatured: true,
    tags: ['nike', 'sneakers', 'airmax', 'running', 'react'],
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=80',
    ],
    model3d: '',
    specifications: new Map([
      ['Upper', 'Engineered mesh with fused overlays'],
      ['Midsole', 'React foam + Air Max 270 unit'],
      ['Outsole', 'Rubber with flex grooves'],
      ['Closure', 'Lace-up'],
      ['Style', 'Lifestyle / Running'],
      ['Available Sizes', 'UK 6 – UK 11'],
    ]),
  },
  {
    name: 'Adidas Ultraboost 23',
    category: 'Shoes', brand: 'Adidas',
    price: 16999, originalPrice: 18999,
    description: 'The Adidas Ultraboost 23 elevates performance running with a redesigned BOOST midsole, a supportive PRIMEKNIT+ upper, and a Continental rubber outsole for exceptional grip in all conditions. The most responsive Ultraboost yet – built for speed, comfort and style.',
    shortDescription: 'BOOST midsole · PRIMEKNIT+ upper · Continental grip',
    stock: 75, rating: 4.7, numReviews: 892,
    isFeatured: true, isTrending: true,
    tags: ['adidas', 'ultraboost', 'running', 'sneakers', 'boost'],
    thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=1200&q=80'],
    model3d: '',
    specifications: new Map([
      ['Upper', 'PRIMEKNIT+'],
      ['Midsole', 'Boost + Linear Energy Push system'],
      ['Outsole', 'Continental™ Rubber'],
      ['Closure', 'Lace-up'],
      ['Drop', '10 mm'],
      ['Available Sizes', 'UK 6 – UK 12'],
    ]),
  },

  // ─── FASHION ─────────────────────────────────────────────
  {
    name: 'Premium Biker Leather Jacket',
    category: 'Fashion', brand: 'LeatherCraft Co.',
    price: 9999, originalPrice: 14999,
    description: 'Handcrafted from genuine full-grain leather, this biker jacket is built to last a lifetime. Features YKK zip closures, a quilted polyester lining for warmth, and a classic asymmetric design with a distressed finish for an authentic vintage look that only gets better with age.',
    shortDescription: 'Full-grain leather · YKK zips · Quilted lining',
    stock: 40, rating: 4.6, numReviews: 328,
    isFeatured: true,
    tags: ['jacket', 'leather', 'biker', 'fashion', 'mens'],
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=1200&q=80',
    ],
    model3d: '',
    specifications: new Map([
      ['Material', 'Full-grain genuine leather'],
      ['Lining', 'Quilted polyester'],
      ['Closure', 'YKK asymmetric zip with snap collar'],
      ['Fit', 'Regular'],
      ['Available Sizes', 'S / M / L / XL / XXL'],
      ['Care', 'Wipe clean with damp cloth, condition regularly'],
    ]),
  },
  {
    name: "Levi's 501 Original Jeans",
    category: 'Fashion', brand: "Levi's",
    price: 3999, originalPrice: 5999,
    description: "The Levi's 501 Original is the jean that started it all in 1873. Straight leg, iconic button fly, and a regular fit through the seat and thigh. Made from heavyweight 12 oz denim for exceptional durability. Stonewashed for a lived-in look from the very first wear.",
    shortDescription: 'Original straight-leg · Button fly · 12 oz stonewash denim',
    stock: 200, rating: 4.5, numReviews: 1234,
    isFeatured: false, isTrending: true,
    tags: ['levis', 'jeans', 'denim', '501', 'fashion'],
    thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=1200&q=80'],
    model3d: '',
    specifications: new Map([
      ['Fit', 'Straight'],
      ['Rise', 'Mid-rise'],
      ['Closure', 'Button fly'],
      ['Material', '100% Cotton (12 oz denim)'],
      ['Wash', 'Stonewash'],
      ['Available Sizes', 'Waist 28–40 / Length 30–34'],
    ]),
  },

  // ─── WATCHES ─────────────────────────────────────────────
  {
    name: 'Rolex Submariner Homage',
    category: 'Watches', brand: 'Tempo Luxe',
    price: 15999, originalPrice: 22999,
    description: 'A premium automatic dive watch inspired by the legendary Submariner. Powered by a Swiss-grade automatic movement, featuring a scratch-resistant sapphire crystal, unidirectional rotating ceramic bezel, and water resistance to 300 metres. A timepiece that commands instant respect.',
    shortDescription: 'Swiss automatic · Sapphire crystal · 300 m water resistant',
    stock: 30, rating: 4.7, numReviews: 456,
    isFeatured: true, freeShipping: true,
    tags: ['watch', 'automatic', 'diver', 'luxury', 'steel'],
    thumbnail: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=80',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d2e98?w=1200&q=80',
    ],
    model3d: '',
    specifications: new Map([
      ['Movement', 'Automatic (Swiss-grade caliber)'],
      ['Crystal', 'Scratch-resistant sapphire'],
      ['Case', '41 mm stainless steel'],
      ['Bezel', 'Unidirectional rotating ceramic'],
      ['Bracelet', 'Stainless steel Oyster-style'],
      ['Water Resistance', '300 m / 1000 ft'],
    ]),
  },
  {
    name: 'Samsung Galaxy Watch 6 Classic',
    category: 'Watches', brand: 'Samsung',
    price: 34999, originalPrice: 39999,
    description: 'The Samsung Galaxy Watch 6 Classic revives the iconic rotating bezel with a refined premium design. Advanced health tools include Body Composition analysis, Sleep Coaching, ECG, and Blood Pressure monitoring. Powered by Wear OS with full Samsung Galaxy ecosystem integration.',
    shortDescription: 'Rotating bezel · ECG + Body Composition · Wear OS',
    stock: 55, rating: 4.6, numReviews: 621,
    isFeatured: true, freeShipping: true,
    tags: ['smartwatch', 'samsung', 'galaxy', 'health', 'wear-os'],
    thumbnail: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1200&q=80'],
    model3d: '',
    specifications: new Map([
      ['Display', '1.5" Super AMOLED (466×466)'],
      ['OS', 'Wear OS 4 + One UI Watch 5'],
      ['Health', 'ECG, Blood Pressure, Body Composition, SpO2, Sleep'],
      ['Battery', 'Up to 40 hours'],
      ['Case', '47 mm stainless steel'],
      ['Water Resistance', '5ATM + IP68 + MIL-STD-810H'],
    ]),
  },

  // ─── ACCESSORIES ─────────────────────────────────────────
  {
    name: 'Ray-Ban Aviator Classic',
    category: 'Accessories', brand: 'Ray-Ban',
    price: 9500, originalPrice: 11500,
    description: 'The Ray-Ban Aviator Classic is the original aviator-style sunglasses, worn by icons for over 80 years. Classic gold metal frame with signature G-15 green glass lenses that reduce eye fatigue, provide 100% UV protection, and deliver true colour perception.',
    shortDescription: 'G-15 glass lenses · Gold frame · 100% UV protection',
    stock: 120, rating: 4.7, numReviews: 2345,
    isFeatured: true, isTrending: true, freeShipping: true,
    tags: ['ray-ban', 'sunglasses', 'aviator', 'uv', 'accessories'],
    thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&q=80'],
    model3d: '',
    specifications: new Map([
      ['Frame', 'Gold metal'],
      ['Lenses', 'G-15 green glass'],
      ['UV Protection', '100% UV400'],
      ['Style', 'Aviator'],
      ['Lens Width', '58 mm'],
      ['Origin', 'Made in Italy'],
    ]),
  },

  // ─── HOME DECOR ──────────────────────────────────────────
  {
    name: 'Nordic Walnut Pendant Light',
    category: 'Home Decor', brand: 'LumiHome',
    price: 4999, originalPrice: 7999,
    description: 'Minimalist Nordic pendant light crafted from genuine walnut wood and spun aluminium. The warm, diffused glow creates an inviting ambience perfect for dining rooms and kitchen islands. E27 bulb fitting makes it compatible with all smart bulbs.',
    shortDescription: 'Walnut wood + aluminium · E27 fitting · Smart-bulb ready',
    stock: 60, rating: 4.5, numReviews: 234,
    isFeatured: true,
    tags: ['light', 'pendant', 'nordic', 'home-decor', 'walnut'],
    thumbnail: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1200&q=80'],
    model3d: '',
    specifications: new Map([
      ['Material', 'Walnut wood + Aluminium'],
      ['Fitting', 'E27 (Bulb not included)'],
      ['Cable Length', '1.5 m (adjustable)'],
      ['Shade Diameter', '35 cm'],
      ['Max Wattage', '60 W'],
      ['Finish Options', 'Natural walnut / Matte black'],
    ]),
  },
  {
    name: 'Carrara Marble Coffee Table',
    category: 'Home Decor', brand: 'LuxeHome',
    price: 24999, originalPrice: 34999,
    description: 'Italian Carrara marble top coffee table with a brushed gold stainless steel base. The round form and premium materials make this a statement centrepiece for any living room. Each marble piece is unique with its own natural veining – a true work of functional art.',
    shortDescription: 'Italian Carrara marble · Brushed gold base · Unique natural veining',
    stock: 20, rating: 4.8, numReviews: 123,
    isFeatured: true,
    tags: ['table', 'marble', 'coffee-table', 'home-decor', 'luxury'],
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80'],
    model3d: '',
    specifications: new Map([
      ['Top Material', 'Italian Carrara marble (18 mm thick)'],
      ['Base', 'Brushed gold stainless steel'],
      ['Diameter', '80 cm'],
      ['Height', '45 cm'],
      ['Weight', '28 kg'],
      ['Assembly', 'Required – tools included'],
    ]),
  },
];

const coupons = [
  { code: 'NEXA10',    description: '10% off on all orders',                 discountType: 'percentage', discountValue: 10,  minOrderAmount: 999,  maxDiscount: 500,  usageLimit: 1000, validUntil: new Date(Date.now() + 365*86400*1000) },
  { code: 'WELCOME20', description: '20% off for new users',                 discountType: 'percentage', discountValue: 20,  minOrderAmount: 2000, maxDiscount: 1000, usageLimit: 500,  validUntil: new Date(Date.now() + 365*86400*1000) },
  { code: 'FLAT500',   description: 'Flat ₹500 off on orders above ₹3000',  discountType: 'fixed',      discountValue: 500, minOrderAmount: 3000, usageLimit: 200,   validUntil: new Date(Date.now() + 365*86400*1000) },
  { code: 'TECH15',    description: '15% off on electronics',                discountType: 'percentage', discountValue: 15,  minOrderAmount: 5000, maxDiscount: 3000, usageLimit: 300,  validUntil: new Date(Date.now() + 180*86400*1000), applicableCategories: ['Electronics'] },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    await Category.deleteMany({});
    await Coupon.deleteMany({});
    await User.deleteMany({});
    await Seller.deleteMany({});
    console.log('🗑️  Cleared existing data');

    await Category.insertMany(categories);
    console.log(`✅ Inserted ${categories.length} categories`);

    const adminUser = await User.create({ name: 'Admin Nexus', email: 'admin@nexa.com', password: 'Admin@123', role: 'admin', isEmailVerified: true });
    console.log('✅ Created Admin: admin@nexa.com / Admin@123');

    const sellerUser = await User.create({ name: 'Demo Seller', email: 'seller@nexa.com', password: 'Seller@123', role: 'seller', isEmailVerified: true });
    const sellerProfile = await Seller.create({ user: sellerUser._id, storeName: 'NEXA Premium Store', storeDescription: 'Official store for premium quality products', status: 'approved' });
    console.log('✅ Created Seller: seller@nexa.com / Seller@123');

    await User.create({ name: 'Demo User', email: 'user@nexa.com', password: 'User@123', role: 'user', isEmailVerified: true });
    console.log('✅ Created User: user@nexa.com / User@123');

    const ts = Date.now();
    const productsWithMeta = products.map((p, i) => ({
      ...p,
      seller: sellerProfile._id,
      status: 'approved',
      isActive: true,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + ts + i,
      sku: 'NEXA-' + ts + '-' + i,
      ratings: p.rating || 4.5,
    }));

    await Product.insertMany(productsWithMeta, { ordered: false });
    console.log(`✅ Inserted ${products.length} premium products`);

    await Coupon.insertMany(coupons);
    console.log(`✅ Inserted ${coupons.length} coupons`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('─────────────────────────────────────────');
    console.log('   admin@nexa.com   / Admin@123');
    console.log('   seller@nexa.com  / Seller@123');
    console.log('   user@nexa.com    / User@123');
    console.log('─────────────────────────────────────────');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
