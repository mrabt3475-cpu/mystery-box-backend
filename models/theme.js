const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: '',
    },
    styles: {
        type: Object,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update the updatedAt field
themeSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Theme = mongoose.model('Theme', themeSchema);

module.exports = Theme;
