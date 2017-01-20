// Modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mong = require('mongoose');
var list = require('./models/listmongoose');
mong.connect("mongodb://localhost:27017/list");
// END modules

var app = express();
var server = require('http').Server(app);
var sql = require('./index');


//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//mong.Promise = global.Promise;

//end middleware

var sess;
// define routes
app.post('/search',function (req,res) {
    var l = new list();

    l.name = req.body.name;
    l.surname = req.body.surname;
    l.username = req.body.username;
    l.password = req.body.password;

    console.log(req.body);

    l.save(function (err) {
        if(err){
            res.send(err);
        }else{
            res.send("user successfully registered!");
        }
    });
});
app.get('/mongo/user',function (req,res) {
    list.find({'username':req.query.username},function (err,data) {
        if(err){
            res.send(err);
        }else{
            res.send(data);
        }
    });
});

app.post('/mongo/del',function (req,res) {
   list.remove({'username' :req.body.username},function (err,data) {
       if(err){
           res.send(err);
       }
       else {
           res.send("Successfully deleted");
       }
   })
});
app.get('/fetch',function (req,res) {

    sql.executeSql("SELECT * FROM list where username='"+req.query.username+"'" ,function (err, data) {
      if(err){
          return res.send({error: err});
      }
      return res.send({data: data});
    })
});

/*app.post('/login', function (req, res) {
    if (!req.body) return res.sendStatus(400)
    res.send({message: 'welcome, ' + req.body.id})
});*/


app.post('/test', function(req, res) {

    query = "select * from list where username = '"+req.body.username+"'";
    sql.executeSql(query,function (err,data) {
       if(err){
           return res.send({error: err});
       }else if(data.length > 0){
           res.send({Message : "Username already taken!!"});
       }else{
           query = "insert into list (name,surname,username,password) values('"+ req.body.name +"','"+req.body.surname+"','"+req.body.username+"','"+req.body.password+"')";
           console.log(query);
           sql.executeSql(query, function (err, data) {
               if(err){
                   return res.send({error: err});
               }
               return res.send({data : data});
           })
       }
    });
});

app.put('/test/:username', function(req, res) {
    sql.executeSql("update list set name='"+req.body.name+"' where username="+ req.params.username +"", function (err, data) {
        if(err){
            return res.send({error: err});
        }
        return res.send({data : data});
    })
});

app.get('/test/rmv',function (req,res) {

    console.log("Received data: ", req.query);

    query = "delete from list where username='"+req.query.username+"'";
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

app.post('/login',function (req,res) {
    query = "select password from list where username='"+req.body.username+"'";
    console.log(query);
    sql.executeSql(query,function (err,data) {
        if(err){
            return res.send({error : err})
        }
        else
        {
            if(data[0].password == req.body.password)
            {

                console.log("Success");
                res.sendFile(path.join(__dirname,'/login.html'));
            }
        }
    });

});


//end routes

var server = app.listen(8085, function () {

    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);

})
