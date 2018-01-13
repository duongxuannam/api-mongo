const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://duongxuannam:namdaica@ds113746.mlab.com:13746/ok-herewego');

module.exports = {mongoose}