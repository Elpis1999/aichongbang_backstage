var express = require('express');
var router = express.Router();
const client = require('ykt-http-client');
client.url('127.0.0.1:8080');


//增加
router.post('/', async function (req, res) {
  let {user, addr,phone,order_goods,order_serve,storeid,petmasterID} = req.body;
  let state = "未完成"
  let times = new Date()
  let year = times.getFullYear()
  let month = times.getMonth()+1
  let day = times.getDate()
  let time = `${year+"-"+month+"-"+day}`
  client.post('/order', {store:{
      $ref: "store",
      $id: storeid
  },petmaster:{
      $ref:"petmaster",
      $id:petmasterID
  },
  user, addr,phone,
  order_goods:JSON.parse(order_goods),
  order_serve:JSON.parse(order_serve),
  state,time
  })
  res.send({ status: 1 });
});

//修改
router.put("/:id", async function (req, res) {
  let id = req.params.id;
  let {user,addr,phone,state} = req.body
  let storeObj = await client.get('/order/' + id);
  
  await client.put("/order/" + id, { store: {
      $ref: "store",
      $id: storeObj.store.$id
      },petmaster:{
        $ref:"petmaster",
        $id:storeObj.petmaster.$id
    },
    order_goods:storeObj.order_goods,
    order_serve:storeObj.order_serve,
    user,addr,phone,state
    });

  res.send({ status: 1 });
});

//查询id
router.get('/:id', async (req, res) => {
  let id = req.params.id;
  let data = await client.get('/order/' + id,{submitType: 'findJoin', ref: ['store','petmaster']})
  res.send(data)
})

// 查询
router.get('/', async (req, res) => {
  let { page, rows, type, value ,sID} = req.query;
  console.log(value)
  if(type=="_id"){
      console.log(123123123)
    let data = await client.get('/order/' + value,{page, rows,submitType: 'findJoin', ref: ['store','petmaster']})
    console.log(data)
    res.send(data)
  }else{

  let searchObj = {};
  if (type) {
      searchObj = { [type]: value };
  }
  let datas = await client.get('/order', { submitType: 'findJoin', ref: ['store','petmaster'],...searchObj })
  // console.log(datas)

  let arr = [];
  for(let i = 0;i<datas.length;i++){
      if(datas[i].store._id==sID){
          arr.push(datas[i])
      }
  }
// console.log(arr)
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
//   console.log(data.rows)
  res.send(data)
}
})

module.exports = router;