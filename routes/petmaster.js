var express = require('express');
var router = express.Router();
const client = require('ykt-http-client');
client.url('127.0.0.1:8080');

//增加
router.post('/', async function (req, res) {
    let { pm_phone, pm_name, pm_nickname,pm_vipcard,pm_pic,pm_address,pm_area,pm_integral,pm_ownpet} = req.body;
    pm_ownpet = pm_ownpet && JSON.parse(pm_ownpet);
    client.post('/petmaster', {pm_phone, pm_name, pm_nickname,pm_vipcard,pm_pic,pm_address,pm_area,pm_integral,pm_ownpet })
    
    res.send({ status: 1 });
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
    let data = await client.get("/petmaster", {
        page,
        rows,
        ...searchObj
    });
    res.send(data);
});

//查询ID
router.get('/:id', async function (req, res) {
    let id = req.params.id;
    let data = await client.get('/petmaster/' + id);
    res.send(data);
});

//修改
router.put("/:id", async function (req, res) {
    let id = req.params.id;
    let { pm_phone, pm_name, pm_nickname,pm_vipcard,pm_pic,pm_address,pm_area,pm_integral,pm_ownpet} = req.body;
    pm_ownpet = pm_ownpet && JSON.parse(pm_ownpet);
    await client.put('/petmaster/' + id, {pm_phone, pm_name, pm_nickname,pm_vipcard,pm_pic,pm_address,pm_area,pm_integral,pm_ownpet});
    res.send({
        "status": 1
    });
});

//删除
router.delete("/:id", async function (req, res) {
    let id = req.params.id;
    await client.delete('/petmaster/' + id);
    res.send({
        "status": 1
    });
});

module.exports = router;