var express = require('express')
var request = require('request')
var app = express();

//app.set('port', (process.env.PORT || 5000))
app.set('port', (process.env.PORT || 80))
app.use(express.static(__dirname + '/'))

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})


app.use(function(req, res, next){
    var pattern = /\/webtools\/(.*)\/(websvcs\/.*)/;

        if(req.url.match(pattern)){
            host = 'http://' + req.url.match(pattern)[1] + ':8114'
            var db_path = req.url.match(pattern)[2]
            , db_url = [host, db_path].join('/');

            console.log('forward to ' + db_url)

            req.pipe(request[req.method.toLowerCase()](db_url)).pipe(res);
        }else{
            console.log('does not match')
            next();
        }
    }

);
