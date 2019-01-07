var express = require('express');
var router = express.Router();
const client = require('ykt-http-client');
client.url('127.0.0.1:8080');

//增加
router.post('/', async function (req, res) {
    let {
        userId
    } = req.body;


    let obj = req.body;

    obj.store_clerk = JSON.parse(obj.store_clerk);

    delete obj.userId;

    obj.store_accnum = {
        $ref: "store",
        $id: userId
    }

    await client.post('/store', obj);
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

//查询ID
router.get('/:id', async function (req, res) {
    let id = req.params.id;
    let data = await client.get('/store/' + id, {
        submitType: "findJoin",
        ref: "users"
    });
    res.send(data);
});


//修改门店
router.put("/:id", async function (req, res) {
    let id = req.params.id;
    req.body.store_clerk = JSON.parse(req.body.store_clerk);
    await client.put('/store/' + id, req.body);
    res.send({
        "status": 1
    });
});

module.exports = router;