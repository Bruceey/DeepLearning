import {mkdir, writeFile} from "fs/promises";
import {fetch, setGlobalDispatcher, ProxyAgent} from 'undici';

await mkdir('images', {recursive: true});

const getImageSrcs = html => [...html.matchAll(/class="wp-block-image size-large".*?src="([^"]+)"/gs)]
  .map(match => match[1]);


function setProxy() {
  const customProxyAgent = new ProxyAgent('http://127.0.0.1:20122');
  // 将其设置为全局的 dispatcher，这样所有的 fetch 请求都会使用它。
  setGlobalDispatcher(customProxyAgent);
}

async function start(url) {
  const response = await fetch(url);
  const html = await response.text();

  // 获取图片链接
  const srcList = getImageSrcs(html)

  // 获取更多页
  const reg = /<button.*?id="load-more-btn".*?data-post-id="(\d*?)" data-next-page="(\d*?)"/gs
  const match = [...html.matchAll(reg)][0].slice(1)

  // var ajaxurl = "https:\/\/www.mntuce01.com\/wp-admin\/admin-ajax.php";
  const ajaxurl = html.match(/ajaxurl.*?=.*?"(.*?)"/)[1].replaceAll('\\', '');
  const form = new URLSearchParams({
    action: 'load_more_post_page',
    post_id: match[0],
    page_num: match[1],
  });
  return {srcList, ajaxurl, form}
}


//根据图片链接下载图片
async function downloadImage(url, headers) {
  headers.host = (new URL(url)).host;

  const response = await fetch(url, headers);
  if (!response.ok) {
    console.log(`❌ 下载失败: ${url}`);
    console.log(`❌ 响应状态码: ${response.status}`)
    console.log(`❌ 响应状态信息: ${await response.statusText}`)
    console.log(`❌ 响应头: ${JSON.stringify(headers)}`)
    return;
  }
  const buffer = await response.arrayBuffer();
  await writeFile(`images/${url.split('/').pop()}`, Buffer.from(buffer));
  console.log(`✅ 保存成功: ${url}`);
}


async function getMorePages(ajaxurl, form) {
  const response = await fetch(ajaxurl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: form.toString()
  });
  if (!response.ok) {
    console.log(`❌ 请求失败: ${ajaxurl}`);
    return;
  }
  const json = await response.json();
  const html = json.data.content;
  // 获取图片链接
  const srcList = getImageSrcs(html);
  // let referer = (new URL(srcList[0])).origin.replace('img', 'www');
  let referer = 'https://www.mntuce01.com/'
  for (let src of srcList) {
    await downloadImage(src, {referer});
  }

  // 继续下一页
  let next_page = json.data.next_page;
  next_page = parseInt(next_page);
  if (next_page !== 0 && !isNaN(next_page)) {
    form.set('page_num', next_page);
    await getMorePages(ajaxurl, form);
  }
}


async function main() {
  const startUrl = 'https://www.mntuce01.com/19357/.html';
  setProxy();
  console.log(await (await fetch('https://www.google.com')).text())
  return;
  const {srcList, ajaxurl, form} = await start(startUrl);

  // let referer = (new URL(srcList[0])).origin.replace('img', 'www');
  let referer = 'https://www.mntuce01.com/'
  for (let src of srcList) {
    await downloadImage(src, {referer});
    break
  }
  return;
  // 获取更多页
  await getMorePages(ajaxurl, form);
}

await main()