var settings;

function jQuery_BindSubmitRequest() {
	$('#submit_changes').bind('click',
		function(event) {
			settings = {
				profilePicPrivacy: $('#profilePicPrivacy').val(),
				emailPrivacy: $('#profilePicPrivacy').val(),
				profPic: $('#newProfilePicture_text').val(),
				name: $('#displayedName_input').val(),
				email: $('#email_input').val(),
				currentPassword: $('#password_input').val(),
				newPassword: $('#new_password').val(),
				newPasswordConfirm: $('#new_password_cf').val()
			};
			console.log(settings);
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
			if (settings.email.indexOf('@') < 0 || settings.email.indexOf('.') < 0) {
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
		else
			window.location.replace("/user/profile");
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
