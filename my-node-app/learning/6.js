// headers = {
//
// }
//
// const response = await fetch("https://example.org/post", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({ username: "example" }),
//   // …
// });


let start_url = "https://www.mntuce01.com/19357/.html"

// const response = await fetch(start_url, {
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   // body: JSON.stringify({ username: "example" }),
//   // …
// });




// import {fetch, setGlobalDispatcher, ProxyAgent} from 'undici';
//
// const customProxyAgent = new ProxyAgent('http://127.0.0.1:20122');
//
// // 将其设置为全局的 dispatcher，这样所有的 fetch 请求都会使用它。
// setGlobalDispatcher(customProxyAgent);
//
// let response = await fetch(start_url)
// let text = await response.text()
// console.log(text)

const fs = require('fs');

const html = fs.readFileSync('1.html', 'utf8');
const regex = /class="wp-block-image size-large".*?<img.*?src="(.*?)" /gs;

const matches = [];
let match;
while ((match = regex.exec(html)) !== null) {
  matches.push(match[1]); // 第一个捕获组是 src 链接
}

console.log(matches);

