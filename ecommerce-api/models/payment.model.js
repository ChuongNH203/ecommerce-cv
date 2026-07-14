const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Order } = require('./order.model');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'orders', key: 'id' }
  },
  momo_order_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payment_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending' // Trạng thái thanh toán: 'Pending', 'Completed', 'Failed'
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Quan hệ giữa các bảng
Payment.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = { Payment };
