//!!start a new transition before an old one ends on the same element will make the new one overwrite the old one!!
function drawDetailDis(div = gloDiv){
    var d3div = d3.select(div).append("div").attr("class","right");
    d3div.append("text").attr("class", "descriptionText")
    d3div.append("br")
    d3div.append("br");
    var headT = d3div.append("table").attr("class", "headTable");
    headT.append("tbody")
    var svg = d3div.append("svg");
    svg.append("g").attr("class", "bioGroup");
    var bodyT = d3div.append("table").attr("class", "bodyTable");
    bodyT.append("tbody")
}

function setMatrixHeightWidth(div){
    var d3div = d3.select(div)

    d3div.select(".headerSvg").attr("height", mainVis.headerHeight);
    // console.log($(div).height() + " " + $(div).find(".header").height())
    // d3div.select(".body").attr("height", ( $(div).height() - $(div).find(".header").height() ) )
    mainVis.eviWidth = (mainVis.columnWidth - 5)/ 5 - 1;
}

function updateHeaderHeightWidth(div = gloDiv, obj = visObj, rightwidth = 250){
	//console.log("update header width")
	var d3div = d3.select(div).select(".vis")

	mainVis.tumorGroupHeight = 0;

	d3div.selectAll(".tumorCol").attr("height", $(div).find(".tumorGroup").height());
	
    $(div).find(".tumorSvg").height($(div).find(".tumorGroup").height())

	var width = mainVis.barPaddingLeft + mainVis.headerHeight + mainVis.columnWidth * obj.colMuTu.length;
	d3div.select(".tumorSvg").attr("width", width);
	$(div).find(".headerSvg").width(width);
	
	//console.log($(div).width() - 250)
	if(width > $(div).width() - rightwidth){
		//console.log($(div).width() - 250)
		$(div).find(".header").width($(div).width() - rightwidth)
		$(div).find(".body").width($(div).width() - rightwidth)
		$(div).find(".headerSvg").width($(div).width() - rightwidth);
	}
	else{
		$(div).find(".header").width(width)
		$(div).find(".body").width(width)
		$(div).find(".headerSvg").width(width);
	}

	//console.log($(div).find(".header").width())

	d3div.select("#maskTumor"+ div.substring(1) ).select("rect").attr({
		x: mainVis.barPaddingLeft + mainVis.headerHeight,
		width: $(div).find(".header").width() - mainVis.barPaddingLeft - mainVis.headerHeight,
		height: $(div).find(".tumorGroup").height()
	})
	d3.select("#maskMutation"+ div.substring(1) ).select("rect").attr({
		x: 0,
		width: $(div).find(".header").width() - mainVis.barPaddingLeft,
		height: mainVis.headerHeight,
		transform: "skewX(-45)translate(" + (mainVis.headerHeight * 2 + 5) + "," + (0) + ")"
	})

}

function drawMutationHeader(div = gloDiv, obj = visObj){
	//console.log(gloDiv)
	var d3div = d3.select(div).append("div").attr("class", "vis");
	var header = d3div.append("div").attr("class", "header")
	
	header.append("label").attr("class", "toggleText").style("font-weight", "bold").text(function(){if(div == gloDiv) return" Tumor types"; return " "})
	header.append("svg").attr("class", "scrollSvg")
	var tumorDiv = header.append("div").attr("class", "tumorDiv")
	var tumorSvg = tumorDiv.append("svg").attr("class", "tumorSvg")
	tumorSvg.append("clipPath").attr("id", "maskTumor" + div.substring(1)).append("rect")
	var muDiv = header.append("div").attr("class", "mutationDiv")
	var muSvg = muDiv.append("svg").attr("class", "headerSvg")
	muSvg.append("clipPath").attr("id", "maskMutation" + div.substring(1)).append("rect")
		
	//var tumorHeader = d3.select("#headerSvg").append("g").attr("id", "tumorHeader");
	d3div.select(".tumorSvg").append("g").attr({
		class: "tumorColMaskGroup",
		'clip-path': "url(#maskTumor"+ div.substring(1) + ")"
	}).append("g").attr("class", "tumorColBackground")

	//tumorHeader.append("text").text()
	d3div.select(".tumorSvg").append("g").attr("class", "tumorGroup")
	//console.log($(div).children(".toggleText").width())

	//scroll
	var scrollGroup = d3div.select(".scrollSvg").attr("transform", 
		"translate(" + (mainVis.barPaddingLeft + mainVis.headerHeight - $(div).find(".toggleText").width() - 4) + ",2)").append("g").attr({
		class: "scrollGroup",
	})//.on("mousewheel.zoom", mouseScrollHorizontal);
	var dragScrollBehavior = d3.behavior.drag().on("drag", function(d){
              //console.log(d3.event.dx + " dxdy ")//+ d.x)
            var ox = d3.transform(d3.select(this).attr("transform")).translate[0];
            var nx = ox + d3.event.dx
            if(nx + obj.scrollDis.brushWidth >= obj.scrollDis.scrollbarLength) nx = obj.scrollDis.scrollbarLength - obj.scrollDis.brushWidth
            else if(nx <= 0) nx = 0;
            d3.select(this).attr("transform", function(d,i){
                return "translate(" + nx + ", 0)"
            })
            scrollPosition(-(obj.scrollDis.linearScale(nx)), div) // d3.selectAll(".tumorLineMaskGroup").attr("transform", "translate(" + ((mainVis.linearScale(nx))) + ",0)")
            //group2.attr("transform", "translate(" + (-(linearScale(nx)) + 250) + ",20)");
          })
	scrollGroup.append("line").attr({
      x1: 0,
      x2: 0,
      y1: 8,
      y2: 8,
      stroke: "grey",
      "stroke-width": "8px"
    });
    var scrollRect = scrollGroup.append("rect")//.attr("width", brushWidth)
			    .attr("height", 16)
			    .attr("transform", "translate(0,0)")
			    .attr("class", "rectDrag")
			    .style({
			      "fill": "#666",
			        //"opacity": .5,
			    }).call(dragScrollBehavior);

	//d3.select("#tumorSvg").append("g").attr("id", "tumorColBackground")

	if(div == gloDiv)
		d3div.select(".headerSvg").append("g").attr("class", "drugLabel").attr("transform", "translate(0, " + (mainVis.headerHeight - 5) + ")")
	.append("text").text("Drugs").style("font-weight", "bold")

	var mutationLabelGroup = d3div.select(".headerSvg").append("g").attr({
		class: "mutationLabelMaskGroup",
		"clip-path": "url(#maskMutation" + div.substring(1) + ")",
		transform: "translate(0,0)"
	}).append("g").attr("class", "mutationLabelGroup")
	.attr("transform", "translate(" + mainVis.mutXTranslate + ",0)");
}

function updateTumorRows(div = gloDiv, obj = visObj){
	var d3div = d3.select(div)
	var tumorRow = d3div.select(".tumorGroup").selectAll(".tumorRow").data(obj.disTumors, function(d){return d.tumor});

	var tumorRowEnter = tumorRow.enter().append("g").attr({
		class: "tumorRow",
	}).on("mouseover", function(d, i) {
		hoverTimeBegin = getTime();
		mouseoverTumorRow(d, div, obj);
		//if(div == "#main")
		selectionMenu(d.tumor, "tumor", d.hasNote, div)
		// var tip = d3.select(".tooltip").style("visibility", "visible")
//   					.style("left", (d3.event.pageX) + "px")     
//   					.style("top", (d3.event.pageY - 28) + "px")
		// tip.select("text").text(d.tumor)//tumorNameMatch[d.tumor]);
	})
	.on("mouseout", function(d){
		//console.log(d)
			mouseoutCell(div);
			//d3.select(".tooltip").style("visibility", "hidden")

			if(hoverTimeBegin != 0 && getTime() - hoverTimeBegin > 3000){
				if(div == gloDiv){
					hoverEntityAction({entity: d.tumor, type: "tumor"})
				}
				else{
					var element = this;            
					while (!d3.select(element).classed("gridDiv")) // while no class "parent" was found...
			    		element = element.parentElement;  
					var nodeid = d3.select(element).datum()._id;
					hoverEntityHisAction({entity: d.tumor, type: "tumor", nodeid: nodeid})
				}
				//userBehavior.push({type: "hoverTumorRow", time: hoverFormatedTime, tumor: d.tumor, mutations: d.mutations})
				//if(userBehavior.length > maxLog){
					//saveUserBehavior();
				//}
			}
		});
	tumorRow.exit().remove();
	tumorRow.order();

	tumorRowEnter.append("rect").attr({
		class: "tumorRowBackground",
		height: mainVis.rowHeight + mainVis.rowPaddingTop,
		// width: mainVis.columnWidth * currentActiveMutation.length
	})
	// .style({
	// 	fill: d3.rgb(254, 217, 166),
	// 	opacity: 0
	// })

	tumorRowEnter.append("text").attr({
		class: "tumorRemove",
		//transform: "translate(0, " + (mainVis.rowHeight / 2 + 5) + ")"
	}).on("click", function(d){
		hoverTimeBegin = 0;
		if(div == gloDiv)
			removeEntity({entity: d.tumor, type: "tumor"})
	}).style('cursor', "pointer")
	.style({"font-family": "FontAwesome",
		    "font-size": 15,
		    "text-anchor": "start",
		    "alignment-baseline": "hanging"
	})
	
	tumorRowEnter.append("text")
		.attr("class", "tumorLabel")
		.style({
			"text-anchor": "start",
			"alignment-baseline": "hanging",
			cursor: "e-resize",
		})
		.on("click", function(d){
			hoverTimeBegin = 0;
			mainVis.sortBy = {entity: d.tumor, type: "tumor"}
			if(div == gloDiv)
				pivotAction({entity: d.tumor, type: "tumor"})
			else{
				var element = this;            
				while (!d3.select(element).classed("gridDiv")) // while no class "parent" was found...
				    element = element.parentElement;  
				var nodeid = d3.select(element).datum()._id
				pivotHisAction({entity: d.tumor, type: "tumor", nodeid: nodeid})
			}
			sortDataRows(div, obj)
			sortCol(d.tumor, "tumor", -2, div, obj)
		})

	tumorRowEnter.append("g").attr({
		class: "tumorLineMaskGroup",
		//transform: "translate(" + (mainVis.barPaddingLeft + mainVis.headerHeight) + ",0)",
		"clip-path": "url(#maskTumor" + div.substring(1) + ")"
	})
	.append("g").attr("class", "tumorLineGroup").attr({
		//transform: "translate(" + (mainVis.barPaddingLeft + mainVis.headerHeight) + ",0)",
	})

	updateTumorLabel(div, obj)
}

function updateTumorLabel(div = gloDiv, obj = visObj){
	d3.select(div).selectAll(".tumorRow").selectAll(".tumorLabel").style("font-weight", function(d){
		//console.log(d.hasNote)
		if(d.hasNote) return "bold";
		return "normal"
	})
}

function updateTumorCol(div = gloDiv, obj = visObj){
	var d3div = d3.select(div);
	var tumorCol = d3div.select(".tumorColBackground").selectAll(".tumorCol").data(obj.colMuTu, function(d){return d.mutation+d.tumor})
	var tumorColEnter = tumorCol.enter().append("rect").attr({
		class: "tumorCol",
		width: mainVis.columnWidth - 5
	})
	// .on("mouseover", 
	// 	mouseoverMutation)
	// .on("mouseout", mouseoutCell);

	tumorCol.exit().remove();
	tumorCol.order();

	d3.selectAll(".tumorCol").style({
		fill: function(d, i){ if(i % 2 == 0) return "#fff"; return "#eee" },
		opacity: function(d, i){ if(i % 2 == 0) return 0; return .5 },
	})
}


function updateTumorTypes(div = gloDiv, obj = visObj){
	var d3div = d3.select(div)
	//console.log(curTumors)
	updateTumorRows(div, obj)
	//var tumorRowEnter = d3.selectAll(".tumorRow");
	// 	.on("mouseover", 
	// 	function(d, i) {
	// 		d3.select(this.parentNode).select(".tumorRowBackground").style("opacity", .5);
	// 		mouseoverTumorRow(d, i);
	// 	})
	// .on("mouseout", mouseoutCell);
		//.text(function(d){ return d.tumor })
	updateTumorMutationRelations(div, obj)
	updateTumorCol(div, obj)

	d3div.selectAll(".tumorCol").each(function(d, i){
		d3.select(this).attr({
		transform: "translate(" + (mainVis.barPaddingLeft + mainVis.headerHeight + mainVis.columnWidth * i) + ",0)",
		})
	})

	d3div.selectAll(".tumorRow").select(".tumorRowBackground").attr({
		width: mainVis.columnWidth * obj.colMuTu.length + mainVis.barPaddingLeft + mainVis.headerHeight - 5
	}).style({
		fill: function(d, i){ if(i % 2 == 0) return "#fff"; return "#eee" }, //d3.rgb(254, 217, 166)},
		opacity: function(d, i){ if(i % 2 == 0) return 0; return .5 },
	})


	d3div.selectAll(".tumorRow").each(function(d, i){
		//console.log(d.mutations)
		var re = $.grep(obj.selectedEntities, function(e){
			return e.entity == d.tumor;
		})

		d3.select(this).select(".tumorRemove").text(function(){
			if(re.length > 0){ 
				if(div == gloDiv) return "\uf00d"; 
				return "\uf245"
			}
			return "";
		});
		if(re.length > 0){
			d3.select(this).select(".tumorLabel").text(d.tumor)
			.attr({
				transform: "translate( 13, 1 )"
			})
			wrap(d3.select(this).select(".tumorLabel"), mainVis.barPaddingLeft + mainVis.headerHeight - 18)
		}
		else{
			d3.select(this).select(".tumorLabel").text(d.tumor).attr({
				transform: "translate( 0, 1 )"
			})
			wrap(d3.select(this).select(".tumorLabel"), mainVis.barPaddingLeft + mainVis.headerHeight - 5)
		}

		d3.select(this).select(".tumorLineGroup");;
		d3.select(this).selectAll(".tumorMutationGroup").attr("transform", function(d, i){return "translate(" + (mainVis.columnWidth * i) + ",0)"});
		d3.select(this).attr({
			transform: "translate(0, " + (mainVis.rowHeight + mainVis.rowPaddingTop) * i + ")"
		})
	});
	updateTumorMutationRelationDisplay(div);

}

function updateTumorMutationRelations(div = gloDiv, obj = visObj){
	var d3div = d3.select(div)
	//console.log(colMuTu)
	var tumorLine = d3div.selectAll(".tumorLineGroup").selectAll(".tumorMutationGroup").data(obj.colMuTu, function(d){return d.mutation + d.tumor})
	var tumorLineEnter = tumorLine.enter().append("line").attr({
		class: "tumorMutationGroup",
		x1: 0,
		// function(d, j) { 
		// 	//return mainVis.mutXTranslate + mainVis.headerHeight + mainVis.columnWidth * j 
		// 	return mainVis.columnWidth * j 
		// },
		x2: mainVis.columnWidth - 5,
		// function(d, j) { 
		// 	//return mainVis.mutXTranslate + mainVis.headerHeight + mainVis.columnWidth * (j + 1) - 5 
		// 	return mainVis.columnWidth * (j + 1) - 5 
		// },
		y1: mainVis.rowHeight / 2 - 1,
		y2: mainVis.rowHeight / 2 - 1,
		'stroke-width': 2,
		stroke: 'black',
		//transform: function(d, i){return "translate(" + (mainVis.columnWidth * i) + ",0)"}

	})//.append("rect")

	tumorLine.exit().remove();
	tumorLine.order();

}

function updateTumorMutationRelationDisplay(div = gloDiv){
	var d3div = d3.select(div);
	// d3.selectAll(".tumorLineGroup").each(function(d, i){
	// 	var maxHeightofRow = 0;
	// 	//console.log( d.mutations)
	// 	d3.select(this).selectAll(".tumorMutationGroup").each(function(a, j){
	// 		var re = $.grep(d.mutations, function(e){
	// 			return a.mutation == e.mutation && d.tumor == a.tumor
	// 		})
	// 		var states = []
	// 		if(re.length > 0){
	// 			for(var m = 0; m < re[0].state.length; m++){
	// 				for(var n = 0; n < re[0].state[m].source.length; n++){
	// 					states.push({state: re[0].state[m].state, source: re[0].state[m].source[n]})
	// 				}
	// 			}
	// 			if(states.length == 0){
	// 				states.push({state: "unknown", source: ""})
	// 			}
	// 			var curHeight = states.length * (mainVis.barHeight / 2 + 1)
	// 			if(maxHeightofRow < curHeight) maxHeightofRow = curHeight

	// 			var rect = d3.select(this).selectAll(".tuMuRect").data(states);
	// 			var rectEnter = rect.enter().append("rect").attr({
	// 				class: "tuMuRect",
	// 				height: mainVis.barHeight / 2,
	// 				width: mainVis.columnWidth - 5,
	// 			})

	// 			rect.exit().remove();
	// 			d3.select(this).selectAll(".tuMuRect").attr({
	// 				class: function(c){return "tuMuRect " + c.source.toLowerCase()},
	// 				fill: function(c){
	// 					return driverRects[c.state]
	// 				},
	// 				transform: function(c, m){ return "translate(0, " + (mainVis.barHeight / 2 + 1) * m + ")"}
	// 			})
	// 		}
	// 		else {
	// 			d3.select(this).selectAll(".tuMuRect").remove()
	// 		}
			
	// 	})
	// 	if(maxHeightofRow < mainVis.rowHeight) maxHeightofRow = mainVis.rowHeight
	// 	$(this).parent().parent().children(".tumorRowBackground").css("height", maxHeightofRow + "px")
	// })
	d3div.selectAll(".tumorLineGroup").each(function(d, i){
		var maxHeightofRow = 0;
		//console.log( d.mutations)
		d3.select(this).selectAll(".tumorMutationGroup").each(function(a, j){
			var re = $.grep(d.mutations, function(e){
				return a.mutation == e.mutation && d.tumor == a.tumor
			})
			//var states = []
			if(re.length > 0){
				d3.select(this).style("opacity", 1)
				// for(var m = 0; m < re[0].state.length; m++){
				// 	for(var n = 0; n < re[0].state[m].source.length; n++){
				// 		states.push({state: re[0].state[m].state, source: re[0].state[m].source[n]})
				// 	}
				// }
				// if(states.length == 0){
				// 	states.push({state: "unknown", source: ""})
				// }
				// var curHeight = states.length * (mainVis.barHeight / 2 + 1)
				// if(maxHeightofRow < curHeight) maxHeightofRow = curHeight

				// var rect = d3.select(this).selectAll(".tuMuRect").data(states);
				// var rectEnter = rect.enter().append("rect").attr({
				// 	class: "tuMuRect",
				// 	height: mainVis.barHeight / 2,
				// 	width: mainVis.columnWidth - 5,
				// })

				// rect.exit().remove();
				// d3.select(this).selectAll(".tuMuRect").attr({
				// 	class: function(c){return "tuMuRect " + c.source.toLowerCase()},
				// 	fill: function(c){
				// 		return driverRects[c.state]
				// 	},
				// 	transform: function(c, m){ return "translate(0, " + (mainVis.barHeight / 2 + 1) * m + ")"}
				// })
			}
			else {
				d3.select(this).style("opacity", 0)
			}
			
		})
		//if(maxHeightofRow < mainVis.rowHeight) maxHeightofRow = mainVis.rowHeight
		//$(this).parent().parent().children(".tumorRowBackground").css("height", maxHeightofRow + "px")
	})
}

// function updateTuMuDis(set){
// 	d3.selectAll("." + set).style("display", function(){
// 		if(driverSet[set]) return "inline";
// 		else return "none";
// 	});
// }

function updateMutationLabels(div = gloDiv, obj = visObj){
	var d3div = d3.select(div)
	var mutationLabel = d3div.select(".mutationLabelGroup").selectAll(".mutationLabel").data(obj.colMuTu, function(d){return d.mutation+d.tumor});

	//var mutationRect = d3.select("#mutationLabelGroup").selectAll(".mutationRect").data(activeMutation);
	//var mutationText = d3.select("#mutationLabelGroup").selectAll(".mutationText").data(activeMutation);

	var mutationLabelEnter = mutationLabel.enter().append("g").attr("class", "mutationLabel")
			.on("mouseover", function(d, i) {
				hoverTimeBegin = getTime()
				//if(div == "#main")
				selectionMenu(d.mutation, "mutation", d.hasNote, div)
				mouseoverMutation(d, obj.colMuTu.indexOf(d), div) 
			})
			.on("mouseout", function(d){
				if(hoverTimeBegin != 0 && getTime() - hoverTimeBegin > 3000){
					if(div == gloDiv)
						hoverEntityAction({entity: d.mutation, type: "mutation"})
					else{
						var element = this;            
						while (!d3.select(element).classed("gridDiv")) // while no class "parent" was found...
				    		element = element.parentElement;  
						var nodeid = d3.select(element).datum()._id
						hoverEntityHisAction({entity: d.mutation, type: "mutation", nodeid: nodeid})
					}
					//userBehavior.push({type: "hoverTumorRow", time: hoverFormatedTime, tumor: d.tumor, mutations: d.mutations})
					//if(userBehavior.length > maxLog){
						//saveUserBehavior();
					//}
				}
				mouseoutCell(div);
				//d3.select(".tooltip").style("visibility", "hidden")
			})
	mutationLabel.exit().remove();
	mutationLabel.order();

	//var textGroup = mutationLabelEnter.append("g").attr("class", "mutationGroup");
	// console.log(currentActiveMutation)
	var mutationRect = mutationLabelEnter.append('rect').attr({
		class: "mutationRect",
		width: mainVis.columnWidth - 5,
		height: mainVis.headerHeight,
		transform: "skewX(-45)translate( -9 "/*(mainVis.headerHeight)*/ + ", " + ( - mainVis.headerHeight) + ")",
		y: 10
	})//.append("g").attr("class", "mutationLabel");
	.on("click", function(d, i){
		hoverTimeBegin = 0;
		mainVis.sortBy = {entity: d.mutation, type: "mutation"}//{mutation: d.mutation, tumor: d.tumor};
		sortDataRows(div, obj);
		sortCol(d.mutation, "mutation", obj.colMuTu.indexOf(d), div, obj)
		if(div == gloDiv)
			pivotAction({entity: d.mutation, type: "mutation"})
		else{
			var element = this;            
			while (!d3.select(element).classed("gridDiv")) // while no class "parent" was found...
			    element = element.parentElement;  
			var nodeid = d3.select(element).datum()._id
			pivotHisAction({entity: d.mutation, type: "mutation", nodeid: nodeid})
		}
		// $("#GI").prop("checked", false);
		// $("#sortDTC").prop("checked", false);
	}).style("cursor", "s-resize")
	// .on("mouseover", function(d,i){ mouseoverCol(d, i) } )


	var mutationDelete = mutationLabelEnter.append("text")
							.attr("class", "mutationRemove")
							.attr("transform", "translate(-6, 8)")
							.on("click", function(d){
								hoverTimeBegin = 0;
								if(div == gloDiv)
									removeEntity({entity: d.mutation, type: "mutation"})
							}).style('cursor', "pointer")
							.style({"font-family": "FontAwesome",
								"font-size": 15})

	var mutationTextEnter = mutationLabelEnter.append('text').attr({
		class: "mutationText",
		transform: "translate( 10, 0 )rotate(-45)"
	}).on("click", function(d, i){
		hoverTimeBegin = 0;
		mainVis.sortBy = {entity: d.mutation, type: "mutation"} //{mutation: d.mutation, tumor: d.tumor};
		sortDataRows(div, obj);
		sortCol(d.mutation, "mutation", obj.colMuTu.indexOf(d), div, obj)
		if(div == gloDiv)
			pivotAction({entity: d.mutation, type: "mutation"})
		else{
			var element = this;            
			while (!d3.select(element).classed("gridDiv")) // while no class "parent" was found...
			    element = element.parentElement;  
			var nodeid = d3.select(element).datum()._id
			pivotHisAction({entity: d.mutation, type: "mutation", nodeid: nodeid})}
		//console.log(colMuTu.indexOf(d))
		// $("#sortTotalStrength").prop("checked", false);
		// $("#sortNumberofMutations").prop("checked", false);
	}).style("cursor", "s-resize")
}

function updateMutationHeader(div = gloDiv, obj = visObj, rightwidth = 250){
	var d3div = d3.select(div)
	// console.log("mutation HHHH")
	updateTumorTypes(div, obj)
	updateHeaderHeightWidth(div, obj, rightwidth)
	updateMutationLabels(div, obj)

	updateMutationDataValue(div)

	d3div.selectAll(".mutationLabel").each(function(d, i){
		d3.select(this).attr("transform", function(){
			return "translate( " + (mainVis.columnWidth * ( i + 1/2)) + "," + ( mainVis.headerHeight - 10) + ")"
		})
	})

	d3div.selectAll(".mutationText").text(function(d){ return d.mutation; })//if(d.type == "mutant") return d.mutation; return d.mutation + " wildtype" })
	d3div.selectAll(".mutationRemove").text(function(d){
		var re = $.grep(obj.selectedEntities, function(e){
			return e.entity == d.mutation;
		})
		if(re.length > 0){
			if(div == gloDiv) return "\uf00d";
			return "\uf245"
		}
		return "";
	})
	d3div.selectAll(".mutationRect").style("fill", function(d, i){ 
		return "#eee"})

	d3div.selectAll(".mutationLabel").each(function(d, i){
		wrap(d3.select(this).select(".mutationText"), mainVis.headerHeight)
	})
	
}

function updateMutationDataValue(div = gloDiv){	
	var d3div = d3.select(div)
	d3div.selectAll(".mutationLabel").each(function(d, i){
		// console.log(d);
		d3.select(this).select(".mutationRemove")
		d3.select(this).select(".mutationRect")

		//d3.select(this).select(".mutationRect")
		d3.select(this).select(".mutationText").style("font-weight", function(d){
			if(d.hasNote) return "bold";
			return "normal"
		})//.data(d)
		
		//d3.select(this).select(".stackGroup")
	})
}

function mouseScrollHorizontal(div = gloDiv, obj = visObj){
    var d3div = d3.select(div)
    //console.log(obj)// + " " + obj.scrollDis.scrollbarLength)
    if($(div).find(".scrollSvg").css("display") == "none" || Math.abs(d3.event.wheelDeltaX) <= Math.abs(d3.event.wheelDeltaY)) return;
    //console.log(d3.event.wheelDeltaX + " " + d3.event.wheelDeltaY)
    //d3.event.preventDefault();

    var ox = d3.transform(d3div.select(".rectDrag").attr("transform")).translate[0];
    var nx = ox - d3.event.wheelDeltaX
    if(nx + obj.scrollDis.brushWidth >= obj.scrollDis.scrollbarLength) nx = obj.scrollDis.scrollbarLength - obj.scrollDis.brushWidth
    else if(nx <= 0) nx = 0;
    d3div.select(".rectDrag").attr("transform", function(d,i){
        return "translate(" + nx + ", 0)"
    })
    scrollPosition(-(obj.scrollDis.linearScale(nx)), div) 
}

