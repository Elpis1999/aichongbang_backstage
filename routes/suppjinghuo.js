var express = require("express");
var router = express.Router();
const client = require("ykt-http-client");
client.url("127.0.0.1:8080");
//查询
router.get("/", async function(req, res) {
  let store = [];
  let num = [];
  let { suppid } = req.query;
  console.log(suppid, "前端传过来的id");
  let storeData = await client.get("/store");
  let data = await client.get("/goods", {
    submitType: "findJoin",
    // "suppiler.$id": suppid,
    ref: "suppiler",
    "suppiler.$id": suppid
  });
  console.log(storeData, "门店的数据");
  console.log("对应供应商的所有数据", data);
  let obj = {};
  for (let i = 0; i < data.length; i++) {
    obj.number = data[i].getnumber;
    obj.name = data[i].supp_gd_brand;
    for (let j = i + 1; j < data.length; j++) {
      if (data[i].supp_gd_brand == data[j].supp_gd_brand) {
        obj.number += data[j].getnumber;
        data.splice(j, 1);
        j--;
      }
    }
    num.push(obj);
    obj={}
  }
  res.send(num);
});

module.exports = router;
