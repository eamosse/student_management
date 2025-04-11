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
    const { id } = req.params;
    const { name, code } = req.body;

    Course.findByIdAndUpdate(id, { name, code }, { new: true })
        .then((updatedCourse) => {
            if (!updatedCourse) {
                return res.status(404).json({ message: 'Course not found' });
            }
            res.json({ message: 'Course updated successfully', course: updatedCourse });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error updating course', error: err });
        });
}

function deleteCourse(req, res) {
    const { id } = req.params;

    Course.findByIdAndDelete(id)
        .then((deletedCourse) => {
            if (!deletedCourse) {
                return res.status(404).json({ message: 'Course not found' });
            }
            res.json({ message: 'Course deleted successfully', course: deletedCourse });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error deleting course', error: err });
        });
}

module.exports = {getAll, create, update, deleteCourse};
