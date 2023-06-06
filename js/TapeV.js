//global variables that are needed : 
var cellWidth = 50 ; 
var cellHeight = 50 ; 
var headWidth = 60 ; 
var headHeight = 55 ; 
//--------------------------------------
var element = document.querySelector('.tape');
var styles = getComputedStyle(element);
var width = parseFloat(styles.width); 
var a = width/cellWidth ; 
//-------------------------------------
var cellNumber = Math.floor(a); // how many cells to insert  
var tapeHead = Math.floor(cellNumber/2); // position of the tape head, it is the initail position where the execution is gonna start from 

var firstCellId = 'g' + tapeHead.toString(); 
var currentCellId = firstCellId ;
var transitionIndex = 0 ;   

// needed to insert cells at the each end of tape : 
var lowestCell = -1 ; 
var higherCell = cellNumber ; 

//-------------------------------------------------------------------------------------


function sleep(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


//-----------------------------------------------------------------------------------------------

function cell(Selection,text,id,position){

    Selection.append('g').attr('id',id).attr('transform','translate('+position+')'); 
    var group = Selection.select('#'+id)  ; // insertig the group element that contains both of the text and rect elements 

    group.append('rect').attr('class', function(){if(id==='head-container'){ return 'tape-head' ; } else{return 'tape-cell' ; }}
    ).attr('width', function(){if(id==='head-container'){ return headWidth ; } else{return cellWidth ; }}
    ).attr('height',function(){if(id==='head-container'){ return headWidth ; } else{return cellWidth ; }})
    .attr('y', function(){if(id==='head-container'){ return -3 }}).attr('x', function(){if(id==='head-container'){ return -3 }}) ; 
    
    if(id!=='head-container'){
      group.append('text').attr('id','text1')
    .text(text).attr('x',22.5).attr('y',29) ;
    }
    return Selection ; 
}

function addTwoCells(blank){

  var svg = d3.select('#tape') ; 

      var rightId = "g"+(higherCell-1); // Get the id of the element at the right edge 
      var leftId = "g"+(lowestCell+1); // Get the id of the element at the left edge 

      var rightElement = document.getElementById(rightId) ; 
      var leftElement = document.getElementById(leftId) ;

      var rightTranslate = rightElement.getAttribute('transform'); 
      var leftTranslate = leftElement.getAttribute('transform'); 

      var rightTranslation = rightTranslate.match(/translate\(([^,]+)/)[1].split(',');
      var leftTranslation = leftTranslate.match(/translate\(([^,]+)/)[1].split(',');

      var X = parseFloat( rightTranslation[0]) ;
      var Y = parseFloat( leftTranslation[0]) ;  
    
      var newRId = 'g'+higherCell.toString() ; 
      var newLId = 'g'+lowestCell.toString() ;

      svg.call(cell,blank,newRId,(cellWidth + X).toString()) ; 
      svg.call(cell,blank,newLId,(Y-cellWidth).toString()); 

      higherCell++ ; 
      lowestCell-- ; 
      
}

function TapeVisualization(blank, input){

  var svg = d3.select('#tape') ; 
  if(Array.isArray(input) && input.length === 0){ // the input array is empty :
      for(var i = 0 ; i<cellNumber ; i++){
          var id = 'g'+ i.toString()  ; 
          svg.call(cell,blank,id, (i*cellWidth).toString()) ; 
      }
  }
  else{ // the input array is not empty :
      if (input.length> Math.floor(cellNumber/2)+1){ // the input might be length might be larger than the cells provided to it 
          cellNumber = Math.floor(cellNumber/2)+input.length ; 
        }
    for(var i = 0 ; i<cellNumber ; i++){
      if(tapeHead <= i && i < tapeHead+input.length){
         text = input[i-tapeHead] ;
      }
      else{
        text = blank ; 
      }
          var id = 'g'+ i.toString() ; 
          svg.call(cell,text,id,(i*cellWidth).toString()) ;  
    }
  }
      // adding the cursor : 

      var Id = "head-container" ;
      var svg2 = d3.select("#head");
      svg2.call(cell,'',Id,(tapeHead*cellWidth).toString() ) ;
}

function readCharacter(currentCell){ 
  return currentCell.select('text').text(); 
}

function writeCharacter(currentCell,character){
  if (character !== null){
    currentCell.select('text').text(character) ; 
  }
    
  
}

function moveCursor(direction,blank){
    //selects all the elements inside the tape 
    var groups = d3.select('#tape').selectAll('g') ; 
    var newX =  0 ;
    
        groups.each( // for each g element : 
            function(){
                var grp = d3.select(this) ; 
                var translate = grp.attr('transform').match(/translate\(([^)]+)\)/)[1].split(',');
                if(direction=='left'){
                    var newX = parseFloat(translate[0]) + cellWidth ;
                    
                    
                }
                else if(direction=='right'){
                    var newX = parseFloat(translate[0]) - cellWidth ;
                }
                else{
                    var newX = parseFloat(translate[0]) ; // let it be as it was 
                    // the current cell id stays the same 
                   
                    
                }
                grp.attr('transform','translate('+newX.toString()+')') ; 
                
            }
        );  
        if(direction === 'right'){
          //changing the currentCellId to the next cell 
          var number = parseInt(currentCellId.slice(1), 10);
          var newNumber = number + 1; // next cell 
          // Create the new ID with the updated number
          currentCellId = 'g' + newNumber;
          
        }
        if(direction === 'left'){
          //changing the currentCellId to the previous cell 
          var number = parseInt(currentCellId.slice(1), 10);
          var newNumber = number - 1; // previous cell 
          // Create the new ID with the updated number
          currentCellId = 'g' + newNumber;
        } 
        transitionIndex++ ; 

        addTwoCells(blank);
}


// for changing the current cell Id we can also simply store the position and just creat new id isniead of extracting from the previous currentCellId  
function stepExecute(currentCell,transition,blank){
    
    var characters = transition.characters;
    var direction = transition.direction;

    if(Array.isArray(characters)&&characters.includes(readCharacter(currentCell))){
        writeCharacter(currentCell,transition.write) ; 
        moveCursor(direction,blank) ; 
    }
}
function executeAll(currentState,transitionTable,currentCell,blank){
   
  var currentTransition=findTransition(transitionTable,currentState,currentCell);
  console.log(currentTransition);

  if(currentTransition==null) return;

  stepExecute(currentCell,currentTransition,blank);

  currentCell = d3.select("#tape").select('#'+currentCellId) ; 

  if(!stopFlag){
      setTimeout(function(){
        if(currentTransition.target==null) executeAll(currentState,transitionTable,currentCell,blank);
        else executeAll(currentTransition.target,transitionTable,currentCell,blank);
      },500);
  }else{
    return;
  } 

}

function findTransition(transitionTable,currentState,currentCell){

  var outputTransition;

  transitionTable.forEach( function(state){
    if(state.stateID==currentState){
      state.transitions.forEach( function(transition){
        if(Array.isArray(transition.characters)&&transition.characters.includes(readCharacter(currentCell))){
          outputTransition = transition;
        }
  
      });
    }
  });
  return outputTransition;
}
