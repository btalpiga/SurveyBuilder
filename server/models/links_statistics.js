'use strict';
module.exports = (sequelize, DataTypes) => {
  const links_statistics = sequelize.define('links_statistics', {
    survey_id: DataTypes.INTEGER,
    consumer_id: DataTypes.STRING,
    trigger_event_id: DataTypes.STRING,
    link: DataTypes.STRING,
    short_url: DataTypes.STRING,
    params: DataTypes.STRING,
    progress: DataTypes.INTEGER,
    accessed: DataTypes.INTEGER,
    sub_campaign_id: DataTypes.STRING,
    date_created: DataTypes.DATE,
    date_updated: DataTypes.DATE,
    flags: DataTypes.INTEGER,
    createdAt:DataTypes.DATE
    ,
    updatedAt:DataTypes.DATE
  }, {});
  links_statistics.associate = function(models) {
    // associations can be defined here
  };
  return links_statistics;
};