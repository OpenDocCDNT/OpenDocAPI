module.exports = (sequelize) => {
    const {user, user_read_chapter, chapter, lesson} = sequelize.models;

    lesson.belongsTo(user);

    user_read_chapter.belongsTo(user);
    
    chapter.belongsTo(user_read_chapter);

    chapter.belongsTo(lesson);

}
