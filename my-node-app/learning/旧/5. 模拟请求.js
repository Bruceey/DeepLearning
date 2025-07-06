let url = 'https://www.mntuce01.com/wp-admin/admin-ajax.php';
let postId = 19431;
let nextPage = 2;

const response = await fetch(url, {
  method: 'POST',
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  body: JSON.stringify({
    action: 'load_more_post_page',
    post_id: postId,
    page_num: nextPage
  })
});

const data = await response.json();
console.log(data);