/**
 * Created by lcom48 on 17/1/17.
 */
var mysql = require('mysql');

function Connection()
{
    this.pool = null;
    this.init = function () {
        this.pool = mysql.createPool(
            {
                connectionLimit : 10,
                host: 'localhost',
                user: 'abcd',
                password: 'abcd',
                database: 'test'

            }
        );

    };
    this.acquire = function (callback) {
        this.pool.getConnection(function (err,connection) {
            callback(err,connection);

        });

    };
}
module.exports = new Connection();