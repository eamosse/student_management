const express = require('express');
const router = express.Router();
const { Student, Course, Grade } =  require('../model/schemas');

// Statistiques globales pour l'admin
router.get('/', async (req, res) => {
    try {
        // 1. Récupérer les données agrégées
        const [studentsCount, coursesCount, grades] = await Promise.all([
            Student.countDocuments(),
            Course.countDocuments(),
            Grade.find().populate('student course')
        ]);

        // 2. Calculer la moyenne générale
        const averageGrade = grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;

        // 3. Nouveaux étudiants ce mois-ci
        const currentMonth = new Date().getMonth();
        const newStudents = await Student.countDocuments({
            createdAt: { 
                $gte: new Date(new Date().getFullYear(), currentMonth, 1),
                $lt: new Date(new Date().getFullYear(), currentMonth + 1, 1)
            }
        });

        // 4. Moyennes par cours
        const courseAverages = await Grade.aggregate([
            { $group: { _id: "$course", average: { $avg: "$grade" } } },
            { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
            { $unwind: "$course" },
            { $project: { courseName: "$course.name", average: { $round: ["$average", 2] } } }
        ]);

        // 5. Répartition des étudiants par filière (exemple avec un champ fictif 'field')
        const studentsByField = await Student.aggregate([
            { $group: { _id: "$field", count: { $sum: 1 } } },
            { $project: { field: "$_id", count: 1, _id: 0 } }
        ]);

        // 6. Évolution des inscriptions (6 derniers mois)
        const registrationsEvolution = await Student.aggregate([
            { 
                $match: { 
                    createdAt: { 
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) 
                    } 
                } 
            },
            { 
                $group: { 
                    _id: { 
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    }, 
                    count: { $sum: 1 } 
                } 
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 6 }
        ]);

        // 7. Top 5 des étudiants
        const topStudents = await Grade.aggregate([
            { 
                $group: { 
                    _id: "$student", 
                    average: { $avg: "$grade" } 
                } 
            },
            { $sort: { average: -1 } },
            { $limit: 5 },
            { 
                $lookup: { 
                    from: "students", 
                    localField: "_id", 
                    foreignField: "_id", 
                    as: "student" 
                } 
            },
            { $unwind: "$student" },
            { 
                $project: { 
                    name: { $concat: ["$student.firstName", " ", "$student.lastName"] }, 
                    average: { $round: ["$average", 2] } 
                } 
            }
        ]);

        res.json({
            summary: {
                studentsCount,
                coursesCount,
                averageGrade: averageGrade.toFixed(2),
                newStudents,
                activeCourses: coursesCount // À adapter si vous avez un champ 'active'
            },
            charts: {
                courseAverages,
                studentsByField,
                registrationsEvolution: registrationsEvolution.map(item => ({
                    month: item._id.month,
                    year: item._id.year,
                    count: item.count
                })),
                topStudents
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;