const _gradeManager = require("../manager/gradesManager")

async function updateOrCreate (gradeData , id=null) {

    try {
        const data = await _gradeManager.updateOrCreate(gradeData,id)
        return data

    }catch(err) {
        throw err
    }
}


async function GetAll() {
    try {

     const data =  await _gradeManager.getAll()
     return data

    }catch(err) {
        throw err
    }
}

async function destroy (id) {

    try {
          const data = await _gradeManager.destroy(id)
          return data

    }catch(err) {
        throw err
    }
}

module.exports = {
    updateOrCreate ,
    GetAll ,
    destroy
}