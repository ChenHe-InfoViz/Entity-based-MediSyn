Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

function sortCol(name, type, index, div, obj){
	var d3div = d3.select(div)
	var curRelatedCount = 0;
	switch(type){
		case "tumor": 
			d3div.select(".rectDrag").transition().duration(1000).attr("transform", function(){
	            return "translate(0, 0)"
	        })
			scrollPosition(0, div);
			for(var i = 0; i < obj.colMuTu.length; i++){
				if(obj.colMuTu[i].tumor == name){
					if(i > curRelatedCount){
						obj.colMuTu = obj.colMuTu.move(i, curRelatedCount)
						//console.log(colMuTu[i].tumor)
					}
					curRelatedCount++;
				}
			}	
			sortColDis(div, obj);
			mouseoverTumorRow({tumor: name}, div, obj)
			//console.log(colMuTu)
			break;
		case "drug": 
			d3div.select(".rectDrag").transition().attr("transform", "translate(0, 0)");
			scrollPosition(0, div);
			var drugObj = $.grep(obj.dataRow, function(e){
				return e.drug == name;
			})

			for(var i = 0; i < obj.colMuTu.length; i++){
				if(obj.colMuTu[i].drugs.indexOf(name) > -1){
					//make sure that data betweem drug and mutations are showing
					var re = $.grep(drugObj[0].mutationTumor, function(e){ return e.mutation == obj.colMuTu[i].mutation && e.tumor == obj.colMuTu[i].tumor})
					var contains = false;
					for(var k = 0; k < re[0].values.length; k++){
						if(obj.dataset[re[0].values[k].dataset]){
							//console.log(re[0].values[k].dataset)
							contains = true;
							break;
						}
					}
					if(contains){
						if(i > curRelatedCount){
							obj.colMuTu = obj.colMuTu.move(i, curRelatedCount)
							//console.log(colMuTu[i].tumor)
						}
						curRelatedCount++;
					}
				}
			}
			sortColDis(div, obj);
			mouseoverDrug({drug: name}, div, obj)
			break;
		case "mutation":
			var t = obj.colMuTu[index].tumor;
			curRelatedCount = index - 1;
			for(var i = index - 1; i >= 0; i--){
				if(obj.colMuTu[i].mutation == name){
					if(i < curRelatedCount)
						obj.colMuTu = obj.colMuTu.move(i, curRelatedCount)
					curRelatedCount--;
					//console.log(curRelatedCount)
				}
			}
			curRelatedCount = index + 1;
			for(var i = curRelatedCount; i < obj.colMuTu.length; i++){
				if(obj.colMuTu[i].mutation == name){
					if(i > curRelatedCount){
						obj.colMuTu = obj.colMuTu.move(i, curRelatedCount)
						//console.log(colMuTu[i].tumor)
					}
					curRelatedCount++;
				}
			}
			//console.log(colMuTu)
			sortColDis(div, obj);
			mouseoverMutation({tumor: t}, index, div)
			break;
	}
}

function updateTumorRowOrder(div, obj){
	var d3div = d3.select(div)
	updateTumorRows(div, obj)
	d3div.selectAll(".tumorRow").each(function(d, i){
		d3.select(this).transition().duration(1000).attr({
				transform: "translate(0, " + (mainVis.rowHeight + mainVis.rowPaddingTop) * i + ")"
		})
	})
	d3div.selectAll(".tumorRow").select(".tumorRowBackground").style({
		fill: function(d, i){ if(i % 2 == 0) return "#fff"; return "#eee" }, //d3.rgb(254, 217, 166)},
		opacity: function(d, i){ if(i % 2 == 0) return 0; return .5 },
	})
}

function sortColDis(div, obj){
	//console.log("sortColDis")
	var d3div = d3.select(div)
	updateTumorMutationRelations(div, obj)
	updateTumorCol(div, obj)
	updateMutationLabels(div, obj)
	updateMutationDrugRelations(div, obj)
	updateColBackground(div, obj);
	//d3.selectAll(".tumorLineGroup").selectAll(".tumorMutationGroup")
	d3div.selectAll(".tumorLineGroup").each(function(){
		//var curRelatedCount = 0;
		d3.select(this).selectAll(".tumorMutationGroup").each(function(d, i){
			d3.select(this).transition().duration(1000).attr({
				transform: "translate(" + (mainVis.columnWidth * i) + ",0)"
			})
		})
	})
	d3div.selectAll(".mutationGroup").each(function(){
		//var curRelatedCount = 0;
		d3.select(this).selectAll(".dataGroup").each(function(d, i){
			d3.select(this).transition().duration(1000).attr({
				transform: "translate(" + (mainVis.columnWidth * i) + ",0)"
			})
		})
	})
	d3div.selectAll(".mutationLabel").each(function(d, i){
		d3.select(this).transition().duration(1000).attr("transform", 
			"translate( " + (mainVis.columnWidth * ( i + 1/2)) + "," + ( mainVis.headerHeight - 10) + ")"	
		)
	})

	d3div.selectAll(".tumorCol").each(function(d, i){
		d3.select(this).transition().duration(1000).attr({
		transform: "translate(" + (mainVis.barPaddingLeft + mainVis.headerHeight + mainVis.columnWidth * i) + ",0)",
		})
	})

	d3div.select(".colBackgroundGroup").selectAll(".colBackground").transition().duration(1000).attr({
		transform: function(d, i){ return "translate(" + (mainVis.barPaddingLeft + mainVis.columnWidth * i) + ",0)"}
	})
}

function sortTumorRows(tumors, div, obj){
	var curPosition = obj.disTumors.length - 1;

	for(var i = obj.disTumors.length - 1; i >= 0; i--){
		if(tumors.indexOf(obj.disTumors[i].tumor) > -1){
			if(i < curPosition)
				obj.disTumors.move(i, curPosition)
			curPosition--;
		}
	}
	updateTumorRowOrder(div, obj)
	var ele = $(div).find(".tumorDiv")
	ele.scrollTop(ele.prop('scrollHeight'));
}

function sortDataRows(div, obj){
	switch(mainVis.sortBy){
		case "totalStrength": 
			function sortPotency(a, b){ //negative: a in front of b; positive b in front
				//if(potencyRange[0] == 0 && potencyRange[1] == 3){
				// if(a.total == 0 && b.total == 0) return 1;
				var countA = 0, countB = 0;
				for(var i = 0; i < a.mutations.length; i++){
					if(a.mutations[i].dataset.indexOf("DTC") > -1)
						countA++;
				}
				for(var i = 0; i < b.mutations.length; i++){
					if(b.mutations[i].dataset.indexOf("DTC") > -1)
						countB++;
				}
				if(countA != countB) return countB - countA;
				else 
				if(b.total == 0) return b.total - a.total;
				if(a.total == 0) return b.total;
				return b.total - a.total;
			
			}
			dataRow.sort(function(a, b){
				return sortPotency(a,b)
			})
			d3.selectAll(".oneRow").sort(function(a, b){
				return sortPotency(a, b);
			})
			//console.log(dataRow);
			break;
		case "numberOfMutations": 
			//d3.selectAll(".oneRow").sort(function(a, b){
			sortNumberOfMutations = function(a, b){
				// console.log(a)
				var countA = 0, countB = 0, resA = 0, resB = 0, eviA = 0, eviB = 0, temp;
				// for(var i = 0; i < a.mutationTumor.length; i++){
				// 	temp = a.mutations[i];
				// 	if(temp.dataset.indexOf("CGI") > -1 && evidenceLevel[ temp.evidence ] <= evidenceRange[1] && evidenceLevel[temp.evidence] >= evidenceRange[0])
				// 		countA++;
				// 		if(temp.effect == "Responsive"){
				// 			resA++;
				// 			eviA += evidenceLevel[ a.mutations[i].evidence ];
				// 		}
				// }
				// for(var i = 0; i < b.mutations.length; i++){
				// 	temp = b.mutations[i]
				// 	if(temp.dataset.indexOf("CGI") > -1 && evidenceLevel[ temp.evidence ] <= evidenceRange[1] && evidenceLevel[temp.evidence] >= evidenceRange[0])
				// 		countB++;
				// 		if(temp.effect == "Responsive"){
				// 			resB++;
				// 			eviB += evidenceLevel[ b.mutations[i].evidence ];
				// 		}
				// }

				if(resA == resB)
					return countB - countA;
				return resB - resA;
			}
			dataRow.sort(function(a,b){
				return sortNumberOfMutations(a,b);
			})

			d3.selectAll(".oneRow").sort(function(a,b){ return sortNumberOfMutations(a,b); })

			//console.log(dataRow)
			break;
		default: //sort by drugs
		//to do: consider filters!!
			var aRe, bRe, aWeight, bWeight;

			if(mainVis.sortBy.type == "mutation"){
				var curPosition = obj.disTumors.length - 1;

				for(var i = obj.disTumors.length - 1; i >= 0; i--){
					// if(disTumors[i].tumor == mainVis.sortBy.tumor){
					// 	disTumors.move(i, disTumors.length - 1)
					// 	break;
					// }
					var re = $.grep(obj.disTumors[i].mutations, function(e){
						return e.mutation == mainVis.sortBy.entity
					})
					if(re.length > 0){
						if(i < curPosition)
							obj.disTumors.move(i, curPosition)
						curPosition--;
					}
				}
				updateTumorRowOrder(div, obj)
				var ele = $(div).find(".tumorDiv")
				ele.scrollTop(ele.prop('scrollHeight'));
			}
			
			$(div).find(".body").scrollTop(0);
			obj.dataRow.sort(function(a, b){
				var ind = sortByDrug(a, b)
				//console.log(i);
				return ind;
			})
			function sortByDrug(a,b){
				aRe = $.grep(a.mutationTumor, function(e){
					return e[mainVis.sortBy.type] == mainVis.sortBy.entity//e.mutation == mainVis.sortBy.mutation && e.tumor == mainVis.sortBy.tumor;
				})
				bRe = $.grep(b.mutationTumor, function(e){
					return e[mainVis.sortBy.type] == mainVis.sortBy.entity//e.mutation == mainVis.sortBy.mutation && e.tumor == mainVis.sortBy.tumor;
				})
				//sort by responsiveness, then potency
				//see if the data is showing under the filters
				
				function weightCalc(array){
					var weight = 0;
					for(var j = 0; j < array.length; j++){
						var ob = array[j]
						for(var i = 0; i < ob.values.length; i++){
							//console.log()
							if(obj.dataset[ob.values[i].dataset]) weight += 5 - evidenceIndex[ob.values[i].evidence];
						}
					}
					//console.log(ob.values)
					//console.log(weight)
					return weight;
				}//the larger the better

				if(aRe.length > 0 && bRe.length > 0){
					if(aRe.length > bRe.length) return -1;
					else if(aRe.length < bRe.length) return 1;
					//console.log("both")
					aWeight = weightCalc(aRe)
					bWeight = weightCalc(bRe)
					if(aWeight < bWeight) return 1;
					else if(bWeight < aWeight) return -1;
					else if(a.drug < b.drug) return -1;
					else if(a.drug > b.drug) return 1;
					return -1;//dataRow.indexOf(a) - dataRow.indexOf(b);
				}
				else if(aRe.length > 0){
					//console.log("a")
					return -1;
				}
				else if(bRe.length > 0){
					//console.log("b")
					return 1;
				}
				//console.log("00000")
				//console.log(dataRow.indexOf(a) - dataRow.indexOf(b))
				else if(a.drug < b.drug) return -1;
				else if(a.drug > b.drug) return 1;
				return -1; //dataRow.indexOf(a) - dataRow.indexOf(b);
		}
	}
	//updateTumorRowOrder()
	rowTransition(1000, div, obj);
}