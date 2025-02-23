const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'My API',
        description: 'Description'
    },
    host: 'localhost:3000',
    tags: [
        {
            name: 'Authentication'
        }
    ],
    components: {
        securitySchemes:{
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    }
};

const outputFile = './swagger-output.json';
const routes = ['./routes/auth/index.js'];

swaggerAutogen(outputFile, routes, doc).then(() => {
    require('./server.js'); // Your project's root file
});