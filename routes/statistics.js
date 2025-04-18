const express = require('express');
const router = express.Router();
const Grade = require('../model/Grade');

// Route pour obtenir la moyenne des notes par cours
router.get('/grades/average', async (req, res) => {
  try {
    const stats = await Grade.getAverageGrades(); // Appel de la méthode pour la moyenne des notes
    res.json(stats); // Envoi des statistiques en réponse
  } catch (err) {
    res.status(500).json({ error: err.message }); // Gestion des erreurs
  }
});

// Route pour obtenir la distribution des notes
router.get('/grades/distribution', async (req, res) => {
  try {
    const stats = await Grade.getGradeDistribution(); // Appel de la méthode pour la distribution des notes
    res.json(stats); // Envoi des statistiques en réponse
  } catch (err) {
    res.status(500).json({ error: err.message }); // Gestion des erreurs
  }
});

router.get('/grades/top-students', async (req, res) => {
  try {
    const stats = await Grade.getTopStudents();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/grades/max-by-course', async (req, res) => {
  try {
    const stats = await Grade.getMaxGradeByCourse();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
