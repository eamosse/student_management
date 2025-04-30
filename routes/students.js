const mongoose = require('mongoose');
let {Student} = require('../model/schemas');

function getAll(req, res) {
    Student.find().then((students) => {
        res.send(students);
    }).catch((err) => {
        res.send(err);
    });
}


function create(req, res) {

    let student = new Student();
    student.firstName = req.body.firstName;
    student.lastName = req.body.lastName;

    student.save()
        .then((student) => {
                console.log("Student saved:", student);
                res.json({message: `student saved with id ${student.id}!`});
            }
        ).catch((err) => {
        console.error("Error saving student:", err);    
        res.status(400).json({ error: "cant post student" });
    });
}

function updateStudent(req, res) {
    let studentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({ error: "Invalid student ID" });
    }

    const updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    };

    Student.findByIdAndUpdate(studentId, updateData, { new: true, runValidators: true })
        .then((student) => {
            if (!student) {
                return res.status(404).json({ error: "Student not found" });
            }
            res.json({ message: `Student with id ${studentId} updated successfully`, student });
        })
        .catch((err) => {
            console.error("Error updating student:", err);
            res.status(500).json({ error: "Failed to update student" });
        });
}

function deleteStudent(req, res) {
    let studentId = req.params.id;

    Student.findByIdAndDelete(studentId)
        .then((student) => {
            if (!student) {
                return res.status(404).json({ error: "Student not found" });
            }
            res.json({ message: `Student with id ${studentId} deleted successfully` });
        })
        .catch((err) => {
            console.error("Error deleting student:", err);
            res.status(500).json({ error: "Failed to delete student" });
        });
}

module.exports = {getAll, create, updateStudent, deleteStudent};
