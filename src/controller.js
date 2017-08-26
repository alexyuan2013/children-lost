var mongodb = require('mongodb')
var myClient = mongodb.MongoClient
var handleTest = function(req, res){
  console.log('handler test')
  res.sendStatus(200)
}

var handleLostChidren = function(req, res, count) {
  var result = {}
  result.errno = 0
  myClient.connect('mongodb://127.0.0.1:27017/lost-children', function(error, db){
    if (error) {
      result.errno = 500
      result.error = error
      res.send(result)
    }
    var coll_lost = db.collection('lost')
    coll_lost.find({}).sort({lost_id: -1}).limit(count).toArray(function(error, data){
      if (error) {
        result.errno = 500
        result.error = error
        db.close()
        res.send(result)
      }
      result.data = data
      db.close()
      res.json(result)
    })   
  })
}

var handleNotFoundChildren = function(req, res, count) {
  var result = {}
  result.errno = 0
  result.error = 'succ'
  myClient.connect('mongodb://127.0.0.1:27017/lost-children', function(error, db){
    if (error) {
      result.errno = 500
      result.error = error
      res.send(result)
    }
    var coll_lost = db.collection('lost')
    coll_lost.find({result: {$exists: false}}).sort({lost_id: -1}).limit(count).toArray(function(error, data){
      if (error) {
        result.errno = 500
        result.error = error
        db.close()
        res.send(result)
      }
      result.data = data
      db.close()
      res.json(result)
    })   
  })
}

exports.handleTest = handleTest
exports.handleLostChidren = handleLostChidren
exports.handleNotFoundChildren = handleNotFoundChildren