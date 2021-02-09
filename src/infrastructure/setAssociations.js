const comments = require("./entities/comments");
const User_Read_Chapters = require("./entities/User_Read_Chapters");

module.exports = (sequelize) => {
    const {user, role_see_category, role_see_sub, user_has_role, category, role, sanction, subcategory} = sequelize.models;

    //Create foreign key for the Sanction model
    sanction.belongsTo(user);

    //Create foreign key for the SubCategory model
    subcategory.belongsTo(category);

    //Create foreign key for the UserHasRole model
    User_Read_Chapters.belongsTo(user);

    //Create foreign key for the RoleSeeCategory model
    role_see_category.belongsTo(category);
    role_see_category.belongsTo(role);

    //Create foreign key for the RoleSeeSub model
    role_see_sub.belongsTo(subcategory);
    role_see_sub.belongsTo(role);

    //Create foreign key for the Comments model
    comments.belongsTo(Chapters);
    comments.belongsTo(user);

}
