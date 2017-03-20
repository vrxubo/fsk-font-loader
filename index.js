const readDir = require('./lib/readDir');
const fs = require('fs');
const path = require('path');
const svg2ttf = require('svg2ttf');
const ttf2eot = require('ttf2eot');
const ttf2woff = require('ttf2woff');
const svgicons2svgfont = require('svgicons2svgfont');
const generateCss = require('./lib/generatecss');
const writeFile = require('./lib/writeFile');
const TTFStream = require('./lib/svg2ttfstream');
const loaderUtils = require('loader-utils')
module.exports = function (content) {
  const callback = this.async();
  const {deep, dir, out, font = 'custom-font'} = loaderUtils.parseQuery(this.query);
  if (!dir || !out) {
    return callback(new Error('请指定svg所在目录和字体文件输出目录.'));
  }
  if (/###font###/.test(content)) {
    readDir(dir, deep) ((err, list) => {
      if (err) {
        callback(err);
        return;
      }
      if (!list.length) {
        callback(null, content);
        return;
      }
      const fontFilePath = path.join(out, font+'.svg');
      const ttfFilePath = path.join(out, font+'.ttf');
      const woffFilePath = path.join(out, font+'.woff');
      const eotFilePath = path.join(out, font+'.eot');
      writeFile.mkdirs(out, () => {
        let svgStream = svgicons2svgfont(list, {
          fontName: font,
          normalize: true
        });
        svgStream.pipe(fs.createWriteStream(fontFilePath));
        let ttfStream = svgStream.pipe(new TTFStream({fp: ttfFilePath}));
        ttfStream.on('end', (data) => {
          console.log('ttf created.');
          const ttfcontent = new Uint8Array(data);
          const woffcontent = new Buffer(ttf2woff(ttfcontent).buffer);
          const eotcontent = new Buffer(ttf2eot(ttfcontent).buffer);
          writeFile(woffFilePath , woffcontent, 'utf-8', function() {
            if (!err) {
              console.log('woff created.');
            } else {
              console.log('create woff failed.');
              console.error(err)
            }
          });
          writeFile(eotFilePath , eotcontent, 'utf-8', function() {
            if (!err) {
              console.log('eot created.');
            } else {
              console.log('create eot failed.');
              console.error(err)
            }
          });
          const result = content.replace(/###font###/, generateCss(list));
          callback(null, result);
        });
      });
    });
  } else {
    callback(null, content);
  }

};
