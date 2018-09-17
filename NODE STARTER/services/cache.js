
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
const util = require('util'); // * Standard Node lib
const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;
client.hget = util.promisify(client.hget);

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');

  return this;
}

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));

  const cacheValue = await client.hget(this.hashKey, key);

  if (cacheValue) {
    console.log('DATA FROM CACHE');
    
    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc) 
      ? doc.map(d => new this.model(d)) 
      : new this.model(doc) ;
  }
  
  const result = await exec.apply(this, arguments);

  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10); // * "EX", 10 store result for 10 seconds

  return result;
}

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
