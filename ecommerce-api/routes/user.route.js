const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { User, UserOTP } = require('../models/user.model');
const upload = require('../middlewares/uploads');
const { hashPassword, comparePassword } = require('../utils/password');
const { sendOtpEmailUpdate } = require('../utils/email-service');
const path = require('path');
const { listResponse, clientErrorResponse } = require('../utils/response');
const { verifyToken } = require('../middlewares/auths');
const crypto = require('crypto');
const UserOtp = require('../models/user-otp.model');
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý người dùng
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Trả về danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'full_name', 'phone_number' ,'email', 'is_active', 'last_login', 'is_valid_email', 'role'],
    });
    res.json(listResponse(users, 0, 1, 10));
  } catch (err) {
    console.error('GET /api/users error:', err); // Ghi rõ lỗi ra console
    res.status(500).json({ error: 'Internal error', message: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của người dùng
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      attributes: [
        'id', 'username', 'full_name', 'email', 'phone_number', 'gender', 
        'date_of_birth', 'avatar', 'role', 'is_active', 'is_valid_email', 
        'last_login', 'created_at', 'updated_at'
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    console.error('GET /api/users/:id error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               phone_number:
 *                 type: string
 *                 example: "0987654321"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server nội bộ
 */
router.put('/:id',verifyToken,
  [
    body('full_name').optional().isLength({ min: 3, max: 100 }),
    body('phone_number').optional().matches(/^[0-9]{10,12}$/),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('date_of_birth').optional().isDate(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return res.status(400).json(clientErrorResponse(errors.array())); // Trả về lỗi validation
      }

      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Cập nhật thông tin người dùng
      await user.update(req.body);
      res.json({ 
        message: 'Cập nhật thành công', 
        user 
      });
    } catch (err) {
      console.error('PUT /api/users/:id error:', err);
      res.status(500).json({ error: 'Internal error', message: err.message });
    }
  }
);

/**
 * @swagger
 * /api/users/{id}/avatar:
 *   put:
 *     summary: Cập nhật avatar người dùng
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cập nhật avatar thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.put('/:id/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Lấy đường dẫn của avatar mới
    const avatarPath = path.join('/uploads/media/account', req.file.filename).replace(/\\/g, '/');

    // Cập nhật avatar vào cơ sở dữ liệu
    user.avatar = avatarPath;
    await user.save();

    res.json({
      message: 'Cập nhật avatar thành công',
      avatar: avatarPath
    });
  } catch (err) {
    console.error('Error updating avatar:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}/avatar:
 *   delete:
 *     summary: Xóa avatar người dùng
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa avatar thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id/avatar', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Kiểm tra nếu avatar tồn tại, nếu có thì xóa
    if (user.avatar) {
      const fs = require('fs');
      const avatarPath = path.join(__dirname, '..', user.avatar);

      // Xóa file avatar từ hệ thống file
      fs.unlink(avatarPath, (err) => {
        if (err) {
          console.error('Error deleting avatar file:', err);
          return res.status(500).json({ error: 'Failed to delete avatar file' });
        }
      });

      // Xóa avatar trong cơ sở dữ liệu
      user.avatar = null;
      await user.save();
    }

    res.json({ message: 'Avatar deleted successfully' });
  } catch (err) {
    console.error('Error deleting avatar:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "nguyen.vana"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               full_name:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               email:
 *                 type: string
 *                 example: "nguyen.vana@example.com"
 *               phone_number:
 *                 type: string
 *                 example: "0987654321"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Người dùng được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post('/', verifyToken, [
  body('username').isString().isLength({ min: 3 }),
  body('password').isString().isLength({ min: 5 }),
  body('full_name').optional().isLength({ min: 3, max: 100 }),
  body('email').isEmail(),
  body('phone_number').isString().optional().matches(/^[0-9]{10,12}$/),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('date_of_birth').optional().isDate(),
  body('role').optional().isIn(['user', 'admin']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation error', details: errors.array() });
    }

    const { username, password, full_name, email, phone_number, gender, date_of_birth, role } = req.body;

    // Kiểm tra xem email đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }
        const existingPhoneNumber = await User.findOne({ where: { phone_number } });
    if (existingPhoneNumber) {
      return res.status(400).json({ error: 'Số điện thoại đã tồn tại trong hệ thống' });
    }
        const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      return res.status(400).json({ error: 'Username đã tồn tại trong hệ thống' });
    }
    const hashedPassword = await hashPassword(password);
    // Tạo người dùng mới
    const newUser = await User.create({
      username,
      password: hashedPassword,
      full_name,
      email,
      phone_number,
      gender,
      date_of_birth,
      role: role || 'user', 
    });

    res.status(201).json({
      success: true,
      message: 'Người dùng đã được tạo thành công',
      user: newUser
    });
  } catch (err) {
    console.error('POST /api/users error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xóa người dùng
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Người dùng đã bị xóa thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await UserOTP.destroy({ where: { user_id: userId } });
    await user.destroy();

    res.json({
      message: 'User deleted successfully'
    });
  } catch (err) {
    console.error('DELETE /api/users/:id error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

/**
 * @swagger
 * /api/users/activate/{id}:
 *   put:
 *     summary: Kích hoạt tài khoản người dùng
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của người dùng cần kích hoạt
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tài khoản người dùng đã được kích hoạt thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Tài khoản đã được kích hoạt thành công!'
 *       400:
 *         description: Lỗi khi cập nhật trạng thái tài khoản
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Người dùng không tồn tại!'
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Lỗi hệ thống'
 */
router.put('/activate/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại!' });
    }

    // Cập nhật trạng thái tài khoản thành "đã kích hoạt"
    user.is_active = true;
    await user.save();

    res.status(200).json({success: true, message: 'Tài khoản đã được kích hoạt thành công!' });
  } catch (error) {
    console.error('Lỗi khi kích hoạt tài khoản:', error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
});

router.put('/deactivate/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;

  try {
    // Tìm người dùng theo ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại!' });
    }

    // Kiểm tra nếu tài khoản chưa kích hoạt, không cần ngừng kích hoạt
    if (!user.is_active) {
      return res.status(400).json({ error: 'Tài khoản chưa được kích hoạt' });
    }

    // Cập nhật trạng thái tài khoản thành "không hoạt động"
    user.is_active = false;
    await user.save();

    res.status(200).json({ success: true, message: 'Tài khoản đã được ngừng kích hoạt thành công!' });
  } catch (error) {
    console.error('Lỗi khi ngừng kích hoạt tài khoản:', error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
});

/**
 * @swagger
 * /api/users/{id}/change-email:
 *   put:
 *     summary: Gửi mã OTP để thay đổi email
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               new_email:
 *                 type: string
 *                 format: email
 *                 example: "newemail@example.com"
 *     responses:
 *       200:
 *         description: Mã OTP đã được gửi đến email mới
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi hệ thống
 */
router.put('/:id/change-email', verifyToken, [
  body('new_email').isEmail(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(clientErrorResponse(errors.array()));
    }

    const userId = req.params.id;
    const { new_email } = req.body;

    // Kiểm tra xem email mới có tồn tại trong hệ thống không
    const existingUser = await User.findOne({ where: { email: new_email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email này đã tồn tại trong hệ thống' });
    }

    // Lấy thông tin người dùng
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    // Tạo OTP mới
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
const createdAt = new Date();  // Thời gian tạo OTP
const expiresAt = new Date(createdAt.getTime() + 5 * 60 * 1000); 
console.log('Generated OTP:', otpCode);  // Log OTP
console.log('Expires At:', expiresAt);  // Log thời gian hết hạn
    // Lưu OTP vào cơ sở dữ liệu với type 'change_email'
    await UserOtp.create({
      user_id: user.id,
      otp_code: otpCode,
      expires: expiresAt,
      type: 'change_email',
      created_at: new Date(),
    });

    // Gửi OTP đến email mới
    await sendOtpEmailUpdate(new_email, otpCode);

    // Trả về thông báo thành công
    res.status(200).json({
      message: 'Mã OTP đã được gửi đến email mới. Vui lòng kiểm tra email để xác nhận.',
    });
  } catch (err) {
    console.error('Error sending OTP for email change:', err);
    res.status(500).json({ error: 'Lỗi hệ thống', message: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}/verify-email-change:
 *   put:
 *     summary: Xác nhận thay đổi email bằng OTP
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Cập nhật email thành công
 *       400:
 *         description: Mã OTP không hợp lệ hoặc hết hạn
 *       500:
 *         description: Lỗi hệ thống
 */
router.put('/:id/verify-email-change', verifyToken, async (req, res) => {
  try {
    const { otp, new_email } = req.body;  // Lấy mã OTP và email mới từ request body
    const userId = req.params.id;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findByPk(userId);
    if (!user) {
      console.log(`User with id ${userId} not found`);
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    // Kiểm tra xem email mới đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await User.findOne({ where: { email: new_email } });
    if (existingUser) {
      console.log(`Email ${new_email} already exists in the system`);
      return res.status(400).json({ error: 'Email này đã tồn tại trong hệ thống' });
    }

    // Kiểm tra OTP trong cơ sở dữ liệu
    console.log(`Checking OTP for userId: ${userId}, otp: ${otp}`);
    const otpRecord = await UserOtp.findOne({
      where: { user_id: user.id, otp_code: otp, type: 'change_email' },
    });

    if (!otpRecord) {
      console.log(`OTP not found in DB for userId: ${userId}, otp: ${otp}`);
      return res.status(400).json({ error: 'Mã OTP không hợp lệ' });
    }

    // Kiểm tra nếu email mới không trùng với email hiện tại
    if (user.email === new_email) {
      return res.status(400).json({ error: 'Email mới không được trùng với email hiện tại' });
    }

    // Cập nhật email mới cho người dùng
    console.log(`Updating email for userId: ${userId} to ${new_email}`);
    user.email = new_email;

    // Xóa OTP sau khi xác nhận
    await UserOtp.destroy({ where: { user_id: user.id, otp_code: otp, type: 'change_email' } });

    // Lưu lại thay đổi trong cơ sở dữ liệu
    await user.save();


    console.log(`Email updated successfully for userId: ${userId}`);
    res.status(200).json({
      message: 'Cập nhật email thành công',
      email: new_email,
    });
  } catch (err) {
    console.error('Error verifying OTP for email change:', err);
    res.status(500).json({ error: 'Lỗi hệ thống', message: err.message });
  }
});


router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra nếu email đã tồn tại trong cơ sở dữ liệu
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(200).json({ exists: true });
    }

    return res.status(200).json({ exists: false });

  } catch (err) {
    console.error('Error checking email existence:', err);
    res.status(500).json({ error: 'Lỗi hệ thống', message: err.message });
  }
});

router.put('/:id/change-password', verifyToken, async (req, res) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;
    const userId = req.params.id;

    // Kiểm tra xem mật khẩu mới và mật khẩu xác nhận có trùng nhau không
    if (new_password !== confirm_password) {
      return res.status(400).json({ error: 'Mật khẩu mới và xác nhận mật khẩu không khớp' });
    }

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    // Kiểm tra mật khẩu cũ có chính xác không
    const isMatch = await comparePassword(current_password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mật khẩu cũ không đúng' });
    }

    // Mã hóa mật khẩu mới trước khi lưu vào cơ sở dữ liệu
    const hashedNewPassword = await hashPassword(new_password);

    // Cập nhật mật khẩu mới
    await user.update({ password: hashedNewPassword });

    // Trả về phản hồi thành công
    return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error('Error changing password:', err);
    return res.status(500).json({ error: 'Lỗi hệ thống', message: err.message });
  }
});
module.exports = router;
