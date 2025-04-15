let { Student } = require("../model/schemas");
const ReturnType = require("../utile/ReturnType");

async function updateOrCreate(studentData, id=null) {


    try {

        let student;
        let update = false
        let create = false

        if (id) {
            student = await Student.findById(id)
            if (!student) {

                throw ("l'etudiant n'existe pas")
            }
            update = true
            create = false
            student.firstName = studentData.firstName
            student.lastName = studentData.lastName


        } else {
            update = false
            create = true
            student = new Student();
            student.firstName = studentData.firstName;
            student.lastName = studentData.lastName;
   }

        const studentDataInsert = await student.save();
         if(update) {
            return new ReturnType(1, "update_success", "l'etudiant a été mis a jour avec succée", studentDataInsert)

         } else if(create) {
            return new ReturnType(1, "create_success", "l'etudiant a insérer avec succée", studentDataInsert)

         }


    } catch (err) {
        console.error(err)
        return new ReturnType(-1, "failed_creation", "Erreur sur la creation d'un etudiant", null)
    }

}

async function GetAll(search = "", page = 1, limit = 6) {
    try {
      let query = {};
  
      if (search && typeof search === "string") {
        query = {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } }
          ]
        };
      }
  
      const skip = (page - 1) * limit;
  
      const [students, total] = await Promise.all([
        Student.find(query).skip(skip).limit(limit),
        Student.countDocuments(query),
      ]);
  
      const totalPages = Math.ceil(total / limit);
  
      return new ReturnType(1, "get_all_student", "", {
        students,
        total,
        page,
        totalPages,
      });
  
    } catch (err) {
      throw err;
    }
  }
  
  

async function GetById(id) {
    try {
      return new ReturnType(1 , "get_student_by_id" ,"" , await Student.findById(id))
  
    }catch(err) {
      
      throw err
    }
  
  }

async function destroy(id) {

    try {
     const result = await Student.findByIdAndDelete(id)
     if (!result) {
        return  new ReturnType(-1 ,"not_found" ,"l'etudiant avec l'identifiant n'existe pas" , null)
    }

    return  new ReturnType(1 ,"delete_success" ,"l'etudiant a été supprimé" , null)

        
    }catch(err) {
        throw err
    }
}

module.exports = {
    updateOrCreate ,
    GetAll ,
    destroy ,
    GetById
}