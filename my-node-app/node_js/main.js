// const fs = require("node:fs");

// // Asynchronous read
// fs.readFile("input.txt", function (err, data) {
// 	if (err) {
// 		return console.error(err);
// 	}
//     console.log(data);
// 	console.log("Asynchronous read: " + data.toString());
// });

// Synchronous read
// const data = fs.readFileSync('input.txt');
// console.log("Synchronous read: " + data.toString());

// const fs = require('node:fs/promises')
// fs.readFile('input.txt', 'utf8').then( data => console.log(data))