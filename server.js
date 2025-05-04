let express = require('express');
let cors = require('cors');
let app = express();
let bodyParser = require('body-parser');
let userHelper = require('./helper/userHelper');
let OAuth2Server = require('oauth2-server');

let oauth = require('./routes/auth');
let student = require('./routes/students');
let course = require('./routes/courses');
let grade = require('./routes/grades');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// TODO remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud
const uri = 'mongodb+srv://sarobidy:NSXeIUL9vtaUMpyy@cluster0.ypcx6va.mongodb.net/ecole?retryWrites=true&w=majority';

const options = {};

mongoose.connect(uri, options)
    .then(() => {
            console.log("Connexion à la base OK");
            userHelper.createDefaultUser();
        },
        err => {
            console.log('Erreur de connexion: ', err);
        });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Pour les formulaires
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

//initialize the oauth server with a model representing the user principle
//the model servers as the entity to query users from databases or LDAP or Active Directory
let oauthServer = new OAuth2Server({
    model: require('./model/auth-model'),
    allowBearerTokensInQueryString: true
});

app.route('/oauth/login')
    .post(oauth.getToken(oauthServer));
// app.use('/api', oauth.secure(oauthServer));

// les routes
const prefix = '/api';

app.route(prefix + '/students')
    .get(student.getAll)
    .post(oauth.secure(oauthServer), student.create);

app.route(prefix + '/courses')
    .get(course.getAll)
    .post(course.create);

app.route(prefix + '/grades')
    .get(grade.getAll)
    .post(grade.create);
app.route(prefix + '/grades/:id')
    .put(grade.edit)
    .delete(grade.deleteById)

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


