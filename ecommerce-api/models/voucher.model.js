const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Voucher = sequelize.define('Voucher', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  discount_amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  discount_percentage: {
    type: DataTypes.FLOAT,
    allowNull: true // Giảm giá theo phần trăm
  },
  valid_from: {
    type: DataTypes.DATE,
    allowNull: false
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: false
  },
  usage_limit: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  usage_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  tableName: 'vouchers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = { Voucher };
