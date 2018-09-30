const path = require('path');
const fs = require('fs');
const config = require('./config');
const fns = {
  globalAttr: ['title', 'meta', 'link', 'script', 'style'],
  getHead(pageObj) {
    let code = ['<head>   '];
    this.globalAttr.forEach(key => {
      let html = '';
      if (config.global[key]) {
        html += config.global[key];
      }
      if (pageObj[key]) {
        html += pageObj[key];
      }
      html = html.trim().replace(/\s{2,}/g, '\n    ');
      if (key === 'title') {
        html = '<title>' + html + '</title>';
      }
      if (html) code.push(html);
    });
    return code.join('\n    ') + '\n</head>';
  },
  getBody(js) {
    return '<body>    ' + '\n    ' + config.global.body + '\n    <script src="' + js + '"></script>' + '\n</body>';
  },
  createHTML(filename, pageObj, dist) {
    let htmlDir = path.dirname(filename);
    let jsDir = path.join(dist, 'js', htmlDir.replace(dist, ''));
    let jsPath = path.relative(htmlDir, jsDir).replace(/[\\\/]/g, '/') + '/' + pageObj.name + '.js';
    fs.writeFileSync(filename,
      '<!DOCTYPE html>\n<html lang="' + (config.lang || 'zh-cn') + '">' +
      '\n' + this.getHead(pageObj) +
      '\n' + this.getBody(jsPath) +
      '\n' + '</html>');
  },
  createJs(filename, component) {
    fs.writeFileSync(filename,
      'import App from "' + component + '";\n' +
      'import Vue from "vue";\n' +
      'new Vue({\n' +
      '    el: "#app",\n' +
      '    component:{ App },\n' +
      '    render: h => h(App)\n' +
      '});'
    );
  },
  createEntry(dist) {
    let _this, entry, component, tempDir;
    _this = this;
    entry = {};
    component = {};
    tempDir = path.join(__dirname, '_serv');

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    if (!fs.existsSync(dist)) {
      fs.mkdirSync(dist);
    }

    function re(pages, dir) {
      pages.forEach(pageObj => {
        let keyDir = path.join(dir, pageObj.name).replace(dist + path.sep, '');
        entry[keyDir] = path.join(tempDir, keyDir + '.js');
        _this.createHTML(path.join(dir, pageObj.name) + '.html', pageObj, dist);
        component[keyDir] = pageObj.component || pageObj.name + '.vue';
        if (pageObj.children && pageObj.children.length) {
          let subdir = path.join(dir, pageObj.name);
          if (!fs.existsSync(subdir)) fs.mkdirSync(subdir);
          re(pageObj.children, subdir);
        }
      });
    }

    re(config.pages, dist);

    for (let name in entry) {
      let jsDir = path.dirname(entry[name]);
      let componentDir = path.relative(jsDir, path.join(__dirname, 'src')).split(/[\\\/]+/).join('/');
      if (!fs.existsSync(jsDir)) {
        fs.mkdirSync(jsDir);
      }
      _this.createJs(entry[name], componentDir + '/' + component[name]);
    }
    return entry;
  }
};

module.exports = (dist) => {
  return {
    entry: fns.createEntry(dist),
    output: {
      path: dist,
      filename: 'js/[name].js'
    }
  }
};