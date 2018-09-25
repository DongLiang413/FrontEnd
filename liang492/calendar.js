const imgs = ["anderson.jpg", "bruinks.jpg", "ford.jpg"];

function onMouseOver(w1, w2, index) {
    document.getElementById(w1).style.color = "blue";
    document.getElementById(w2).src = imgs[index];
    document.getElementById(w2).style.visibility = "visible";
    document.getElementById('Big_img').src = imgs[index];
    document.getElementById('Big_img').visibility = "visible";
}

function onMouseOut(w1, w2) {
    document.getElementById(w1).style.color = "black";
    document.getElementById(w2).style.visibility = "hidden";
    // document.getElementById();
}