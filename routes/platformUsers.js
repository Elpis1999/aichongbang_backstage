var express = require('express');
var router = express.Router();
const client = require('ykt-http-client');
client.url('127.0.0.1:8080');


// //注册
// router.post('/', async function (req, res) {
//   let data = await client.post('/users', req.body);
//   res.send({
//     "status": 1
//   });
// });
router.post('/',async function (req,res){
    let data = await client.post('/users',req.body)
    res.send({
        data
    })
})
//添加用户
router.post('/pass',async function (req,res){
    let data = await client.post('/users',req.body)
    res.send({
        data
    })
})
//添加审核通过的用户

router.delete("/:id", async function (req, res) {
    let id = req.params.id
    await client.delete('/users/' + id)
    res.send({ 
        status: 1
     })
  })
  //删
  router.delete("/refuse/:id", async function (req, res) {
    let id = req.params.id
    await client.delete('/users/' + id)
    res.send({ 
        status: 1
     })
  })
  //拒绝审核
  router.put("/:id", async function (req, res) {
    console.log("来了")
    let id = req.params.id
    let { userPhone,pwd,permissions,status,name,email,store_status } = req.body;
    let data = await client.put("/users/" + id, { userPhone,pwd,permissions,status,name,email,store_status })
    res.send(data)
    // console.log(data)
  })
  router.put("/status/:id", async function (req, res) {
    console.log("来了")
    let id = req.params.id
    let {store_status } = req.body;
    let data = await client.put("/store/" + id, { store_status })
    console.log("审核前数据为："+data)
    for(let i = 0;i<data.length;i++)
    if(data[i].store_status == '已审核'){
        data.splice(i,1)
    }
    console.log("审核后数据为："+data)
    
    res.send(data)
    // console.log(data)1
  })
  //修改
  router.get('/', async (req, res) => {
      console.log("1")
    let { userPhone,pwd,permissions,status,name,email } = req.query;
    let data = await client.get("/users", { userPhone,pwd,permissions,status,name,email })
    let tempArr=[]
    for(let i = 0; i<data.length;i++){
        if(data[i].status=="已审核"){
            tempArr.push(data[i])
        }
    }
     res.send(tempArr);
    console.log(data)
    //查
  })
  router.get('/platform', async function (req, res) {
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
    let data = await client.get("/users", {
        page,
        rows,
        ...searchObj
    });
    console.log("data为："+data)
    let tempArr=[]
    for(let i = 0; i<data.length;i++){
        if(data[i].status=="未审核"){
            tempArr.push(data[i])
        }
    }
     res.send(tempArr);
});
module.exports = router;