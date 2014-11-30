$(document).ready(function() {
    var free_times = [];

    /* initialize the external events
    -----------------------------------------------------------------*/
    $('#external-events .fc-event').each(function() {

        // store data so the calendar knows to render an event upon drop
        $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true, // maintain when user navigates (see docs on the renderEvent method)
        });

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true, // will cause the event to go back to its
            revertDuration: 0 //  original position after the drag
        });

        $(this).data('duration', '01:00');
    });

    $('#submit_request').bind('click',
        function(event) {
            var data = [];
            for (var i = 0; i < free_times.length; i++) {
                if (free_times[i].allDay){
                    data.push({
                        id: free_times[i]._id,
                        start: free_times[i].start.format()
                    });
                } else {
                    data.push({
                        id: free_times[i]._id,
                        start: free_times[i].start.format(),
                        end: free_times[i].end.format(),
                    });
                }
            }
            $.ajax({
                type: 'POST',
                url: '/request/submit',
                data: {
                    from: $('#from_email').text(),
                    to: $('#to_email').text(),
                    free_times: JSON.stringify(data)
                }
            }).done(function(msg) {
                window.location.replace("/user/profile");
            });
        });

    $.ajax({
        url: '/request/schedule',
        type: 'GET',
        data: {
            friend_email: $('#to_email').text()
        },
        success: function(data) {
            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                defaultView: 'agendaWeek',
                editable: true,
                droppable: true,
                eventLimit: true, // allow "more" link when too many events
                events: data,
                eventReceive: function(event) {
                    free_times.push(event);
                },
                eventDrop: function( event, delta, revertFunc, jsEvent, ui, view ) { 
                    for (var i=0; i<free_times.length; i++){
                        if (event._id === free_times[i]._id){
                            free_times[i] = event;
                            break;
                        }
                    }
                },
                eventResize: function( event, delta, revertFunc, jsEvent, ui, view ) { 
                    for (var i=0; i<free_times.length; i++){
                        if (event._id === free_times[i]._id){
                            free_times[i] = event;
                            break;
                        }
                    }
                }
            });
        },
        error: function(e) {
            console.log("FAIL");
        }
    });
});