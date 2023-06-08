CodeMirror.defineMode("customMode", function () {
  return {
    token: function (stream) {
      if (
        stream.match(/blank/i) ||
        stream.match(/input/i) ||
        stream.match(/startState/i) ||
        stream.match(/table/i)
      ) {
        return "style2";
      }

      if (
        stream.match(/write/i) ||
        stream.match(/right/i) ||
        stream.match(/left/i)
      ) {
        return "style1";
      }
      if (stream.match(/abc\d+/)) {
        return "style1";
      }
      if (
        stream.match("=") ||
        stream.match(":") ||
        stream.match(";") ||
        stream.match(",")
      ) {
        return "style3";
      }
      if (stream.match("(") || stream.match(")")) {
        return "style4";
      }
      if (stream.match("{") || stream.match("}")) {
        return "style4";
      }
      if (
        stream.match(/'([0-9]|[a-zA-Z])'/) ||
        stream.match(/'( )'/) ||
        stream.match(/"(.*?")(".*")*/)
      ) {
        return "style6";
      }
      stream.next();
      return null;
    },
  };
});

document.addEventListener("DOMContentLoaded", function () {
  const editor = CodeMirror(document.getElementById("code-editor"), {
    lineNumbers: true,
    mode: "customMode",
    autofocus: true,
  });

  // Event listener for automatically inserting matching braces and parentheses
  editor.on("beforeChange", function (instance, change) {
    if (change.origin === "+input") {
      let end = instance.getCursor("head");
      let charToInsert;
      if (change.text[0] === "{") {
        charToInsert = "}";
      } else if (change.text[0] === "[") {
        charToInsert = "]";
      } else if (change.text[0] === "'") {
        charToInsert = "'";
      } else if (change.text[0] === "(") {
        charToInsert = ")";
      } else if (change.text[0] === '"') {
        charToInsert = '"';
      }
      if (charToInsert) {
        instance.replaceRange(charToInsert, end);
        instance.setCursor(end);
      }
    }
  });

  // Event listener for handling Enter key press inside the brackets
  editor.on("keydown", function (instance, event) {
    if (event.key === "Enter") {
      let cursor = instance.getCursor();
      let indent = instance.getOption("indentUnit");
      let lineContent = instance.getLine(cursor.line);
      let lineIndent = lineContent.search(/\S|$/);
      let precedingChar = lineContent.charAt(cursor.ch - 1);

      // Check if the preceding character is an opening bracket or parenthesis
      if (
        precedingChar === "{" ||
        precedingChar === "(" ||
        precedingChar === "{\t"
      ) {
        let formattedCode = "\n" + " ".repeat(lineIndent + indent) + "\n";
        instance.replaceRange(
          formattedCode,
          { line: cursor.line, ch: cursor.ch },
          { line: cursor.line, ch: cursor.ch }
        );
        instance.setCursor(cursor.line + 1, lineIndent + indent);
        event.preventDefault();
      }
    }
  });
});
