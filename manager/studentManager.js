let { Student } = require("../model/schemas");
const csv = require('csv-parser');

const fs = require("fs")

const ReturnType = require("../utile/ReturnType");
const { promises } = require("dns");

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
        const terms = search.trim().split(/\s+/); // découpe par espace
      
        if (terms.length >= 2) {
          // Si l'utilisateur a entré
          const [first, last] = terms;
      
          query = {
            $or: [
              {
                $and: [
                  { firstName: { $regex: first, $options: 'i' } },
                  { lastName: { $regex: last, $options: 'i' } }
                ]
              },
              {
                $and: [
                  { firstName: { $regex: last, $options: 'i' } },
                  { lastName: { $regex: first, $options: 'i' } }
                ]
              }
            ]
          };
        } else {
          // Cas classique, une seule valeur
          query = {
            $or: [
              { firstName: { $regex: search.trim(), $options: 'i' } },
              { lastName: { $regex: search.trim(), $options: 'i' } }
            ]
          };
        }
      }
  
      const skip = (page - 1) * limit;
  
      const [students, total] = await Promise.all([
        Student.find(query).skip(skip).limit(limit),
        Student.countDocuments(query),
      ]);
  
      const allStudent = await Student.find()
      const totalPages = Math.ceil(total / limit);
  
      return new ReturnType(1, "get_all_student", "", {
        students,
        total,
        page,
        totalPages,
        allStudent
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

async function Import(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Supprimer le fichier une fois lu
        fs.unlinkSync(filePath);

        try {
          const importResults = await Promise.all(
            results.map(async (item) => {
              const { firstName, lastName } = item;

              if (!firstName || !lastName) {
                return new ReturnType(-1, "invalid_data", "Prénom ou nom manquant", null);
              }

              //Vérifier les doublons
              const exists = await Student.findOne({ firstName, lastName });
              if (exists) {
                return new ReturnType(-1, "duplicate", "Étudiant déjà existant", { firstName, lastName });
              }

              const student = new Student({ firstName, lastName });
              const saved = await student.save();

              return new ReturnType(1, "imported", "Étudiant importé", saved);
            })
          );

          resolve(new ReturnType(1, "imported_data", "Importation terminée", importResults));
        } catch (err) {
          console.error("Erreur lors de l'importation :", err);
          reject(new ReturnType(-1, "server_error", "Erreur serveur lors de l'importation", null));
        }
      })
      .on('error', (err) => {
        console.error("Erreur de lecture du fichier :", err);
        reject(new ReturnType(-1, "file_error", "Erreur de lecture du fichier", null));
      });
  });
}

module.exports = {
    updateOrCreate ,
    GetAll ,
    destroy ,
    GetById ,
    Import
}