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
   
    res.send(data);
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
    let data = await client.get("/passStore", {
        page,
        rows,
        ...searchObj
    });
   
    res.send(data);
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
    let data = await client.post('/passStore',req.body)
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

//   router.delete("/:id", async function (req, res) {
//     let id = req.params.id
//     await client.delete('/stores/' + id)
//     res.send({ 
//         status: 1
//      })
//   })





module.exports = router;
