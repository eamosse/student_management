let OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

function getToken(oauth) {
    return (req, res, next) => {
        const requ = new Request(req);
        const resp = new Response(res);

        //generate the token
        oauth
            .token(requ, resp)
            .then(token => {
                res.cookie('token', token.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 3600000
                });
                res.json({ 'statusCode': 200, user: token.user });
            })
            .catch(err => {
                res.status(err.code || 500).json(err);
            });
    }
}

function secure(oauth, rolesNotAllowed = ['etudiant']) {
    return (req, res, next) => {
        if (req.cookies && req.cookies.token) {
            req.headers.Authorization = 'Bearer ' + req.cookies.token;
        }

        const request = new Request(req);
        const response = new Response(res);

        //authenticate the request based on the token within the request
        oauth
            .authenticate(request, response)
            .then((token) => {
                console.log(rolesNotAllowed);
                if (rolesNotAllowed.includes(token.user.role)) {
                    return res.status(403).json({ message: `Forbidden: ${rolesNotAllowed} not allowed` });
                }

                next();
            })
            .catch((err) => {
                res.status(err.code || 500).json(err);
            });
    };
}

function logout(req, res, next) {
    res.clearCookie('token', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.status(200).json({ message: 'Logged out' });
}

module.exports = { getToken, secure, logout };