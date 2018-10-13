$(document).ready(function() { 
	function getTime(){
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();
		var hour = date.getHours();
		var min = date.getMinutes();
		var time = day+"/"+month+"/"+year+" "+hour+":"+min;
		return time;
	} 
	$('#submitComment').on('click', function(){
		var user = JSON.parse(window.localStorage.getItem('user'));
		var comment = CKEDITOR.instances.editor.getData();

		var blogURL = window.location.pathname.split('/')
		var blogID = blogURL[blogURL.length-1];

		var dataToSend = {
			comment: comment,
			username: user.username,
			userID: user._id,
			blogID: blogID,
			time: getTime()
		}
		console.log(dataToSend);
		$.ajax({
			url: '/addComment',
			method: 'POST',
			header: {
				"Content-Type": "application/json"
			},
			data: dataToSend
		}).then(
			function(data){
				alert(data.message);
				if(data.status == 0) {
					window.location.reload();
				}
			},
			function(error){
				console.log(error);
				debugger;
			}
		);
	});

	// function getCommentList(){
	// 	var blogURL = window.location.pathname.split('/')
	// 	var blogID = blogURL[blogURL.length-1];
	// 	var dataToSend = {
	// 		blogID: blogID,
	// 	};
	// 	$.ajax({
	// 		url: '/listComment',
	// 		method: 'POST',
	// 		header: {
	// 			"Content-Type": "application/json"
	// 		},
	// 		data: dataToSend
	// 	}).then(
	// 		function(data){
	// 			if(data.status == 0){
	// 				var List = data.blogList;
	// 			} else {
	// 				alert("Something went wrong.");
	// 			}
	// 		},
	// 		function(error){
	// 			console.log(error);
	// 			debugger;
	// 		}
	// 	);
	// }

	// getCommentList();
});