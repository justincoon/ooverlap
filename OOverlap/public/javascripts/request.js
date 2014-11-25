$(function() {

	function jQuery_GetFriend(name, callback) {
		$.ajax({
			type: 'POST',
			url: '/user/get-friend',
			data: {
				name: name
			}
		}).done(function(msg) {
			callback(msg);
		});
	}

	function jQuery_Bind() {
		// For Getting XML From Server:
		$('#get-friend').bind('click',
			function(event) {
				// Get the index value of the pair to lookup:
				var name = $('input').val();

				jQuery_GetFriends(name, function(friend) {
					console.log('Friends: ' + JSON.stringify(friend));
					if (frien !== null) {
						$('#output').html('Friend Not Found');
					} else {
						$('#output').html(friend.name);
					}
				});
				// Reset input field:
				$('input').val('');
				return false;
			});
	}
	jQuery_Bind();
});