/**
 * Created by lcom48 on 17/1/17.
 */
var sqlDB = require("mysql");
var settings = require("/connection");

exports.executeSql = function (sql,callback) {
    var conn = new sqlDB.createConnection(settings.dbConfig);
    conn.connect().then(function () {
        var req = new sqlDB.Request()

    })

}