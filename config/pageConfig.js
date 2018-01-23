const resolve = require('path').resolve;

let pageTitle = '松鼠聚付管理平台';

let pagesConfig = [
    {
        name: 'index',
        title: pageTitle,
        entrySrc: resolve(__dirname, '../src/entry/index.js')
    }
];
module.exports = pagesConfig;