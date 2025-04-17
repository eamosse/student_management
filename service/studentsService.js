const _studentManager = require("../manager/studentManager")

async function updateOrCreate (studentData , id=null) {

    try {
        const data = await _studentManager.updateOrCreate(studentData,id)
        return data

    }catch(err) {
        throw err
    }
}


async function GetAll(search="" , page = 1, limit = 6) {
    try {

     const data =  await _studentManager.GetAll(search ,page ,limit)
     return data

    }catch(err) {
        throw err
    }
}

async function destroy (id) {

    try {
          const data = await _studentManager.destroy(id)
          return data

    }catch(err) {
        throw err
    }
}

async function getById (id) {

    try {
          const data = await _studentManager.GetById(id)
          return data

    }catch(err) {
        throw err
    }
}

async function Import (filePath) {

    try {
        const data = await _studentManager.Import(filePath)
        return data

    }catch(err) {
        throw err
    }
}

module.exports = {
    updateOrCreate ,
    GetAll ,
    destroy ,
    getById ,
    Import
}