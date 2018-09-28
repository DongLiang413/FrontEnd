function checkSubmit() {
    var eventName = document.getElementById("ename").value;
    var eventLocation = document.getElementById("elocation").value;
    var stime = document.getElementById("stime").value;
    var etime = document.getElementById("etime").value;

    // var nameOK = eventName.search(/\w+/);
    var nameOK = /^\w+$/.test(eventName);
    var locationOK = /^\w+$/.test(eventLocation);
    var stimeOK = /\d{2}:\d{2}/.test(stime);
    var etimeOK = /\d{2}:\d{2}/.test(etime);
    // // var locationOK = eventLocation.search(/\w+/);
    // var stimeOK = stime.search(/\d+:\d+\w*/);
    // var etimeOK = stime.search(/\d+:\d+\w*/);
    if (!nameOK || !locationOK) {
        alert("Event name and Location name must be alphanumeric and nonempty.");
    }
    else if (!stimeOK) {
        alert("Please enter valid event start time!");
    }
    else if (!etimeOK) {
        alert("Please enter valid event end time!");
    } else {
        alert("New event has been saved!");
    }
}