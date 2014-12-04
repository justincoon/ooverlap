var friends;

function jQuery_GetFriend(email, callback) {
	$.ajax({
		type: 'POST',
		url: '/request/get_friend',
		data: {
			email: email
		}
	}).done(function(msg) {
		callback(msg);
	});
}

function jQuery_FindFriend(email, callback) {
	$.ajax({
		type: 'POST',
		url: '/friend/find',
		data: {
			email: email
		}
	}).done(function(msg) {
		callback(msg);
	});
}

function jQuery_GetAllFriends(){
	$.ajax({
		type: 'GET',
		url: '/friend/get/all'
	}).done(function(msg){
		friends = msg;
	});
}

function jQuery_BindAddFriend(){
	$('#add_friend').bind('click',
		function(event){
			var $btn = $(this).button('loading');
			var email = $('input#find-new-friend-input').val();
			if (email.indexOf('@') < 0 && email.indexOf('.') < 0) {
					generate('Please provide a valid email address','error');
					$btn.button('reset');
					return false;
				}
			jQuery_FindFriend(email, function(data) {
					console.log(data);
					if (data.error) {
						generate('Cannot find user with email ' + email,'error');
						$btn.button('reset');
						return false;
					} else if (data.self){
						generate('Sorry you cannot add yourself as a friend', 'error');
						$btn.button('reset');
						return false;
					} else if (data.friend_exist) {
						generate('User with email ' + email + ' already in your friend list', 'error');
						$btn.button('reset');
						return false;
					} else if (data.request_sent_exist) {
						generate('You already sent a request to user with email ' + email, 'error');
						$btn.button('reset');
						return false;
					} else if (data.request_received_exist) {
						generate('User with email ' + email + ' already sent your a request, please check your pending requests', 'error');
						$btn.button('reset');
						return false;
					} else {
						$.ajax({
							type: 'GET',
							url: '/friend/new_request'
						}).done(function(msg) {
							$('#friendEventModal_1').modal('hide');
							if (msg.status){
								generate('Succesfully sending friend request','success');
							} else {
								generate('Fail to send friend request, please try again','error');
							}
							$btn.button('reset');
						});
					}
				});
		});
}

function jQuery_BindGetFriend(){
	$('.friend_profile').bind('click',
		function(event){
			var friend = friends[event.currentTarget.id];
			$('#profile_picture>img').attr('src',friend.picture);
			$('#profile_name').text(friend.name);
			$('#profile_email').text(friend.email);
			$('#otherUserProfilesModal').modal('show');
		});
}

function jQuery_BindUnfriend() {
	$('#unfriend').bind('click',
		function(event) {
			$.ajax({
				type: 'POST',
				url: '/friend/unfriend',
				data: {
					email: $('#profile_email').text()
				}
			}).done(function(msg) {
				$('#otherUserProfilesModal').modal('hide');
				location.reload();
			});
		});
}

function jQuery_BindSubmitRequest() {
	$('#submit_request').bind('click',
		function(event) {
			var title = $('#request_title').val();
			var hours = $('#request_hours').val();
			var minutes = $('#request_minutes').val();
			if (!title) {
				generate('Please enter a title for this meeting request', 'error');
				return false;
			}
			if (!hours) {
				generate('Please enter an hour number for this meeting request', 'error');
				return false;
			}
			if (!minutes) {
				generate('Please enter a minute number for this meeting request', 'error');
				return false;
			}
			var $btn = $(this).button('loading');
			// Get the friend email to lookup:
			var email = $('input#find-friend-input').val();
			if (email.indexOf('@') < 0 && email.indexOf('.') < 0) {
				generate('Please provide a valid email address', 'error');
				$btn.button('reset');
				return false;
			}
			jQuery_GetFriend(email, function(friend) {
				if (friend.email === undefined) {
					generate('Cannot find friend with email ' + email + ' in your friend list', 'error');
					$btn.button('reset');
					return false;
				} else {
					$.ajax({
						type: 'POST',
						url: '/request/new',
						data: {
							title: title,
							hours: hours,
							minutes: minutes
						}
					}).done(function(msg) {
						$btn.button('reset');
						window.location.replace("/request");
					});
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
		url: '/friend/find/emails/all',
	}).done(function(msg) {
		callback(msg);
	});
}

function getFriendEmails(callback){
	$.ajax({
		type: 'get',
		url: '/friend/get/emails/all',
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

function toggleDiv(RHS_SettingsForm, RHS_CalendarInformation) {
	$("#RHS_SettingsForm").toggle();
	$("#RHS_CalendarInformation").toggle();
}

$(document).ready(function() {
	jQuery_GetAllFriends();

	// Get user schedule
	var request = $.ajax({
        url: '/user/schedule',
        type: 'GET',
        success: function(data) {
            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                editable: true,
                droppable: true,
                eventLimit: true, // allow "more" link when too many events
                events: data
            });
        },
        error: function(e) {
            console.log("FAIL");
        }
    });
    // Get emails db for autocomplte
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
	$('[data-toggle=tooltip]').tooltip();
	//Binding functions
	jQuery_BindSubmitRequest();
	jQuery_BindAddFriend();
	jQuery_BindGetFriend();
	jQuery_BindUnfriend();
});