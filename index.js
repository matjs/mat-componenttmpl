var path = require('path')
var fs = require('fs')
var Stream = require('stream')
var dirname   = path.dirname


function cobody(stream) {
  return function(cb){
    var buffers = []
    stream.on('data', function(chunk){
      buffers.push(chunk)
    })
    stream.on('end', function(){
      cb(null, Buffer.concat(buffers).toString('utf-8'))
    })
  }
}

var combineTmpl = function(config){

  return function *(next){

    yield next

    var ctx = this
    var str = ctx.body
    var srcPath = dirname(ctx.path)
    var reg = /@TEMPLATE\|(.*?)\|TEMPLATE@/g

    if (str instanceof Stream) {
      str = yield cobody(str)
    }else{
      str = str.toString()
    }

    //发现有html打包的就替换
    if (reg.test(str)) {
      str = str.replace(reg, function($1, $2) {
        var reg = /Brix\.absoluteFilePath\(.*(?:'|")(.*)?(?:'|")\)/g
        var result = reg.exec($2)
        if (result) {
          var fileName = result[1]
          var html = fs.readFileSync(path.join('./', srcPath, fileName)).toString()
          html = html.replace(/>\s*?</g, '><') //
            .replace(/\n+/g, '') //
            .replace(/\r+/g, '') //
            .replace(/\s{2,}/g, ' ') //
            .replace(/<!\-\-.*?\-\->/g, '').replace(/"/g, '\\"')
          return html
        }
        return ''
      })
    }
    ctx.body = str
  }

}

module.exports = combineTmpl