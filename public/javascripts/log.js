//branch at "add", "select", "deselect"
//var coActions = ["add", "select", "deselect", "noteSelect"];    
//var actions = ["select", "deselect", "add", "noteSelect", "detail", "noteDis", "pivot", "pub", "allNote", "viewHis", "writeNote", "editNote", "dataset"]
//var actionCount = {"select": 0, "deselect": 0, "add": 0, "noteSelect": 0, "detail": 0, "noteDis", "pivot", "allNote", "viewHis", "writeNote", "pub"}

//context-aware interaction tree generation, combines pratise in sequence and theoretical continuity.
//curdetail, possibleaddparent, and curNoteAction may be disappeared when update with child actions.

// function historyVariables(){
//     this.actions = ["select", "deselect", "add", "noteSelect", "detail", "noteDis", "pivot", "viewHis", "hoverEntity", "hoverData"]
//     this.curNoteAction = {}
//     this.curSelectionAction = {}
//     this.possibleAddParent = {}
//     this.curDetail = {}
//     this.curNote = {} //id and entities
//     this.curViewHis = {};
//     this.firstSelectionNode = {};
//     this.firstSelectionNodeParent = {};
//     this.selectionOnGoing = false;
// }

//branch at select, deselect, add, noteSelect, detail, notedis, pivot
//if(pivot is not related to detail or notedis entity), skip
function pivotHisAction(entity){
    //addMouseLabelAction("pivot", entity)
    var his = {
        action: "pivot", 
        _id: getFormatedTime(),
        entity: entity.entity,
        type: entity.type,
        dataset: Object.assign({}, visObj.dataset),
        nodeid: entity.nodeid,
        username: username
    }
    hisStruc.push(his)
}

function hoverEntityHisAction(entity){
    //addMouseLabelAction("hoverEntity", entity)
    var his = {
        action: "hoverEntity", 
        _id: getFormatedTime(),
        entity: entity.entity,
        type: entity.type,
        dataset: Object.assign({}, visObj.dataset),
        nodeid: entity.nodeid,
        username: username
    }
    hisStruc.push(his)

}

function hoverDataHisAction(data){
    //addDataValueAction("hoverData", data)
    var his = {
        action: "hoverData", 
        _id: getFormatedTime(),
        drug: data.drug,
        mutation: data.mutation,
        tumor: data.tumor,
        dataset: data.value.dataset,
        nodeid: data.nodeid,
        username: username
    }
        hisStruc.push(his)

}

//parent: detail
function pubHisAction(data){
	var his = {
		action: "pub", 
		pmid: data.id,
        _id: getFormatedTime(),
        nodeid: data.nodeid,
        username: username 
    }
    //hisVar.curDetail.children.push(his._id);
    //postUpdateEffects(hisVar.curDetail)
    hisStruc.push(his)
}


// function saveHistory(clear = true){
//     // if(interactionHistory.length == 0) return;
//     var temp = interactionHistory;
//     //if(callback != null) currentLeafId = interactionHistory[interactionHistory.length - 1]._id
//     if(clear)
//         interactionHistory = [];
//     $.ajax({
//             type: "POST",
//             url: "/savehistory",
//             contentType:'application/json',
//             dataType: "json",
//             data: JSON.stringify({username: username, history: temp}),
//             success: function(response){
//                 //if(callback != null)
//                     //callback(currentLeafId, username)
//             },
//             error: function () {
//                 console.log("save history failed.");
//                 interactionHistory = interactionHistory.concat(temp)
//             },
//         })
// }