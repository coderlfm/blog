const { publishCommand } = require('./constants.js');
const { exec } = require('./utils.js');

async function publish() {
  for (const item of publishCommand) {
    await exec(item, { cwd: '/www/wwwroot/pofile/blog', stdio: 'inherit' });
    console.log('成功: ', item);
  }

  console.log('项目更新成功~');
}
publish();
