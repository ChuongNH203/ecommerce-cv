const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserOtp = sequelize.define('UserOtp', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    otp_code: { type: DataTypes.STRING(6), allowNull: false },
    expires: { type: DataTypes.DATE, allowNull: false },
    type: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'forgot_password' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'user_otps',
    timestamps: false,
  });

module.exports = UserOtp;
