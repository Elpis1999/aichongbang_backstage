var express = require('express');
var router = express.Router();
const client = require('ykt-http-client');
client.url('127.0.0.1:8080');

//增加
router.post('/', async function (req, res) {
    let {
        storeId
    } = req.body;

    let obj = req.body;

    delete obj.storeId;

    obj.store = {
        $ref: "store",
        $id: storeId
    }

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
        value
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
        ref: "store"
    });
    res.send(data);
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
    obj.supp_gd_made = JSON.parse(obj.supp_gd_made);

    obj.supp_gd_name = JSON.parse(obj.supp_gd_name);

    obj.supp_gd_pic = JSON.parse(obj.supp_gd_pic);

    delete obj._id;
    
    await client.put('/goods/' + id, obj);
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