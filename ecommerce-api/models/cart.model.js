const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Products } = require('./products.model');
const { User } = require('./user.model');

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
}, {
  tableName: 'carts',
  timestamps: true,
  createdAt: 'created_at',   
  updatedAt: 'updated_at'
});

const CartItem = sequelize.define('CartItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'carts', key: 'id' }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'products', key: 'id' }
  },
  variant_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
}, {
  tableName: 'cart_items',
  timestamps: true,
  createdAt: 'created_at',   
  updatedAt: 'updated_at'
});

Cart.belongsTo(User, { foreignKey: 'user_id' });
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
CartItem.belongsTo(Products, { foreignKey: 'product_id', as: 'product' });

module.exports = { Cart, CartItem };
