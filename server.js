let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let student = require('./routes/students');
let course = require('./routes/courses');
let grade = require('./routes/grades');
let authentification = require('./routes/authentification');
let studentStatsRouter = require('./routes/studentStats');
const adminStatsRouter = require('./routes/adminStats');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);


const uri = 'mongodb+srv://saotrarahajason:SaotraRahajason15@cluster0.dxhunkx.mongodb.net/student-managment?retryWrites=true&w=majority&appName=Cluster0';

const options = {};

mongoose.connect(uri, options)
    .then(() => {
        mongoose.set('debug', true);
        const dbName = mongoose.connection.name;
        console.log("Connexion à la base OK :", dbName);
    })
    .catch(err => {
        console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

app.route(prefix + '/students')
    .get(student.getAll)
    .post(student.create);
app.route(prefix + '/students/:id')
    .put(student.update)
    .delete(student.deleteStudent);

app.route(prefix + '/courses')
    .get(course.getAll)
    .post(course.create);
app.route(prefix + '/courses/:id')
    .put(course.update)
    .delete(course.deleteCourse);

app.route(prefix + '/grades')
    .get(grade.getAll)
    .post(grade.create);
app.route(prefix + '/grades/:id')
    .put(grade.update)
    .delete(grade.deleteGrade);

app.route(prefix + '/auth')
    .post(authentification.insertProfil);

app.route(prefix + '/auth/login')
    .post(authentification.loginUser);

app.route(prefix + '/changepassword')
    .post(authentification.changePassword);

app.use(prefix +'/studentstats', studentStatsRouter);
app.use(prefix +'/adminstats', adminStatsRouter);


// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


