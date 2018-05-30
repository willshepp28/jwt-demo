/*
 |--------------------------------------------------------------------------
 | Require Dependencies
 |--------------------------------------------------------------------------
 */
// const dotenv = require('dotenv');
// dotenv.config();

const express = require('express'),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    cors = require('cors'),
    port = process.env.PORT || 8000;
application = express();


/*
|--------------------------------------------------------------------------
|  Middleware
|--------------------------------------------------------------------------
*/

// application.use(morgan('dev'));
// application.use(morgan('combined'))


// parse application/x-www-form-urlencoded
application.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
application.use(bodyParser.json());



// Express will allow requests from port 8080
// 8080 needs access to our json data
application.use(cors({
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}));










/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
application.get('/api', (request, response) => {
    response.json({
        message: 'Welcome to the API'
    })
});


application.post('/api/posts', verifyToken, (request, response) => {

    jwt.verify(request.token, 'secretKey', (err, authData) => {
        if (err) {
            response.sendStatus(403)
        } else {

            response.json({
                message: 'Post created....',
                authData
            });

        }
    })

});


application.post('/api/login', (request, response) => {

    // Mock user
    const user = {
        id: 1,
        username: 'will',
        email: 'will@yahoo.com'
    }

    jwt.sign({ user: user }, 'secretKey', { expiresIn: '30s'}, (err, token) => {
        response.json({
            token
        })
    })
})


/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/
// Format of token

function verifyToken(request, response, next) {
    // Get auth header value
    const bearerHeader = request.headers['authorization'];

    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {

        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        request.token = bearerToken;
        next();

    } else {
        // Forbidden
        response.sendStatus(403);
    }
}


application.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
