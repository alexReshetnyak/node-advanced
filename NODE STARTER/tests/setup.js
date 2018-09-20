
jest.setTimeout(30000); // * wait any callbacks 30s before trigger error message ( by default 5s )

require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise; // * Use node global promise object
mongoose.connect(keys.mongoURI, { useMongoClient: true });
