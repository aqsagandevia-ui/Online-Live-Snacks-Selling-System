const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/products');
const Category = require('./models/Category');
const User = require('./models/User');
const Coupon = require('./models/Coupon');
const Order = require('./models/Order');
const Notification = require('./models/Notification');

const categories = [
    {
        name: 'Chips',
        slug: 'chips',
        description: 'Crispy, thinly sliced and flavored potato & vegetable chips.',
        image: '/photo/chips1.webp',
        itemCount: 11
    },
    {
        name: 'Namkeen',
        slug: 'namkeen',
        description: 'Authentic traditional Indian savory mixtures and sev.',
        image: '/photo/namkken1.webp',
        itemCount: 9
    },
    {
        name: 'Corn Snacks',
        slug: 'corn-snacks',
        description: 'Crunchy roasted and extruded corn rings, twists & puffs.',
        image: '/photo/corn1.png',
        itemCount: 8
    },
    {
        name: 'Chakli',
        slug: 'chakli',
        description: 'Spiral crunchy savories made from spiced flour and pulses.',
        image: '/photo/chakli1.jpg',
        itemCount: 7
    },
    {
        name: 'Special Combos',
        slug: 'special-combos',
        description: 'Value pack snack combinations for parties and festive sharing.',
        image: '/photo/products1.webp',
        itemCount: 8
    }
];

const products = [
    // Chips Category
    {
        name: 'Chilli Sprinkled Chips',
        price: 30,
        discountPrice: 25,
        category: 'Chips',
        image: '/photo/chips1.webp',
        description: 'Crispy golden potato chips dusted with fiery red chilli and tangy spices.',
        stock: 35,
        lowStockThreshold: 5,
        ingredients: ['Potatoes', 'Edible Oil', 'Red Chilli Powder', 'Black Salt', 'Spices'],
        prepTime: 'Freshly Packed',
        rating: 4.8,
        reviewCount: 34,
        isFeatured: true,
        isSpecial: true
    },
    {
        name: 'Combo Potato Chips',
        price: 60,
        discountPrice: 50,
        category: 'Chips',
        image: '/photo/chips2.webp',
        description: 'Delightful combo pack featuring salted, spicy and cream onion flavours.',
        stock: 22,
        lowStockThreshold: 5,
        ingredients: ['Farm Fresh Potatoes', 'Vegetable Oil', 'Rock Salt', 'Onion Powder', 'Herbs'],
        prepTime: 'Freshly Packed',
        rating: 4.7,
        reviewCount: 28,
        isFeatured: true
    },
    {
        name: 'Crispy Banana Wafers',
        price: 50,
        discountPrice: 45,
        category: 'Chips',
        image: '/photo/chips3.jpg',
        description: 'Thin yellow raw banana slices crisp-fried in pure groundnut oil with sea salt.',
        stock: 40,
        lowStockThreshold: 8,
        ingredients: ['Raw Kerala Bananas', 'Groundnut Oil', 'Sendha Namak', 'Black Pepper'],
        prepTime: 'Freshly Packed',
        rating: 4.9,
        reviewCount: 42,
        isFeatured: true
    },
    {
        name: 'Oats Chips - Peri Peri',
        price: 95,
        discountPrice: 80,
        category: 'Chips',
        image: '/photo/chips4.jpg',
        description: 'Healthy baked rolled oat crisps seasoned with hot African peri peri seasoning.',
        stock: 18,
        lowStockThreshold: 5,
        ingredients: ['Rolled Oats Flour', 'Urad Dal', 'Peri Peri Seasoning', 'Olive Oil'],
        prepTime: 'Baked Fresh',
        rating: 4.6,
        reviewCount: 19
    },
    {
        name: 'Beetroot & Herb Chips',
        price: 110,
        discountPrice: 95,
        category: 'Chips',
        image: '/photo/chips5.webp',
        description: 'Vibrant beetroot veggie crisps infused with rosemary, garlic, and pink salt.',
        stock: 15,
        lowStockThreshold: 4,
        ingredients: ['Beetroot Puree', 'Rice Flour', 'Rosemary Extract', 'Himalayan Pink Salt'],
        prepTime: 'Vacuum Fried',
        rating: 4.5,
        reviewCount: 15
    },
    {
        name: 'Lemon Chilli Wafers',
        price: 40,
        discountPrice: 35,
        category: 'Chips',
        image: '/photo/chips6.png',
        description: 'Zesty lemon zest meets crushed green chillies on extra-crispy potato slices.',
        stock: 25,
        lowStockThreshold: 6,
        ingredients: ['Potatoes', 'Lemon Juice Powder', 'Green Chilli Blend', 'Edible Salt'],
        prepTime: 'Freshly Packed',
        rating: 4.7,
        reviewCount: 21
    },
    {
        name: 'Classic Salted Wafers',
        price: 20,
        discountPrice: 18,
        category: 'Chips',
        image: '/photo/chips7.webp',
        description: 'Evergreen golden potato wafers with just the right pinch of iodized salt.',
        stock: 50,
        lowStockThreshold: 10,
        ingredients: ['Potatoes', 'Refined Palmolein Oil', 'Iodized Salt'],
        prepTime: 'Freshly Packed',
        rating: 4.8,
        reviewCount: 65,
        isFeatured: true
    },
    {
        name: 'Cornitos Nacho Chips',
        price: 120,
        discountPrice: 99,
        category: 'Chips',
        image: '/photo/chips8.webp',
        description: 'Mexican style crunchy corn tortilla chips paired with cheese and herbs.',
        stock: 12,
        lowStockThreshold: 4,
        ingredients: ['Non-GMO Corn', 'Corn Oil', 'Cheese Powder', 'Jalapeno Flakes'],
        prepTime: 'Freshly Packed',
        rating: 4.9,
        reviewCount: 54,
        isSpecial: true
    },
    {
        name: 'Masala Rumbles',
        price: 25,
        discountPrice: 20,
        category: 'Chips',
        image: '/photo/chips9.jpg',
        description: 'Ridge-cut potato crisps holding rich roasted aromatic spices.',
        stock: 30,
        lowStockThreshold: 5,
        ingredients: ['Ridge Cut Potatoes', 'Coriander Powder', 'Cumin', 'Amchur', 'Salt'],
        prepTime: 'Freshly Packed',
        rating: 4.6,
        reviewCount: 17
    },
    {
        name: 'Flamin Hot Crunch',
        price: 30,
        discountPrice: 25,
        category: 'Chips',
        image: '/photo/chips10.jpg',
        description: 'Intense spice explosion for extreme heat lovers.',
        stock: 8,
        lowStockThreshold: 5,
        ingredients: ['Corn Meal', 'Ghost Pepper Blend', 'Paprika', 'Citric Acid', 'Salt'],
        prepTime: 'Freshly Packed',
        rating: 4.8,
        reviewCount: 40
    },

    // Namkeen Category
    {
        name: 'Royal Namkeen Mixture',
        price: 50,
        discountPrice: 45,
        category: 'Namkeen',
        image: '/photo/namkken1.webp',
        description: 'Special blend of fried lentils, sev, peanuts, cornflakes, and aromatic spices.',
        stock: 45,
        lowStockThreshold: 10,
        ingredients: ['Gram Flour', 'Peanuts', 'Cornflakes', 'Moong Dal', 'Spices Blend'],
        prepTime: 'Daily Fresh',
        rating: 4.9,
        reviewCount: 52,
        isFeatured: true,
        isSpecial: true
    },
    {
        name: 'Jeera Namkeen Cookies',
        price: 100,
        discountPrice: 85,
        category: 'Namkeen',
        image: '/photo/namkeen2.webp',
        description: 'Savoury oven-baked crunchy biscuits loaded with roasted cumin seeds.',
        stock: 20,
        lowStockThreshold: 5,
        ingredients: ['Wheat Flour', 'Pure Butter', 'Roasted Cumin', 'Rock Salt'],
        prepTime: 'Oven Baked',
        rating: 4.6,
        reviewCount: 19
    },
    {
        name: 'Marwari Bhujiya Sev',
        price: 60,
        discountPrice: 50,
        category: 'Namkeen',
        image: '/photo/namkeen3.webp',
        description: 'Authentic Bikaneri style spicy moth bean & besan sev noodles.',
        stock: 38,
        lowStockThreshold: 8,
        ingredients: ['Moth Dal Flour', 'Besan', 'Cardamom', 'Cloves', 'Black Pepper'],
        prepTime: 'Daily Fresh',
        rating: 4.9,
        reviewCount: 78,
        isFeatured: true
    },
    {
        name: 'Diet Lite Chiwda',
        price: 70,
        discountPrice: 60,
        category: 'Namkeen',
        image: '/photo/namkeen4.webp',
        description: 'Roasted thin beaten rice flakes with curry leaves, mustard seeds & cashew bits.',
        stock: 28,
        lowStockThreshold: 6,
        ingredients: ['Roasted Poha', 'Cashews', 'Curry Leaves', 'Turmeric', 'Green Chilli'],
        prepTime: 'Dry Roasted',
        rating: 4.7,
        reviewCount: 31
    },
    {
        name: 'Navratan Mix',
        price: 65,
        discountPrice: 55,
        category: 'Namkeen',
        image: '/photo/namkeen5.webp',
        description: 'Nine delicious ingredients including dry fruits, lentils, and crispy boondi.',
        stock: 24,
        lowStockThreshold: 5,
        ingredients: ['Cashews', 'Raisins', 'Lentils', 'Gram Flour Strings', 'Melon Seeds'],
        prepTime: 'Daily Fresh',
        rating: 4.8,
        reviewCount: 44
    },
    {
        name: 'Tangy Lemon Bhel',
        price: 45,
        discountPrice: 40,
        category: 'Namkeen',
        image: '/photo/namkeen6.webp',
        description: 'Crispy puffed rice tossed with sev, peanuts, tangy raw mango & lemon seasoning.',
        stock: 35,
        lowStockThreshold: 7,
        ingredients: ['Puffed Rice', 'Sev', 'Roasted Peanuts', 'Lemon Extract', 'Chaat Masala'],
        prepTime: 'Instant Crunch',
        rating: 4.5,
        reviewCount: 22
    },
    {
        name: 'Khatta Meetha Mixture',
        price: 50,
        discountPrice: 45,
        category: 'Namkeen',
        image: '/photo/namkeen7.webp',
        description: 'Sweet and sour crunchy snack mix with sago pearls, sev, and golden raisins.',
        stock: 30,
        lowStockThreshold: 6,
        ingredients: ['Rice Flakes', 'Sago Pearls', 'Gram Flour', 'Sugar', 'Dry Mango Powder'],
        prepTime: 'Daily Fresh',
        rating: 4.8,
        reviewCount: 37
    },
    {
        name: 'Kaju Kashmiri Mix',
        price: 120,
        discountPrice: 99,
        category: 'Namkeen',
        image: '/photo/namkeen12.webp',
        description: 'Rich royal blend loaded with premium whole roasted cashews and Kashmiri spices.',
        stock: 14,
        lowStockThreshold: 4,
        ingredients: ['Whole Cashews', 'Almonds', 'Melon Seeds', 'Spiced Poha', 'Saffron Essence'],
        prepTime: 'Royal Blend',
        rating: 4.9,
        reviewCount: 48,
        isSpecial: true
    },
    {
        name: 'Farali Chiwda (Upwas)',
        price: 60,
        discountPrice: 50,
        category: 'Namkeen',
        image: '/photo/namkeen14.webp',
        description: 'Fasting friendly potato shreds & crunchy peanuts seasoned with rock salt.',
        stock: 32,
        lowStockThreshold: 6,
        ingredients: ['Dried Potato Shreds', 'Peanuts', 'Sendha Namak', 'Sugar', 'Green Chillies'],
        prepTime: 'Upwas Special',
        rating: 4.8,
        reviewCount: 29
    },

    // Corn Snacks Category
    {
        name: 'Thai Chilli Corn Rings',
        price: 60,
        discountPrice: 50,
        category: 'Corn Snacks',
        image: '/photo/corn1.png',
        description: 'Crispy puffed corn rings seasoned with sweet & spicy authentic Thai spices.',
        stock: 25,
        lowStockThreshold: 5,
        ingredients: ['Corn Grits', 'Thai Spice Blend', 'Sugar', 'Paprika', 'Vegetable Oil'],
        prepTime: 'Extruded Fresh',
        rating: 4.7,
        reviewCount: 25,
        isFeatured: true
    },
    {
        name: 'Cheezy Corn Puffs',
        price: 70,
        discountPrice: 60,
        category: 'Corn Snacks',
        image: '/photo/corn2.png',
        description: 'Melt-in-mouth puffed corn balls coated with cheddar cheese powder.',
        stock: 30,
        lowStockThreshold: 6,
        ingredients: ['Corn Flour', 'Cheddar Cheese Powder', 'Whey', 'Butter Flavors', 'Salt'],
        prepTime: 'Extruded Fresh',
        rating: 4.9,
        reviewCount: 56,
        isSpecial: true
    },
    {
        name: 'Katak Matak Tomato Twist',
        price: 50,
        discountPrice: 40,
        category: 'Corn Snacks',
        image: '/photo/corn3.png',
        description: 'Crunchy curly corn twists infused with ripe tangy sun-dried tomato seasoning.',
        stock: 22,
        lowStockThreshold: 5,
        ingredients: ['Corn Meal', 'Tomato Powder', 'Black Salt', 'Red Chilli', 'Refined Oil'],
        prepTime: 'Extruded Fresh',
        rating: 4.6,
        reviewCount: 18
    },
    {
        name: 'Cornigo Crunchy Rings',
        price: 60,
        discountPrice: 50,
        category: 'Corn Snacks',
        image: '/photo/corn4.png',
        description: 'Ring shaped golden roasted corn crisps with garlic and oregano sprinkles.',
        stock: 20,
        lowStockThreshold: 4,
        ingredients: ['Yellow Corn Meal', 'Garlic Powder', 'Oregano', 'Iodized Salt'],
        prepTime: 'Extruded Fresh',
        rating: 4.7,
        reviewCount: 21
    },
    {
        name: 'Butter Corn Rings',
        price: 30,
        discountPrice: 25,
        category: 'Corn Snacks',
        image: '/photo/corns5.webp',
        description: 'Buttery snack rings perfect for kids and evening tea time munching.',
        stock: 35,
        lowStockThreshold: 7,
        ingredients: ['Corn Flour', 'Dairy Butter', 'Sea Salt', 'Vegetable Fat'],
        prepTime: 'Freshly Packed',
        rating: 4.6,
        reviewCount: 14
    },
    {
        name: 'Masala Makai Poha',
        price: 45,
        discountPrice: 40,
        category: 'Corn Snacks',
        image: '/photo/corn6.webp',
        description: 'Golden yellow corn flakes flash fried and tossed in chaat seasonings.',
        stock: 28,
        lowStockThreshold: 6,
        ingredients: ['Corn Flakes (Makai)', 'Roasted Peanuts', 'Turmeric', 'Dry Mango Powder'],
        prepTime: 'Daily Fresh',
        rating: 4.8,
        reviewCount: 26
    },
    {
        name: 'Roasted Rice & Corn Poha',
        price: 50,
        discountPrice: 45,
        category: 'Corn Snacks',
        image: '/photo/corn7.webp',
        description: 'Healthy dual-grain roasted crunch with crunchy curry leaves & roasted chana.',
        stock: 20,
        lowStockThreshold: 5,
        ingredients: ['Roasted Rice Flakes', 'Roasted Corn Flakes', 'Roasted Chana', 'Salt'],
        prepTime: 'Dry Roasted',
        rating: 4.5,
        reviewCount: 16
    },
    {
        name: 'Tomato Corn Crisps',
        price: 20,
        discountPrice: 15,
        category: 'Corn Snacks',
        image: '/photo/corn8.webp',
        description: 'Tangy quick snack corn crisps packed with appetizing flavor.',
        stock: 40,
        lowStockThreshold: 8,
        ingredients: ['Corn Meal', 'Tomato Extract', 'Salt', 'Spices'],
        prepTime: 'Freshly Packed',
        rating: 4.4,
        reviewCount: 12
    },

    // Chakli Category
    {
        name: 'Wheat Flour Spiced Chakli',
        price: 40,
        discountPrice: 35,
        category: 'Chakli',
        image: '/photo/chakli1.jpg',
        description: 'Traditional wholesome whole wheat spirals infused with sesame seeds and carom.',
        stock: 30,
        lowStockThreshold: 6,
        ingredients: ['Whole Wheat Flour', 'White Sesame Seeds', 'Ajwain', 'Turmeric', 'Red Chilli'],
        prepTime: 'Handcrafted',
        rating: 4.8,
        reviewCount: 39,
        isFeatured: true
    },
    {
        name: 'Crispy Rice Flour Murukku',
        price: 50,
        discountPrice: 40,
        category: 'Chakli',
        image: '/photo/chakli2.webp',
        description: 'South Indian style white rice murukku with supreme crunch and cumin aroma.',
        stock: 35,
        lowStockThreshold: 7,
        ingredients: ['Rice Flour', 'Urad Dal Flour', 'Cumin Seeds', 'Asafoetida', 'Butter'],
        prepTime: 'Handcrafted',
        rating: 4.9,
        reviewCount: 45,
        isSpecial: true
    },
    {
        name: 'Ajwain & Heeng Chakli',
        price: 60,
        discountPrice: 50,
        category: 'Chakli',
        image: '/photo/chakli3.jpg',
        description: 'Fragrant chakli enriched with pure hing and digestive carom seeds.',
        stock: 25,
        lowStockThreshold: 5,
        ingredients: ['Bhajan Flour (Mixed Pulses)', 'Ajwain', 'Heeng (Compounded Asafoetida)', 'Oil'],
        prepTime: 'Handcrafted',
        rating: 4.9,
        reviewCount: 33
    },
    {
        name: 'Butter Garlic Chakli',
        price: 110,
        discountPrice: 95,
        category: 'Chakli',
        image: '/photo/chakli4.webp',
        description: 'Melt in mouth buttery spirals infused with roasted garlic paste.',
        stock: 16,
        lowStockThreshold: 4,
        ingredients: ['Rice Flour', 'Amul Butter', 'Garlic Puree', 'Salt', 'Spices'],
        prepTime: 'Handcrafted',
        rating: 4.7,
        reviewCount: 27
    },
    {
        name: 'Softy Ghee Chakli',
        price: 180,
        discountPrice: 150,
        category: 'Chakli',
        image: '/photo/chakli5.png',
        description: 'Premium festive delicacy prepared in pure cow ghee for tender crumble.',
        stock: 12,
        lowStockThreshold: 3,
        ingredients: ['Gram Flour', 'Pure Desi Ghee', 'Cardamom', 'Sesame Seeds', 'Rock Salt'],
        prepTime: 'Pure Ghee',
        rating: 5.0,
        reviewCount: 62,
        isFeatured: true,
        isSpecial: true
    },
    {
        name: 'Palak Greens Chakli',
        price: 80,
        discountPrice: 70,
        category: 'Chakli',
        image: '/photo/chakli6.jpg',
        description: 'Nutritious green spiral treats fortified with fresh spinach puree.',
        stock: 18,
        lowStockThreshold: 4,
        ingredients: ['Spinach Puree', 'Rice Flour', 'Cumin', 'Green Chilli', 'Sesame'],
        prepTime: 'Handcrafted',
        rating: 4.6,
        reviewCount: 16
    },
    {
        name: 'Methi Crunch Chakli',
        price: 60,
        discountPrice: 50,
        category: 'Chakli',
        image: '/photo/chakli7.webp',
        description: 'Savoury swirls spiked with fragrant dried fenugreek leaves (kasoori methi).',
        stock: 22,
        lowStockThreshold: 5,
        ingredients: ['Mixed Grain Flour', 'Kasoori Methi', 'Red Chilli Powder', 'Sesame', 'Salt'],
        prepTime: 'Handcrafted',
        rating: 4.7,
        reviewCount: 24
    },

    // Special Combos & Authentic Gujarati / Indian Snacks
    {
        name: 'Aloo Sev Classic',
        price: 40,
        discountPrice: 35,
        category: 'Special Combos',
        image: '/photo/products3.avif',
        description: 'Tender spiced mashed potato strings crisp-fried to perfection.',
        stock: 45,
        lowStockThreshold: 8,
        ingredients: ['Potatoes', 'Besan', 'Mint Extract', 'Garam Masala', 'Salt'],
        prepTime: 'Daily Fresh',
        rating: 4.8,
        reviewCount: 50,
        isFeatured: true
    },
    {
        name: 'Garlic Sev Murmura',
        price: 30,
        discountPrice: 25,
        category: 'Special Combos',
        image: '/photo/products4.jpg',
        description: 'Crispy roasted murmura tossed with crunchy spicy lasan sev & groundnuts.',
        stock: 35,
        lowStockThreshold: 7,
        ingredients: ['Puffed Rice', 'Garlic Sev', 'Fried Peanuts', 'Curry Leaves', 'Turmeric'],
        prepTime: 'Daily Fresh',
        rating: 4.7,
        reviewCount: 30
    },
    {
        name: 'Bhavnagri Gathiya',
        price: 50,
        discountPrice: 40,
        category: 'Special Combos',
        image: '/photo/products8.webp',
        description: 'Soft and spongy iconic Gujarati tea snack seasoned with crushed black pepper & ajwain.',
        stock: 40,
        lowStockThreshold: 8,
        ingredients: ['Besan', 'Black Pepper', 'Ajwain', 'Papad Khar', 'Groundnut Oil'],
        prepTime: 'Freshly Prepared',
        rating: 4.9,
        reviewCount: 75,
        isFeatured: true,
        isSpecial: true
    },
    {
        name: 'Tikha Papdi Gathiya',
        price: 60,
        discountPrice: 50,
        category: 'Special Combos',
        image: '/photo/products9.jpg',
        description: 'Crisp ribbon style gram flour wafers loaded with spicy chilli punch.',
        stock: 28,
        lowStockThreshold: 6,
        ingredients: ['Bengal Gram Flour', 'Red Chilli Powder', 'Asafoetida', 'Salt'],
        prepTime: 'Daily Fresh',
        rating: 4.7,
        reviewCount: 29
    },
    {
        name: 'Spicy Chana Jor Garam',
        price: 40,
        discountPrice: 30,
        category: 'Special Combos',
        image: '/photo/products10.jpg',
        description: 'Pressed black chickpeas roasted with amchur, cumin, and fiery chaat masala.',
        stock: 30,
        lowStockThreshold: 6,
        ingredients: ['Pressed Black Gram', 'Dry Mango Powder', 'Coriander', 'Rock Salt'],
        prepTime: 'Daily Fresh',
        rating: 4.8,
        reviewCount: 36
    },
    {
        name: 'Authentic Bhakarwadi',
        price: 70,
        discountPrice: 60,
        category: 'Special Combos',
        image: '/photo/products11.jpg',
        description: 'Pinwheel rolls stuffed with a spicy sweet coconut and sesame masala core.',
        stock: 26,
        lowStockThreshold: 5,
        ingredients: ['Gram Flour', 'All Purpose Flour', 'Dry Coconut', 'Fennel Seeds', 'Sesame'],
        prepTime: 'Traditional Recipe',
        rating: 4.9,
        reviewCount: 68,
        isFeatured: true
    },
    {
        name: 'Shing Bhujiya (Masala Peanuts)',
        price: 40,
        discountPrice: 35,
        category: 'Special Combos',
        image: '/photo/products13.jpg',
        description: 'Crisp besan batter coated roasted peanuts dusted with chatpata masala.',
        stock: 40,
        lowStockThreshold: 8,
        ingredients: ['Selected Peanuts', 'Gram Flour', 'Chilli Powder', 'Ginger Powder', 'Salt'],
        prepTime: 'Daily Fresh',
        rating: 4.7,
        reviewCount: 42
    },
    {
        name: 'Masala Methi Khakhra (Pack of 5)',
        price: 90,
        discountPrice: 75,
        category: 'Special Combos',
        image: '/photo/products15.jpg',
        description: 'Ultra thin, roasted whole wheat crisps seasoned with pure ghee and fenugreek.',
        stock: 25,
        lowStockThreshold: 5,
        ingredients: ['Whole Wheat Flour', 'Cow Ghee', 'Kasoori Methi', 'Turmeric', 'Sea Salt'],
        prepTime: 'Vacuum Packed',
        rating: 4.8,
        reviewCount: 51
    },
    {
        name: 'Sweet Shakarpara',
        price: 60,
        discountPrice: 50,
        category: 'Special Combos',
        image: '/photo/products16.png',
        description: 'Crisp golden diamond shaped bites coated in crystallized sugar syrup.',
        stock: 30,
        lowStockThreshold: 5,
        ingredients: ['Wheat Flour', 'Sugar Syrup', 'Pure Ghee', 'Cardamom Powder'],
        prepTime: 'Daily Fresh',
        rating: 4.8,
        reviewCount: 38
    }
];

const coupons = [
    {
        code: 'SAVE10',
        description: '10% instant discount on orders above ₹199',
        discountType: 'percent',
        discountValue: 10,
        minOrderValue: 199,
        maxDiscount: 100,
        isActive: true
    },
    {
        code: 'CRUNCHY20',
        description: '20% mega discount on orders above ₹499',
        discountType: 'percent',
        discountValue: 20,
        minOrderValue: 499,
        maxDiscount: 200,
        isActive: true
    },
    {
        code: 'SNACK50',
        description: 'Flat ₹50 OFF on orders above ₹299',
        discountType: 'flat',
        discountValue: 50,
        minOrderValue: 299,
        maxDiscount: 50,
        isActive: true
    },
    {
        code: 'WELCOME15',
        description: '15% welcome discount for your first order',
        discountType: 'percent',
        discountValue: 15,
        minOrderValue: 150,
        maxDiscount: 150,
        isActive: true
    }
];

async function seedDatabase() {
    try {
        console.log('Seeding Crunchy Bite database...');

        // 1. Seed Categories
        await Category.deleteMany({});
        await Category.insertMany(categories);
        console.log('✔ Categories seeded');

        // 2. Seed Products
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('✔ Products seeded (34 authentic snacks)');

        // 3. Seed Coupons
        await Coupon.deleteMany({});
        await Coupon.insertMany(coupons);
        console.log('✔ Coupons seeded');

        // 4. Seed Admin & Demo Users
        await User.deleteMany({});
        
        const salt = await bcrypt.genSalt(10);
        const adminHashedPassword = await bcrypt.hash('admin123', salt);
        const userHashedPassword = await bcrypt.hash('user123', salt);

        const adminUser = new User({
            name: 'Aqsa Gandevia (Admin)',
            email: 'admin@crunchybite.com',
            password: adminHashedPassword,
            phone: '9876543210',
            role: 'admin',
            addresses: [{
                fullName: 'Aqsa Admin',
                phone: '9876543210',
                street: 'Main Market Road, Near City Mall',
                city: 'Surat',
                state: 'Gujarat',
                pincode: '395001',
                type: 'Work',
                isDefault: true
            }]
        });
        await adminUser.save();

        const demoUser = new User({
            name: 'Rahul Sharma',
            email: 'customer@crunchybite.com',
            password: userHashedPassword,
            phone: '9898989898',
            role: 'user',
            addresses: [
                {
                    fullName: 'Rahul Sharma',
                    phone: '9898989898',
                    street: 'Flat 402, Shivalik Heights, VIP Road',
                    city: 'Surat',
                    state: 'Gujarat',
                    pincode: '395007',
                    type: 'Home',
                    isDefault: true
                },
                {
                    fullName: 'Rahul Sharma',
                    phone: '9898989898',
                    street: 'Office #12, Infotech Tower, Ring Road',
                    city: 'Surat',
                    state: 'Gujarat',
                    pincode: '395002',
                    type: 'Work',
                    isDefault: false
                }
            ]
        });
        await demoUser.save();
        console.log('✔ Users seeded (Admin: admin@crunchybite.com / admin123, User: customer@crunchybite.com / user123)');

        // 5. Seed Sample Orders for Analytics & History
        await Order.deleteMany({});
        const seededProducts = await Product.find();

        const sampleOrders = [
            {
                orderId: 'CB-10021',
                user: demoUser._id,
                customerName: 'Rahul Sharma',
                customerEmail: 'customer@crunchybite.com',
                customerPhone: '9898989898',
                items: [
                    {
                        product: seededProducts[0]._id,
                        name: seededProducts[0].name,
                        price: seededProducts[0].discountPrice || seededProducts[0].price,
                        quantity: 2,
                        image: seededProducts[0].image,
                        category: seededProducts[0].category
                    },
                    {
                        product: seededProducts[10]._id,
                        name: seededProducts[10].name,
                        price: seededProducts[10].discountPrice || seededProducts[10].price,
                        quantity: 1,
                        image: seededProducts[10].image,
                        category: seededProducts[10].category
                    }
                ],
                subtotal: 95,
                discountAmount: 10,
                couponCode: 'SAVE10',
                deliveryFee: 0,
                tax: 4.25,
                totalAmount: 89.25,
                shippingAddress: demoUser.addresses[0],
                paymentMethod: 'online_demo',
                paymentStatus: 'paid',
                orderStatus: 'delivered',
                statusTimeline: [
                    { status: 'pending', timestamp: new Date(Date.now() - 3600000 * 24 * 2), note: 'Order placed by customer' },
                    { status: 'confirmed', timestamp: new Date(Date.now() - 3600000 * 24 * 2 + 600000), note: 'Order accepted by kitchen' },
                    { status: 'preparing', timestamp: new Date(Date.now() - 3600000 * 24 * 2 + 1200000), note: 'Snacks packed fresh' },
                    { status: 'ready', timestamp: new Date(Date.now() - 3600000 * 24 * 2 + 1800000), note: 'Handed over to delivery rider' },
                    { status: 'out_for_delivery', timestamp: new Date(Date.now() - 3600000 * 24 * 2 + 2400000), note: 'Rider is on the way' },
                    { status: 'delivered', timestamp: new Date(Date.now() - 3600000 * 24 * 2 + 3600000), note: 'Delivered successfully at door' }
                ],
                createdAt: new Date(Date.now() - 3600000 * 24 * 2)
            },
            {
                orderId: 'CB-10022',
                user: demoUser._id,
                customerName: 'Rahul Sharma',
                customerEmail: 'customer@crunchybite.com',
                customerPhone: '9898989898',
                items: [
                    {
                        product: seededProducts[2]._id,
                        name: seededProducts[2].name,
                        price: seededProducts[2].discountPrice || seededProducts[2].price,
                        quantity: 3,
                        image: seededProducts[2].image,
                        category: seededProducts[2].category
                    },
                    {
                        product: seededProducts[22]._id,
                        name: seededProducts[22].name,
                        price: seededProducts[22].discountPrice || seededProducts[22].price,
                        quantity: 1,
                        image: seededProducts[22].image,
                        category: seededProducts[22].category
                    }
                ],
                subtotal: 185,
                discountAmount: 0,
                deliveryFee: 0,
                tax: 9.25,
                totalAmount: 194.25,
                shippingAddress: demoUser.addresses[0],
                paymentMethod: 'cod',
                paymentStatus: 'pending',
                orderStatus: 'preparing',
                statusTimeline: [
                    { status: 'pending', timestamp: new Date(Date.now() - 3600000 * 2), note: 'Order placed' },
                    { status: 'confirmed', timestamp: new Date(Date.now() - 3600000 * 1.5), note: 'Order accepted' },
                    { status: 'preparing', timestamp: new Date(Date.now() - 3600000 * 0.8), note: 'Fresh packaging underway' }
                ],
                createdAt: new Date(Date.now() - 3600000 * 2)
            }
        ];
        await Order.insertMany(sampleOrders);
        console.log('✔ Sample Orders seeded');

        // 6. Seed Notifications
        await Notification.deleteMany({});
        const notifications = [
            {
                recipient: 'all',
                title: 'Welcome to Crunchy Bite!',
                message: 'Enjoy authentic fresh Indian snacks delivered to your door with special discount coupon SAVE10.',
                type: 'promo',
                createdAt: new Date()
            },
            {
                recipient: 'admin',
                title: 'Low Stock Alert',
                message: 'Flamin Hot Crunch is running low on inventory (8 units remaining).',
                type: 'stock',
                createdAt: new Date()
            }
        ];
        await Notification.insertMany(notifications);
        console.log('✔ Notifications seeded');

        console.log('Database initialization completed successfully!');
    } catch (err) {
        console.error('Error during seeding:', err);
    }
}

module.exports = { seedDatabase, categories, products, coupons };
