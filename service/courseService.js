const _courseManager = require("../manager/courseManager")

async function updateOrCreate (coursetData , id=null) {

    try {
        const data = await _courseManager.updateOrCreate(coursetData,id)
        return data

    }catch(err) {
        throw err
    }
}


async function GetAll() {
    try {

     const data =  await _courseManager.getAll()
     return data

    }catch(err) {
        throw err
    }
}

async function destroy (id) {

    try {
          const data = await _courseManager.destroy(id)
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