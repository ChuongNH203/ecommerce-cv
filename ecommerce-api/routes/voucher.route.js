const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const { Voucher } = require('../models/voucher.model');
const { verifyToken } = require('../middlewares/auths');

/**
 * @swagger
 * /api/vouchers:
 *   post:
 *     summary: Tạo một voucher mới
 *     tags: [Voucher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               discount_amount:
 *                 type: number
 *               discount_percentage:
 *                 type: number
 *               valid_from:
 *                 type: string
 *                 format: date
 *               valid_until:
 *                 type: string
 *                 format: date
 *               usage_limit:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Voucher đã được tạo
 */
router.post('/', verifyToken, async (req, res) => {
  const { code, discount_amount, discount_percentage, valid_from, valid_until, usage_limit, is_active } = req.body;

  try {
    const existingVoucher = await Voucher.findOne({ where: { code } });
    if (existingVoucher) {
      return res.status(400).json({ message: 'Voucher đã tồn tại' });
    }

    if ((discount_amount === 0 && discount_percentage === 0) || (!discount_amount && !discount_percentage)) {
      return res.status(400).json({ message: 'Voucher phải có giá trị giảm giá' });
    }

    if (new Date(valid_from) >= new Date(valid_until)) {
      return res.status(400).json({ message: 'Ngày bắt đầu phải nhỏ hơn ngày hết hạn' });
    }

    if (usage_limit <= 0) {
      return res.status(400).json({ message: 'Giới hạn sử dụng phải là số dương' });
    }

    const voucher = await Voucher.create({
      code,
      discount_amount,
      discount_percentage,
      valid_from,
      valid_until,
      usage_limit,
      is_active
    });

    res.status(201).json(voucher);
  } catch (err) {
    console.error('[POST /api/vouchers ERROR]', err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

/**
 * @swagger
 * /api/vouchers/{code}:
 *   get:
 *     summary: Lấy voucher theo mã code
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về voucher
 *       404:
 *         description: Voucher không tồn tại hoặc không còn hiệu lực
 */
router.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    // Lấy voucher từ mã code và kiểm tra tính hợp lệ
    const voucher = await Voucher.findOne({ 
      where: { 
        code, 
        is_active: true, 
        valid_until: { 
          [Op.gte]: new Date()  // Kiểm tra ngày hết hạn voucher
        }
      } 
    });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher không tồn tại hoặc đã hết hạn' });
    }

    return res.json(voucher);
  } catch (err) {
    console.error('[GET /api/vouchers/{code} ERROR]', err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

/**
 * @swagger
 * /api/vouchers:
 *   get:
 *     summary: Lấy danh sách tất cả các voucher
 *     tags: [Voucher]
 *     responses:
 *       200:
 *         description: Trả về danh sách voucher
 *       500:
 *         description: Lỗi server
 */
router.get('/', async (req, res) => {
  try {
    const vouchers = await Voucher.findAll();

    if (vouchers.length === 0) {
      return res.status(404).json({ message: 'Không có voucher nào' });
    }

    return res.json(vouchers);
  } catch (err) {
    console.error('[GET /api/vouchers ERROR]', err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

/**
 * @swagger
 * /api/vouchers/{code}:
 *   delete:
 *     summary: Xóa voucher theo mã code
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voucher đã được xóa thành công
 *       404:
 *         description: Voucher không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.delete('/:code', verifyToken, async (req, res) => {
  const { code } = req.params;

  try {
    const voucher = await Voucher.findOne({ where: { code } });
    
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher không tồn tại' });
    }

    // Xóa voucher
    await voucher.destroy();

    return res.status(200).json({success: true, message: 'Voucher đã được xóa thành công' });
  } catch (err) {
    console.error('[DELETE /api/vouchers/{code} ERROR]', err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

/**
 * @swagger
 * /api/vouchers/activate/{code}:
 *   put:
 *     summary: Kích hoạt voucher theo mã code
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voucher đã được kích hoạt thành công
 *       404:
 *         description: Voucher không tồn tại hoặc đã hết hạn
 *       500:
 *         description: Lỗi server
 */
router.put('/activate/:code', async (req, res) => {
  const { code } = req.params;

  try {
    // Tìm voucher theo mã code
    const voucher = await Voucher.findOne({ where: { code } });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher không tồn tại' });
    }

    // Kiểm tra nếu voucher đã hoạt động rồi, không cần kích hoạt lại
    if (voucher.is_active) {
      return res.status(400).json({ message: 'Voucher đã được kích hoạt' });
    }

    // Cập nhật trạng thái voucher thành 'active'
    voucher.is_active = true;
    await voucher.save();

    return res.status(200).json({success: true, message: 'Voucher đã được kích hoạt thành công' });
  } catch (error) {
    console.error('[PUT /api/vouchers/activate ERROR]', error);
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

router.put('/deactivate/:code', async (req, res) => {
  const { code } = req.params;

  try {
    // Tìm voucher theo mã code
    const voucher = await Voucher.findOne({ where: { code } });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher không tồn tại' });
    }

    // Kiểm tra nếu voucher chưa kích hoạt, không cần ngừng kích hoạt
    if (!voucher.is_active) {
      return res.status(400).json({ message: 'Voucher chưa được kích hoạt' });
    }

    // Cập nhật trạng thái voucher thành 'inactive'
    voucher.is_active = false;
    await voucher.save();

    return res.status(200).json({ success: true, message: 'Voucher đã được ngừng kích hoạt thành công' });
  } catch (error) {
    console.error('[PUT /api/vouchers/deactivate ERROR]', error);
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});
module.exports = router;
