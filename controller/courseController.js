const _coursService = require("../service/courseService")

async function updateOrCreate(req, res) {
    const { id: _id } = req.query;
    const body = {
        name: req.body.name?.trim(),
        code: req.body.code?.trim()
    };

    try {
        const data = await _coursService.updateOrCreate(body, _id);
        return res.status(200).json({ 
            index: data.index, 
            status: data.status, 
            message: data.message, 
            data: data.data 
        });
    } catch (err) {
        return res.status(500).json({ 
            index: 0, 
            status: "error", 
            message: err.message || "Erreur interne", 
            data: null 
        });
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

async function destroy(req, res) {
    try {
      const id = req.query.id;
      
      if (!id || !id.trim()) {
        return res.status(400).json({ status: 'error', message: 'ID manquant ou invalide.', data: null });
      }
  
      const data = await _coursService.destroy(id.trim());
      return res.status(200).json({ index: data.index, status: data.status, message: data.message, data: data.data });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: 'error', message: 'Erreur interne.', data: null });
    }
  }

  async function getById(req, res) {
    try {
      const id = req.query.id;
      if (!id || !id.trim()) {
        return res.status(400).json({ status: "error", message: "ID manquant ou invalide.", data: null });
      }
  
      const data = await _coursService.getById(id.trim());
      return res.status(200).json({ index: data.index, status: data.status, message: data.message, data: data.data });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: "error", message: "Erreur interne lors de la récupération du cours.", data: null });
    }
  }
  
  

module.exports = {
    destroy ,
    updateOrCreate ,
    getAll,
    getById
}