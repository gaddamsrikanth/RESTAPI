// Modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mong = require('mongoose');
mong.Promise = require('bluebird');
var list = require('./models/listmongoose');
//mong.connect("mongodb://localhost:27017/db");
var morgan = require("morgan");
var jwt = require('jsonwebtoken');
var multer = require('multer');
//var file = require('./models/file');

// END modules

var app = express();
var server = require('http').Server(app);
var sql = require('./index');
var count = 0;

var storage = multer.diskStorage({
    destination : function (req,file,callback) {
        req.body.path = './upload/';
        callback(null,'./upload');
    },
    filename : function (req,file,callback) {
        console.log(file);
        req.body.file = file.originalname;
        callback(null,file.originalname)
    }
});
var upload = multer({storage : storage}).array('photo',5);

//middleware

app.set('secret', 'token1234567');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//end middleware


app.post('/upload',function (req,res) {
    upload(req,res,function (err) {
        if(err)
        {
            console.log(err);
        }
        var f = new file();
        f.filename = req.body.file;
        f.filepath = req.body.path+req.body.file;

        f.save(function (err,data) {
            if(err){
                res.send(err);
            }else{
                res.send(data)
            }
        });

    })

});

app.get('/download',function (req,res) {
    file.find({},function (err,data) {
        if(err){
            res.send(err);
        }else{
            res.sendFile(path.join(__dirname,data[data.length-1].filepath));
        }
    })

});
app.post('/search', function (req, res) {
    var l = new list();
    if (req.body.name == "") {

        res.send("Please enter name");
    }
    else if (req.body.surname == "") {
        res.send("Please Enter surname");

    }
    else if (req.body.username == "") {
        res.send("Please enter username");
    }
    else if (req.body.password == "") {
        res.send("Please enter password");
    }
    else {
        var id1 = 0 ;
        l.name = req.body.name;
        l.surname = req.body.surname;
        l.username = req.body.username;
        l.password = req.body.password;
        console.log(req.body);

        list.find(function (err,data) {
            console.log(data.length);
            if (err) {
                res.send(err);
            } else {
                if (data.length > 0) {
                    id1 = data.length + 1;
                } else {
                    id1 = 1;
                }
                l.user_id = data.length + 1;
                l.save(function (err,data) {
                    if(err)
                    {
                        res.send(err);
                    }
                    else
                    {
                        res.send('HELLO');
                    }
                });
            }
        });

    }
});

app.post('/req',function (req,res) {
    var l = new list();
    console.log("ABCD")
    if(req.body.name == "")
    {
        console.log("No Entry")
    }
    l.name = req.body.name;
    l.password = req.body.password;
    l.save(function (err,data) {
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send('HELLO');
        }
    });
})

app.get('/mongo/user/:id', function (req, res) {
    list.find({'username': req.query.username}, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});

app.get('/mongoose/fetch/:pageNo', function (req, res) {

        list.find(function (err, data) {
            if (err) {
                res.send(err);
            } else {
                if (data.length != 0) {
                    console.log(data);
                    res.send(data);
                }
                else {
                    console.log("end")
                    res.send({msg:"END"});
                }
            }
        }).skip(parseInt(req.params.pageNo) * 10).limit(10);
});


app.get('/mongoose/fet/:pageNo', function (req, res) {
    var perpage = 5;
    var pageNo = parseInt(req.params.pageNo) || 0;
    var total = 0;
    var totalpage = 0;
    list.find()
        .then(function (category) {
            console.log("******************");
            total = category.length;
            console.log(total);
            console.log("******************");
            console.log(Math.ceil(total/perpage));
            totalpage = Math.ceil(total/perpage);
            return list.find().skip(pageNo*perpage).limit(perpage);
        })
        .then(function (category) {
            // var data = { pageNo: pageNo, totalPage: totalpage, category: category};
            res.send(data);
        })
        .catch(function (err) {
            res(err);
        })
});

app.post('/mongo/del', function (req, res) {
    list.remove({'username': req.body.username}, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Successfully deleted");
        }
    })
});


app.post('/fetchd/', function (req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    sql.executeSql("SELECT * FROM users where username= '" + user + "' AND password= '"+ pass +"'" , function (err, data) {
        if (err) {
            console.log(err)
            return res.send({error: err});
        }
        else if(data.length == 1){

            res.send({resp : "Success"});
        }
        else{
            res.send({resp : "Failed"});
        }
        console.log(data);
    })
});

app.post('/user/', function (req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    sql.executeSql("SELECT * FROM users where username= '" + user + "'" , function (err, data) {
        if (err) {
            console.log(err)
            return res.send({error: err});
        }
        else if(data.length == 1){

            res.send(data);
        }
        else{
            res.send({resp : "Failed"});
        }
        console.log(data);
    })
});

app.post('/friends/', function (req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    var user_id = "(SELECT user_id from users where username = '"+req.body.username+"')"
    var query = "SELECT * FROM users WHERE user_id IN (SELECT if(user_one_id != "+user_id+",user_one_id,if(user_two_id != "+user_id+",user_two_id,false)) from relationship where user_one_id ="+user_id+"  OR user_two_id = "+user_id+" AND status = 1)"
    sql.executeSql(query , function (err, data) {
        if (err) {
            console.log(err)
            return res.send({error: err});
        }else{
            console.log(data)
            res.send(data);
        }
    })
});

app.post('/reg', function (req, res) {
    query = "select * from users where username = '" + req.body.username + "'";
    sql.executeSql(query, function (err, data) {
        if (err) {
            console.log(err)
            return res.send({error: err});
        } else if (data.length > 0) {
            console.log("1");
            res.send({resp : "Taken"});
        } else {
            query = "insert into users (name,username,password,locality) values('" + req.body.name + "','" + req.body.username + "','" + req.body.password + "','" +req.body.sality+"')";
            console.log(query);
            sql.executeSql(query, function (err, data) {
                if (err) {
                    return res.send({error: err});
                }
                return res.send({resp : "Success"});
                console.log("2");
            })
        }
    });
});


app.put('/test/:username', function (req, res) {
    sql.executeSql("update list set name='" + req.body.name + "' where username=" + req.params.username + "", function (err, data) {
        if (err) {
            return res.send({error: err});
        }
        return res.send({data: data});
    })
});

app.get('/test/rmv', function (req, res) {

    console.log("Received data: ", req.query);

    query = "delete from list where username='" + req.query.username + "'";
    console.log(query);
    sql.executeSql(query, function (err, data) {
        if (err) {
            return res.send({error: err});
        }
        return res.send({data: data});
    })
});
app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname, '/about.html'))
});

app.post('/loc', function (req, res) {
    query = "select * from users where username='" + req.body.username + "'";
    sql.executeSql(query, function (err, data) {
        if (err) {
            console.log(err)
            return res.send({error: err})
        }
        else {
            if (data.length > 0) {
                console.log("ABC")
                query = "update users set location='" + req.body.location + "'where username='"+req.body.username+"'";
                sql.executeSql(query,function (err,data) {
                    if(err){
                        console.log(err)
                        res.send(err)
                    }
                    else{
                        console.log(data)
                        res.send("Success")
                    }

                })

            }
        }
    });

});
app.post('/login',function (req,res) {
    list.find({"username" : req.body.username},function (err,data) {
        if(err){
            res.send(err);
        }
        else{

            if(data.length == 0)
            {
                res.send("User not found");
            }
            else
            {
                console.log(data[0].username);
                if(data[0].password = req.body.password){
                    var token = jwt.sign(data[0],app.get('secret'),{
                    expiresIn: '10m'
                    });
                    res.json({
                        success : true,
                        message : 'TOKENNNNNNNNNN!!!!!!',
                        token : token

                    });

                }
            }
        }
    });


});
app.get('/chk',function (req,res) {
    res.send("Api is running ");
});


//end routes


var server = app.listen(8085, function () {

    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);

})

