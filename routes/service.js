var express = require('express');
var router = express.Router();
const client = require('ykt-http-client');
client.url('127.0.0.1:8080');



//增加
router.post('/', async function (req, res) {
    let {sur_name , sur_date , sur_rules , sur_time , sur_level , sur_price , sur_weight,  storeid} = req.body;
    client.post('/service', {store:{
        $ref: "store",
        $id: storeid
    },sur_name , sur_date , sur_rules , sur_time , sur_level , sur_price,sur_weight})
  
    res.send({ status: 1 });
  });

//修改
router.put("/:id", async function (req, res) {
    let id = req.params.id;
    let {sur_name,sur_date,sur_rules,sur_time,sur_level,sur_price} = req.body
    let storeObj = await client.get('/service/' + id);
    await client.put("/service/" + id, { store: {
        $ref: "store",
        $id: storeObj.store.$id
    },sur_name , sur_date , sur_rules , sur_time , sur_level , sur_price
    });
    res.send({ status: 1 });
  });


// 查询
router.get('/', async (req, res) => {
    let { page, rows, type, value ,sID} = req.query;
    let searchObj = {};
    if (type) {
        searchObj = { [type]: value };
    }
    let datas = await client.get('/service', { submitType: 'findJoin', ref: 'store',...searchObj })
  
    let arr = [];
    for(let i = 0;i<datas.length;i++){
        if(datas[i].store._id==sID){
            arr.push(datas[i])
        }
    }

    let arrs=[]
    let num =4;
    let maxpage = Math.ceil(arr.length / rows);
    for(let j=(page-1)*rows;j<arr.length;j++){
         num--
         if(num>0){
           arrs.push(arr[j])
         }
         if(num<=0){
             break;
         }
    }
    let data = {
        curpage:Number(page),
        eachpage:Number(rows),
        maxpage,
        rows:arrs,
        total:arr.length
    }
    
    res.send(data)
})


//查询id
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let data = await client.get('/service/' + id,{submitType: 'findJoin', ref: 'store'})
    res.send(data)
})

// 删除
router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    await client.delete('/service/' + id);//获取整条信息
    res.send({ status: 1 })
})


module.exports = router;    