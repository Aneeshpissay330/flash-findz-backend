const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json'); // Auto-generated file

const userRoutes = require('./routes/user');

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(cors());

connectDB();

// Routes
app.use('/api/user', userRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
