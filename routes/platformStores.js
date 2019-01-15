var express = require('express');
var router = express.Router();
const client = require('ykt-http-client');
client.url('127.0.0.1:8080');
router.get('/', async function (req, res) {
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
        ...searchObj
    });
    // console.log("1")
   console.log(data)
   let tempArr=[]
   for(let i = 0; i<data.length;i++){
       if(data[i].store_status=="未审核"){
           console.log(data[i].store_status)
           tempArr.push(data[i])
       }
   }
    res.send(tempArr);
});
//获取未审核的商店
router.get('/pass', async function (req, res) {
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
        ...searchObj
    });
    console.log("2")
    let tempArr=[]
   for(let i = 0; i<data.length;i++){
       if(data[i].store_status=="已审核"||data[i].store_status=="已关闭"){
           console.log(data[i].store_status)
           tempArr.push(data[i])
       }
   }
    res.send(tempArr);
   
});
//获取已审核的商店

//添加店铺，进入未审核
router.post('/unpass',async function (req,res){
    let data = await client.post('/store',req.body)
    res.send({
        data
    })
})



//通过审核
router.post('/pass',async function (req,res){
    let data = await client.post('/store',req.body)
    res.send({
        data
    })
})
//拒绝通过审核
router.delete("/refuse/:id", async function (req, res) {
    console.log("bingos")
    let id = req.params.id
    await client.delete('/store/' + id)
    res.send({ 
        status: 1
     })
  })
  //删

  router.delete("/:id", async function (req, res) {
    let id = req.params.id
    await client.delete('/store/' + id)
    res.send({ 
        status: 1
     })
  })

  router.put("/:id", async function (req, res) {
    console.log("来了")
    let id = req.params.id
    let { store_name,store_bus_number,store_bus_pic,store_bus_addr,longitude,latitude,store_city,store_person,store_phone,store_avatar,store_charactor,store_VIPlevel,store_money,store_clerk,store_status } = req.body;
    let data = await client.put("/store/" + id, {store_name,store_bus_number,store_bus_pic,store_bus_addr,longitude,latitude,store_city,store_person,store_phone,store_avatar,store_charactor,store_VIPlevel,store_money,store_clerk,store_status})
    res.send(data)
    console.log(data)
  })





module.exports = router;
