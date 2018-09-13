// ! To run Apache Benchmark run in terminal -   ab -c 50 -n 500 localhost:3000/fast
// * pm2 start index.js -i 0      pm2 show index   pm2 monit  pm2 ls 

const express = require('express');
const app = express();
const Worker = require('webworker-threads').Worker;

// * If the file being executed in master mode?

function doWork(duration) {
  const start = Date.now();
  while (Date.now() - start < duration) {};
}

app.get('/', (req, res) => {
  const worker = new Worker(function () {
    this.onmessage = function () {
      let counter = 0;
      while (counter < 1e9) {
        counter++;
      }

      postMessage(counter);
    }    
  });

  worker.onmessage = function (result) {
    console.log(result);
    res.send(result.data + '')
  }

  worker.postMessage();

  res.send('Hi there');
});

app.get('/fast', (req, res) => {
  res.send('Hi there FAST');
});

app.listen(3001, () => console.log('Serve Listen on port 3001...'));
