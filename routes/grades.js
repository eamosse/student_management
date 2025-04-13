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

function getNotes(req, res) {
  const id = req.params.id;
  let year = req.query.year;  // Récupérer l'année depuis la query string
  
  let query = { student: id };  // La requête de base pour l'étudiant
  if (!year || isNaN(year)) {
    year=(new Date()).getFullYear()
  }
  console.log(year);
  
  // Si une ann ée est spécifiée, on ajoute un filtre pour l'année
  if (year) {
    
    const startDate = new Date(`${year}-01-01`); // Date de début de l'année
    const endDate = new Date(`${parseInt(year) + 1}-01-01`); // Date de début de l'année suivante
    
    query.date = { $gte: startDate, $lt: endDate }; // Filtrer par l'année
  }
 console.log(query);
 
  Grade.find(query)
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
async function deleteGrade(req, res) {
    try {
      const deletedGrade = await Grade.findByIdAndDelete(req.params.id);
      
      if (!deletedGrade) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json({
        message: "Student deleted successfully",
        courseId: req.params.id,
      });
    } catch (error) {
      res.status(500).json({ message: "Error deleting course", error });
    }
  }
module.exports = {getAll, create,deleteGrade,getNotes};
