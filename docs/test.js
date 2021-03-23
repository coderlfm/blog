const fs = require('fs');
const path = require('path');

const dir = fs.readdirSync(path.resolve(__dirname,'./webpack'))

console.log('dir', dir.filter(item=>item.includes('.md')));