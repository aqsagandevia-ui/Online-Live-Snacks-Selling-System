// server/models/products.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    category: { type: String, required: true, trim: true },
    image: { type: String, default: '/photo/products1.webp' },
    description: { type: String, default: 'Crispy, freshly prepared authentic snack.' },
    stock: { type: Number, default: 20, min: 0 },
    lowStockThreshold: { type: Number, default: 5, min: 0 },
    availability: { 
        type: String, 
        enum: ['in_stock', 'out_of_stock', 'low_stock'], 
        default: 'in_stock' 
    },
    ingredients: [{ type: String }],
    prepTime: { type: String, default: '15-20 mins' },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 12 },
    isFeatured: { type: Boolean, default: false },
    isSpecial: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Virtual for effective stock status
productSchema.pre('save', function(next) {
    if (this.stock <= 0) {
        this.availability = 'out_of_stock';
    } else if (this.stock <= this.lowStockThreshold) {
        this.availability = 'low_stock';
    } else {
        this.availability = 'in_stock';
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
