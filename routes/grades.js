let {Grade, Student, Course} = require('../model/schemas');

function getAll(req, res) {
    Grade.find()
        .populate('student')
        .populate('course')
        .then((grades) => {
            res.send(grades);
        }).catch((err) => {
        res.send(err);
    });
}


function create(req, res) {
    let grade = new Grade();

    grade.student = req.body.student;
    grade.course = req.body.course;
    grade.grade = req.body.grade;
    grade.date = req.body.date;

    grade.save()
        .then((grade) => {
                res.json({message: `grade saved with id ${grade.id}!`});
            }
        ).catch((err) => {
        console.log(err);
        res.status(400).send('cant post grade ', err.message);
    });
}

function edit(req, res) {
    const updatedGrade = {
        student: req.body.student,
        course: req.body.course,
        grade: req.body.grade,
        date: req.body.date,
    };

    Grade.findByIdAndUpdate(req.params.id, updatedGrade, {
        runValidators: true,
    })
        .then((grade) => {
                res.json({message: `grade with id ${req.params.id} update`});
            }
        ).catch((err) => {
        console.log(err);
        res.status(400).send('cant put grade ', err.message);
    });
}

function deleteById(req, res) {
    Grade.findByIdAndDelete(req.params.id)
        .then((deletedGrade) => {
            if (!deletedGrade) {
                return res.status(404).json({ message: `Grade with id ${req.params.id} not found` });
            }
            res.json({ message: `Grade with id ${req.params.id} deleted`, grade: deletedGrade });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ error: err.message });
        });
}

module.exports = {getAll, create, edit, deleteById};
