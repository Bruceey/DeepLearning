import * as fs from "node:fs/promises";


// console.log('A');
const content = await fs.readFile('./cheerio解析.js', 'utf-8');
console.log(content);
// console.log('B');
// await fs.writeFile('./output.txt', content.toUpperCase());
// console.log('C');


// console.log('1');
//
// const data = await Promise.resolve().then(() => {
//   console.log('6');
// });
//
// console.log('2');
//
// setTimeout(() => {
//   console.log('3');
// }, 0);
//
// Promise.resolve().then(() => {
//   console.log('4');
// });
//
// console.log('5');

// console.log('开始');
//
// await new Promise(resolve => {setTimeout(() => {resolve(); console.log('第一个Promise完成')}, 1)}); // 第一个 await 暂停在这里
// console.log(1);
//
// await new Promise(resolve => {setTimeout(() => {resolve(); console.log('第二个Promise完成')}, 1)}); // 第二个 await 暂停在这里
// console.log(2);
//
// await new Promise(resolve => {setTimeout(() => {resolve(); console.log('第三个Promise完成')}, 1)}); // 第三个 await 暂停在这里
// console.log('全部完成');
