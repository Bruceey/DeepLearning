import * as fs from 'fs';
import * as cheerio from 'cheerio'

const html = fs.readFileSync('../../learning/1.html', 'utf8');

// const $ = cheerio.load(html);
// const srcs = $('.wp-block-image.size-large img').map((i, el) => $(el).attr('src')).get()
// console.log(srcs)
// let referer = new URL(srcs[0]).origin.replace('img', 'www')
// console.log(referer)

const reg = /<button.*?id="load-more-btn".*?data-post-id="(\d*?)" data-next-page="(\d*?)"/gs
const match = [...html.matchAll(reg)][0].slice(1)
console.log(match)

const data = {post_id: match[0], next_page: match[1]};

// var ajaxurl = "https:\/\/www.mntuce01.com\/wp-admin\/admin-ajax.php";
const ajaxurl = html.match(/ajaxurl.*?=.*?"(.*?)"/)[1].replaceAll('\\', '');
console.log(ajaxurl)
