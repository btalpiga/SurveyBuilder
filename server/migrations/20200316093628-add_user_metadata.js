module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'User',
        'metaData',
        {
          type: Sequelize.DataTypes.STRING,
        },
        { transaction }
      );
      // await queryInterface.addIndex(
      //   'Person',
      //   'petName',
      //   {
      //     fields: 'petName',
      //     unique: true,
      //     transaction,
      //   }
      // );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('User', 'metaData', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};