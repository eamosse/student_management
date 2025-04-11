let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let student = require('./routes/students');
let course = require('./routes/courses');
let grade = require('./routes/grades');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);


const uri = 'mongodb+srv://saotrarahajason:SaotraRahajason15@cluster0.dxhunkx.mongodb.net/student-managment?retryWrites=true&w=majority&appName=Cluster0';

const options = {};

mongoose.connect(uri, options)
    .then(() => {
        console.log("✅ Connexion à la base OK");

        // Activer les logs des requêtes MongoDB
        mongoose.set('debug', true);

        // Afficher le nom de la base utilisée
        const dbName = mongoose.connection.name;
        console.log("📂 Base de données utilisée :", dbName);
    })
    .catch(err => {
        console.log('❌ Erreur de connexion: ', err);
    });

/*mongoose.connect(uri, options)
    .then(() => {
            console.log("Connexion à la base OK");
        },
        err => {
            console.log('Erreur de connexion: ', err);
        });
*/
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
    .post(student.create)
    .put(student.update)
    .delete(student.deleteStudent);

app.route(prefix + '/courses')
    .get(course.getAll)
    .post(course.create)
    .put(course.update)
    .delete(course.deleteCourse);

app.route(prefix + '/grades')
    .get(grade.getAll)
    .post(grade.create)
    .put(grade.update)
    .delete(grade.deleteGrade);


// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


