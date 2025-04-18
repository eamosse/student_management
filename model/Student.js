const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    firstName: String,
    lastName: String,
    year: String, 
    program: String 
});
module.exports = mongoose.model('Student', StudentSchema);
