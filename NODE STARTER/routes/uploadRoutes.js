  
const AWS = require('aws-sdk');
const uuid = require('uuid/v1'); // * Generator uniq user id
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

const s3 = new AWS.S3({
  endpoint: 's3-eu-west-3.amazonaws.com',
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  signatureVersion: 'v4',
  region: 'eu-west-3'
});

const amazonPolicySettings = `{
  "Version": "2012-10-17",
  "Id": "Policy1537698898229",
  "Statement": [
      {
          "Sid": "Stmt1537698896278",
          "Effect": "Allow",
          "Principal": "*",
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::node-advanced/*"
      }
  ]
}`;

const amazonCorsSettings = `
  <?xml version="1.0" encoding="UTF-8"?>
  <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
      <AllowedOrigin>http://localhost:3000</AllowedOrigin>
      <AllowedMethod>PUT</AllowedMethod>
      <AllowedHeader>*</AllowedHeader>
    </CORSRule>
    <CORSRule>
      <AllowedOrigin>*</AllowedOrigin>
      <AllowedMethod>GET</AllowedMethod>
      <AllowedMethod>PUT</AllowedMethod>
      <AllowedMethod>HEAD</AllowedMethod>
      <MaxAgeSeconds>3000</MaxAgeSeconds>
      <ExposeHeader>x-amz-server-side-encryption</ExposeHeader>
      <AllowedHeader>Authorization</AllowedHeader>
    </CORSRule>
  </CORSConfiguration>`;

const bucketName = 'node-advanced';

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;
    // const key = 'sample.jpeg'

    s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      ContentType: 'image/jpeg',
      Key: key
    }, (err, url) => res.send({ key, url }))
  });
}
