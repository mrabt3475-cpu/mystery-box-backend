const { performance } = require('perf_hooks');

const requestLogger = (req, res, next) => {
    const start = performance.now();
    const { method, path } = req;
    let responseSize = 0;

    res.on('finish', () => {
        const duration = performance.now() - start;
        const { statusCode } = res;
        const requestSize = JSON.stringify(req.body).length;

        responseSize = res.get('Content-Length') || 0;

        console.log(`[${new Date().toISOString()}] ${method} ${path} ${statusCode} ${duration.toFixed(2)}ms - Request Size: ${requestSize} bytes - Response Size: ${responseSize} bytes`);
    });

    next();
};

module.exports = requestLogger;
