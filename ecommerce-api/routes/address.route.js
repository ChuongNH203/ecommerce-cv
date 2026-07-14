const express = require('express');
const router = express.Router();
const { Address } = require('../models/address.model');
const { verifyToken } = require('../middlewares/auths');

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Quản lý địa chỉ của người dùng
 */

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Lấy danh sách địa chỉ của người dùng
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách địa chỉ của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 */
router.get('/', verifyToken, async (req, res) => {
  const user_id = req.userId;

  try {
    const addresses = await Address.findAll({ where: { user_id } });
    return res.json(addresses);
  } catch (err) {
    console.error('[GET /api/addresses ERROR]', err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Thêm một địa chỉ mới
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Địa chỉ đã được thêm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 */
router.post('/', verifyToken, async (req, res) => {
  console.log(req.body); // Kiểm tra dữ liệu đầu vào
  const { full_name, phone_number, street_address, city, district, ward, postal_code, address_type } = req.body;
  const user_id = req.userId;

  try {
    if (!full_name || !phone_number || !street_address || !city || !district || !ward ) {
      return res.status(400).json({ message: 'Các trường không được để trống' });
    }

    const address = await Address.create({
      user_id,
      full_name,
      phone_number,
      street_address,
      city,
      district,
      ward,
      postal_code,
      address_type
    });
    return res.status(201).json(address);
  } catch (err) {
    console.error('[POST /api/addresses ERROR]', err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

/**
 * @swagger
 * /api/addresses/{address_id}:
 *   put:
 *     summary: Cập nhật địa chỉ
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: address_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Địa chỉ đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 */
router.put('/:address_id', verifyToken, async (req, res) => {
  const { address_id } = req.params;
  const { full_name, phone_number, street_address, city, district, ward, postal_code, address_type } = req.body;
  const user_id = req.userId; // Assuming the userId is provided by the token

  try {
    // Find the address for the current user
    const address = await Address.findOne({ where: { id: address_id, user_id } });
    if (!address) return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });

    // Update the address fields
    address.full_name = full_name || address.full_name;
    address.phone_number = phone_number || address.phone_number;
    address.street_address = street_address || address.street_address;
    address.city = city || address.city;
    address.district = district || address.district;
    address.ward = ward || address.ward;
    address.postal_code = postal_code || address.postal_code;
    address.address_type = address_type || address.address_type;

    // Save the updated address
    await address.save();

    return res.json(address); // Return the updated address as response
  } catch (err) {
    console.error('[PUT /api/addresses/{address_id} ERROR]', err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

/**
 * @swagger
 * /api/addresses/{address_id}:
 *   delete:
 *     summary: Xóa địa chỉ
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: address_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã xóa địa chỉ
 */
router.delete('/:address_id', verifyToken, async (req, res) => {
  const { address_id } = req.params;
  const user_id = req.userId;

  try {
    const address = await Address.findOne({ where: { id: address_id, user_id } });
    if (!address) return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });

    await address.destroy();

    return res.json({ message: 'Đã xóa địa chỉ' });
  } catch (err) {
    console.error('[DELETE /api/addresses/{address_id} ERROR]', err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

/**
 * @swagger
 * /api/addresses/set-default/{address_id}:
 *   put:
 *     summary: Đặt một địa chỉ làm mặc định
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []  # Đảm bảo yêu cầu xác thực thông qua Bearer token (JWT)
 *     parameters:
 *       - in: path
 *         name: address_id
 *         required: true
 *         description: ID của địa chỉ cần được thiết lập làm mặc định
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Địa chỉ đã được thiết lập làm mặc định
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Không tìm thấy địa chỉ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Địa chỉ không tìm thấy'
 *       500:
 *         description: Lỗi server khi xử lý yêu cầu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Lỗi server'
 */
// Thiết lập địa chỉ mặc định
router.put('/set-default/:address_id', verifyToken, async (req, res) => {
  const { address_id } = req.params;
  const user_id = req.userId;

  try {
    // Đặt tất cả các địa chỉ của người dùng thành không phải mặc định
    await Address.update({ isDefault: false }, { where: { user_id } });

    // Đặt địa chỉ được chọn thành mặc định
    const address = await Address.findOne({ where: { id: address_id, user_id } });
    if (!address) {
      return res.status(404).json({ message: 'Địa chỉ không tìm thấy' });
    }

    address.isDefault = true;  // Cập nhật địa chỉ được chọn thành mặc định
    await address.save();  // Lưu thông tin cập nhật

    return res.json(address);  // Trả về thông tin địa chỉ đã cập nhật
  } catch (err) {
    console.error('[PUT /api/addresses/set-default ERROR]', err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;
