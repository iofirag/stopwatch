var connect = require('connect');
var serveStatic = require('serve-static');
// var cwd = process.cwd() = __dirname;
connect().use(serveStatic(__dirname+'/www')).listen(8080);
//connect().use(__dirname+'/www/index.html').listen(8080);
//console.log(process.cwd())
console.log('server listening on port 8080');