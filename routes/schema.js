var mongoose = require('mongoose');

var bioSchema = new mongoose.Schema({   
	"Compound ID": String, 
	Drug: String,
	Mutation: String, 
	"Target Pref Name": String,
	"Target ID": String, 
	"Target Organism" : String,
	"Uniprot ID": String,
	bios: [{
		"PubMed ID": String,
		"Standard Type": String,
		"Standard Relation": String,
		"Standard Value": Number,
		"Standard Units": String,
		"Endpoint Mode of Action": String,
		"Assay Format": String,
		"Assay Type": String,
		"Assay Subtype": String,
		"Inhibitor Type": String,
		"Detection Technology": String,
		"Compound Concentration Value": String,
		"Compound Concentration Units": String,
		"Substrate Type": String,
		"Substrate Type Standard Relation": String,
		"Substrate Type Standard Value": String,
		"Substrate Type Standard Units": String,
		"Assay Cell Type": String,
		"Assay Description": String,
	}],
	"med": Number,
	"potencyState": String
});

bioSchema.index({Mutation: 1, Drug: 1 }); // schema level


var effectSchema = new mongoose.Schema({
	drug: String,
	mutation: String,
	tumor: String,
	value: {
		"effect": String,
		evidence: String,
		source: String,
		dataset: String
	}
})
effectSchema.index({mutation: 1, drug: 1, tumor: 1 }); // schema level


var noteSchema = new mongoose.Schema({
	username: String,
	time: String,
	updateTime: Array,
	"note": String,
	entities: [{
		entity: {type: String},
		"type": {type: String},
		_id: {type: String}
	}],
	up: Array,
	delete: Boolean,
	down: Array,
	public: Boolean,
	old: Boolean,
	oldNotes: Array
})

var entitySchema = new mongoose.Schema({
	_id: {type: String},
	"entity": {type: String},
	"type": {type: String},
	"note": {type: Number},
	"noteCount": {type: Number},
}, { collection: 'entities' })

var historySchema = new mongoose.Schema({
	action: {type: String, required: true},
	_id: {type: String, required: true, unique: true, index: true},
	parent: {type: String},
	children: Array,
	selectedEntities: [{
		entity: {type: String},
		"type": {type: String},
		_id: {type: String},
	}],
	noteids: Array,
	// index: {type: Number, required: true}
}, {strict: false})

var logSchema = new mongoose.Schema({
	_id: {type: String, required: true},
	"type": {type: String},
	noteTime: {type: String},
	username: {type: String, required: true}
}, {strict: false})

var Dtcbio = mongoose.model('document', bioSchema);
var Effect = mongoose.model('effect', effectSchema);
var Note = mongoose.model('note', noteSchema);
var Entity = mongoose.model('entity', entitySchema);
var Log = mongoose.model('log', logSchema);


module.exports = {
	hisSchema: historySchema,
	Dtcbio: Dtcbio,
	Effect: Effect,
	Note: Note,
	Entity: Entity,
	Log: Log
}

