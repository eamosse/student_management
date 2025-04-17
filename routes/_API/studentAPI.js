const express =require("express")

const route = express.Router();  // Create a router instance
const studentController = require("../../controller/studentController")
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });


route.post('/', studentController.updateOrCreate);
route.get("/" ,studentController.getAll)
route.get("/getById" ,studentController.getById)
route.post("/import" , upload.single('file'),studentController.Import)
route.delete("/" , studentController.destroy)

module.exports = route;
