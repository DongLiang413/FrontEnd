var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 44.9727, lng:  -93.23540000000003},
        zoom: 8
    });

}
// var map1;
// map1 = document.getElementById('map');
// map1.addEventListener("load", initMap);
window.onload = initMap;