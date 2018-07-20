function drawNodeView(username, root, i, historyArray){
    this.selectedEntities = []
    this.selectedHisData = []
    this.count = {total: 2};
    this.root = root
    this.gridDim = {row: 1, col: 1}
    this.marginTop = 8;
    this.noteOrder = i;
    this.interactionHistory = historyArray;
    this.username = username;
    //console.log(historyArray[historyArray.length - 1]);
    //this.noteTime = historyArray[historyArray.length - 1]._id;
}

var nodeViewArray = []


function drawHisView(username, rootNode, i, historyArray){
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

     var nodeView = new drawNodeView(username, rootNode, i, historyArray)
     nodeView.removeSomeNodes(nodeView.root)

     nodeView.getGridDim(nodeView.root, 1, 1)
     //nodeView.gridDim.row++;
     //nodeView.noteOrder = i;
     nodeViewArray.push(nodeView);
     
     //nodeView.selectedEntities = removeDuplicates(nodeView.selectedEntities, "entity")
     //d3.select("#grid" + i).style("grid-template-rows", "repeat("+ nodeView.gridDim.row + ", minmax(30px, " + 100/nodeView.gridDim.row + "%)")
     //d3.select("#grid" + i).style("grid-template-columns", "repeat("+ nodeView.gridDim.col + ",minmax(100px, " + 100/nodeView.gridDim.col + "%)")
     //console.log(nodeView.selectedEntities)
     //nodeView.drawNode()
     //nodeView.drawTimeSeries()
     //nodeView.retrieveDtcforHis(nodeView)
     //nodeView.retrieveEffectsforHis(nodeView)
}

function drawGrid(){
    var grid = d3.select("body").selectAll(".groupDiv").data(nodeViewArray);
    var gridEnter = grid.enter().append("div").attr({
        class: "groupDiv"
    })
    gridEnter.append("label").text(function(d){ return d.username })
    gridEnter.append("grid").attr({
        id: function(d,i){ return "grid" + i },
        class: "grid"
     })
    grid.exit().remove();

    d3.selectAll(".grid").each(function(d){
        d.drawNode()
    })
}



drawNodeView.prototype.drawViewFrame = function(){//(action, rowCount, row, col, text){
    var self = this;
    var div = d3.select("#grid" + this.noteOrder).selectAll(".gridDiv").data(this.interactionHistory);
    var divEnter = div.enter().append("div").attr({
        class: "gridDiv"
    })
    div.exit().remove();
    //div.order();
    divEnter.append("div").attr("class", "intro").append("text").style("word-wrap", "break-word")

    divEnter.append("div").attr({
        id: function(d){ return d.action + d.row + d.col + self.noteOrder},
        class: "disDiv",
    })
    // .style({
    //     //"margin-top": ($("#" + action + row + col).parent().children(".intro").height() + this.marginTop) + "px",
    //     height: function(d){
    //         return ($("#" + d.action + d.row + d.col).parent().height() - $("#" + d.action + d.row + d.col).parent().children(".intro").height() - self.marginTop) + "px";
    //     }
    // })
    //var struc = localStorage.getItem("mediSynHisStruc");

    //if(struc == "context")
        //this.toTreeStruc()
    //else this.toLinearStruc()
}

function toTreeStruc(){
    d3.selectAll(".grid").each(function(d){
        //height: "calc(100vh - 30px)",
        //width: "100vw"
    //})
    d3.select(this).style("grid-template-rows", "repeat("+ d.gridDim.row + ", 80px")//minmax(30px, " + 100/d.gridDim.row + "%)")
    d3.select(this).style("grid-template-columns", "repeat("+ d.gridDim.col + ", 200px") //minmax(100px, " + 100/d.gridDim.col + "%)")
     
    d3.select(this).selectAll(".gridDiv").style({
        "grid-row": function(da){return da.row + "/ span " + da.rowCount},
        "grid-column": function(da){return da.col + "/ span 1"},
    })
})
    d3.selectAll(".disDiv").each(function(d){
        d3.select(this).style({
            height: ( $(this).parent().height() - $(this).parent().children(".intro").height() - 8) + "px"  
        })
    })
    // this.updateNodeSize()
}

function toLinearStruc(){
    d3.selectAll(".grid").each(function(d){
    //     height: "calc(100vh - 30px)",
    //     width: "100vw"
    // })
    d3.select(this).style("grid-template-rows", "repeat(1, 300px)")
    d3.select(this).style("grid-template-columns", "repeat("+ d.interactionHistory.length + ", 200px")//minmax(100px, " + 100/d.interactionHistory.length + "%)")
     
    d3.select(this).selectAll(".gridDiv").style({
        "grid-row": function(da){return "1 / span 1"},
        "grid-column": function(da, i){return (i + 1) + "/ span 1"},
    })
})
    d3.selectAll(".disDiv").each(function(d){
        d3.select(this).style({
            height: ( $(this).parent().height() - $(this).parent().children(".intro").height() - 8) + "px"  
        })
    })
    // this.updateNodeSize()
}

drawNodeView.prototype.drawTimeSeries = function(){
    this.interactionHistory.sort(function(a,b) {return (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0);} ); 
    var text = "";
    for(var i = 0; i < this.interactionHistory.length; i++){
        text += this.interactionHistory[i].action + "; ";
    }
    this.drawViewFrame("all", 1, this.gridDim.row, 1, text)
}

drawNodeView.prototype.getGridDim = function(treeNode, row, col){
    //console.log(treeNode.action)

    //console.log(treeNode.action + " " +  treeNode._id + " " + treeNode.children)
    //if(coActions.indexOf(treeNode.action) > -1){
        //this.selectedEntities = this.selectedEntities.concat(treeNode.selectedEntities)
    //}
    if(coActions.indexOf(treeNode.action) > -1){
        this.selectedEntities = this.selectedEntities.concat(treeNode.selectedEntities)
    }
    //var rowCount = 0;
    treeNode.row = row;
    treeNode.col = col;
    treeNode.rowCount = (!treeNode.children.length ? 1 : 0);
    for(var i = 0; i < treeNode.children.length; i++){
        var node = this.nodeFromId(treeNode.children[i]);
        // if(typeof node == "undefined"){
        //     //console.log(treeNode.children[i])
        //     treeNode.children.splice(i , 1)
        // }
        // else{
            this.getGridDim(node, row + treeNode.rowCount, col + 1)
            treeNode.rowCount += node.rowCount;
        // }
        //rowCount += node.row;
    }
    //if(this.gridDim.row < row + treeNode.children.length - 1 || (treeNode.children.length > 0 && this.gridDim.col < col + 1)){
    if(this.gridDim.row < row + treeNode.rowCount - 1) this.gridDim.row = row + treeNode.rowCount - 1
    if(treeNode.children.length > 0 && this.gridDim.col < col + 1) this.gridDim.col = col + 1
    
    // treeNode.row = 0;
    // var rowCount = 0;
    // for(var i = treeNode.children.length - 1; i > -1; i--){
    //     var node = this.nodeFromId(treeNode.children[i]);
    //     if(typeof node == "undefined"){
    //         //console.log(treeNode.children[i])
    //         treeNode.children.splice(i , 1)
    //     }
    //     else{
    //      this.getGridDim(node, row + rowCount, col + 1)
    //      treeNode.row += node.row;
    //      rowCount += node.row;
    //     }
    // }
    // if(!treeNode.row)
    //     treeNode.row = 1//(!treeNode.children.length ? 1 : 0);

    // //if(this.gridDim.row < row + treeNode.children.length - 1 || (treeNode.children.length > 0 && this.gridDim.col < col + 1)){
    //     if(this.gridDim.row < row + treeNode.row - 1) this.gridDim.row = row + treeNode.row - 1
    //     if(treeNode.children.length > 0 && this.gridDim.col < col + 1) this.gridDim.col = col + 1
    //}
}

drawNodeView.prototype.removeSomeNodes = function(node){
    for(var i = node.children.length - 1; i > -1 ; i--){
    //console.log(child(node.children[i]));
        var child = this.nodeFromId(node.children[i])
        //console.log(child)
        if(typeof child != "undefined" )
            this.removeSomeNodes(child)
        else node.children.splice(i, 1)
    }
}

drawNodeView.prototype.nodeFromId = function(id){
    return $.grep(this.interactionHistory, function(e){
        return e._id == id;
    })[0]
}

drawNodeView.prototype.drawNode = function (){
    //if(treeNode == null) return;
    this.drawViewFrame();
    var selectEntity = []
    for(var i = 0; i < this.interactionHistory.length; i++){
        var treeNode = this.interactionHistory[i]
        if(coActions.indexOf(treeNode.action) > -1){
            if(treeNode.action == "deselect"){
                var re = $.grep(selectEntity, function(e){
                    return e.entity == treeNode.entity;
                })
                selectEntity.splice(selectEntity.indexOf(re[0]), 1)
            }
            else 
                selectEntity.push({action: treeNode.action, entity: treeNode.entity})
            this.drawSelectionView(treeNode, selectEntity);
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
        else if(treeNode.action == "hoverEntity"){
            this.drawHoverEntityView(treeNode)
        }
        else if(treeNode.action == "hoverData"){
            this.drawHoverDataView(treeNode)
        }
        else if(treeNode.action == "up" || treeNode.action == "down"){
            this.drawUpDownView(treeNode)
        }
        else if(treeNode.action == "statistics"){
            this.drawStaView(treeNode)
        }
        else console.log(treeNode.action)
    }
    //this.updateNodeSize()

    // if(coActions.indexOf(treeNode.action) > -1){
    //     this.drawSelectionView(treeNode, row, col);
    // }
    // else if(treeNode.action == "pivot"){
    //     this.drawPivotView(treeNode, row, col);
    // }
    // else if(treeNode.action == "detail"){
    //     this.drawDetailView(treeNode, row, col);
    // }
    // else if(treeNode.action == "pub"){
    //     this.drawPubView(treeNode, row, col);
    // }
    // else if(treeNode.action == "noteDis"){
    //     this.drawNoteDisView(treeNode, row, col);
    // }
    // else if(treeNode.action == "allNote"){
    //     this.drawNoteDisView(treeNode, row, col);
    // }
    // else if(treeNode.action == "writeNote" || treeNode.action == "editNote"){
    //     this.drawNoteDisView(treeNode, row, col)
    // }
    // else if(treeNode.action == "viewHis"){
    //     this.drawNoteDisView(treeNode, row, col)
    // }
    // else if(treeNode.action == "hoverEntity"){
    //     this.drawHoverEntityView(treeNode, row, col)
    // }
    // else if(treeNode.action == "hoverData"){
    //     this.drawHoverDataView(treeNode, row, col)
    // }
    // else if(treeNode.action == "up" || treeNode.action == "down"){
    //     this.drawUpDownView(treeNode, row, col)
    // }
    // var rowCount = 0;
    // for(var i = 0; i < treeNode.children.length; i++){
    //     var n = this.nodeFromId(treeNode.children[i])
    //     if(typeof n != "undefined"){
    //         this.drawNode(n, row + rowCount, col + 1)
    //         rowCount += n.row;
    //     }
    // }
    
}


// drawNodeView.prototype.drawWriteNoteView = function(treeNode,row,col){
    
// }
// drawNodeView.prototype.drawViewFrame = function(){//action, rowCount, row, col, text){
//     var self = this;
//     var div = d3.select("#grid" + this.noteOrder).append("div").style({
//         "grid-row": row + "/ span " + rowCount,
//         "grid-column": function(){
//             if(action == "all") return col + "/ span " + self.gridDim.col;
//             return col + "/ span 1"
//         },
//     })
//     div.append("div").attr("class", "intro").append("text").text(text).style("word-wrap", "break-word")

//     div.append("div").attr({
//         "id": action + row + col + this.noteOrder,
//         class: "disDiv",
//     }).style({
//         //"margin-top": ($("#" + action + row + col).parent().children(".intro").height() + this.marginTop) + "px",
//         height: ( $("#" + action + row + col + this.noteOrder).parent().height() - $("#" + action + row + col + this.noteOrder).parent().children(".intro").height() - this.marginTop) + "px"  
//     })
// }

drawNodeView.prototype.drawStaView = function(treeNode){
    $("#" + treeNode.action + treeNode.row + treeNode.col + this.noteOrder).parent().children(".intro").find("text").text("exploring: " + treeNode.exploring + "; comparing: " + treeNode.comparing.length + " [" + treeNode.comparing.join(", ") + "]; elaborating: " + treeNode.elaborating.length + " [" + treeNode.elaborating.join(", ") + "]; viewHis: " + treeNode.viewHis.length + "[" + treeNode.viewHis.join(", ") + "]; pub: " + treeNode.pub)
}

drawNodeView.prototype.drawHoverEntityView = function(treeNode){
    //this.drawViewFrame("hoverentity", treeNode.row, row, col, treeNode.action + ": " + treeNode.entity)
    $("#" + treeNode.action + treeNode.row + treeNode.col + this.noteOrder).parent().children(".intro").find("text").text(treeNode.action + ": " + treeNode.entity)
}

drawNodeView.prototype.drawUpDownView = function(treeNode){
    //this.drawViewFrame("updown", treeNode.row, row, col, treeNode.action + ": " + treeNode.noteid + " " + treeNode.state)
    $("#" + treeNode.action + treeNode.row + treeNode.col + this.noteOrder).parent().children(".intro").find("text").text(treeNode.action + ": " + treeNode.noteid + " " + treeNode.state)
}

drawNodeView.prototype.drawHoverDataView = function(treeNode){   
    //this.drawViewFrame("hoverdata", treeNode.row, row, col, treeNode.action + ": " + treeNode.drug + " " + treeNode.mutation + " " + treeNode.tumor)
    $("#" + treeNode.action + treeNode.row + treeNode.col + this.noteOrder).parent().children(".intro").find("text").text(treeNode.action + ": " + treeNode.drug + " " + treeNode.mutation + " " + treeNode.tumor)

}

drawNodeView.prototype.drawSelectionView = function(treeNode, selectAction){
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

    //var text = "Select. Selected entities: " + treeNode.selectedEntities.map(a => a.entity).join(", ") + "."
    var text = ""
    for(var i = selectAction.length - 1; i > -1; i--){
        text += selectAction[i].action + ": " + selectAction[i].entity + "; \n";
    }
    if(treeNode.action == "deselect") text = "deselect. " + text
    //this.drawViewFrame(treeNode.action, treeNode.row, row, col, treeNode.action + ": " + treeNode.entity + " \n Selected entities: " + treeNode.selectedEntities.map(a => a.entity).join(", "))
    $("#" + treeNode.action + treeNode.row + treeNode.col + this.noteOrder).parent().children(".intro").find("text").text(text);//treeNode.action + ": " + treeNode.entity + " \n Selected entities: " + treeNode.selectedEntities.map(a => a.entity).join(", "))

        // if(!treeNode.hasOwnProperty("message"))
      
    //console.log($("#intro" + row + col).height())
    
    // console.log($("#grid > div").height() + " " + $("#intro" + row + col).height() )
    disData.selectedEntities = treeNode.selectedEntities;
    //console.log(disData)

    //this.drawHisMatrix("#select" + row + col, disData)
    //this.drawDec
}

function selectText(treeNode){
    var text = "Select actions";
    var currentAction = "";
     // var state = {add: "", noteSelect: ""}
    if(treeNode.hasOwnProperty("message"))
    for(var i = 0; i < treeNode.message.length; i++){
        switch(treeNode.message[i].action){
            case "select": if(currentAction == "select") text += ", " + treeNode.message[i].entity; 
            else{ 
                text += ". Select from the list: " + treeNode.message[i].entity;
                currentAction = "select"
            }
            break;
            case "deselect": if(currentAction == "deselect") text += ", " + treeNode.message[i].entity; 
            else{
                text += ". Deselect: " + treeNode.message[i].entity;
                currentAction = "deselect";
            }
            break;
            case "add": if(currentAction == "add") text += ", " + treeNode.message[i].entity; 
            else{
                text += ". Add from the view: " + treeNode.message[i].entity;
                currentAction = "add";
            } 
            break;
            case "noteSelect": if(currentAction == "noteSelect") text += ", " + treeNode.message[i].entity; 
            else{
                text += ". Select from the notes: " + treeNode.message[i].entity;
                currentAction = "noteSelect";
            }
            break;
        }
    }
    else switch(treeNode.action){
        case "select": text = "Select from the list: " + treeNode.entity; break;
        case "deselect": text = "Deselect: " + treeNode.entity; break;
        case "add": text = "Add from the view: " + treeNode.entity; break;
        case "noteSelect": text = "Select from the note: " + treeNode.entity; break;
    }
    text += ". \nSelected entities: " + treeNode.selectedEntities.map(a => a.entity).join(", ") + "."

    // var s = "Selected entities: " + entityNames.join(" ") + "."
    // if(state.add != "")
    //     s += "\nAdded from the view: " + state.add.slice(0, -2) + ".";
    // if(state.noteSelect != "") 
    //     s += "\nSelected from note(s):" + state.noteSelect.slice(0, -2) + ".";
    return text;
}
    
drawNodeView.prototype.drawPivotView = function(node){
    var list = [];
    // for(var i = 0; i < this.selectedHisData.length; i++){
    //     if(this.selectedHisData[i][node.type] == node.entity){
    //         list.push(this.selectedHisData[i])
    //     }
    // }
    // var disData = {colMuTu : [], disTumors: [], dataRow: [], selectedEntities: [], scrollDis: {scrollbarLength: 0, brushWidth: 0, linearScale:{}}, dataset: node.dataset}
    // for(var i = 0; i < list.length; i++){
    //     addDataforVis(list[i], disData)
    // }
    //this.drawViewFrame("pivot", node.row, row, col, "Pivot: " + node.entity)
    $("#" + node.action + node.row + node.col + this.noteOrder).parent().children(".intro").find("text").text("Pivot: " + node.entity)

    //disData.selectedEntities.push({entity: node.entity, type: node.type})
    //this.drawHisMatrix("#pivot" + row + col, disData)
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
    //this.drawViewFrame("detail", node.row, row, col, "Detail. \ndrug: " + node.drug + "; tumor: " + node.tumor + "; mutation: " + node.mutation)
    $("#" + node.action + node.row + node.col + this.noteOrder).parent().children(".intro").find("text").text("Detail. \ndrug: " + node.drug + "; tumor: " + node.tumor + "; mutation: " + node.mutation)
    //: Relation between " + node.drug + " and " + node.mutation
    //+ " in " + node.tumor + " from " + node.dataset + ".")
    //this.drawHisMatrix("#detail" + row + col, disData);
    //drawDetailDis("#detail" + row + col);
    //valueClick(data[0], "#detail" + row + col)

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
    $("#" + node.action + node.row + node.col + this.noteOrder).parent().children(".intro").find("text").text("Retrieve a publication.")

    //: Relation between " + node.drug + " and " + node.mutation
    //+ " in " + node.tumor + " from " + node.dataset + ".")
    
    //console.log(node.pmid)
    //var div = document.getElementById("pub" + row + col);
    //div.innerHTML = '<iframe style="width:100%;height:100%;" frameborder="0" src="' + "https://www.ncbi.nlm.nih.gov/pubmed/" + node.pmid + '" />';
    var text = d3.select("#pub" + node.row + node.col + this.noteOrder).append('text').text("DOI ").style("font-weight", "bold");
    d3.select("#pub" + node.row + node.col + this.noteOrder).append("a")
     .style({
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
    $("#" + node.action + node.row + node.col + this.noteOrder).parent().children(".intro").find("text").text(text).css({
        background: function(d){if(node.action == "writeNote" && noteids.indexOf(node._id) >= 0){
            console.log(node.row + ";" + node.col + ";" + node._id)
            return "yellow"; 
        }
        return "write";}
    })

    var self = this;
    //: Relation between " + node.drug + " and " + node.mutation
    //+ " in " + node.tumor + " from " + node.dataset + ".")
    if(node.action != "allNote")
    $.ajax({
        type: "POST",
        url: "/getnotes",
        contentType:'application/json',
        dataType: "json",
        data: JSON.stringify({ids: node.noteids, username: ""}),
        success: function(response){
            //console.log(response)
            
            //console.log($("#noteDis" + row + col).parent().children(".intro").height())
            if(response.hasOwnProperty("message")){
                $("#" + node.action + node.row + node.col + self.noteOrder).html(response.message)
            }
            else{
                drawNoteFramework("#" + node.action + node.row + node.col + self.noteOrder)
                drawNotesFromRes({entity: node.entity, type: node.type}, response, "#" + node.action + node.row + node.col + self.noteOrder)
            }
        },
        error: function () {
            console.log("get notes failed.");
        },
    })
}

//var patternCsv = "totalGroup;total;selectFrac;selectGroupFrac;selectGroup;select;selectTotal;exploreFrac;exploreGroupFrac;exploreGroup;explore;exploreDetail;exploreTotal;compareFranc;compareGroupFrac;compareTimes;compareGroup;compare;compareDetail;compareTotal;elaFrac;elaborateGroupFrac;elaborateGroup;elaborate;elaDetail;elaTotal;noteFrac;noteGroupFrac;noteGroup;note;noteDetail;noteTotal;noteid;interrupt;action;id\n";
var patternCsv = "selectTotal;exploreTotal;pivotTotal;elaTotal;noteTotal;noteid;interval;action;id\n"
var traces = "";
var c20 = d3.scale.category20();

//var countSteps = "step;note;action;time\n"
function getAllNotesHistory(){
    $.ajax({
        type: "POST",
        url: "alluserhis",//"/allnotehis",
        dataType: "json",
        success: function(response){
            //console.log(response)
            var order = 0;
            for(var i = 0; i < response.length; i++){
                //console.log(response[i])
                var temp = response[i]

                for(var j = 0; j < temp.interactions.length; j++){
                //interactionHistory = ;    
                //countPatternsForEach(response[i])
                //getTraces(response[i], temp)
                //getNeighborActions(response[i])      
                    drawHisView(temp.username + " " + temp.index, temp.interactions[j][0], order, temp.interactions[j])
                    order++;
                }
            }
            //console.log(response);
            var allActionsForDis = ["select", "deselect", "add from the view", "select from a note", "pivot", "hover over an entity", "display notes of an entity", "display all notes", 
            "detail", "hover over a data cell", "retrieve a publication", ",", "view provenance of a note", "thumbs up", "write a note"]
            // var g = d3.select("svg").append("g").attr({
            //     transform: "translate(11,0)"
            // })
            // var header = g.selectAll(".header").data(allActionsForDis)
            // var headerEnter = header.enter().append("rect").attr({
            //     class: "header",
            //     height: 10,
            //     width: 10,
            //     fill: function(d){return c20(allActionsForDis.indexOf(d))},
            // })
            // d3.select("svg").append("g").attr({
            //     class: "matrix",
            //     transform: "translate(0,11)"
            // })
            // var dis = 0;
            // d3.selectAll(".header").each(function(d, i){
            //     if(i == 11|| i== 13){
            //         d3.select(this).style("display", "none")
            //         return
            //     }
            //     d3.select(this).attr("transform", "translate(" + dis + ",0)")
            //     dis += 11;
            // })
            // var g = d3.select("#trailG").selectAll(".parts").data(new Array(2))
            // var gEnter = g.enter().append("g").attr({
            //     class: "parts"
            // })
            // g.exit().remove();
            //var shift = 0;
            // d3.selectAll(".rows").each(function(d, i){
            //     d3.select(this).attr("transform", "translate(0," + shift + ")")
            //     shift += 9;
            //     // if(i < 4){
            //     //     shift += 9;
            //     //     return;
            //     // }
            //     // if(notesDisWithOrder[i - 4].length > 2){
            //     //     shift += 9;
            //     // }
            //     // else{
            //     //     shift += 3;
            //     // }
            // })
            // drawParallelCor(drawTrail, response);

            // var ins = d3.select(".parts:nth-child(1)").selectAll("g").data(allActionsForDis)
            // var insEnter = ins.enter().append("g").attr({
            //     //transform: function(d,i){return "translate(" + 100*i + ",0)"}
            // });
            // ins.exit().remove();
            // insEnter.append("rect").attr({
            //     height: 8,
            //     width: 5,
            //     fill: function(d){return c20(allActionsForDis.indexOf(d))},
            //     //transform: function(d,i){ return "translate(" + i*30 + ",0)"}
            // })
            // insEnter.append("text").text(function(d){return d;}).style({
            //     "text-anchor": "start",
            //     "alignment-baseline": "hanging"
            // }).attr({
            //     transform: "translate(6,0)"
            // })

            // shift = 0;
            // d3.select(".parts:nth-child(1)").selectAll("g").each(function(d, i){
            //     if(i == 11 || i == 13){
            //         d3.select(this).style("display", "none")
            //         return;
            //     }
            //     if(i <= 7){
            //         d3.select(this).attr({
            //             transform: "translate(" + shift + ",0)"
            //         })
            //     }
            //     else{
            //         d3.select(this).attr({
            //             transform: "translate(" + shift + ",14)"
            //         })
            //     }
            //     shift += d3.select(this).node().getBoundingClientRect().width + 3
            //     if(i == 7) shift = 0;
            // })
            
            //drawNeighbors()
            //console.log(neighbors)
            //download("traces.csv", traces)
            //download("count.csv", countSteps)
            drawGrid()
            toTreeStruc()
        },
        error: function(){
            console.log("all his failed.")
        }
    })
}
//drawParallelCor();

function drawTrail(response){
    updateTrailRows(true);
    var temp = trailArray.map(function(e) { return e.time; })
    temp = temp.filter(function(elem, pos) {
                return temp.indexOf(elem) == pos;
            })
    //console.log(temp)
    for(var i = 0; i < response.length; i++){
        //interactionHistory = ;    
        //countPatternsForEach(response[i])
        getTraces(response[i], temp)
        //getNeighborActions(response[i])      
        //drawHisView(response[i][0], i, response[i])
    }
}

function updateTrailRows(first = false){
    var temp = trailArray.map(function(e) { return e.time; })
    var row = d3.select(".parts:nth-child(2)").attr("transform", "translate(0, 36)")
                .selectAll(".rows").data(temp.filter(function(elem, pos) {
                return temp.indexOf(elem) == pos;
            }), function(d){return d;});
    var rowEnter = row.enter().append("g").attr({
        class: "rows"
    })
    row.exit().remove();
    row.order();

    var t = 1000;
    if(first) t = 0;
    d3.selectAll(".rows").transition().duration(t).attr({
        transform: function(d, i){
            return "translate(0," + 9*i + ")"
        }
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
            this.drawNode(this.root, 1, 1)
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
                    self.drawNode(self.root, 1, 1)
                    $("#iframeFader").hide()
                }
            },
            error: function () {
                console.log("get page request failed.");
                self.count.total--;
                if(self.count.total == 0){
                    self.count.total--;
                    self.drawNode(self.root, 1, 1)
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
                    self.drawNode(self.root, 1, 1)
                    $("#iframeFader").hide()
                }
            },
            error: function () {
                console.log("get page request failed.");
                self.count.total--;
                if(self.count.total == 0){
                    self.count.total--;
                    self.drawNode(self.root, 1, 1)
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

function drawAllUserHis(){
    $.ajax({
        type: "POST",
        url: "/alluserhis",
        contentType:'application/json',
        dataType: "json",
        //data: JSON.stringify(this.selectedEntities),
        success: function(response){
            console.log(response)
            var div = d3.select("body").selectAll(".userDiv").data(response)
            var divEnter = div.enter().append("div").attr({
                class: "userDiv"
            }).append("p").text(function(d){return d.username})
            div.exit().remove()
            d3.selectAll(".userDiv").each(function(d){
                var pAction = d3.select(this).selectAll(".actions").data(d.interactions);
                var pEnter = pAction.enter().append("p").attr({
                    class: "actions"
                }).text(function(actions){
                    var t = "";
                    for(var j = 0; j < actions.length; j++){
                        if(actions[j].action == "writeNote" || actions[j].action == "editNote")
                            t += actions[j].action + " " + actions[j]._id + ";"
                        else
                        t += actions[j].action + ";"
                    }
                    return t;
                })
                pAction.exit().remove();
                
            })
        },
        error: function () {
            console.log("get all user his failed.");
        },
    })
}


function countFailTrail(){
    var result = "p;total;select;explore;pivot;elaborate;note\n";
    d3.text("javascripts/failTrail.csv", function(error, textString){
        var rows = textString.split("\n")
        for(var i = 0; i < rows.length; i++){
            var data = rows[i].split(";")
            var rowCount = {participant: 0, select: 0, explore: 0, pivot: 0, elaborate: 0, note: 0};
            rowCount.participant = data[0];
            for(var j = 1; j < data.length; j++){
                if(data[j] == "select") rowCount.select++;
                if(data[j] == "noteSelect" || data[j] == "add") rowCount.explore++;
                if(data[j] == "pivot" || data[j] == "hoverEntity") rowCount.pivot++;
                if(data[j] == "detail" || data[j] == "hoverData") rowCount.elaborate++;
                if(data[j] == "noteDis" || data[j] == "viewHis" || data[j] == "allNote" || data[j] == "up")
                    rowCount.note++;
                //if(data[j].indexOf("writeNote") > -1)
            }
            result += rowCount.participant + ";" + (rowCount.select + rowCount.explore + rowCount.pivot + rowCount.elaborate + rowCount.note) + ";" + rowCount.select + ";" + rowCount.explore + ";" + rowCount.pivot + ";" + rowCount.elaborate + ";" + rowCount.note + "\n"
        }
            download("fail.csv", result)
    })
}
//drawPlainTrail()

function drawPlainTrail(){
    var allActionsForDis = ["select", "deselect", "add from the view", "select from a note", "pivot", "hover over an entity", "display notes of an entity", "display all notes", 
            "detail", "hover over a data cell", "retrieve a publication", ",", "view provenance of a note", "thumbs up", "write a note"]
    var g = d3.select("#trailG").selectAll(".parts").data(new Array(2))
    var gEnter = g.enter().append("g").attr({
        class: "parts"
    })
    g.exit().remove();

    d3.text("javascripts/failTrail.csv", function(error, textString){
        var rows = textString.split("\n")

        var g = d3.select(".parts:nth-child(2)").selectAll(".rows").data(rows)
        var gEnter = g.enter().append("g").attr({
            class: "rows"
        })
        g.exit().remove();

        var shift = 0;
        var cur = 1;
        d3.selectAll(".rows").each(function(d){
            d3.select(this).attr("transform", "translate(0," + shift + ")")
            var data = d.split(";");
            if(data[0] == cur) shift += 9;
            else{
                shift += 12;
                cur = data[0]
            }

            var row = d3.select(this).selectAll("rect").data(data.slice(1, data.length-1))
            var rowEnter = row.enter().append("rect").attr({
                height: 8,
                width: 5,
                fill: function(p){if(p.indexOf("writeNote") > -1) return c20(allActions.indexOf("writeNote")); return c20(allActions.indexOf(p))},
                transform: function(d,i){ return "translate(" + i*6 + ",0)"}
            })
            row.exit().remove();
        })
    })
    // var shift = 0;
    // d3.selectAll(".rows").each(function(d, i){
        
    //     // if(i < 4){
    //     //     shift += 9;
    //     //     return;
    //     // }
    //     // if(notesDisWithOrder[i - 4].length > 2){
    //     //     shift += 9;
    //     // }
    //     // else{
    //     //     shift += 3;
    //     // }
    // })

    var ins = d3.select(".parts:nth-child(1)").selectAll("g").data(allActionsForDis)
    var insEnter = ins.enter().append("g").attr({
        //transform: function(d,i){return "translate(" + 100*i + ",0)"}
    });
    ins.exit().remove();
    insEnter.append("rect").attr({
        height: 8,
        width: 5,
        fill: function(d){return c20(allActionsForDis.indexOf(d))},
        //transform: function(d,i){ return "translate(" + i*30 + ",0)"}
    })
    insEnter.append("text").text(function(d){return d;}).style({
        "text-anchor": "start",
        "alignment-baseline": "hanging"
    }).attr({
        transform: "translate(6,0)"
    })

    shift = 0;
    d3.select(".parts:nth-child(1)").selectAll("g").each(function(d, i){
        if(i == 11){
            d3.select(this).style("display", "none")
            return;
        }
        if(i <= 7){
            d3.select(this).attr({
                transform: "translate(" + shift + ",0)"
            })
        }
        else{
            d3.select(this).attr({
                transform: "translate(" + shift + ",14)"
            })
        }
        shift += d3.select(this).node().getBoundingClientRect().width + 3
        if(i == 7) shift = 0;
    })

    d3.select(".parts:nth-child(2)").attr("transform", "translate(0,30)")
}

function countPatterns(array){
    //"select", "add", "noteSelect", "deselect", "pivot", "detail", "pub", "noteDis", "allNote", "writeNote", 
    //"editNote", "viewHis", "hoverEntity", "hoverData", "up", "down"
    var exploreTotal = 0;
    var exploring = [];
    var exploreArray = []
    var exploreCount = 0;
    var elaborating = [];
    var exploringNotes = [];
    var exploreingNoteTotal = 0;
    var exploringNotesCount = 0;

    var elaTotal = 0;
    var comTotal = 0;
    var comparing = [];//{count: }
    var comparingCount = 0;
    var comparingArray = []
    var elaArray = []
    var elaCount = 0;
    var inEla = false;
    var inComp = false;
    var inSel = false;
    var inExp = false;
    var inNote = false;
    // var pub = 0;
    // var viewHisArray = [];
    var selectTotal = 0;
    var selecting = [];
    var selectCount = 0;
    // var up = 0;
    // var down = 0;
    // var noteDisCount = 0;
    var noteDisArray = [];
    for(var i = 0; i < array.length; i++){
        //var entity = array[i].entity;
        var action = array[i].action;
        if(action == "select"){
            if(!inSel) inSel = true;
            selectCount++;
            selectTotal++;
        }
        else{
            if(inSel){
                inSel = false;
                selecting.push(selectCount)
                selectCount = 0;
            }
        }
        // if(action == "up") up++;
        // if(action == "down") down++;
        if(action == "noteDis" || action == "allNote" || action == "viewHis" || action == "up" || action == "down"){
            inNote = true;
            exploringNotesCount++;
            exploreingNoteTotal++;
            if(action == "viewHis"){
                noteDisArray.push("VH:" + array[i].children.length)
            }
            else if(action == "noteDis"){
                noteDisArray.push("NDis:" + array[i].children.length)
            }
            else if(action == "allNote") noteDisArray.push("AllN:" + array[i].children.length)
            else if(action == "up") noteDisArray.push("up:" + array[i].children.length)
            else noteDisArray.push("down:" + array[i].children.length)
        }
        else{
            if(inNote){
                inNote = false;
                exploringNotes.push(exploringNotesCount);
                exploringNotesCount = 0;
                noteDisArray.push(",,")
            }
        }
        if(action == "noteSelect" || action == "add"){
            if(!inExp) inExp = true;
            exploreCount++;
            exploreTotal++;
            if(action == "noteSelect") exploreArray.push("NS")
            else exploreArray.push("add")
        }
        else{
            if(inExp){
                inExp = false;
                exploring.push(exploreCount)
                exploreCount = 0;
                exploreArray.push(",,")
            }
        }
        if(action == "hoverEntity" || action == "pivot"){
            if(!inComp){
                inComp = true;
            }
            comparingCount++;
            comTotal++;
            if(action == "hoverEntity") comparingArray.push("HE")
            else comparingArray.push("pivot")
        }
        else{
            if(inComp){
                inComp = false;
                comparing.push(comparingCount);
                comparingCount = 0;
                comparingArray.push(",,")
            }
        }
        if(action == "hoverData" || action == "detail" || action == "pub"){
            if(!inEla) inEla = true;
            elaCount++;
            elaTotal++;
            if(action == "hoverData") elaArray.push("HD")
            else if(action == "detail") elaArray.push("detail")
            else elaArray.push("pub")
        }
        else{
            if(inEla){
                inEla = false;
                elaborating.push(elaCount)
                elaCount = 0;
                elaArray.push(",,")
            }
        }
        //if(action == "pub") pub++;
        
    }
    //array.unshift({action: "statistics", exploring: exploring, pub: pub, elaborating: elaborating, comparing: comparing, viewHis: viewHisArray, parent: null, children: [array[0]._id]});
    //console.log(array[array.length - 1])
    var middle = -1;
    for(var i = array.length - 2; i >= 0; i--){
        if(array[i].action == "writeNote" || array[i].action == "editNote"){
            middle = i;
            break;
        }
    }
    if(middle != -1){
        countSteps += (array.length - middle - 1) + ";" + array[array.length - 1]._id + ";" + array[middle].action + ";" + array[middle]._id + "\n";
    }
    else
    countSteps += array.length + ";" + array[array.length - 1]._id + ";" + "none" + ";" + "none" + "\n";
    //var totalGroup = selecting.length + exploring.length + comparing .length + elaborating.length + exploringNotes.length;
    //var total = selectTotal + exploreTotal + comTotal + elaTotal + exploreingNoteTotal;
    //patternCsv += totalGroup + ";" + total + ";" + (selectTotal / total).toFixed(3).toString().replace(/\./g, ",") + ";" + (selecting.length / totalGroup).toFixed(3).toString().replace(/\./g, ",") + ";" + selecting.length + ";" + selecting.join(",,") + ";" + selectTotal + ";" + (exploreTotal / total).toFixed(3).toString().replace(/\./g, ",") + ";" + (exploring.length / totalGroup).toFixed(3).toString().replace(/\./g, ",") + ";" + exploring.length + ";" + exploring.join(",,") + ";" + exploreArray.join(",,") + ";" + exploreTotal + ";" + (comTotal / total).toFixed(3).toString().replace(/\./g, ",") + ";" + (comparing.length / totalGroup).toFixed(3).toString().replace(/\./g, ",") + ";" + comparing.length + ";" + comparing.filter(a => a > 1).length + ";" + comparing.join(",,") + ";" + comparingArray.join(",,") + ";" + comTotal + ";" + (elaTotal / total).toFixed(3).toString().replace(/\./g, ",") + ";" + (elaborating.length / totalGroup).toFixed(3).toString().replace(/\./g, ",") + ";"
     //+ elaborating.length + ";" + elaborating.join(",,") + ";" + elaArray.join(",,") + ";" + elaTotal + ";" + (exploreingNoteTotal / total).toFixed(3).toString().replace(/\./g, ",") + ";" + (exploringNotes.length / totalGroup).toFixed(3).toString().replace(/\./g, ",") + ";" + exploringNotes.length + ";" + exploringNotes.join(",,") + ";" + noteDisArray.join(",,") + ";" + exploreingNoteTotal + ";" + array[array.length - 1]._id + "\n"; 
    //console.log(viewHisArray.length + "     ;" + viewHisArray.join(","))
}

    var noteids = [
"2018.02.29_17:03:07:861",
"2018.02.29_16:55:46:54",
"2018.02.29_16:50:14:418",
"2018.02.29_16:40:58:274",
"2018.02.29_16:35:36:967",
"2018.02.29_14:52:59:995",
"2018.02.29_14:51:42:897",
"2018.02.29_13:50:26:290",
"2018.02.29_13:47:29:357",
"2018.02.29_13:32:03:820",
"2018.02.29_13:25:57:227",
"2018.02.29_13:15:40:352",
"2018.02.27_14:15:36:858",
"2018.02.27_14:10:11:333",
"2018.02.27_14:06:38:287",
"2018.02.27_12:25:44:501",
"2018.02.27_12:22:35:23",
"2018.02.27_12:19:35:42",
"2018.02.27_12:14:20:36",
"2018.02.27_12:06:07:996",
"2018.02.27_11:06:31:997",
"2018.02.27_11:00:23:314",
"2018.02.27_10:47:49:367",
"2018.02.27_10:37:21:231",
"2018.02.27_09:49:34:262",
"2018.02.27_09:32:00:303",
"2018.02.23_16:52:41:775",
"2018.02.23_16:32:43:713",
"2018.02.23_15:15:17:141",
"2018.02.23_15:08:46:656",
"2018.02.23_14:54:43:682",
"2018.02.23_14:50:15:429",
"2018.02.23_14:46:55:511",
"2018.02.23_10:33:03:900",
"2018.02.23_10:14:23:646",
"2018.02.23_09:43:19:514",
"2018.02.22_13:49:56:735",
"2018.02.22_13:36:12:329",
"2018.02.22_13:30:04:222",
"2018.02.22_13:19:58:846",
"2018.02.22_12:15:13:76",
"2018.02.22_12:07:56:235",
"2018.02.22_12:04:09:100",
"2018.02.22_11:54:03:444",
"2018.02.22_11:38:36:947",
"2018.02.20_11:41:30:532",
"2018.02.20_11:37:19:697",
"2018.02.20_11:35:18:936",
"2018.02.15_16:15:33:473",
"2018.02.15_16:11:34:995",
"2018.02.15_16:08:35:515",
"2018.02.15_16:04:05:965",
"2018.02.15_16:01:05:373",
"2018.02.15_15:59:33:731",
"2018.02.15_15:45:08:242",
]
console.log(noteids.length)

function countPatternsForEach(array){

if(ids.indexOf(array[array.length-1]._id) < 0) return;
    //"select", "add", "noteSelect", "deselect", "pivot", "detail", "pub", "noteDis", "allNote", "writeNote", 
    //"editNote", "viewHis", "hoverEntity", "hoverData", "up", "down"
    var exploreTotal = 0;
    var exploring = [];
    var exploreArray = []
    var exploreCount = 0;
    var elaborating = [];
    var exploringNotes = [];
    var exploreingNoteTotal = 0;
    var exploringNotesCount = 0;

    var elaTotal = 0;
    var comTotal = 0;
    var comparing = [];//{count: }
    var comparingCount = 0;
    var comparingArray = []
    var elaArray = []
    var elaCount = 0;
    var inEla = false;
    var inComp = false;
    var inSel = false;
    var inExp = false;
    var inNote = false;
    // var pub = 0;
    // var viewHisArray = [];
    var selectTotal = 0;
    var selecting = [];
    var selectCount = 0;
    // var up = 0;
    // var down = 0;
    // var noteDisCount = 0;
    var noteDisArray = [];
    //if(array[array.length - 1].action != "writeNote") console.log(array[array.length - 1].action)
    //for(var i = 0; i < array.length; i++){
    for(var i = array.length - 2; i >= -1; i--){
        //var entity = array[i].entity;
        var action //= array[i].action;
        if(i == -1) action = "writeNote"
        else action = array[i].action;
        if(action == "select"){
            if(!inSel) inSel = true;
            selectCount++;
            selectTotal++;
        }
        else{
            if(inSel){
                inSel = false;
                selecting.push(selectCount)
                selectCount = 0;
            }
        }
        // if(action == "up") up++;
        // if(action == "down") down++;
        if(action == "noteDis" || action == "allNote" || action == "viewHis" || action == "up" || action == "down"){
            inNote = true;
            exploringNotesCount++;
            exploreingNoteTotal++;
            if(action == "viewHis"){
                noteDisArray.push("VH:" + array[i].children.length)
            }
            else if(action == "noteDis"){
                noteDisArray.push("NDis:" + array[i].children.length)
            }
            else if(action == "allNote") noteDisArray.push("AllN:" + array[i].children.length)
            else if(action == "up") noteDisArray.push("up:" + array[i].children.length)
            else noteDisArray.push("down:" + array[i].children.length)
        }
        else{
            if(inNote){
                inNote = false;
                exploringNotes.push(exploringNotesCount);
                exploringNotesCount = 0;
                noteDisArray.push(",,")
            }
        }
        if(action == "noteSelect" || action == "add"){
            if(!inExp) inExp = true;
            exploreCount++;
            exploreTotal++;
            if(action == "noteSelect") exploreArray.push("NS")
            else exploreArray.push("add")
        }
        else{
            if(inExp){
                inExp = false;
                exploring.push(exploreCount)
                exploreCount = 0;
                exploreArray.push(",,")
            }
        }
        //if(action == "hoverEntity" || action == "pivot"){
        if(action == "pivot"){
            if(!inComp){
                inComp = true;
            }
            comparingCount++;
            comTotal++;
            if(action == "hoverEntity") comparingArray.push("HE")
            else comparingArray.push("pivot")
        }
        else{
            if(inComp){
                inComp = false;
                comparing.push(comparingCount);
                comparingCount = 0;
                comparingArray.push(",,")
            }
        }
        if(action == "hoverData" || action == "detail" || action == "pub"){
            if(!inEla) inEla = true;
            elaCount++;
            elaTotal++;
            if(action == "hoverData") elaArray.push("HD")
            else if(action == "detail") elaArray.push("detail")
            else elaArray.push("pub")
        }
        else{
            if(inEla){
                inEla = false;
                elaborating.push(elaCount)
                elaCount = 0;
                elaArray.push(",,")
            }
        }
        if(action == "writeNote" || action == "editNote") break;
        //if(action == "pub") pub++;
        
    }
    //array.unshift({action: "statistics", exploring: exploring, pub: pub, elaborating: elaborating, comparing: comparing, viewHis: viewHisArray, parent: null, children: [array[0]._id]});
    //console.log(array[array.length - 1])
    var totalGroup = selecting.length + exploring.length + comparing .length + elaborating.length + exploringNotes.length;
    var total = selectTotal + exploreTotal + comTotal + elaTotal + exploreingNoteTotal;
    // patternCsv += totalGroup + ";" + total + ";" + (selectTotal / total).toFixed(3).toString().replace(/\./g, ",") + ";" + (selecting.length / totalGroup).toFixed(3).toString().replace(/\./g, ",") + ";" + selecting.length + ";" + selecting.join(",,") + ";" + selectTotal + ";" + (exploreTotal / total).toFixed(3).toString().replace(/\./g, ",") + ";" + (exploring.length / totalGroup).toFixed(3).toString().replace(/\./g, ",") + ";" + exploring.length + ";" + exploring.join(",,") + ";" + exploreArray.join(",,") + ";" + exploreTotal + ";" + (comTotal / total).toFixed(3).toString().replace(/\./g, ",") + ";" + (comparing.length / totalGroup).toFixed(3).toString().replace(/\./g, ",") + ";" + comparing.length + ";" + comparing.filter(a => a > 1).length + ";" + comparing.join(",,") + ";" + comparingArray.join(",,") + ";" + comTotal + ";" + (elaTotal / total).toFixed(3).toString().replace(/\./g, ",") + ";" + (elaborating.length / totalGroup).toFixed(3).toString().replace(/\./g, ",") + ";"
    //  + elaborating.length + ";" + elaborating.join(",,") + ";" + elaArray.join(",,") + ";" + elaTotal + ";" + (exploreingNoteTotal / total).toFixed(3).toString().replace(/\./g, ",") + ";" + (exploringNotes.length / totalGroup).toFixed(3).toString().replace(/\./g, ",") + ";" + exploringNotes.length + ";" + exploringNotes.join(",,") + ";" + noteDisArray.join(",,") + ";" + exploreingNoteTotal + ";" + array[array.length - 1]._id + ";"; 
    // patternCsv += selectTotal + ";" + exploreTotal + ";" + comTotal + ";" + elaTotal + ";" + exploreingNoteTotal + ";" + array[array.length - 1]._id + ";"
    // var middle = -1;
    // for(var i = array.length - 2; i >= 0; i--){
    //     if(array[i].action == "writeNote" || array[i].action == "editNote"){
    //         middle = i;
    //         break;
    //     }
    // }
    // if(middle != -1){
    //     patternCsv += (array.length - middle - 1) + ";" + array[middle].action + ";" + array[middle]._id + "\n";
    // }
    // else
    //     patternCsv += array.length + ";" + "none" + ";" + "none" + "\n";

  
    //console.log(viewHisArray.length + "     ;" + viewHisArray.join(","))
}
var allActions = ["select", "deselect", "add", "noteSelect", "pivot", "hoverEntity", "noteDis", "allNote", "detail", "hoverData", 
    "pub", ",", "viewHis", "up", "writeNote"]

var countSet = new Set();

function drawNeighbors(){
    var row = d3.select(".matrix").selectAll(".rows").data(allActions)
    var rowEnter = row.enter().append("g").attr({
        class: "rows",
        //transform: function(d,i){return "translate(0," + 11*i + ")"}
    })
    row.exit().remove()
    rowEnter.append("rect").attr({
        height: 10,
        width: 10,
        fill: function(d){
            return c20(allActions.indexOf(d))
        },
    })
    var value = rowEnter.append("g").attr({transform: "translate(11,0)"}).selectAll(".values").data(allActions)
    var valueEnter = value.enter().append("rect").attr({
        class: "values",
        height: 10,
        width: 10,
        fill: function(d){
            var first = d3.select(this.parentNode).datum(), second = d;
            //console.log(first + " " + second)
            var re = $.grep(neighbors, function(e){
                return e.first == first && e.second == second
            })
            var v=0;
            if(first == second) {}
            else if(re.length > 0){
                v = re[0].count;
                if(v > 0) countSet.add(parseInt(re[0].count))
            }
            return d3.hsv(0, 0, (21-v)/21)
        },
        //transform: function(d,i){ return "translate(" + i*11 + ",0)"}
    })
    value.exit().remove();
    var dis = 0;
    d3.selectAll(".rows").each(function(d, i){
        if(i == 11 || i == 13){
            d3.select(this).style("display", "none")
            return
        }
        d3.select(this).attr("transform", "translate(0," + dis + ")")
        dis += 11;
        var diss = 0;
        d3.select(this).selectAll(".values").each(function(a,j){
            if(j == 11 || j == 13){
                d3.select(this).style("display", "none")
                return
            }
            d3.select(this).attr("transform", "translate(" + diss + ",0)")
            diss += 11
        })
    })
    //var countArray = [2,4,6,8,10,15,19,33,40,62,162]
    var countArray = [1,2,4,6,8,10,11,15,16,19,21]
    var gc = d3.select("svg").append("g").attr("transform", "translate(0,160)")
    var le = gc.selectAll(".le").data(countArray)
    var leEnter =  le.enter().append("g").attr({
        class: "le"
    })
    le.exit().remove()
    leEnter.append("rect").attr({
        height: 10,
        width: 10,
        fill: function(d){return d3.hsv(0, 0, (21-d)/21)}
    })
    leEnter.append("text").text(function(d){return d;}).style({
        "text-anchor": "start",
        "alignment-baseline": "hanging",
        "font-size": "12px"
    }).attr("transform", "translate(0,11)")
    var tran = 0;
    d3.selectAll(".le").each(function(){
        d3.select(this).attr("transform", "translate(" + tran + ",0)")
        tran += d3.select(this).node().getBoundingClientRect().width + 5;
    })
    console.log(countArray)
}

var neighbors = []//{first: second: count: }
function getNeighborActions(array){
    var first = {}, second = {};
    if(notesDis.indexOf(array[array.length-1]._id) < 0) return;

    first.first = array[0].action;

    for(var i = 1; i < array.length; i++){
        var action = array[i].action;
        first.second = action;
        second.first = action;
        var re = $.grep(neighbors, function(e){
            return e.first == first.first && e.second == first.second;
        })
        if(re.length > 0) re[0].count++;
        else neighbors.push({first: first.first, second: first.second, count: 1})
        first = jQuery.extend(true, {}, second);
        second = {}
    }
}

var ids = ["2018.02.15_15:59:33:731", "2018.02.15_16:01:05:373", "2018.02.15_16:04:05:965", "2018.02.15_16:08:35:515",
    "2018.02.15_16:11:34:995", "2018.02.20_11:35:18:936", "2018.02.22_11:54:03:444", "2018.02.22_12:04:09:100", "2018.02.22_12:07:56:235",
    "2018.02.23_14:46:55:511", "2018.02.23_14:50:15:429", "2018.02.27_12:22:35:23", "2018.02.29_14:51:42:897", "2018.02.29_16:40:58:274",
    "2018.02.29_16:50:14:418", "2018.02.29_16:55:46:54", "2018.02.29_16:35:36:967"]

var traceIndex = 5;
var notesDisWithOrder = ["2018.02.29_17:03:07:861", "", "2018.02.29_14:52:59:995", "", "2018.02.22_11:38:36:947",
"2018.02.22_12:15:13:76", "", "2018.02.23_09:43:19:514", "2018.02.23_10:14:23:646", "2018.02.23_10:33:03:900", "",
 "2018.02.29_13:15:40:352","2018.02.29_13:25:57:227", "2018.02.29_13:32:03:820","2018.02.29_13:47:29:357",
 "2018.02.29_13:50:26:290","", "2018.02.27_10:37:21:231", "2018.02.27_10:47:49:367", "2018.02.27_11:00:23:314",  "2018.02.27_11:06:31:997", "",
  "2018.02.23_14:54:43:682", "2018.02.23_15:08:46:656", "2018.02.23_15:15:17:141", "", "2018.02.27_12:06:07:996",
   "2018.02.27_12:14:20:36", "2018.02.27_12:19:35:42", "2018.02.27_12:25:44:501", "",  "2018.02.15_15:45:08:242", "2018.02.15_16:15:33:473", "",
   "2018.02.23_16:32:43:713", "2018.02.23_16:52:41:775", "",  "2018.02.27_09:32:00:303", "2018.02.27_09:49:34:262", "", "2018.02.20_11:37:19:697", "2018.02.20_11:41:30:532", "", 
"2018.02.22_13:19:58:846", "2018.02.22_13:30:04:222", "2018.02.22_13:36:12:329", "2018.02.22_13:49:56:735", "", "2018.02.27_14:06:38:287", 
"2018.02.27_14:10:11:333", "2018.02.27_14:15:36:858"]
//"2018.02.22_13:30:04:222", "2018.02.27_09:49:34:262","2018.02.23_16:32:43:713",
function getTraces(array, temp){
    noteId = array[array.length-1]._id;
    //if(noteids.indexOf(array[array.length-1]._id) < 0) return;
    var ind = temp.indexOf(noteId);
    //var re = $.grep(trailArray, function(e){return e.time == noteId});
    if(ind < 0) return;
    //var ind = trailArray.indexOf(re[0]);
    var cc = 0;
    //var addIn = true;
    var tempActions = []
    for(var i = 0; i < array.length; i++){
        tempActions.push(array[i].action)
        if(array[i].action != "writeNote" && array[i].action != "editNote" && array[i].action != "deselect")
            cc++;
        // if(array[i].action == "writeNote" || array[i].action == "editNote"){
        //     if(noteids.indexOf(array[i]._id) < 0){
        //         addIn = false;
        //         break;
        //     }
        // }
    }
    //if(!addIn) return;

    var row = d3.select(".rows:nth-child(" + (ind + 1) + ")").selectAll("rect").data(tempActions)
    var rowEnter = row.enter().append("rect").attr({
        height: 8,
        width: 5,
        fill: function(d){return c20(allActions.indexOf(d))},
        transform: function(d,i){ return "translate(" + i*6 + ",0)"}
    })
    row.exit().remove();
    //row.order();

    //traceIndex++;
    //notesDis.push(array[array.length - 1]._id)
    //console.log(array[array.length - 1]._id + " " + cc)
    //if(addIn) traces += tempActions.join(";") + ";" + array[array.length-1]._id + "\n";
}

function getNotesForRate(){
    $.ajax({
        type: "GET",
        url: "/getnotesforrate",
        // contentType:'application/json',
        dataType: "json",
        // data: JSON.stringify(list),
        success: function(response){
            var array = response.map(obj=>obj.username + ";" + obj.time + ";" + obj.type + ";" + obj.cost + ";" + obj.text)
            var text = array.join("\n")
            download("note.csv", text)
        },
        error: function(){}
    })
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));//text.join("\n")));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}




