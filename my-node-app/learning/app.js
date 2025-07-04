// 1. 基础 Hello World
console.log('Hello, Node.js!');

// 2. 文件系统操作
const fs = require('fs');

// 写入文件
fs.writeFileSync('hello.txt', 'Hello from Node.js!');
console.log('文件已创建');

// 读取文件
const content = fs.readFileSync('hello.txt', 'utf8');
console.log('文件内容:', content);

// 3. 创建简单的 HTTP 服务器
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  if (req.url === '/') {
    res.end('<h1>欢迎来到 Node.js 服务器!</h1>');
  } else if (req.url === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: '这是一个 API 接口', time: new Date() }));
  } else {
    res.writeHead(404);
    res.end('<h1>页面未找到</h1>');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 4. 模块导入导出示例
// 创建一个 utils.js 文件来演示模块
const utils = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
  getCurrentTime: () => new Date().toLocaleString('zh-CN')
};

// 如果这是 utils.js 文件，使用这行导出
// module.exports = utils;

// 在主文件中导入（如果有 utils.js）
// const utils = require('./utils');
// console.log('2 + 3 =', utils.add(2, 3));

// 5. 异步操作示例
const processData = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`处理完成: ${data}`);
    }, 1000);
  });
};

// 使用 async/await
async function runAsyncExample() {
  console.log('开始异步处理...');
  const result = await processData('用户数据');
  console.log(result);
}

runAsyncExample();

// 6. 环境变量使用
console.log('Node.js 版本:', process.version);
console.log('当前工作目录:', process.cwd());

// 7. NPM 包使用示例（需要先安装）
// npm install lodash
// const _ = require('lodash');
// console.log('数组去重:', _.uniq([1, 2, 2, 3, 3, 4]));