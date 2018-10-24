var map;
var service;
var infowindow;
var pyrmont;
var markers = [];
var pos;
var addresses = [];
var geocoder;
var infowindow2;
var mark;

function initMap() {
    console.log('initMap');
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: new google.maps.LatLng(44.9745123,-93.2347378),
    });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var marker = new google.maps.Marker({
                    map: map,
                });

            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map);
}

function geocodeAddress(geocoder, resultsMap) {
        var addressArray = document.getElementsByClassName('address');
        var nameArray = document.getElementsByClassName('name');
            var address = addressArray[0];
            var name = nameArray[0];
            var address1 = addressArray[1];
            var name1 = nameArray[1];
            var address2 = addressArray[2];
            var name2 = nameArray[2];
            var address3 = addressArray[3];
            var name3 = nameArray[3];
            geocoder.geocode({address: addressArray[0].innerHTML }, function (results, status) {
                    if (status == 'OK') {
                            var marker = new google.maps.Marker({
                            position: results[0].geometry.location,
                            map: map
                        });
                        infowindow = new google.maps.InfoWindow();
                        google.maps.event.addListener(marker, 'click', function() {
                            infowindow.setContent(name.innerHTML);
                            infowindow.open(map, this);
                          });
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                        markers.push(marker);

                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
                geocoder.geocode({address: addressArray[1].innerHTML }, function (results, status) {
                        if (status == 'OK') {
                                marker = new google.maps.Marker({
                                position: results[0].geometry.location,
                                map: map

                            });
                            infowindow = new google.maps.InfoWindow();
                            google.maps.event.addListener(marker, 'click', function() {
                                infowindow.setContent(name1.innerHTML);
                                infowindow.open(map, this);
                              });
                            marker.setAnimation(google.maps.Animation.BOUNCE);
                            markers.push(marker);

                        } else {
                            alert('Geocode was not successful for the following reason: ' + status);
                        }
                    });
                    geocoder.geocode({address: addressArray[2].innerHTML }, function (results, status) {
                            if (status == 'OK') {
                                    marker = new google.maps.Marker({
                                    position: results[0].geometry.location,
                                    map: map
                                });
                                infowindow = new google.maps.InfoWindow();
                                google.maps.event.addListener(marker, 'click', function() {
                                    infowindow.setContent(name2.innerHTML);
                                    infowindow.open(map, this);
                                  });
                                marker.setAnimation(google.maps.Animation.BOUNCE);
                                markers.push(marker);

                            } else {
                                alert('Geocode was not successful for the following reason: ' + status);
                            }
                        });

                        geocoder.geocode({address: addressArray[3].innerHTML }, function (results, status) {
                                if (status == 'OK') {
                                        marker = new google.maps.Marker({
                                        position: results[0].geometry.location,
                                        map: map

                                    });
                                    infowindow = new google.maps.InfoWindow();
                                    google.maps.event.addListener(marker, 'click', function() {
                                        infowindow.setContent(name3.innerHTML);
                                        infowindow.open(map, this);
                                      });

                                    marker.setAnimation(google.maps.Animation.BOUNCE);
                                    markers.push(marker);

                                } else {
                                    alert('Geocode was not successful for the following reason: ' + status);
                                }
                            });
  }

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
}


function searchNearby(){
    pyrmont = new google.maps.LatLng(pos);
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15
        });
    map.setCenter(pos);
    var request = {
        location: pyrmont,
        radius: parseInt(document.getElementById('myRadius').value),
        type: [document.getElementById('mySelect').value]
    };
    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function getDirection(){
    clearMarkers();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
      });
     map.setCenter(pos);
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById('right-panel')
      });
      directionsDisplay.addListener('directions_changed', function() {
        computeTotalDistance(directionsDisplay.getDirections());
      });
      displayRoute(pos,document.getElementById('dest').value,  directionsService,
          directionsDisplay);
}

function displayRoute(origin, destination, service, display) {
    service.route({
      origin: origin,
      destination: destination,
      travelMode: document.getElementById('myTravel').value,
      avoidTolls: true
    }, function(response, status) {
      if (status === 'OK') {
        display.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
    document.getElementById("right-panel").innerHTML = "";
  }

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000;
  document.getElementById('total').innerHTML = total + ' km';
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  lat = position.coords.latitude;
  lng = position.coords.longitude;
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
  for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
  }
  }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var infowindow2 = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name );
      infowindow.open(map, this);
    });
  }
