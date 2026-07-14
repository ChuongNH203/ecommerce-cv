const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Categories } = require('./categories.model');
const { ProductSpecifications } = require('./product-specifications.model');

// Định nghĩa mô hình Product
const Products = sequelize.define('Products', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'categories', key: 'id' }
  },
  discount_percentage: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  brand: { type: DataTypes.STRING, allowNull: true },
  thumbnail: { type: DataTypes.STRING(500), allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Định nghĩa mối quan hệ Product và ProductImages
const ProductImages = sequelize.define('ProductImages', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'products', key: 'id' }
  },
  image_url: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'product_images',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Định nghĩa mối quan hệ Product và ProductVariants
const ProductVariants = sequelize.define('ProductVariants', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'products', key: 'id' }
  },
  variant_name: { type: DataTypes.STRING, allowNull: false },
  color: { type: DataTypes.STRING, allowNull: true },
  size: { type: DataTypes.STRING, allowNull: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  stock: { type: DataTypes.INTEGER, allowNull: true },
  sku: { type: DataTypes.STRING(100), allowNull: true },
  weight: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  dimensions: { type: DataTypes.JSON, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'product_variants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Xây dựng các mối quan hệ giữa các bảng và thêm cascade delete
Products.hasMany(ProductImages, { foreignKey: 'product_id', as: 'images', onDelete: 'CASCADE' });
ProductImages.belongsTo(Products, { foreignKey: 'product_id' });

Products.hasMany(ProductVariants, { foreignKey: 'product_id', as: 'variants', onDelete: 'CASCADE' });
ProductVariants.belongsTo(Products, { foreignKey: 'product_id',as: 'Product' });

ProductVariants.hasMany(ProductSpecifications, { foreignKey: 'variant_id', as: 'specifications', onDelete: 'CASCADE' });
ProductSpecifications.belongsTo(ProductVariants, { foreignKey: 'variant_id', as: 'variantDetail' });

Products.belongsTo(Categories, { foreignKey: 'category_id', as: 'categoryDetail' });
Categories.hasMany(Products, { foreignKey: 'category_id', as: 'products' });

module.exports = { Products, ProductImages, ProductVariants };
