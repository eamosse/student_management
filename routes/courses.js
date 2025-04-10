let {Course} = require('../model/schemas');

function getAll(req, res) {
    Course.find().then((classes) => {
        res.send(classes);
    }).catch((err) => {
        res.send(err);
    });
}


function create(req, res) {
    let course = new Course();
    course.name = req.body.name;
    course.code = req.body.code;

    course.save()
        .then((course) => {
                res.json({message: `course saved with id ${course.id}!`});
            }
        ).catch((err) => {
        res.send('cant post course ', err);
    });
}

function update(req, res) {
    const { courseId } = req.params;
    const { name, code } = req.body;

    Course.findByIdAndUpdate(courseId, { name, code }, { new: true })
        .then((updatedCourse) => {
            if (!updatedCourse) {
                return res.status(404).send('Course not found!');
            }
            res.json({ message: `Course updated with id ${updatedCourse.id}`, course: updatedCourse });
        })
        .catch((err) => {
            res.send('Error updating course ', err);
        });
}

function deleteCourse(req, res) {
    const { courseId } = req.params;

    Course.findByIdAndDelete(courseId)
        .then((deletedCourse) => {
            if (!deletedCourse) {
                return res.status(404).send('Course not found!');
            }
            res.json({ message: `Course deleted with id ${deletedCourse.id}` });
        })
        .catch((err) => {
            res.send('Error deleting course ', err);
        });
}

// Exporte les fonctions
module.exports = { getAll, create, update, deleteCourse };
