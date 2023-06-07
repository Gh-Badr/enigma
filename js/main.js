

//Global declarations
var blankCharacter;
var initialInput;
var machine;
var startingState;
var transitionTable;
var currentCell;

var currentState;
var transition;

var allTransitions;

var stopFlag=false;
var promise;

var codeMirrorElement

var stepButton = document.getElementById('stepButton') ;
var runAll = document.getElementById('run-allButton') ;
var reset = document.getElementById('reset-Button');


//main 
function main() {

    document.getElementById("svgContainer").innerHTML="";

    let output = compile();
    if(output.error != null){

        //reset the size of the code editor
        codeMirrorElement = document.querySelector(".CodeMirror");
        codeMirrorElement.style.height = "450px";

        //display error message
        displayMessage('error',output.error);
    } 
    else {

        //reset the size of the code editor
        codeMirrorElement = document.querySelector(".CodeMirror");
        codeMirrorElement.style.height = "250px";


        //get the executable machine and initialize necessary global variables
        machine = output.machine;
        blankCharacter = machine.blank;
        initialInput=machine.inputString;
        transitionTable=machine.transitionTable;
        startingState=machine.startState;
        currentState=startingState;

        //draw the graph
        drawState(declarativeStates);
        allTransitions=[];
        getAllTransitions();
        console.log(allTransitions);
        drawTransition(allTransitions);
        styleState(currentState,"yellow",3);


        currentTransition=null;


        //display execution buttons
        var hiddenTapeButton = document.getElementById("container");
        hiddenTapeButton.style.display = "block";

        //re-initialize tape related global variables
        element = document.querySelector('.tape-container');
        styles = getComputedStyle(element);
        width = parseFloat(styles.width); 
        a = width/cellWidth ; 
        cellNumber = Math.floor(a);
        tapeHead = Math.floor(cellNumber/2);
        firstCellId = 'g' + tapeHead.toString(); 
        currentCellId = firstCellId ;
        lowestCell = -1 ; 
        higherCell = cellNumber ; 


        //initializing the execution tape
        TapeVisualization(blankCharacter,initialInput);
        
        //setting up the messages
        if(output.warning != null) displayMessage('warning',output.warning);
        else displayMessage('valid');
    }
}


//adding event listeners

stepButton.addEventListener('click',async()=>{



    currentCell = d3.select("#tape").select('#'+currentCellId) ; 
    transition = findTransition(transitionTable,currentState,currentCell);

    stepExecute(currentCell,transition,blankCharacter) ;

    
    if(transition.target==null){
        fireLoopTransition(currentState);
        await sleep(500);
      } 
      else{
          fireDirectTransition(currentState,transition.target);
          await sleep(500);
      } 
      styleTransition('rgb(204, 204, 204)',1);
    

    
    
    //reset the previous state and highlight the currentState
    styleState(currentState,"black",1);
    if(transition.target!=null) currentState = transition.target;
    styleState(currentState,"yellow",3);

}) ; 



runAll.addEventListener('click',function(){

    currentCell = d3.select("#tape").select('#'+currentCellId) ; 
    executeAll(startingState,transitionTable,currentCell,blank)
    
    
});

reset.addEventListener('click',async()=>{

    //stop ExecuteAll
    stopFlag=true;
    await sleep(500);

    resetAll();


});

//useful functions

function resetAll(){
    //re-initialize the graph
    console.log(currentState);
    styleState(currentState,"black",1);

    //re-initianalize necessary global variables
    currentCellId=firstCellId;
    currentState=startState;
    cellNumber=Math.floor(a);

    lowestCell=-1;
    higherCell=cellNumber;

    //re-initializing the execution tape
    document.getElementById("tape").innerHTML="";
    document.getElementById("head").innerHTML="";
    TapeVisualization(blankCharacter,initialInput);

    //re-initialize the graph
    styleState(currentState,"yellow",3);

    stopFlag=false;
}

function getAllTransitions(){
    transitionTable.forEach(state => {
        state.transitions.forEach(transition=>{
            allTransitions.push(transition);
        });
    });
}


