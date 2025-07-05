//app.js

const express = require('express');//import the required package
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World! 杨幂');
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});