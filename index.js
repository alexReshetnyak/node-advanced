const cluster = require('cluster');
const express = require('express');
const app = express();

// ! If the file being executed in master mode?
if (cluster.isMaster) {
  // Cause index.js to be executed *again* but
  // in child mode
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  // I'm child, I'm going to act like a server and do nothing else
  function doWork(duration) {
    const start = Date.now();
    while (Date.now() - start < duration) {};
  }

  app.get('/', (req, res) => {
    doWork(5000);
    res.send('Hi there');
  });

  app.get('/fast', (req, res) => {
    res.send('Hi there FAST');
  });

  app.listen(3000);
}