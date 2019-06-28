var button = $("#result-button");
var formulInput = $("#formul");
var firstedgeInput = $("#edge1");
var secondedgeInput = $("#edge2");
var answerOutput = $("#answer");
var methodInput = $("#method");
var alertOutput = $("#alertfield");
button.on("click", calculateIntegral);

function calculateIntegral() {
    var Parser = require('expr-eval').Parser;
    var parser = new Parser();
    try {
        var expr = parser.parse(formulInput.val());
        if (isDataCorrect(expr)) {
            if (methodInput.val() == "common") {
                var answ = MonteKarloCommon(expr, parseInt(firstedgeInput.val(), 10), parseInt(secondedgeInput.val(), 10));
            }
            else {
                var answ = MonteKarloGeom(expr, parseInt(firstedgeInput.val(), 10), parseInt(secondedgeInput.val(), 10));
            }
            answerOutput.text("Приближённое значение: " + (Math.round(answ * 100) / 100));
        }
    } catch (e) {

        alertOutput.html("Ошибка в формуле:  " + e.message);

    }


}





function isDataCorrect(expr) {
    var alerttext = "";
    if (firstedgeInput.val() == "") {
        alerttext += "Не введена нижняя граница <br />"
    }
    if (secondedgeInput.val() == "") {
        alerttext += "Не введена верхняя граница <br />"
    }
    if (firstedgeInput.val() > secondedgeInput.val()) {
        alerttext += "Некорректные границы интегрирования <br />"
    }
    if (expr.variables().toString() != "x") {
        alerttext += "Ошибка в указании переменной";
    }
    if (alerttext == "") {
        return true;
    }
    else {
        alertOutput.html(alerttext);
        return false;
    }

}
function randomInRange(a, b) {
    var r = Math.random();
    r *= (b - a);
    r += a;
    return r;
}
function MonteKarloCommon(expr, a, b) {
    var n = 10000;
    var sum = 0;
    for (var i = 0; i < n; i++) {
        sum += expr.evaluate({ x: randomInRange(a, b) });
    }
    return sum * (b - a) / n;
}
function MonteKarloGeom(expr, a, b) {
    var n = 10000;
    var maxmin = maxminSearch(expr, a, b);
    var max = maxmin[0];
    var min = maxmin[1];
    var inIntegral = 0;
    var PlusIntegral, MinusIntegral;
    for (var i = 0; i < n; i++) {
        ranx = randomInRange(a, b);
        rany = randomInRange(0, max);
        if (rany <= expr.evaluate({ x: ranx })) {
            inIntegral++;
        }
    }
    PlusIntegral = ((b - a) * max) * (inIntegral / n);
    if (min < 0) {
        var inIntegral = 0;
        for (var i = 0; i < n; i++) {
            ranx = randomInRange(a, b);
            rany = randomInRange(min, 0);
            if (rany >= expr.evaluate({ x: ranx })) {
                inIntegral++;
            }
        }
        MinusIntegral = ((b - a) * min) * (inIntegral / n);
    }
    else {
        MinusIntegral = 0;
    }

    return PlusIntegral + MinusIntegral;
}
function maxminSearch(expr, a, b) {
    var step = (b - a) / 10000;
    var max = expr.evaluate({ x: a });
    var min = expr.evaluate({ x: a });
    for (var i = a; i <= b; i += step) {
        var val = expr.evaluate({ x: i })
        if (val > max)
            max = val;
        if (val < min)
            min = val;
    }
    max += max / 10;
    min += min / 10;
    return [max, min];
}