const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Products } = require('./products.model');
const { ProductVariants } = require('./products.model');
const { User } = require('./user.model');
const { Order } = require('./order.model');

// Định nghĩa model ProductReviews
const ProductReviews = sequelize.define('ProductReviews', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },

    rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    images: { // Lưu dưới dạng chuỗi (URL ảnh)
        type: DataTypes.STRING,
        allowNull: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    variant_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'product_variants',
            key: 'id'
        }
    },
    order_id: {  // Thêm trường order_id để liên kết với đơn hàng
        type: DataTypes.INTEGER,
        allowNull: false, // Cần phải có order_id khi thêm đánh giá
        references: {
            model: 'orders',  // Giả sử có bảng orders
            key: 'id'
        }
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
    tableName: 'product_reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Mối quan hệ giữa Products và ProductReviews
Products.hasMany(ProductReviews, {
  foreignKey: 'product_id',
  as: 'reviews'  // alias cho quan hệ này
});
ProductReviews.belongsTo(Products, {
  foreignKey: 'product_id',
  as: 'productDetail'  // alias cho quan hệ này
});

// Mối quan hệ giữa ProductVariants và ProductReviews
ProductVariants.hasMany(ProductReviews, {
  foreignKey: 'variant_id',
  as: 'reviews'  // alias cho quan hệ này
});
ProductReviews.belongsTo(ProductVariants, {
  foreignKey: 'variant_id',
  as: 'variantDetail'  // alias cho quan hệ này
});

// Mối quan hệ giữa User và ProductReviews
User.hasMany(ProductReviews, {
  foreignKey: 'user_id',
  as: 'reviews'  // alias cho quan hệ này
});
ProductReviews.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'userDetail'  // alias cho quan hệ này
});

Order.hasMany(ProductReviews, {
  foreignKey: 'order_id',
  as: 'reviews'  // alias cho quan hệ này
});
ProductReviews.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'orderDetail'  // alias cho quan hệ này
});

module.exports = { ProductReviews };
