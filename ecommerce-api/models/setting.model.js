const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Settings = sequelize.define('Settings', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'settings',
  timestamps: false
});

module.exports = Settings;