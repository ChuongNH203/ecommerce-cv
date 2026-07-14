const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Order } = require('./order.model');
const { ProductVariants } = require('./products.model');

const OrderItem = sequelize.define('OrderItem', {
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
  product_variant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'product_variants', key: 'id' }
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false
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
  tableName: 'order_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

OrderItem.belongsTo(ProductVariants, {
  foreignKey: 'product_variant_id',
  as: 'product_variant',
});

module.exports = { OrderItem };
