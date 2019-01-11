var express = require('express');
var router = express.Router();
const client = require('ykt-http-client');
const _ = require("lodash");
client.url('127.0.0.1:8080');

//增加
router.post('/', async function (req, res) {
    let {
        storeId,
        supId
    } = req.body;

    let obj = req.body;
    delete obj.supId;
    delete obj.storeId;

    if (supId) {
        obj.suppiler = {
            $ref: "suppiler",
            $id: supId
        }
    }

    obj.store = {
        $ref: "store",
        $id: storeId
    }
    console.log(obj);
    await client.post('/goods', obj);
    res.send({
        "status": 1
    });
});

//查询
router.get('/', async function (req, res) {
    let {
        page,
        rows,
        type,
        value,
        storeId
    } = req.query;
    let searchObj = {};
    if (type) {
        searchObj = {
            [type]: value || ""
        };
    }
    let data = await client.get("/goods", {
        page,
        rows,
        ...searchObj,
        submitType: "findJoin",
        "store.$id": storeId,
        ref: "store"
    });
    console.log("data1", data);
    console.log("data2", data.rows);
    res.send(data);
});

//查询商品月销量
router.get('/mgoodsSalesVolume', async function (req, res) {
    let {
        storeId
    } = req.query;
    let order = await client.get("/order");
    let orderArr = [];
    for (let i = 0; i < order.length; i++) {
        if (storeId === order[i].store.$id) {
            orderArr.push(order[i])
        }
    }
    let date = new Date().getMonth();
    let year = new Date().getFullYear();
    if (date === 0) {
        date = 12;
        year = parseInt(year) - 1;
    }
    let upMonthOrder = [];

    for (let i = 0; i < orderArr.length; i++) {
        if (orderArr[i].time.split("-")[1] == date && orderArr[i].time.split("-")[0] == year) {
            upMonthOrder.push(orderArr[i])
        }
    }

    let goodsArr = [];

    for (let i = 0; i < upMonthOrder.length; i++) {
        goodsArr.push(...upMonthOrder[i].order_goods);
    }

    let axisData = [];
    let seriesData = [];

    let newArr = _.uniqWith(goodsArr, _.isEqual)

    for (let i = 0; i < newArr.length; i++) {
        let number = 0;
        let name = "";
        for (let j = 0; j < goodsArr.length; j++) {


            if (newArr[i].goodsName == goodsArr[j].goodsName) {
                name = goodsArr[j].goodsName;
                number += parseInt(goodsArr[j].number);
            }
        }
        axisData.push(name);
        seriesData.push(number);
    }

    res.send({
        axisData,
        seriesData,
    });
});

//查询商品季销量
router.get('/qgoodsSalesVolume', async function (req, res) {
    let {
        storeId
    } = req.query;
    let order = await client.get("/order");
    let orderArr = [];
    for (let i = 0; i < order.length; i++) {
        if (storeId === order[i].store.$id) {
            orderArr.push(order[i])
        }
    }
    let date = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let inSeason = [];

    if (date == 1 || date == 2 || date == 3) {
        inSeason = [10, 11, 12];
    } else if (date == 4 || date == 5 || date == 6) {
        inSeason = [1, 2, 3];
    } else if (date == 7 || date == 8 || date == 9) {
        inSeason = [4, 5, 6];
    } else {
        inSeason = [7, 8, 9];
    }



    if ((date - 1) === 0) {
        year = parseInt(year) - 1;
    }
    let upMonthOrder = [];

    for (let i = 0; i < orderArr.length; i++) {
        if ((orderArr[i].time.split("-")[1] == inSeason[0] ||
                orderArr[i].time.split("-")[1] == inSeason[1] ||
                orderArr[i].time.split("-")[1] == inSeason[2]) &&
            orderArr[i].time.split("-")[0] == year) {
            upMonthOrder.push(orderArr[i])
        }
    }

    let goodsArr = [];

    for (let i = 0; i < upMonthOrder.length; i++) {
        goodsArr.push(...upMonthOrder[i].order_goods);
    }

    let axisData = [];
    let seriesData = [];

    let newArr = _.uniqWith(goodsArr, _.isEqual)

    for (let i = 0; i < newArr.length; i++) {
        let number = 0;
        let name = "";
        for (let j = 0; j < goodsArr.length; j++) {


            if (newArr[i].goodsName == goodsArr[j].goodsName) {
                name = goodsArr[j].goodsName;
                number += parseInt(goodsArr[j].number);
            }
        }
        axisData.push(name);
        seriesData.push(number);
    }

    res.send({
        axisData,
        seriesData,
    });
});
//查询商品年销量
router.get('/ygoodsSalesVolume', async function (req, res) {
    let {
        storeId
    } = req.query;
    let order = await client.get("/order");
    let orderArr = [];
    for (let i = 0; i < order.length; i++) {
        if (storeId === order[i].store.$id) {
            orderArr.push(order[i])
        }
    }
    let year = new Date().getFullYear() - 1;

    let upMonthOrder = [];

    for (let i = 0; i < orderArr.length; i++) {
        if (orderArr[i].time.split("-")[0] == year) {
            upMonthOrder.push(orderArr[i])
        }
    }

    let goodsArr = [];

    for (let i = 0; i < upMonthOrder.length; i++) {
        goodsArr.push(...upMonthOrder[i].order_goods);
    }

    let axisData = [];
    let seriesData = [];

    let newArr = _.uniqWith(goodsArr, _.isEqual)

    for (let i = 0; i < newArr.length; i++) {
        let number = 0;
        let name = "";
        for (let j = 0; j < goodsArr.length; j++) {
            if (newArr[i].goodsName == goodsArr[j].goodsName) {
                name = goodsArr[j].goodsName;
                number += parseInt(goodsArr[j].number);
            }
        }
        axisData.push(name);
        seriesData.push(number);
    }

    res.send({
        axisData,
        seriesData,
    });

});
//查询月服务预约量
router.get('/mserviceSalesVolume', async function (req, res) {
    let {
        storeId
    } = req.query;
    let order = await client.get("/order");
    let orderArr = [];
    for (let i = 0; i < order.length; i++) {
        if (storeId === order[i].store.$id) {
            orderArr.push(order[i])
        }
    }
    let date = new Date().getMonth();
    let year = new Date().getFullYear();
    if (date === 0) {
        date = 12;
        year = parseInt(year) - 1;
    }
    let upMonthOrder = [];

    for (let i = 0; i < orderArr.length; i++) {
        if (orderArr[i].time.split("-")[1] == date && orderArr[i].time.split("-")[0] == year) {
            upMonthOrder.push(orderArr[i])
        }
    }

    let serviceArr = [];

    for (let i = 0; i < upMonthOrder.length; i++) {
        serviceArr.push(...upMonthOrder[i].order_serve);
    }

    let axisData = [];
    let seriesData = [];

    //数组去重
    let hash = {};
    let newArr = serviceArr.reduce(function (item, next) {
        hash[next.name] ? '' : hash[next.name] = true && item.push(next);
        return item
    }, [])

    for (let i = 0; i < newArr.length; i++) {
        let number = 0;
        let name = "";
        for (let j = 0; j < serviceArr.length; j++) {
            if (newArr[i].serveName == serviceArr[j].serveName) {
                name = serviceArr[j].serveName;
                number += 1;
            }
        }
        axisData.push(name);
        seriesData.push(number);
    }

    res.send({
        axisData,
        seriesData
    });

});

//查询季服务预约量
router.get('/qserviceSalesVolume', async function (req, res) {
    let {
        storeId
    } = req.query;
    let order = await client.get("/order");
    let orderArr = [];
    for (let i = 0; i < order.length; i++) {
        if (storeId === order[i].store.$id) {
            orderArr.push(order[i])
        }
    }
    let date = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let inSeason = [];

    if (date == 1 || date == 2 || date == 3) {
        inSeason = [10, 11, 12];
    } else if (date == 4 || date == 5 || date == 6) {
        inSeason = [1, 2, 3];
    } else if (date == 7 || date == 8 || date == 9) {
        inSeason = [4, 5, 6];
    } else {
        inSeason = [7, 8, 9];
    }



    if ((date - 1) === 0) {
        year = parseInt(year) - 1;
    }
    let upMonthOrder = [];

    for (let i = 0; i < orderArr.length; i++) {
        if ((orderArr[i].time.split("-")[1] == inSeason[0] ||
                orderArr[i].time.split("-")[1] == inSeason[1] ||
                orderArr[i].time.split("-")[1] == inSeason[2]) &&
            orderArr[i].time.split("-")[0] == year) {
            upMonthOrder.push(orderArr[i])
        }
    }

    let serviceArr = [];

    for (let i = 0; i < upMonthOrder.length; i++) {
        serviceArr.push(...upMonthOrder[i].order_serve);
    }

    let axisData = [];
    let seriesData = [];

    // let newArr = _.uniqWith(goodsArr, _.isEqual)
    //数组去重
    let hash = {};
    let newArr = serviceArr.reduce(function (item, next) {
        hash[next.name] ? '' : hash[next.name] = true && item.push(next);
        return item
    }, [])


    for (let i = 0; i < newArr.length; i++) {
        let number = 0;
        let name = "";
        for (let j = 0; j < serviceArr.length; j++) {


            if (newArr[i].serveName == serviceArr[j].serveName) {
                name = serviceArr[j].serveName;
                number += 1;
            }
        }
        axisData.push(name);
        seriesData.push(number);
    }

    res.send({
        axisData,
        seriesData,
    });

});
//查询年服务预约量
router.get('/yserviceSalesVolume', async function (req, res) {

    let {
        storeId
    } = req.query;
    let order = await client.get("/order");
    let orderArr = [];
    for (let i = 0; i < order.length; i++) {
        if (storeId === order[i].store.$id) {
            orderArr.push(order[i])
        }
    }
    let year = new Date().getFullYear() - 1;

    let upMonthOrder = [];

    for (let i = 0; i < orderArr.length; i++) {
        if (orderArr[i].time.split("-")[0] == year) {
            upMonthOrder.push(orderArr[i])
        }
    }

    let serviceArr = [];

    for (let i = 0; i < upMonthOrder.length; i++) {
        serviceArr.push(...upMonthOrder[i].order_serve);
    }

    let axisData = [];
    let seriesData = [];

    // let newArr = _.uniqWith(goodsArr, _.isEqual)
    //数组去重
    let hash = {};
    let newArr = serviceArr.reduce(function (item, next) {
        hash[next.name] ? '' : hash[next.name] = true && item.push(next);
        return item
    }, [])


    for (let i = 0; i < newArr.length; i++) {
        let number = 0;
        let name = "";
        for (let j = 0; j < serviceArr.length; j++) {


            if (newArr[i].serveName == serviceArr[j].serveName) {
                name = serviceArr[j].serveName;
                number += 1;
            }
        }
        axisData.push(name);
        seriesData.push(number);
    }

    res.send({
        axisData,
        seriesData,
    });

});
//查询ID
router.get('/:id', async function (req, res) {
    let id = req.params.id;
    let data = await client.get('/goods/' + id, {
        submitType: "findJoin",
        ref: "store"
    });
    res.send(data);
});

//修改
router.put("/:id", async function (req, res) {
    let id = req.params.id;
    let obj = req.body;

    delete obj._id;

    obj.store = {
        $ref: "store",
        $id: obj.store._id
    }

    let data = await client.put('/goods/' + id, obj);
    res.send({
        "status": 1
    });
});

//删除
router.delete("/:id", async function (req, res) {
    let id = req.params.id;
    await client.delete('/goods/' + id);
    res.send({
        "status": 1
    });
});

module.exports = router;