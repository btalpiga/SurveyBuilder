'use strict';
module.exports = (sequelize, DataTypes) => {
  const Surveys = sequelize.define('Surveys', {

    survey_name: DataTypes.STRING,
    survey_desc: DataTypes.STRING,
    form: DataTypes.STRING,   
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    updatedBy: DataTypes.STRING,
    status: DataTypes.STRING,
    flags: DataTypes.STRING
  }, {});
  Surveys.associate = function (models) {
    // associations can be defined here
  };
  return Surveys;
};