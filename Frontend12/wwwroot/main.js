var button = $("#result-button");
var formulInput = $("#formul");
var firstedgeInput = $("#edge1");
var secondedgeInput = $("#edge2");
var answerOutput = $("#answer");
button.on("click", main);

function main() {
    alert(formulInput.val() + " " + firstedgeInput.val()+ " " + secondedgeInput.val());
    var Parser = require('expr-eval').Parser;
    var parser = new Parser();
    var expr = parser.parse(formulInput.val());
    alert(expr.evaluate({ x: firstedgeInput.val() }));
    
}