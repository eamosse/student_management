const express =require("express")
const _courseService = require("../../service/courseService")

const route = express.Router();  
const _courseController = require("../../controller/courseController")


route.post("/", async (req, res) => {
    try {
      const courseData = req.body;
      const result = await _courseService.updateOrCreate(courseData);
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de l'ajout du cours" });
    }
  });

  route.get('/:id', async (req, res) => {
    try {
      const courseId = req.params.id;
      const course = await _courseService.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Le cours n'existe pas." });
      }
      res.status(200).json(course);
    } catch (err) {
      console.error("Erreur dans GET /course/:id :", err);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });
route.get("/" ,_courseController.getAll)
route.delete("/" , _courseController.destroy)

module.exports = route;
