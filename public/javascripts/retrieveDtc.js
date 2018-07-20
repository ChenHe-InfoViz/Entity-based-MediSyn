function retrieveDtc(entityList, count){
    var list = []
    for(var i = 0; i < entityList.length; i++){
        if(entityList[i].type == "tumor") continue;
        list.push(entityList[i])
    }
    if(list.length == 0 ){
        count.total--;
        if(count.total == 0){
            count.total--;
            updateMatrix();
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
                    //console.log(response)
                  //var list = processBioactivity(response.bioactivities, mutation, "mutant")
                  for(var i = 0; i < response.length; i++){
                    var re = $.grep(selectedData, function(e){
                        return e.drug == response[i].drug && e.mutation == response[i].mutation;
                    })
                    if(re.length == 0){
                        var ob =  {drug: response[i].Drug, mutation: response[i].Mutation, value: {evidence: "pre-clinical", dataset: "dtc"}, tumor: "Cancer unspecified"};
                        if(response[i].potencyState != "inactive") ob.value.effect = "Responsive"
                        else ob.value.effect = "Resistant"
                        ob.value.bioactivities = response[i].bios;
                        ob.value.bioactivities[0]["Compound ID"] = response[i]["Compound ID"]
                        ob.value.bioactivities[0]["Target Pref Name"] = response[i]["Target Pref Name"]
                        ob.value.bioactivities[0]["Target ID"] = response[i]["Target ID"]
                        ob.value.bioactivities[0]["Uniprot ID"] = response[i]["Uniprot ID"]
                        ob.value.bioactivities[0]["Target Organism"] = response[i]["Target Organism"]

                        ob.value.med = response[i].med;
                        //console.log(ob.value.bioactivities)
                        updateData(ob)
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
                    // mutationWaitingList.splice(mutationWaitingList.indexOf(mutationWaitingList[0]), 1)
                    // if(mutationWaitingList.length > 0) entityChecked(mutationWaitingList[0])
                    // else {
                        updateMatrix();
                        //console.log(disTumors)
                    // }
                }
            },
            error: function () {
                console.log("get page request failed.");
                count.total--;
                if(count.total == 0){
                    count.total--;
                    //mutationWaitingList = mutationWaitingList.concat()
                    // mutationWaitingList.splice(mutationWaitingList.indexOf(mutationWaitingList[0]), 1)
                    // if(mutationWaitingList.length > 0) entityChecked(mutationWaitingList[0])
                    // else {
                        updateMatrix();
                        //console.log(disTumors)
                    // }
                }
            },
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

// function retrieveWildtype(mutation, gene){
//     $.ajax({
//             type: "GET",
//             url: "/bio/?mutation=" + gene,
//             dataType: "json",
//             success: function(response){
//                 //var list = processBioactivity(response.bioactivities, gene, "wildtype")
//                 //console.log(response)e
//                 response.forEach(update)
//                 if(response.length > 0){
//                     updateActiveMutationList(gene, "wild")
//                     updateActiveData(response, gene, "wild")
//                 }
//                 retrieveMutation(mutation)
//                 //updateActiveMutationList(mutation, "mutant");

//                 //updateMatrix();

//             },
//             error: function(){
//                 console.log("error wild type")
//             }
//     })
// }