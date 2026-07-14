const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Products } = require('./products.model');
const { User } = require('./user.model');

const Wishlist = sequelize.define('Wishlist', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'products', key: 'id' }
  },
  variant_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'product_variants', key: 'id' },
  }
}, {
  tableName: 'wishlists',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Wishlist.belongsTo(Products, { foreignKey: 'product_id', as: 'product' });
Wishlist.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { Wishlist };