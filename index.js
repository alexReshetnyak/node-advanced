// ! To run Apache Benchmark run in terminal -   ab -c 50 -n 500 localhost:3000/fast
process.env.UV_TREADPOOL_SIZE = 1;
// ! start using pm2 - pm2 start index.js -i 0
// * -i 0 - it means that number of instances will be equal to cpu cores

const express = require('express');
const app = express();
const crypto = require('crypto');


app.get('/', (req, res) => {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    res.send('Hi there');
  });
  // setTimeout(() => {
  //   res.send('Hi there');
  // }, 1000);
});

app.get('/fast', (req, res) => {
  res.send('Hi there FAST');
});

app.listen(3000);
