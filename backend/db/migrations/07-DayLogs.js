// backend/db/07-DayLogs.js
'use strict';

let options = {};
options.tableName = 'DayLogs';
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // schema defined in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(options, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(55),
        allowNull: false
      },
      calories: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      units: {  
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      unitType: {
        //"SERVINGS" when !workoutId
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users' },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      grubId: {
        type: Sequelize.INTEGER,
        references: { model: 'Grubs' },
        allowNull: true
      },
      workoutId: {
        type: Sequelize.INTEGER,
        references: { model: 'Workouts' },
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable(options);
  }
};
