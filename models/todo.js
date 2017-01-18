var connection = require('../connection');
function Todo() {
    this.get = function (res) {
        connection.acquire(function (err,con) {
            con.query('select * from list',function (err,result) {
                con.release();
                res.send(result);
            });

        });

    };
    this.create = function (list,res) {
        var post  = {id: list.id, name:list.firstname,surname:list.lastname};
        connection.acquire(function (err,con) {
            con.query('insert into list set ?',post,function (err,result) {
                con.release();
                if(err)
                {
                    res.send({status: 1,message: ' creation failed'});
                }
                else {
                    res.send({status: 0,message: 'Created succesfully'});
                }


            });

        });

    };
    this.update = function (list,res) {
        connection.acquire(function (err,con) {
            con.query('update list set ? where  = ?',[list, list.id], function (err,result) {
                con.release();
                if(err)
                {
                    res.send({status: 1,message: 'Update failed'});

                }
                else
                {
                    res.send({status: 0,message:'Update Successfull'});
                }
            });

        });

    };
    this.delete = function (id,res) {
    connection.acquire(function (err,con) {
        con.query('delete from list where id = ?',[id],function (err,result) {
                con.release();
                if(err)
                {
                    console.log(id)
                    res.send({status:1 ,message: 'Delete failed'});
                }
                else
                {
                    res.send({status:0 ,message:'Successful'});
                }
            });
    });
    };
}
module.exports = new Todo();