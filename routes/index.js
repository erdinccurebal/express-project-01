// Routes
const user = require('./user');
const auth = require('./auth');
const post = require('./post');

module.exports = (app) => {
    app.use('/user', user);
    app.use('/auth', auth);
    app.use('/post', post);
};