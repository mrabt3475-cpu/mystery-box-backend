const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    colors: {
        primary: { type: String, required: true },
        secondary: { type: String, required: true },
        background: { type: String, required: true },
        text: { type: String, required: true }
    },
    animations: {
        enable: { type: Boolean, default: true },
        duration: { type: Number, default: 300 }, // in milliseconds
        easing: { type: String, default: 'ease-in-out' }
    },
    effects: {
        shadow: { type: Boolean, default: false },
        hover: { type: Boolean, default: false }
    },
    properties: {
        fontFamily: { type: String, default: 'Arial, sans-serif' },
        borderRadius: { type: Number, default: 4 }
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Theme', themeSchema);
