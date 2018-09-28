function testInput() {
    let input = document.getElementById("input").value;
    alert("ori: " + input + "! now: " + (/[A-z0]/).test(input));
}