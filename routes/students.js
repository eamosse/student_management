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
    const id = req.params.id

    Student.findByIdAndUpdate(id, {...req.body})
        .then(() => {
            res.json({message: `student updated with id ${id}`})
        })
        .catch((err) => {
            res.send(`can't update student `, err)
        })
}

function deleteStudent(req, res) {
    const id = req.params.id

    Student.deleteOne({_id: id})
        .then(() => {
            res.json({message: `student deleted with id ${id}`})
        })
        .catch((err) => {
            res.send(`can't delete student `, err)
        })
}

function getById(req, res) {
    const id = req.params.id;

    Student.findById(id)
        .then((student) => {
            if (!student) {
                return res.status(404).send('Student not found');
            }
            res.send(student);
        })
        .catch((err) => {
            res.status(500).send(`Error retrieving student: ${err.message}`);
        });
}

module.exports = {getAll, create, update, deleteStudent, getById};
