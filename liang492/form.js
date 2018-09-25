function checkSubmit() {
    // var eventName, text;
    // alert("not ok!");

    // Get the value of the input field with id="numb"
    var eventName = document.getElementById("ename").value;
    var eventLocation = document.getElementById("elocation").value;

    var nameOK = eventName.search(/\w+/);
    var locationOK = eventLocation.search(/\w+/);
    if (nameOK == 0 && locationOK==0) {
        alert("ok!" + nameOK);
    } else {
        alert("Event name and Location name must be alphanumeric" + nameOK);

    }
}