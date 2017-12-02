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
    let resultado;
    resultado = metodobinario(contador-1,0);
    for (i=0; i<currentAssignment.length; i++){
        if(resultado.charAt(i)==0){
            newAssignment[i] = false;
        } else if (resultado.charAt(i)==1){
            newAssignment[i] = true;
        } else {
            newAssignment[i] = false;
        }
    }
    return newAssignment
}
function metodobinario(a,r) {
    var mensagem ;
    var mensagem2;
    if(a==1){
        mensagem = "1";
        return mensagem;
    } else {
        var q = parseInt(a/2);
        r = parseInt(a%2);

        mensagem2 = metodobinario (q, r) + r.toString();
        return mensagem2;
    }
}

function doSolve(clauses, assignment) {
    for(i=0; i<clauses.length; i++) {
        let linhaatual = clauses[i];

    }
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
    let variables = readVariables(text);
    let specOk = checkProblemSpecification(text, clauses, variables);
    let result = { 'clauses': [], 'variables': [] };
    if (specOk == true) {
        result.clauses = clauses;
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

function readVariables(text) {
    var a = text.length;
    var variables = [];
    var quantidadeI;
    var quantidadeS = "";
    for (i=0; i<a; i++){
        if (text[i].charAt(0) == 'p') {
            for(j=0;j<9999;j++){
                if (text[i].charAt(j)>=0 || text[i].charAt(j)<=9){
                    quantidadeS = quantidadeS.concat(text[i].charAt(j));
                    if (text[i].charAt(j+1)==" "){
                        quantidadeI = parseInt(quantidadeS);
                        console.log(quantidadeI);
                        break;
                    }
                }

            }
        }
    }
    for (c=0; c<quantidadeI; c++){
        variables = variables.concat(0);
    }
    return variables;
}

function checkProblemSpecification(text, clauses, variables) {
    var a = text.length;
    var quantidadeVS;
    var quantidadeCS;
    let j;
    let resultado;
    for (i = 0; i < a; i++) {
        if (text[i].charAt(0) == 'p') {
            for (j = 0; j < 9999; j++) {
                if (text[i].charAt(j) >= 0 || text[i].charAt(j) <= 9) {
                    //quantidade de variaveis em String
                    quantidadeVS = quantidadeVS+text[i].charAt(j);
                    if (text[i].charAt(j + 1) == " ") {
                        j = j + 1;
                        for (j; j < text[i].length; j++) {
                            //quantidade de clausulas em String
                            quantidadeCS = quantidadeCS+text[i].charAt(j);
                        }
                    }
                }
            }
        }
    }

    quantidadeCS = parseInt(quantidadeCS);
    quantidadeVS = parseInt(quantidadeVS);
    if (clauses.length == quantidadeCS && variables == quantidadeVS){
        resultado = true;
    } else {
        resultado = false;
    }

    return resultado;
}

