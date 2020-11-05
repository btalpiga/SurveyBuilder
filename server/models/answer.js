'use strict';
module.exports = (sequelize, DataTypes) => {
  const Answers = sequelize.define('Answers', {
    survey_id:DataTypes.STRING
    ,
    consumer_id: DataTypes.STRING
    ,
    answer:DataTypes.STRING
    ,
    progress:DataTypes.STRING
    ,
    accessed:DataTypes.STRING
    ,
    createdAt:DataTypes.DATE
    ,
    updatedAt:DataTypes.DATE
    ,
    flags: DataTypes.STRING
  }, {});
  Answers.associate = function (models) {
    // associations can be defined here
  };
  return Answers;
};