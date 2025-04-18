// models/Course.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: String,
    code: String,
    description: String
});

CourseSchema.statics.getStatistics = async function () {
    // Exemple de statistique : Nombre d'étudiants inscrits par matière
    const stats = await this.aggregate([
        {
            $lookup: {
                from: 'grades', // Chercher dans la collection grades
                localField: '_id', // Rechercher par identifiant de cours
                foreignField: 'course', // Correspond au champ course dans 'grades'
                as: 'students'
            }
        },
        {
            $project: {
                name: '$name', // Nom du cours
                value: { $size: '$students' }, // Nombre d'étudiants inscrits à ce cours
                fill: '#82ca9d' // Couleur fixe pour l'exemple
            }
        }
    ]);

    return stats.map(stat => ({
        name: stat.name,
        value: stat.value,
        fill: stat.fill
    }));
};

module.exports = mongoose.model('Course', CourseSchema);
