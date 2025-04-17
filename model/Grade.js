const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GradeSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    grade: Number,
    date: Date,
});

module.exports = mongoose.model('Grade', GradeSchema);
