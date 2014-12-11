module.exports = {
  db: process.env.MONGOLAB_URI || process.env.MONGODB || //'mongodb://localhost:27017/test',
     'mongodb://admin:password@ds053160.mongolab.com:53160/ooverlap',
  
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
    clientID: process.env.GOOGLE_ID || '935745080764-olnesivupirhdpm899bgifu0mte7c969.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'zCXMjasevF3cogfDSMVUt2OG',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },
};
