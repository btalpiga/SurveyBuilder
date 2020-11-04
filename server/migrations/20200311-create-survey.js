'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Surveys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      survey_name: {
        type: Sequelize.STRING
      },
      survey_desc: {
        type: Sequelize.STRING
      },
      form: {
        type: Sequelize.STRING
      },
      start_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      end_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedBy: { 
        allowNull: true,
        type: Sequelize.STRING
      },
      flags: {
        allowNull: true,
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Surveys');
  }
};