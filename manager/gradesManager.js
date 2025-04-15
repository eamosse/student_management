
let { Grade } = require("../model/schemas")

let { DateTime } = require("luxon");
const ReturnType = require("../utile/ReturnType");

async function updateOrCreate(gradeData, id) {

    try {
        let grade;
        let update = false;
        let create = false;

        if (id) {
            create = false
            update = true
            const grade = await Grade.findById(id)

            if (!grade) {
                throw ("la note n'existe pas")
            }

            grade.date = DateTime.now().toFormat("yyyy-MM-dd")
            grade.grade = gradeData.grade
        } else {
            create = true
            update = false

            grade = new Grade({
                student: gradeData.student,
                course: gradeData.course,
                date: DateTime.now().toFormat("yyyy-MM-dd"),
                grade: gradeData.grade

            })
        }

        const gradeInsertedData = await grade.save()

        if (update) {
            return new ReturnType(1, "update_grade_success", "la note a été mis a jour", gradeInsertedData)
        } else if (create) {
            return new ReturnType(1, "create_grade_success", "la note a été ajouté avec succée", gradeInsertedData)

        }



    } catch (err) {
        throw err
    }
}


async function getAll() {

    try {
        return new ReturnType(1, "get_grades", "", await Grade.find().populate('student').populate('course'))

    } catch (err) {
        throw err
    }
}


async function destroy(id) {

    try {
        const result = await Grade.findByIdAndDelete(id)
        if (!result) {
           return  new ReturnType(-1 ,"not_found" ,"la note avec l'identifiant n'existe pas" , null)
       }
   
       return  new ReturnType(1 ,"delete_success" ,"la note a été supprimé" , null)
   
           
       }catch(err) {
           throw err
       }
}

module.exports = {
    destroy ,
    updateOrCreate ,
    getAll
}