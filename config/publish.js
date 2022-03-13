const { publishCommand } = require('./constants.js');
const { exec } = require('./utils.js');

async function publish() {
  await exec(publishCommand);
  console.log('项目更新成功');
}
publish();
