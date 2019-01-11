var express = require('express');
var router = express.Router();
const client = require('ykt-http-client');
client.url('127.0.0.1:8080');


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

//图片
// router.post("/upload", function (req, res) {
//     let form = new multiparty.Form({
//         uploadDir: "./public/upload"
//     });
//     form.parse(req, function (err, fields, files) {
//         if (err) {
//             res.send(err);
//         } else {
//             // console.log("files1",files[Object.keys(files)[0]][0].path);
//             res.send(path.basename(files[Object.keys(files)[0]][0].path));
//         }
//     });
// });

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