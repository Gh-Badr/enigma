

//var cellWidth = 50 ; 
//var cellHeight = 50 ;

//var width  = cellWidth * (lookaround+1+lookaround-2) + 2*10;
//var height = cellHeight + 2*10;
function cell(Selection,text){
  Selection
  .append('rect').attr('class','tape-cell')
  .attr('width',50).attr('height',50) ;

  Selection
  .append('text').attr('id','text1')
  .text(text).attr('x',22.5).attr('y',29);

  //var width = d3.select('rect').attr('width') ; 
  //console.log(width) ; 
  return Selection ; 
}


 
svg = d3.select('#tape') ; 
var cellWidth = 50 ; 
var input = [1,0] ; 
var blank = '$' ; 


var element = document.querySelector('.tape');
var styles = getComputedStyle(element);
var width = parseFloat(styles.width);


var text = blank ;  
var a = width/cellWidth ; 
var cellNumber = Math.floor(a);
var tapeHead = Math.floor(cellNumber/2) -1;

 
// the input is an array thta contains the elements that should be
if(Array.isArray(input) && input.length === 0){
    for(var i = 0 ; i<cellNumber ; i++){
      // creating a <g> element and adding it as a wrapper
        var id = "grp" + i + "" ; 
        svg.append('g')
            .attr('id',id).attr('transform','translate(' + (i*cellWidth).toString()+')') ; 
        var selectorId = "#"+id ; 
        var group = svg.select(selectorId) ;
        group.call(cell,blank) ; 
        console.log(blank) ; 
    }
}
else{
  
  for(var i = 0 ; i<cellNumber ; i++){

    if(tapeHead <= i && i < tapeHead+input.length){
       text = input[i-tapeHead] ;
    }
    else{
      text = blank ; 
      console.log(text) ; 
    }
    var id = "grp" + i + "" ; 
        svg.append('g')
            .attr('id',id).attr('transform','translate(' + (i*cellWidth).toString()+')') ; 
        var selectorId = "#"+id ; 
        var group = svg.select(selectorId) ;
        group.call(cell,text) ; 
        
  }
}
