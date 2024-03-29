exports.solve = function(fileName) {
    let formula = readFormula(fileName);
    if (formula==1){
        console.log('Programa encerrado')
    }else{
        contador = 0;
        formula.variables = nextAssignment(formula.variables);
        let resultado = doSolve(formula.clauses,formula.variables);
        return resultado;

    }

}
function nextAssignment(currentAssignment) {
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
    let variables = assignment.length;
    let clausulaatual="";
    let numero=0;
    contador = (Math.pow(2,variables))-1;
    let i=0;
    let isSat = false;
    let permission = true;
    while(i<clauses.length&&permission==true){
        isSat=false; //ele está aqui por conta dos casos que estão tudo certo, e no final está errado, portanto o isSat "reseta" aqui.
        for (j=0;j<clauses[i].length;j++) {
            if (clauses[i].charAt(j) > '0' && (clauses[i].charAt(j + 1) == ' '||clauses[i].charAt(j + 1) == ''||clauses[i].charAt(j + 1) == '\r' )) {
                numero = numero + clauses[i].charAt(j);
                numero = parseInt(numero);
                clausulaatual = clausulaatual + assignment[numero - 1]+" ";
                numero = 0;
            }else if (clauses[i].charAt(j) == '-') {
                clausulaatual = clausulaatual + '-';
            }else if (clauses[i].charAt(j) == ' '||clauses[i].charAt(j) == '0' ||clauses[i].charAt(j) == '\r'){

            } else {
                numero = numero + clauses[i].charAt(j);
            }
        }
        let a = "";
        a = a+clausulaatual.replace('-false','X');
        a = a+clausulaatual.replace('true','X');
        let z =0;
        for(z=0;z<a.length;z++){
            if((a.charAt(z)=='X'&&a.charAt(z-1)==' ')||(a.charAt(z)=='X'&&a.charAt(z-1)=='')){
                isSat = true;
                break;
            }
        }
        clausulaatual="";
        a="";
        if (isSat==false){
            assignment = nextAssignment(assignment);
            i = 0;
            contador--;

            if(contador===-1){
                permission = false;
            }
        } else {
            if(contador===-1) {
                permission = false;
            }
            i++;
        }
    }
    let result = {'isSat': isSat, satisfyingAssignment: null};
    if (isSat==true) {
        result.satisfyingAssignment = assignment
    }
    return result

}
function readFormula(fileName) {
    leia = require('fs');
    var lido = leia.readFileSync(fileName).toString();
    let text = lido.split('\n');
    let clauses = readClauses(text);
    let qvariables = readVariables(clauses);
    let variables = []; //pseudo array pra ser testado
    let specOk = checkProblemSpecification(text, clauses, qvariables);
    let result = { 'clauses': [], 'variables': [] };
    if (specOk == true) {
        result.clauses = clauses;
        for(i=0;i<qvariables;i++){
            variables = variables.concat(0)
        }
        result.variables = variables;
    } else {
        console.log("Este arquivo apresenta erro de compatibilidade")
        return 1;
    }
    return result
}
function readClauses(text) {
    var j = text.length;
    var mensagem = "";
    for (i = 0; i <j; i++) {
        if (text[i].charAt(0) == 'c' || text[i].charAt(0) == 'p') {
        } else {
            mensagem = mensagem+' '+text[i];
        }
    }
    let mensagem2 = [];
    mensagem2 = mensagem.split(' 0');
    mensagem2.pop();
    return mensagem2;
}
function readVariables(clauses) {
    let contador = 0;
    let comparar="";
    for(i=0;i<clauses.length;i++){
        for(j=0;j<clauses[i].length;j++) {
            if((clauses[i].charAt(j)>='0'&& clauses[i].charAt(j)<='9') && (clauses[i].charAt(j+1)==' '||clauses[i].charAt(j+1)==''||clauses[i].charAt(j+1)==='\r')){
                comparar =  comparar+clauses[i].charAt(j);
                comparar = parseInt(comparar);
                if(comparar>=contador){
                    contador = comparar;
                }
                comparar = "";
            } else if (clauses[i].charAt(j)>='0'&&clauses[i].charAt(j)<='9'){
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
    let achoup=false;
    for (i = 0; i < text.length; i++) {
        if (text[i].charAt(0) == 'p') {
            achoup = true;
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
    if (clauses.length == quantidadeCS && variables==quantidadeVS && achoup == true) {
        resultado = true;
    }else if (achoup==false){
        resultado = true;
    } else {
        resultado = false;
    }

    return resultado;
}
