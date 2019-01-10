var express = require('express');
var router = express.Router();
const multiparty = require("multiparty");
const path = require("path");


//获取session
router.get('/getSession', function (req, res) {
  res.send(req.session.user);
});

//删除session
router.post('/removeSession', function (req, res) {
  delete req.session.user;
  res.send({
    "status": 1
  });
});

//上传文件
router.post("/upload", function (req, res) {
  let form = new multiparty.Form({
    uploadDir: "./public/upload"
  });

  form.parse(req, function (err, fields, files) {
    let key = Object.keys(files)[0];
    if (err) {
      res.send(err);
    } else {
      res.send(path.basename(files[key][0].path));
    }
  });
});

module.exports = router;