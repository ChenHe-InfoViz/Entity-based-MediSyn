var express = require('express');
var path = require('path');
var router = express.Router();
var http = require('http');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jquery')(window);
var concat = require('array-concat')

//mongodb
//var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

var testSchema = new mongoose.Schema({   
	_id: String, 
	children: Array,
	parent: String
})

var testMongo = mongoose.model('testmongo', testSchema);

testMongo.findByIdAndUpdate("b", {children: ["a", "b", "c"], parent: "dc"}, {upsert: true},
     function(err, doc){
      if(err) {
        console.log(err)
        res.json(500)
      }
     })
module.exports = router;
