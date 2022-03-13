const path = require('path');

const staticPath = path.resolve(__dirname, '../public');
const torefreshPath = path.resolve(__dirname, './torefresh.txt');

// 设置七牛云用户名
const getAccountCommand = () =>
  `qshell account ${process.env.ACCESS_KEY} ${process.env.SECRET_KEY} ${process.env.NAME}`;
// `qshell account edPrPdene2R9Z_RMrmDLhnRw1MMi8jjifdkuhnFl dHVqJYTBD_t3RxNeZStsIbiePRItCxBbOh1FmU_I 宿愿Cc`;

const fromPath = './template';
const toPath = '../node_modules/hexo-theme-fluid';

const publishCommand = `hexo clean && hexo g && qshell qupload2 --src-dir=${staticPath} --bucket=lfm-blog --overwrite && qshell cdnrefresh -i ${torefreshPath}`;

module.exports = {
  getAccountCommand,
  publishCommand,
  fromPath,
  toPath,
};
