$(document).ready(function() {

	$('#register').on('click', function(){
		var dataToSend = {
			username: $("#username").val(),
			email: $("#email").val(),
			password: $("#password").val()
		};
		$.ajax({
			url: "/Users/register",
			method: "POST",
			header: {
				"Content-Type": "application/json"
			},
			data: dataToSend
		}).then(
			function(data){
				if(data.status == 0){
					$("#username").val("");
					$("#email").val("");
					$("#password").val("");
					$("#errorMsg").html("");
					alert("User registered. Please login.");
				} else {
					$("#errorMsg").html("*"+data.message);
				}
			},
			function(error){
				console.log(error);
				debugger;
			}
		);
	});

});