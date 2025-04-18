const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GradeSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    grade: Number,
    date: Date,
});

// Statistique: Moyenne des notes par cours
GradeSchema.statics.getAverageGrades = async function () {
    return this.aggregate([
        {
            $group: {
                _id: '$course',
                avgGrade: { $avg: '$grade' } 
            }
        },
        {
            $lookup: {
                from: 'courses',
                localField: '_id',
                foreignField: '_id',
                as: 'courseInfo'  
            }
        },
        {
            $unwind: '$courseInfo' 
        },
        {
            $project: {
                name: '$courseInfo.name',  
                value: '$avgGrade', 
                fill: {
                    $switch: {
                        branches: [
                            { case: { $eq: ['$courseInfo.name', 'Math'] }, then: '#8884d8' },
                            { case: { $eq: ['$courseInfo.name', 'Science'] }, then: '#82ca9d' },
                            { case: { $eq: ['$courseInfo.name', 'React'] }, then: '#ffc658' }
                        ],
                        default: '#d0d0d0' 
                    }
                }
            }
        }
    ]);
};


GradeSchema.statics.getGradeDistribution = async function () {
    return this.aggregate([
      {
        $bucket: {
          groupBy: "$grade",
          boundaries: [0, 10, 15, 20],
          default: "Autres",
          output: {
            count: { $sum: 1 }
          }
        }
      },
      {
        $addFields: {
          label: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 0] }, then: "Inférieur à 10" },
                { case: { $eq: ["$_id", 10] }, then: "Entre 10 et 15" },
                { case: { $eq: ["$_id", 15] }, then: "Supérieur à 15" }
              ],
              default: "Autres"
            }
          },
          fill: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 0] }, then: "#ff8042" },
                { case: { $eq: ["$_id", 10] }, then: "#ffbb33" },
                { case: { $eq: ["$_id", 15] }, then: "#82ca9d" }
              ],
              default: "#d0d0d0"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$label",
          value: "$count",
          fill: 1
        }
      }
    ]);
  };
  



GradeSchema.statics.getTopStudents = async function () {
    const topStudents = await this.aggregate([
        {
            $group: {
                _id: '$student',
                avgGrade: { $avg: '$grade' }
            }
        },
        {
            $lookup: {
                from: 'students',
                localField: '_id',
                foreignField: '_id',
                as: 'studentInfo'
            }
        },
        { $unwind: '$studentInfo' },
        { $sort: { avgGrade: -1 } },
        { $limit: 3 },
        {
            $project: {
                name: { $concat: ['$studentInfo.firstName', ' ', '$studentInfo.lastName'] },
                value: '$avgGrade',
                fill: '#82ca9d'
            }
        }
    ]);

    return topStudents;
};

GradeSchema.statics.getMaxGradeByCourse = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: '$course',
                maxGrade: { $max: '$grade' }
            }
        },
        {
            $lookup: {
                from: 'courses',
                localField: '_id',
                foreignField: '_id',
                as: 'courseInfo'
            }
        },
        { $unwind: '$courseInfo' },
        {
            $project: {
                name: '$courseInfo.name',
                value: '$maxGrade',
                fill: '#2f9811'
            }
        }
    ]);
    return stats;
};

module.exports = mongoose.model('Grade', GradeSchema);
