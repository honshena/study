const path = require('path')
const fs = require('fs')
const reactMap = fs.readFileSync(path.resolve(__dirname, '../build/node_modules/react/umd/react.development.js.map'))

fs.writeFileSync(path.resolve(__dirname, '../build/node_modules/react/umd/react.development.js.map'), reactMap.toString().replaceAll('../../../../', './src/react/'))
const reactDomMap = fs.readFileSync(path.resolve(__dirname, '../build/node_modules/react-dom/umd/react-dom.development.js.map'))
fs.writeFileSync(path.resolve(__dirname, '../build/node_modules/react-dom/umd/react-dom.development.js.map'), reactDomMap.toString().replaceAll('../../../../', './src/react/'))

fs.copyFileSync(path.resolve(__dirname, '../build/node_modules/react/umd/react.development.js'),
    path.resolve(__dirname, '../../../public/react.development.js'))
fs.copyFileSync(path.resolve(__dirname, '../build/node_modules/react/umd/react.development.js.map'),
    path.resolve(__dirname, '../../../public/react.development.js.map'))
fs.copyFileSync(path.resolve(__dirname, '../build/node_modules/react-dom/umd/react-dom.development.js'),
    path.resolve(__dirname, '../../../public/react-dom.development.js'))
fs.copyFileSync(path.resolve(__dirname, '../build/node_modules/react-dom/umd/react-dom.development.js.map'),
    path.resolve(__dirname, '../../../public/react-dom.development.js.map'))