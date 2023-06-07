
//defining the tokens

const CODE_LEX = {
  INPUT_TOKEN: 0,
  BLANK_TOKEN: 1,
  START_STATE_TOKEN: 3,
  TABLE_TOKEN: 4,
  INPUT_STRING_TOKEN: 5,
  CHARACTER_TOKEN: 6,
  EQUAL_TOKEN: 7,
  COLON_TOKEN: 8,
  OPEN_PARA_TOKEN: 9,
  CLOSE_PARA_TOKEN: 10,
  OPEN_BRACKET_TOKEN: 11,
  CLOSE_BRACKET_TOKEN: 12,
  OPEN_BRACES_TOKEN: 13,
  CLOSE_BRACES_TOKEN: 14,
  COMMA_TOKEN: 15,
  SC_TOKEN: 16,
  WRITE_TOKEN: 17,
  RIGHT_TOKEN: 18,
  LEFT_TOKEN: 19,
  STATE_ID_TOKEN: 20,
  ERROR_TOKEN: 21
};

const INPUT_TOKEN = CODE_LEX.INPUT_TOKEN;
const BLANK_TOKEN = CODE_LEX.BLANK_TOKEN;
const START_STATE_TOKEN = CODE_LEX.START_STATE_TOKEN;
const TABLE_TOKEN = CODE_LEX.TABLE_TOKEN;
const INPUT_STRING_TOKEN = CODE_LEX.INPUT_STRING_TOKEN;
const CHARACTER_TOKEN = CODE_LEX.CHARACTER_TOKEN;
const EQUAL_TOKEN = CODE_LEX.EQUAL_TOKEN;
const COLON_TOKEN = CODE_LEX.COLON_TOKEN;
const OPEN_PARA_TOKEN = CODE_LEX.OPEN_PARA_TOKEN;
const CLOSE_PARA_TOKEN = CODE_LEX.CLOSE_PARA_TOKEN;
const OPEN_BRACKET_TOKEN = CODE_LEX.OPEN_BRACKET_TOKEN;
const CLOSE_BRACKET_TOKEN = CODE_LEX.CLOSE_BRACKET_TOKEN;
const OPEN_BRACES_TOKEN = CODE_LEX.OPEN_BRACES_TOKEN;
const CLOSE_BRACES_TOKEN = CODE_LEX.CLOSE_BRACES_TOKEN;
const COMMA_TOKEN = CODE_LEX.COMMA_TOKEN;
const SC_TOKEN = CODE_LEX.SC_TOKEN;
const WRITE_TOKEN = CODE_LEX.WRITE_TOKEN;
const RIGHT_TOKEN = CODE_LEX.RIGHT_TOKEN;
const LEFT_TOKEN = CODE_LEX.LEFT_TOKEN;
const STATE_ID_TOKEN = CODE_LEX.STATE_ID_TOKEN;
const ERROR_TOKEN = CODE_LEX.ERROR_TOKEN;



//Global declarations

  let current_char;
  let ungetc;
  let current_sym;
  let index;
  let getting_input;
  let input;

  let declarativeStates;
  let dependingStates;
  

  let currentStateIndex=-1;
  let currentTransitionIndex=-1;
  let inputString;
  let blank;
  let startState;
  let finalStates;
  let ouptut;
  

//Main function
window.compile = function() {
  
  //getting the input code
  input="" ;
  getting_input = document.getElementsByClassName("CodeMirror-line");

  //initializations
  declarativeStates=[];
  dependingStates=[];
  finalStates=[]
  currentStateIndex=-1;
  inputString="";

  //formatting the input
  for(let i=0;i<getting_input.length;i++){
    input+=(getting_input[i].textContent);
  }
  input= input.split(' ').join('').split(String.fromCharCode(8203)).join('').split('\'\'').join('\' \'');



  //initializing the output
  output = new Output();

  //another initializations
  current_char = "";
  ungetc = "";
  current_sym = null;
  index = 0;

  //begin the compilation
  try{

    //begin the LL1 parsing
    PROGRAM();

    //semantic analysis
    stateChecker();

    //setting warning message
    if (index!=input.length) {
      console.log("Anything written after the transition table will be neglected !");
      output.warning="Anything written after the transition table will be neglected !";
    }

    //defining the output machine if no error
    let machine = new Machine(inputString,blank,startState,finalStates);
    output.machine=machine;
    console.log(output);

    return output;

  }catch (error) {
    //if error
    output.error=error.message;
    console.log(output);
    return output;
  }

  
}


//Lexical analysis

function read_char() {
  let unget = current_char;
  current_char = input[index++];
  return unget;
}

function is_char(c){
    return (c>='a' && c<='z') || (c>='A' && c<='Z');
}

function is_num(c){
    return (c>='0' && c<='9');
}

function is_blank(c){
    return (c==' ' || c=='\n' || c=='\t');
}


function next_sym() {
  let token;
  let keyWord = "";

  read_char();
  
  while (is_blank(current_char)) {
    read_char();
  }
  
  if (is_char(current_char)) {
    while (is_char(current_char) || is_num(current_char)) {
      token = CODE_LEX.STATE_ID_TOKEN;
      keyWord += current_char;
      read_char();
      
      if (keyWord.toUpperCase() === "INPUT") token = CODE_LEX.INPUT_TOKEN;
      else if (keyWord.toUpperCase() === "BLANK") token = CODE_LEX.BLANK_TOKEN;
      else if (keyWord.toUpperCase() === "STARTSTATE") token = CODE_LEX.START_STATE_TOKEN;
      else if (keyWord.toUpperCase() === "TABLE") token = CODE_LEX.TABLE_TOKEN;
      else if (keyWord.toUpperCase() === "WRITE") token = CODE_LEX.WRITE_TOKEN;
      else if (keyWord.toUpperCase() === "RIGHT") token = CODE_LEX.RIGHT_TOKEN;
      else if (keyWord.toUpperCase() === "LEFT") token = CODE_LEX.LEFT_TOKEN;
    }
    index--;

    //semantic action
    if(token===STATE_ID_TOKEN) stateCollector(keyWord);

    return token;

  } else {
    switch (current_char) {
      case '\"':
        read_char();
        while (current_char !== '\"' && current_char !== null) {
          inputString += current_char;
          read_char();
        } 
        if (current_char === null) return token = CODE_LEX.ERROR_TOKEN; 
        return token = CODE_LEX.INPUT_STRING_TOKEN;
      
      case '\'':
        read_char();
        read_char();
        if (current_char !== '\'') return token = CODE_LEX.ERROR_TOKEN;
        return token = CODE_LEX.CHARACTER_TOKEN;
      
      case '=':
        return token = CODE_LEX.EQUAL_TOKEN;
      
      case ':':
        return token = CODE_LEX.COLON_TOKEN;
      
      case '(':
        return token = CODE_LEX.OPEN_PARA_TOKEN;
      
      case ')':
        return token = CODE_LEX.CLOSE_PARA_TOKEN;
      
      case '[':
        return token = CODE_LEX.OPEN_BRACKET_TOKEN;
      
      case ']':
        return token = CODE_LEX.CLOSE_BRACKET_TOKEN;
      
      case '{':
        return token = CODE_LEX.OPEN_BRACES_TOKEN;
      
      case '}':
        return token = CODE_LEX.CLOSE_BRACES_TOKEN;
      
      case ',':
        return token = CODE_LEX.COMMA_TOKEN;
      
      case ';':
        return token = CODE_LEX.SC_TOKEN;
      
      default:
        if (current_char !== null) showErrorToken(ERROR_TOKEN);
    }
  }
}






//Syntactic analysis

function testSym(...args) {
  if (current_sym === args[0]) {
    current_sym = next_sym();
  } else {
    showError(...args);
  }
}


function PROGRAM() {
  current_sym = next_sym();
  INPUT();
  BLANK_STATEMENT();
  START_STATEMENT();
  TABLE_STATEMENT();
}

function INPUT() {
  if (current_sym === CODE_LEX.INPUT_TOKEN) {
    INPUT_STATEMENT();
  }else if(current_sym !== BLANK_TOKEN) showError(INPUT_TOKEN,BLANK_TOKEN);
}

function INPUT_STATEMENT() {
  testSym(INPUT_TOKEN);
  testSym(EQUAL_TOKEN);
  testSym(INPUT_STRING_TOKEN);
  testSym(SC_TOKEN);
}

function BLANK_STATEMENT() {
  testSym(BLANK_TOKEN);
  testSym(EQUAL_TOKEN);
  testSym(CHARACTER_TOKEN);
  blank=input[index-3];
  testSym(SC_TOKEN);
}

function START_STATEMENT() {
  testSym(START_STATE_TOKEN);
  testSym(EQUAL_TOKEN);
  testSym(STATE_ID_TOKEN);
  startState=dependingStates[dependingStates.length-1];
  testSym(SC_TOKEN);
}

function TABLE_STATEMENT() {
  testSym(TABLE_TOKEN);
  testSym(OPEN_BRACES_TOKEN);
  TABLE_BODY();

  if (current_sym !== CLOSE_BRACES_TOKEN) {
    showError(CLOSE_BRACES_TOKEN,STATE_ID_TOKEN);
  }
}

function TABLE_BODY() {
  TABLE_ROW();
  ROW();
}

function ROW() {
  if (current_sym !== CLOSE_BRACES_TOKEN && current_sym !== ERROR_TOKEN) {
    TABLE_ROW();
    ROW();
  }
}

function TABLE_ROW() {
  testSym(STATE_ID_TOKEN);
  testSym(OPEN_BRACES_TOKEN);
  TABLE_ROW_BODY();
  if(current_sym !== CLOSE_BRACES_TOKEN) showError(CLOSE_BRACES_TOKEN,CHARACTER_TOKEN,OPEN_BRACKET_TOKEN);
  current_sym = next_sym();
}

function TABLE_ROW_BODY() {
  if (current_sym === CHARACTER_TOKEN || current_sym === OPEN_BRACKET_TOKEN) {
    finalStates[currentStateIndex].transitions.push(new Transition(finalStates[currentStateIndex].stateID));
    currentTransitionIndex++;
    TRANSITION();
    TABLE_ROW_BODY();
  }
}

function TRANSITION() {
  CHARACTERS();
  testSym(COLON_TOKEN);
  ACTIONS();
  testSym(SC_TOKEN);
}

function CHARACTERS() {
  if (current_sym === CHARACTER_TOKEN) {
    finalStates[currentStateIndex].transitions[currentTransitionIndex].characters.push(input[index-2]);
    current_sym = next_sym();
  } else if (current_sym === OPEN_BRACKET_TOKEN) {
    current_sym = next_sym();
    testSym(CHARACTER_TOKEN);
    finalStates[currentStateIndex].transitions[currentTransitionIndex].characters.push(input[index-3]);
    CHARACTER();
    testSym(CLOSE_BRACKET_TOKEN);
  } else {
    showError(CHARACTER_TOKEN,OPEN_BRACKET_TOKEN);
  }
}

function CHARACTER() {
  if (current_sym === COMMA_TOKEN) {
    current_sym = next_sym();
    testSym(CHARACTER_TOKEN);
    finalStates[currentStateIndex].transitions[currentTransitionIndex].characters.push(input[index-3]);
    CHARACTER();
  }
}

function ACTIONS() {
  if (current_sym === RIGHT_TOKEN || current_sym === LEFT_TOKEN) {

    if(current_sym === RIGHT_TOKEN) finalStates[currentStateIndex].transitions[currentTransitionIndex].direction="right";
    if(current_sym === LEFT_TOKEN) finalStates[currentStateIndex].transitions[currentTransitionIndex].direction="left";

    current_sym = next_sym();
  } else if (current_sym === OPEN_PARA_TOKEN) {
    current_sym = next_sym();
    WRITE();
    ACTION();
    testSym(CLOSE_PARA_TOKEN);
  } else {
    showError(RIGHT_TOKEN,LEFT_TOKEN,OPEN_PARA_TOKEN);
  }
}

function WRITE() {
  if (current_sym === WRITE_TOKEN) {
    current_sym = next_sym();
    testSym(COLON_TOKEN);
    testSym(CHARACTER_TOKEN);
    finalStates[currentStateIndex].transitions[currentTransitionIndex].write=input[index-3];
    testSym(COMMA_TOKEN);
  }else if(current_sym!==RIGHT_TOKEN && current_sym!==LEFT_TOKEN) showError(WRITE_TOKEN,RIGHT_TOKEN,LEFT_TOKEN);
}

function ACTION() {
  DIRECTION();
  testSym(COLON_TOKEN);
  TO_STATE();
}

function DIRECTION() {
  if (current_sym === RIGHT_TOKEN || current_sym === LEFT_TOKEN) {

    if(current_sym === RIGHT_TOKEN) finalStates[currentStateIndex].transitions[currentTransitionIndex].direction="right";
    if(current_sym === LEFT_TOKEN) finalStates[currentStateIndex].transitions[currentTransitionIndex].direction="left";

    current_sym = next_sym();
  } else {
    showError(RIGHT_TOKEN,LEFT_TOKEN);
  }
}

function TO_STATE() {
    testSym(STATE_ID_TOKEN);
    finalStates[currentStateIndex].transitions[currentTransitionIndex].target=dependingStates[dependingStates.length-1];
}



//Semantic analysis and definition of final transitions

function Transition(state, characters = [], write = null, direction, target = null) {
  this.state = state;
  this.characters = characters;
  this.write = write;
  this.direction = direction;
  this.target = target;
}

function State(stateID, transitions=[]) {
  this.stateID = stateID;
  this.transitions = transitions;
}

function stateCollector(stateID){


  if(input[index]==='{'){
    declarativeStates.push(stateID);
    finalStates.push(new State(stateID));
    currentStateIndex++;
    currentTransitionIndex=-1;
    return;
  }
  if(input[index]===';') startState=stateID;
  dependingStates.push(stateID);


}

function stateChecker(){

  dependingStates.forEach(function(dependingState) {
    isDeclared = false;
    declarativeStates.forEach(function(declarativeState) {
      if(dependingState==declarativeState) isDeclared = true ;
      
    });
    if(isDeclared==false) throw new Error("Semantic error : the state '"+dependingState+"' is not declared in the transition table !");
  });

}

function Machine(inputString=null,blank,startState,transitionTable){
  this.inputString=inputString;
  this.blank=blank;
  this.startState=startState;
  this.transitionTable=transitionTable;
}

function Output(error=null,warning=null,machine=null){
  this.warning=warning;
  this.error=error;
  this.machine=machine;
}


//Error handling
function showErrorToken(token) {
  switch (token) {
    case CODE_LEX.INPUT_TOKEN:
      return "'input'";
    case CODE_LEX.BLANK_TOKEN:
      return "'blank'";
    case CODE_LEX.START_STATE_TOKEN:
      return "'startState'";
    case CODE_LEX.TABLE_TOKEN:
      return "'table'";
    case CODE_LEX.INPUT_STRING_TOKEN:
      return "an input_string";
    case CODE_LEX.CHARACTER_TOKEN:
      return "a character";
    case CODE_LEX.EQUAL_TOKEN:
      return "=";
    case CODE_LEX.COLON_TOKEN:
      return ":";
    case CODE_LEX.OPEN_PARA_TOKEN:
      return "(";
    case CODE_LEX.CLOSE_PARA_TOKEN:
      return ")";
    case CODE_LEX.OPEN_BRACKET_TOKEN:
      return "[";
    case CODE_LEX.CLOSE_BRACKET_TOKEN:
      return "]";
    case CODE_LEX.OPEN_BRACES_TOKEN:
      return "{";
    case CODE_LEX.CLOSE_BRACES_TOKEN:
      return "}";
    case CODE_LEX.COMMA_TOKEN:
      return ",";
    case CODE_LEX.SC_TOKEN:
      return ";";
    case CODE_LEX.WRITE_TOKEN:
      return "'write'";
    case CODE_LEX.RIGHT_TOKEN:
      return "'right'";
    case CODE_LEX.LEFT_TOKEN:
      return "'left'";
    case CODE_LEX.STATE_ID_TOKEN:
      return "a state_identifier";
    case CODE_LEX.ERROR_TOKEN:
      return "a valid token";
      // throw new Error("Lexical error : an invalid token found !");
    }
  }

  function showError(...args){
    S="Syntax error : expected "+showErrorToken(args[0]);
    for(let i=1;i<args.length;i++) S+=" or "+showErrorToken(args[i]);
    throw new Error(S);
  }
