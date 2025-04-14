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
    const id = req.params.id

    Course.findByIdAndUpdate(id, {...req.body})
        .then(() => {
            res.json({message: `course updated with id ${id}`})
        })
        .catch((err) => {
            res.send(`can't update course `, err)
        })
}

function deleteCourse(req, res) {
    const id = req.params.id

    Course.deleteOne({_id: id})
        .then(() => {
            res.json({message: `course deleted with id ${id}`})
        })
        .catch((err) => {
            res.send(`can't delete course `, err)
        })
}

function getById(req, res) {
    const id = req.params.id;

    Course.findById(id)
        .then((course) => {
            if (!course) {
                return res.status(404).send('Course not found');
            }
            res.send(course);
        })
        .catch((err) => {
            res.status(500).send(`Error retrieving course: ${err.message}`);
        });
}

module.exports = {getAll, create, update, deleteCourse, getById};
