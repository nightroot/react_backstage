const { createProxyMiddleware } = require('http-proxy-middleware');
//跨域代理
module.exports = function(app) {
    app.use(createProxyMiddleware('/api', {
        target: 'http://47.107.37.6:5915',
        changeOrigin: true,
    }))
};