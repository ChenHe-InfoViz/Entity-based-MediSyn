 function startIntro(){
    var intro = introJs();
    var introSteps = [
        {
            // element: "",
            intro: 'We will guide you through <b>the main functions</b> of the interface interactively.',
        },
        {
            element: "#mutationDiv",
            intro: 'Please search by "bladder", and <b>select the entity</b> by clicking the checkbox of "bladder".',
            condition: function(){            
                if(visObj.selectedEntities.length == 1 && visObj.selectedEntities[0].entity == "Bladder")
                    return true;
                return false;
            }
        },
        {
            element: ".vis",
            intro: 'Please mouse over the drug label "debio1347", and <b>select this drug</b> by clicking "select" from the popped menu.<br/> You can see tumor "Breast" appeared because it is related to the newly-selected drug "debio1347".',
        },
        {
            element: ".vis",
            intro: 'Entities which have related notes will have the labels shown in <b>bold</b>. Please mouse over the tumor label "Breast", and click "view notes" from the popped menu.'
        },
        {
            element: '#showNoteDiv',
            intro: 'You can see the notes related to "Breast" cancer. Note, the entities appeared in the notes are shown at the bottom of the notes. Please <b>select "Myeloma"</b> by clicking "Myeloma" label in the first note.'
        },
        {
            element: ".vis",
            intro: 'You can see that "Myeloma" has been selected in the view. Please <b>pivot on tumor "Myeloma"</b> by clicking the tumor label "Myeloma". You can see its related mutations are gathered to the left while its related drugs to the top.'
        },
        {
            element: ".vis",
            intro: 'Please <b>pivot on the fourth mutation column "FGFR3(Y373C)"</b> by clicking the mutation label. You can see the columns of "FGFR3(Y373C)" in different tumors gathered.'
        },
        {
            element: "#tutorialMain",
            intro: 'Please click an arbitrary colored bar showing the relation between the drug, mutation, and tumor type. You can see <b>its detailed description including, in most cases, the publication sources</b> on the rightside.'
        },
        {
            element: '.noteFilterDiv',
            intro: 'Remove the filter, and then you can see all notes including your own notes and other public notes.'
        },
        {
            element: '#showNoteDiv',
            intro: 'Please click "view provenance" of the second note, then a dialog box will open showing interaction steps leading to the note.'
        },
        {
            element: '#historyDialog',
            intro: 'The context-aware layout depicts interaction steps hierachically from left to right. The row span of a node contains the rows of all its related lower-level nodes. <br/><br/> Context-aware: The content of a node is sometimes connected to the content of the node on its left side. E.g., for the current provenance view, pivot actions of the nodes are conducted on the view of the left node. Viewing order: left to right and up to down.'
        },
        {
            element: '#selectSpan',
            intro: 'Please switch to "timeline layout".'
        },
        {
            element: '#grid',
            intro: '"Timeline layout" arranges the interaction steps from left to right in a time series. '
        },
    ]

    intro.setOptions({
        steps: introSteps
    });

    // intro.onbeforechange(function() {
    // //$(".introjs-nextbutton").onclick = function(){
    //     console.log(intro._currentStep)
    //     if(intro._currentStep == 0) return;
    //     var stepObj = intro._introItems[intro._currentStep - 1];
    //     if(typeof(stepObj.condition) == "function"){
    //         if(!stepObj.condition()){
    //             intro._currentStep--;
    //             //this.goToStepNumber(this._currentStep);
    //             //intro.previousStep();//
    //             return;
    //         }
    //     }
    // //}
        
    // });
    intro.onafterchange(function() {
        // console.log("changed")        
        // console.log(intro._currentStep)
        if(this._currentStep == introSteps.length - 1){
            $('.introjs-skipbutton').show();
        }
        //this.goToStepNumber(intro._currentStep)
    })
    intro.setOptions({
      exitOnOverlayClick: false,
      'doneLabel': 'Done'
    }).start().oncomplete(function() {
        window.location = "https://goo.gl/forms/hB9mSaQdUpnkV1kC3";
          //window.location.href = '/tutorialhistory';
    });
    $('.introjs-skipbutton').hide();
    $('.introjs-bullets').hide();
    $('.introjs-progress').css("display", "block")

}

function introSecondStart(){
    var intro = introJs();
    var introSteps = [
            {
                element: '#grid',
                intro: 'This is an example page of the provenance view of a note. The context-aware layout depicts interaction steps hierachically from left to right. The row span of a node contains the rows of all its related lower-level nodes. <br/> Context-aware: The content of the node is sometimes connected to the content of the node on its left side. E.g., for the current provenance view, pivot actions of the nodes are conducted on the view of the left node. Viewing order: left to right and up to down.'
            },
            {
                element: '#selectSpan',
                intro: 'Please switch to "timeline layout".'
            },
            {
                element: '#grid',
                intro: '"Timeline layout" arranges the interaction steps from left to right in a time series. '
            },
            // {
            //     element: '#instruA',
            //     intro: 'More instructions are accessible here.'
            // }
        ]

    intro.setOptions({
        steps: introSteps
    })
    intro.onafterchange(function() {
        // console.log("changed")        
        // console.log(intro._currentStep)
        if(this._currentStep == introSteps.length - 1){
            $('.introjs-skipbutton').show();
        }
        //this.goToStepNumber(intro._currentStep)
    })

    intro.setOptions({
      exitOnOverlayClick: false,
      'doneLabel': 'Done'
    }).start().oncomplete(function(){
        window.location = "https://goo.gl/forms/hB9mSaQdUpnkV1kC3";
    })

    $('.introjs-skipbutton').hide();
    $('.introjs-bullets').hide();
    $('.introjs-progress').css("display", "block")
}

// $('#info').click(function () {
//         startIntro();
// })