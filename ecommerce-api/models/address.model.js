const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User } = require('./user.model');

const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ward: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postal_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address_type: {
    type: DataTypes.ENUM('office', 'home'),
    allowNull: false,
    defaultValue: 'home',
  },
  isDefault: {  // Add this field to mark the default address
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,  // Default to false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'addresses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Address.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { Address };
