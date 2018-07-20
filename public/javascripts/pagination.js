function updateCurrentActiveMutationPage(begin, end){
    var i;
    if(begin != null){
        activeMutationRange[0] = begin;
        currentActiveMutation = []
        for(i = begin; i < activeMutation.length; i++){
            if(activeMutation[i].type == "mutant"){
                pushMutationtoCurrent(activeMutation[i])

                if(currentActiveMutation.length >= mainVis.mutationPerPage){
                    activeMutationRange[1] = i;
                    break;
                }
            }
        }
        if(i == activeMutation.length)
            activeMutationRange[1] = i - 1;
    }
    else {
        activeMutationRange[1] = end;
        currentActiveMutation = [];
        for(i = end; i >= 0; i--){
            if(activeMutation[i].type == "mutant"){
                pushMutationtoCurrent(activeMutation[i], "head")

                if(currentActiveMutation.length >= mainVis.mutationPerPage){
                    activeMutationRange[0] = i;
                    break;
                }
            }
        }
        if(i == -1){
            activeMutationRange[0] = 0;
        }
    }

    var first = last = pre = next = true;
    for(i = activeMutationRange[0] - 1; i >= 0; i--){
        if(activeMutation[i].type == "mutant"){
            first = pre = false;
            break;
        }
    }

    for(i = activeMutationRange[1] + 1; i < activeMutation.length; i++){
        if(activeMutation[i].type == "mutant"){
            last = next = false;
        }
    }
            // console.log(activeMutationRange[0] + " " + activeMutationRange[1] + " " + activeMutation.length)

    updatePageButtonStates(first, pre, next, last) 
}

function firstPageClicked(){
    // console.log("first")
    mainVis.currentPage = 1;
    updateCurrentActiveMutationPage(0, null)
    //currentActiveMutation = activeMutation.slice(0, mainVis.mutationPerPage);
    updatePage();

    //updatePageButtonStates();
}

function lastPageClicked(){
    // console.log("last")
    //mainVis.currentPage = mainVis.totalPage;
    //currentActiveMutation = activeMutation.slice(mainVis.mutationPerPage * (mainVis.totalPage - 1), activeMutation.length);
    updateCurrentActiveMutationPage(null, activeMutation.length - 1)
    updatePage()

    //updatePageButtonStates();

}

function prePageClicked(){
    // console.log("previous")
    //mainVis.currentPage--;
    //currentActiveMutation = activeMutation.slice(mainVis.mutationPerPage * (mainVis.currentPage - 1), mainVis.mutationPerPage * mainVis.currentPage);
    updateCurrentActiveMutationPage(null, activeMutationRange[0] - 1)
    updatePage()

    //updatePageButtonStates();

}

function nextPageClicked(){
    // console.log("next")
    //mainVis.currentPage++;
    //currentActiveMutation = activeMutation.slice(mainVis.mutationPerPage * (mainVis.currentPage - 1), mainVis.mutationPerPage * mainVis.currentPage);
    updateCurrentActiveMutationPage(activeMutationRange[1] + 1, null)
    updatePage();
    //updatePageButtonStates();
}

function updatePage(){
    updateMutationHeader();
    updateDataRow();
    updateColBackground();
    updateHeightWidth();
}

function updatePageButtonStates(first, pre, next, last){
    if(first != null){
        $("#firstPage").prop("disabled", first)
    }
    if(pre != null){
        $("#prePage").prop("disabled", pre)
    }
    if(next != null){
        $("#nextPage").prop("disabled", next)
    }
    if(last != null){
        $("#lastPage").prop("disabled", last)
    }

}