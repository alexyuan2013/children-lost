const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const handler = require('../src/controller.js')

//配置路由
const router = express.Router();
//配置访问静态文件
app.use(express.static('public'));
//配置解析json
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

router.get('/test', function(req, res){
  handler.handleTest(req, res)
})

router.get('/lost_children_latest', function(req, res){
  handler.handleLostChidren(req, res, 20) // 默认拉取10个
})

router.get('/lost_children_not_found', function(req, res){
  handler.handleNotFoundChildren(req, res, 100)
})

app.use('/api', router)

module.exports = app;