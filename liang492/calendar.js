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
const dataNum = 3 * 5; // 3: morning, afternoon, evening; 5: Mon - Fri.

var getEventList = function() {
    var eventList = [];
    for (var i = 0; i < dataNum; i++) {
        var p_id = "event" + i;
        if (document.getElementById(p_id) != null) {
            var data = document.getElementById(p_id).innerHTML;
            if (!eventList.includes(data)) {
                eventList.push(data);
            }
        }
    }
    // alert(eventList);
    return eventList;
};

var getLocationList = function() {
    // var dataNum = 3 * 5;
    var locationList = [];
    for (var i = 0; i < dataNum; i++) {
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

function getSearchType() {
    var type = document.getElementById("types").value;
    if(type === "other") {
        return document.getElementById("otherplace").value
    }
    return document.getElementById("types").value;
}

function getSearchDistance() {
    return document.getElementById("distance").value;
}

function onClickSearch() {
    initMap();
    search(getSearchDistance(), getSearchType());
}

var map;
var umn = {lat: 44.9727, lng: -93.23540000000003};
var infowindow;

var initMap = function() {
    var l1 = getLocationList();
    var l2 = getEventList();

    map = new google.maps.Map(document.getElementById('map'), {
        center: umn,
        zoom: 16
    });

    var geocoder = new google.maps.Geocoder();

    for (var i = 0; i < l1.length; i++) {
        geocodeAddressMarker(geocoder, map, l1[i], l2[i]);
    }
};

var search = function (searchRadius, searchType) {
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: umn,
        radius: searchRadius,
        type: [searchType]
    }, callback);
};

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
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
            var infowindow2 = new google.maps.InfoWindow({
                content: event
            });

            google.maps.event.addListener(marker, 'mouseover', createWindow(resultsMap,infowindow2, marker));
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        } //end if-then-else
    }); // end call to geocoder.geocode function
}

// Function to return an anonymous function that will be called when the rmarker created in the
// geocodeAddress function is clicked
var createWindow = function(rmap, rinfowindow, rmarker) {
    return function(){
        rinfowindow.open(rmap, rmarker);
    }
}//end create (info) win


// var closeWindow = function(rinfowindow) {
//     rinfowindow.close;
// }




// window.onload = displayTable;
window.onload = initMap;
// window.addEventListener('load', initMap);