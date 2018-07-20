function mouseoutCol(div){
	var d3div = d3.select(div);
	d3div.selectAll(".tumorCol").style({
		fill: function(d, i){ if(i % 2 == 0) return "#fff"; return "#eee" }, //d3.rgb(254, 217, 166)},
		opacity: function(d, i){ if(i % 2 == 0) return 0; return .5 },
	});
	// //d3.select(cols[0][i]).style("opacity", .5)

	d3div.selectAll(".mutationRect").style("fill", "#eee")//function(d, i) { if(d.type == "mutant") return "#eee"; return "#bbb"});
	// //d3.select(cols[0][i]).style("fill", d3.rgb(254, 217, 166))

	d3div.selectAll(".colBackground").style({
		fill: function(d, i){ if(i % 2 == 0) return "#fff"; return "#eee" }, //d3.rgb(254, 217, 166)},
		opacity: function(d, i){ if(i % 2 == 0) return 0; return .5 },
	})
	//d3.select(cols[0][i]).style("opacity", .5)
}

function mouseoverDrug(d, div, obj){
	var d3div = d3.select(div)
	//console.log("drug")
	//console.log(d) d is one datarow
	mouseoutCell(div)
	var hightMutationList = [];//mutation and tumor pair
	var highlightTumorList = [];//tumor name
	// var mutationList = []
	// //var rows = d3.selectAll(".mutationGroupBackground")
	//var par = d3.select(self.parentNode)
	d3div.selectAll(".mutationGroupBackground").filter(function(data, m){ return data.drug == d.drug}).style({
		fill:d3.rgb(254, 217, 166),
		opacity: .5
	})

	d3div.selectAll(".oneRow").filter(function(data, m){ return data.drug == d.drug}).selectAll(".onesetGroup").each(function(data, m){
		if($(this).css("display") != "none"){
			var datum = d3.select(this.parentNode).datum();
			var index = obj.colMuTu.indexOf(datum);
			//console.log(index)
			if(hightMutationList.indexOf(index) < 0){
				//console.log(index)
				hightMutationList.push(index)
			}
			if(highlightTumorList.indexOf(index) < 0)
				highlightTumorList.push(datum.tumor);
		}
	})
	//console.log(hightMutationList)

	d3div.selectAll(".colBackground").filter(function (data, m) { return hightMutationList.indexOf(m) > -1;})
	.style({
		fill : d3.rgb(254, 217, 166),
		opacity: .5
	})

	d3div.selectAll(".mutationRect").filter(function (data, m) { return hightMutationList.indexOf(m) > -1;})
	 .style({fill : d3.rgb(254, 217, 166)})

	d3div.selectAll(".tumorCol").each(function(data,m){
		if(hightMutationList.indexOf(m) > -1){
			//console.log(m)
			d3.select(this).style({fill : d3.rgb(254, 217, 166),
				opacity: 0.5
			})
		}
	})
	.filter(function (data, m) { return hightMutationList.indexOf(m) > -1;})
	.style({fill : d3.rgb(254, 217, 166),
		opacity: 0.5
	})

	d3div.selectAll(".tumorRowBackground").filter(function(data){  return highlightTumorList.indexOf(data.tumor) > -1;})
	.style({
		fill : d3.rgb(254, 217, 166),
		opacity: 0.5
	})

}

function mouseoverMutation(d, i, div){
	var d3div = d3.select(div)
	//console.log("mutation")
	d3div.selectAll(".tumorCol").each(function(a, j){
		if(i == j){
			//console.log(j)
			d3.select(this).style({fill : d3.rgb(254, 217, 166),
				opacity: 0.5
			})
		}
	})
	d3div.selectAll(".mutationRect").each(function(a, j){
		if(a.mutation == d.mutation)
		//if(i == j)
			d3.select(this).style({fill : d3.rgb(254, 217, 166),
				//opacity: 0.5
			})
	})

	d3div.selectAll(".colBackground").each(function(a, j){
		if(i == j)
			d3.select(this).style({fill : d3.rgb(254, 217, 166),
				opacity: 0.5
			})
	})
	// mouseoverCol(d, i)
	d3div.selectAll(".tumorRowBackground").each(function(a, j){
		if(d.tumor == a.tumor){
			d3.select(this).style({fill : d3.rgb(254, 217, 166),
				opacity: 0.5
			})
			//break;//.select(".tumorRowBackground").style("opacity", .5);
		}
	})
}

function mouseoverTumorRow(d, div, obj){
	var d3div = d3.select(div)
// 	console.log(d.tumor)
	d3div.selectAll(".tumorRowBackground").each(function(a, j){
		if(d.tumor == a.tumor){
			d3.select(this).style({fill : d3.rgb(254, 217, 166),
				opacity: 0.5
			})
			//break;//.select(".tumorRowBackground").style("opacity", .5);
		}
	})

	d3div.selectAll(".tumorCol").each(function(a, j){
		if(d.tumor == a.tumor){
			//console.log(a.tumor)
			d3.select(this).style({fill : d3.rgb(254, 217, 166),
				opacity: 0.5
			})
		}
	})
	d3div.selectAll(".mutationRect").each(function(a, j){
		if(d.tumor == a.tumor)
			d3.select(this).style({fill : d3.rgb(254, 217, 166),
				//opacity: 0.5
			})
	})

	d3div.selectAll(".colBackground").each(function(a, j){
		if(d.tumor == a.tumor)
			d3.select(this).style({fill : d3.rgb(254, 217, 166),
				opacity: 0.5
			})
	})

	d3div.selectAll(".mutationGroupBackground").each(function(data, i){ 
		var contains = false;
		for(var j = 0; j < data.mutationTumor.length; j++){
			if(data.mutationTumor[j].tumor == d.tumor){
				for(var k = 0; k < data.mutationTumor[j].values.length; k++){
					if(obj.dataset[data.mutationTumor[j].values[k].dataset]){
						//console.log(data.mutationTumor[j].values[k].dataset)
						contains = true;
						break;
					}
				}
				if(contains)
					break;
			}
		}
		if(contains) {
			d3.select(this).style({
				fill : d3.rgb(254, 217, 166),
				opacity: .5
			})
		}	
	})
	 
}

function mouseoutRow(div){
	var d3div = d3.select(div)
	d3div.selectAll(".mutationGroupBackground").style({
		fill: function(d, i){ if(i % 2 == 0) return "#fff"; return "#eee" }, //d3.rgb(254, 217, 166)},
		opacity: function(d, i){ if(i % 2 == 0) return 0; return .5 },
	});
	d3div.selectAll(".tumorRowBackground").style({
		fill: function(d, i){ if(i % 2 == 0) return "#fff"; return "#eee" }, //d3.rgb(254, 217, 166)},
		opacity: function(d, i){ if(i % 2 == 0) return 0; return .5 },
	})
	//mouseoutCol()
}

function mouseoverCell(d, div){
	var d3div = d3.select(div);
	// console.log(d.mutation)
	// console.log(d.tumor)
	d3div.selectAll(".tumorRowBackground").each(function(a, j){
		if(d.tumor == a.tumor){
			d3.select(this).style({fill : d3.rgb(254, 217, 166),
				opacity: 0.5
			});
			//break;//.select(".tumorRowBackground").style("opacity", .5);
		}
	})

	d3div.selectAll(".tumorCol").each(function(a, j){
		if(d.tumor == a.tumor && d.mutation == a.mutation)
			d3.select(this).style({fill : d3.rgb(254, 217, 166),
				opacity: 0.5
			})
	})
	d3div.selectAll(".mutationRect").each(function(a, j){
		if(d.tumor == a.tumor && d.mutation == a.mutation)
			d3.select(this).style({fill : d3.rgb(254, 217, 166),
				//opacity: 0.5
			})
	})

	d3div.selectAll(".colBackground").each(function(a, j){
		if(d.tumor == a.tumor && d.mutation == a.mutation)
			d3.select(this).style({fill : d3.rgb(254, 217, 166),
				opacity: 0.5
			})
	})

	d3div.selectAll(".mutationGroupBackground").each(function(a,j){
		if(a.drug == d.drug) d3.select(this).style({
			fill:d3.rgb(254, 217, 166),
			opacity: 0.5
		})
		
	})
}

function mouseoutCell(div){
	//console.log("mouse out")
	mouseoutCol(div);
	mouseoutRow(div);
}