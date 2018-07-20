
// String.prototype.capitalizeFirstLetter = function() {
// 	//if(this == null) return null;
//     return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
// }
// var gloUi = ""
function createEntityList(){
  // if(gloUi == "")
	 // gloUi = 
	//setInitialActiveMutation()
}

function setInitialActiveMutation(){
	// console.log(mutation)
	var temp = [
		{entity: "EGFR(T790M)", type: "mutation"}, //"ABL(I242T)", "ABL(F317C)",
		// {entity: "ABL1(T315I)", type: "mutation"},
		// {entity: "Lung", type: "tumor"},
		// {entity: "Acute myeloid leukemia", type: "tumor"},
		// {entity: "AG-221", type: "drug"}
	    {entity: "ABL1(Y253H)", type: "mutation"}
	]
	for(var i = 0; i < temp.length; i++){
//mutationChecked( temp[i])
		mutationWaitingList.push(temp[i])
		//setTimeout(mutationChecked( temp[i]), 5000 * i)
		//document.getElementById("input" + temp[i]).checked = true;
	}
	entityChecked(mutationWaitingList[0])

}

function getEntityList(){
	$.ajax({
      type: "POST",
      url: "/entitynote",
      contentType:'application/json',
      dataType: "json",
      data: JSON.stringify({username: username}),
      success: function(response){
          try{
            //console.log(response.map(a => a.noteCount))
            //var list = processBioactivity(response.bioactivities, mutation, "mutant")
            for(var i = 0; i < response.length; i++){
              if(!response[i].hasOwnProperty("noteCount")) response[i].noteCount = 0;
            	switch (response[i].type)
            	{
            		case "drug": drugList.push({name: response[i].entity, note: response[i].noteCount})
            		break;
            		case "mutation": 
            		mutationList.push({name: response[i].entity, note: response[i].noteCount})
                //if(response[i].entity == "ABL1(E255K)") console.log(response[i].noteCount)
            		break;
            		case "tumor": 
            		tumorList.push({name: response[i].entity, note: response[i].noteCount})
            		break;
            	}
            }
            new Ui()
          }
          catch(e){
            console.log("error catch " + e)
            //callback(entity)
          }
      },
      error: function () {
          console.log("get has-note failed.");
      },
  })
}

function updateEntityList(){
  $.ajax({
      type: "POST",
      url: "/entitynote",
      contentType:'application/json',
      dataType: "json",
      data: JSON.stringify({username: username}),
      success: function(response){
          try{
            //console.log(response)
            //var list = processBioactivity(response.bioactivities, mutation, "mutant")
            for(var i = 0; i < response.length; i++){
              if(!response[i].hasOwnProperty("noteCount")) response[i].noteCount = 0;
              switch (response[i].type)
              {
                case "drug": 
                  for(var j = 0; j < drugList.length; j++){
                    if(drugList[j].name == response[i].entity){
                      drugList[j].note = response[i].noteCount;
                      break;
                    }
                  }//drugList.push({name: response[i].entity, note: response[i].note})
                break;
                case "mutation": 
                for(var j = 0; j < mutationList.length; j++){
                  if(mutationList[j].name == response[i].entity){
                    mutationList[j].note = response[i].noteCount;
                    break;
                  }
                }
                break;
                case "tumor": 
                for(var j = 0; j < tumorList.length; j++){
                  if(tumorList[j].name == response[i].entity){
                    tumorList[j].note = response[i].noteCount;
                    break;
                  }
                }
                break;
              }
            }
            //createEntityList()
            updateDataForVis()
            updateTumorLabel()
            updateMutationDataValue();
            updateRowDataValue()
          }
          catch(e){
            console.log("error catch " + e)
            //callback(entity)
          }
      },
      error: function () {
          console.log("update has-note failed.");
      },
  })
}