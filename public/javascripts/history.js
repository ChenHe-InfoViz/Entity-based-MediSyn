//branch at "add", "select", "deselect"
//var coActions = ["add", "select", "deselect", "noteSelect"];    
//var actions = ["select", "deselect", "add", "noteSelect", "detail", "noteDis", "pivot", "pub", "allNote", "viewHis", "writeNote", "editNote", "dataset"]
//var actionCount = {"select": 0, "deselect": 0, "add": 0, "noteSelect": 0, "detail": 0, "noteDis", "pivot", "allNote", "viewHis", "writeNote", "pub"}

//context-aware interaction tree generation, combines pratise in sequence and theoretical continuity.
//curdetail, possibleaddparent, and curNoteAction may be disappeared when update with child actions.

function historyVariables(){
    this.actions = ["select", "deselect", "add", "noteSelect", "detail", "noteDis", "pivot", "viewHis", "hoverEntity", "hoverData"]
    this.curNoteAction = {}
    this.curSelectionAction = {}
    this.possibleAddParent = {}
    this.curDetail = {}
    this.curNote = {} //id and entities
    this.curViewHis = {};
    this.firstSelectionNode = {};
    this.firstSelectionNodeParent = {};
    this.selectionOnGoing = false;
}

//deselect always branches at selection actions
function deselectAction(entity){
	var his = {
		action: "deselect", 
        _id: getFormatedTime(),
        entity: entity.entity,
        type: entity.type,
        parent: hisVar.curSelectionAction._id,
        children: [],
        //selectedEntities: visObj.selectedEntities.slice(0),
        dataset: Object.assign({}, visObj.dataset),
        //combine: false
    }

    his.selectedEntities = hisVar.curSelectionAction.selectedEntities.slice(0)
    var re = $.grep(his.selectedEntities, function(e){
        return e.entity == entity.entity
    })
    his.selectedEntities.splice(his.selectedEntities.indexOf(re[0]), 1)
    hisVar.curSelectionAction.children.push(his._id)

    //console.log(hisVar.selectionOnGoing)
    if(hisVar.selectionOnGoing){
        var re = $.grep(hisVar.firstSelectionNode.selectedEntities, function(e){
            return e.entity != hisVar.firstSelectionNode.entity;
        })
        var newArray = re.concat(his.selectedEntities)
        //console.log(newArray)
        if(newArray.length - removeDuplicates(newArray, "entity").length == 0){
            //console.log(hisVar.firstSelectionNode)
            if(hisVar.firstSelectionNodeParent != null){
                hisVar.firstSelectionNodeParent.children.splice(hisVar.firstSelectionNodeParent.children.indexOf(hisVar.firstSelectionNode._id), 1);
                postUpdateEffects(hisVar.firstSelectionNodeParent)
            }
            hisVar.firstSelectionNode.parent = null;
            postUpdateEffects(hisVar.firstSelectionNode)
            hisVar.curNoteAction = {}
        }
    }

    if(!his.selectedEntities.length){
        hisVar.curSelectionAction = {}
        hisVar.possibleAddParent = {}
        hisVar.curNoteAction = {}
    }
    else{
        hisVar.curSelectionAction = his;
        hisVar.possibleAddParent = his;
    }

    if(interactionHistory.length > 10) saveHistory()
    interactionHistory.push(his)

    //if(visObj.selectedEntities.length == 0) newStart = true;

    // //combine multiple selection and deselection

}


function noteSelectAction(entity, noteid){
    var getParent = false;
    //var relatedActions = {"noteDis", "allNote"}
    //var iAction = interactionHistory[interactionHistory.length - 1];
    var his = {
        action: "noteSelect", 
        _id: getFormatedTime(),
        entity: entity.entity,
        type: entity.type,
        noteid: noteid,
        //selectedEntities: visObj.selectedEntities.slice(0),
        parent: null,
        children: [],
        //combine: false,
        dataset: Object.assign({}, visObj.dataset)
    }
    //consecutive selections
    if(hisVar.curNoteAction.action == "allNote"){
        if(!hisVar.selectionOnGoing){
            getParent = true;
           hisVar.selectionOnGoing = true;
           hisVar.firstSelectionNode = his;
        }
    }
    else{
        hisVar.selectionOnGoing = false;
    }

    //curNoteAction.children.push(his);
    if(!hisVar.curSelectionAction.hasOwnProperty("action")){
        his.selectedEntities = [entity]
    }
    else{
        his.selectedEntities = hisVar.curSelectionAction.selectedEntities.concat([entity])
    }

    var iAction = hisVar.possibleAddParent;
    var eva = false;
    for(; iAction != null; iAction = parent(iAction)){
        if(coActions.indexOf(iAction) > -1) break;
        if(iAction.action == "viewHis"){
            if(hisVar.curNote.entities.indexOf(entity.entity) > -1){
                eva = true;
            } 
            break;
        }
    }

    if(eva){
        his.parent = hisVar.curViewHis._id
        hisVar.curViewHis.children.push(his._id)
        postUpdateEffects(hisVar.curViewHis)
    }
    else if(!$.isEmptyObject(hisVar.curNoteAction)){
        allNoteEva();
        his.parent = hisVar.curNoteAction._id
        hisVar.curNoteAction.children.push(his._id)
        postUpdateEffects(hisVar.curNoteAction)
    }
    else if(hisVar.curSelectionAction.hasOwnProperty("action")){
        hisVar.curSelectionAction.children.push(his._id)
        his.parent = hisVar.curSelectionAction._id
    }
    if(getParent) hisVar.firstSelectionNodeParent = parent(his)

    if(interactionHistory.length > 10) saveHistory()
    interactionHistory.push(his)
    hisVar.curSelectionAction = his;
    hisVar.possibleAddParent = his;

}

//branch at select, deselect, noteselection, add, detail, notedis, pivot
//if(add is not related to detail or notedis, or pivot entity), skip
function addAction(entity){
    var iAction = hisVar.possibleAddParent;
	var his = {
        action: "add", 
        _id: getFormatedTime(),
        entity: entity.entity,
        type: entity.type,
        //selectedEntities: visObj.selectedEntities.slice(0),
        parent: hisVar.curSelectionAction._id,
        children: [],
        //combine: false,
        dataset: Object.assign({}, visObj.dataset)
    }

    hisVar.selectionOnGoing = false;

    for(; iAction != null; iAction = parent(iAction)){
        if(hisVar.actions.indexOf(iAction.action) < 0) continue;
    	if(coActions.indexOf(iAction.action) > -1) break;
        if((iAction.action == "detail" || iAction.action == "hoverData") && iAction[entity.type] == entity.entity)
			break;
		if((iAction.action == "noteDis" || iAction.action == "pivot" || iAction.action == "hoverEntity") && iAction.entity == his.entity)
			break;
        if(iAction.action == "pivot"){
            var partof = false;
            for(var i = 0; i < selectedData.length; i++){
                if(selectedData[i][iAction.type] == iAction.entity && selectedData[i][his.type] == his.entity){
                    partof = true;
                    break;
                }
            }
            if(partof) break;
        }
        if(iAction.action == "viewHis"){
            if(hisVar.curNote.entities.indexOf(entity.entity) > -1){
                break;
            }
        }
    }
    
    his.parent = iAction._id;
    iAction.children.push(his._id);
    postUpdateEffects(iAction)
	// his.parent = iAction;
	// iAction.children.push(his);
    // if(!curSelectionAction.hasOwnProperty("action")){
    //     his.selectedEntities = [entity]
    // }
    // else{
    his.selectedEntities = hisVar.curSelectionAction.selectedEntities.concat([entity])
        // his.parent = curSelectionAction._id
        // curSelectionAction.children.push(his._id)
    //}
    if(interactionHistory.length > 10) saveHistory()
    interactionHistory.push(his)
    hisVar.curSelectionAction = his;
    hisVar.possibleAddParent = his;
}

function selectAction(entity){
    var getParent = false;
	//var iAction = curSelectionAction;
	var his = {
        action: "select", 
        _id: getFormatedTime(),
        entity: entity.entity,
        type: entity.type,
        //selectedEntities: visObj.selectedEntities.slice(0),
        parent: null,
        children: [],
        //combine: false,
        dataset: Object.assign({}, visObj.dataset)
    }
    if(!hisVar.selectionOnGoing){
        getParent = true;
        hisVar.selectionOnGoing = true;
        hisVar.firstSelectionNode = his;
    }

    var iAction = hisVar.possibleAddParent;
    var eva = false;
    for(; iAction != null; iAction = parent(iAction)){
        if(coActions.indexOf(iAction) > -1) break;
        if(iAction.action == "viewHis"){
            if(hisVar.curNote.entities.indexOf(entity.entity) > -1) eva = true;
            break;
        }
    }
    if(eva){
        his.parent = hisVar.curViewHis._id
        hisVar.curViewHis.children.push(his._id)
        postUpdateEffects(hisVar.curViewHis)
    }
	
    if(!hisVar.curSelectionAction.hasOwnProperty("action")){
        his.selectedEntities = [entity]
        if(hisVar.curNoteAction.hasOwnProperty("action")){
            his.parent = hisVar.curNoteAction._id
            hisVar.curNoteAction.children.push(his._id)
        }
    }
    else{
        his.selectedEntities = hisVar.curSelectionAction.selectedEntities.concat([entity])
        if(!eva){
            his.parent = hisVar.curSelectionAction._id
            hisVar.curSelectionAction.children.push(his._id)
        }
    }
    if(getParent) hisVar.firstSelectionNodeParent = parent(his)

    if(interactionHistory.length > 10) saveHistory()
    interactionHistory.push(his)
    hisVar.curSelectionAction = his;
    hisVar.possibleAddParent = his;

}

//branch at select, deselect, add, noteSelect, detail, notedis, pivot
//if(pivot is not related to detail or notedis entity), skip
function pivotAction(entity){
    addMouseLabelAction("pivot", entity)
}

//pivot and hoverEntity
function addMouseLabelAction(action, entity){
	var omit = false;
	var his = {
        action: action, 
        _id: getFormatedTime(),
        entity: entity.entity,
        type: entity.type,
        //selectedEntities: visObj.selectedEntities.slice(0),
        parent: null,
        children: [],
        dataset: Object.assign({}, visObj.dataset)
    }

    var iAction = hisVar.possibleAddParent;
    for(;iAction != null; iAction = parent(iAction)){
        if(hisVar.actions.indexOf(iAction.action) < 0) continue;
		if((iAction.action == "detail" || iAction.action == "hoverData") && iAction[his.type] == his.entity)
			break;
		if(iAction.action == "pivot"){
            if(iAction.entity == his.entity){
			  omit = true;
			  break;
            }
            //if the new focued value is one of the pivoted values
            var partof = false;
            for(var i = 0; i < selectedData.length; i++){
                if(selectedData[i][iAction.type] == iAction.entity && selectedData[i][his.type] == his.entity){
                    partof = true;
                    break;
                }
            }
            if(partof) break;
		}
        if(iAction.action == "hoverEntity" && iAction.entity == his.entity){
            if(action == "hoverEntity") {
                omit = true;
                break;
            }
            else if(action == "pivot") break;
        }
        if(iAction.action == "noteDis" && iAction.entity == his.entity)
            break;
		if(coActions.indexOf(iAction.action) > -1)
			break;
        if(iAction.action == "viewHis" && hisVar.curNote.entities.indexOf(entity.entity) > -1){
            break;
        }
    }
    if(!omit){
        hisVar.selectionOnGoing = false;
    	his.parent = iAction._id;
	    iAction.children.push(his._id);
        postUpdateEffects(iAction)
	    interactionHistory.push(his);
        hisVar.possibleAddParent = his;
    }

}

function hoverEntityAction(entity){
    addMouseLabelAction("hoverEntity", entity)
}

function hoverDataAction(data){
    addDataValueAction("hoverData", data)
}

//branch at select, deselect, add, noteSelect, pivot, notedis, detail
//if(detail is not related to pivot or notedis entity), skip
function detailAction(data){
    addDataValueAction("detail", data)
}

function addDataValueAction(action, data){
	var iAction = hisVar.possibleAddParent;
	var his = {
        action: action, 
        _id: getFormatedTime(),
        drug: data.drug,
        mutation: data.mutation,
        tumor: data.tumor,
        dataset: data.value.dataset,
        parent: null,
        children: [],
    }
    //his.dataset[data.value.dataset] = true;
    var omit = false;
    for(;iAction != null; iAction = parent(iAction)){
        if(hisVar.actions.indexOf(iAction.action) < 0) continue;
		if(iAction.action == "detail" || iAction.action == "hoverData"){
            if(iAction.action == action && iAction.drug == his.drug && iAction.mutation == his.mutation && iAction.tumor == his.tumor && iAction.dataset == his.dataset){
                omit = true;
                break;
            }
			else if(iAction.drug == his.drug || iAction.mutation == his.mutation || iAction.tumor == his.tumor){
                break;
            }
		}
		if((iAction.action == "noteDis" || iAction.action == "pivot" || iAction.action == "hoverEntity") && iAction.entity == his[iAction.type])
			break;
		if(coActions.indexOf(iAction.action) > -1)
			break;
        if(iAction.action == "viewHis"){
          if(hisVar.curNote.entities.indexOf(data.drug) > -1 || hisVar.curNote.entities.indexOf(data.tumor) > -1 || hisVar.curNote.entities.indexOf(data.mutation) > -1){
            break;
          }
        }
    }
    if(!omit){
        hisVar.selectionOnGoing = false;
        hisVar.curDetail = his;
    	his.parent = iAction._id;
	    iAction.children.push(his._id);
        postUpdateEffects(iAction)
	    interactionHistory.push(his);
        hisVar.possibleAddParent = his;
    }  
}

//branch at select, deselect, add, noteSelect, pivot, detail, noteDis
//if(notedis is not related to pivot or detail entity), skip
function noteDisAction(entity, ids){
    var omit = false;
    var his = {
        action: "noteDis", 
        _id: getFormatedTime(),
        entity: entity.entity,
        type: entity.type,
        parent: null,
        children: [],
        noteids: ids //note ids
    }
    hisVar.selectionOnGoing = false;

    var iAction = hisVar.possibleAddParent;
    //console.log(iAction)
    //console.log(interactionHistory)
    for(;iAction != null; iAction = parent(iAction)){
        if(hisVar.actions.indexOf(iAction.action) < 0) continue;
        if((iAction.action == "detail" || iAction.action == "hoverData") && iAction[his.type] == his.entity)
            break;
        else if(iAction.action == "pivot"){
            if(iAction.entity == his.entity)
                break;
            var partof = false;
            //console.log(selectedData)
            for(var i = 0; i < selectedData.length; i++){
                if(selectedData[i][iAction.type] == iAction.entity && selectedData[i][his.type] == his.entity){
                    partof = true;
                    break;
                }
            }
            if(partof) break;
        }

        else if((iAction.action == "noteDis" || iAction == "hoverEntity") && iAction.entity == his.entity){
            if(iAction.action == "noteDis") omit = true;
            break;
        }
        else if(coActions.indexOf(iAction.action) > -1)
            break;
        if(iAction.action == "viewHis" && hisVar.curNote.entities.indexOf(entity.entity) > -1){
            break;
        }
    }
    if(!omit){
        his.parent = iAction._id;
        iAction.children.push(his._id);
        postUpdateEffects(iAction)
        interactionHistory.push(his);
        hisVar.curNoteAction = his;
        hisVar.possibleAddParent = his;
    }  
}

function upAction(id, state){
    var his = {
        action: "up", 
        noteid: id,
        state: state,
        _id: getFormatedTime(),
        parent: null,
        children: [],
    }
    hisVar.selectionOnGoing = false;

    if(interactionHistory.length > 0){
        his.parent = interactionHistory[interactionHistory.length - 1]._id;
        interactionHistory[interactionHistory.length - 1].children.push(his._id);
    }    
    interactionHistory.push(his)
}

function downAction(id, state){
    var his = {
        action: "down", 
        noteid: id,
        _id: getFormatedTime(),
        state: state,
        parent: null,
        children: [],
    }
    hisVar.selectionOnGoing = false;

    if(interactionHistory.length > 0){
        his.parent = interactionHistory[interactionHistory.length - 1]._id;
        interactionHistory[interactionHistory.length - 1].children.push(his._id)
    }
    interactionHistory.push(his)
}

//parent: detail
function pubAction(id){
	var his = {
		action: "pub", 
		pmid: id,
        _id: getFormatedTime(),
        parent: hisVar.curDetail._id,
        children: [],
    }
    hisVar.curDetail.children.push(his._id);
    postUpdateEffects(hisVar.curDetail)
    interactionHistory.push(his)
}


function writeAction(noteid, actionid){
	var his = {
		action: "writeNote", 
        _id: actionid,
        parent: null,
        children: [],
        noteids: [noteid]
    }
    hisVar.selectionOnGoing = false;
    addToLastOkAction(his);
    interactionHistory.push(his);
    saveHistory(false);

    hisVar.curNoteAction = his
    //createShadowNoteDisAction()
    // while(iAction.parent != null){
    // 	iAction = iAction.parent;
    // }
    // his.root = iAction;
    // return iAction;
}

function editAction(noteid, actionid){
    // var his = {
    //     action: "editNote",
    //     noteids: [noteid],
    //     _id: actionid,
    //     parent: null,
    //     children: [],
    //     //datasetState: Object.assign({}, visObj.dataset),
    // } 
    // hisVar.selectionOnGoing = false;
    // addToLastOkAction(his)
    // interactionHistory.push(his);
    // saveHistory(false)
    // hisVar.curNoteAction = his;
}

//function createShadowNoteDisAction()

function parent(action){
    var re = $.grep(interactionHistory, function(e){
        return e._id == action.parent;
    })

    if(re.length) return re[0];

    return null;
}

function allNoteAction(ids){
    var his = {
        action: "allNote",
        noteids: ids, //note ids
        _id: getFormatedTime(),
        parent: null,
        children: [],
    }
    hisVar.selectionOnGoing = false;
    if(interactionHistory.length > 0 && hisVar.curSelectionAction.hasOwnProperty("action")){
        addToLastOkAction(his)
    }
    // else{
    //     his.parent = curNoteAction;
    //     curNoteAction.children.push()
    // } 
    hisVar.curNoteAction = his;
    interactionHistory.push(his);
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
function viewHistoryAction(noteid, entities){
    var his = {
        action: "viewHis",
        noteids: [noteid],
        entities: entities.slice(0),
        _id: getFormatedTime(),
        parent: null,
        children: []
    }
    hisVar.selectionOnGoing = false;

    if(!$.isEmptyObject(hisVar.curNoteAction)){
        his.parent = hisVar.curNoteAction._id;
        allNoteEva()
        hisVar.curNoteAction.children.push(his._id)
        postUpdateEffects(hisVar.curNoteAction)
    }
    else{
        addToLastOkAction(his);
    }
    
    interactionHistory.push(his);
    hisVar.possibleAddParent = his;
    hisVar.curViewHis = his;
    hisVar.curNote.entities = entities.map(a => a.entity);
}

function allNoteEva(){
    if(hisVar.curNoteAction == "allNote" && !hisVar.curNoteAction.children.length && !hisVar.curSelectionAction.hasOwnProperty("action")){
        hisVar.curNoteAction.parent = null;
    }
}

function addToLastOkAction(node){
    for(var i = interactionHistory.length - 1; i >= 0; i--){
        if(["up", "down"].indexOf(interactionHistory[i].action) < 0){
            interactionHistory[i].children.push(node._id)
            node.parent = interactionHistory[i]._id
            break;
        }
    }
}

function postUpdateEffects(node){
    if(interactionHistory.indexOf(node) < 0){
        interactionHistory.push(node)
        //console.log("add " + node.action)
    }
}

function saveHistory(clear = true){
    // if(interactionHistory.length == 0) return;
    if(gloDiv == "#tutorialMain"){
        interactionHistory = [];
        return;
    }
    var temp = interactionHistory;
    //if(callback != null) currentLeafId = interactionHistory[interactionHistory.length - 1]._id
    if(clear)
        interactionHistory = [];
    $.ajax({
            type: "POST",
            url: "/savehistory",
            contentType:'application/json',
            dataType: "json",
            data: JSON.stringify({username: username, history: temp}),
            success: function(response){
                //if(callback != null)
                    //callback(currentLeafId, username)
            },
            error: function () {
                console.log("save history failed.");
                interactionHistory = interactionHistory.concat(temp)
            },
        })
}

window.onbeforeunload = function() {
    if(gloDiv != "#main") return;
    if(interactionHistory.length > 0) saveHistory()
    for(var i = 0; i < historyWindows.length; i++) 
        historyWindows[i].close()
    if(hisStruc.length > 0) saveHisLog()
}

function drawHisWindow(leafid, user){
    //console.log(username)
    // if(typeof history != "string")
    //     sessionStorage.setItem("mediSynHis", JSON.stringify(history) )
    // else 
     // localStorage.setItem("mediSynHis", leafid)
     // localStorage.setItem("mediSynUser", user)
     // localStorage.setItem("mediSynCurUser", username)
     //console.log(localStorage.getItem("mediSynHisStruc"));

     // if (localStorage.getItem("mediSynHisStruc") == null) {
       // localStorage.setItem("mediSynHisStruc", "context");
     // }

  // console.log($( window ).height())
  var diaObj = {
    // title: "Sign in",
    autoOpen: false,
    height: $(window).height() * .95,
    width: $(window).width() * .95,
    // max-height: $(window).height() * .95,
    // max-width: $(window).width() * .95,
    modal: true,
    dialogClass: "ui-dialog",
    buttons: {
      // "Sign in": signinPro,
      // Cancel: function() {
        // authenDia()
        //$("#dialog-form").dialog( "close" );
      // }
    },
    close: function() {
      //form[ 0 ].reset();
      //allFields.removeClass( "ui-state-error" );
    }
  }
  // console.log("window")
    $("#historyDialog").dialog(diaObj);
    $(".ui-dialog-titlebar").hide();
    $("#historyDialog").dialog("open");
    $("#grid").empty()

    $("#speed").val(historyLayout)
    curLeafId = leafid;
    $("#iframeFader").show()
    getRoot(leafid, user)    
     // historyWindows.push(window.open(window.location + "history") )
        
}

function saveHisLog(){
    var temp = hisStruc;
    hisStruc = [];
    $.ajax({
        url: 'savelog',
       type: 'POST',
       contentType:'application/json',
       data: JSON.stringify(temp),
       dataType:'json',
       success: function(res){
        //console.log(res)
          console.log("writing log success!")
       },
       error: function()
       {
          console.log("writing log error!");
          hisStruc = hisStruc.concat(temp)
       }
      })
}