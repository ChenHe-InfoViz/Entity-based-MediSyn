function drawNodeView(root){
    this.selectedEntities = []
    this.selectedHisData = []
    this.count = {total: 2};
    this.root = root
    this.gridDim = {row: 1, col: 1}
    this.marginTop = 8;
}

var nodeView = null;
function drawHisView(rootNode){
    //console.log(historyArray)
    //var iAction = getRoot(leafId);//historyArray[historyArray.length - 1];
    //console.log(iAction)
    // while(iAction.parent != null){
    //     if(coActions.indexOf(iAction.action) > -1 && iAction.action != "deselect"){
    //         var temp = parent(iAction);
    //         if(temp != null && coActions.indexOf(temp.action) < 0)
    //             iAction = temp;
    //         else break;
    //     }
    //     else iAction = parent(iAction)
    // }

     nodeView = new drawNodeView(rootNode)
     nodeView.getGridDim(nodeView.root, 1, 1)
     nodeView.selectedEntities = removeDuplicates(nodeView.selectedEntities, "entity")
     //console.log(nodeView.selectedEntities)
     nodeView.retrieveDtcforHis(nodeView)
     nodeView.retrieveEffectsforHis(nodeView)
}

drawNodeView.prototype.getGridDim = function(treeNode, row, col){
    //console.log(treeNode.action + " " +  treeNode._id + " " + treeNode.children)
    if(coActions.indexOf(treeNode.action) > -1){
        this.selectedEntities = this.selectedEntities.concat(treeNode.selectedEntities)
    }
    //var rowCount = 0;
    treeNode.row = row;
    treeNode.col = col;
    treeNode.rowCount = (!treeNode.children.length ? 1 : 0);
    for(var i = 0; i < treeNode.children.length; i++){
        var node = nodeFromId(treeNode.children[i]);
        this.getGridDim(node, row + treeNode.rowCount, col + 1)
        treeNode.rowCount += node.rowCount;
        //rowCount += node.row;
    }
    //if(this.gridDim.row < row + treeNode.children.length - 1 || (treeNode.children.length > 0 && this.gridDim.col < col + 1)){
        if(this.gridDim.row < row + treeNode.rowCount - 1) this.gridDim.row = row + treeNode.rowCount - 1
        if(treeNode.children.length > 0 && this.gridDim.col < col + 1) this.gridDim.col = col + 1
    //}
}

// drawNodeView.prototype.drawNode = function (treeNode, row, col){
//     //if(treeNode == null) return;
//     if(coActions.indexOf(treeNode.action) > -1){
//         this.drawSelectionView(treeNode, row, col);
//     }
//     else if(treeNode.action == "pivot"){
//         this.drawPivotView(treeNode, row, col);
//     }
//     else if(treeNode.action == "detail"){
//         this.drawDetailView(treeNode, row, col);
//     }
//     else if(treeNode.action == "pub"){
//         this.drawPubView(treeNode, row, col);
//     }
//     else if(treeNode.action == "noteDis"){
//         this.drawNoteDisView(treeNode, row, col);
//     }
//     else if(treeNode.action == "allNote"){
//         this.drawNoteDisView(treeNode, row, col);
//     }
//     else if(treeNode.action == "writeNote" || treeNode.action == "editNote"){
//         this.drawNoteDisView(treeNode, row, col)
//     }
//     else if(treeNode.action == "viewHis"){
//         this.drawNoteDisView(treeNode, row, col)
//     }
//     var rowCount = 0;
//     for(var i = 0; i < treeNode.children.length; i++){
//         var nd = nodeFromId(treeNode.children[i]);        
//         this.drawNode(nd, row + rowCount, col + 1)
//         rowCount += nd.row;
//     }
    
// }

drawNodeView.prototype.drawNode = function (){
    //if(treeNode == null) return;
    this.drawViewFrame();
    for(var i = 0; i < showInteractionHistory.length; i++){
        var treeNode = showInteractionHistory[i]
        if(coActions.indexOf(treeNode.action) > -1){
            this.drawSelectionView(treeNode);
        }
        else if(treeNode.action == "pivot"){
            this.drawPivotView(treeNode);
        }
        else if(treeNode.action == "detail"){
            this.drawDetailView(treeNode);
        }
        else if(treeNode.action == "pub"){
            this.drawPubView(treeNode);
        }
        else if(treeNode.action == "noteDis"){
            this.drawNoteDisView(treeNode);
        }
        else if(treeNode.action == "allNote"){
            this.drawNoteDisView(treeNode);
        }
        else if(treeNode.action == "writeNote" || treeNode.action == "editNote"){
            this.drawNoteDisView(treeNode)
        }
        else if(treeNode.action == "viewHis"){
            this.drawNoteDisView(treeNode)
        }
        else console.log(treeNode.action)
    }
    this.updateNodeSize()
    
}

function getRoot(leafId, user){
    //console.log(user)
    $.ajax({
        type: "POST",
        url: "/gethistree/?id=" + leafId + "&username=" + user,
        // contentType:'application/json',
        dataType: "json",
        // data: JSON.stringify({ids: node.notes, username: username}),
        success: function(response){
            if(response.hasOwnProperty("message")){
                $("#grid").html(response.message)
            }
            else{
                showInteractionHistory = response;
                showInteractionHistory.sort(function(a,b) {return (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0);} ); 

                //console.log(response.slice(0))
                removeSomeNodes(showInteractionHistory[0])
                arrangeTree(showInteractionHistory[0])
                drawHisView(showInteractionHistory[0])
            }
            //console.log(response)
        },
        error: function () {
            console.log("get history tree failed.");
        },
    })
}

function removeSomeNodes(node){
    //console.log(node.action);
    if(node.action == "hoverEntity" || node.action == "hoverData"){ //skip
        var parent = nodeFromId(node.parent)
        parent.children.splice(parent.children.indexOf(node._id), 1)
        for(var i = node.children.length - 1; i > -1 ; i--){
            //console.log(child(node.children[i]));
            var child = nodeFromId(node.children[i])
            //console.log("c " + child.action)
            if(typeof child != "undefined"){
                parent.children.push(node.children[i]);
                child.parent = node.parent;
            }
            else node.children.splice(i, 1)
        }
        showInteractionHistory.splice(showInteractionHistory.indexOf(node), 1)
    }
    if(node.action == "up" || node.action == "down"){
        if(node.children.length > 0){
            console.log("with children")
            node.children = []
        }
        var parent = nodeFromId(node.parent)
        parent.children.splice(parent.children.indexOf(node._id), 1);
        showInteractionHistory.splice(showInteractionHistory.indexOf(node), 1)
    }

    for(var i = node.children.length - 1; i > -1 ; i--){
    //console.log(child(node.children[i]));
        var child = nodeFromId(node.children[i])
        //console.log(child)
        if(typeof child != "undefined" )
            removeSomeNodes(child)
        else node.children.splice(i, 1)
    }
}
//combine consecutive selections
function arrangeTree(node, message = [], parentNode = {}){
  //console.log(node.action+  " " + node._id)
  //var curMessage = message.slice(0)
  if(coActions.indexOf(node.action) < 0){
    if(message.length > 0) console.log(node.action + " " + curMessage)
    
  }
  else{//if(coActions.indexOf(node.action) >= 0){
    if(node.children.length == 1 && typeof nodeFromId(node.children[0]) != "undefined" && coActions.indexOf(nodeFromId(node.children[0]).action) > -1){
      if($.isEmptyObject(parentNode)){ 
        if(!node.parent)
            parentNode = {_id:null}
        else{
            //console.log("p " + node.parent);
            parentNode = nodeFromId(node.parent);
            //console.log(" a " + parentNode);
            parentNode.children.splice(parentNode.children.indexOf(node._id), 1)
        }
      }
      //console.log(node.action + " " + node.entity)
      switch(node.action){
        case "noteSelect": message.push({action: node.action, noteid: node.noteid, entity: node.entity}); break;
        case "add": 
        case "select": 
        case "deselect": message.push({action: node.action, entity: node.entity}); break;
      }
      showInteractionHistory.splice(showInteractionHistory.indexOf(node), 1)
    }
    else{
      if(!$.isEmptyObject(parentNode)){
        if(!parentNode._id) node.parent = null;
        else {
            node.parent = parentNode._id;
            parentNode.children.push(node._id);
        }
        parentNode = {};
      }
      if(message.length > 0){
        message.push({action: node.action, entity: node.entity});
        //console.log(node.selectedEntities)
        //var entityNames = node.selectedEntities.map(a => a.entity)
        //for(var i = message.length - 1; i >= 0; i--){
          //if(entityNames.indexOf(message[i].entity) < 0)
            //message.splice(i, 1)
        //}
        node.message = message;
        message = []
      }
    }
  }
  for(var i = node.children.length - 1; i > -1 ; i--){
    //console.log(child(node.children[i]));
    var child = nodeFromId(node.children[i])
    //console.log(child)
    //if(typeof child != "undefined" )
    arrangeTree(child, message.slice(0), parentNode)
    //else node.children.splice(i, 1)
  }
  node.children.sort(function(a,b) {return (a > b) ? 1 : ((b > a) ? -1 : 0);} ); 

}

function nodeFromId(id){
    return $.grep(showInteractionHistory, function(e){
        return e._id == id;
    })[0]
}

// drawNodeView.prototype.drawWriteNoteView = function(treeNode,row,col){
    
// }
drawNodeView.prototype.drawViewFrame = function(){//(action, rowCount, row, col, text){
    //var self = this;
    var div = d3.select("#grid").selectAll(".gridDiv").data(showInteractionHistory);
    var divEnter = div.enter().append("div").attr({
        class: "gridDiv"
    })
    div.exit().remove();
    //div.order();
    divEnter.append("div").attr("class", "intro").append("text").style("word-wrap", "break-word")

    divEnter.append("div").attr({
        id: function(d){ return d.action + d.row + d.col},
        class: "disDiv",
    })
    // .style({
    //     //"margin-top": ($("#" + action + row + col).parent().children(".intro").height() + this.marginTop) + "px",
    //     height: function(d){
    //         return ($("#" + d.action + d.row + d.col).parent().height() - $("#" + d.action + d.row + d.col).parent().children(".intro").height() - self.marginTop) + "px";
    //     }
    // })
    //var struc = localStorage.getItem("mediSynHisStruc");

    if(historyLayout == "context")
        this.toTreeStruc()
    else this.toLinearStruc()
}

drawNodeView.prototype.updateNodeSize = function(){
    var self = this;
    d3.selectAll(".disDiv").style({
        height: function(d){
            return ( $("#" + d.action + d.row + d.col).parent().height() - $("#" + d.action + d.row + d.col).parent().children(".intro").height() - self.marginTop) + "px";
        }
    })
    // $("#" + treeNode.action + treeNode.row + treeNode.col).parent().children(".intro").find("text").text(selectText(treeNode))
    // d3.select("#" + treeNode.action + treeNode.row + treeNode.col).style({
    //     //"margin-top": ($("#" + action + row + col).parent().children(".intro").height() + this.marginTop) + "px",
        
    // })
}

drawNodeView.prototype.toTreeStruc = function(){
    d3.select("#grid").style({
        height: "calc(100% - 30px)",
        width: "100%"
    })
    d3.select("#grid").style("grid-template-rows", "repeat("+ this.gridDim.row + ", minmax(200px, " + 100/this.gridDim.row + "%)")
    d3.select("#grid").style("grid-template-columns", "repeat("+ this.gridDim.col + ",minmax(300px, " + 100/this.gridDim.col + "%)")
     
    d3.selectAll(".gridDiv").style({
        "grid-row": function(d){return d.row + "/ span " + d.rowCount},
        "grid-column": function(d){return d.col + "/ span 1"},
    })
    // this.updateNodeSize()
}
drawNodeView.prototype.toLinearStruc = function(){
    d3.select("#grid").style({
        height: "calc(100% - 30px)",
        width: "100%"
    })
    d3.select("#grid").style("grid-template-rows", "repeat(1,100%)")
    d3.select("#grid").style("grid-template-columns", "repeat("+ showInteractionHistory.length + ",minmax(300px, " + 100/showInteractionHistory.length + "%)")
     
    d3.selectAll(".gridDiv").style({
        "grid-row": function(d){return "1 / span 1"},
        "grid-column": function(d, i){return (i + 1) + "/ span 1"},
    })
    // this.updateNodeSize()
}

drawNodeView.prototype.drawSelectionView = function(treeNode){
    var disData = {colMuTu : [], disTumors: [], dataRow: [], selectedEntities: [], scrollDis: {scrollbarLength: 0, brushWidth: 0, linearScale:{}}, dataset: treeNode.dataset}
    
    for(var i = 0; i < this.selectedHisData.length; i++){
        for(var j = 0; j < treeNode.selectedEntities.length; j++){
            var temp = treeNode.selectedEntities[j]
            if(this.selectedHisData[i][temp.type] == temp.entity){
                addDataforVis(this.selectedHisData[i], disData)
                break;
            }
        }
    }
    var self = this;
    //var text = "Select. Selected entities: " + treeNode.selectedEntities.map(a => a.entity).join(", ") + "."

    //this.drawViewFrame("select", treeNode.row, row, col, selectText(treeNode))
    $("#" + treeNode.action + treeNode.row + treeNode.col).parent().children(".intro").find("text").text(selectText(treeNode))
    // d3.select("#" + treeNode.action + treeNode.row + treeNode.col).style({
    //     //"margin-top": ($("#" + action + row + col).parent().children(".intro").height() + this.marginTop) + "px",
    //     height: function(d){
    //         return ( $("#" + d.action + d.row + d.col).parent().height() - $("#" + d.action + d.row + d.col).parent().children(".intro").height() - self.marginTop) + "px";
    //     }
    // })
    
        // if(!treeNode.hasOwnProperty("message"))
      
    //console.log($("#intro" + row + col).height())
    
    // console.log($("#grid > div").height() + " " + $("#intro" + row + col).height() )
    disData.selectedEntities = treeNode.selectedEntities;
    //console.log(disData)

    this.drawHisMatrix("#" + treeNode.action + treeNode.row + treeNode.col, disData)
    //this.drawDec
}

function selectText(treeNode){
    var text = "Select actions";
    var currentAction = "";
     // var state = {add: "", noteSelect: ""}
    // if(treeNode.hasOwnProperty("message"))
    // for(var i = 0; i < treeNode.message.length; i++){
    //     switch(treeNode.message[i].action){
    //         case "select": if(currentAction == "select") text += ", " + treeNode.message[i].entity; 
    //         else{ 
    //             text += ". Select from the list: " + treeNode.message[i].entity;
    //             currentAction = "select"
    //         }
    //         break;
    //         case "deselect": if(currentAction == "deselect") text += ", " + treeNode.message[i].entity; 
    //         else{
    //             text += ". Deselect: " + treeNode.message[i].entity;
    //             currentAction = "deselect";
    //         }
    //         break;
    //         case "add": if(currentAction == "add") text += ", " + treeNode.message[i].entity; 
    //         else{
    //             text += ". Add from the view: " + treeNode.message[i].entity;
    //             currentAction = "add";
    //         } 
    //         break;
    //         case "noteSelect": if(currentAction == "noteSelect") text += ", " + treeNode.message[i].entity; 
    //         else{
    //             text += ". Select from the notes: " + treeNode.message[i].entity;
    //             currentAction = "noteSelect";
    //         }
    //         break;
    //     }
    // }
    // else switch(treeNode.action){
    //     case "select": text = "Select from the list: " + treeNode.entity; break;
    //     case "deselect": text = "Deselect: " + treeNode.entity; break;
    //     case "add": text = "Add from the view: " + treeNode.entity; break;
    //     case "noteSelect": text = "Select from the note: " + treeNode.entity; break;
    // }
    text += ". \nSelected entities: " + treeNode.selectedEntities.slice(0, 10).map(a => a.entity).join(", ") + "."
    if(treeNode.selectedEntities.length > 10) text += ".."
    // var s = "Selected entities: " + entityNames.join(" ") + "."
    // if(state.add != "")
    //     s += "\nAdded from the view: " + state.add.slice(0, -2) + ".";
    // if(state.noteSelect != "") 
    //     s += "\nSelected from note(s):" + state.noteSelect.slice(0, -2) + ".";
    return text;
}
    
drawNodeView.prototype.drawPivotView = function(node){
    var list = [];
    for(var i = 0; i < this.selectedHisData.length; i++){
        if(this.selectedHisData[i][node.type] == node.entity){
            list.push(this.selectedHisData[i])
        }
    }
    var disData = {colMuTu : [], disTumors: [], dataRow: [], selectedEntities: [], scrollDis: {scrollbarLength: 0, brushWidth: 0, linearScale:{}}, dataset: node.dataset}
    for(var i = 0; i < list.length; i++){
        addDataforVis(list[i], disData)
    }
    var self = this;
    //this.drawViewFrame("pivot", node.row, row, col, "Pivot: " + node.entity)
    $("#" + node.action + node.row + node.col).parent().children(".intro").find("text").text("Pivot: " + node.entity)
    // d3.select("#" + node.action + node.row + node.col).style({
    //     //"margin-top": ($("#" + action + row + col).parent().children(".intro").height() + this.marginTop) + "px",
    //     height: function(d){
    //         return ( $("#" + d.action + d.row + d.col).parent().height() - $("#" + d.action + d.row + d.col).parent().children(".intro").height() - self.marginTop) + "px";
    //     }
    // })

    disData.selectedEntities.push({entity: node.entity, type: node.type})
    this.drawHisMatrix("#" + node.action + node.row + node.col, disData)
}

drawNodeView.prototype.drawDetailView = function(node){
    //console.log(this.selectedHisData)
    var data = $.grep(this.selectedHisData, function(e){
        return e.drug == node.drug && e.tumor == node.tumor && e.mutation == node.mutation && e.value.dataset == node.dataset
    });
    // var temp = {drug: node.drug, tumor: node.tumor, mutation: node.mutation};
    // var re = $.grep(data[0].values, function(e){
    //     return e.dataset == node.dataset
    // })
    // temp.value
    var disData = {colMuTu : [], disTumors: [], dataRow: [], selectedEntities: [], scrollDis: {scrollbarLength: 0, brushWidth: 0, linearScale:{}}, dataset: {}}
    disData.dataset[node.dataset] = true;
    //addDataforVis(data[0], disData)
    //this.drawViewFrame("detail", node.row, row, col, "Retrieve the detailed description.")
    var self = this;
    $("#" + node.action + node.row + node.col).parent().children(".intro").find("text").text("Retrieve the detailed description.")
    // d3.select("#" + node.action + node.row + node.col).style({
    //     //"margin-top": ($("#" + action + row + col).parent().children(".intro").height() + this.marginTop) + "px",
    //     height: function(d){
    //         return ( $("#" + d.action + d.row + d.col).parent().height() - $("#" + d.action + d.row + d.col).parent().children(".intro").height() - self.marginTop) + "px";
    //     }
    // })
    //: Relation between " + node.drug + " and " + node.mutation
    //+ " in " + node.tumor + " from " + node.dataset + ".")
    //this.drawHisMatrix("#detail" + row + col, disData);
    drawDetailDis("#" + node.action + node.row + node.col);
    valueClick(data[0], "#" + node.action + node.row + node.col)

    // var offset = $("#detail" + row + col).find(".onesetGroup").offset()
    // d3.select("#detail" + row + col).select(".onesetGroup").append("text").text("\uf245").attr({
    //     transform: "translate(10, 20)"
    // }).style({
    //     "font-family": "FontAwesome",
    //     "font-size": 15,
    // })

}

drawNodeView.prototype.drawPubView = function(node){
    //this.drawViewFrame("pub", node.row, row, col, "Retrieve a publication.")   
    var self = this;     
    $("#" + node.action + node.row + node.col).parent().children(".intro").find("text").text("Retrieve a publication.")
    // d3.select("#" + node.action + node.row + node.col).style({
    //     //"margin-top": ($("#" + action + row + col).parent().children(".intro").height() + this.marginTop) + "px",
    //     height: function(d){
    //         return ( $("#" + d.action + d.row + d.col).parent().height() - $("#" + d.action + d.row + d.col).parent().children(".intro").height() - self.marginTop) + "px";
    //     }
    // })
    //: Relation between " + node.drug + " and " + node.mutation
    //+ " in " + node.tumor + " from " + node.dataset + ".")
    
    //console.log(node.pmid)
    //var div = document.getElementById("pub" + row + col);
    //div.innerHTML = '<iframe style="width:100%;height:100%;" frameborder="0" src="' + "https://www.ncbi.nlm.nih.gov/pubmed/" + node.pmid + '" />';
    var pubDiv = d3.select("#pub" + node.row + node.col).append("div")
    var text = pubDiv.append('text').text("DOI ").style("font-weight", "bold");

    pubDiv.append("a").style({
        'cursor':'pointer',
        'text-decoration': 'underline'
    }).on("click", function(){
        //$("#iframeFader").show();

        window.open("https://doi.org/" + this.text, '_blank');
        //$("#previewFrame").attr("src", "https://www.ncbi.nlm.nih.gov/pubmed/?term=" + this.text);
    })
    .text(node.pmid)
}

drawNodeView.prototype.drawNoteDisView = function(node){
    var text = "";
    switch(node.action){
        case "noteDis": text = "Retrieve all notes related to: " + node.entity + "."; break;
        case "allNote": text = "Retrieve all notes."; break;
        case "writeNote": text = "Write a note."; break;
        case "editNote": text = "Edit a note."; break;
        case "viewHis": text = "View history actions of a note."; break;
    }
    //this.drawViewFrame("noteDis", node.row, row, col, text)
    var self = this;
    $("#" + node.action + node.row + node.col).parent().children(".intro").find("text").text(text)
    // d3.select("#" + node.action + node.row + node.col).style({
    //     //"margin-top": ($("#" + action + row + col).parent().children(".intro").height() + this.marginTop) + "px",
    //     height: function(d){
    //         return ( $("#" + d.action + d.row + d.col).parent().height() - $("#" + d.action + d.row + d.col).parent().children(".intro").height() - self.marginTop) + "px";
    //     }
    // })
    //: Relation between " + node.drug + " and " + node.mutation
    //+ " in " + node.tumor + " from " + node.dataset + ".")
    
    $.ajax({
        type: "POST",
        url: "/getnotes",
        contentType:'application/json',
        dataType: "json",
        data: JSON.stringify({ids: node.noteids, username: username}),
        success: function(response){
            //console.log(response)
            
            //console.log($("#noteDis" + row + col).parent().children(".intro").height())
            if(response.hasOwnProperty("message")){
                $("#" + node.action + node.row + node.col).html(response.message)
            }
            else{
                drawNoteFramework("#" + node.action + node.row + node.col)
                drawNotesFromRes({entity: node.entity, type: node.type}, response, "#" + node.action + node.row + node.col)
            }
        },
        error: function () {
            console.log("get notes failed.");
        },
    })
}


drawNodeView.prototype.retrieveDtcforHis = function(self){
	var list = []
	for(var i = 0; i < this.selectedEntities.length; i++){
		if(this.selectedEntities[i].type == "tumor") continue;
		list.push(this.selectedEntities[i])
	}
	if(list.length == 0 ){
        this.count.total--;
        if(this.count.total == 0){
            this.count.total--;
            this.drawNode()
            $("#iframeFader").hide()
        }
    }
    else 
    $.ajax({
            type: "POST",
            url: "/bio",
            contentType:'application/json',
            dataType: "json",
            data: JSON.stringify(list),
            success: function(response){
                try{
                	var list = [];
                    for(var i = 0; i < response.length; i++){
                    // var re = $.grep(selectedHisData, function(e){
                    //     return e.drug == response[i].drug && e.mutation == response[i].mutation;
                    // })
                    // if(re.length == 0){
                        var ob =  {drug: response[i].Drug, mutation: response[i].Mutation, value: {evidence: "pre-clinical", dataset: "dtc"}, tumor: "Cancer unspecified"};
                        if(response[i].potencyState != "inactive") ob.value.effect = "Responsive"
                        else ob.value.effect = "Resistant"
                        ob.value.bioactivities = response[i].bios;
                        ob.value.bioactivities[0]["Compound ID"] = response[i]["Compound ID"]
                        ob.value.bioactivities[0]["Target Pref Name"] = response[i]["Target Pref Name"]
                        ob.value.bioactivities[0]["Target ID"] = response[i]["Target ID"]

                        ob.value.med = response[i].med;
                        //console.log(ob.value.bioactivities)
                        list.push(ob)
                    // }
                    
                  }
                  self.selectedHisData = self.selectedHisData.concat(list)
                  //callback(entity)
                }
                catch(e){
                  console.log("error catch " + e)
                  //callback(entity)
                }
                self.count.total--;
                if(self.count.total == 0){
                    self.count.total--;
                    self.drawNode()
                    $("#iframeFader").hide()
                }
            },
            error: function () {
                console.log("get page request failed.");
                self.count.total--;
                if(self.count.total == 0){
                    self.count.total--;
                    self.drawNode()
                    $("#iframeFader").hide()
                }
            },
        })
}

drawNodeView.prototype.retrieveEffectsforHis = function(self){
	$.ajax({
            type: "POST",
            url: "/effect",
            contentType:'application/json',
            dataType: "json",
            data: JSON.stringify(this.selectedEntities),
            success: function(response){
                //console.log(response)
                self.selectedHisData = self.selectedHisData.concat(response)
                self.count.total--;
                if(self.count.total == 0){
                    self.count.total--;
                    self.drawNode()
                    $("#iframeFader").hide()
                }
            },
            error: function () {
                console.log("get page request failed.");
                self.count.total--;
                if(self.count.total == 0){
                    self.count.total--;
                    self.drawNode()
                    $("#iframeFader").hide()
                }
            },
        })
}

// drawNodeView.prototype.addDataforHisVis = function(){
// 	//var disData = {colMuTu : [], disTumors: [], dataRow: [], selectedEntities: [], scrollDis: {scrollbarLength: 0, brushWidth: 0, linearScale:{}}}
// 	for(var i = 0; i < this.selectedHisData.length; i++){
// 		addDataforVis(this.selectedHisData[i], this.disData)
// 	}
// 	drawHisMatrix(this.disData)
// }

drawNodeView.prototype.drawHisMatrix = function(div, disData){
	drawMutationHeader(div, disData);
	drawRows(div)
    setMatrixHeightWidth(div)
	updateMutationHeader(div, disData, 0);
    updateDataRow(div, disData);
    rowTransition(0, div, disData);
    updateColBackground(div, disData);
    updateBodyHeightWidth(div, disData);
    d3.select(div).on("mousewheel.zoom", function(){
        mouseScrollHorizontal(div, disData)
    });

}

