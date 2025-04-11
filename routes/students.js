let { Student } = require('../model/schemas');

function getAll(req, res) {
    Student.find().then((students) => {
        res.send(students);
    }).catch((err) => {
        res.status(500).send(err);
    });
}

function create(req, res) {
    if (Array.isArray(req.body)) {
        Student.insertMany(req.body)
            .then((students) => {
                res.json({
                    message: `${students.length} students saved successfully!`,
                    students: students
                });
            })
            .catch((err) => {
                res.status(500).send('Cannot post students', err);
            });
    } else {
        let student = new Student();
        student.firstName = req.body.firstName;
        student.lastName = req.body.lastName;
        student.id_student = req.body.id_student;

        student.save()
            .then((student) => {
                res.json({ message: `Student saved with id ${student.id}!` });
            })
            .catch((err) => {
                res.status(500).send('Cannot post student', err);
            });
    }
}

function update(req, res) {
    const updatedData = req.body;
    const id_student = parseInt(req.params.id_student, 10); 

    if (isNaN(id_student)) {
    return res.status(400).json({ message: "L'ID étudiant est invalide" });
    }

    Student.findOneAndUpdate({ id_student: id_student }, updatedData, { new: true })
    .then((student) => {
        if (!student) {
        return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: `Student with id ${id_student} updated successfully!`, student });
    })
    .catch((err) => {
        res.status(500).send('Cannot update student');
  });

}



function deleteStudent(req, res) {
    const { id_student } = req.params;

    Student.findOneAndDelete({ id_student: id_student })
        .then((student) => {
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json({ message: `Student with id ${id_student} deleted successfully!` });
        })
        .catch((err) => {
            console.error('Error deleting student:', err);  
            res.status(500).json({ message: 'Cannot delete student', error: err.message });
        });
}


module.exports = { getAll, create, update, deleteStudent };
