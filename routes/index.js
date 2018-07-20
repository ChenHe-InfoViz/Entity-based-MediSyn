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
var dtcCollection = require('./schema').Dtcbio;
// var userCollection = require('./schema').dtcbio;
var driverCollection;
//var logCollection;
var effectCollection = require('./schema').Effect;
var noteCollection = require('./schema').Note;
var entityCollection = require('./schema').Entity;
var hisSchema = require('./schema').hisSchema;
var logCollection = require('./schema').Log;
var User = require('./user').User;

var assert = require('assert');
// Connection URL

//const readline = require('readline');
//const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log(effectCollection)
  res.sendFile('index.html', { root: path.join(__dirname, '../public/javascripts') });
});

router.get("/tutorialindex", function(req, res, next) {
  res.sendFile('tutorialindex.html', { root: path.join(__dirname, '../public/javascripts') });
});

router.get("/tutorialhistory", function(req, res, next) {
  res.sendFile('tutorialhistory.html', { root: path.join(__dirname, '../public/javascripts') });
});

router.get('/alluserhis', function(req, res, next) {
  //console.log(effectCollection)
  res.sendFile('alluserhis.html', { root: path.join(__dirname, '../public/javascripts') });
});

String.prototype.capitalizeFirstLetter = function() {
 //if(this == null) return null;
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

router.post("/bio", function(req,res){
	var result = [];
  var obs = [];
  for(var i = 0; i < req.body.length; i++){
    var type = req.body[i].type.capitalizeFirstLetter()
    var ob = {};
    ob[type] = req.body[i].entity;
    obs.push(ob)
  }

  //console.log(obs)
  
	dtcCollection.find({$or: obs}).exec( function(err, docs){
		//console.log(docs)
		if(err) res.json(500)
		else{
			for(var i = 0; i < docs.length; i++){
        //console.log(docs[i])
        if(docs[i].Drug.length < 50)
				  result.push(docs[i])
			}
			res.json(result)
		}
	})
})

router.post("/effect", function(req,res){
  var result = [];
  var obs = [];
  for(var i = 0; i < req.body.length; i++){
    var type = req.body[i].type;
    var ob = {};
    ob[type] = req.body[i].entity;
    obs.push(ob)
  }

  effectCollection.find({$or: obs}).exec( function(err, docs){
    //console.log(data)
    if(err) res.json(500)
    else{
      // for(var i = 0; i < docs.length; i++){
      //   //console.log(docs[i])
      //   result.push(docs[i])
      // }
      res.json(docs)
    }
  })
})

router.get("/biodriver", function(req,res){
  var result = []
  driverCollection.findOne({dataset: "intogen"}, function(err, doc){
    //console.log(data)
    if(err) res.json(500)
    else{
      var re = $.grep(doc.data, function(e){
        return e.mutation == req.query.mutation && e.tumor == req.query.tumor.replace(/\%20/g, " ")
      })
      console.log(req.query.tumor + " " +  req.query.tumor.replace(/\%20/g, " ") + " "+ re)
      if(re.length > 0) result.push(re[0])
      res.json(result)
    }
  })
})

var insertOneDoc = function(doc, dbCollection){
  dbCollection.save( doc, function(err, result) {
    if(err) return console.log(err)
    // assert.equal(err, null);
    console.log("Inserted a document into the collection.");  
  })
}

router.post("/savenote", function(req, res){
  var note = req.body;
  note.entities = []
  
    note.up = [];
    note.delete = false;
    note.old = false;
    //console.log(note)
    note.down = [];
    var oneNote = new noteCollection(note);
    getEntitiesInNoteAndSave(oneNote, res)
    // oneNote.save(function (er) {
    //     if (er){console.log(er); return res.json(500)};
    //     return res.json({id: oneNote._id})
    //     // saved!
    // })
    //console.log(note + " " + err) 
  // })
  // res.json(204)
})

function getEntitiesInNoteAndSave(note, res){
  var entities = []
  //mark all entities;
  entityCollection.find({}).batchSize(2000).exec(function(err, data){
      if(err) return res.json(500)
      for(var i = 0; i < data.length; i++){
        if(!data[i].entity || data[i].entity.length > 50) continue;
        //var add = false;
        //var s = data[i].entity.replace(/\(/g, "\\\(").replace(/\)/g, "\\\)").replace(/\-/g, "\\\-");
        //console.log(s )
        
        if(checkEntityInNote(note.note, data[i])){
          entities.push({ entity: data[i].entity, type: data[i].type})
          if(note.public){
            entityCollection.findOneAndUpdate({entity: data[i].entity}, {$inc:{ note: 1 }}, function(er, doc){
              if(er) console.log(er)
            })
          }
        }
      }
      note.set({entities: entities})
      note.save(function (er) {
          if (er){console.log(er); return res.json(500)};
          return res.json({id: note._id})
          // saved!
      })
  })
}

function checkEntityInNote(note, entity){
  var result = note.toLowerCase().indexOf(entity.entity.toLowerCase())//(new RegExp(s, "i"));
      //console.log(result)
  if(result < 0 && entity.type == "mutation" && entity.entity.indexOf("(") > -1){
    var s = entity.entity.split(/\(|\)/g)
    result = note.toLowerCase().indexOf(s[1].toLowerCase())
  }
  if(result > -1) return true;
  return false;
}

router.post("/removenote", function(req, res){
  noteCollection.findById(req.query.id).exec(function(err, doc){
    if(err) return res.json(500);
    if(doc.public){
      var entities = doc.entities;
      for(var i = 0; i < entities.length; i++)
        entityCollection.findOneAndUpdate({entity: entities[i].entity}, { $inc:{ note: -1 } }, function(er, doc){
          if(er) console.log(er)
        })
    }
    doc.set({delete: true})
    doc.save(function (er) {
        if (er){console.log(er); return res.json(500)};
        return res.json(204)
        // saved!
    })
  })
})

router.post("/updatenote", function(req, res){
  var newNote = req.body.note;
  var newPub = req.body.public;
  var newdoc;
  noteCollection.findById(req.body.oldid).exec(function(err, doc){
    if(err) return res.json(500);
    if(newNote == doc.note){
      doc.set({public: newPub})
      doc.save(function(er){
        if(er) console.log(er)
      })
      res.json(204)
    }
    else {
      if(doc.public){
        var entities = doc.entities;
        for(var i = 0; i < entities.length; i++)
          entityCollection.findOneAndUpdate({entity: entities[i].entity}, { $inc:{ note: -1 } }, function(er, doc){
            if(er) console.log(er)
          })
      }
      // doc.set({old: f})
      doc.oldNotes.push(doc.note)
      doc.updateTime.push(req.body.updateTime)
      doc.set({note: newNote, public: newPub})
      //newDoc = new noteCollection({old: false, oldid: req.body.oldid, time: req.body.updateTime, username: req.body.username, 
        //note: newNote, public: newPub, up: doc.up, down: doc.down, delete: false})
      getEntitiesInNoteAndSave(doc, res)
    }
  })
})

// function updateNote(entities){
//   noteCollection.update({_id: req.body.id}, {$set: {}}, function(err, doc){

//   })
// }

router.post("/note", function(req, res){
  var ent = req.body; 
  var notes = []

  if(ent.username == "test"){
    if(ent.hasOwnProperty("entity")){
      noteCollection.find({ $and: [ {"entities.entity": ent.entity}, {delete: false}, {old: false}
      ]}).sort({time: -1}).exec(function (err, docs) {
          if(err) return res.json(500);
          //console.log(docs)
          notes = docs;   
          res.json(notes);
      })
    }
    else{
      noteCollection.find({ $and: [ {delete: false}, {old: false}
      ]}).sort({time: -1}).exec(function (err, docs) {
          if(err) return res.json(500);
          //console.log(docs)
          notes = docs;   
          res.json(notes);
      })
    }
  }
  else{

    if(ent.hasOwnProperty("entity")){
      noteCollection.find({ $and: [
      {"entities.entity": ent.entity},  {username: ent.username}, {delete: false}, {old: false}
      ]}).sort({time: -1}).exec(function (err, docs) {
          if(err) return res.json(500);
          //console.log(docs)
          notes = docs;   
          noteCollection.find({ $and: [
          {"entities.entity": ent.entity}, {public: true}, {username: {$ne: ent.username} }, {delete: false}, {old: false}
          ]}).sort({time: -1}).exec(function (err, docs) {
            if(err) return res.json(500);
            //console.log(docs)
            notes = notes.concat(docs);    
            res.json(notes);
        })
      })
    }
    
    else{
      noteCollection.find({$and: [{username: ent.username}, {delete: false}, {old: false}]}).sort({time: -1}).exec(function (err, docs) {
        if(err){
          console.log(err)
          return res.json(500);
        }
        notes = docs;
        //console.log(docs[0].note + " " + docs[0].entities[0])
        noteCollection.find({ $and: [{public: true}, {username: {$ne: ent.username} }, {delete: false}, {old: false}]}).sort({ time: -1}).exec(function (er, data) {
          if(er){
            console.log(er)
            return res.json(500);
          }
          notes = notes.concat(data);    
          //console.log(notes[1].entities[0])
          res.json(notes);
        });
      });
    }
  }
  
  // else if(ent.hasOwnProperty("username"))
  // noteCollection.find({"username": ent.username} ).sort({time: -1}).exec(function (err, docs) {
  //     if(err) return res.json(500);
  //     console.log(docs)
  //     //notes = docs;    
  //     res.json(docs);
  // })
  
})

router.post("/getnotes", function(req, res){
  var username = req.body.username;
  var ids = req.body.ids;
  if(username == "")
  noteCollection.find({_id: {$in: ids}})
    .sort({time: -1}).exec(function(err, data){
      if(err) return res.json(500)
      if(!data.length) return res.json({message: "Not accessible."})
      return res.json(data)
  })
  else if(username == "test"){
    noteCollection.find({ $and: [{_id: {$in: ids}}, {delete: false}, {old: false}]})
    .sort({time: -1}).exec(function(err, data){
      if(err) return res.json(500)
      if(!data.length) return res.json({message: "Not accessible."})
      return res.json(data)
    })
  }
  else noteCollection.find({ $and: [{_id: {$in: ids}}, {$or: [{public: true}, {username: username}]}, {delete: false}, {old: false}]})
  .sort({time: -1}).exec(function(err, data){
    if(err) return res.json(500)
    if(!data.length) return res.json({message: "Not accessible."})
    return res.json(data)
  })
})

router.post("/entitynote", function(req, res){
  var userEntityNote = []
  noteCollection.find({ $and: [{"username": req.body.username}, {public: false}, {delete: false}, {old: false}]}).exec(function (err, docs) {
      if(err) return res.json(500);
      for(var i = 0; i < docs.length; i++){
        for(var j = 0; j < docs[i].entities.length; j++){
          var re = $.grep(userEntityNote, function(e){
            return e.entity == docs[i].entities[j].entity
          })
          if(re.length > 0) re[0].count++;
          else userEntityNote.push({entity: docs[i].entities[j].entity, count: 1})
        }
      }
  })
  noteCollection.find({ $and: [{public: true}, {delete: false}, {old: false}]}).exec(function (err, docs) {
      if(err) return res.json(500);
      for(var i = 0; i < docs.length; i++){
        for(var j = 0; j < docs[i].entities.length; j++){
          var re = $.grep(userEntityNote, function(e){
            return e.entity == docs[i].entities[j].entity
          })
          if(re.length > 0) re[0].count++;
          else userEntityNote.push({entity: docs[i].entities[j].entity, count: 1})
        }
      }
  })
  entityCollection.find({}).batchSize(2000).sort({entity: 1}).exec(function (err, docs) {
    //console.log(docs)
      if(err) console.log(err)
      for(var i = 0; i < userEntityNote.length; i++){
        var re = $.grep(docs, function(e){
          return e.entity == userEntityNote[i].entity
        })
        //re[0].toObject();
        if(re.length > 0)
          re[0].noteCount = userEntityNote[i].count;
        else console.log(userEntityNote[i].entity)
      }
      // for(var i = 0; i < docs.length; i++){
      //   if(docs[i].hasOwnProperty("noteCount"))
      //     console.log(docs[i])
      // }
      //var entities = docs;
      //console.log(docs)
      res.json(docs);
  });
})

router.get('/history', function(req, res) {
    return res.sendFile('history.html', { root: path.join(__dirname, '../public/javascripts') });
});

router.get('/retrieveallhis', function(req, res) {
    return res.sendFile('allhis.html', { root: path.join(__dirname, '../public/javascripts') });
});

router.get('/hismap', function(req, res) {
    return res.sendFile('hismap.html', { root: path.join(__dirname, '../public/javascripts') });
});

router.get('/allnotehis', function(req, res) {
  try{
    var twoDArray = [];
    var lengthCount;
    noteCollection.find({}).sort({time: 1}).exec(function(err, docs){
      lengthCount = docs.length;
      for(var i = 0; i < docs.length; i++){
        var hisObj = new getHistoryOfANote(docs[i].username, docs[i].time, getAllHisTree, false);
        //hisObj.getNode(docs[i].time)
      }
    })
  }
  catch(e){console.log(e)}

  function getAllHisTree(array, obj = {}){
    if(obj.hasOwnProperty("message")){
      if(obj.message == 500) return res.json(500)
      else return res.json(obj)
    }
  //console.log(array)
  //console.log(array.length)
    //array.sort(function(a,b) {return (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0);} ); 
    twoDArray.push(array);
    lengthCount--;
    if(lengthCount == 0){
      lengthCount--;
      twoDArray.sort(function(a,b) {return (a[a.length-1]._id > b[b.length-1]._id) ? -1 : ((b[b.length-1]._id > a[a.length-1]._id) ? 1 : 0);} ); 
      //console.log(twoDArray)
      return res.json(twoDArray);
    }
    return 0;
  }
});

function getHistoryOfANote(username, id, callback, one = true){
  this.hisModel = mongoose.model(username, hisSchema); 
  this.noteId = id;  
  this.callback = callback;
  this.oneNote = one;
  this.getNode(this.noteId);
}

getHistoryOfANote.prototype.getNode = function(id){
  //if(!id) return getAllRelatedNodes(array.root.children)
  var self = this;
  var coActions = ["add", "select", "deselect", "noteSelect"]; 

  this.hisModel.findById(id).exec(function(err, doc){
      if(err) self.callback({message: 500})//return res.json(500)
      if(doc) {
        if(!doc.parent || (self.oneNote && coActions.indexOf(doc.action) > -1)){
          var array = [];
          array.push(doc)
          if(doc._id != self.noteId)
            self.getAllRelatedNodes(array[0].children, array)
          else self.callback(array);
        }
        else 
          self.getNode(doc.parent)
      }
      else //return res.json({message: "Interaction history not available yet."})
        self.callback({message: "Interaction history not available yet."})
  })
}

getHistoryOfANote.prototype.getAllRelatedNodes = function(idList, array){
  //total += node.children.length;
  var self = this;
  this.hisModel.find({_id: {$in: idList}}).exec(function(err, docs){
    if(err) console.log(err)
    array = array.concat(docs)
    var list = []
    for(var i = 0; i < docs.length; i++){
      if(docs[i]._id != self.noteId)
        list = list.concat(docs[i].children)
      else break;
    }
    if(list.length){
      self.getAllRelatedNodes(list, array)
    }
    else {
      //console.log(array)
      array.sort(function(a,b) {return (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0);} ); 
      var re = $.grep(array, function(e){
        return e._id == self.noteId
      })
      array.splice(array.indexOf(re[0]) + 1)
      self.callback(array);
      //return res.json(array)
    }
  })
}

router.post('/gethistree', function(req, res){
  try{
    var hisObj = new getHistoryOfANote(req.query.username, req.query.id, getHisTreeReturn)
    //hisObj.getNode(req.query.id);

    function getHisTreeReturn(array, obj = {}){
      if(obj.hasOwnProperty("message")){
        if(obj.message == 500) return res.json(500)
        else return res.json(obj)
      }
      return res.json(array)
    }
  }
  catch(e){console.log(e)}
})

router.post("/upnote", function(req,res){
  noteCollection.findById(req.query.id, function(err, doc){
    if(err) {
      console.log(err);
      return res.json(500)
    }
    if(doc.up.indexOf(req.query.username) > -1)
      doc.up.splice(doc.up.indexOf(req.query.username), 1)
    else doc.up.push(req.query.username)
    doc.save(function(er){
      if(er){
        console.log(er)
        return res.json(500)
      }
      return res.json(204)
    })
  })
})

router.post("/downnote", function(req,res){
  noteCollection.findById(req.query.id, function(err, doc){
    if(err) {
      console.log(err);
      return res.json(500)
    }
    if(doc.down.indexOf(req.query.username) > -1)
      doc.down.splice(doc.up.indexOf(req.query.username), 1)
    else doc.down.push(req.query.username)
    doc.save(function(er){
      if(er){
        console.log(er)
        return res.json(500)
      }
      return res.json(204)
    })
  })
})

router.post("/savehistory", function(req, res){
  //console.log(req.body);
  try{
  var userHis = mongoose.model(req.body.username, hisSchema);
  for(var i = 0; i < req.body.history.length; i++){
    var id = req.body.history[i]._id;
    delete req.body.history[i]._id;
    delete req.body.history[i].__v;
    userHis.findByIdAndUpdate(id, req.body.history[i], {upsert: true},
     function(err, doc){
      if(err) {
        console.log(err)
        res.json(500)
      }
     })
  }
  res.json(204)
  // userHis.insertMany(req.body.history, {ordered: false}, function(err, docs) {
  //   if(err) console.log(err)
  //   return res.json(204)
  
  // });
  }
  catch(e){
    console.log(e)
  }
})

router.post("/alluserhis", function(req, res){
  var nameArray = ["sarang", "malani", "pgautam", "mamun", "annac", "vpietiai", "howareyou", "jzmietti", "bulanova", "ashwinikumar", "jaiswalok", "jsaad", "guru", "minxia"];
  
  var result = []; //{username:, interactions:[]}
  var count = nameArray.length;
  nameArray.forEach((param, i) => {
    var userHis = mongoose.model(param, hisSchema);
    userHis.find({}).batchSize(3000).sort({_id: 1}).exec(function(err, docs){
      console.log(param)
      //console.log(docs)
      if(err)
        res.json(500)
      var interactions = []
      var temp = [];
      //console.log(userHis.collection.name)

      for(var j = 0; j < docs.length; j++){
        if(docs[j].parent == null){
          if(temp.length > 0){
            interactions.push(temp)
            temp = [];
            //temp.push(docs[j])
          }
        }
        temp.push(docs[j])
      }
      if(temp.length > 0){
        interactions.push(temp)
        temp = [];
        //temp.push(docs[j])
      }
      if(interactions.length > 0)
        result.push({username: param, index: (nameArray.indexOf(param) + 1), interactions: interactions})
      count--;
      if(count == 0){
        count--;
        //console.log(result)
        res.json(result)
      }
    })
  })

})

function diffSeconds(start, end) {
  //time format: 2018.02.27_09:22:17:300
    start = start.split("_");
    start = start[1].split(":")
    end = end.split("_")
    end = end[1].split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], start[2], start[3]);
    var endDate = new Date(0, 0, 0, end[0], end[1], end[2], end[3]);
    var diff = endDate.getTime() - startDate.getTime();
    var seconds = Math.round(diff / 1000);
    
    return seconds;
}

router.get("/getnotesforrate", function(req, res){
  var notesArray = []
  //var usernames = ["malani", "pgautam", "mamun", "annac", "vpietiai", "howareyou"];
  //var usernames = ["jzmietti", "bulanova", "ashwinikumar", "jaiswalok", "jsaad", "guru", "minxia"];
  var usernames = ["sarang"];

  User.find({username: {$in: usernames}}, function(err, docs){
    if(err) console.log(err)
    for(var i = 0; i < docs.length; i++){
      for(var j = 0; j < docs[i].tasks.length; j++){
        var temp = {};
        temp.time = docs[i].tasks[j].time;
        temp.text = docs[i].tasks[j].task;
        temp.username = docs[i].username;
        temp.type = "task"
        notesArray.push(temp)
      }
    }
    //console.log(notesArray)

    noteCollection.find({username: {$in: usernames}}, function(err1, docs1){
      if(err1) console.log(err1)
      for(var i = 0; i < docs1.length; i++){
        var text = docs1[i].note.replace(/\n/g, "\t");
        notesArray.push({username: docs1[i].username, time: docs1[i].time, type: "note", text: text})
      }
      //var array = docs.map(obj=>obj.time + "," + obj.note)
      notesArray.sort(function(a,b) {return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0);} )
      for(var i = 0; i < notesArray.length; i++){
        if(notesArray[i].type == "note" && i > 0)
          notesArray[i].cost = diffSeconds(notesArray[i-1].time, notesArray[i].time)
        else notesArray[i].cost = 0;
      }
      res.json(notesArray)
      //console.log(notesArray)
    })
  })
})

router.post("/savelog", function(req,res){
  //console.log(req.body)
  if(req.body.length > 0){
    logCollection.insertMany(req.body, function(error, docs) {
      if(error) console.log(error)
      res.json(204)
    });
  }
})


module.exports = router;
