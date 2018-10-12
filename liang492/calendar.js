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
var markerList = [];

var eraseMarker = function() {
    for (var i = 0; i < markerList.length; i++) {
        markerList[i].setMap(null);
    }
    markerList = [];
};

var cleanMap = function () {
    eraseMarker();
    directionsDisplay.setMap(null);
};

var $ = function(id) {
    return document.getElementById(id);
};

var checkOther = function() {
    if ($("types").value === "Other") {
        // alert("!!!");
        $("otherplace").disabled = false;
    } else {
        $("otherplace").disabled = true;
    }
};

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
    // var type = $("types").value;
    if(type === "Other") {
        alert("other block: " + $("otherplace").value);
        return $("otherplace").value;
    }
    // alert("type: " + type);
    return $("types").value;
}

function getSearchDistance() {
    // alert($("distance").value);
    return $("distance").value;
}

function onClickSearch() {
    eraseMarker();
    if ($("types").value !== "Other"){
        search();
    } else {
        searchText();
    }
}

var map;
var umn = {lat: 44.9727, lng: -93.23540000000003};
var infowindow;
var lati;
var long;
var userLocation = null;
var infoWindow;
var service;
var directionsDisplay;
var directionsService;

var initMap = function() {
    var l1 = getLocationList();
    var l2 = getEventList();
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    service = new google.maps.places.PlacesService(map);
    infoWindow = new google.maps.InfoWindow();
    directionsDisplay.setMap(map);
    map = new google.maps.Map(document.getElementById('map'), {
        center: umn,
        zoom: 15
    });

    var geocoder = new google.maps.Geocoder();

    for (var i = 0; i < l1.length; i++) {
        geocodeAddressMarker(geocoder, map, l1[i], l2[i]);
    }
    // search()
};

function geocodeAddressMarker(geocoder, resultsMap, address, event) {
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            // resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
                title:address,
                icon: iconImage
            });
            markerList.push(marker);
            var infowindow2 = new google.maps.InfoWindow({
                content: event
            });

            google.maps.event.addListener(marker, 'mouseover', createWindow(resultsMap,infowindow2, marker));
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        } //end if-then-else
    }); // end call to geocoder.geocode function
}

var search = function() {
    var area = [];
    area.push(String($("types").value));
    var searchUMN = new google.maps.LatLng(44.9727, -93.23540000000003);

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: umn,
        radius: $("distance").value,
        // type: "bank",
        type: area[0],
    }, callback);
};

var searchText = function() {
    var request = {
        location: umn,
        radius: $("distance").value,
        query: $("otherplace").value
    };
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
};

function getDirections() {
    cleanMap();
    var radios = document.getElementsByName('mode');
    var checkedMode = null;
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            checkedMode = radios[i].value;
            break;
        }
    }
    alert(checkedMode);
    var dest = $('destination').value;
    getUserLocation(function (location) {
        request = {
            origin: location,
            destination: dest,
            travelMode: google.maps.TravelMode[checkedMode]
        };
        directionsDisplay.setMap(map);
        directionsService.route(request, function (result, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(result);
            }
        });
    });
}

var searchDirection = function () {
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    directionsDisplay.setMap(map);
    getCurrentLocation();
    calculateAndDisplayRoute(directionsService, directionsDisplay);
};

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var geocoder = new google.maps.Geocoder();
    var radios = document.getElementsByName('mode');
    var checkedMode = null;
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            checkedMode = radios[i].value;
            break;
        }
    }
    directionsService.route({
        origin: {lati, lont},
        destination: $("destination").value,
        // Note that Javascript allows us to access the constant
        // using square brackets and a string value as its
        // "property."
        travelMode: google.maps.TravelMode[checkedMode]
    }, function(response, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function getUserLocation(callback) {
    if (userLocation !== null) {
        callback(userLocation);
    }
    else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            callback(userLocation);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    }
    else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

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
    markerList.push(marker);
    google.maps.event.addListener(marker, 'mouseover', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

var createWindow = function(rmap, rinfowindow, rmarker) {
    return function(){
        rinfowindow.open(rmap, rmarker);
    }
};
//
// window.onload = initMap;
window.onload = function(){
    initMap();
};