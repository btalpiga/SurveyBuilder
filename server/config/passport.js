const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    const env = process.env.NODE_ENV || 'development';
    const config = require('./config.json')[env];


// load up the user model
const User = require('../models').User;

module.exports = function(passport) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: config.jwtSecret,
  };
  passport.use('jwt', new JwtStrategy(opts, function(jwt_payload, done) {
    User
      .findByPk(jwt_payload.id)
      .then((user) => { return done(null, user); })
      .catch((error) => { return done(error, false); });
  }));
};
