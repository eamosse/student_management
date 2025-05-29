let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    nom: String,
    prenom: String,
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid']
    },
    motDePasse: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters']
    },
    role: { type: String, enum: ['etudiant', 'enseignant', 'admin'], default: 'etudiant' }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('motDePasse')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
        next();
    } catch (err) {
        next(err);
    }
});

let User = mongoose.model('User', userSchema);

module.exports = { User }