"use strict";

(function() {
	var url = "/setName";

	var myFinal = "";
	$.get(url).done(function(data) {
    document.getElementById('setName').innerHTML = "Welcome "+data + "!";
  });

})();
