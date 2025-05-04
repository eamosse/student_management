const bcrypt = require('bcrypt');
let { User } = require('../model/userSchema');
const model = {};

const clients = [
    {
        clientId: 'client-id',
        clientSecret: 'client-secret',
        grants: ['password', 'refresh_token'],
    },
];

const tokens = [];

model.getClient = (clientId, clientSecret) => {
    return clients.find(client => client.clientId === clientId && client.clientSecret === clientSecret);
};

model.saveToken = (token, client, user) => {
    const sanitizedUser = {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
    };

    token.client = client;
    token.user = sanitizedUser;
    tokens.push(token);
    return token;
};

model.getAccessToken = (accessToken) => {
    return tokens.find(token => token.accessToken === accessToken);
};

model.getRefreshToken = refreshToken => {
    return tokens.find(token => token.refreshToken === refreshToken);
};

model.revokeToken = token => {
    const index = tokens.findIndex(t => t.refreshToken === token.refreshToken);
    if (index !== -1) {
        tokens.splice(index, 1);
        return true;
    }
    return false;
};

model.getUser = async (username, password) => {
    let user = await User.findOne({ email: username });
    const matching = await bcrypt.compare(password, user.motDePasse);
    return matching ? user : null;
};

model.verifyScope = (token, scope) => {
    return true;
};

module.exports = model;