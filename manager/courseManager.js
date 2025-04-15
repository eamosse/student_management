const { Course } = require("../model/schemas");
const ReturnType = require("../utile/ReturnType");

async function updateOrCreate(courseData, id = null) {
    try {
        let course;
        let update = false;
        let create = false;

        if (id) {
            course = await Course.findById(id); 
            if (!course) {
                return new ReturnType(-1, "not_found", "Le cours n'existe pas", null);
            }
            update = true;
            course.name = courseData.name;
            course.code = courseData.code;
        } else {
            create = true;
            course = new Course({
                name: courseData.name,
                code: courseData.code
            });
        }

        const courseDataInsert = await course.save();

        if (update) {
            return new ReturnType(1, "update_success", "Le cours a été mis à jour avec succès", courseDataInsert);
        } else {
            return new ReturnType(1, "create_success", "Le cours a été inséré avec succès", courseDataInsert);
        }

    } catch (err) {
        console.error(err);
        return new ReturnType(-1, "failed_update_or_create", "Erreur sur la création ou mise à jour d’un cours", null);
    }
}

async function getAll() {
    try {
        const courses = await Course.find();
        return new ReturnType(1, "get_all_course", "Liste des cours récupérée", courses);
    } catch (err) {
        console.error(err);
        return new ReturnType(-1, "get_all_failed", "Erreur lors de la récupération des cours", null);
    }
}

async function destroy(id) {
    try {
        const result = await Course.findByIdAndDelete(id);
        if (!result) {
            return new ReturnType(-1, "not_found", "Le cours n'existe pas", null);
        }

        return new ReturnType(1, "delete_success", "Le cours a été supprimé", result);

    } catch (err) {
        console.error(err);
        return new ReturnType(-1, "delete_failed", "Erreur lors de la suppression", null);
    }
}


module.exports = {
    updateOrCreate,
    getAll,
    destroy
};
