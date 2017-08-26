var app = require('./src/router.js');
var http = require('http').Server(app);

http.listen(process.env.PORT || 8005, function(){
  console.log('listening on *: ' + process.env.PORT || 8005);
});
var fetch = require('./src/fetch_lost_children')
// 第一条 231038-226
// 最近一年的种子编号 231038-1000
fetch.fetchLostChildren('2156')
setTimeout(fetch.fetchLostChildrenResult, 1000)
setInterval(fetch.fetchLostChildrenResult, 600000);
