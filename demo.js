// Modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

// END modules

var app = express();
var server = require('http').Server(app);
var sql = require('./index');


//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//end middleware


// define routes
app.get('/',function (req,res) {

    sql.executeSql("SELECT * FROM list", function (err, data) {
      if(err){
          return res.send({error: err});
      }
      return res.send({data: data});
    })
});

app.post('/login', function (req, res) {
    if (!req.body) return res.sendStatus(400)
    res.send({message: 'welcome, ' + req.body.id})
});


app.post('/test', function(req, res) {
    query = "insert into list (id,name,surname) values("+req.body.id+",'"+ req.body.name +"','"+req.body.surname+"')";
    console.log(query);
    sql.executeSql(query, function (err, data) {
        if(err){
            return res.send({error: err});
        }
        return res.send({data : data});
    })
});

app.put('/test/:id', function(req, res) {
    sql.executeSql("update list set name='"+req.body.name+"' where id="+ req.params.id +"", function (err, data) {
        if(err){
            return res.send({error: err});
        }
        return res.send({data : data});
    })
});

app.delete('/test/rmv',function (req,res) {

    console.log("Received data: ", req.query);

    query = "delete from list where id='"+req.query.id+"'";
    console.log(query);
    sql.executeSql(query,function (err,data) {
        if(err){
            return res.send({error: err});
        }
        return res.send({data : data});
    })
});
app.get('/about',function(req,res){
    res.sendFile(path.join(__dirname,'/about.html'))
});


//end routes

var server = app.listen(8085, function () {

    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);

})
