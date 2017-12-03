var fs = require('fs');

exports.solve = function(fileName) {
    let formula = propsat.readFormula(fileName);
    let result = doSolve(formula.clauses, formula.variables);
    return result // two fields: isSat and satisfyingAssignment
};

// Receives the current assignment and produces the next one
function nextAssignment(currentAssignment, contador) {
    //contador é o numero maximo de possibilidades;
    let newAssignment = [];
    let resultado = "";
    resultado = metodobinario(contador,0);
    if (resultado<currentAssignment.length){
        let diferenca = currentAssignment.length - resultado.length;
        for(i=0;i<diferenca;i++){
            resultado = "0"+resultado;
        }
    }
    for (i=0; i<currentAssignment.length; i++){
        if(resultado.charAt(i)==0){
            newAssignment[i] = 'false';
        } else {
            newAssignment[i] = 'true';
        }
    }
    return newAssignment
}
function metodobinario(a,r) {
    var mensagem ;
    var mensagem2;
    if(a==1) {
        mensagem = "1";
        return mensagem;
    } else if (a==0){
        mensagem = "0";
        return mensagem;
    } else {
        var q = parseInt(a/2);
        r = parseInt(a%2);

        mensagem2 = metodobinario (q, r) + r.toString();
        return mensagem2;
    }
}

function doSolve(clauses, assignment) {

    let isSat = false;
    while ((!isSat) && /* must check whether this is the last assignment or not*/) {
        // does this assignment satisfy the formula? If so, make isSat true.

        // if not, get the next assignment and try again.
        assignment = nextAssignment(assignment)
    }
    let result = {'isSat': isSat, satisfyingAssignment: null};
    if (isSat) {
        result.satisfyingAssignment = assignment
    }
    return result
}

function readFormula(fileName) {
    var contents = fs.readFileSync('./fileName.cnf').toString();
    let text = contents.split('\n');
    let clauses = readClauses(text);
    let qvariables = readVariables(clauses);
    let variables = [];
    let specOk = checkProblemSpecification(text, clauses, variables);
    let result = { 'clauses': [], 'variables': [] };
    if (specOk == true) {
        result.clauses = clauses;
        for(i=0;i<qvariables;i++){
            variables = variables.concat(0)
        }
        result.variables = variables;
    } else {
        console.log("Este arquivo apresenta erro de compatibilidade")
    }
    return result
}

function readClauses(text) {
    var j = text.length;
    var mensagem = [];
    for (i = 0; i <j; i++) {
        if (text[i].charAt(0) == 'c' || text[i].charAt(0) == 'p') {
        } else {
            mensagem = mensagem.concat(text[i]);
        }
    }
    return mensagem;
}

function readVariables(clauses) {
    let contador = 0;
    let comparar="";
    for(i=0;i<clauses.length;i++){
        for(j=0;j<clauses[i].length;j++) {
            if((clauses[i].charAt(j)>='0'||clauses[i].charAt(j)<='9') && clauses[i].charAt(j+1)==' '){
                comparar =  comparar+clauses[i].charAt(j);
                comparar = parseInt(comparar);
                if(comparar>=contador){
                    contador = comparar;
                }
                comparar = "";
            } else if (clauses[i].charAt(j)>='0'||clauses[i].charAt(j)<='9'){
                comparar = comparar+clauses[i].charAt(j);
            }
        }
    }
    return contador;
}

function checkProblemSpecification(text, clauses, variables) {
    let quantidadeVS="";
    let quantidadeCS="";
    let resultado;
    let permission = true;
    let h = 0;
    for (i = 0; i < text.length; i++) {
        if (text[i].charAt(0) == 'p') {
            for (j = 0; j < text[i].length && permission==true; j++) {
                if (text[i].charAt(j) >='0' && text[i].charAt(j) <= '9') {
                    //quantidade de variaveis em String
                    quantidadeVS = quantidadeVS+text[i].charAt(j);
                    if (text[i].charAt(j + 1) == ' ') {
                        h = j + 2;
                        for (h; h < text[i].length && permission==true; h++) {
                            //quantidade de clausulas em String
                            quantidadeCS = quantidadeCS+text[i].charAt(h);
                            if(h+1==text[i].length){
                                permission = false;
                            }
                        }
                    }
                }
            }
        }
    }

    quantidadeCS = parseInt(quantidadeCS);
    quantidadeVS = parseInt(quantidadeVS);
    if (clauses.length == quantidadeCS && variables==quantidadeVS){
        resultado = true;
    } else {
        resultado = false;
    }

    return resultado;
}
