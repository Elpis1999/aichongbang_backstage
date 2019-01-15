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
//判断是否是已审核的用户
router.post('/login', async function (req, res) {
  let {
    userPhone,
    pwd
  } = req.body;
  let data = await client.get('/users', {
    userPhone,
    pwd,
    status:"已审核",
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

//判断是否注册
router.post('/isRegisted', async function (req, res) {
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


router.get('/shop', async function (req, res) {

  let {

    page,

    rows,

    type,

    value

  } = req.query;

  let searchObj = {};

  if (type) {

    searchObj = {

      [type]: value || ""

    };

  }

  let data = await client.get("/store", {

    page,

    rows,

    ...searchObj,

    submitType: "findJoin",

    ref: "users"

  });
  let tempArr=[]
  for(let i = 0; i<data.length;i++){
      if(data[i].store_status=="已审核"||data[i].store_status=="已关闭"){
          console.log(data[i].store_status)
          tempArr.push(data[i])
      }
  }

  let shopAddr = [];

  tempArr.forEach(function (ele,i) {

    shopAddr.push([ele.longitude,ele.latitude,ele.store_bus_addr,ele.store_name]);

    console.log(i)

  });

  res.send(shopAddr);

  

});

module.exports = router;