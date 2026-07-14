const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


exports.User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            len: [3, 50]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING,
        maxLength: 100,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone_number: { // Số điện thoại
        type: DataTypes.STRING,
        allowNull: true, // Có thể không bắt buộc
        unique: true, // Thường là duy nhất
        validate: {
            is: /^[0-9]{10,12}$/ // Ví dụ regex cho số điện thoại 10-11 chữ số
        }
    },
    gender: { // Giới tính
        type: DataTypes.ENUM('male', 'female', 'other'), // Hoặc 'Nam', 'Nữ', 'Khác'
        allowNull: true
    },
    date_of_birth: { // Ngày sinh
        type: DataTypes.DATEONLY, // Chỉ lưu ngày, không giờ
        allowNull: true
    },
    role: { // Thêm trường role
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',  // Mặc định là 'user'
        validate: {
            isIn: [['user', 'admin']]  // Giới hạn giá trị là 'user' hoặc 'admin'
        }
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_valid_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
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
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});


exports.UserOTP = sequelize.define('UserOTP', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    otp_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'verify_email',  
        comment: 'Loại OTP (verify_email, forgot_password, ...)'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    expires: {
        type: DataTypes.SMALLINT,
        defaultValue: 120,
        allowNull: false
    },
    
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'user_otps',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
