
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const connectToDatabase = async () => {
    const uri = "mongodb+srv://Jessy:jessy@cluster0.o8hcjvl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const options = {};

    try {
        await mongoose.connect(uri, options);
        console.log("Connexion à la base OK");
    } catch (err) {
        console.error("Erreur de connexion:", err);
    }
};

module.exports = {
    connectToDatabase
}
