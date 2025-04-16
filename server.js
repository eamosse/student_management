let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let student = require('./routes/students');
let course = require('./routes/courses');
let grade = require('./routes/grades');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// TODO remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud
const uri = 'mongodb+srv://user-admin:Mot2passe@uploaderdb.npsgo8p.mongodb.net/?retryWrites=true&w=majority&appName=uploaderDB';
// const uri = "mongodb://127.0.0.1/"
const options = {
    dbName: "studentManagement"
};

mongoose.connect(uri, options)
    .then(() => {
            console.log("Connexion à la base OK");
        },
        err => {
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
    .get(student.getById)
    .put(student.update)
    .delete(student.deleteStudent)

app.route(prefix + '/courses')
    .get(course.getAll)
    .post(course.create);

app.route(prefix + '/courses/:id')
    .get(course.getById)
    .put(course.update)
    .delete(course.deleteCourse)

app.route(prefix + '/grades')
    .get(grade.getAll)
    .post(grade.create);

app.route(prefix + '/grades/:id')
    .get(grade.getById)
    .put(grade.update)
    .delete(grade.deleteGrade)


app.route(prefix + '/course/pagination')
    .get(course.getPagination);

app.route(prefix + '/student/pagination')
    .get(student.getPagination);
    
app.route(prefix + '/grade/pagination')
    .get(grade.getPagination);

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


