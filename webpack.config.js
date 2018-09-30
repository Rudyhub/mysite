const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const prebuild = require('./pre.build');

let distPath, stats;
distPath = path.join(__dirname, 'dist');

let {entry, output} = prebuild(distPath);

stats = {
    all: false,
    errors: true,
    errorDetails: true,
    modules: true,
    excludeModules(ms) {
        return !/\/src\/[\s\S]*?\.(vue|js|json)$/i.test(ms);
    }
};

module.exports = {
    entry,
    output,
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
                loader: 'babel-loader',
                exclude: /node_modules/
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
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'static'),
            to: path.join(__dirname, 'dist')
        }])
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
