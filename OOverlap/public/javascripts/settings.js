function jQuery_BindSubmitRequest() {
	$('#submit_changes').bind('click',
		function(event) {
			var settings = {
				var profilePicPrivacy: $('#profilePicPrivacy').val(),
				var emailPrivacy: $('#profilePicPrivacy').val(),
				var profPic: $('#newProfilePicture_text').val(),
				var name: $('#displayedName').val(),
				var email: $('#email').val(),
				var currentPassword: $('#password_input').val(),
				var newPassword: $('#new_password').val(),
				var newPasswordConfirm: $('#new_password_cf').val()
			};
			if (settings.newPassword) {
				jQuery_CheckPassword(settings.currentPassword, function(msg) {
					if(!msg) {
						generate('Incorrect password, please try again', 'error');
						return false;
					}
				});
				if(settings.newPassword !== settings.newPasswordConfirm) {
					generate('Passwords do not match, please try again', 'error');
					return false;
				}
			}
			if (settings.email.indexOf('@') < 0 && settings.email.indexOf('.') < 0) {
				generate('Please provide a valid email address', 'error');
				return false;
			}
			jQuery_UpdateSettings(settings);
		});
}

function jQuery_CheckPassword(password, callback) {
	$.ajax({
		type: 'GET',
		url:  '/user/checkpassword',
		data: password
	})
	.done(function(msg) {
		callback(msg);
	});
}

function jQuery_UpdateSettings(settings) {
	$.ajax({
		type: 'POST',
		url: '/user/changesettings',
		data: settings
	})
	.done(function(err) {
		if(err)
			generate(err, 'error');
	});
}

function generate(text, type) {
 	var n = noty({
 		text: text,
 		type: type,
 		dismissQueue: true,
 		layout: 'topCenter',
 		theme: 'defaultTheme',
 		timeout: 5000,
 		maxVisible: 10
 	});
}

$(document).ready(function() {
	jQuery_BindSubmitRequest();
});
