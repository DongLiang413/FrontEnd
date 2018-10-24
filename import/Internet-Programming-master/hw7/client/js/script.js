"use strict";

(function() {
	var url = "getListOfFavPlaces";

	var myFinal = "";
	$.get(url).done(function(data) {
		var myArray = data.res.placeList;
		console.log(myArray);


		for (var i in myArray ){
				myFinal += "<tr><td>" + myArray[i].placename + "</td><td>" + myArray[i].addressline1
									+ "<br/> "+ myArray[i].addressline2 + "</td><td>" + myArray[i].opentime + "<br/>"
									+ myArray[i].closetime + "</td><td>" + myArray[i].additionalinfo + "</td><td>"
									+ myArray[i].additionalinfourl + "</td></tr>"
		}
					$('#myFavTable tr:last').after(myFinal);

	});

})();
