$(document).ready(function() {
    var free_times = [];

    /* initialize the external events
    -----------------------------------------------------------------*/
    $('#external-events .fc-event').each(function() {

        // store data so the calendar knows to render an event upon drop
        $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true, // maintain when user navigates (see docs on the renderEvent method)
            overlap: false
        });

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true, // will cause the event to go back to its
            revertDuration: 0 //  original position after the drag
        });
    });

    $('#submit_request').bind('click',
        function(event){
            console.log(free_times);
            // $.ajax({
            //     type: 'POST',
            //     url: '/user/request/submit',
            //     data: free_times
            // });
    });

    $.ajax({
        url: '/user/request/schedule',
        type: 'GET',
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
                drop: function(date, jsEvent, ui) {
                    // console.log(ui.helper[0].innerText);
                    start_date = moment(date);
                    end_date = moment(date);
                    end_date.set('hour', date.hour()+1);
                    // console.log("drop start: " + start_date.format());
                    // console.log("drop end: " + end_date.format());
                    free_times.push({
                        type: ui.helper[0].innerText,
                        start: start_date.format(),
                        end: end_date.format()
                    });
                },
                eventDrop: function( event, delta, revertFunc, jsEvent, ui, view ) { 
                    console.log("eventDrop: " + event.start.format());
                },
                eventResize: function( event, delta, revertFunc, jsEvent, ui, view ) { 
                    console.log("eventResize: " + event.start.format());
                }
            });
        },
        error: function(e) {
            console.log("FAIL");
        }
    });
});