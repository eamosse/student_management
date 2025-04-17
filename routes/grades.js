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

function update(req, res) {
    // const { gradeId } = req.params.id;
    const gradeId = req.params.id;
    const { student, course, grade, date } = req.body;

    Grade.findByIdAndUpdate(gradeId, { student, course, grade, date }, { new: true })
        .populate('student')
        .populate('course')
        .then((updatedGrade) => {
            if (!updatedGrade) {
                return res.status(404).send('Grade not found!');
            }
            res.json({ message: `Grade updated with id ${updatedGrade.id}`, grade: updatedGrade });
        })
        .catch((err) => {
            res.status(400).send('Error updating grade ', err);
        });
}

function deleteGrade(req, res) {
    // const { gradeId } = req.params.id;
    const gradeId = req.params.id;

    Grade.findByIdAndDelete(gradeId)
        .then((deletedGrade) => {
            if (!deletedGrade) {
                return res.status(404).send('Grade not found!');
            }
            res.json({ message: `Grade deleted with id ${deletedGrade.id}` });
        })
        .catch((err) => {
            res.status(400).send('Error deleting grade ', err);
        });
}

module.exports = { getAll, create, update, deleteGrade };
