const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const redis = require('redis');
    const redisUrl = 'redis://127.0.0.1:6379';
    const client = redis.createClient(redisUrl);
    const util = require('util'); // * Standard Node lib
    
    // * Wrap function in that return Promise as result, (Use Promise instead callback)
    client.get = util.promisify(client.get);

    // * delete all cached data
    // client.flushall();

    // * Check if cached data exist in redis store
    const cashedBlogs = await client.get(req.user.id);

    if (cashedBlogs) {
      console.log('SERVING FROM CACHE');
      return res.send(JSON.parse(cashedBlogs));
    }

    const blogs = await Blog.find({ _user: req.user.id });

    console.log('SERVING FROM MONGODB');
    res.send(blogs);

    // * save data in redis store
    client.set(req.user.id, JSON.stringify(blogs));
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
