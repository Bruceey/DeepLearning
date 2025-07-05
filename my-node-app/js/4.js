async function post(request) {
  try {
    const response = await fetch(request);
    const result = await response;
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

const request1 = new Request("https://example.org/post", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ username: "example1" }),
});


post(request1);


let url =
response = await fetch(request1);