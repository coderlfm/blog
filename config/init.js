const pathExists = require('path-exists').sync;
const { copyFile } = require('fs/promises');
const path = require('path');
const dotenv = require('dotenv');
const { exec } = require('./utils.js');
const { getAccountCommand, toPath, fromPath } = require('./constants.js');

// dev 模式跳过环境变量检测，install，设置七牛云账号，只copy自定义样式
const initType = process.argv[2].split('=')[1];

/**
 * 初始化配置
 * 1. 配置七牛云账户
 * 2. 安装依赖
 * 3. 修改部分模块源码
 */
async function init() {
  if (initType !== 'dev') {
    if (!(await preParse())) {
      return console.log(
        'env 配置文件未填写，请在 https://portal.qiniu.com/user/key 将 Access/Secret Key 复制到项目 .env 文件下后再进行重试'
      );
    }

    await exec('pnpm install'); // 1. 安装依赖

    await exec(getAccountCommand()); // 2. 设置 七牛云账号

    await exec('qshell account'); // 查看 七牛云账号
  }

  // 3. 设置自定义样式
  try {
    const res = await Promise.all([
      copy(`${fromPath}/index.ejs`, `${toPath}/layout/index.ejs`),
      copy(`${fromPath}/custom.css`, `${toPath}/source/css/custom.css`),
    ]);
    console.log('自定义配置覆盖成功');
  } catch (error) {
    console.log('error: ', error);
  }
}

async function preParse() {
  const dotenvPath = path.resolve(__dirname, '../.env');

  if (pathExists(dotenvPath)) {
    dotenv.config({ path: dotenvPath });
  } else {
    await copy(`${fromPath}/.env`, `../.env`);
  }

  function checkEnv() {
    return process.env.ACCESS_KEY && process.env.SECRET_KEY;
  }

  return checkEnv();
}

function copy(from, to) {
  return copyFile(path.resolve(__dirname, from), path.resolve(__dirname, to));
}

init();
