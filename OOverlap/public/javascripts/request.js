$(function() {
	var request_friend;
	function jQuery_GetFriend(name, callback) {
		$.ajax({
			type: 'POST',
			url: '/user/get-friend',
			data: {
				name : name
			}
		}).done(function(msg) {
			callback(msg);
		});
	}

	function jQuery_BindGetFriend() {
		// For Getting Friend Info From Server:
		$('#get-friend').bind('click',
			function(event) {
				// Get the friend name to lookup:
				var name = $('input').val();

				jQuery_GetFriend(name, function(friend) {
					if (friend.name === undefined) {
						$('#output').html('Friend Not Found');
					} else {
						request_friend = friend;	
						$('#output').html(friend.name + " " + friend.email);
					}
				});
				// Reset input field:
				$('input').val('');
				return false;
			});
	}

	jQuery_BindGetFriend();
});