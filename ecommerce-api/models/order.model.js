const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User } = require('./user.model');
const { Address } = require('./address.model');
const { Voucher } = require('./voucher.model');
const { OrderItem } = require('./order-item');

const Order = sequelize.define('Order', {
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
  shipping_address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'addresses', key: 'id' }
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shipping_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  voucher_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'vouchers', key: 'id' }
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  order_status: {
    type: DataTypes.ENUM('Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Pending'
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
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Mối quan hệ với User và Address
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.belongsTo(Address, { foreignKey: 'shipping_address_id' });
Order.belongsTo(Voucher, { foreignKey: 'voucher_id' });
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'orderItems'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});

module.exports = { Order };
