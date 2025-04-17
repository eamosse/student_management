const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: String,
    code: String,
});

module.exports = mongoose.model('Course', CourseSchema);
