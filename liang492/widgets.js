const ps = ["", "p1","p2","p3","p4","p5","p6","p7","p8","p9"];
function move() {
    var index = document.getElementById('cname').value;
    if (index < 1 || index > 9 || !(/\d/.test(index))) {
        alert("Only 1 - 9 is allowed!");
    } else {
        var curSlot = ps[index];
        var curColor = (document.getElementById('color').value).match(/\w+/);
        document.getElementById(curSlot).style.backgroundColor = curColor;
    }
}

function reset() {
    let i = 1;
    for (; i < 10; i++) {
        document.getElementById(ps[i]).style.backgroundColor = "floralwhite";
    }
}