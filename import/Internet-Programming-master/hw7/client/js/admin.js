"use strict";

(function() {
	var url = "/getAdmin";

	var myFinal = "";
	$.get(url).done(function(data) {
		console.log(data);
		var myArray = data.res.placeList;
		console.log(myArray);


		for (var i in myArray ){
				myFinal += "<tr><td>" + myArray[i].id + "</td><td>" + myArray[i].name
									 +"</td><td>"+ myArray[i].login + "</td><td>"  + "</td>"
									+ "<td> <button class = 'edit' onclick = 'editClick(this)' >Edit </button> "
									+ "<button class = 'del' onclick = 'del(this)' >Delete </button> </td>"
                   + "</tr>"
				console.log("11111111111111111111111111111");
		}
		$('#myAccTable tr:last').after(myFinal);

	});


	$('#addRow').on('click',function(){
		var myFinal = "<tr id='last'>" + "<td></td>"
								+ "<td> <input type='text' id='name1'> </td>"
								+ "<td> <input type='text' id='login1'> </td>"
								+ "<td> <input type='text id='pass1'> </td>"
								+ "<td> <button class = 'save' onclick='saveClick(this)'>Save </button>"
								+ "<button class = 'cancel' onclick='cancelClick(this)'>Cancel </button> </td></tr>";

		$('#myAccTable tr:last').after(myFinal);
	});

})();

function editClick(x){
	console.log(x);
	x.parentNode.parentNode.cells[1].innerHTML = "<input type='text' id ='loginn'/>" ;
	x.parentNode.parentNode.cells[2].innerHTML = "<input type='text' id ='namee'/>" ;
	x.parentNode.parentNode.cells[3].innerHTML = "<input type='text' id ='passs'/>" ;
	x.parentNode.parentNode.cells[4].innerHTML = "<button class = 'update' onclick = 'updateClick(this)' >Update </button> <button class = 'cancel' onclick='cancelClick(this)'>Cancel </button>";

}

function saveClick(x){
	var name1 = x.parentNode.parentNode.cells[1].children[0].value;
	var login1 = x.parentNode.parentNode.cells[2].children[0].value;
	var password1 = x.parentNode.parentNode.cells[3].children[0].value;


	console.log(login1);
	console.log(name1);

	$.post( "/save", { login: login1, name: name1, password: password1 }).done(function(res){
		console.log(res);
		if (res == true){
			window.location.reload();
		}
		else{
			document.getElementById("invalidAdmin").innerHTML = "Save Failed!";
		}
});
}

function updateClick(x){
	var id1 = x.parentNode.parentNode.cells[0].innerHTML;
	var name1 = x.parentNode.parentNode.cells[1].children[0].value;
	var login1 = x.parentNode.parentNode.cells[2].children[0].value;
	var password1 = x.parentNode.parentNode.cells[3].children[0].value;

	console.log("clickkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
	console.log(login1);
	console.log(name1);

	$.post( "/update", { acc_id: id1, acc_name: name1, acc_login: login1, acc_password: password1 }).done(function(res){
		console.log(res);
		if (res == true){
			window.location.reload();
		}
		else{

			document.getElementById("invalidAdmin").innerHTML = "Update Failed!";
		}
});
}

function cancelClick(x){
		window.location.reload();
}


function del(x){
	var temp = x.parentNode.parentNode.cells[1].innerHTML;
	$.post( "/delete", { name: temp }).done(function(res){
		if (res == false){
				document.getElementById("invalidAdmin").innerHTML = "Delete failed. Please try again!";
		}
		else{
			window.location.reload();
			console.log('2');
		}

	});

}
