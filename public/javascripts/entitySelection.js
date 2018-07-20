function entityChecked(){ //type: mutation, drug, or tumor

    //clearDetail()
    for(var i = 0; i < mutationWaitingList.length; i++){    
        document.getElementById("input" + mutationWaitingList[i].entity).checked = true;
    }
    visObj.selectedEntities = visObj.selectedEntities.concat(mutationWaitingList);
    updateSelectedEntityView();
    updateNoteLabelBack();
    var count = {total: 2}
    var list = mutationWaitingList.slice(0);
    mutationWaitingList = [];
    $("body").css("cursor", "progress")
    //$('input[value="' + entity.entity + '"]').checked = true;
    retrieveDtc(list, count)
    retrieveEffects(list, count)
    //entityCheckedLeft(entity)
    
}

function retrieveEffects(entityList, count){
    $.ajax({
            type: "POST",
            url: "/effect",
            contentType:'application/json',
            dataType: "json",
            data: JSON.stringify(entityList),
            success: function(response){
                try{
                    //console.log(response)
                  //var list = processBioactivity(response.bioactivities, mutation, "mutant")
                  var ob;
                  for(var i = 0; i < response.length; i++){
                    var re = $.grep(selectedData, function(e){
                        return e.drug == response[i].drug && e.mutation == response[i].mutation && e.tumor == response[i].tumor && e.value.dataset == response[i].value.dataset && e.value.effect == response[i].value.effect;
                    })
                    if(re.length == 0){
                        updateData(response[i])
                    }
                  }
                  //callback(entity)
                }
                catch(e){
                  console.log("error catch " + e)
                  //callback(entity)
                }
                count.total--;
                if(count.total == 0){
                    count.total--;
                    updateMatrix();
                }
            },
            error: function () {
                console.log("get page request failed.");
                count.total--;
                if(count.total == 0){
                    count.total--;
                    updateMatrix();
                }
            },
        })
}

function updateData(data){
    var re = $.grep(selectedData, function(e){
        return e.drug == data.drug && e.mutation == data.mutation && e.tumor == data.tumor && e.value.dataset == data.value.dataset;
    })
    if(re.length > 0) return;
    selectedData.push(data)
    addDataforVis(data, visObj);
    var reDriver;
    reDriver = $.grep(driverState, function(e){
        return selectedDriver.indexOf(e) < 0 && e.mutation == data.mutation && e.tumor == data.tumor;
    })
    for(var j = 0; j < reDriver.length; j++){
        selectedDriver.push(reDriver[j])
        addColforVis(reDriver[j]);
    }
}

// function entityCheckedLeft(entity){
//     retrieveEffects
//     var re = $.grep(mutationDrug, function(e){
//         return e[entity.type] == entity.entity && selectedData.indexOf(e) < 0//selectedEntities.indexOf(e[otherType1]) < 0 && selectedEntities.indexOf(e[otherType2]) < 0;
//     })
//     var reDriver;

//     for(var i = 0; i < re.length; i++){
//         selectedData.push(re[i])
//         addDataforVis(re[i]);
//         reDriver = $.grep(driverState, function(e){
//             return selectedDriver.indexOf(e) < 0 && e.mutation == re[i].mutation && e.tumor == re[i].tumor;
//         })
//         for(var j = 0; j < reDriver.length; j++){
//             selectedDriver.push(reDriver[j])
//             addColforVis(reDriver[j]);
//         }
//     }
// }

function updateDataForVis(obj = visObj){
    for(var i = 0; i < obj.colMuTu.length; i++){
        obj.colMuTu[i].hasNote = false;
        var re = $.grep(mutationList, function(e){
            return e.name == obj.colMuTu[i].mutation;
        })
        // console.log(re)
        if(re[0].note > 0) obj.colMuTu[i].hasNote = true;
    }
    for(var i = 0; i < obj.disTumors.length; i++){
        obj.disTumors[i].hasNote = false;
        var re = $.grep(tumorList, function(e){
            return e.name == obj.disTumors[i].tumor;
        })
        //console.log(re)
        if(re[0].note > 0) obj.disTumors[i].hasNote = true;
    }
    for(var i = 0; i < obj.dataRow.length; i++){
        obj.dataRow[i].hasNote = false;
        var re = $.grep(drugList, function(e){
            return e.name == obj.dataRow[i].drug;
        })
        //console.log(re)
        if(re[0].note > 0) obj.dataRow[i].hasNote = true;
    }
}

function addDataforVis(data, obj = visObj){
    var results = $.grep(obj.colMuTu, function(e){
        return e.mutation == data.mutation && e.tumor == data.tumor;
    })
    if(results.length == 0){
        var ob = {mutation: data.mutation, tumor: data.tumor, drugs: [data.drug], hasNote: false};
        obj.colMuTu.push(ob)
        if(obj == visObj){
            var re = $.grep(mutationList, function(e){
                return e.name == data.mutation;
            })
            //console.log(re)
            if(re[0].note > 0) ob.hasNote = true;
        }
        //retrieveDriverCount++;
        //getDriverState(obj)
    }
    else if(results[0].drugs.indexOf(data.drug) < 0){
        results[0].drugs.push(data.drug);
        // 
        // if(mutationWaitingList.length > 0) entityChecked(mutationWaitingList[0])
        // else {
        //     updateMatrix();
        // }
    }
 
    results = $.grep(obj.disTumors, function(e){
        return e.tumor == data.tumor;
    })

    if(results.length == 0) {
        var objTu = {tumor: data.tumor, mutations: [{mutation: data.mutation, state: []}], hasNote: false};
        obj.disTumors.push(objTu);
        if(obj == visObj){
            var re = $.grep(tumorList, function(e){
                return e.name == data.tumor;
            })
            if(re[0].note > 0) objTu.hasNote = true;
        }
    }
    else{
        var r = $.grep(results[0].mutations, function(e){
            return e.mutation == data.mutation
        })
        if(r.length == 0){
            results[0].mutations.push({mutation: data.mutation, state: []})
        }
    }

    results = $.grep(obj.dataRow, function(e){
        return data.drug == e.drug;
    })
    var row;

    if(results.length == 0){
        row = {drug: data.drug, mutationTumor: [], hasNote: false}
        obj.dataRow.push(row);
        //console.log(data.drug)
        if(obj == visObj){
            var re = $.grep(drugList, function(e){
                //console.log(e.name)
                return e.name == data.drug;
            })
            //console.log(re[0])
            if(re[0].note > 0) row.hasNote = true;   
        } 
    }
    else{
        if(results.length > 1) console.log("NC: multiple entries!!");
        row = results[0];
    }

    var re = $.grep(row.mutationTumor, function(e){
        return e.mutation == data.mutation && e.tumor.toLowerCase() == data.tumor.toLowerCase();
    })
    if(re.length > 0) {
        re[0].values.push(data.value)
    }
    else {
        var ob = {mutation: data.mutation, tumor: data.tumor, values: []}
        row.mutationTumor.push(ob);
        ob.values.push(data.value);
        //console.log(data.value)
    }

}

function addColforVis(data, obj = visObj){
    var re = $.grep(obj.disTumors, function(e){
        return e.tumor == data.tumor
    })
    if(re.length > 0){
        var  r = $.grep(re[0].mutations, function(e){
            return e.mutation == data.mutation;
        })
        if(r.length > 0){
            r[0].state.push({state: data.state, source: data.source})
        }
        // else{
        //     colMuTu.push({mutation: data.mutation, tumor: data.tumor, drugs: []})
        //     var ob = {mutation: data.mutation, state: [{state: data.state, source: data.source}]}
        //     re[0].mutations.push(ob)
        // }
    }
    // else{
    //     disTumors.push({tumor: data.tumor, mutations: [{mutation: data.mutation, state: [{state: data.state, source: data.source}]}]})
    //     colMuTu.push({mutation: data.mutation, tumor: data.tumor, drugs: []})
    // }
}

function updateSelectedEntityView(){
    var selectedLi = d3.select("#selectedListUl").selectAll(".selectedLi").data(visObj.selectedEntities)
    var liEnter = selectedLi.enter().append("li")
    .attr("class", "selectedLi")
    .style("margin-bottom", "2px")
    liEnter.append("label").text(function(d){return d.entity}).style({
        background: "#ccc",
        "padding-left": "2px",
        "padding-right": "2px",
        // border: "1px",
        // "border-style": "solid",
        // "border-color": "#000",
    })
    liEnter.append("text").text("\uf00d").style({"font-family": "FontAwesome","font-size": 15})
    .on("click", removeEntity)
    .style("cursor", "pointer")

    selectedLi.exit().remove()

    d3.selectAll(".selectedLi").each(function(d, i){
        d3.select(this).select("label").text(function(d){return d.entity})
        d3.select(this).select("text")
    })
    
}

function removeDatafromVis(data){
    //console.log(data)
    //console.log(dataRow)

    var re = $.grep(visObj.dataRow, function(e){
        return e.drug == data.drug;
    })
    //the drug is already removed
    if(re.length == 0) {
        //console.log("no drug")
        return;
    }

    var mutus = re[0].mutationTumor;
    var res = $.grep(mutus, function(e){
        return e.mutation == data.mutation && e.tumor == data.tumor
    })

    //the mutation and tumor pair is already removed
    if(res.length == 0) {
        //console.log("no mutation tumor pair")
        return;
    }
    mutus.splice(mutus.indexOf(res[0]), 1)
    //console.log(mutus)
    if(mutus.length == 0) {
        //console.log(data.drug)
        visObj.dataRow.splice(visObj.dataRow.indexOf(re[0]), 1)
    }

    re = $.grep(visObj.colMuTu, function(e){
        return e.mutation == data.mutation && e.tumor == data.tumor;
    })

    re[0].drugs.splice(re[0].drugs.indexOf(data.drug), 1);
    //console.log(re[0].drugs);
    if(re[0].drugs.length == 0) {
        //console.log(data.mutation)
        visObj.colMuTu.splice(visObj.colMuTu.indexOf(re[0]), 1)
        res = $.grep(visObj.disTumors, function(e){
            return e.tumor == data.tumor;
        })
        var r = $.grep(res[0].mutations, function(e){
            return e.mutation == data.mutation
        })
        res[0].mutations.splice(res[0].mutations.indexOf(r[0]), 1);
        //console.log(res[0].mutations)
        if(res[0].mutations.length == 0) {
            visObj.disTumors.splice(visObj.disTumors.indexOf(res[0]), 1)
            //console.log(data.tumor)
        } 
    }
}

function removeEntity(entity){
    //clearDetail()
    //console.log(entity.entity + " " + entity.type)
    var otherType1, otherType2;
    switch(entity.type){
        case "mutation": otherType1 = "tumor"; otherType2 = "drug";break;
        case "tumor": otherType1 = "mutation"; otherType2 = "drug"; break;
        case "drug": otherType1 = "mutation"; otherType2 = "tumor"; break;
        default: console.log("Other type?");
    }
    //console.log(document.getElementById("input" + d.mutation).checked);
    //uncheck the checkbox
    document.getElementById("input" + entity.entity).checked = false;

    //remove from selected entity list
    var re = $.grep(visObj.selectedEntities, function(e){
        return e.entity == entity.entity;
    })
    visObj.selectedEntities.splice(visObj.selectedEntities.indexOf(re[0]), 1)
    deselectAction(entity);
    updateSelectedEntityView();
    updateNoteLabelBack();

    re = $.grep(selectedData, function(e){
        var ea1 = $.grep(visObj.selectedEntities, function(d){
            return d.entity == e[otherType1]
        })
        var ea2 = $.grep(visObj.selectedEntities, function(d){
            return d.entity == e[otherType2]
        })
        return e[entity.type] == entity.entity && ea1.length == 0 && ea2.length == 0
    })

    for(var i = re.length-1; i >= 0; i--){
        //console.log(re[i].drug)
        selectedData.splice(selectedData.indexOf(re[i]), 1)
        //if(re[i].value.dataset == "dtc") mutationDrug.splice(mutationDrug.indexOf(re[i]), 1)
        removeDatafromVis(re[i])
    }

    if(entity.type != "drug"){
        re = $.grep(selectedDriver, function(e){
            var ea1 = $.grep(visObj.selectedEntities, function(d){
                return d.entity == e[otherType1]
            })
            return ea1.length == 0 && e[entity.type] == entity.entity
        })
        for(var i = re.length-1; i >= 0; i--){
            //console.log(re[i].drug)
            selectedDriver.splice(selectedDriver.indexOf(re[i]), 1)
            //if(re[i].value.dataset == "dtc") mutationDrug.splice(mutationDrug.indexOf(re[i]), 1)
            removeColfromVis(re[i])
        }
    }
    //console.log(disTumors)

    updateMatrix();
}

function clearDetail(){
    var d3div = d3.select("#main").select(".right")
    d3div.selectAll(".sourceText").remove();
    d3div.selectAll(".paper").remove();
    d3div.selectAll("table").style("display", "none");
    d3div.select("svg").style("display", "none");
}

function removeColfromVis(data){
    var re = $.grep(visObj.colMuTu, function(e){
        return e.mutation == data.mutation && e.tumor == data.tumor
    })
    if(re.length > 0 && re[0].drugs.length == 0){
        visObj.colMuTu.splice(visObj.colMuTu.indexOf(re[0]), 1)
        re = $.grep(visObj.disTumors, function(e){
            return e.tumor == data.tumor
        })
        var r = $.grep(re[0].mutations, function(c){
            return c.mutation == data.mutation
        })
        re[0].mutations.splice(re[0].mutations.indexOf(r[0]), 1)
        if(re[0].mutations.length == 0){
            visObj.disTumors.splice(visObj.disTumors.indexOf(re[0]), 1)
        }
    }
}