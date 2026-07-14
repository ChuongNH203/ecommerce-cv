const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SpecTemplate = sequelize.define('SpecTemplate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
  spec_name: { type: DataTypes.STRING, allowNull: false },
  spec_group: { type: DataTypes.STRING, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'spec_templates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = { SpecTemplate };