const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: 'Gujarat' },
    pincode: { type: String, required: true },
    type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String, default: '' },
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, default: Date.now }
});

// Compare password helper
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    // Support both hashed and legacy plain text fallback for backward compatibility
    if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
        return await bcrypt.compare(candidatePassword, this.password);
    }
    return candidatePassword === this.password;
};

// Pre-save hook for password hashing
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);
