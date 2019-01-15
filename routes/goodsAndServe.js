var express = require('express');

var router = express.Router();

const client = require('ykt-http-client');

client.url('127.0.0.1:8080');



router.get('/goodsAndServe', async function (req, res) {

    let data = await client.get('/order');

    let goodsSum = [];

    let serveSum = [];

    let sum = [];

    for (let i = 0; i < data.length; i++) {

        for (let j = 0; j < data[i].order_goods.length; j++) {

            goodsSum.push(parseInt(data[i].order_goods[j].price))

            console.log("商品：", goodsSum)

        }

        for (let j = 0; j < data[i].order_serve.length; j++) {

            serveSum.push(parseInt(data[i].order_serve[j].price))

            console.log("服务：", serveSum)

        }

    }

    sum.push(goodsSum, serveSum);

    console.log("总数：", sum)

    res.send(sum);

});





module.exports = router;
