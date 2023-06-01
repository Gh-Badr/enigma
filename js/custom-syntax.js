CodeMirror.defineMode('customMode', function() {
  return {
    token: function(stream, state) {
      // Define your custom tokenization rules here
      if (stream.match('blank')||stream.match('input') || stream.match('Start state') || stream.match('table') ) {
        return 'style2';
      }
      
      if (stream.match('ayat')) {
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


  editor.on('beforeChange', function(instance, change){
    if (change.origin === '+input' && change.text[0] === '\'') { 
      let end = instance.getCursor('head');
      instance.replaceRange('\'', end);
      instance.setCursor(end);
    }
    if (change.origin === '+input' && change.text[0] === '[') { 
      let end = instance.getCursor('head');
      instance.replaceRange(']', end);
      instance.setCursor(end);
    }
  });
  // Event listener for automatically inserting matching braces
  editor.on('beforeChange', function(instance, change) { 
    if (change.origin === '+input' && change.text[0] === '{') { 
      let end = instance.getCursor('head');
      instance.replaceRange('}', end);
      instance.setCursor(end);
    }
  });

  // Event listener for handling Enter key press inside the brackets
  editor.on('keydown', function(instance, event) {
    if (event.key === 'Enter') {
      let cursor = instance.getCursor();
      let indent = instance.getOption('indentUnit');
      let lineContent = instance.getLine(cursor.line);
      console.log(lineContent);
      let lineIndent = lineContent.search(/\S|$/);
      let precedingChar = lineContent.charAt(cursor.ch - 1);
      if (precedingChar == '{'){
        let formattedCode = '\n' + ' '.repeat(lineIndent + indent) + '\n';
        instance.replaceRange(formattedCode, { line: cursor.line, ch: cursor.ch }, { line: cursor.line, ch: cursor.ch });
        instance.setCursor(cursor.line + 1, lineIndent + indent);
        event.preventDefault();
      }
      
    }
  });
});



      //let enteredNewLine = false; 
      //editor.on('keydown', function(instance, event) {
        //if (event.key === 'Enter') {
          //let cursor = instance.getCursor();
          //let indent = instance.getOption('indentUnit');
          
          //let formattedCode = '\n' + ' '.repeat(indent) + '\n' ;
          //instance.replaceRange(formattedCode,  { line: cursor.line, ch: cursor.ch }, { line: cursor.line, ch: cursor.ch });
          //instance.setCursor(cursor.line + 1, indent);
          //event.preventDefault();
        //}
          //instance.replaceRange(formattedCode,  { line: cursor.line, ch: cursor.ch }, { line: cursor.line, ch: cursor.ch });
          //instance.setCursor(cursor.line + 1, indent);
        //});
 

