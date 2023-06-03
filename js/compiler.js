const CODE_LEX = {
  INPUT_TOKEN: 0,
  INPUT_TOKEN_ERROR: 1,
  BLANK_TOKEN: 2,
  BLANK_TOKEN_ERROR: 3,
  START_STATE_TOKEN: 4,
  START_STATE_TOKEN_ERROR: 5,
  TABLE_TOKEN: 6,
  TABLE_TOKEN_ERROR: 7,
  INPUT_STRING_TOKEN: 8,
  INPUT_STRING_TOKEN_ERROR: 9,
  CHARACTER_TOKEN: 10,
  CHARACTER_TOKEN_ERROR: 11,
  EQUAL_TOKEN: 12,
  EQUAL_TOKEN_ERROR: 13,
  COLON_TOKEN: 14,
  COLON_TOKEN_ERROR: 15,
  OPEN_PARA_TOKEN: 16,
  OPEN_PARA_TOKEN_ERROR: 17,
  CLOSE_PARA_TOKEN: 18,
  CLOSE_PARA_TOKEN_ERROR: 19,
  OPEN_BRACKET_TOKEN: 20,
  OPEN_BRACKET_TOKEN_ERROR: 21,
  CLOSE_BRACKET_TOKEN: 22,
  CLOSE_BRACKET_TOKEN_ERROR: 23,
  OPEN_BRACES_TOKEN: 24,
  OPEN_BRACES_TOKEN_ERROR: 25,
  CLOSE_BRACES_TOKEN: 26,
  CLOSE_BRACES_TOKEN_ERROR: 27,
  COMMA_TOKEN: 28,
  COMMA_TOKEN_ERROR: 29,
  SC_TOKEN: 30,
  SC_TOKEN_ERROR: 31,
  WRITE_TOKEN: 32,
  WRITE_TOKEN_ERROR: 33,
  RIGHT_TOKEN: 34,
  RIGHT_TOKEN_ERROR: 35,
  LEFT_TOKEN: 36,
  LEFT_TOKEN_ERROR: 37,
  STATE_ID_TOKEN: 38,
  STATE_ID_TOKEN_ERROR: 39,
  ERROR_TOKEN: 40,
};

const INPUT_TOKEN = CODE_LEX.INPUT_TOKEN;
const INPUT_TOKEN_ERROR = CODE_LEX.INPUT_TOKEN_ERROR;
const BLANK_TOKEN = CODE_LEX.BLANK_TOKEN;
const BLANK_TOKEN_ERROR = CODE_LEX.BLANK_TOKEN_ERROR;
const START_STATE_TOKEN = CODE_LEX.START_STATE_TOKEN;
const START_STATE_TOKEN_ERROR = CODE_LEX.START_STATE_TOKEN_ERROR;
const TABLE_TOKEN = CODE_LEX.TABLE_TOKEN;
const TABLE_TOKEN_ERROR = CODE_LEX.TABLE_TOKEN_ERROR;
const INPUT_STRING_TOKEN = CODE_LEX.INPUT_STRING_TOKEN;
const INPUT_STRING_TOKEN_ERROR = CODE_LEX.INPUT_STRING_TOKEN_ERROR;
const CHARACTER_TOKEN = CODE_LEX.CHARACTER_TOKEN;
const CHARACTER_TOKEN_ERROR = CODE_LEX.CHARACTER_TOKEN_ERROR;
const EQUAL_TOKEN = CODE_LEX.EQUAL_TOKEN;
const EQUAL_TOKEN_ERROR = CODE_LEX.EQUAL_TOKEN_ERROR;
const COLON_TOKEN = CODE_LEX.COLON_TOKEN;
const COLON_TOKEN_ERROR = CODE_LEX.COLON_TOKEN_ERROR;
const OPEN_PARA_TOKEN = CODE_LEX.OPEN_PARA_TOKEN;
const OPEN_PARA_TOKEN_ERROR = CODE_LEX.OPEN_PARA_TOKEN_ERROR;
const CLOSE_PARA_TOKEN = CODE_LEX.CLOSE_PARA_TOKEN;
const CLOSE_PARA_TOKEN_ERROR = CODE_LEX.CLOSE_PARA_TOKEN_ERROR;
const OPEN_BRACKET_TOKEN = CODE_LEX.OPEN_BRACKET_TOKEN;
const OPEN_BRACKET_TOKEN_ERROR = CODE_LEX.OPEN_BRACKET_TOKEN_ERROR;
const CLOSE_BRACKET_TOKEN = CODE_LEX.CLOSE_BRACKET_TOKEN;
const CLOSE_BRACKET_TOKEN_ERROR = CODE_LEX.CLOSE_BRACKET_TOKEN_ERROR;
const OPEN_BRACES_TOKEN = CODE_LEX.OPEN_BRACES_TOKEN;
const OPEN_BRACES_TOKEN_ERROR = CODE_LEX.OPEN_BRACES_TOKEN_ERROR;
const CLOSE_BRACES_TOKEN = CODE_LEX.CLOSE_BRACES_TOKEN;
const CLOSE_BRACES_TOKEN_ERROR = CODE_LEX.CLOSE_BRACES_TOKEN_ERROR;
const COMMA_TOKEN = CODE_LEX.COMMA_TOKEN;
const COMMA_TOKEN_ERROR = CODE_LEX.COMMA_TOKEN_ERROR;
const SC_TOKEN = CODE_LEX.SC_TOKEN;
const SC_TOKEN_ERROR = CODE_LEX.SC_TOKEN_ERROR;
const WRITE_TOKEN = CODE_LEX.WRITE_TOKEN;
const WRITE_TOKEN_ERROR = CODE_LEX.WRITE_TOKEN_ERROR;
const RIGHT_TOKEN = CODE_LEX.RIGHT_TOKEN;
const RIGHT_TOKEN_ERROR = CODE_LEX.RIGHT_TOKEN_ERROR;
const LEFT_TOKEN = CODE_LEX.LEFT_TOKEN;
const LEFT_TOKEN_ERROR = CODE_LEX.LEFT_TOKEN_ERROR;
const STATE_ID_TOKEN = CODE_LEX.STATE_ID_TOKEN;
const STATE_ID_TOKEN_ERROR = CODE_LEX.STATE_ID_TOKEN_ERROR;
const ERROR_TOKEN = CODE_LEX.ERROR_TOKEN;


const key_words = [
  "input",
  "blank",
  "startState",
  "table",
  "input_string",
  "character",
  "equal",
  "colon",
  "open_para",
  "close_para",
  "open_bracket",
  "close_bracket",
  "open_braces",
  "close_braces",
  "comma",
  "write",
  "right",
  "left",
  "state_id",
];

const tokens = [
  "INPUT_TOKEN",
  "BLANK_TOKEN",
  "START_STATE_TOKEN",
  "TABLE_TOKEN",
  "INPUT_STRING_TOKEN",
  "CHARACTER_TOKEN",
  "EQUAL_TOKEN",
  "COLON_TOKEN",
  "OPEN_PARA_TOKEN",
  "CLOSE_PARA_TOKEN",
  "OPEN_BRACKET_TOKEN",
  "CLOSE_BRACKET_TOKEN",
  "OPEN_BRACES_TOKEN",
  "CLOSE_BRACES_TOKEN",
  "COMMA_TOKEN",
  "WRITE_TOKEN",
  "RIGHT_TOKEN",
  "LEFT_TOKEN",
  "STATE_ID_TOKEN",
];


//Global declarations

  let current_char = "";
  let ungetc = "";
  let current_sym = null;
  let index = 0;
  let getting_input;
  let input="" ;
  let declarativeStates=[];
  let dependingStates=[];
  
  let currentStateIndex=-1;
  let currentTransitionIndex=-1;

//Results to be returned
  let inputString="";
  let blank;
  let startState;
  let finalStates=[];
  

  




//Main function

function Runmain() {

  input="" ;
  getting_input = document.getElementsByClassName("CodeMirror-line");

  declarativeStates=[];
  dependingStates=[];
  finalStates=[]
  currentStateIndex=-1;
  inputString="";

  for(let i=0;i<getting_input.length;i++){
    input+=(getting_input[i].textContent);
  }

  input= input.split(' ').join('').split('\'\'').join('\' \'');
  // console.log(input);

  current_char = "";
  ungetc = "";
  current_sym = null;
  index = 0;
  try{

    PROGRAM();
    current_sym = next_sym();

  
    if (index!=input.length+1) {
      console.log("The program should not contain anything else after the transition table ! " + current_char);
    }
    else console.log("The Program is well executed!!");

    stateChecker();

    console.log(finalStates);

  let machine = new Machine(inputString,blank,startState,finalStates);
  console.log(machine);

  return machine;

  }catch (error) {
    console.log(error);
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


  let character = "";
  let i = 0;
  let j = 0;
  let k = 0;

  
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
        // inputString += current_char;
        read_char();
        
        while (current_char !== '\"' && current_char !== null) {
          inputString += current_char;
          read_char();
        }
        
        if (current_char === null) return token = CODE_LEX.ERROR_TOKEN;
        
        // inputString += current_char;
        
        return token = CODE_LEX.INPUT_STRING_TOKEN;
      
      case '\'':
        character += current_char;
        read_char();
        character += current_char;
        read_char();
        
        if (current_char !== '\'') return token = CODE_LEX.ERROR_TOKEN;
        
        character += current_char;
        
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
        if (current_char !== null) return token = CODE_LEX.ERROR_TOKEN;
        break;
    }
  }
}


function showToken(token) {
  switch (token) {
    case CODE_LEX.INPUT_TOKEN:
      console.log("INPUT_TOKEN");
      return "INPUT_TOKEN";
    case CODE_LEX.BLANK_TOKEN:
      console.log("BLANK_TOKEN");
      return "BLANK_TOKEN";
    case CODE_LEX.START_STATE_TOKEN:
      console.log("START_STATE_TOKEN");
      return "START_STATE_TOKEN";
    case CODE_LEX.TABLE_TOKEN:
      console.log("TABLE_TOKEN");
      return "TABLE_TOKEN";
    case CODE_LEX.INPUT_STRING_TOKEN:
      console.log("INPUT_STRING_TOKEN");
      return "INPUT_STRING_TOKEN";
    case CODE_LEX.CHARACTER_TOKEN:
      console.log("CHARACTER_TOKEN");
      return "CHARACTER_TOKEN";
    case CODE_LEX.EQUAL_TOKEN:
      console.log("EQUAL_TOKEN");
      return "EQUAL_TOKEN";
    case CODE_LEX.COLON_TOKEN:
      console.log("COLON_TOKEN");
      return "COLON_TOKEN";
    case CODE_LEX.OPEN_PARA_TOKEN:
      console.log("OPEN_PARA_TOKEN");
      return "OPEN_PARA_TOKEN";
    case CODE_LEX.CLOSE_PARA_TOKEN:
      console.log("CLOSE_PARA_TOKEN");
      return "CLOSE_PARA_TOKEN";
    case CODE_LEX.OPEN_BRACKET_TOKEN:
      console.log("OPEN_BRACKET_TOKEN");
      return "OPEN_BRACKET_TOKEN";
    case CODE_LEX.CLOSE_BRACKET_TOKEN:
      console.log("CLOSE_BRACKET_TOKEN");
      return "CLOSE_BRACKET_TOKEN";
    case CODE_LEX.OPEN_BRACES_TOKEN:
      console.log("OPEN_BRACES_TOKEN");
      return "OPEN_BRACES_TOKEN";
    case CODE_LEX.CLOSE_BRACES_TOKEN:
      console.log("CLOSE_BRACES_TOKEN");
      return "CLOSE_BRACES_TOKEN";
    case CODE_LEX.COMMA_TOKEN:
      console.log("COMMA_TOKEN");
      return "COMMA_TOKEN";
    case CODE_LEX.SC_TOKEN:
      console.log("SC_TOKEN");
      return "SC_TOKEN";
    case CODE_LEX.WRITE_TOKEN:
      console.log("WRITE_TOKEN");
      return "WRITE_TOKEN";
    case CODE_LEX.RIGHT_TOKEN:
      console.log("RIGHT_TOKEN");
      return "RIGHT_TOKEN";
    case CODE_LEX.LEFT_TOKEN:
      console.log("LEFT_TOKEN");
      return "LEFT_TOKEN";
    case CODE_LEX.STATE_ID_TOKEN:
      console.log("STATE_ID_TOKEN");
      return "STATE_ID_TOKEN";
    case CODE_LEX.ERROR_TOKEN:
      console.log("ERROR_TOKEN");
      throw new Error("An error token was encountered");
    }
  }



//Syntactic analysis

function testSym(expectedCode, errorCode) {
  if (current_sym === expectedCode) {
    current_sym = next_sym();
  } else {
    throw new Error("Syntax error : expected "+showToken(expectedCode));
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
  }
}

function INPUT_STATEMENT() {
  testSym(INPUT_TOKEN, INPUT_TOKEN_ERROR);
  testSym(EQUAL_TOKEN, EQUAL_TOKEN_ERROR);
  testSym(INPUT_STRING_TOKEN, INPUT_STRING_TOKEN_ERROR);
  testSym(SC_TOKEN, SC_TOKEN);
}

function BLANK_STATEMENT() {
  testSym(BLANK_TOKEN, BLANK_TOKEN_ERROR);
  testSym(EQUAL_TOKEN, EQUAL_TOKEN_ERROR);
  testSym(CHARACTER_TOKEN, CHARACTER_TOKEN_ERROR);
  blank=input[index-3];
  testSym(SC_TOKEN, SC_TOKEN);
}

function START_STATEMENT() {
  testSym(START_STATE_TOKEN, START_STATE_TOKEN_ERROR);
  testSym(EQUAL_TOKEN, EQUAL_TOKEN_ERROR);
  testSym(STATE_ID_TOKEN, STATE_ID_TOKEN_ERROR);
  startState=dependingStates[dependingStates.length-1];
  testSym(SC_TOKEN, SC_TOKEN);
}

function TABLE_STATEMENT() {
  testSym(TABLE_TOKEN, TABLE_TOKEN_ERROR);
  testSym(OPEN_BRACES_TOKEN, OPEN_BRACES_TOKEN_ERROR);
  TABLE_BODY();

  if (current_sym !== CLOSE_BRACES_TOKEN) {
    ERROR(CLOSE_BRACES_TOKEN_ERROR);
    throw new Error("Syntax error : expected "+showToken(CLOSE_BRACES_TOKEN_ERROR));
  }
}

function TABLE_BODY() {
  TABLE_ROW();
  ROW();
}

function ROW() {
  if (current_sym !== CLOSE_BRACES_TOKEN) {
    TABLE_ROW();
    ROW();
  }
}

function TABLE_ROW() {
  testSym(STATE_ID_TOKEN, STATE_ID_TOKEN_ERROR);
  testSym(OPEN_BRACES_TOKEN, OPEN_BRACES_TOKEN_ERROR);
  TABLE_ROW_BODY();
  testSym(CLOSE_BRACES_TOKEN, CLOSE_BRACES_TOKEN_ERROR);
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
  testSym(COLON_TOKEN, COLON_TOKEN_ERROR);
  ACTIONS();
  testSym(SC_TOKEN, SC_TOKEN_ERROR);
}

function CHARACTERS() {
  if (current_sym === CHARACTER_TOKEN) {
    finalStates[currentStateIndex].transitions[currentTransitionIndex].characters.push(input[index-3]);
    current_sym = next_sym();
  } else if (current_sym === OPEN_BRACKET_TOKEN) {
    current_sym = next_sym();
    testSym(CHARACTER_TOKEN, CHARACTER_TOKEN_ERROR);
    finalStates[currentStateIndex].transitions[currentTransitionIndex].characters.push(input[index-3]);
    CHARACTER();
    testSym(CLOSE_BRACKET_TOKEN, CLOSE_BRACKET_TOKEN_ERROR);
  } else {
    throw new Error("Syntax error : expected "+showToken(CHARACTER_TOKEN)+" or "+showToken(OPEN_BRACKET_TOKEN));
  }
}

function CHARACTER() {
  if (current_sym === COMMA_TOKEN) {
    current_sym = next_sym();
    testSym(CHARACTER_TOKEN, CHARACTER_TOKEN_ERROR);
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
    testSym(CLOSE_PARA_TOKEN, CLOSE_PARA_TOKEN_ERROR);
  } else {
    throw new Error("Syntax error : expected "+showToken(RIGHT_TOKEN)+" or "+showToken(LEFT_TOKEN)+" or "+showToken(OPEN_PARA_TOKEN));
  }
}

function WRITE() {
  if (current_sym === WRITE_TOKEN) {
    current_sym = next_sym();
    testSym(COLON_TOKEN, COLON_TOKEN_ERROR);
    testSym(CHARACTER_TOKEN, CHARACTER_TOKEN_ERROR);
    finalStates[currentStateIndex].transitions[currentTransitionIndex].write=input[index-3];
    testSym(COMMA_TOKEN, COMMA_TOKEN_ERROR);
  }
}

function ACTION() {
  DIRECTION();
  TO_STATE();
}

function DIRECTION() {
  if (current_sym === RIGHT_TOKEN || current_sym === LEFT_TOKEN) {

    if(current_sym === RIGHT_TOKEN) finalStates[currentStateIndex].transitions[currentTransitionIndex].direction="right";
    if(current_sym === LEFT_TOKEN) finalStates[currentStateIndex].transitions[currentTransitionIndex].direction="left";

    current_sym = next_sym();
  } else {
    throw new Error("Syntax error : expected "+ showToken(RIGHT_TOKEN)+" or "+showToken(LEFT_TOKEN));
  }
}

function TO_STATE() {
  if (current_sym === COLON_TOKEN) {
    current_sym = next_sym();
    testSym(STATE_ID_TOKEN, STATE_ID_TOKEN_ERROR);
    finalStates[currentStateIndex].transitions[currentTransitionIndex].target=dependingStates[dependingStates.length-1];
  }
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
    if(isDeclared==false) throw new Error("The state "+dependingState+" is not declared in the transition table");
  });

}

function Machine(inputString=null,blank,startState,transitionTable){
  this.inpuString=inputString;
  this.blank=blank;
  this.startState=startState;
  this.transitionTable=transitionTable;
}

