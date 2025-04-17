let {Course} = require("../model/schemas");
const ReturnType = require("../utile/ReturnType");

async function updateOrCreate(courseData, id = null) {
    try {
        let course;
        let action;

        if (id) {
            course = await Course.findById(id);
            if (!course) {
                throw new Error("Le cours n'existe pas");
            }
            course.name = courseData.name;
            course.code = courseData.code;
            action = "update";
        } else {
            course = new Course({
                name: courseData.name,
                code: courseData.code
            });
            action = "create";
        }

        const courseSaved = await course.save();

        if (action === "update") {
            return new ReturnType(1, "update_success", "Le cours a été mis à jour avec succès", courseSaved);
        } else {
            return new ReturnType(1, "create_success", "Le cours a été inséré avec succès", courseSaved);
        }

    } catch (err) {
        console.error(err);
        return new ReturnType(-1, "failed_update_or_create", "Erreur sur la création ou la mise à jour du cours", null);
    }
}


async function getAll() {
    try {
      return new ReturnType(1 , "get_all_course" ,"" , await Course.find())
  
    }catch(err) {
      
      throw err
    }
  
  }

  async function destroy(id) {

    try {
     const result = await Course.findByIdAndDelete(id)
     if (!result) {
        return  new ReturnType(-1 ,"not_found" ,"le cours n'existe pas" , null)
    }

    return  new ReturnType(1 ,"delete_success" ,"le cours a été supprimé" , null)

        
    }catch(err) {
        throw err
    }
}

async function getById(id) {
    try {
      const course = await Course.findById(id);
      if (!course) {
        return new ReturnType(-1, "not_found", "Le cours n'existe pas", null);
      }
      return new ReturnType(1, "get_course_success", "Cours récupéré avec succès", course);
    } catch (err) {
      console.error(err);
      return new ReturnType(-1, "failed_get_by_id", "Erreur lors de la récupération du cours", null);
    }
  }

module.exports = {
    updateOrCreate ,
    getAll ,
    destroy,
    getById
}

