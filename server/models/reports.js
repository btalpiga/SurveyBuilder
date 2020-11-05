'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reports = sequelize.define('Reports', {
    survey_id: DataTypes.INTEGER,
    params: DataTypes.STRING,
    generated_links: DataTypes.INTEGER,
    accessed_links: DataTypes.INTEGER,
    survey_finished: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    flags: DataTypes.INTEGER
  }, {});
  Reports.associate = function(models) {
    // associations can be defined here
  };
  return Reports;
};