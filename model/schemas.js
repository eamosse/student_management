let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let StudentSchema = Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
},{
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
            return ret;
        }
    }
});

let student = mongoose.model('Student', StudentSchema);

let courseSchema = Schema({
    name: String,
    code: String,
});

let Course = mongoose.model('Course', courseSchema);

let gradeSchema = Schema({
    student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    grade: Number,
    date: Date,
});
let Grade = mongoose.model('Grade', gradeSchema);

let userSchema = new Schema({
    nom: String,
    prenom: String,
    email: { type: String, unique: true },
    motDePasse: String,
    role: { type: String, enum: ['etudiant', 'enseignant', 'admin'], default: 'etudiant' }
});

let User = mongoose.model('User', userSchema);

// Exports the modeles
module.exports = {
    User: User,
    Student: student,
    Course: Course,
    Grade: Grade,
}
