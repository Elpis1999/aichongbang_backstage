var express = require('express');
var router = express.Router();
const db = require("ykt-mongo");
const multiparty = require('multiparty');
const path = require('path');
const client = require('ykt-http-client');
client.url('127.0.0.1:8080');
//增加
router.post('/', async function (req, res) {
    let {
        supp_number,
        supp_name,
        supp_add,
        supp_phone,
        supp_web,
        supp_bus_pic,
        supp_note
    } = req.body;
    client.post('/suppiler', {
        supp_number,
        supp_name,
        supp_add,
        supp_phone,
        supp_web,
        supp_bus_pic,
        supp_note
    })
    res.send({
        status: 1
    });
});
//查找
// router.get('/', async function (req, res) {
//   let data = await client.get("/suppiler", {submitType: "findJoin", ref: "suppiler"});
//   res.send(data)
//   console.log(data)
// });

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
  let data = await client.get("/suppiler", {
      page,
      rows,
      ...searchObj,
      submitType: "findJoin",
      ref: "suppiler"
  });
  res.send(data);
});



//删除
router.delete('/:id', async function (req, res) {
    let id = req.params.id;
    await client.delete("/suppiler/" + id);
    res.send({
        status: 1
    });
});

//修改
router.put("/:id", async function (req, res) {
    let id = req.params.id;
    let {
        supp_number,
        supp_name,
        supp_add,
        supp_phone,
        supp_web,
        supp_bus_pic,
        supp_note
    } = req.body
    await client.put("/suppiler/" + id, {
        supp_number,
        supp_name,
        supp_add,
        supp_phone,
        supp_web,
        supp_bus_pic,
        supp_note
    });
    res.send({
        status: 1
    });

});
//根据id进行查找
router.get('/:id', async function (req, res) {
    let id = req.params.id;
    let data = await client.get("/suppiler/" + id);
    res.send(data);
})
//图片
router.post("/upload", function (req, res) {
    let form = new multiparty.Form({
        uploadDir: "./public/upload"
    });
    form.parse(req, function (err, fields, suppiler) {

        if (err) {
            res.send(err);
        } else {
            res.send(path.basename(suppiler[Object.keys(files)[0]][0].path));
        }
    });
});

module.exports = router;