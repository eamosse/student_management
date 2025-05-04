let { User } = require('../model/userSchema');

async function createDefaultUser() {
    let email = 'admin@gmail.com';
    const user = await User.findOne({ email: email });
    if (user) {
        console.log('Default admin user already created')
        return;
    }

    await User.create({
        nom: 'admin',
        prenom: 'admin',
        email: email, 
        motDePasse: '12345678',
        role: 'admin'
    });
    console.log('Default admin user created');
}

module.exports = { createDefaultUser }