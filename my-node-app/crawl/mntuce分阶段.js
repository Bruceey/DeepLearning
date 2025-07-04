import {setGlobalDispatcher, ProxyAgent} from 'undici';

const customProxyAgent = new ProxyAgent('http://127.0.0.1:20122');

// 将其设置为全局的 dispatcher，这样所有的 fetch 请求都会使用它。
setGlobalDispatcher(customProxyAgent);

// let start_url = 'https://www.mntuce01.com/19357/.html'

// let response = await fetch(start_url);
// let html = await response.text();
// const regex = /class="wp-block-image size-large".*?<img.*?src="(.*?)" /gs;
//
// const matches = [];
// let match;
// while ((match = regex.exec(html)) !== null) {
//   matches.push(match[1]); // 第一个捕获组是 src 链接
// }
//
// console.log(matches);

fetch(start_url).then( response => {
  // console.log(response)
  let html = response.text();
  console.log(html)
  const regex = /class="wp-block-image size-large".*?<img.*?src="(.*?)" /gs;
  const matches = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.push(match[1]); // 第1个捕获组是 src 链接
  }
  console.log(matches);
})



import { writeFile, mkdir } from 'fs/promises';
import { basename } from 'path';
import { existsSync } from 'fs';
import pLimit from 'p-limit';

let start_url = 'https://www.mntuce01.com/19357/.html'
const concurrency = 8; // 最大并发数
const limit = pLimit(concurrency);

async function fetchImageUrls(url) {
  const res = await fetch(url);
  const html = await res.text();

  const regex = /class="wp-block-image size-large".*?<img.*?src="(.*?)" /gs;
  const imageUrls = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    let src = match[1];
    if (src.startsWith('//')) {
      src = 'https:' + src;
    } else if (src.startsWith('/')) {
      const { origin } = new URL(url);
      src = origin + src;
    } else if (!/^https?:/.test(src)) {
      const { origin } = new URL(url);
      src = origin + '/' + src;
    }
    imageUrls.push(src);
  }

  return imageUrls;
}

async function downloadImage(imageUrl) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = basename(new URL(imageUrl).pathname);
    await writeFile(`images/${filename}`, buffer);
    console.log(`✅ 保存成功: ${filename}`);
  } catch (err) {
    console.error(`❌ 下载失败: ${imageUrl} - ${err.message}`);
  }
}

async function main() {
  const imageUrls = await fetchImageUrls(pageUrl);
  console.log(`共提取到 ${imageUrls.length} 张图片`);

  if (!existsSync('images')) {
    await mkdir('images');
  }

  const tasks = imageUrls.map(url =>
    limit(() => downloadImage(url))
  );

  await Promise.all(tasks);
  console.log('✅ 所有图片下载完成');
}

main();

