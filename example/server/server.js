var express = require('express')
var app = express()
app.use(express.static(__dirname + '/../'))
app.listen(8001)
console.log('To preview, go to localhost:8001')
