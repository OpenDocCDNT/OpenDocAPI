const { SET_DEFERRED } = require("sequelize/types/lib/deferrable");

module.exports = (sequelize) => {
    const {user, user_read_chapter, chapter, lesson} = sequelize.models;

    lesson.belongsTo(user);

    user_read_chapter.belongsTo(user);
    
    chapter.belongsTo(user_read_chapter);

    //Create foreign key for the Comments model
    comments.belongsTo(Chapters);
    comments.belongsTo(user);
}