import * as fs from 'fs';
import * as cheerio from 'cheerio'

const html = fs.readFileSync('../../learning/1.html', 'utf8');

const $ = cheerio.load(html);
const srcs = $('.wp-block-image.size-large img').map((i, el) => $(el).attr('src')).get()
console.log(srcs)
let referer = new URL(srcs[0]).origin.replace('img', 'www')
console.log(referer)