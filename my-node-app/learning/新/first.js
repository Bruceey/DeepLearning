async function run() {
  try {
    Promise.reject(new Error('出错了')); // 没有 await
  } catch (e) {
    console.log('捕获到错误:', e.message);
  }
}
run();
