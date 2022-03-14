const { spawn } = require('child_process');

/**
 * 执行命令 promise 形式
 * @param {String} cmd
 * @param {String[]} args
 * @param {{}} options
 */
async function execPromise(cmd, args, options) {
  const win32 = process.platform === 'win32';
  if (win32) {
    args.unshift('/c', cmd); // 表示静默执行
    cmd = 'cmd';
  }

  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, options);

    child.on('error', reject);

    child.on('exit', (e) => {
      // console.log('执行成功', e);
      resolve(e);
      // log.verbose('子进程执行命令命令执行成功', e);
      // process.exit(e);
    });
  });
}

// 快捷执行
async function exec(cmmmand, options = { cwd: process.cwd(), stdio: 'inherit' }) {
  const [cmd, ...args] = cmmmand.split(' ');
  return await execPromise(cmd, args, options);
}

module.exports = { execPromise, exec };
