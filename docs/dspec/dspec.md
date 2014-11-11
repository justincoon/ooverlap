![Undefined Logo] (https://github.com/umass-cs-326/team-undefined/blob/master/docs/UndefinedLogo.jpg)
General Information:
--------------------

**Name of System:** OOverlap  
**Authors:** Giovanna Diaz, Santiago De La Torre, Justin Coon, Thai Nguyen, and Kiernan Drohan (Team Undefined)  
  
<p align="center"><em>This file was last revised on: November 11, 2014</em></p>

Revision History:
----------------- 
| Date     | Name | Revision |
|----------|------|----------|
| 11-03-14 | Giovanna Diaz | Created and Uploaded File |
| 11-11-14 | Giovanna Diaz | Added Project Summary & Bird's Eye View |

What is OOverlap?
-----------------
OOverlap is a scheduling application with the busy college student and professional in mind. Organize meetings with ease by sending out request. Both users will declare their free time and then OOverlap will do the rest - comparing the two schedules and alerting you of compatible meeting times! No more hassle about changing schedules, and no more frustrating back-and-forth emails. In order to enhance your scheduling experience, OOverlap connects with your GoogleCal so that you have your most up-to-date calendar. As you schedule, and confirm, meetings your calendar will update to reflect the newest information. 

Part of a group? Don't worry. OOverlap offers group functionality so that you can easily plan large-scale events or small board meetings. Simply create a group, invite your members, and start planning.

Additionally, with OOverlap's 'priorities' feature you can hierarchically declare you free times. It is in this way that OOverlap overthrows it's competitors.
<p align = "right"><em>[Giovanna Diaz - 11/10/2014]</em></p>


External Libraries:
-------------------

<p align = "right"><em>[Thai Nguyen - 11/??/2014]</em></p>

Components: Bird's Eye View
---------------------------

###Create Account  
Of course if a user does not have a pre-existing account with OOverlap, they will need to create an account. This component will take in a username (currently this will be a gmail address) and a password. If the account already exists, it will display a notification to the user. Users should be able to get to this component from the index.ejs page, (there is a button that says “register”) or from the login page (underneath the login form, in small text it would say something to the effect of “Don’t have an account?”).  

###Log-in  
This component is fairly self-explanatory as to why it fits in to the website. Without the log-in feature, users will not be able to customize their experience on OOverlap. In order to access all of your personal data (ie. Calendar, Pending Requests, Friends, and Groups) you have to have an account, and in order to access that account you have to log in! Your profile will be your “home page” of sorts. After you log on, you will be taken to your profile page since you should be able to do everything that you need to do from that page. You should be able to access the login page from: “www.OOverlap.com/login”.

###User Profile
The user profile is yet another important component in the website. As mentioned in the “Log-in” Component description, the User Profile will serve as a “home page” for the user when they are on the website. It will contain all of the information that they need in order to schedule events, access the groups they are members/admins of, and see their calendar. They can also reach their profile settings from their home page. They will be able to reach their user profile from the “Home” button in the navigation that will be placed in the upper right hand corner of screen. They will will be able to access their profile page from: “www.OOverlap.com/user/[theirLoginUsername]”.

###Settings
The settings component fits in to the website because we are offering the user something that is customizable. In the settings the user can control their privacy settings, profile information (including profile picture, username, password, etc.), calendar preferences, email notifications, and social network connections. Giving the user the ability to change the as much about their profile as possible makes the website more accessible. The user will be able to access this page from their homepage and by the following link: www.OOverlap.com/user/[theirLoginusername]/settings

###Calendars...
####Input Calendar (Scheduling Events)
The input calendar component will be used when the user goes to schedule an event with a friend or colleague. This fits in to our application since it is basically the basis of what the application is designed on: scheduling events with ease. The calendar that shows up will allow the user to drag their free times on to the calendar and will then take those times to compare later on. This component can be accessed by clicking on the “Schedule an Event” button on their Profile page.

####“Export” Calendar (Displaying All Users Free Time)
The export calendar component will display the free times that both the users have filled out. With this calendar, you will be able to clearly see the overlaps. This component will ultimately be displayed once the two users have filled out their free time, and you cannot get to it before that point.

###E-mail Notifications
The email notifications are an important component of the website. Via email, we plan to send the users…
- Notification when someone wants to schedule an event
- Notification when a group wants to schedule an event
- The details from when an event is scheduled…
	- The finalized time (assuming the overlaps were good!)
	- A request to look over their offered free times again because no overlaps were found (potentially with hints at good times for them to fill out or times that they might not have prioritized highly)
- Notification of friend request / group join request (if user is admin to a group)  

As previously mentioned, the email notifications can be toggled in the Settings component. We do not want to spam the user with emails, but feel like emails are a good way of contacting the user so that we don’t have to rely on them checking our website every day to get updates. (Although it would be nice for people to want to go there every day, we just need to help remind the user that they use the site and that they should work it in to their website-checking habits. Email notifications will be sent directly to the user depending on what email they provided at login. (The email can be changed in the Settings component.)



<p align = "right"><em>[Giovanna Diaz - 11/10/2014]</em></p>

Components: The Breakdown
--------------------------

###Log-in  
etc.

###User Profile
etc.

###Settings
etc.

###Calendars...
####Input Calendar (Scheduling Events)
etc.

####“Export” Calendar (Displaying All Users Free Time)
etc.

###E-mail Notifications
etc.


<p align = "right"><em>[fname lname - 11/??/2014]</em></p>