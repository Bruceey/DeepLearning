import requests

# url = 'https://www.mntuce01.com/wp-admin/admin-ajax.php'
# postId = 19431
# nextPage = 2
#
# data = {
#     'action': 'load_more_post_page',
#     'post_id': postId,
#     'page_num': nextPage
# }
#
#
# response = requests.post(url, data=data, verify=False)
# print(response.json())

start_url = "https://www.mntuce01.com/19357/.html"

r = requests.get(start_url)
print(r.text)