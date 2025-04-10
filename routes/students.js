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
                res.json({message: `student saved with id ${student.id}!`});
            }
        ).catch((err) => {
        res.send('cant post student ', err);
    });
}

function update(req, res) {
    const { studentId } = req.params; 
    const { firstName, lastName } = req.body;

    Student.findByIdAndUpdate(studentId, { firstName, lastName }, { new: true })
        .then((updatedStudent) => {
            if (!updatedStudent) {
                return res.status(404).send('Student not found!');
            }
            res.json({ message: `Student updated with id ${updatedStudent.id}`, student: updatedStudent });
        })
        .catch((err) => {
            res.send('Error updating student ', err);
        });
}

function deleteStudent(req, res) {
    const { studentId } = req.params;

    Student.findByIdAndDelete(studentId)
        .then((deletedStudent) => {
            if (!deletedStudent) {
                return res.status(404).send('Student not found!');
            }
            res.json({ message: `Student deleted with id ${deletedStudent.id}` });
        })
        .catch((err) => {
            res.send('Error deleting student ', err);
        });
}

module.exports = {getAll, create, update, deleteStudent};
