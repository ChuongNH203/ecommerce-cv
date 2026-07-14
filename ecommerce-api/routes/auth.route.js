const express = require('express');

const { User, UserOTP } = require('../models/user.model');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { decodeToken } = require('../middlewares/auths');
const { sendOtpEmail } = require('../utils/email-service');
const { hashPassword, comparePassword } = require('../utils/password');
const UserOtp = require('../models/user-otp.model');
const { clientErrorResponse } = require('../utils/response');

const { 
    generateAccessToken, 
    generateRefreshToken,
} = require('../middlewares/auths');

const router = express.Router();


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/login', [
  body('username').isLength({ min: 3, max: 50 }),
  body('password').isLength({ min: 3, max: 255 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(clientErrorResponse(errors.array()));
  }

  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(401).json({ error: 'Không tìm thấy người dùng' });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Sai mật khẩu' });
  }

  if (user.is_active !== true) {
    return res.status(401).json({ error: 'Tài khoản đã bị khóa' });
  }

  if (user) {
    let accessToken = null;
    let refreshToken = null;
    if (user.is_valid_email === true) {
      accessToken = await generateAccessToken(user.id, user.role);  
      refreshToken = await generateRefreshToken(user.username);
    } else {
      accessToken = await generateAccessToken(user.id, 'user'); 
      refreshToken = null;
    }


    return res.status(200).json({
      message: 'Login successful',
      result: {
        access: accessToken,
        refresh: refreshToken,
        role: user.role,  
      }
    });
  }
  return res.status(400).json({ error: 'Authenticate failed' });
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email 
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email: 
 *                 type: string  
 *                 format: email
 *     responses:
 *       200:
 *         description: Tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/register', [
  body('full_name').isLength({ min: 3, max: 50 }),
  body('username').isLength({ min: 3, max: 50 }),
  body('password').isLength({ min: 3, max: 255 }),
  body('email').isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(clientErrorResponse(errors.array()));
  }

  try {
    const { full_name, username, password: rawPassword, email } = req.body;

  // Kiểm tra username hoặc email đã tồn tại
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [
        { username },
        { email }
      ]
    }
  });

  if (existingUser) {
    let message = '';
    if (existingUser.username === username) message = 'Username already exists';
    if (existingUser.email === email) message = 'Email already exists';
    if (existingUser.username === username && existingUser.email === email) message = 'Username and Email already exist';

    return res.status(400).json({ error: message });
  }

    const hashedPassword = await hashPassword(rawPassword);

    // Tạo user chưa kích hoạt email
    const newUser = await User.create({
      full_name,
      username,
      password: hashedPassword,
      email,
      is_active: false,
      is_valid_email: false,
    });

    // Tạo OTP ngẫu nhiên 6 số
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Thời gian hết hạn 5 phút
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Lưu OTP vào DB
    await UserOtp.create({
      user_id: newUser.id,
      otp_code: otpCode,
      expires: expiresAt,
      type: 'verify_email',
    });

    // Gửi mail OTP
    await sendOtpEmail(email, otpCode);

    // Tạo token access (chưa xác thực OTP)
    const accessToken = await generateAccessToken(newUser.id, false);
    const refreshToken = await generateRefreshToken(newUser.username);

    return res.status(200).json({
      message: 'Register successful. Please verify your email with the OTP sent.',
      result: { access: accessToken, refresh: refreshToken },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: 'Register failed', detail: err.message });
  }
});

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/verify-otp', async (req, res) => {
    try {
      const state = decodeToken(req);
      if (!state) {
        return res.status(401).json({ error: 'Token không hợp lệ' });
      }
  
      const userId = state.userId;
      const otpInput = req.body.otp;
  
      const otpRecord = await UserOTP.findOne({
        where: { user_id: userId, otp_code: otpInput, type: 'verify_email' }
      });
  
      if (!otpRecord) {
        return res.status(401).json({ error: 'Mã OTP không hợp lệ' });
      }
  
      const user = await User.findOne({ where: { id: userId } });
      await user.update({ is_valid_email: true });
      await user.update({ is_active: true });
  
      const accessToken = await generateAccessToken(user.id, true);
      const refreshToken = await generateRefreshToken(user.username);
  
      return res.status(200).json({
        message: 'Xác thực thành công',
        result: { access: accessToken, refresh: refreshToken }
      });
  
    } catch (err) {
      console.error("Lỗi xác thực OTP:", err);
      return res.status(500).json({ error: 'Lỗi server', detail: err.message });
    }
  });

router.post('/verify-forgot-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email và mã OTP là bắt buộc" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Không tìm thấy người dùng" });

    const otpRecord = await UserOTP.findOne({
      where: {
        user_id: user.id,
        otp_code: otp,
        type: 'forgot_password',
      },
    });
    if (!otpRecord) {
      return res.status(400).json({ error: "Mã OTP không hợp lệ hoặc đã hết hạn" });
    }

    return res.status(200).json({ message: "Xác minh OTP thành công" });
  } catch (err) {
  console.error("Lỗi xác minh forgot OTP:", err);
  console.log("Request body nhận được:", req.body);
  res.status(500).json({ error: "Lỗi server", detail: err.message });
}
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Gửi mã OTP để đặt lại mật khẩu
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Email người dùng cần đặt lại mật khẩu
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Mã OTP đã được gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mã OTP đã được gửi tới email của bạn.
 *       400:
 *         description: Thiếu email hoặc email không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Email không tồn tại trong hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email là bắt buộc" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Email không tồn tại" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    // Cập nhật hoặc tạo OTP với type = 'forgot_password'
    await UserOTP.upsert({
      user_id: user.id,
      otp_code: otpCode,
      expires: expiresAt,
      type: 'forgot_password', // Thêm trường type
    }, { where: { user_id: user.id, type: 'forgot_password' } });

    await sendOtpEmail(email, otpCode);

    res.status(200).json({ message: "Mã OTP đã được gửi tới email của bạn." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu sau khi xác thực OTP thành công
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Nhập email và mật khẩu mới để đặt lại sau khi đã xác thực OTP
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đổi mật khẩu thành công
 *       400:
 *         description: Thiếu dữ liệu bắt buộc
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Email không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Email không tồn tại" });

    const hashedPassword = await hashPassword(newPassword);
    await user.update({ password: hashedPassword });

    // Xoá tất cả OTP forgot_password nếu còn sót
    await UserOTP.destroy({ where: { user_id: user.id, type: 'forgot_password' } });

    return res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
});
module.exports = router;