module.exports = (sequelize) => {
    const {user, user_read_chapter, chapter, lesson, comments/** , role*/} = sequelize.models;

    user_read_chapter.belongsTo(user);
    
    user_read_chapter.belongsTo(chapter);

    //Create foreign key for the Comments model
    comments.belongsTo(chapter);
    comments.belongsTo(user);

    lesson.belongsTo(user);
    chapter.belongsTo(lesson);

    //role.belongsTo(user);
}