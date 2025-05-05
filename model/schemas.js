let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let StudentSchema = Schema({
    firstName: String,
    lastName: String,
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

let userSchema = Schema({
    nom: { type: String, required: true },
    identifiant: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'SCOLARITE', 'STUDENT'], required: true },
    connexion: { type: Number, default: 0 }
  });
  
  let User = mongoose.model('User', userSchema, 'User');

// Exports the modeles
module.exports = {
    Student: student,
    Course: Course,
    Grade: Grade,
    User: User
}
