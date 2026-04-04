const Theme = require('../models/Theme');

// Get all themes
exports.getThemes = async (req, res) => {
    const themes = await Theme.find();
    res.json(themes);
};

// Get theme by ID
exports.getThemeById = async (req, res) => {
    const theme = await Theme.findById(req.params.id);
    res.json(theme);
};

// Create a new theme
exports.createTheme = async (req, res) => {
    const newTheme = new Theme(req.body);
    await newTheme.save();
    res.status(201).json(newTheme);
};

// Update theme by ID
exports.updateTheme = async (req, res) => {
    const updatedTheme = await Theme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTheme);
};

// Delete theme by ID
exports.deleteTheme = async (req, res) => {
    await Theme.findByIdAndDelete(req.params.id);
    res.status(204).send();
};