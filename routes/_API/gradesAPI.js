const express =require("express")

const route = express.Router();  // Create a router instance
const _gradesController = require("../../controller/gradeController")


route.post('/', _gradesController.updateOrCreate);
route.get("/" ,_gradesController.getAll)
route.delete("/" , _gradesController.destroy)

module.exports = route;
