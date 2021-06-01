const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const homeRoute = require('./src/api/routes/home');
const roleRoute = require('./src/api/routes/role');
const categoryRoute = require('./src/api/routes/category');
const sequelize = require('./src/infrastructure/database');
const lessonRoute = require('./src/api/routes/lesson');
const authentificationRoute = require('./src/api/routes/authentification');
const chapterRoute = require('./src/api/routes/chapter');



global.sequelize = sequelize;


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', homeRoute);

app.use('/api/auth', authentificationRoute);

app.use('/api/lesson', lessonRoute);

app.use('/api/role', roleRoute);

app.use('/api/category', categoryRoute);

app.use('/api/chapter', chapterRoute);

const PORT = config.get('api.port');
app.listen(PORT, () => {
    console.log(`Application is running on port ${PORT}`);
});
