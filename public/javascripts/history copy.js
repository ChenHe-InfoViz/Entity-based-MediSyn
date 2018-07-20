//branch at "add", "select", "deselect"
var coActions = ["add", "select", "deselect", "noteSelect"];    
//var actions = ["select", "deselect", "add", "noteSelect", "detail", "noteDis", "pivot", "pub", "allNote", "viewHis", "writeNote", "editNote", "dataset"]
var actions = ["select", "deselect", "add", "noteSelect", "detail", "noteDis", "pivot"]
//var actionCount = {"select": 0, "deselect": 0, "add": 0, "noteSelect": 0, "detail": 0, "noteDis", "pivot", "allNote", "viewHis", "writeNote", "pub"}
//context-aware interaction tree generation

//how to judge when to start a new tree?

//deselect always branches at selection actions
function deselectAction(entity){
	var his = {
		action: "deselect", 
        _id: getFormatedTime(),
        entity: entity.entity,
        type: entity.type,
        parent: curSelectionAction,
        children: [],
        //selectedEntities: visObj.selectedEntities.slice(0),
        dataset: Object.assign({}, visObj.dataset),
        //combine: false
    }

    curSelectionAction.children.push(his)
    interactionHistory.push(his)
    curSelectionAction = his;
    possibleAddParent = his;
    if(visObj.selectedEntities.length == 0) newStart = true;

    // //combine multiple selection and deselection

}
var newStart = false;
var curNoteAction = {}
var curSelectionAction = {}

function noteSelectAction(entity){
    //var relatedActions = {"noteDis", "allNote"}
    var iAction = interactionHistory[interactionHistory.length - 1];
    var his = {
        action: "noteSelect", 
        _id: getFormatedTime(),
        entity: entity.entity,
        type: entity.type,
        note: ,//note id
        //selectedEntities: visObj.selectedEntities.slice(0),
        parent: curNoteAction,
        children: [],
        //combine: false,
        dataset: Object.assign({}, visObj.dataset)
    }

    curNoteAction.children.push(his);
    interactionHistory.push(his)
    curSelectionAction = his;
    possibleAddParent = his;

}

var possibleAddParent = {}
//branch at select, deselect, noteselection, add, detail, notedis, pivot
//if(add is not related to detail or notedis, or pivot entity), skip
function addAction(entity){
    var iAction = possibleAddParent;
	var his = {
        action: "add", 
        _id: getFormatedTime(),
        entity: entity.entity,
        type: entity.type,
        //selectedEntities: visObj.selectedEntities.slice(0),
        parent: null,
        children: [],
        //combine: false,
        dataset: Object.assign({}, visObj.dataset)
    }
    for(; iAction != null; iAction = iAction.parent){
        if(actions.indexOf(iAction.action) < 0) continue;
    	if(coActions.indexOf(iAction.action) > -1) break;
        if(iAction.action == "detail" && iAction[entity.type] == entity.entity)
			break;
		if((iAction.action == "nodeDis" || iAction.action == "pivot") && iAction.entity == his.entity)
			break;
    }
    
	his.parent = iAction;
	iAction.children.push(his);
    
    interactionHistory.push(his)
    curSelectionAction = his;
    possibleAddParent = his;
}

function selectAction(entity){
	//var iAction = curSelectionAction;
	var his = {
        action: "select", 
        _id: getFormatedTime(),
        entity: entity.entity,
        type: entity.type,
        //selectedEntities: visObj.selectedEntities.slice(0),
        parent: curSelectionAction,
        children: [],
        //combine: false,
        dataset: Object.assign({}, visObj.dataset)
    }
	
    curSelectionAction.children.push(his)
    interactionHistory.push(his)
    curSelectionAction = his;
    possibleAddParent = his;

}

//branch at select, deselect, add, noteSelect, detail, notedis, pivot
//if(pivot is not related to detail or notedis entity), skip
function pivotAction(entity){
	var omit = false;
	var his = {
        action: "pivot", 
        _id: getFormatedTime(),
        entity: entity.entity,
        type: entity.type,
        //selectedEntities: visObj.selectedEntities.slice(0),
        parent: null,
        children: [],
        dataset: Object.assign({}, visObj.dataset)
    }

    var iAction = possibleAddParent;
    for(;iAction != null; iAction = iAction.parent){
        if(actions.indexOf(iAction.action) < 0) continue;
		if(iAction.action == "detail" && iAction[his.type] == his.entity)
			break;
		if(iAction.action == "pivot" && iAction.entity == his.entity){
			omit = true;
			break;
		}
        if(iAction.action == "noteDis" && iAction.entity == his.entity)
            break;
		if(coActions.indexOf(iAction.action) > -1)
			break;
    }
    if(!omit){
    	his.parent = iAction;
	    iAction.children.push(his);
	    interactionHistory.push(his);
        possibleAddParent = his;
    }

}

var curDetail = {}
//branch at select, deselect, add, noteSelect, pivot, notedis, detail
//if(detail is not related to pivot or notedis entity), skip
function detailAction(entity){
	var iAction = possibleAddParent;
	var his = {
        action: "detail", 
        _id: getFormatedTime(),
        drug:,
        mutation:,
        tumor:,
        dataset:,
        parent: null,
        children: [],
    }
    var omit = false;
    for(;iAction != null; iAction = iAction.parent){
        if(actions.indexOf(iAction.action) < 0) continue;
		if(iAction.action == "detail" && iAction.drug == his.drug && iAction.mutation == his.mutation && iAction.tumor == his.tumor && iAction.dataset == his.dataset){
            omit = true;
			break;
		}
		if(iAction.action == "noteDis" && iAction.entity == his[iAction.type])
			break;
		else if(iAction.action == "pivot" && iAction.entity == his[iAction.type]){
			break;
		}
		else if(coActions.indexOf(iAction.action) > -1)
			break;
    }
    if(!omit){
        curDetail = his;
    	his.parent = iAction;
	    iAction.children.push(his);
	    interactionHistory.push(his);
        possibleAddParent = his;
    }  
}

//parent: detail
function pubAction(pubmedID){
	var his = {
		action: "pub", 
		pubmedID: pubmedID,
        _id: getFormatedTime(),
        parent: curDetail,
        children: [],
    }
    curDetail.children.push(his);
    interactionHistory.push(his)
}

//return the root of the tree
function writeAction(noteid){
	var his = {
		action: "writeNote", 
        _id: getFormatedTime(),
        parent: interactionHistory[interactionHistory.length - 1],
        children: [],
        note: noteid
    }

    var iAction = interactionHistory[interactionHistory.length - 1];
    while(iAction.parent != null){
    	iAction = iAction.parent;
    }
    his.root = iAction;
    return iAction;
}

//branch at select, deselect, add, noteSelect, pivot, detail, noteDis
//if(notedis is not related to pivot or detail entity), skip
function noteDisAction(){
	var omit = false;
	var his = {
		action: "noteDis", 
        _id: getFormatedTime(),
        entity: entity.entity,
        type: entity.type,
        parent: null,
        children: [],
        notes: [] //note ids
    }

    var iAction = interactionHistory[interactionHistory.length - 1];
    for(;iAction != null; iAction = iAction.parent){
        if(actions.indexOf(iAction.action) < 0) continue;
		if(iAction.action == "detail" && iAction[his.type] == his.entity)
			break;
		else if(iAction.action == "pivot" && iAction.entity == his.entity)
			break;
		else if(iAction.action == "noteDis" && iAction.entity == his.entity){
			omit = true;
			break;
		}
		else if(coActions.indexOf(iAction.action) > -1)
			break;
    }
    if(!omit){
    	his.parent = iAction;
	    iAction.children.push(his);
	    interactionHistory.push(his);
        possibleAddParent = his;
    }  
}

// function datasetAction(){
//     var his = {
//         action: "dataset",
//         dataset: ,
//         checked: ,
//         _id: getFormatedTime(),
//         parent: null,
//         children: [],
//         //datasetState: Object.assign({}, visObj.dataset),
//     }
// }

//branch at noteDis or allNote
function viewHistoryAction(){
    var his = {
        action: "viewHis",
        note: , //note id
        _id: getFormatedTime(),
        parent: curNoteAction,
        children: [],
        //datasetState: Object.assign({}, visObj.dataset),
    }
    curNoteAction.children.push(his)
    interactionHistory.push(his);
}

//
function allNoteAction(){
    var his = {
        action: "allNote",
        notes: [], //note ids
        _id: getFormatedTime(),
        parent: null,
        children: [],
    }
    // if(!curNoteAction.hasOwnProperty("action")){
    his.parent = interactionHistory[interactionHistory.length - 1]
    interactionHistory[interactionHistory.length - 1].children.push(his)
    // }
    // else{
    //     his.parent = curNoteAction;
    //     curNoteAction.children.push()
    // } 
    curNoteAction = his;
    interactionHistory.push(his);
}

// function editNoteAction(){
//     var his = {
//         action: "editNote",
//         note: , //note id
//         _id: getFormatedTime(),
//         parent: null,
//         children: [],
//         //datasetState: Object.assign({}, visObj.dataset),
//     }
// }

function drawNoteActionTrees(treeNode){
	if(treeNode == null) return;
	else if(coActions.indexOf(treeNode.action) > -1){
		if(treeNode.combine) drawNoteActionTrees(treeNode.children[0])
		else{
			//draw view
			drawSelectionView(treeNode);
			}
	}
	else if(treeNode.action == "pivot"){

	}
	else if(treeNode.action == "detail"){

	}
	else if(treeNode.action == "pub"){

	}
	else if(treeNode.action == "notedis"){

	}
	else if(treeNode.action == "write"){

	}
}


function saveHistory(){}

window.onbeforeunload = function() {}


function drawUserHistory(){

}

// function datasetAction(){

// }