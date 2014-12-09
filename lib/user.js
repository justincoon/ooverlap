var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,

  facebook: String,
  google: String,
  tokens: Array,
  profilePicPrivacy: String,
  emailPrivacy: String,

  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    picture: { type: String, default: '' }
  },

  friends: Array,
  groups: Array,
  schedule: Array,
  request: Array,
  events: Array,
});

/**
 * Password hashing Mongoose middleware.
 */

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) { return next(); }

  bcrypt.genSalt(5, function(err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validation user's password.
 */

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};
module.exports = mongoose.model('User', userSchema);
