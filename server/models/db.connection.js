let mongoose = require('mongoose');
let dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
module.exports = mongoose;