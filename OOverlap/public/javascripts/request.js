function jQuery_GetFriend(email, callback) {
	$.ajax({
		type: 'POST',
		url: '/user/friend/get',
		data: {
			email: email
		}
	}).done(function(msg) {
		callback(msg);
	});
}

function jQuery_BindGetFriend() {
	// For Getting Friend Info From Server:
	$('input#find-friend-input').bind('keypress',
		function(event) {
			if (event.keyCode === 13){
				$('#output').html('Finding..');
				// Get the friend email to lookup:
				var email = $('input#find-friend-input').val();
				jQuery_GetFriend(email, function(friend) {
					if (friend.email === undefined) {
						$('#output').html('Friend Not Found');
					} else {
						$('#output').html(friend.name + " " + friend.email);
					}
				});
				// Reset input field:
				$('input').val('');
				// return false;
			}
		});
}

function jQuery_FindFriend(email, callback) {
	$.ajax({
		type: 'POST',
		url: '/user/friend/find',
		data: {
			email: email
		}
	}).done(function(msg) {
		callback(msg);
	});
}

function jQuery_BindFindFriend() {
	// For Getting Friend Info From Server:
	$('input#find-new-friend-input').bind('keypress',
		function(event) {
			if (event.keyCode === 13) {
				// Get the friend email to lookup:
				var email = $('input#find-new-friend-input').val();
				if (email.indexOf('@') < 0 && email.indexOf('.') < 0) {
					$('#friend-output').html('Please provide a valid email address');
					return false;
				}
				$('#friend-output').html('Finding..');

				jQuery_FindFriend(email, function(data) {
					if (data.error) {
						$('#friend-output').html('Cannot find user with email ' + email);
					} else if (data.self){
						$('#friend-output').html('Sorry you cannot add yourself as a friend');
					} else if (data.friend_exist) {
						$('#friend-output').html('User with email ' + email + ' already in your friend list');
					} else if (data.request_sent_exist) {
						$('#friend-output').html('You already sent a request to user with email ' + email);
					} else if (data.request_received_exist) {
						$('#friend-output').html('User with email ' + email + ' already sent your a request, please check your pending requests');
					} else {
						$('#friend-output').html(data.friend.name + " " + data.friend.email);
					}
				});
				// Reset input field:
				$('input').val('');
				// return false;
			}
		});
}

function jQuery_BindAddFriend(){
	$('#add_friend').bind('click',
		function(event){
			$.ajax({
				type: 'GET',
				url: '/user/request/friend',
			}).done(function(msg) {
				if (msg.status){
					generate('Succesfully sending friend request','success');
				} else {
					generate('Fail to send friend request, please try again','error');
				}
			});
		});
}

var substringMatcher = function(strs) {
	return function findMatches(q, cb) {
		var matches, substrRegex;

		// an array that will be populated with substring matches
		matches = [];

		// regex used to determine if a string contains the substring `q`
		substrRegex = new RegExp(q, 'i');

		// iterate through the pool of strings and for any string that
		// contains the substring `q`, add it to the `matches` array
		$.each(strs, function(i, str) {
			if (substrRegex.test(str)) {
				// the typeahead jQuery plugin expects suggestions to a
				// JavaScript object, refer to typeahead docs for more info
				matches.push({
					value: str
				});
			}
		});

		cb(matches);
	};
};
 
function getAllEmails(callback) {
	$.ajax({
		type: 'get',
		url: '/user/emails/all',
	}).done(function(msg) {
		callback(msg);
	});
}

function getFriendEmails(callback){
	$.ajax({
		type: 'get',
		url: '/user/friend/emails/all',
	}).done(function(msg) {
		callback(msg);
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
	getAllEmails(function(data) {
		$('#new_friend_input .typeahead').typeahead({
			hint: true,
			highlight: true,
			minLength: 1
		}, {
			name: 'emails',
			displayKey: 'value',
			source: substringMatcher(data)
		});
	});
	getFriendEmails(function(data){
		$('#new_request_input .typeahead').typeahead({
			hint: true,
			highlight: true,
			minLength: 1
		}, {
			name: 'emails',
			displayKey: 'value',
			source: substringMatcher(data)
		});
	});
	jQuery_BindGetFriend();
	jQuery_BindFindFriend();
	jQuery_BindAddFriend();
	$('[data-toggle=tooltip]').tooltip();
});