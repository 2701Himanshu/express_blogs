$(document).ready(function() {
	var user = JSON.parse(window.localStorage.getItem('user'));
	if(user.isAdmin == "true"){
		$('.admin-menu').css({"display": "block"})
	}

	$('#blogAuthorId').val(user._id);
	$('#blogAuthorName').val(user.username);

	CKEDITOR.replace( 'editor' );

	$('#submitBlogFrom').on('click', function(event){
		$('#description').val(CKEDITOR.instances.editor.getData());
	});
});