const path = require('path');

const staticPath = path.resolve(__dirname, '../public');
const torefreshPath = path.resolve(__dirname, './torefresh.txt');
const uploadPath = path.resolve(__dirname, './upload.conf');

// 设置七牛云用户名
const getAccountCommand = () =>
  `qshell account ${process.env.ACCESS_KEY} ${process.env.SECRET_KEY} ${process.env.NAME}`;
// `qshell account edPrPdene2R9Z_RMrmDLhnRw1MMi8jjifdkuhnFl dHVqJYTBD_t3RxNeZStsIbiePRItCxBbOh1FmU_I 宿愿Cc`;

const fromPath = './template';
const toPath = '../node_modules/hexo-theme-fluid';

const publishCommandOrigin = `hexo clean && hexo g && qshell qupload ${uploadPath} && qshell cdnrefresh -i ${torefreshPath}`;
const publishCommand = publishCommandOrigin.split(' && '); // 需要分割成多个不同命令

module.exports = {
  getAccountCommand,
  publishCommand,
  fromPath,
  toPath,
};
