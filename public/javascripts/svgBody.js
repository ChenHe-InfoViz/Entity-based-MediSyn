var mainVis = {
	// itemColor: [],
	rowHeight: 16,
	barHeight: 17,
	rowPaddingTop: 2,
	//barWidthTimes: 100,
	// xDetailScale: d3.scale.linear(),
	mutXTranslate: 100,
	barPaddingLeft: 100,
	columnWidth: 36,
	// stackGroupWidth: 0,//400,
	headerHeight: 92,
	sortBy: "", //"numberOfMutations", certain mutation
	
	stackWidth: 15,
	// stackPadding: 10,
	stackInterval: 1,
	curFocusBar: null
}

function colores_google(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
}

function drawRows(div = gloDiv){
	var d3div = d3.select(div).select(".vis")
	var body = d3div.append("div").attr("class", "body")
	var bodySvg = body.append("svg").attr("class", "bodySvg")
	bodySvg.append("clipPath").attr("id", "maskData" + div.substring(1)).append("rect")
	//console.log(mainVis.mutXTranslate)
	//var c = d3.scale.category20();//d3.scaleOrdinal(d3.schemeCategory10)
	// for(var i = 0; i < mainVis.maxActiveMutation; i++){
	// 	mainVis.itemColor.push("#000000")//d3.lab(colores_google(i)).brighter(1) );
	// }

	d3div.select(".bodySvg").append("g").attr({
		class: "colBackgroundMaskGroup",
		"clip-path": "url(#maskData"+ div.substring(1) + ")"
	}).append("g").attr("class", "colBackgroundGroup");

	d3div.select(".bodySvg").append("g").attr({
		class: "rows"
	});

	//mainVis.textureObject = textureGenerator(); 
	
}

function scrollPosition(position, div = gloDiv){
	var d3div = d3.select(div)
	d3div.select(".tumorColBackground").attr("transform", "translate(" + (position) + ",0)");
    d3div.selectAll(".tumorLineGroup").attr("transform", "translate(" + (mainVis.barPaddingLeft + mainVis.headerHeight+ position) + ",0)");
    d3div.select(".mutationLabelGroup").attr("transform", "translate(" + (mainVis.barPaddingLeft + position) + ",0)");
    d3div.selectAll(".mutationGroup").attr("transform", "translate(" + (mainVis.barPaddingLeft + position) + ",0)");
    d3div.select(".colBackgroundGroup").attr("transform", "translate(" + position + ",0)");
    d3div.selectAll(".mutationGroupBackground").attr("transform", "translate(" + position + ",0)");
}

function updateBodyHeightWidth(div = gloDiv, obj = visObj){
	var d3div = d3.select(div).select(".vis")
	d3div.select(".colBackgroundGroup").selectAll(".colBackground").attr({
		height: mainVis.bodyHeight, 
		transform: function(d, i){ return "translate(" + (mainVis.barPaddingLeft + mainVis.columnWidth * i) + ",0)"}
	})

	//console.log("body width")
	obj.scrollDis.scrollbarLength = $(div).find(".vis").width() - mainVis.barPaddingLeft - mainVis.headerHeight;

	d3div.selectAll(".oneRow").attr("width", mainVis.barPaddingLeft + obj.colMuTu.length * mainVis.columnWidth);
	d3div.selectAll(".oneRow").selectAll(".mutationGroupBackground").attr("width", mainVis.barPaddingLeft + obj.colMuTu.length * mainVis.columnWidth - 5)
	d3div.select(".bodySvg").attr("height", $(div).find(".colBackgroundGroup").height())
	$(div).find(".bodySvg").width($(div).find(".mutationGroupBackground").width())

	if($(div).find(".tumorSvg").width() > $(div).find(".header").width()){
		$(div).find(".scrollSvg").css("display", "inline");
		d3div.select(".scrollSvg").attr({
			width: obj.scrollDis.scrollbarLength,//function(){ console.log($("#scrollGroup").width()); return $("#scrollGroup").width();},
			height: 16//function(){ return $("#scrollGroup").height();}
		}).select("line").attr("x2", obj.scrollDis.scrollbarLength)

		//calculate brush length
		var temp = $(div).find(".tumorSvg").width() - mainVis.barPaddingLeft - mainVis.headerHeight;
		obj.scrollDis.brushWidth = obj.scrollDis.scrollbarLength * obj.scrollDis.scrollbarLength / temp;
		if(obj.scrollDis.brushWidth < 10){
			obj.scrollDis.linearScale = d3.scale.linear().domain([0, obj.scrollDis.scrollbarLength - 10 + obj.scrollDis.brushWidth]).range([0, temp]);
			obj.scrollDis.brushWidth = 10;
		}
		else obj.scrollDis.linearScale = d3.scale.linear().domain([0, obj.scrollDis.scrollbarLength]).range([0, temp]);
		$(div).find(".rectDrag").width(obj.scrollDis.brushWidth);

		//calc new scroll position
        var nx = d3.transform(d3div.select(".rectDrag").attr("transform")).translate[0];
        if(nx + obj.scrollDis.brushWidth >= obj.scrollDis.scrollbarLength) nx = obj.scrollDis.scrollbarLength - obj.scrollDis.brushWidth
        else if(nx <= 0) nx = 0;
        d3div.select(".rectDrag").attr("transform", function(){
            return "translate(" + nx + ", 0)"
        })
        scrollPosition(-(obj.scrollDis.linearScale(nx)), div)
	}
	else {
		$(div).find(".scrollSvg").css("display", "none")
		scrollPosition(0, div)
	}

    d3.select("#maskData"+ div.substring(1) ).select("rect").attr({
		x: mainVis.barPaddingLeft,
		width: $(div).find(".body").width() - mainVis.barPaddingLeft,
		height: mainVis.bodyHeight,
		//transform: "skewX(-45)translate(" + (mainVis.headerHeight * 2) + "," + (0) + ")"
	})

	// console.log($("#colBackgroundGroup").height())
	// d3.select("#bodySvg").attr("width", $("#rows").width())

	// if(($("#main").height() - $("#rows").height() - $("#header").height() - $("#pageButton").height()) > 300)
	// 	d3.select("#body").style("height", $("#rows").height())
	// else {
	// 	d3.select("#body").style("height", ($("#main").height() - 300 - $("#header").height() - $("#pageButton").height() ) ).style("overflow-x", "auto")
	// }
		// console.log($("#main").height() - $("#rows").height() - $("#header").height())

	// $("#detail").height($("#main").height() - $("#body").height() - $("#header").height() - $("#pageButton").height() )
 //    var height = $("#detail").height() - 25;
 //    $("#previewFrame").height(height);

}

function updateColBackground(div = gloDiv, obj = visObj){
	//if(div == "#main") obj = visObj;
	var d3div = d3.select(div)
	//console.log("colBackground")
	var colBackground = d3div.select(".colBackgroundGroup").selectAll(".colBackground").data(obj.colMuTu, function(d){return d.mutation+d.tumor;});
	var colBackEnter = colBackground.enter().append('rect').attr({
		class: 'colBackground',
		width: mainVis.columnWidth - 5,
		//height: mainVis.bodyHeight, 
	})

	colBackground.exit().remove();
	colBackground.order();

	//var rowCount = $(".oneRow").length;
	
	//console.log(mainVis.bodyHeight)
	d3div.selectAll(".colBackground").style({
		fill: function(d, i){ if(i % 2 == 0) return "#fff"; return "#eee" }, //d3.rgb(254, 217, 166)},
		opacity: function(d, i){ if(i % 2 == 0) return 0; return .5 },
	});

}

function rowTransition(t = 1000, div = gloDiv, obj = visObj){
	var d3div = d3.select(div)
    //console.log("row transition")
	updateRow(div, obj)
	mainVis.bodyHeight = 0;
	d3div.selectAll(".oneRow").each(function(d, i){
		var temp = mainVis.bodyHeight;
		mainVis.bodyHeight += $(this).children(".mutationGroupBackground").height() + mainVis.rowPaddingTop;
		//console.log($(this).height())
		// console.log(d.total); //console.log(i);
		//		console.log("translate(0, " + (mainVis.rowHeight + mainVis.rowPaddingTop) * i + ")");
		d3.select(this).transition().duration(t).attr({
			transform: "translate(0, " + temp + ")"
		});
	})

	d3div.selectAll(".mutationGroupBackground").style({
		fill: function(d, i){ if(i % 2 == 0) return "#fff"; return "#eee" }, //d3.rgb(254, 217, 166)},
		opacity: function(d, i){ if(i % 2 == 0) return 0; return .5 },
	})

}

function updateRow(div = gloDiv, obj = visObj){
	var d3div = d3.select(div)
	var oneRow = d3div.select(".rows").selectAll(".oneRow").data(obj.dataRow, function(d){return d.drug})
	// console.log(dataRow);
	var rowGroup = oneRow.enter().append("g").attr({
		class: "oneRow",
    })

	oneRow.exit().remove();
	oneRow.order();	

	//var rowGroup = d3.selectAll(".oneRow");
	rowGroup.append("rect").attr({
		class: "mutationGroupBackground",
	})
	
	// .on("mouseover", )
	var drugRemove = rowGroup.append("text").attr("class", "drugRemove").attr({
			//transform: "translate(0, " + (mainVis.rowHeight / 2 + 5) + ")"
		}).on("click", function(d){
			hoverTimeBegin = 0;
			if(div == gloDiv)
				removeEntity({entity: d.drug, type: "drug"})
		}).style('cursor', "pointer")
		.style({"font-family": "FontAwesome",
			    "font-size": 15,
			    "text-anchor": "start",
				"alignment-baseline": "hanging"
		})

	var drugLabel = rowGroup.append('text')
		  .attr("class", "drugLabel")
		  //.attr("width", mainVis.barPaddingLeft)
		  .style({
		  	"text-anchor": "start",
			"alignment-baseline": "hanging",
			cursor: "e-resize",
		  })
		  //.attr("transform", "translate( 0, " + (mainVis.rowHeight / 2 + 5) + ")")
		  .on("mouseover", function(d, i){ 
		  	hoverTimeBegin = getTime()
		  	mouseoverDrug(d, div, obj) 
		  	//if(div == "#main")
		  	selectionMenu(d.drug, "drug", d.hasNote, div);
		  }).on("mouseout", function(d){
		  	if(hoverTimeBegin != 0 && getTime() - hoverTimeBegin > 3000){
				if(div == gloDiv){
					hoverEntityAction({entity: d.drug, type: "drug"})
				}
				else{
					var element = this;            
					while (!d3.select(element).classed("gridDiv")) // while no class "parent" was found...
			    		element = element.parentElement;  
					var nodeid = d3.select(element).datum()._id
					hoverEntityHisAction({entity: d.drug, type: "drug", nodeid: nodeid})
				}

			}
		  	mouseoutCell(div);
		  	//d3.select(".tooltip").style("visibility", "hidden")
		  }).on("click", function(d){
		  	hoverTimeBegin = 0;
			sortTumorRows(d.mutationTumor.map(a => a.tumor), div, obj);
			sortCol(d.drug, "drug", -2, div, obj)
			if(div == gloDiv)
				pivotAction({entity: d.drug, type: "drug"})
			else{
				var element = this;            
				while (!d3.select(element).classed("gridDiv")) // while no class "parent" was found...
				    element = element.parentElement;  
				var nodeid = d3.select(element).datum()._id
				pivotHisAction({entity: d.drug, type: "drug", nodeid: nodeid})
			}
		  })
		  //.on('contextmenu', function(d){ 
        	//	d3.event.preventDefault();
        		
   		 //});

	var mutGroup = rowGroup.append("g").attr({
		class: "mutationMaskGroup",
		"clip-path": "url(#maskData" + div.substring(1) + ")"
	}).append('g').attr("class", "mutationGroup")
	.attr("transform", "translate (" + mainVis.mutXTranslate + ", 0)")
}

function updateDataRow(div = gloDiv, obj = visObj){
	//console.log(obj)
	updateRow(div, obj)
	updateRowDataValue(div, obj)
	//updateColBackground()

	// var stackGroup = rowGroup.append("g").attr({
	// 	class: "stackGroup",
	// 	transform: "translate (" + mainVis.mutXTranslate + ", 0)"
	// })

	

	updateMutationDrugRelations(div, obj)
	updateMutationRects(div, obj);
}

function updateRowDataValue(div = gloDiv, obj = visObj){
	var d3div = d3.select(div)

//important!! update data bound to each "g" when data row updated!!
	d3div.selectAll(".oneRow").each(function(d, i){
		//console.log(d.drug);
		var re = $.grep(obj.selectedEntities, function(e){
			return e.entity == d.drug;
		})
		if(re.length > 0){
			d3.select(this).select(".drugLabel").text(d.drug).attr({
				transform: "translate(13, 5)"
			}).style("font-weight", function(){
				//console.log(d.hasNote)
				if(d.hasNote) return "bold";
				return "normal"
			})
			wrap(d3.select(this).select(".drugLabel"), mainVis.barPaddingLeft - 18)
		}
		else{
			d3.select(this).select(".drugLabel").text(d.drug).attr({
				transform: "translate(0, 5)"
			}).style("font-weight", function(){
				//console.log(d.hasNote)
				if(d.hasNote) return "bold";
				return "normal"
			})
			wrap(d3.select(this).select(".drugLabel"), mainVis.barPaddingLeft - 5)
		}
		d3.select(this).select(".mutationGroup")//.data(d)
		d3.select(this).select(".drugRemove").text(function(){
			if(re.length > 0){
				if(div == gloDiv) return "\uf00d";
				return "\uf245"
			}
			else return "";
		})
	})
}

function updateMutationDrugRelations(div = gloDiv, obj = visObj){
	var d3div = d3.select(div)
	d3div.selectAll(".mutationGroup").each(function(a, j){
		//console.log(a);
		var dataGroup = d3.select(this).selectAll(".dataGroup").data(obj.colMuTu, function(d, i){ return d.mutation + d.tumor })

		var dataEnter = dataGroup.enter().append("g")
					  .attr({
					  	class: "dataGroup",
					  	// width: mainVis.columnWidth,
					  	// height: mainVis.rowHeight
					  })
					  // .on("click", cgiClick)
					  //.style("fill", function(d, i) { return mainVis.itemColor[activeMutation[i].color] })
		dataGroup.exit().remove();
		dataGroup.order();
	})
}


function selectionMenu(entity, type, hasNote, div){
	//console.log(entity)

    d3.select("#tooltip").style({
      visibility: "visible",
      left: (d3.event.pageX + 10) + "px",   
      top: (d3.event.pageY - 20) + "px"
    }).select("#name").text(entity)
    
    if(div == gloDiv){

	    var re = $.grep(visObj.selectedEntities, function(e){
			return e.entity == entity
		})
		if(re.length == 0)
		{
			d3.select("#selectionMenuDiv").data([{entity: entity, type: type}]).enter()
			d3.select("#selectionMenuDiv").style({
				display: "block"
			})
		}
		else d3.select("#selectionMenuDiv").style({
				display: "none"
			})

		//note
		if(hasNote)
		{
			d3.select("#noteMenuDiv").data([{entity: entity, type: type}]).enter()
			d3.select("#noteMenuDiv").style({
				display: "block"
			}).on("click", function(d){ 
				showNotes(d);
			})
		}
		else d3.select("#noteMenuDiv").style({
				display: "none"
			})
	}
	else{
		d3.select("#selectionMenuDiv").style({
			display: "none"
		})
		d3.select("#noteMenuDiv").style({
			display: "none"
		})
	}

    d3.select("body").on("click", function(){
    	d3.select("#tooltip").style({
      		visibility: "hidden",
    	})
    })
}

function updateDatasetVisibility(set, obj, div = gloDiv){

	d3.select(div).selectAll("." + set).style("display", function(){
		if(obj[set]) return "inline";
		else return "none";
	});
	//sortDataRows();
	rowTransition()
}

function updateMutationRects(div = gloDiv, obj = visObj){
	var d3div = d3.select(div)
	d3div.selectAll(".mutationGroup").each(function(a, j){
		var maxHeightofRow = 0;
		d3.select(this).selectAll(".dataGroup").each(function(d, i){
			//console.log( d );
			var curHeight = 0;

			var re = $.grep(a.mutationTumor, function(e){
				return e.mutation == d.mutation && e.tumor == d.tumor;
			})

			//console.log(re[0])
			if(re.length > 0){
				//if(a.drug == "dasatinib") console.log(re[0])
				curHeight = re[0].values.length * (mainVis.barHeight + 1)
				//console.log(curHeight)
				if(re.length > 1) console.log("multiple entries!!!...")
				d3.select(this).attr({
					transform: 	"translate(" + ( mainVis.columnWidth * i ) + ", 0)"
				})

				var onesetGroup = d3.select(this).selectAll(".onesetGroup").data(re[0].values);
				var onesetEnter = onesetGroup.enter().append("g").attr({
					class: "onesetGroup",//function(da, m) { return "onesetGroup " +; },
					transform: function(da, m) { return "translate(0, " + (mainVis.barHeight + 1) * m + ")"}
				}).on("click", function(da){
					hoverTimeBegin = 0;
					if(div == gloDiv){
						var details = {drug: a.drug, mutation: d.mutation, tumor: d.tumor, value: da};
						detailAction(details)
						valueClick(details, div)
					}
					// if(curFocusBar != null)
					// 	d3.select(curFocusBar).style("stroke-opacity", 0);
					// d3.select(this).style("stroke-opacity", 1);
					// curFocusBar = this;
				}).on("mouseover", function(da, i){ 
			  	 //console.log(d)
			  	  hoverTimeBegin = getTime();
			  	  mouseoverCell({drug: a.drug, mutation: d.mutation, tumor: d.tumor}, div); 
			    })//relationMouseover(this, d); } )
			    .on("mouseout", function(da){
			  	  if(hoverTimeBegin != 0 && getTime() - hoverTimeBegin > 3000){
					if(div == gloDiv){
						hoverDataAction({drug: a.drug, mutation: d.mutation, tumor: d.tumor, value: da})
					}
					else{
						var element = this;            
						while (!d3.select(element).classed("gridDiv")) // while no class "parent" was found...
				    		element = element.parentElement;  
						var nodeid = d3.select(element).datum()._id
						hoverDataHisAction({drug: a.drug, mutation: d.mutation, tumor: d.tumor, value: da, nodeid: nodeid})
					}
				  }
			  	  mouseoutCell(div)
			    })
				onesetGroup.exit().remove();

				for(var m = 0; m < 5; m++){
					onesetEnter.append("rect").attr({
						id: "eff" + m,
						width: mainVis.eviWidth,
						height: mainVis.barHeight,
						transform: "translate( " + (mainVis.eviWidth+1) * m + ",0)"
					})
				}
			}
			else d3.select(this).selectAll(".onesetGroup").remove();
			if(curHeight > maxHeightofRow) maxHeightofRow = curHeight;
		})
		//console.log(maxHeightofRow)
		$(this).parent().parent().children(".mutationGroupBackground").css("height", (maxHeightofRow + mainVis.rowPaddingTop) + "px")
		//d3.select(this.parentNode.parentNode).attr("height", maxHeightofRow)
		//if(a.drug == "dasatinib") console.log(maxHeightofRow + " " + $(this).parent().parent().height())
	})
	updateBars(div, obj)
}

function updateBars(div = gloDiv, obj = visObj){
	var d3div = d3.select(div)
	//console.log("update bars")
	d3div.selectAll(".onesetGroup").each(function(d){
		d3.select(this).attr("class", "onesetGroup " + d.dataset);
		//onesetGroup visibility
		if(evidenceIndex[d.evidence] == undefined) console.log(d.evidence);
		var k = 4;
		for(; k + evidenceIndex[d.evidence] > 4; k--){
			d3.select(this).select("#eff"+k).style("visibility", "hidden")
		}
		for(; k > -1; k--){
			d3.select(this).select("#eff"+k).style("visibility", "visible")
		}
		// console.log(eviLevel)
		switch(d.effect){
			case "Responsive":  
			    d3.select(this).selectAll("rect")
					.style("fill", function(){ return d3.hsv(120, 1, 1 ); })
				break;
			case "Decreased sensitivity":
			case "Resistant": 
				d3.select(this).selectAll("rect")
					.style("fill", function(){ return d3.hsv(0, 1, 1); })
				break;
			case "No responsive":
			case "No Responsive": 
				d3.select(this).selectAll("rect")
					.style("fill", function(){ return d3.hsv(240, 1, 1); })
				break;
			case "Increased Toxicity": 
				d3.select(this).selectAll("rect")
					.style("fill", function(){ return d3.hsv(300, 1, 1); })
				break; 
			default: console.log("what!!!" + d.effect)
		}
	})
	for (var set in obj.dataset) {
	  //console.log(set + " -> " + dataset[set]);
	  if(!obj.dataset[set]) d3div.selectAll("." + set).style("display", "none")
	}
}

// var opacityTooltip = 0;

function valueClick(d, div = gloDiv){
	 
  var d3div = d3.select(div).select(".right")
  if(div != gloDiv) d3div.attr("width", $(div).parent().width())
  else $(div + "> .right").width("245px")
  //opacityTooltip = 1;
  //var mu = d.mutation;
  // var col = d3.select(self.parentNode).datum();
  // var row = d3.select(self.parentNode.parentNode).datum();

  // var div = d3.select("#right")
  d3div.selectAll(".sourceText").remove();
  d3div.selectAll(".paper").remove();
  var dataset = "";
  switch(d.value.dataset){ 
  	case "cgi": dataset = "CGI"; break;
  	case "synapse": dataset = "Synapse"; break;
  	case "oncokb": dataset = "OncoKB"; break;
  	case "dtc": dataset = "DTC"; break;
  	case "cosmic": dataset = "COSMIC"; break;
  	case "civic": dataset = "CIViC"; break;
  }
  //div.selectAll("a").remove(); Non-small cell lung cancers with ALK(L1196M) mutation are resistant to crizotinib treatment in clinical trial
  var evi = d.value.evidence;
  var eff = d.value.effect;
  var mu = "<b>" + d.mutation + "</b> ";
  if(mu.indexOf("wildtype") < 0) mu =  mu + "mutation ";
  if(dataset == "OncoKB") evi = "evidence level " + evi;
  if(evi == "Pre-clinical" || evi == "pre-clinical") evi = "pre-clinical assays"
  if(eff == "Increased Toxicity"){
  	if(d.tumor.indexOf("tumors") < 0)
  		eff = "<b>increases the toxicity</b> of"
  	else eff = "<b>increase the toxicity</b> of"
  }
  else{
  	if(d.tumor.indexOf("tumors") < 0)
  		eff = "is <b>" + eff + "</b> to";
  	else eff = "are <b>" + eff + "</b> to";
  }

  $(div).find(".descriptionText").html(dataset + ": <b>" + d.tumor + "</b> with " + mu + eff + " <b>" + d.drug + "</b> treatment in <b>" + evi + ".</b>" );
  
  if(d.value.dataset == "dtc"){
  		drawDtcDetail(d.value, div);
  }

  else{
  	d3div.selectAll("table").style("display", "none");
  	d3div.select("svg").style("display", "none");
	  var pubmedIdList = []

	  //console.log(r[0].source)
	  var parts = d.value.source.split(/[:;]+/)
	  for(var i = 0; i < parts.length; i++){
		  if(parts[i] == "PMID"){
		  		pubmedIdList.push(parts[i+1])
		  		i++;
		   }
		   else if(/^\d+$/.test(parts[i].trim())){
		   	 pubmedIdList.push(parts[i].trim())
		   }
		   else{
		   	 d3div.append("text").attr("class", "sourceText").text(parts[i]).append("br")
		   }
		}
		// console.log(pubmedIdList)
		retrieveAbstract(pubmedIdList, editPapers, div)
	}
     
}

function drawDtcDetail(data, div){
	var d3div = d3.select(div).select(".right")
	var bioactivities = data.bioactivities;
	//console.log(bioactivities)
	d3div.selectAll("table").style("display", "inline");
  	d3div.select("svg").style("display", "inline");
	var width = 220;//$("#right").width() - 30;
	mainVis.curFocusBar = null;
	//console.log(mainVis.curFocusBar)

	var headProperties = ["Compound ID", "Target ID", "Target Pref Name"]

	var rows = d3div.select(".headTable tbody").selectAll('tr')
		  .data(headProperties)
	var rowEnter = rows.enter().append('tr');
	rows.exit().remove();

	d3div.select(".headTable tbody").selectAll("tr").each(function(d, i){
		var cells = d3.select(this).selectAll('td').data( function () {
			 return [d, bioactivities[0][d]]
		})
		var cellEnter = cells.enter().append('td')
		cells.exit().remove();

		d3.select(this).selectAll("td").each(function(a){
			d3.select(this).text(a);
		})
	})

	d3div.selectAll(".bodyTable td").remove();
	
   var bioGroup = d3div.select(".bioGroup").selectAll(".onebioGroup").data(function(){
  		var bios = [];
  		bios.push({"Standard Type": "median", "Standard Relation": "=", "Standard Value": data.med, "Standard Units": ""})
		bios = bios.concat(bioactivities);
		return bios;
    })

	var bioGroupEnter = bioGroup.enter().append("g").attr({
		class: "onebioGroup"
	}).on("click", function(data, i){
		//toggle table
		//console.log(mainVis.curFocusBar)
		if(mainVis.curFocusBar != null)
			d3.select(mainVis.curFocusBar).select("rect").style("stroke-opacity", 0);
		d3.select(this).select("rect").style("stroke-opacity", 1);
		mainVis.curFocusBar = this;
		drawBioTable(data, i, div);
	})

	bioGroupEnter.append("rect").style({
		"stroke": "black",
		"stroke-width": "1px",
		// "stroke-opacity": 0,
	});
	bioGroupEnter.append("text").attr({
		"text-anchor": "end",
		"alignment-baseline": "hanging"
	})
	bioGroup.exit().remove();

	d3div.select(".bioGroup").append("line").attr({
		x1: 0,
		y1: 0,
		x2: 0,
		y2: (bioactivities.length + 1) * (mainVis.stackInterval+mainVis.stackWidth) + 10,
		stroke: "black",
		"stroke-width": "2px"
	});

	d3div.selectAll(".onebioGroup").each(function(c, k){
		d3.select(this).attr("transform", "translate(0," + ( (mainVis.stackInterval+mainVis.stackWidth)*k + 5)  + ")");
		d3.select(this).select("rect").style("stroke-opacity", 0);
		if(k == 0) d3.select(this).select("rect").style("fill", d3.hsv(120, 1, 1 ));
		else d3.select(this).select("rect").style("fill", "#ff9900");
		if(c["Standard Value"] >= 10000){
			d3.select(this).select("rect").attr({
				transform: "translate(5, 0)rotate(20)",
				height: mainVis.stackWidth,
				width: 2//range(0,8)
			})
		}
		else
		d3.select(this).select("rect").attr({
			transform: "translate(0, 0)",
			height: mainVis.stackWidth,
			width: (width - 5) * (- Math.log10(parseFloat(c["Standard Value"])) + 5) / 9//range(1,9)
		})

		d3.select(this).select("text").attr({
			transform: "translate(" + (width - 5) + ",2)"
		})
		.text(c["Standard Type"]+c["Standard Relation"]+ ( Math.round(parseFloat(c["Standard Value"]) * 10000) / 10000 ) +c["Standard Units"] );
	})

	$(div + "> .right").find("svg").width($(div + "> .right").find(".bioGroup").width())
	$(div + "> .right").find("svg").height($(div + "> .right").find(".bioGroup").height())

}

function drawBioTable(data, i, div){
	var d3div = d3.select(div).select(".right")

	 var bodyProperties = ["Measure", "Endpoint Mode of Action", "Compound Concentration", "Assay Format", 
	"Assay Type", "Assay Subtype", "Assay Cell Type", "Inhibitor Type", "Substrate Type", "Detection Technology", "PubMed ID", "Assay Description"];//,"Journal", "Authors", "Year", "Volume", "Issue", ,"Annotated", "Resource URI"];
    var rows = d3div.select(".bodyTable tbody").selectAll('tr').data(bodyProperties)
	var rowEnter = rows.enter().append('tr');
	rows.exit().remove();
	var onebio = data;

	d3div.select(".bodyTable tbody").selectAll("tr").each(function(d, i){
		var cells = d3.select(this).selectAll('td').data( function () {
			if(i == 0) return [d, onebio["Standard Type"] + onebio["Standard Relation"] + onebio["Standard Value"] + onebio["Standard Units"]];
			if(i == 2) return [d, onebio["Compound Concentration Value"] + onebio["Compound Concentration Units"]];
			if(i == 8) return [d, onebio["Substrate Type"] + onebio["Substrate Type Standard Relation"] + onebio["Substrate Type Standard Value"] + onebio["Substrate Type Standard Units"] ];
			   
			return [d, onebio[d]]
		})
		var cellEnter = cells.enter().append('td')
		cells.exit().remove();

		d3.select(this).selectAll("td").each(function(a){
			d3.select(this).text(a);
		})
	})
}

function editPapers(list, diva){
//"http://dx.doi.org/" + doi
	var tooltip = d3.select(diva).select(".right");
	//tooltip.selectAll(".paper").remove();

	for(var i = 0; i < list.length; i++){
		var div = tooltip.append("div").attr("class", "paper").style("word-wrap", "break-word")
		div.append("text").style("font-weight", "bold").text("Title").append("br")
		div.append("text").text(list[i].title).append("br")
		// div.append("text").style("font-weight", "bold").text("Abstract").append("br")
		// div.append("text").text(list[i].abstract).append("br")
		if(list[i].doi != null){
			var text = div.append('text').text("DOI ").style("font-weight", "bold");
			div.append("a")
	     	 .style({
	            'cursor':'pointer',
	            'text-decoration': 'underline'
	        }).on("click", function(){
	        	//$("#iframeFader").show();

	        	window.open("https://doi.org/" + this.text, '_blank');
	        	if(diva == gloDiv)
	        		pubAction(this.text)
	        	else{
	        		var element = this;            
					while (!d3.select(element).classed("gridDiv")) // while no class "parent" was found...
			    		element = element.parentElement;  
					var nodeid = d3.select(element).datum()._id
					pubAction({id: this.text, nodeid: nodeid})
	        	}
	            //$("#previewFrame").attr("src", "https://www.ncbi.nlm.nih.gov/pubmed/?term=" + this.text);
	        })
	     	 .text(list[i].doi)
	     	 .append("br")
		}
		div.append("br")
	}

}

function retrieveAbstract(idList, callback, div){
	idList = uniqArray(idList)
	var abstract = []; //{title: abstract:doi}
	var pre = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&id="
	$.ajax({
		type: "GET",
        url: pre + idList.join(","),
        dataType: "xml",
		success: function (XMLArray) {
		//if
        // var xml = $.parseXML(XMLArray);
        // 		console.log(xml)
        // 		console.log(pre + idList.join(","))

        $(XMLArray).find("PubmedArticleSet").find("PubmedArticle").each(function () {
        	var ar = $(this).find("MedlineCitation").find("Article")
        	var title = $(this).find("ArticleTitle").text()
        	        	// console.log(title)

        	var ab = $(this).find("Abstract").find("AbstractText").text()

        	var doi = $(this).find("ELocationID").text()
        	// console.log(doi)
        	if(doi == "")
        		doi = $(this).find("PubmedData").find("ArticleIdList").find("ArticleId[IdType='doi']").text()
            abstract.push({title: title, abstract: ab, doi: doi})
        });
        //
        callback(abstract, div);
    	},
    	error: function(){

    	}
    });
}
