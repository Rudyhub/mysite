const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const glob = require('glob');
const fs = require('fs');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let pagePath, distPath, srcPath, servPath, stats, entry, output;
pagePath = path.join(__dirname, 'page');
distPath = path.join(__dirname, 'dist');
srcPath = path.join(__dirname, 'src');
servPath = path.join(__dirname, '_serv');
if(!fs.existsSync(servPath)){
    fs.mkdirSync(servPath);
}
entry = (() => {
    let o, files, tempFile, name;
    o = {};
    files = glob.sync(pagePath + '/*.html');

    if(Array.isArray(files)){
        files.forEach(src => {
            name = path.basename(src).slice(0, -5);
            tempFile = servPath + path.sep + name + '.js';
            o[name] = tempFile;
        });
    }
    return o;
})();


output = {
    path: path.join(distPath,'js'),
    filename: '[name].js'
};

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

function Myplugin(){}
Myplugin.prototype.apply = function(compiler){
    let isServer = /webpack-dev-server\.js/i.test(process.argv[1]);
    compiler.hooks.entryOption.tap('Myplugin', (context, opt) => {
        for(let name in opt){
            fs.writeFileSync(path.join(servPath, name+'.js'), `
                import App from '../src/${name}.vue';
                import Vue from 'vue';
                new Vue({
                    el: '#app',
                    component:{ App },
                    render: h => h(App)
                })
            `);
        }
    });
    compiler.hooks.done.tap('Myplugin', () => {
        for(let k in entry) {
            let html = path.join(pagePath, k+'.html'),
                js = isServer ? './' : './js/',
                code;
            try{
                code = fs.readFileSync(html, 'utf8');
                fs.writeFileSync(distPath + '/' + k + '.html', code.replace(/<\/body>/, '<script src="'+js+k+'.js"></script>\n</body>'));
            }catch (e) {}
        }
    })
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
        new Myplugin(),
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
