




CodeMirror.defineMode('customMode', function() {
  return {
    token: function(stream, state) {
      // Define your custom tokenization rules here
      if (stream.match('blank')||stream.match('input') || stream.match('startState') || stream.match('table') ) {
        return 'style2';
      }
      
      if (stream.match('write') || stream.match('R') || stream.match('L') || stream.match('right') || stream.match('left') ) {
        return 'style1';
      }
      if (stream.match('#')) {
          stream.skipToEnd();
          return 'style5';
        }
      if (stream.match(/abc\d+/)) {
        return 'style1';
      }
      if(stream.match("=") || stream.match(':')||stream.match(';') || stream.match(',')  ){
      return 'style3';
      }
      if(stream.match("(") || stream.match(')') ){
          return 'style4';
       }
       if(stream.match("{") || stream.match('}') ){
        return 'style4';
     }
       if (stream.match(/[a-zA-Z][0-9]/)) {
              // name of the state, can contain only one letter  and one number
              return 'style2';
      }
      if (stream.match(/'([01]*)'/)) { 
      return 'style2'; 
        }
      // Move to the next token
      stream.next();
      return null;
    }
  };
});


document.addEventListener('DOMContentLoaded', function() {
  const editor = CodeMirror(document.getElementById('code-editor'), {
    lineNumbers: true,
    mode: 'customMode',
    autofocus: true
  });

  // Event listener for automatically inserting matching braces and parentheses
  editor.on('beforeChange', function(instance, change) { 
    if (change.origin === '+input') { 
      let end = instance.getCursor('head');
      let charToInsert;
      if (change.text[0] === '{') {
        charToInsert = '}';
      } else if (change.text[0] === '[') {
        charToInsert = ']';
      } else if (change.text[0] === '\'') {
        charToInsert = '\'';
      } else if (change.text[0] === '(') {
        charToInsert = ')';
      }
      else if (change.text[0] === '"') {
        charToInsert = '"';
      }
      if (charToInsert) {
        instance.replaceRange(charToInsert, end);
        instance.setCursor(end);
      }
    }
  });

  // Event listener for handling Enter key press inside the brackets
  editor.on('keydown', function(instance, event) {
    if (event.key === 'Enter') {
      let cursor = instance.getCursor();
      let indent = instance.getOption('indentUnit');
      let lineContent = instance.getLine(cursor.line);
      let lineIndent = lineContent.search(/\S|$/);
      let precedingChar = lineContent.charAt(cursor.ch - 1);

      // Check if the preceding character is an opening bracket or parenthesis
      if (precedingChar === '{' || precedingChar === '(' || precedingChar === '{\t') {
        let formattedCode = '\n' + ' '.repeat(lineIndent + indent) + '\n';
        instance.replaceRange(formattedCode, { line: cursor.line, ch: cursor.ch }, { line: cursor.line, ch: cursor.ch });
        instance.setCursor(cursor.line + 1, lineIndent + indent);
        event.preventDefault();
      }
    }
  });
});

