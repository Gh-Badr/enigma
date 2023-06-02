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
    '0': right      
    '1': {right: q1}
    ' ': {right: accept}
    }
  q1{
    '0': {right: q2}
    '1': {right: q0}
    }
  q2{
    '0': {right: q1}
    '1': {right: q2}
    }
  accept{}
}
```
The above code simulates a machine that checks whether the input provided is divisible by 3.

