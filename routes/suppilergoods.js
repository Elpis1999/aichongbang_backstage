var express = require('express');
var router = express.Router();
const client = require('ykt-http-client');
client.url('127.0.0.1:8080');

// 统计销量
router.get("/SVTJ", async function (req, res) {
    let { supID } = req.query;  //获取供应商的ID
    console.log(supID)
    let odData = await client.get("/order")//获取所有的订单信息
    let goodss = await client.get("/goods", { submitType: "findJoin", "suppiler.$id": supID, ref: "suppiler" })//查询来自该供应商的所有商品
    //拿到供应商ID，查询门店商品集合中属于这个供应商的所有商品； 查询订单中ID和查询到的门店商品ID一致的；
    //进行分类  循环出两个数组 一个用来放商品品类  一个放商品数量
    let newArr = [];
    for (let i = 0; i < goodss.length; i++) {
        for (let j = 0; j < odData.length; j++) {
            for (let k = 0; k < odData[j].order_goods.length; k++) {
                if (odData[j].state == "已完成") {
                    if (goodss[i]._id == odData[j].order_goods[k].goodsId) {
                        if (newArr.length == 0) {
                            newArr.push({ "name": odData[j].order_goods[k].goodsName, "nums": odData[j].order_goods[k].number })
                        } else {
                            for (let n = 0; n < newArr.length; n++) {
                                if (odData[j].order_goods[k].goodsName == newArr[n].name) {
                                    newArr[n].nums = parseInt(newArr[n].nums) + parseInt(odData[j].order_goods[k].number);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    res.send({
        newArr: newArr
    });

})


// 查询
router.get('/', async function (req, res) {
    let {
        page,
        rows,
        type,
        value,
        supId
    } = req.query;
    let searchObj = {};
    if (type) {
        searchObj = {
            [type]: value || ""
        };
    }
    let datas = await client.get("/suppilergoods", {
        page,
        rows,
        ...searchObj,
        submitType: "findJoin",
        // "suppiler.$id": supId,
        ref: "suppiler"
    });
    let data = [];
    let newData = datas;
    datas = datas.rows;
    if (supId) {
        for (let i = 0; i < datas.length; i++) {
            if (supId == datas[i].suppiler._id) {
                data.push(datas[i])
            }
        }
        newData.total = data.length;
        newData.rows = data;
        console.log(newData)
        res.send(newData);
    } else {
        res.send(newData);
    }
    // res.send(datas);
})
//通过ID查询
router.get('/:id', async function (req, res) {
    let id = req.params.id;
    let data = await client.get("/suppilergoods/" + id);
    res.send(data);
})

// 删除
router.delete('/:id', async function (req, res) {
    let id = req.params.id;
    await client.delete("/suppilergoods/" + id);
    res.send({
        status: 1
    });
});

//添加
router.post('/', async function (req, res) {
    let {
        supp_gd_brand,
        supp_gd_title,
        supp_gd_type,
        supp_gd_material,
        made,
        supp_gd_appl,
        supp_gd_exc,
        supp_gd_install,
        supp_gd_taste,
        supp_gd_special,
        supp_gd_from,
        supp_gd_factor,
        supp_gd_keepquality,
        supId,
        supp_gd_specialinfo,
        supp_gd_price,
        bigpic,
        smallpic
    } = req.body;

    await client.post('/suppilergoods', {
        supp_gd_brand,
        supp_gd_title,
        supp_gd_type,
        supp_gd_material,
        made,
        supp_gd_appl,
        supp_gd_exc,
        supp_gd_install,
        supp_gd_taste,
        supp_gd_special,
        supp_gd_from,
        supp_gd_factor,
        supp_gd_keepquality,
        suppiler: {
            $ref: "suppiler",
            $id: supId,
        },
        supp_gd_specialinfo,
        supp_gd_price,
        bigpic,
        smallpic,
        class: "1"
    })
    res.send({
        status: 1
    });
});

//修改
router.put("/:id", async function (req, res) {
    // router.post('/updata', function (req, res) {
    let id = req.params.id;
    let { supp_gd_brand, supp_gd_title, supp_gd_type, supp_gd_material, made, supp_gd_appl,
        supp_gd_exc, supp_gd_install, supp_gd_taste, supp_gd_special, supp_gd_from, supp_gd_factor,
        supp_gd_keepquality, supId, supp_gd_specialinfo, supp_gd_price, bigpic, smallpic } = req.body

    await client.put("/suppilergoods/" + id, {
        supp_gd_brand, supp_gd_title, supp_gd_type, supp_gd_material, made, supp_gd_appl,
        supp_gd_exc, supp_gd_install, supp_gd_taste, supp_gd_special, supp_gd_from, supp_gd_factor,
        supp_gd_keepquality,
        suppiler: {
            $ref: "suppiler",
            $id: supId,
        },
        supp_gd_specialinfo, supp_gd_price, bigpic, smallpic,
        class: "1"
    });

    res.send({ status: 1 });

});

module.exports = router;