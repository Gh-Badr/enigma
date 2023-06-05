

//main 
function main() {
    let output = compile();
    if(output.error != null) displayMessage('error',output.error);
    else if(output.warning != null) displayMessage('warning',output.warning);
    else displayMessage('valid');
}

