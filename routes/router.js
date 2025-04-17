const express =require("express")
const router = express.Router();


const studentRouter = require("./_API/studentAPI")
const courseRouter = require("./_API/courseAPI")
const gradeRouter = require("./_API/gradesAPI")


router.use("/student" , studentRouter);
router.use("/course" , courseRouter);
router.use("/grade" , gradeRouter);


module.exports = router;
