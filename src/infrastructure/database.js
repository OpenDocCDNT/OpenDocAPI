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
    require('./entities/Category'),
    require('./entities/Role'),
    require('./entities/RoleSeeCategory'),
    require('./entities/RoleSeeSub'),
    require('./entities/Sanction'),
    require('./entities/SubCategory'),
    require('./entities/User'),
    require('./entities/UserHasRole'),
];

for (const modelToDefine of modelsToDefine) {
    modelToDefine(sequelize);
}

setAssociations(sequelize);

initializeDatabase(sequelize);

module.exports = sequelize;
