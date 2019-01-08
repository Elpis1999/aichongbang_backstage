var express = require('express');
const multiparty = require('multiparty');
const path = require('path');
var router = express.Router();
const client = require('ykt-http-client');
// const lodash = require("lodash");
client.url('127.0.0.1:8080');


// 查询
router.get('/', async function (req, res) {
    let { page, rows, type, value } = req.query;
    let data = await client.get("/suppilergoods", { page, rows, submitType: "findJoin", ref: "suppiler" });
    res.send(data);
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
    let { supp_gd_brand, supp_gd_title, supp_gd_type, supp_gd_material,
        made, supp_gd_appl, supp_gd_exc, supp_gd_install, supp_gd_taste,
        supp_gd_special, supp_gd_from, supp_gd_factor, supp_gd_keepquality,
        supId, supp_gd_specialinfo, supp_gd_price, pigpic, smallpic } = req.body;

    let supp_gd_name = {
        supp_gd_brand: supp_gd_brand,
        supp_gd_title: supp_gd_title
    }
    let supp_gd_made = {
        supp_gd_material: supp_gd_material,
        made: made
    }
    let supp_gd_number = {
        $ref: "suppiler", $id: supId,
    }
    let supp_gd_pic = {
        pigpic: pigpic, smallpic: smallpic
    }
    await client.post('/suppilergoods', {
        supp_gd_name, supp_gd_type, supp_gd_made, supp_gd_appl,
        supp_gd_exc, supp_gd_install, supp_gd_taste, supp_gd_special,
        supp_gd_from, supp_gd_factor, supp_gd_keepquality,
        supp_gd_number, supp_gd_specialinfo, supp_gd_price, supp_gd_pic
    })
    res.send({ status: 1 });
});

//图片
router.post("/upload", function (req, res) {
    let form = new multiparty.Form({
        uploadDir: "./public/upload"
    });
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.send(err);
        } else {
            // console.log("files1",files[Object.keys(files)[0]][0].path);
            res.send(path.basename(files[Object.keys(files)[0]][0].path));
        }
    });
});


module.exports = router;