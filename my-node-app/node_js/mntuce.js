import {fetch, setGlobalDispatcher, ProxyAgent} from "undici";

const proxyAgent = new ProxyAgent('http://127.0.0.1:20122');
setGlobalDispatcher(proxyAgent);


let start_url = 'https://www.mntuce01.com/19357/.html';

fetch(start_url)
  .then(response => response.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('.wp-block-image.size-large img');
    const urls = Array.from(links).map(img => img.src);
    console.log(urls);
  })
  .catch(error => console.error(error));