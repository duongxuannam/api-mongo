const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://duongxuannam:namdaica@ds157057.mlab.com:57057/api');

module.exports = {mongoose}
