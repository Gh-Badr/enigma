# Enigma
A Turing machine simulator.

## About the Syntax
In this simulator, we used a quite simple and restrictive syntax to define the pseudo-code for generating the Turing machines, and it's by definition Turing complete.

### To start with
Let's start the description with an example :
```
input="1001";
blank=' ';
startState=q0;
table{
  q0{
    '0': right;      
    '1': (right: q1);
    ' ': (right: accept);
    }
  q1{
    '0': (right: q2);
    '1': (right: q0);
    }
  q2{
    '0': (right: q1);
    '1': (right: q2);
    }
  accept{}
}
```
The above code simulates a machine that checks whether the input provided is divisible by 3. In addition to the syntax rules already visible in this example, let's discuss the rest ones.

### Syntax rules
+ The input, blank, startState and table statements should necessarly folow the same order as the example above.
+ Only the input statement is optionnal, in which the input only accepts an input_string which should necessarly be put between double quotation marks such as in `input="1001";`.
+ In the blank statement, blank only accepts a single character, which should necessarly be put between single quotation marks such as in `blank=' ';`, like all other characters in the program.
+ In the start state statement, the startState only accepts a state_identifier, which should follow these naming rules :
  - It shouldn't be put inside quotation marks
  - It should not contain these special characters : ' " { } ( ) [ ] ; : = 
  - It should not be one of the keywords that are : input blank startState table right left write 
+ The table statement should necessarly contain at least one table row representing a state and its transitions. The transitions can be omitted however.
+ A transition should be in this format `CHARACTERS : ACTIONS ;` where :
  - CHARACTERS can either be a single character, or a list of characters such as `[' ','*','&']`.
  - ACTIONS can either be :
    - only a direction : `left` or `right`. In that case after the transition, the machine stays in the same state.
    - a direction with a specified target state such as `(left:someState)`.
    - a direction with a specified target state, specifying the character to be written such as `(write:'c',right:someState)`.
+ The language is case-insensitive, and spaces, line breaks and indentations are neglected.

### To go further
Below are the productions of the CFG defining the syntax in details (symbols in lower-case are terminals) :
```
PROGRAM -> INPUT BLANK_STATEMENT START_STATEMENT TABLE_STATEMENT
INPUT -> INPUT_STATEMENT | ε
INPUT_STATEMENT -> input = input_string ;
BLANK_STATEMENT -> blank = character ;
START_STATEMENT -> startState = state_identifier ;
TABLE_STATEMENT -> table { TABLE_BODY }
TABLE_BODY -> TABLE_ROW ROW
ROW -> TABLE_ROW ROW | ε
TABLE_ROW -> state_identifier { TABLE_ROW_BODY }
TABLE_ROW_BODY -> TRANSITION TABLE_ROW_BODY | ε
TRANSITION -> CHARACTERS : ACTIONS ;
CHARACTERS -> character
CHARACTERS -> [ character CHARACTER ]
CHARACTER -> , character CHARACTER | ε
ACTIONS -> DIRECTION | ( WRITE ACTION )
DIRECTION -> right | left
WRITE -> write : character , | ε
ACTION -> DIRECTION : state_identifier
```
`PROGRAM` being the start symbol.

**NOTE :** 'input_string','character' and 'state_identifier' are terminals passed as TOKENS from the lexical analyzer to the parser. In the example above for instance, "1001" is an input_string, ' ' is a character and q0 is a state_identifier.
