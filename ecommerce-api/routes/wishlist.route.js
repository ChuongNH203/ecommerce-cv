const express = require('express');
const router = express.Router();
const { Wishlist } = require('../models/wishlist.model');
const { Products, ProductVariants, ProductImages } = require('../models/products.model');
const { verifyToken } = require('../middlewares/auths');

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Quản lý danh sách yêu thích của người dùng
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Lấy danh sách sản phẩm trong wishlist của người dùng
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       product_id:
 *                         type: integer
 *                       variant_id:
 *                         type: integer
 *                         nullable: true
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           thumbnail:
 *                             type: string
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { user_id: req.userId },
      include: {
        model: Products,
        as: 'product',
        attributes: ['id', 'name', 'thumbnail'],
        include: [
          { model: ProductVariants, as: 'variants' },
          { model: ProductImages, as: 'images' }
        ]
      }
    });

    res.json({ items: wishlist });
  } catch (err) {
    console.error('[GET /api/wishlist] Error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Thêm sản phẩm vào wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *             properties:
 *               product_id:
 *                 type: integer
 *               variant_id:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Đã thêm vào wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   type: object
 */
router.post('/', verifyToken, async (req, res) => {
  const { product_id, variant_id } = req.body;

  try {
    // Bước 1: Kiểm tra có tồn tại chưa
    const existing = await Wishlist.findOne({
      where: {
        user_id: req.userId,
        product_id,
        variant_id: variant_id ?? null // dùng null rõ ràng
      }
    });

    if (existing) {
      return res.status(200).json({ message: 'Đã có trong danh sách yêu thích', item: existing });
    }

    // Bước 2: Tạo mới
    const newItem = await Wishlist.create({
      user_id: req.userId,
      product_id,
      variant_id: variant_id ?? null
    });

    return res.status(200).json({ message: 'Đã thêm vào wishlist', item: newItem });
  } catch (err) {
    console.error('[POST /api/wishlist] Error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

/**
 * @swagger
 * /api/wishlist/{id}:
 *   delete:
 *     summary: Xoá một sản phẩm khỏi wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã xoá khỏi wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Wishlist.destroy({
      where: { id: req.params.id, user_id: req.userId }
    });

    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xoá' });

    return res.json({ message: 'Đã xoá khỏi wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;