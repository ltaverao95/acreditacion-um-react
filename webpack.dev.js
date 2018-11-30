const LiveReloadPlugin = require('webpack-livereload-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    plugins: [

        new LiveReloadPlugin({ appendScriptTag: true })
    ],

    devServer: {
        port: 3000,
        historyApiFallback: {
            index: 'index.html'
        }
    }
});