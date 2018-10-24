"use strict";

(function() {
	// the API end point
	var url = "getListOfFavPlaces";
	// TO DO: YOU NEED TO USE AJAX TO CALL getListOfFavPlaces end-point from server
	// STEPS:
	// 1. Hit the getListOfFavPlaces end-point of server using AJAX get method
	// 2. Upon successful completion of API call, server will return the list of places
	// 2. Use the response returned to dynamically add rows to 'myFavTable' present in favourites.html page
	// 3. You can make use of jQuery or JavaScript to achieve this
	// Note: No changes will be needed in favourites.html page
	var myFinal = "";
	$.get(url).done(function(data) {
		var myArray = data.res.placeList;
		for (var i in myArray ){
				myFinal += "<tr><td>" + myArray[i].placename + "</td><td>" + myArray[i].addressline1
									+ myArray[i].addressline2 + "</td><td>" + myArray[i].opentime + "<br/>"
									+ myArray[i].closetime + "</td><td>" + myArray[i].additionalinfo + "</td><td>"
									+ myArray[i].additionalinfourl + "</td></tr>"
		}
		$('myFavTable tr:last').after(myFinal);
		document.getElementById("myFavTable").innerHTML = myFinal;
	});

})();
