module.exports = (sequelize) => {
    const {user, role_see_category, role_see_sub, user_has_role, category, role, sanction, subcategory} = sequelize.models;

    //Create foreign key for the Sanction model
    sanction.belongsTo(user);

    //Create foreign key for the SubCategory model
    subcategory.belongsTo(category);

    //Create foreign key for the UserHasRole model
    user_has_role.belongsTo(user);
    user_has_role.belongsTo(role);

    //Create foreign key for the RoleSeeCategory model
    role_see_category.belongsTo(category);
    role_see_category.belongsTo(role);

    //Create foreign key for the RoleSeeSub model
    role_see_sub.belongsTo(subcategory);
    role_see_sub.belongsTo(role);


}
