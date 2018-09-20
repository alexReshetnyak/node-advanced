
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // listen on port config.port
  app.listen(3000, () => {
    console.info(`server started on port 3000`);
  });
}
