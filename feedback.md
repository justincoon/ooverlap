#Project 4 Feedback

Can I start by saying that I am incredibly impressed that you considered how to send email notifications to the user? (I gotta check out that nodemailer module) Genius!

As a minimalist myself, I really appreciate that you are keeping the amount of modules you are incorporating into OOverlap small.  Your choices for libraries are also interesting, like jquery-noty and typeahead, though I wish you had explained you were specifically utilizing them! Still, your effort to plan and implement a full app experience beyond the web, including live notification and email, is extremely admirable! 

However, you didn't mention how you would specifically store dates and events in your MongoDB. I am looking forward to seeing your DB schema, especially your event and user document schema. Also, using moment.js was an excellent choice for your date management! (Especially this extension to moment: https://github.com/gf3/moment-range) (Sidenote: I LOVE the fact that moment-range has the function DATE.overlaps(DATE) haha, wouldn't it be funny to have the code use its own name? I digress...) 

YOUR TEAM NOTES AND TRELLO ACTIVITY ARE JUST AMAZING. Fantastic work at making sure you took notes for each meeting!!

Thumbs up! I can't wait to see the OOverlap complete!

#Project 3 Feedback

Your mockups are extremely impressive, I'm completely blown away by your attention to detail and design! (I love that the "OO" circles in OOverlap are carried into the UI! Ahhh!)

Regarding your non-goals, I find your goal of not advertising or monetizing quite admirable! On a similar note, your commitment to your users' privacy, because you're omitting the potential additional sensitive information (like bio, relationship status, and any other extraneous info) and especially because you'll be handling such private information, is great!

A minor concern I had was in your scheduling flowchart under "Scheduling an Event". The user should generally always be able to reverse their action. Perhaps there should be a mechanism for the user to edit their choices if they notice on the confirmaton page that the times were incorrectly entered. Another note: you may want to provide more visible feedback to the user with potential scheduling conflicts instead of an asterick. An asterick denotes that there is additional information for the text, where as a warning sign or a color (red or yellow perhaps) would communicate to the user that there is a warning or error.

Your trello board and weekly notes are always perfect. You guys are just awesome and I can't wait to see the OOverlap complete!

Giving you a huge thumbs up!

<img src="http://fileinabox.com/files/2008/11/thumbs-up.jpg">


#Project 2 Feedback

I found your team notes on UX quite intriguing, especially about avoiding "double booking" two activities for the same time slot. You may want to check out live templating frameworks that change as the model changes; For example, right when User 1 marks a time slot as taken in some activity, User 2's view would update to show that User 1's is suddenly unavailable during that slot without having to reload the page. (Like Meteor.js! http://docs.meteor.com/#livehtmltemplates) 

Regarding your timeline, it is a great idea to start researching both Facebook and Google's APIs early! In past semesters, students have had the most issues with these two APIs.

Your commitment to keeping your product open-source and free is extremely admirable! (Especially as your competitors are all for-profit!)

I love that your team is planning to launch your final app on your own purchased domain! I mentioned to Santiago that you all should check out launching a node app on Heroku for free (https://devcenter.heroku.com/articles/getting-started-with-nodejs) pointing a custom domain at a Heroku app. (https://devcenter.heroku.com/articles/custom-domains) In terms of scalability, I'd recommend AWS for higher user load and cheaper prices, but it is harder to learn versus using Git (a simple "git push heroku master") to launch on Heroku. Depending on how you see your final project, whether as a web app that the world will use or as a demo app, your team can decide which service to use. 

Overall, fantastic work as usual! I can't wait to see how your project turns out! 

You have been given a thumbs-up and funded! 


#Project 1 Feedback

Your idea is really quite novel! It's interesting that existing DYI scheduling web services (Doodle, when2meet, etc.) don't cross-check schedules with each other. (Like, say a user says on one Doodle that they aren't available on Monday at 1pm, shouldn't it be carried (or at least somehow communicated) throughout other Doodles?) 

Referring to your Trello board, which is fantastic, I love that your team is taking time to understand your competitors (in this case, scheduleshare.net) and how you can improve. It's an awesome attitude and it will get you far!

I think it's early to give y'all suggestions on implementing some of your ideas, though I think you should take a look at the Socket.io (http://socket.io) library if you decide to implement chat functionality. It has sample code of how to build a basic chat app (I believe in 6 lines of code?) which you may find useful!

All in all, awesome job! I look forward to seeing how your project evolves!
