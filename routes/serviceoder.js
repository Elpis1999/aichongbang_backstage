var express = require('express');
var router = express.Router();
const multiparty = require("multiparty");
const path = require("path");
const client = require('ykt-http-client');
client.url('127.0.0.1:8080');




// router.get('/', async (req, res) => {
// //     // let { page, rows, type, value } = req.query;
// //     // let searchObj = {};
// //     // if (type) {
// //     //     searchObj = { [type]: value };
// //     // }

//     let data = await client.get('/serviceoder')
//     console.log(data)

//     res.send(data)
// })


router.get('/', async function (req, res) {
    let { page, rows, value, type } = req.query;
    let searchObj = {}
    if (type) {
      searchObj = { [type]: value }
    }
    let data = await client.get("/serviceoder", { page, rows, submitType: "findJoin", ref: "classes", ...searchObj });
    res.send(data)
    console.log(data)
  });


module.exports = router;