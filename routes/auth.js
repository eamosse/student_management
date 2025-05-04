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
                    secure: false,
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

function secure(oauth) {
    return (req, res, next) => {
        const request = new Request(req);
        const response = new Response(res);
    
        //authenticate the request based on the token within the request
        oauth
            .authenticate(request, response)
            .then((token) => {
                console.log(token);
                next();
            })
            .catch((err) => {
                res.status(err.code || 500).json(err);
            });
    };
}

module.exports = { getToken, secure };