var request = require('request')
var MyMongodbClient = require('my-mongodb-client')
var myClient = new MyMongodbClient('mongodb://localhost:27017/lost-children')
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

var curId = 2156 //curId需要从目前微博的

var fetchLostChildren = function (lostId) {
  var options = {
    method: 'GET',
    url: 'https://m.weibo.cn/api/container/getIndex?containerid=231038' + lostId,
    rejectUnauthorized: false,
    proxy: 'http://127.0.0.1:8087',
    json: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
      'Host': 'm.weibo.cn'
    }
  }
  request(options, function(err, res, body){
    if (err) {
      console.log(err)
      return
    }
    var result = {}
    //body = JSON.parse(body)
    if (body.ok === 1) {
      for (var i in body.cards) {
        var card = body.cards[i]
        if (card.card_type === 11) {
          if (card.card_id === "abducte") {
            for (var j in card.card_group) {
              var group = card.card_group[j]
              if (group.item_name && group.item_name === '结案详情') {
                result.result = group.item_content
                //console.log(result.result)
                continue
              }
              if (group.desc && group.desc.indexOf('姓名') !== -1) {
                result.name = group.desc.split('：')[1]
                //console.log(result.name)
                continue
              }
              if (group.desc && group.desc.indexOf('年龄性别') !== -1) {
                result.age_gender = group.desc.split('：')[1]
                //console.log(result.age_gender)
                continue
              }
              if (group.desc && group.desc.indexOf('失踪地点') !== -1) {
                result.lost_addr = group.desc.split('：')[1]
                //console.log(result.lost_addr)
                continue
              }
              if (group.desc && group.desc.indexOf('失踪时间') !== -1) {
                result.lost_time = group.desc.split('：')[1]
                result.lost_timestamp = Date.parse(result.lost_time)
                //console.log(result.lost_time)
                continue
              }
              if (group.pics) {
                result.pics = group.pics
                //console.log(result.pics)
                continue
              }
              if (group.item_name && group.item_name === '详情') {
                result.lost_details = group.item_content
                //console.log(result.lost_details)
                continue
              }
            }
          } else if (card.card_id === "policeman") {
            result.policeman = {}
            for (var j in card.card_group) {
              var group = card.card_group[j]
              if (group.desc && group.desc.indexOf('姓名') !== -1) {
                result.policeman.name = group.desc.split('：')[1]
                //console.log(result.policeman.name)
                continue
              }
              if (group.desc && group.desc.indexOf('联系方式') !== -1) {
                result.policeman.tel = group.desc.split('：')[1]
                //console.log(result.policeman.tel)
                continue
              }
            }
          }
        }
      }
      // console.log(result)
      result.lost_id = parseInt('231038' + lostId)
      myClient.updateOne('lost', {lost_id: result.lost_id}, result, {upsert: true}).then(function(db_res) {
        console.log(db_res.result)
      }, function(db_err){
        console.log(db_err)
      })
      var index = parseInt(lostId)
      fetchLostChildren(index + 1)
      curId = index > curId ? index : curId
    } else {
      console.log("no new data......" + lostId)
      if (parseInt(lostId) < curId) {
        // 拉取历史数据时，每隔1秒调用请求一次
        setTimeout(function() {fetchLostChildren(parseInt(lostId) + 1)}, 1000)
      } else if (parseInt(lostId) < curId + 21) { //向前搜索20个，防止中间id不连续的情况        
        setTimeout(function() {fetchLostChildren(parseInt(lostId) + 1)}, 10000)
      } else { //lost_id意外越界——超过当前最新id的20个id后，停下来，隔一分钟发送请求接着从curId开始发送请求
        setTimeout(function() {fetchLostChildren(curId)}, 60000)
      }
    }
  })
}

var fetchLostChildrenResult = function() {
  myClient.find('lost', {result: {$exists: false}}).then(function(result){
    for (var i in result) {
      // console.log(result[i].lost_id)
      (function(index){
        setTimeout(function(){
          fetchLostData(result[index].lost_id)
        }, index*1000)
      })(i)
    }
  }, function(error){
    console.log(error)
  })
}

var fetchLostData = function (lostId) {
  var options = {
    method: 'GET',
    url: 'https://m.weibo.cn/api/container/getIndex?containerid=' + lostId,
    rejectUnauthorized: false,
    proxy: 'http://127.0.0.1:8087',
    json: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
      'Host': 'm.weibo.cn'
    }
  }
  request(options, function(err, res, body){
    if (err) {
      console.log(err)
      return
    }
    var result = {}
    //body = JSON.parse(body)
    if (body.ok === 1) {
      for (var i in body.cards) {
        var card = body.cards[i]
        if (card.card_type === 11) {
          if (card.card_id === "abducte") {
            for (var j in card.card_group) {
              var group = card.card_group[j]
              if (group.item_name && group.item_name === '结案详情') {
                result.result = group.item_content
                //console.log(result.result)
                continue
              }
              if (group.desc && group.desc.indexOf('姓名') !== -1) {
                result.name = group.desc.split('：')[1]
                //console.log(result.name)
                continue
              }
              if (group.desc && group.desc.indexOf('年龄性别') !== -1) {
                result.age_gender = group.desc.split('：')[1]
                //console.log(result.age_gender)
                continue
              }
              if (group.desc && group.desc.indexOf('失踪地点') !== -1) {
                result.lost_addr = group.desc.split('：')[1]
                //console.log(result.lost_addr)
                continue
              }
              if (group.desc && group.desc.indexOf('失踪时间') !== -1) {
                result.lost_time = group.desc.split('：')[1]
                result.lost_timestamp = Date.parse(result.lost_time)
                //console.log(result.lost_time)
                continue
              }
              if (group.pics) {
                result.pics = group.pics
                //console.log(result.pics)
                continue
              }
              if (group.item_name && group.item_name === '详情') {
                result.lost_details = group.item_content
                //console.log(result.lost_details)
                continue
              }
            }
          } else if (card.card_id === "policeman") {
            result.policeman = {}
            for (var j in card.card_group) {
              var group = card.card_group[j]
              if (group.desc && group.desc.indexOf('姓名') !== -1) {
                result.policeman.name = group.desc.split('：')[1]
                //console.log(result.policeman.name)
                continue
              }
              if (group.desc && group.desc.indexOf('联系方式') !== -1) {
                result.policeman.tel = group.desc.split('：')[1]
                //console.log(result.policeman.tel)
                continue
              }
            }
          }
        }
      }
      // console.log(result)
      result.lost_id = parseInt(lostId)
      myClient.updateOne('lost', {lost_id: result.lost_id}, result, {upsert: true}).then(function(db_res) {
        console.log(lostId + '..........' + db_res.result)
      }, function(db_err){
        console.log(db_err)
      })
    } 
  })
}


exports.fetchLostChildren = fetchLostChildren
exports.fetchLostChildrenResult = fetchLostChildrenResult