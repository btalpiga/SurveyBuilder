# Secure Node.js, Express.js and PostgreSQL API using Passport.js

This source code is part of [Secure Node.js, Express.js and PostgreSQL API using Passport.js]



'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      survey_id: {
        type: Sequelize.INTEGER
      },
      params: {
        type: Sequelize.STRING
      },
      generated_links: {
        type: Sequelize.INTEGER
      },
      accessed_links: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      survey_finished: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      flags: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Reports');
  }
};


