

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

var stepButton = document.getElementById('stepButton') ;
var runAll = document.getElementById('run-allButton') ;
var reset = document.getElementById('reset-Button');


//main 
function main() {

    document.getElementById("svgContainer").innerHTML="";

    let output = compile();
    if(output.error != null) displayMessage('error',output.error);
    else {
        //get the executable machine
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



        //initializing the execution tape
        TapeVisualization(blankCharacter,initialInput);

        //setting up the messages
        if(output.warning != null) displayMessage('warning',output.warning);
        else displayMessage('valid');
    }
}


//adding event listeners

stepButton.addEventListener('click',function(){
    currentCell = d3.select("#tape").select('#'+currentCellId) ; 
    transition = findTransition(transitionTable,currentState,currentCell);
    stepExecute(currentCell,transition,blankCharacter) ;
    currentState = transition.target;
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

    stopFlag=false;
}

function getAllTransitions(){
    transitionTable.forEach(state => {
        state.transitions.forEach(transition=>{
            allTransitions.push(transition);
        });
    });
}

