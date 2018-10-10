const imgs = ["anderson.jpg", "bruinks.jpg", "ford.jpg"];

function onMouseOver(w1, w2, index) {
    document.getElementById(w1).style.color = "blue";
    document.getElementById(w2).src = imgs[index];
    document.getElementById(w2).style.visibility = "visible";
    // document.getElementById('Big_img').src = imgs[index];
    // document.getElementById('Big_img').visibility = "visible";
}

function onMouseOut(w1, w2) {
    document.getElementById(w1).style.color = "black";
    document.getElementById(w2).style.visibility = "hidden";
}

var iconImage = 'gdx.PNG';

function getEventList() {
    var eventList = [];
    for (var i = 0; i < 6; i++) {
        var p_id = "event" + i;
        var data = document.getElementById(p_id).innerHTML;
        if (!eventList.includes(data)) {
            eventList.push(data);
        }
    }
    // alert(eventList);
    return eventList;
};

function getLocationList() {
    var locationList = [];
    for (var i = 0; i < 6; i++) {
        var p_id = "location" + i;
        if (document.getElementById(p_id) != null) {
            var data = document.getElementById(p_id).innerHTML;
            // alert(data);
            if (!locationList.includes(data)) {
                locationList.push(data);
            }
        }
    }
    // alert(locationList);
    return locationList;
};

function getContent(event) {
    var contentString = '<div id="content">' +
        '<div id="bodyContent">' +
        "Here is:" +
        '<p> event <p>' +
        '</div>' +
        '</div>';
}
var map;
function initMap() {
    var l1 = getLocationList();
    var l2 = getEventList();

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 44.9727, lng: -93.23540000000003},
        zoom: 16
    });

    var geocoder = new google.maps.Geocoder();

    for (var i = 0; i < l1.length; i++) {
        geocodeAddressMarker(geocoder, map, l1[i], l2[i]);
    }
}

function geocodeAddressMarker(geocoder, resultsMap, address, event) {
    // var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            // resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
                title:address,
                icon: iconImage
            });
            var infowindow = new google.maps.InfoWindow({
                content: event
            });

           google.maps.event.addListener(marker, 'click', createWindow(resultsMap,infowindow, marker));
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        } //end if-then-else
    }); // end call to geocoder.geocode function
}

// Function to return an anonymous function that will be called when the rmarker created in the
// geocodeAddress function is clicked
function createWindow(rmap, rinfowindow, rmarker){
    return function(){
        rinfowindow.open(rmap, rmarker);
    }
}//end create (info) win


// window.onload = displayTable;
window.onload = initMap;
