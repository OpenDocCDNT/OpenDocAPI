const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const homeRoute = require('./src/api/routes/home');
const authentificationRoute = require('./src/api/routes/authentification');
const roleRoute = require('./src/api/routes/role');
const categoryRoute = require('./src/api/routes/category');
const sequelize = require('./src/infrastructure/database');

global.sequelize = sequelize;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use('/', homeRoute);

app.use('/api/authentification', authentificationRoute);

app.use('/api/role', roleRoute);

app.use('/api/category', categoryRoute);

const PORT = config.get('api.port');
app.listen(PORT, () => {
    console.log(`Application is running on port ${PORT}`);
});
