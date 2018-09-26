function checkSubmit() {
    var eventName = document.getElementById("ename").value;
    var eventLocation = document.getElementById("elocation").value;

    var nameOK = eventName.search(/\w+/);
    var locationOK = eventLocation.search(/\w+/);

    if (eventName == "") {
        return;
    }
    if (eventLocation == "") {
        return;
    }
    if (nameOK == 0 && locationOK==0) {
        alert("New event has been saved!");
    } else {
        alert("Event name and Location name must be alphanumeric.");

    }
}