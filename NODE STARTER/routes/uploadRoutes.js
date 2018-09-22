  
const AWS = require('aws-sdk');
const uuid = require('uuid/v1'); // * Generator uniq user id
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey
});
const bucketName = 'node-advanced';

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      ContentType: 'image/jpeg',
      Key: key
    }, (err, url) => res.send({ key, url }))
  });
}
