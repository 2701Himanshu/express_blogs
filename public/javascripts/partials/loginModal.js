$(document).ready(function() {

	$('#login').on('click', function(){
		var dataToSend = {
			username: $('#loginUser').val(),
			password: $('#loginPass').val()
		};
		$.ajax({
			url: "/Users/login",
			method: "POST",
			header: {
				"Content-Type": "application/json"
			},
			data: dataToSend
		}).then(
			function(data){
				if(data.status == 0){
					window.localStorage.setItem("user", JSON.stringify(data.data[0]));
					$('#loginErrorMsg').html("");
					window.location.reload();
				} else {
					$('#loginErrorMsg').html("*"+data.message);
				}
			},
			function(error){
				console.log(error);
				debugger;
			}
		);
	});

	$('#logout').on('click', function(){
		$.ajax({
			url: "/Users/logout",
			method: "get",
			header: {
				"Content-Type": "application/json"
			}
		}).then(
			function(data){
				if(data.status == 0){
					window.localStorage.removeItem("user");
					window.location.reload();
				}
			},
			function(error){
				console.log(error);
				debugger;
			}
		);
	});
});