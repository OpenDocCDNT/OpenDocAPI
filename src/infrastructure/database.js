const config = require('config');
const Sequelize = require('sequelize');
const setAssociations = require('./setAssociations');
const initializeDatabase = require('./initializeDatabase');


const sequelize = new Sequelize(
    {
        database: config.get('development.database'),
        dialect: config.get('development.dialect'),
        host: config.get('development.host'),
        username: config.get('development.username'),
        password: config.get('development.password')
    }
);

const modelsToDefine = [
    require('./entities/Chapter'),
    require('./entities/Role'),
    require('./entities/Comments'),
    require('./entities/Lesson'),
    require('./entities/User_Read_Chapter'),
    require('./entities/User')
];

for (const modelToDefine of modelsToDefine) {
    modelToDefine(sequelize);
}

setAssociations(sequelize);

initializeDatabase(sequelize);

module.exports = sequelize;
