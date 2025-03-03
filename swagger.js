const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'My API',
        description: 'Description'
    },
    host: 'flash-findz-backend.onrender.com',
    tags: [
        {
            name: 'Authentication'
        }
    ],
    components: {
        securitySchemes:{
            bearerAuth: {
                type: 'https',
                scheme: 'bearer'
            }
        }
    }
};

const outputFile = './swagger-output.json';
const routes = ['./routes/user/index.js'];

swaggerAutogen(outputFile, routes, doc).then(() => {
    require('./server.js'); // Your project's root file
});