Ui = function(){
    //userAuthenWin();
    datasetSelectionEvent();

    //draw vis
	drawMutationHeader();
    drawRows();
    drawDetailDis();
    drawNoteFramework();
    setHeightWidth();
    this.drawMenu();
    hisVar = new historyVariables();

    $("#speed").change(function(){
      //console.log($(this).val())
      historyLayout = $(this).val()
      if(!nodeView) return;
      if(historyLayout == "context"){
        nodeView.toTreeStruc()
        // localStorage.setItem("mediSynHisStruc", "context");
      }
      else{
        nodeView.toLinearStruc()    
        // localStorage.setItem("mediSynHisStruc", "time");
        //console.log(localStorage.getItem("mediSynHisStruc"))
      }
      hisStruc.push({_id: getFormatedTime(), type: historyLayout, noteTime: curLeafId, username: username})
      if(hisStruc.length > 10)  saveHisLog()
      nodeView.updateNodeSize();
    })
    $(".ui-widget-overlay").on("click", function (){
        $("#historyDialog").dialog('close');
    });
    $("#closeIcon").click(function(){
        $("#historyDialog").dialog('close');
    })

    d3.select("#taskButton").on("click", function(d){
        taskDia()
    })

    d3.select("#feedbackButton").on("click", function(d){
        feedbackDia()
    })

    d3.select("#signOutButton").on("click", function(d){
        signoutPro()
    })

    d3.select("#selectionMenuDiv").on("click", function(d){
        //console.log(d);
        mutationWaitingList.push(d)
        entityChecked(mutationWaitingList)
        addAction(d)
    }).on("mouseover", function(){
        d3.select(this).style("background-color", "#aaa")
    }).on("mouseout", function(){
        d3.select(this).style("background-color", "#ccc")
    })

    d3.select("#noteMenuDiv").on("click", function(d){
        showNotes(d);
        //noteDisAction(d);
    }).on("mouseover", function(){
        d3.select(this).style("background-color", "#aaa")
    }).on("mouseout", function(){
        d3.select(this).style("background-color", "#ccc")
    })

    d3.select(gloDiv).on("mousewheel.zoom", function(){
        mouseScrollHorizontal()
    });

    // d3.select("#mypublic").on("click", function(){
        // console.log("mu public clicked")
        // updateNoteDis()
    // })
    d3.select("#myprivate").on("click", function(){
        updateNoteDis()
    })
    d3.select("#otherpublic").on("click", function(){
        updateNoteDis()
    })
    d3.select("window").on("mousewheel.zoom", function(){d3.event.preventDefault()});
    //sortDataRows();
    $("#postitDiv").draggable();
    d3.select("#editIcon").on("click", function(){annotation()}).on("mouseover", function(){
        d3.select("#tooltip").style({
          visibility: "visible",
          left: (d3.event.pageX) + "px",   
          top: (d3.event.pageY + 6) + "px"
        }).select("#name").text("Write a note.")
        d3.select("#selectionMenuDiv").style({
          display: "none"
        })
        d3.select("#noteMenuDiv").style({
          display: "none"
        })
    }).on("mouseout", function(){
        d3.select("#tooltip").style({
            visibility: "hidden",
        })
    })
    d3.select("#noteSaveButton").on("click", function(){
        $("#postit").prop("disabled", true)
        $("#controllersDiv > button").prop("disabled", true)
        // console.log("sssssss")
        saveAnno()
    })
    d3.select("#noteUpdateButton").on("click", function(){
        $("#postit").prop("disabled", true)
        $("#controllersDiv > button").prop("disabled", true)
        updateAnno()
    })
    d3.select("#noteCancelButton").on("click", function(){
        $("#postitDiv").css("display", "none")
    })
    // $("#postViewHistory").on("click", function(){
    //     //if(interactionHistory.length > 0)
    //         //saveHistory(false, drawHisWindow)
    //     drawHisWindow(interactionHistory, username)
    // })
    d3.select("#showNoteIcon").on("click", function(){
        $("#showNoteDiv").toggle();
        updateMainWidth()
        //if($("#showNoteDiv").css("display") == "none") $("#main").width($("#main").width() + listWidth)//$("#main").width($("#canvas").width() - $("#right").width());
        //else $("#main").width($("#main").width() - listWidth)//$("#main").width($("#canvas").width() - $("#right").width() - $("#list").width());
        updateHeaderHeightWidth();
        updateBodyHeightWidth();
        //console.log(d3.selectAll(".noteDisDiv").length)
        if($("#showNoteDiv").css("display") != "none" && $("#showNoteDiv .noteDisDiv").length == 0)
            showNotes()
    }).on("mouseover", function(){
        d3.select("#tooltip").style({
              visibility: "visible",
              left: (d3.event.pageX) + "px",   
              top: (d3.event.pageY + 6) + "px"
            }).select("#name").text("Show notes.")
            d3.select("#selectionMenuDiv").style({
              display: "none"
            })
            d3.select("#noteMenuDiv").style({
              display: "none"
            })
    })
    .on("mouseout", function(){
        d3.select("#tooltip").style({
            visibility: "hidden",
        })
    })

    if(gloDiv == "#tutorialMain"){
        startIntro();
    }
}

// function userAuthenWin(){
//     this.dialog = $( "#dialog" ).dialog({
//     //     //autoOpen: false,
//         height: 230,
//         width: 230,
//         modal: true,
//         dialogClass: 'ui-dialog',
//         buttons: {
//             "Sign in": self.signin,
//             Cancel: function() {
//                 $(this).dialog( "close" );
//                 document.body.innerHTML = "";

//             }
//         },
//         open: function(){
//             $("#dialog").keypress(function(e) {
//                 if (e.keyCode == 13) {
//                     $(this).parent().find("button:eq(1)").trigger("click");
//                 }
//             });
//         },
//         close: function() {
//             $("#errorMessage").text("");
//             // $("#login-form")[0].reset();
//             //document.body.innerHTML = "";

//             //form[ 0 ].reset();
//             //allFields.removeClass( "ui-state-error" );
//         }
//     });
// }

Ui.prototype.drawMenu = function(){
    // var self = this;
    this.createLeftList();
    this.searchList();
    //drawHeaderSign();
    this.drawEvidenceLevel();
}

function containGene(muList, mutation){
    var gene = mutation.split("(")
    var r = $.grep(muList, function(e){
        return e.mutation == gene[0]
    })
    if(r.length > 0) return r[0];
    return null;
}

drawLevel = function(group, width, brightness, text, index, density = 1, eviInterval = 20 ){
  //console.log(text);
    var oneLine = group.append("g")
              .attr("transform", "translate(0, " + (eviInterval * index + 15) + ")")
              //.attr("width", 50)

    oneLine.append("line").attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", width)
    .attr("y2", 0)
    .attr("stroke-width", eviInterval)
    .attr("stroke", function(){
      return d3.hsv(0, 0, brightness)
     })

    oneLine.append("text").attr("transform", "translate(45, 5)").text(text)

    return oneLine;
  }

function drawHeaderSign(){
    var group = d3.select("#legendSvg").append("g").attr("id", "headerSignGroup").attr({
        transform: "translate(2,10)"
    });
    
    Object.keys(driverRects).forEach(function(key, i) {
        group.append("rect").attr({
            width: 125,
            height: 16,
            transform: "translate(0," + (18 * i) + ")"
        }).style("fill", driverRects[key])
        group.append("text").style({
            "text-anchor": "start",
            "alignment-baseline": "hanging"
        }).text(function(){
            if(key == "known") return key + " driver"
            return key;
        }).attr({
            transform: "translate(5," + (18 * i + 2) + ")"
        })
    })
}

Ui.prototype.drawEvidenceLevel = function(){
    var group = d3.select("#legendSvg").append("g").attr("id", "legendGroup").attr({
                            transform: "translate(3, 80)"//160)"
                          })
    var effects = ["Responsive", "Resistant", "Not responsive", "Increased toxicity"];
    var effColorH = [120, 0, 240, 300];
    //var evidence = ["NCCN guidelines", "Late trials", "Clinical trial", "Case reports", "Pre-clinical assays"]
    var eviLabel = ["Guidelines / 1&2A", "Late trials / 2B", "Early trials / 3A", "Case reports / 3B", "Pre-clinical assays/ 4"]
     var rectWidth = mainVis.eviWidth / 1.5;
     var colWidth = rectWidth * 5 + 5;
     var height = rectWidth * 3.5;
    //effect labels
    for(var i = 0; i < 4; i++){
        group.append("text").attr({
            transform: "translate(" + (colWidth * i + mainVis.eviWidth * 1.5) + ", 0)rotate(-45)"
        }).text(effects[i])
    }
   
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 5; j++){
            for(var k = 0; k + j < 5; k++){
                group.append("rect").style({ 
                    fill: function(){return d3.hsv(effColorH[i], 1, 1 ); } 
                }).attr({
                    height: height,
                    width: rectWidth,
                    transform: "translate(" + ( colWidth * i + (rectWidth+1) * k) + "," + ((height+ 1) * j) + ")"
                })
            }
        }
    }
    for(var i = 0; i < 5; i++){
        group.append("text").attr({
            transform: "translate(" + (colWidth + 1) * 4 + ", " + ( (height + 1) * (i + .8)) + ")"
        }).text(eviLabel[i])
    }

    $("#legendSvg").height(90 + (height + 1) * 5);

}

// function drawPotencyLevel(){
//     // var paddingTop = $("#evidenceGroup").height() + 12;
//     var group = d3.select("#dtcSvg").append("g").attr("id", "dtcGroup")
//                           .attr({
//                             transform: "translate(3,6)"
//                           })
//     var potencyLabel = ["Highly potent", "Potent", "Weakly potent", "Inactive"];
//     var width = mainVis.potentWidth * 1.5;
//     for(var i = 0; i < 3; i++){
//         group.append("text").attr({
//             transform: "translate(" + (width+2)*3 + "," + (width+1) * (i+.7) + ")"
//         }).text(potencyLabel[i])
//         for(var j = 0; j + i < 3; j++){
//             group.append("rect").style("fill", "black")
//             .attr({
//                 width: width,
//                 height: width,
//                 transform: "translate(" + (width+1)*j + "," + (width+1) * i + ")"
//             })
//         }
//     }

//     group.append("line").attr("x1", 0)
//     .attr("y1", 0)
//     .attr("x2", width)
//     .attr("y2", 0)
//     .attr("stroke-width", 8)
//     .attr("stroke", "black")
//     .attr("transform", "translate(2, " + (width+1) * 3.8 + ")rotate(-50)")
//     group.append("text").attr({
//             transform: "translate(" + (width+2)*3 + "," + (width+1) * (3+.7) + ")"
//         }).text(potencyLabel[3])

//     var points = [
//       [5, 5],
//       [0, 28],
//       [23, 0],
//       [18, 22]
//     ];

//     // group.append("path")
//     // .data([points])
//     // .attr("d", d3.svg.line()
//     // // .tension(0)  // Catmull–Rom
//     // .interpolate("basis")).style({
//     //     fill: "none",
//     //     "stroke-width": "6px",
//     //     stroke: "black",
//     // })
//     // .attr("transform", "translate(0, " + width * 4.5 + ")")
//     group.append("path").data([points])
//     .attr("d", d3.svg.line()
//     // .tension(0)  // Catmull–Rom
//     .interpolate("basis")).style({
//         fill: "none",
//         "stroke-width": "6px",
//         stroke: "#6d6d6d",
//     })
//     .attr("transform", "translate(0, " + width * 4.5 + ")");

//     group.append("text").attr({
//             transform: "translate(" + (width+2)*3 + "," + (width) * (5.5) + ")"
//         }).text("Possible side effects!")
  
// }

function datasetSelectionEvent(){
    //var datasets = ["cgi", "dtc", "cosmic", "oncokb", "synapse"]
    for (var key in visObj.dataset) {
        bindSelectionEvent(key, visObj.dataset);
    }
    for (var key in driverSet) {
        bindSelectionEvent(key, visObj.driverSet);
    }
}

function bindSelectionEvent(set, obj){
    d3.select("#" + set).on("click", function(){
        if(document.getElementById(set).checked  == true) {
            obj[set] = true;
        }
        else {
            obj[set] = false;
        }
        //console.log
        updateDatasetVisibility(set, obj);
    });
}



// function updateEffectController(e){
//     effectControllerState[this.value] = this.checked;
//     updateRectsByEvidenceAndEffect();
// }

function setHeightWidth(div = gloDiv){ 
    // console.log(div)
    setMatrixHeightWidth(div)   

    // var svgWidth = $(div).find(".header").width()
    // $(div).find(".headerSvg").width(svgWidth);
   // 
    // mainVis.mutationPerPage = Math.floor( (svgWidth - mainVis.barPaddingLeft) / mainVis.columnWidth) - 2

    // var svgBodyWidth = $(div).find(".body").width()
    // $(div).find(".bodySvg").width(svgBodyWidth);

   // console.log("max mutation " + mainVis.mutationPerPage)

    $(gloDiv).width($("#canvas").width() - $("#list").outerWidth());
    //console.log($("#canvas").width() - $("#list").outerWidth())

    $("#menu").bind("click", function(){
        $("#list").toggle();
        updateMainWidth();
        //$("#main").width($("#canvas").width() - $("#right").width() - $("#list").width());
        updateHeaderHeightWidth();
        updateBodyHeightWidth();
    })

    var left = $("#list").height() - $("#dataDiv").height() - $("#legendDiv").height()
    $("#selectedDiv").height(left * .4)
    $("#mutationDiv").height(left * .6)
    $("#selectedListDiv").height($("#selectedDiv").height() - $("#selectedLabel").height())
    $("#checkBoxes").height($("#mutationDiv").height() - $("#searchList").height())
}

function updateMainWidth(){
    var minus = 0;
    if($("#showNoteDiv").css("display") != "none") minus += listWidth
    if($("#list").css("display") != "none") minus += listWidth //$("#main").width($("#canvas").width() - $("#right").width());
    $(gloDiv).width($("#canvas").width() - minus)
}

Ui.prototype.searchList = function(){
	var self = this;
	self.searchResultArray = {};
    self.searchResultIndex = 0;
    $("#searchInput").on('search', function(){
        self.searchSets($(this).val());
    });
    $("#searchInput").keyup(function(){
        self.searchSets($(this).val());
    });
    $("#upButton").hide();
    $("#downButton").hide();
    $("#upButton").on('click', function(){
        //console.log("----------");
        $(self.searchResultArray[self.searchResultIndex]).find("em").each(function(){
            $(this).css("background", "#ff6");
        });
        self.searchResultIndex--;
        if(self.searchResultIndex < 0)
            self.searchResultIndex = self.searchResultArray.length - 1;
        if($(self.searchResultArray[self.searchResultIndex]).parent().parent().is(":hidden")){
            $(self.searchResultArray[self.searchResultIndex]).parent().parent().parent().find(".labelInParent").trigger('click');
        }
        var distance = $(self.searchResultArray[self.searchResultIndex]).offset().top - $('#checkBoxes').offset().top;
        if (distance < 0 || distance > $('#checkBoxes').height()) {
            //console.log($('#checkBoxes').height() + " " + $('#checkBoxes').scrollTop() + "  " + distance)
            $('#checkBoxes').animate({
                scrollTop: distance + $('#checkBoxes').scrollTop() - 30
            }, 'fast');
        }
        $("#searchResult").text((self.searchResultIndex + 1) + "/" + self.searchResultArray.length + " result(s)");
        $(self.searchResultArray[self.searchResultIndex]).find("em").each(function(){
            $(this).css("background", "#fb954b");
        })
    });
    $("#downButton").on('click', function() {
        //console.log("++++++++++++++");
        $(self.searchResultArray[self.searchResultIndex]).find("em").each(function () {
            $(this).css("background", "#ff6");
        });
        self.searchResultIndex++;
        if (self.searchResultIndex > self.searchResultArray.length - 1)
            self.searchResultIndex = 0;
        // if ($(self.searchResultArray[self.searchResultIndex]).parent().parent().is(":hidden")) {
        //     $(self.searchResultArray[self.searchResultIndex]).parent().parent().parent().find(".labelInParent").trigger('click');
        // }
        //scroll into view
        var distance = $(self.searchResultArray[self.searchResultIndex]).offset().top - $('#checkBoxes').offset().top;
        if (distance < 0 || distance > $('#checkBoxes').height()) {
            //console.log($('#checkBoxes').height() + " " + $('#checkBoxes').scrollTop() + "  " + distance)
            $('#checkBoxes').animate({
                scrollTop: distance + $('#checkBoxes').scrollTop() - 30
            }, 'fast');
        }
        $("#searchResult").text((self.searchResultIndex + 1) + "/" + self.searchResultArray.length + " result(s)");
        $(self.searchResultArray[self.searchResultIndex]).find("em").each(function(){
            $(this).css("background", "#fb954b");
        })
    });
}

Ui.prototype.searchSets = function(text){
    //console.log("searchhhhhh");
    var self = this;
    if(self.searchResultArray.length > 0)
    self.searchResultArray.each(function(){
        $(this).html($(this).text());
    });
    var curText = text.trim();
    if(curText.length > 0)
    {
        self.searchResultArray = $("#checkBoxes ul li")
            .find("label")
            .filter(function () {
                var matchStart = $(this).text().toLowerCase().indexOf(curText.toLowerCase());
                if(matchStart > -1){
                    var matchEnd = matchStart + curText.length - 1;
                    var beforeMatch = $(this).text().slice(0, matchStart);
                    var matchText = $(this).text().slice(matchStart, matchEnd + 1);
                    var afterMatch = $(this).text().slice(matchEnd + 1);
                    $(this).html(beforeMatch + "<em>" + matchText + "</em>" + afterMatch);
                    return true;
                }
                return false;
            });
        $("#searchResult").text(self.searchResultArray.length + " result(s)");
    }
    else {
        $("#searchResult").text("");
        self.searchResultArray.length = 0;
    }
    if(self.searchResultArray.length > 1)
    {
        $("#upButton").show();
        $("#downButton").show();
    }
    else{
        $("#upButton").hide();
        $("#downButton").hide();
    }
    if(self.searchResultArray.length > 0){
        if($(self.searchResultArray[0]).parent().parent().is(":hidden")){
            $(self.searchResultArray[0]).parent().parent().siblings('.liExpand').trigger('click');
        }
        //scroll into view
        var distance = $(self.searchResultArray[self.searchResultIndex]).offset().top - $('#checkBoxes').offset().top;
        if (distance < 0 || distance > $('#checkBoxes').height()) {
            //console.log($('#checkBoxes').height() + " " + $('#checkBoxes').scrollTop() + "  " + distance)
            $('#checkBoxes').animate({
                scrollTop: distance + $('#checkBoxes').scrollTop() - 30
            }, 'fast');
        }
        self.searchResultIndex = 0;
        $("#searchResult").text((self.searchResultIndex + 1) + "/" + self.searchResultArray.length + " result(s)");
    }
    //draw matched text background
    $(self.searchResultArray[0]).find("em").each(function(){
        $(this).css("background", "#fb954b");
    })
}

//var curBioList = [];
//var ajaxQueue = [];

Ui.prototype.createLeftList = function(){
	var divEle = document.getElementById("checkBoxes");
	var ulElementTop = document.createElement("ul");
	divEle.appendChild(ulElementTop);

    addtoList("Mutations", mutationList);
    addtoList("Tumors", tumorList);
    addtoList("Drugs", drugList);

    function addtoList(s, list){
        var liFirst = document.createElement("li");
        var iE = document.createElement("i");
        var iC = document.createElement("i");
        var entityLabel = document.createElement("label");
        var ulElement = document.createElement("ul");
        ulElement.className = s;
        iE.className = "fa fa-caret-square-o-right liExpand";
        iC.className = "fa fa-caret-square-o-down liCollapse";
        entityLabel.className = "liToggleText " + s;
        entityLabel.appendChild(document.createTextNode(" " + s));

        ulElementTop.appendChild(liFirst);
        liFirst.appendChild(iE);
        liFirst.appendChild(iC);
        liFirst.appendChild(entityLabel);
        liFirst.appendChild(ulElement);

        $(".liExpand").hide()
        $(".liExpand, .liCollapse, .liToggleText").bind("click", function() {
            /* Act on the event */  
            $(this).parent().find(".liExpand").toggle();
            $(this).parent().find(".liCollapse").toggle();
            $(this).parent().find("ul." + s).toggle()
        });

    	list.forEach(function(d, i){
    		var li = document.createElement("li");

    		ulElement.appendChild(li);
            var inputElement = document.createElement("input");
            inputElement.id = "input" + d.name;
            inputElement.type = "checkbox";
            inputElement.value = d.name;
            //console.log(d.name)
            //initial checkbox state
            // var results = $.grep(activeMutation, function(e){
            //     return d == e.mutation;
            // })
            // if(results.length > 0) inputElement.checked = true;

            inputElement.addEventListener('click', function () {
                var type = $(this).parent().parent().siblings('.liToggleText').text().trim();
                // console.log(type)
                switch(type){
                    case "Mutations": type = "mutation"; break;
                    case "Tumors": type = "tumor"; break;
                    case "Drugs": type = "drug"; break;
                }
                var obj = {entity: d.name, type: type};
                //console.log(this.value);
                if(this.checked){
                    //console.log(obj.entity);
                    mutationWaitingList.push(obj);
                    entityChecked(mutationWaitingList)
                    selectAction(obj)
                    // if(mutationWaitingList.length == 1){
                    //     //$("body").addClass("wait");
                    //     entityChecked(obj);
                    // }
                }
                else {
                    removeEntity(obj);
                }

            });

            var labelText = document.createElement("label");
            labelText.htmlFor = inputElement.id;
            labelText.appendChild(document.createTextNode(" " + d.name));
            li.appendChild(inputElement);
            li.appendChild(labelText).appendChild(document.createElement("br"));
    	})
    }
}

function updateMatrix(){
    $("body").css("cursor", "default")

    updateMutationHeader();
    updateDataRow();
    rowTransition(0);
    updateColBackground();
    updateBodyHeightWidth();
}
//first add wild type, then mutant type
// function updateActiveMutationList(mutation, type){
//     var o = { mutation: mutation, type: type}
//     activeMutation.push(o)
//     var gene;

//     if(type == "mutant"){
    
//         if(currentActiveMutation.length < mainVis.mutationPerPage) {
//             gene = containGene(activeMutation, mutation)

//             // console.log(mainVis.mutationPerPage)
//             // console.log("current " + currentActiveMutation.length + " " + currentActiveMutation)
//             currentActiveMutation.push(o);
//             activeMutationRange[1] = activeMutation.length - 1;
//             if(gene != null && currentActiveMutation.indexOf(gene) < 0)
//                 currentActiveMutation.push(gene);
//         }

//         else if( activeMutationRange[1] + 4 > activeMutation.length){
//             updatePageButtonStates(null, null, false, false)
//         }        
//         // console.log(activeMutationRange[0] + " " + activeMutationRange[1] + " " + activeMutation.length)

//         // if(Math.ceil( activeMutation.length / mainVis.mutationPerPage ) > mainVis.totalPage){
//         //     // console.log(mainVis.totalPage)
//         //     mainVis.totalPage++;
//         //     updatePageButtonStates()
//         // }
//     }
// }

//var bioTypes = ["IC50", "EC50", "XC50", "AC50", "Ki", "Kd"];
var retrieveDriverCount = 0;

// function getDriverState(ob){
//     $.ajax({
//             type: "GET",
//             url: "/biodriver/?mutation=" + ob.mutation + "&tumor=" + ob.tumor,
//             dataType: "json",
//             //data: JSON.stringify(colMuTu) //stringify is important
//             success: function(response){
//                 //console.log(response)
//                 if(response.length > 0){
//                     ob.state = response[0].state
//                 }
//                 else ob.state = "unknown";
//                 retrieveDriverCount--;
//                 if(retrieveDriverCount == 0){
//                     mutationWaitingList.splice(mutationWaitingList.indexOf(mutationWaitingList[0]), 1)
//                     if(mutationWaitingList.length > 0) entityChecked(mutationWaitingList[0])
//                     else {
//                         updateMatrix();
//                     }
//                 }
//             },
//             error: function () {
//                 console.log("get driver failed.");
//                 retrieveDriverCount--;
//                 if(retrieveDriverCount == 0){
//                     mutationWaitingList.splice(mutationWaitingList.indexOf(mutationWaitingList[0]), 1)
//                     if(mutationWaitingList.length > 0) entityChecked(mutationWaitingList[0])
//                     else {
//                         updateMatrix();
//                     }
//                 }
//             },
//         })
//     }

// var dtcCsv = "drug,mutation,potency state,bios\n"
// function updateActiveData(DTCresults, mutation, type){

//     DTCresults.forEach(function(d){
//         dtcCsv += d.drug + "," + d.mutation + "," + d.potencyState + ",";
//         for(var i = 0; i < d.bioactivities.length; i++){
//             var bio = d.bioactivities[i];
//             dtcCsv += bio["End Point Standard Type"] + bio["End Point Standard Relation"] + bio["End Point Standard Value"] + bio["End Point Standard Units"] + "&" + bio["PubMed ID"] + ";"
//         } 
//         dtcCsv += "\n"
//     })
//     var tempList;
//     if(type == "mutant"){
//         var results = $.grep(mutationDrug, function(e){
//             return e.mutation == mutation;
//         })
//         tempList = DTCresults.concat(results);
//     }
//     else tempList = DTCresults;
//     //console.log(DTCresults)
//     for(var j = 0; j < tempList.length; j++){
//         // if(tempList[j].dataset.indexOf("CGI") > -1){
//         //     for(var i = 0; i < tempList[j].tumors.length; i++){
//         //         var t = $.grep(curTumors, function(e){
//         //             return e.tumor == tempList[j].tumors[i];
//         //         })
//         //         if(t.length > 0) {
//         //             if(t.length > 1) console.log("more than one tumor!!")
//         //             t[0].count++;
//         //         }
//         //         else curTumors.push({tumor: tempList[j].tumors[i], count: 1});
//         //     }
//         // }

//         var drugs = $.grep(dataRow, function(e){
//             return e.drug == tempList[j].drug;
//         })
//         if(drugs.length > 0){
//             //console.log(drugs[0])
//             if(drugs.length > 1) console.log("multiple entries here!!!")
//             addMutationToDatarow(tempList[j], drugs[0]);
//         }
//         else {
//             var obj = {drug: tempList[j].drug, dataset: {CGI: false, DTC: false}, mutations: [], total: 0}
//             dataRow.push(obj);
//             // if(obj.drug == "Ap-24226") console.log(tempList[j])
//             // drugList.push(obj.drug)
//             addMutationToDatarow(tempList[j], obj)
//         }
//     }


// }

