module.exports = {
  db: process.env.MONGOLAB_URI || process.env.MONGODB || //'mongodb://localhost:27017/test',
     'mongodb://admin:password@ds053160.mongolab.com:53160/ooverlap',
     // 'mongodb://admin:password@ds045087.mongolab.com:45087/ooverlap2',
  
  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  mailgun: {
    user: process.env.MAILGUN_USER || 'postmaster@sandbox697fcddc09814c6b83718b9fd5d4e5dc.mailgun.org',
    password: process.env.MAILGUN_PASSWORD || '29eldds1uri6'
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '754220301289665',
    clientSecret: process.env.FACEBOOK_SECRET || '41860e58c256a3d7ad8267d3c1939a4a',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  google: {
    clientID: process.env.GOOGLE_ID || '376095271632-7h2b3hog676d1ndd58fdv0de1fc6h5b9.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'SFrLJ7P0YVqcF8TVrTq0qq2a',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },
};
