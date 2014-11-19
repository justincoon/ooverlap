//var mongo = require('mongodb');
var express = require('express');
var monk = require('monk');
//var db =  monk('localhost:27017/mydb');
var app = new express();

var databaseUrl = "mydb"; // "username:password@example.com/mydb"
var collections = ["users", "reports"]
var db = require("mongojs").connect(databaseUrl, collections);




app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
  db.driver.admin.listDatabases(function(e,dbs){
      res.json(dbs);
  });
});
app.get('/collections',function(req,res){
db.users.find({sex: "female"}, function(err, users) {
  if( err || !users) console.log("No female users found");
  else users.forEach( function(femaleUser) {
    console.log(femaleUser);
  } );
})
});
app.get('/collections/:name',function(req,res){
  var collection = db.get(req.params.name);
  collection.find({},{limit:20},function(e,docs){
    res.json(docs);
  })
});
app.listen(3000)

var db = require('monk')('localhost/mydb')
  , users = db.get('users')

users.index('name last');
users.insert({ name: 'Tobi', bigdata: {} });
users.find({ name: 'Loki' }, '-bigdata', function () {
  // exclude bigdata field
});

 db.close()

/*var databaseUrl = "mydb"; // "username:password@example.com/mydb"
var collections = ["users", "reports"]
var db = require("mongojs").connect(databaseUrl, collections);


db.users.find({sex: "female"}, function(err, users) {
  if( err || !users) console.log("No female users found");
  else users.forEach( function(femaleUser) {
    console.log(femaleUser);
  } );
});
db.users.save({email: "srirangan@gmail.com", password: "iLoveMongo", sex: "male"}, function(err, saved) {
  if( err || !saved ) console.log("User not saved");
  else console.log("User saved");
});

db.users.update({email: "srirangan@gmail.com"}, {$set: {password: "iReallyLoveMongo"}}, function(err, updated) {
  if( err || !updated ) console.log("User not updated");
  else console.log("User updated");
});*/
