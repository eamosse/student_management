let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let config = require('../config/database')
let cors = require('../config/cors')
let api_router = require("../routes/router")

 function setupServer () {
   
     config.connectToDatabase()
    // Pour accepter les connexions cross-domain (CORS)
    app.use(cors.config);
    // Pour les formulaires
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    
    let port = 8010;
    const prefix = '/api';
    app.use(prefix, api_router);
     // On démarre le serveur
    app.listen(port, "0.0.0.0");
    console.log('Serveur démarré sur http://localhost:' + port);
 }


module.exports =  {setupServer};


