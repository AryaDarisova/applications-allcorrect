const proxy = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        proxy("/appreviews", {
            target: "https://store.steampowered.com",
            secure: false,
            changeOrigin: true
        })
    );

    app.use(
        proxy("/api/appdetails", {
            target: "https://store.steampowered.com",
            secure: false,
            changeOrigin: true
        })
    );

    app.use(
        '/proxy',
        proxy({
            target: 'http://localhost:3080',
            changeOrigin: true
        })
    );

    /*app.use(
        '/mobile_store_proxy',
        proxy({
            target: 'http://localhost:3080',
            changeOrigin: true
        })
    );

    app.use(
        '/project_bible_template',
        proxy({
            target: 'http://localhost:3080',
            changeOrigin: true
        })
    );*/
};