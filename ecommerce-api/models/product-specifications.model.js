const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { ProductVariants } = require('./products.model');

const ProductSpecifications = sequelize.define('ProductSpecifications', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  variant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'product_variants', key: 'id' } // Liên kết với product_variants
  },
  spec_name: { type: DataTypes.STRING, allowNull: false },
  spec_value: { type: DataTypes.STRING, allowNull: true },
  spec_group: { type: DataTypes.STRING, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'product_specifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});



module.exports = { ProductSpecifications };
