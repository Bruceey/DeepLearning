// import {mkdir} from "fs/promises";
//
// mkdir('test2', {recursive: true})

const form = new URLSearchParams({
  action: 'load_more_post_page',
  post_id: 1,
  page_num: 2
});

console.log(form.toString())

const request = new Request('https://example.com', {
  method: 'POST',
  body: form,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

let h = request.headers.get('Content-Type')
console.log(h)
console.log(request.url, request.headers)