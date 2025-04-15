const _coursService = require("../service/courseService")

async function updateOrCreate(req, res) {

    const { id: _id } = req.query;
    const body = {
        name: req.body.name.trim(),
        code: req.body.code.trim()
    }
    try {
        const data = await _coursService.updateOrCreate(body, _id)
        return res.status(200).json({ index: data.index, status: data.status, message: data.message, data: data.data })

    } catch (err) {
        return res.status(500).json({ index: data.index, status: data.status, message: data.message, data: data.data })

    }
}

async function getAll(req, res) {

    try {
        const data = await _coursService.GetAll()
        return res.status(200).json({ index: data.index, status: data.status, message: data.message, data: data.data })
    } catch (err) {
        return res.status(500).json({ index: data.index, status: data.status, message: data.message, data: null })
    }
}

async function destroy(req ,res) {

    const id = req.query.id.trim()
    try {
        const data = await _coursService.destroy(id)
        return  res.status(200).json({index : data.index , status : data.status , message : data.message , data : data.data})

    }catch(err) {
        return  res.status(500).json({index : data.index , status : data.status , message : data.message , data : null})

    }
}

module.exports = {
    destroy ,
    updateOrCreate ,
    getAll
}