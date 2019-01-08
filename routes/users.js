var express = require('express');
var router = express.Router();
const client = require('ykt-http-client');
client.url('127.0.0.1:8080');


//注册
router.post('/', async function (req, res) {
  let data = await client.post('/users', req.body);
  res.send({
    "status": 1
  });
});

//验证用户名是否重复
router.get('/', async function (req, res) {
  let data = await client.get('/users', {
    userPhone: req.query.userPhone
  });
  if (data.length < 1) {
    res.send({
      "status": 1
    });
  } else {
    res.send({
      "status": 0
    });
  }
});

//登录验证
router.post('/login', async function (req, res) {
  let {
    userPhone,
    pwd
  } = req.body;
  let data = await client.get('/users', {
    userPhone,
    pwd,
    findType: 'exact'
  });
  if (data.length < 1) {
    res.send({
      "status": 0
    });
  } else {
    req.session.user = data[0];
    res.send(data[0]);
  }
});

module.exports = router;