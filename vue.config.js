let path = require('path');

const config = {
    configureWebpack: {
        resolve: {
            alias: {
                "~": path.join(__dirname, "/src"),
            }
        }
    },
    devServer: {
        disableHostCheck: true,
    }
};

module.exports = config;
