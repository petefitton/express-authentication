const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.user.findByPk(id).then(user => {
        cb(null, user);
    }).catch(err => {
        cb(err, null);
    });
});

// COULD ALSO DO:

// passport.deserializeUser(function(id, cb) {
//     db.user.findByPk(id).then(user => {
//         cb(null, user);
//     }).catch(cb);
// });

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, cb) {
    db.user.findOne({ where: { email: email } } ).then(function(user) {
        // OR YOU COULD DO:
        // db.user.findOne({ where: { email } } )
        if (!user || !user.validPassword(password)) {
            cb(null, false);
        } else {
            cb(null, user);
        }
    }).catch(cb);
}));

module.exports = passport;