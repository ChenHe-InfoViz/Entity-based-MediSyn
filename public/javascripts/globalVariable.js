var coActions = ["add", "select", "deselect", "noteSelect"]; 

// var changeBarData = {} //drug, type, value
var username = "";

var mutationList = []; //available mutation, drug, tumor entities
var tumorList = [];
var drugList = [];
var driverState = [];

// var disTumors = [];
// var disDrugs = [];
// var tumorRow = [];
// var colMuTu = [];
//var curCols = [];
//var selectedEntities = [];
var selectedData = []
var selectedDriver = []
var historyWindows = [];
var hoverTimeBegin = 0;
var gloDiv = "";

//var currentLeafId = null;
// var entityList = [];

//var mutationSearchMatch = []; //{mutation:, search:} e.g. mutation KIT(V559D), but search by KIT(V559D, T670I)
// var DTCList = [], retrivedMutationDTC = []; //avoid repeated retrival
var mutationWaitingList = []
// var urlPrefix = "http://localhost:28017/test/documents/?"

// var activeMutation = []; // current active mutations, {mutation: , color: index}
// var currentActiveMutation = [];
var mutationRange = []; //array indocator
// var colorQueue = [0,1,2,3,4,5,6,7,8,9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
var mutationDrug = []; //store mutation drug relations {drug: , mutation:, effect: , evidence, source}, it contains all mutations from CGI
// var dataRow = [];
var listWidth = 235;
// var bioactivity = [];//{Compound Name, Standard inchi key, Uniprot ID, Target Pref Name, Gene Name, Mutation information, PubMed ID
					 //End Point Standard Type, End Point Standard Relation, End Point Standard Value, End Point Standard Units, Endpoint Mode of Action,
					 //Assay Format, Assay Type}
// var curTumors = []; // {tumor, count}
// var tumorMutation = [];
var notesArray = []
var noteFilterEntity = {}

var statistics = {
	maxTotal: 0,
	minTotal: 0
}

var visObj = {colMuTu: [], disTumors: [], dataRow: [], selectedEntities: [], scrollDis: {scrollbarLength: 0, brushWidth: 0, linearScale:{}}};

// var evidenceLevel = {
// 	 "NCCN guidelines": .96, "FDA guidelines": .96, "European LeukemiaNet guidelines": .96, "CPIC guidelines": .96, "NCCN/CAP guidelines": .96,
// 	 "Late trials": .6, "Early trials": .45, "Early Trials": .45, "Clinical trial": .45, "Case report": .3, "Pre-clinical": .18
// }

var driverRects = {"known": "#ff9900","predicted driver": "#f9ba5b", "predicted passenger": "#999", "unknown": "#bbb"}

var evidenceIndex = {
	 "Guidelines": 0, "NCCN guidelines": 0, "FDA guidelines": 0, "FDA-approved": 0, "FDA": 0, "European LeukemiaNet guidelines": 0, "CPIC guidelines": 0, "NCCN/CAP guidelines": 0,
	 "Late trials": 1, "late trials": 1, "Early trials": 2, "Early Trials": 2, "early trials": 2, "Clinical trial": 2, "Case report": 3, "case report": 3, "Pre-clinical": 4, "pre-clinical": 4,
	 "1": 0, "2A": 0, "2B": 1, "3A": 2, "3B": 3, "4": 4
}

//var selectedEntities = []

// var evidenceIndex = {}

var historyLayout = "context";
var hisStruc = [];
var curLeafId = "";

var evidenceRange = [.1, .96];
var hisVar; //historyVariables

var potencyLevel = {"highly potent":.5, "potent": 1.5, "weakly potent": 2.5, "inactive": 3.5}
var potencyRange = [0, 4]

visObj.dataset = {cgi: true, oncokb: true, synapse: true, dtc: true, cosmic: true, civic: true}
var driverSet = {intogen: true, docm: true, clinvar: true, biomarker: true, literature: true}

var activeMutationRange = [0, 0];

var effectControllerState = {Responsive: true, Resistant: true, "No Responsive": true, "Increased Toxicity": true} // same as checkbox value and biomarker dataset

var hoverTimeCounter = [0, 0];

var interactionHistory = [];
var showInteractionHistory = []
