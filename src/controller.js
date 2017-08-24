
var handleTest = function(req, res){
  console.log('handler test')
  res.sendStatus(200)
}

exports.handleTest = handleTest