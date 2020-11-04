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
  // Answers.prototype.getAccessedTime=function(surveyId){
  //  return  sequelize.query("select sum(mici) m,sum(medii) me,sum(mari) ma from ("+
  //   "select count(*) as mici,0 as medii,0 as mari from \"Answers\" a"+
  //   "where survey_id='"+surveyId+"'"+
  //  "and accessed::INTEGER < 5"+
  //   "union "+
  //   "select 0 as mici, count(*) as medii,0 as mari from \"Answers\" a"+
  //  "where  survey_id='"+surveyId+"'"+
  //   "and accessed::INTEGER > 5"+
  //   "and accessed::INTEGER < 10 " +
  //   "union "+
  //   "select 0 as mici,0 as medii, count(*) as mari from \"Answers\" a"+
  //   "where survey_id='"+surveyId+"'"+
  //   "and  accessed::INTEGER > 10 ) cr",
  //    { type: sequelize.QueryTypes.SELECT});

  // }
  return Answers;
};