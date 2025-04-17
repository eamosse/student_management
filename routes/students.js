let { Grade, Student, Course } = require('../model');
const { getPaginatedResults } = require('../utils/paginationUtils');
function getAll(req, res) {
    Student.find().then((students) => {
        res.send(students);
    }).catch((err) => {
        res.send(err);
    });
}

function getPagination(req, res) {
    getPaginatedResults(Student, req)
        .then((paginationData) => {
            res.json(paginationData);
        })
        .catch((err) => {
            res.status(500).send(err.message);
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

function exportToCSV(req, res) {
    Student.find()
        .then((students) => {
            // Ajouter le BOM UTF-8 pour Excel
            let csv = '\uFEFF';
            
            // Créer l'en-tête CSV
            csv += 'ID;Prénom;Nom\n';
            
            // Ajouter chaque étudiant comme une ligne CSV
            students.forEach(student => {
                csv += `${student._id};${student.firstName};${student.lastName}\n`;
            });

            // Définir les en-têtes de la réponse
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
            
            // Envoyer le fichier CSV
            res.send(csv);
        })
        .catch((err) => {
            res.status(500).send(`Error exporting students: ${err.message}`);
        });
}

module.exports = {getAll, getPagination, create, update, deleteStudent, getById, exportToCSV};
