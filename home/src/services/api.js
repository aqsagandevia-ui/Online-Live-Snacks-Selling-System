import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

// Interceptor to attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('crunchy_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Fallback in-memory data in case backend server is temporarily unreachable
export const fallbackProducts = [
    {
        _id: 'p1',
        name: 'Chilli Sprinkled Chips',
        price: 30,
        discountPrice: 25,
        category: 'Chips',
        image: '/photo/chips1.webp',
        description: 'Crispy golden potato chips dusted with fiery red chilli and tangy spices.',
        stock: 35,
        lowStockThreshold: 5,
        rating: 4.8,
        reviewCount: 34,
        isFeatured: true,
        isSpecial: true,
        ingredients: ['Potatoes', 'Edible Oil', 'Red Chilli Powder', 'Black Salt', 'Spices'],
        prepTime: 'Freshly Packed'
    },
    {
        _id: 'p2',
        name: 'Combo Potato Chips',
        price: 60,
        discountPrice: 50,
        category: 'Chips',
        image: '/photo/chips2.webp',
        description: 'Delightful combo pack featuring salted, spicy and cream onion flavours.',
        stock: 22,
        lowStockThreshold: 5,
        rating: 4.7,
        reviewCount: 28,
        isFeatured: true,
        ingredients: ['Farm Fresh Potatoes', 'Vegetable Oil', 'Rock Salt', 'Onion Powder', 'Herbs'],
        prepTime: 'Freshly Packed'
    },
    {
        _id: 'p3',
        name: 'Crispy Banana Wafers',
        price: 50,
        discountPrice: 45,
        category: 'Chips',
        image: '/photo/chips3.jpg',
        description: 'Thin yellow raw banana slices crisp-fried in pure groundnut oil with sea salt.',
        stock: 40,
        lowStockThreshold: 8,
        rating: 4.9,
        reviewCount: 42,
        isFeatured: true,
        ingredients: ['Raw Kerala Bananas', 'Groundnut Oil', 'Sendha Namak', 'Black Pepper'],
        prepTime: 'Freshly Packed'
    },
    {
        _id: 'p4',
        name: 'Royal Namkeen Mixture',
        price: 50,
        discountPrice: 45,
        category: 'Namkeen',
        image: '/photo/namkken1.webp',
        description: 'Special blend of fried lentils, sev, peanuts, cornflakes, and aromatic spices.',
        stock: 45,
        lowStockThreshold: 10,
        rating: 4.9,
        reviewCount: 52,
        isFeatured: true,
        isSpecial: true,
        ingredients: ['Gram Flour', 'Peanuts', 'Cornflakes', 'Moong Dal', 'Spices Blend'],
        prepTime: 'Daily Fresh'
    },
    {
        _id: 'p5',
        name: 'Marwari Bhujiya Sev',
        price: 60,
        discountPrice: 50,
        category: 'Namkeen',
        image: '/photo/namkeen3.webp',
        description: 'Authentic Bikaneri style spicy moth bean & besan sev noodles.',
        stock: 38,
        lowStockThreshold: 8,
        rating: 4.9,
        reviewCount: 78,
        isFeatured: true,
        ingredients: ['Moth Dal Flour', 'Besan', 'Cardamom', 'Cloves', 'Black Pepper'],
        prepTime: 'Daily Fresh'
    },
    {
        _id: 'p6',
        name: 'Thai Chilli Corn Rings',
        price: 60,
        discountPrice: 50,
        category: 'Corn Snacks',
        image: '/photo/corn1.png',
        description: 'Crispy puffed corn rings seasoned with sweet & spicy authentic Thai spices.',
        stock: 25,
        lowStockThreshold: 5,
        rating: 4.7,
        reviewCount: 25,
        isFeatured: true,
        ingredients: ['Corn Grits', 'Thai Spice Blend', 'Sugar', 'Paprika', 'Vegetable Oil'],
        prepTime: 'Extruded Fresh'
    },
    {
        _id: 'p7',
        name: 'Cheezy Corn Puffs',
        price: 70,
        discountPrice: 60,
        category: 'Corn Snacks',
        image: '/photo/corn2.png',
        description: 'Melt-in-mouth puffed corn balls coated with cheddar cheese powder.',
        stock: 30,
        lowStockThreshold: 6,
        rating: 4.9,
        reviewCount: 56,
        isSpecial: true,
        ingredients: ['Corn Flour', 'Cheddar Cheese Powder', 'Whey', 'Butter Flavors', 'Salt'],
        prepTime: 'Extruded Fresh'
    },
    {
        _id: 'p8',
        name: 'Wheat Flour Spiced Chakli',
        price: 40,
        discountPrice: 35,
        category: 'Chakli',
        image: '/photo/chakli1.jpg',
        description: 'Traditional wholesome whole wheat spirals infused with sesame seeds and carom.',
        stock: 30,
        lowStockThreshold: 6,
        rating: 4.8,
        reviewCount: 39,
        isFeatured: true,
        ingredients: ['Whole Wheat Flour', 'White Sesame Seeds', 'Ajwain', 'Turmeric', 'Red Chilli'],
        prepTime: 'Handcrafted'
    },
    {
        _id: 'p9',
        name: 'Crispy Rice Flour Murukku',
        price: 50,
        discountPrice: 40,
        category: 'Chakli',
        image: '/photo/chakli2.webp',
        description: 'South Indian style white rice murukku with supreme crunch and cumin aroma.',
        stock: 35,
        lowStockThreshold: 7,
        rating: 4.9,
        reviewCount: 45,
        isSpecial: true,
        ingredients: ['Rice Flour', 'Urad Dal Flour', 'Cumin Seeds', 'Asafoetida', 'Butter'],
        prepTime: 'Handcrafted'
    },
    {
        _id: 'p10',
        name: 'Bhavnagri Gathiya',
        price: 50,
        discountPrice: 40,
        category: 'Special Combos',
        image: '/photo/products8.webp',
        description: 'Soft and spongy iconic Gujarati tea snack seasoned with crushed black pepper & ajwain.',
        stock: 40,
        lowStockThreshold: 8,
        rating: 4.9,
        reviewCount: 75,
        isFeatured: true,
        isSpecial: true,
        ingredients: ['Besan', 'Black Pepper', 'Ajwain', 'Papad Khar', 'Groundnut Oil'],
        prepTime: 'Freshly Prepared'
    }
];

export const fallbackCategories = [
    { name: 'All', slug: 'all', image: '/photo/products1.webp', itemCount: 34 },
    { name: 'Chips', slug: 'chips', image: '/photo/chips1.webp', itemCount: 10 },
    { name: 'Namkeen', slug: 'namkeen', image: '/photo/namkken1.webp', itemCount: 9 },
    { name: 'Corn Snacks', slug: 'corn-snacks', image: '/photo/corn1.png', itemCount: 8 },
    { name: 'Chakli', slug: 'chakli', image: '/photo/chakli1.jpg', itemCount: 7 }
];

export default api;
