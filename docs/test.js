const fs = require('fs');
const path = require('path')

const dir = fs.readdirSync(path.resolve(__dirname,'./flutter'))
console.log(dir.filter(item=>item.includes('.md')));