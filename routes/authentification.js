let { User } = require('../model/schemas');
const bcrypt = require('bcryptjs');

function insertProfil(req, res) {
  const { nom, identifiant, motDePasse, role } = req.body;

  if (!nom || !identifiant || !motDePasse || !role) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  User.findOne({ identifiant })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ message: 'Identifiant déjà utilisé.' });
      }

      return bcrypt.hash(motDePasse, 10);
    })
    .then(hashedPassword => {
      const newUser = new User({
        nom,
        identifiant,
        motDePasse: hashedPassword,
        role,
        connexion: 0
      });

      return newUser.save();
    })
    .then(() => {
      res.status(201).json({ message: 'Profil utilisateur ajouté avec succès.' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de l\'ajout du profil.', error: error.message });
    });
}

module.exports = { insertProfil };