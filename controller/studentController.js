const _studentService = require("../service/studentsService")


async function updateOrCreate(req, res) {

    const { id: _id } = req.query;
    const body = {
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim()
    }
    try {
        const data = await _studentService.updateOrCreate(body, _id)
        return res.status(200).json({ index: data.index, status: data.status, message: data.message, data: data.data })

    } catch (err) {
        return res.status(500).json({ index: data.index, status: data.status, message: data.message, data: data.data })

    }
}

async function getAll(req, res) {

    const search = req.query.search ? req.query.search  : ""

    const page = req.query.page 

    const limit = req.query.limit


    try {
        const data = await _studentService.GetAll(search ,page ,limit)
        return res.status(200).json({ index: data.index, status: data.status, message: data.message, data: data.data })
    } catch (err) {
        return res.status(500).json({ index: data.index, status: data.status, message: data.message, data: null })
    }
}

async function destroy(req ,res) {

    const id = req.query.id.trim()
    try {
        const data = await _studentService.destroy(id)
        return  res.status(200).json({index : data.index , status : data.status , message : data.message , data : data.data})

    }catch(err) {
        return  res.status(500).json({index : data.index , status : data.status , message : data.message , data : null})

    }
}

async function getById(req ,res) {

    const id = req.query.id
    try {
        const data = await _studentService.getById(id)
        return  res.status(200).json({index : data.index , status : data.status , message : data.message , data : data.data})

    }catch(err) {
        return  res.status(500).json({index : data.index , status : data.status , message : data.message , data : null})

    }
}

async function Import (req ,res) {
    console.log(req.file)
    const path = req.file.path 

    try {
        const data = await _studentService.Import(path)
        return  res.status(200).json({index : data.index , status : data.status , message : data.message , data : data.data})

    }catch(err) {
        return  res.status(500).json({index : data.index , status : data.status , message : data.message , data : null})
    }

}




module.exports = {
    updateOrCreate,
    getAll , 
    destroy ,
    getById ,
    Import
}