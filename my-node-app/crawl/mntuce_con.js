import { Writable } from 'stream';
import { fetch } from 'undici';
import { writeFile, mkdir } from 'fs/promises';
import { basename } from 'path';
import { existsSync } from 'fs';
import { Parser } from 'htmlparser2';
import pLimit from 'p-limit';

const pageUrl = 'https://example.com';
const concurrencyLimit = 5;
const limit = pLimit(concurrencyLimit);

if (!existsSync('images')) {
  await mkdir('images');
}

function resolveUrl(src, base) {
  if (src.startsWith('//')) {
    return 'https:' + src;
  } else if (src.startsWith('/')) {
    const { origin } = new URL(base);
    return origin + src;
  } else if (!/^https?:/.test(src)) {
    const { origin } = new URL(base);
    return origin + '/' + src;
  }
  return src;
}

async function downloadImage(imageUrl) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = basename(new URL(imageUrl).pathname);
    await writeFile(`images/${filename}`, buffer);
    console.log(`✅ 保存成功: ${filename}`);
  } catch (err) {
    console.error(`❌ 下载失败: ${imageUrl} - ${err.message}`);
  }
}

async function main(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`页面加载失败: HTTP ${res.status}`);

  const stream = res.body; // Node.js 的 ReadableStream（WHATWG 版）

  let parser;
  const decoder = new TextDecoder('utf-8');

  const reader = stream.getReader();
  const decoderBuffer = [];

  parser = new Parser(
    {
      onopentag(name, attrs) {
        if (name === 'img' && attrs.src) {
          const fullUrl = resolveUrl(attrs.src, url);
          limit(() => downloadImage(fullUrl)); // 控制并发下载
        }
      },
    },
    { decodeEntities: true }
  );

  // 将流逐块传给解析器
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    parser.write(decoder.decode(value, { stream: true }));
  }

  parser.end();
  await limitAllDone();
  console.log('✅ 所有图片下载完成');
}

// 等待所有 limit() 创建的任务完成
function limitAllDone() {
  // p-limit 没有内置 awaitAll，需要自己追踪
  return new Promise(resolve => {
    setImmediate(function check() {
      if (limit.activeCount === 0 && limit.pendingCount === 0) {
        resolve();
      } else {
        setTimeout(check, 100);
      }
    });
  });
}

main(pageUrl).catch(err => {
  console.error('❌ 爬取失败:', err.message);
});
