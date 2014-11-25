$(function() {

	function jQuery_GetFriend(name, callback) {
		$.ajax({
			type: 'GET',
			url: '/user/get-friend',
			data: 'name='+name
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

				jQuery_GetFriend(name, function(friend) {
					if (friend.name === undefined) {
						$('#output').html('Friend Not Found');
					} else {
						$('#output').html(friend.name + " " + friend.email);
					}
				});
				// Reset input field:
				$('input').val('');
				return false;
			});
	}
	jQuery_Bind();
});