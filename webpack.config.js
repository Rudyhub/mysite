const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const glob = require('glob');
const fs = require('fs');

let pagePath, distPath, srcPath, stats, entry;
pagePath = path.join(__dirname, 'page');
distPath = path.join(__dirname, 'dist');
srcPath = path.join(__dirname, 'src');
entry = (() => {
    let o, files, tempFile, name;
    o = {};
    files = glob.sync(srcPath + '/*.vue');

    if(Array.isArray(files)){
        files.forEach(src => {
            name = path.basename(src).slice(0, -4);
            tempFile = distPath + path.sep + name + '.js';
            fs.writeFileSync(tempFile, `
                import App from '../src/${name}.vue';
                import Vue from 'vue';
                new Vue({
                    el: '#app',
                    component:{ App },
                    render: h => h(App)
                })
            `);
            o[name] = tempFile;
        });
    }
    return o;
})();

stats = {
    all: false,
    assets: true,
    errors: true,
    errorDetails: true,
    modules: true,
    excludeModules(ms) {
        return !/\/src\/[\s\S]*?\.(vue|js|json)$/i.test(ms);
    }
};
module.exports = {
    entry,
    output: {
        path: distPath,
        filename: 'build.[name].js'
    },
    resolve: {
        extensions: [ '.js', '.vue', '.json' ],
        alias: { 'vue$': 'vue/dist/vue.esm.js'}
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                test: /\.js$/,
                loader: 'babel-loader'
            }, {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: distPath + '/index.html',
            template: pagePath + '/index.html',
            inject: true
        })
    ],
    stats,
    devServer: {
        contentBase: distPath,
        compress: true,
        port: 8080,
        clientLogLevel: 'warning',
        hot: true,
        stats
    }
};
