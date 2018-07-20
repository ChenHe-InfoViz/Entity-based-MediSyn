function annotation(obj = null){
	$("#postitDiv").css("display", "block");
	$("#publicBox").prop("checked", "checked")
	$("#publicBox").prop("disabled", true)

	$("#postit").focus()
	document.getElementById("postit").value = '';
	$("#postit").prop("disabled", false)
	$("#controllersDiv > button").prop("disabled", false)
	// $("#noteSaveButton").prop("disabled", false)
	var canvas = document.getElementById("checkArrow")
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(obj){
		$("#publicBox").prop("checked", true)//obj.public)
		$("#publicBox").prop("disabled", true)
		$("#postit").val(obj.note)
		$("#noteSaveButton").css("display", "none")
		$("#noteUpdateButton").css("display", "block")
		$("#postit").data("_id", obj._id)
		$("#postit").data("public", obj.public)
		$("#postit").data("note", obj.note)
		//$("#postit").data("time", obj.time)
		// console.log(obj._id)
		// console.log($("#postit").data("id"))
	}
	else{
		$("#noteSaveButton").css("display", "block")
		$("#noteUpdateButton").css("display", "none")
	}
}

function saveAnno(){
	//console.log("save note")
	var note = $("#postit").val().trim();
	var time = getFormatedTime()

	//console.log("save note")
	if(note.length > 0){
		
		// $("#noteCancelButton").prop("disabled", true)
		// $("#noteSaveButton").prop("disabled", true)
		$.ajax({
           url: 'savenote',
           type: 'POST',
           contentType:'application/json',
           data: JSON.stringify({time: time, note: note, username: username, public: false}),
           dataType:'json',
           success: function(res){
           	//console.log(res)
           		writeAction(res.id, time) //time is the _id of the write action
               	drawCheck()
               	showNotes(noteFilterEntity, false)
               	//if($("#showNoteDiv").css("display") == "block") showNotes(noteFilterEntity)
           },
           error: function()
           {
           		var canvas = document.getElementById("checkArrow");
				var ctx = canvas.getContext("2d");
				//ctx.font = "30px Arial";
				ctx.fillText("Server error, please try again later.", 5, 15);
               	console.log("writing error!");
           }
       });
	}
	else{
		$("#postit").prop("disabled", false)
        $("#controllersDiv > button").prop("disabled", false)
	}
}

function updateAnno(){
	var note = $("#postit").val().trim();
	var time = getFormatedTime()
	//console.log("update note")
	if(note.length > 0 && note != $('#postit').data("note") ){//|| $('#publicBox').is(":checked") != $('#postit').data("public"))){
		//$("#postit").prop("disabled", true)
		//$("#controllersDiv > button").prop("disabled", true)
		// $("#noteCancelButton").prop("disabled", true)
		// $("#noteSaveButton").prop("disabled", true)
		// console.log($('#postit').data())
		$.ajax({
           url: 'updatenote',
           type: 'POST',
           contentType:'application/json',
           data: JSON.stringify({oldid: $('#postit').data("_id"), updateTime: time, note: note, username: username, public: false}),  //$('#publicBox').is(":checked")
           dataType:'json',
           success: function(res){
           	//console.log(res)
           		//if(note != $('#postit').data("note"))
           			//editAction(res.id, time) //note id, do not change the action tree
               	drawCheck()
               	showNotes(noteFilterEntity, false)
               	//if($("#showNoteDiv").css("display") == "block") showNotes(noteFilterEntity)
           },
           error: function()
           {
           		var canvas = document.getElementById("checkArrow");
				var ctx = canvas.getContext("2d");
				//ctx.font = "30px Arial";
				ctx.fillText("Server error, please try again later.", 5, 15);
               	console.log("writing error!");
           }
       });
	}
	else{
		$("#postit").prop("disabled", false)
        $("#controllersDiv > button").prop("disabled", false)
	}
}

function showNotes(entity = {}, hisaction = true){
	if(hisaction)
		$("#showNoteDiv").css("display", "block");
	updateMainWidth()
    //if($("#showNoteDiv").css("display") == "none") $("#main").width($("#main").width() + listWidth)//$("#main").width($("#canvas").width() - $("#right").width());
    //else $("#main").width($("#main").width() - listWidth)//$("#main").width($("#canvas").width() - $("#right").width() - $("#list").width());
    updateHeaderHeightWidth();
    updateBodyHeightWidth();
    noteFilterEntity = entity;

	entity.username = username;
	//console.log(JSON.stringify(entity))
	$.ajax({
        type: "POST",
        url: "/note",
        contentType:'application/json',
        dataType: "json",
        data: JSON.stringify(entity),
        success: function(response){
            try{
            	//console.log(response)
            	drawNotesFromRes(entity, response, "#showNoteDiv", hisaction)
            }
            catch(e){
              console.log("error catch " + e)
            }
            updateEntityList();
            
            //d3.select("#showNoteDiv").select(".refreshNote").text("\uf021")
        },
        error: function () {
            console.log("get page request failed.");
            //d3.select("#showNoteDiv").select(".refreshNote").text("\uf021")
        },
    })
}

function drawNoteFramework(div = "#showNoteDiv"){
    var d3div = d3.select(div);
    if(div == "#showNoteDiv"){
  //   	d3div.append("text").text("\uf021").attr("class", "refreshNote")
  //   	.style({"font-family": "FontAwesome",
		// 	    "font-size": 15,
		// 	    "text-anchor": "start",
		// 		"alignment-baseline": "hanging",
		// 		float: "right",
		// 		margin: "2px",
		// 		cursor: "pointer"
		// }).on("click", function(){
		// 	//console.log("click refresh")
		// 	d3.select(this).text("\uf04c")
		// 	showNotes(noteFilterEntity)
		// })
        d3div.append("input").attr({
            type: "checkbox",
            id: "myprivate",
        }).property("checked", true)
        d3div.append("label").attr({
            for: "myprivate",
        }).style("background", "#fdbbd8").text("My private notes")
        d3div.append("br")

        // d3div.append("input").attr({
        //     type: "checkbox",
        //     id: "mypublic",
        // }).property("checked", true)
        // d3div.append("label").attr({
        //     for: "mypublic",
        // }).style("background", "#f8feb3").text("My public notes")
        // d3div.append("br")

        d3div.append("input").attr({
            type: "checkbox",
            id: "otherpublic",
        }).property("checked", true)
        d3div.append("label").attr({
            for: "otherpublic",
        }).style("background", "#cffce3").text("Other public notes")
        d3div.append("br")
    }

    var filterDiv = d3div.append("div").attr("class", "noteFilterDiv")
    filterDiv.append("label").attr("class", "insLabel")
    filterDiv.append("label").attr("class", "filtername")
    filterDiv.append("text").attr("class", "filterRemove")
    d3div.append("div").attr("class", "showNoteArea")
}

function drawNotesFromRes(entity, response, div, hisaction){
	var d3div = d3.select(div)
	if(div == "#showNoteDiv"){
	if(entity.hasOwnProperty("entity")){
		if(hisaction && response.length > 0)
			noteDisAction(entity, response.map(a => a._id))
		d3div.select(".insLabel").text("All notes related to: ")
    	d3div.select(".filtername").style("display", "inline-block")
    	d3div.select(".filterRemove").style("display", "inline-block")
		//var div = d3.select("#showNoteDiv").append("div").attr("id", "filterDiv")
		d3div.select(".filtername").text(entity.entity).style({
			background: "#ccc",
	        "padding-left": "2px",
	        "padding-right": "2px",
		})
		//if(div == "#showNoteDiv")
			d3div.select(".filterRemove").text("\uf00d").style({"font-family": "FontAwesome","font-size": 15})
		    .on("click", function(){				    	
		    	d3div.select(".insLabel").text("All accessible notes: ")
		    	d3div.select(".filtername").style("display", "none")
		    	d3div.select(".filterRemove").style("display", "none")
		    	showNotes()
		    })
		    .style("cursor", "pointer")
	}
	else{ //d3.select("#noteFilterDiv").style("display", "none")
		if(hisaction && response.length > 0)
			allNoteAction(response.map(a => a._id))
		d3div.select(".insLabel").text("All accessible notes: ")
    	d3div.select(".filtername").style("display", "none")
    	d3div.select(".filterRemove").style("display", "none")
	}
	}

    var divs = d3div.select(".showNoteArea").selectAll(".noteDisDiv").data(response);
    var divsEnter = divs.enter().append("div").attr({
    	class: "noteDisDiv"
    })
    divs.exit().remove();
	divs.order();
	divsEnter.append("p")
	var entityDiv = divsEnter.append("div").attr("class", "entityNoteDispDiv");
	d3.selectAll(".noteDisDiv").each(function(da){
		if(da.entities.length > 0){
		   var label = d3.select(this).select(".entityNoteDispDiv").selectAll(".noteDisLabel").data([1])
		   var labelEnter = label.enter().append("label").attr("class", "noteDisLabel").text("Entity: ")
		   label.exit().remove()
		}
		var inputs = d3.select(this).select(".entityNoteDispDiv").selectAll(".entityNoteLabel").data(function(){return da.entities; })
    	var inputsEnter = inputs.enter().append("label").attr({ class: "entityNoteLabel" }).style({
     		cursor: "pointer",
     		"margin-right": "5px"
        })//.text(function(d){return d.entity;})
        .on("click", function(d){
        	if(div != "#showNoteDiv") return;
        	var re = $.grep(visObj.selectedEntities, function(e){
            		return e.entity == d.entity
            	})
        	if(re.length > 0) removeEntity(re[0])
        	else {
        		var value = d3.select(this.parentNode.parentNode).datum();
        		noteSelectAction(d, value._id)
        		mutationWaitingList.push(d)                    
        		entityChecked(mutationWaitingList)
        	}
        })
        inputs.exit().remove();
        inputs.order();
	})

	if(div == "#showNoteDiv"){
		var buttonDiv = divsEnter.append("div").attr({
			class: "noteButtonDiv"
		})
		buttonDiv.append("button").text("\uf087").attr("class", "upNoteButton").style({
			"font-family": "FontAwesome",
		}).on("click", function(d){
			upVote(d, this)
		})
		buttonDiv.append("text").attr("class", "upCountText")
		buttonDiv.append("button").text("\uf088").attr("class", "downNoteButton").style({
			"font-family": "FontAwesome",
		}).on("click", function(d){
			downVote(d, this)
		})
		buttonDiv.append("text").attr("class", "downCountText")
		buttonDiv.append("button").text("Delete").attr("class", "deleteNoteButton").on("click", function(d){
			//todo
			removeNote(d, this)
		})
		buttonDiv.append("button").text("Edit").attr("class", "editNoteButton").on("click", function(d){
			//console.log(d)
			annotation(d)
		})
		buttonDiv.append("button").attr("class", "viewHisButton").text("View provenance").on("click", function(d){
			// if(gloDiv == "#main"){
				drawHisWindow(d.time, d.username)
			if(gloDiv == "#main"){
				viewHistoryAction(d._id, d.entities)
			}
			// }
		})
	}
	
	updateNotes(div)
    updateNoteLabelBack(div);

    if(div == "#showNoteDiv")
    	updateNoteDis()
}

function upVote(d, element){
	$.ajax({
	   url: 'upnote/?id=' + d._id + "&username=" + username,
       type: 'POST',
       dataType:'json',
       success: function(res){
       	 return;
       },
       error: function()
       {
         console.log("up vote error!");
       }
	})
	if(d.up.indexOf(username) > -1){
	   d.up.splice(d.up.indexOf(username), 1)
	   $(element).css("color", "black")
	   upAction(d._id, false)
	}
	else {
		d.up.push(username)
		$(element).css("color", "green")
		upAction(d._id, true)
	}
	// $(element).next().text(function(){ return d.up.length})
}

function downVote(d, element){
	$.ajax({
	   url: 'downnote/?id=' + d._id + "&username=" + username,
       type: 'POST',
       dataType:'json',
       success: function(res){
       	 return;
       },
       error: function()
       {
         console.log("down vote error!");
       }
	})
	console.log(d._id)
	if(d.down.indexOf(username) > -1) {
		$(element).css("color", "black")
		d.down.splice(d.down.indexOf(username), 1)
		downAction(d._id, false)
	}
	else {
		$(element).css("color", "green")
		d.down.push(username)
		downAction(d._id, true)
	}
	// $(element).next().text(function(){ return d.down.length})
}

function removeNote(d, ele){
	var noteid = d._id; //console.log(noteid)
	
	$.ajax({
           url: 'removenote/?id=' + noteid,
           type: 'POST',
           dataType:'json',
           success: function(res){
           	$(ele).closest(".noteDisDiv").hide("slow", function(){
				$(this).remove()
			})
			updateEntityList()
	           	 //return;
           },
           error: function()
           {
             console.log("deleting error!");
           }
       })
}

function updateNotes(div){
	var d3div = d3.select(div)
	d3div.selectAll(".noteDisDiv").each(function(d){
		d3.select(this).select("p").text(function(){return d.note;}).style({
	    	background: function(){
	    		//console.log(d.username)
	    		//console.log(username)
	    		if(d.username == username){
	    			if(d.public) return "#f8feb3"
	    			return "#fdbbd8"
	    		}
	    		return "#cffce3"
	    	}
	    })
	    d3.select(this).select(".entityNoteDispDiv").style({
	    	background: function(){
	    		if(d.username == username){
	    			if(d.public) return "#fef786"
	    			return "#fc92c1"
	    		}
	    		return "#b4fcd4"
	    	}
		});
		var buttonDiv = d3.select(this).select(".noteButtonDiv").style({
	    	background: function(da){
	    		if(d.username == username){
	    			if(d.public) return "#fef786"
	    			return "#fc92c1"
	    		}
	    		return "#b4fcd4"
	    	}
		})
		buttonDiv.select(".upNoteButton").style({
			"color": function(d){if(d.up.indexOf(username) > -1) return "green"; return "black"}
		})
		// buttonDiv.select(".upCountText").text(function(d){return d.up.length;})
		buttonDiv.select(".downNoteButton").style({			
			"color": function(d){if(d.down.indexOf(username) > -1) return "green"; return "black"}
		})
		// buttonDiv.select(".downCountText").text(function(d){return d.down.length;})
		buttonDiv.select(".deleteNoteButton").style({
			display: function(d){ if(d.username == username) return "inline-block"; return "none"}
		})
		buttonDiv.select(".editNoteButton").style({
			display: function(d){ if(d.username == username) return "inline-block"; return "none"}
		})
		buttonDiv.select(".viewHisButton")
		// d3.select(this).select(".entityNoteDispDiv").selectAll(".entityNoteLabel").each(function(da){
		// 	console.log(da.entity)
		// })
	    
	})
	d3div.selectAll(".entityNoteDispDiv").each(function(d){
		d3.select(this).selectAll(".entityNoteLabel").text(function(data){return data.entity;})
    })
    //d3div.selectAll(".noteButtonDiv").selectAll("button").data(function(d){
    	//console.log(d.note)
    	//return [d];
    //})
}

function updateNoteLabelBack(div = "#showNoteDiv"){
	var d3div = d3.select(div)
	d3div.selectAll(".entityNoteLabel").style("background", function(d){
		var re = $.grep(visObj.selectedEntities, function(e){
			return e.entity == d.entity
		})
		if(re.length > 0) return "#999999";
		return "#ddd";
	})
}

function updateNoteDis(){
	d3.selectAll(".noteDisDiv").each(function(d){
		if(d.username == username){
			// if(d.public){
			// 	if($("#mypublic").is(":checked")) d3.select(this).style("display", "block")
			// 	else d3.select(this).style("display", "none")
			// }
			// else{
				if($("#myprivate").is(":checked")) d3.select(this).style("display", "block")
				else d3.select(this).style("display", "none")
			// }
		}
		else if($("#otherpublic").is(":checked")) d3.select(this).style("display", "block")
		else d3.select(this).style("display", "none")
	})
}

function drawCheck(){
	var start = 5;
	var mid = 8;
	var end = 16;
	var width = 2;
	var leftX = start;
	var leftY = start;
	var rightX = start + 3;
	var rightY = start + 3;
	var animationSpeed = 100;

	var ctx = document.getElementById('checkArrow').getContext('2d');
	ctx.lineWidth = width;
	ctx.strokeStyle = 'rgba(0, 150, 0, 1)';

	for (i = start; i < mid; i++) {
	    var drawLeft = window.setTimeout(function () {
	        ctx.beginPath();
	        ctx.moveTo(start, start);
	        ctx.lineTo(leftX, leftY);
	        ctx.lineCap = 'round';
	        ctx.stroke();
	        leftX++;
	        leftY++;
	    }, 1 + (i * animationSpeed) / 3);
	}

	for (i = mid; i < end; i++) {
	    var drawRight = window.setTimeout(function () {
	        ctx.beginPath();
	        ctx.moveTo(leftX, leftY);
	        ctx.lineTo(rightX, rightY);
	        ctx.stroke();
	        rightX++;
	        rightY--;
	    }, 1 + (i * animationSpeed) / 3);
	}

	window.setTimeout(function(){
		$("#postitDiv").css("display", "none")
	}, 1 + ((end + 2) * animationSpeed) / 3)

}