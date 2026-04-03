// utils/helpers.js

// Helper function to catch async errors
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// Format success response
const formatSuccess = (data) => {
    return { success: true, data };
};

// Format error response
const formatError = (message, statusCode = 500) => {
    return { success: false, message, statusCode };
};

// Generate random string
const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

// Generate token (placeholder for actual implementation)
const generateToken = (user) => {
    // Token generation logic
};

// Generate referral code
const generateReferralCode = () => {
    return generateRandomString(8);
};

// Simple hash function (placeholder)
const simpleHash = (value) => {
    // Hashing logic
};

// Format currency
const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
};

// Calculate pagination
const calculatePagination = (page, limit) => {
    const offset = (page - 1) * limit;
    return { offset, limit };
};

// Get pagination meta
const getPaginationMeta = (totalItems, page, limit) => {
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, totalPages, currentPage: page, previousPage: page > 1 ? page - 1 : null, nextPage: page < totalPages ? page + 1 : null };
};

// Sleep function
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry function
const retry = (fn, retries = 3) => {
    return fn().catch(err => {
        if (retries > 1) {
            return retry(fn, retries - 1);
        }
        throw err;
    });
};

// Deep clone an object
const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

// Deep merge two objects
const deepMerge = (target, source) => {
    for (const key in source) {
        if (source[key] instanceof Object) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    }
    Object.assign(target || {}, source);
    return target;
};

// Check if the value is an object
const isObject = (value) => {
    return value && typeof value === 'object' && !Array.isArray(value);
};

module.exports = { catchAsync, formatSuccess, formatError, generateRandomString, generateToken, generateReferralCode, simpleHash, formatCurrency, calculatePagination, getPaginationMeta, sleep, retry, deepClone, deepMerge, isObject };