const express = require('express');
const router = express.Router();
const { Cart, CartItem } = require('../models/cart.model');
const { Products, ProductVariants, ProductImages } = require('../models/products.model');
const { verifyToken } = require('../middlewares/auths');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Quản lý giỏ hàng người dùng
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Lấy danh sách sản phẩm trong giỏ hàng của người dùng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách sản phẩm trong giỏ
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
 *                       quantity:
 *                         type: integer
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
    const user_id = req.userId;
  
    try {
      const cart = await Cart.findOne({
        where: { user_id },
        include: {
          model: CartItem,
          as: 'items',
          include: {
            model: Products,
            as: 'product',
            attributes: ['id', 'name', 'thumbnail', 'description', 'brand'],
            include: [
                { model: ProductVariants, as: 'variants' }, 
                { model: ProductImages, as: 'images' },     
              ],
          }
        }
      });
  
      return res.json({ items: cart?.items || [] });
    } catch (err) {
      console.error('[GET /api/cart ERROR]', err);  // ✅ In chi tiết lỗi
      return res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  });

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [Cart]
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
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *               variant_id:
 *                 type: integer
 *                 nullable: true
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Sản phẩm đã được thêm vào giỏ
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
router.post('/add', verifyToken, async (req, res) => {
  const { product_id, variant_id, quantity } = req.body;
  const user_id = req.userId;

  try {
    let cart = await Cart.findOne({ where: { user_id } });
    if (!cart) cart = await Cart.create({ user_id });

    const [item, created] = await CartItem.findOrCreate({
      where: { cart_id: cart.id, product_id, variant_id },
      defaults: { quantity }
    });

    if (!created) {
      item.quantity += quantity;
      await item.save();
    }

    return res.json({ message: 'Đã thêm vào giỏ hàng', item });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Cập nhật số lượng sản phẩm trong giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cart_item_id
 *               - quantity
 *             properties:
 *               cart_item_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Số lượng đã được cập nhật
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
router.put('/update', verifyToken, async (req, res) => {
  const { cart_item_id, quantity } = req.body;
  const user_id = req.userId;

  try {
    const cart = await Cart.findOne({ where: { user_id } });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

    const item = await CartItem.findOne({ where: { id: cart_item_id, cart_id: cart.id } });
    if (!item) return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });

    item.quantity = quantity;
    await item.save();

    return res.json({ message: 'Đã cập nhật số lượng', item });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

/**
 * @swagger
 * /api/cart/remove/{cart_item_id}:
 *   delete:
 *     summary: Xoá sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cart_item_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã xoá sản phẩm khỏi giỏ hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete('/remove/:cart_item_id', verifyToken, async (req, res) => {
  const { cart_item_id } = req.params;
  const user_id = req.userId;

  try {
    const cart = await Cart.findOne({ where: { user_id } });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

    const deleted = await CartItem.destroy({
      where: { id: cart_item_id, cart_id: cart.id }
    });

    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy mục để xoá' });

    return res.json({ message: 'Đã xoá sản phẩm khỏi giỏ hàng' });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

/**
 * @swagger
 * /api/cart/update-variant:
 *   patch:
 *     summary: Cập nhật phân loại (variant) của sản phẩm trong giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cart_item_id
 *               - variant_id
 *             properties:
 *               cart_item_id:
 *                 type: integer
 *                 description: ID của sản phẩm trong giỏ hàng
 *               variant_id:
 *                 type: integer
 *                 description: ID phân loại mới được chọn
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   type: object
 *       404:
 *         description: Không tìm thấy mục trong giỏ hàng
 *       500:
 *         description: Lỗi server
 */

router.patch('/update-variant', verifyToken, async (req, res) => {
  const { cart_item_id, variant_id } = req.body;
  const user_id = req.userId;

  try {
    const cart = await Cart.findOne({ where: { user_id } });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

    const item = await CartItem.findOne({ where: { id: cart_item_id, cart_id: cart.id } });
    if (!item) return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });

    item.variant_id = variant_id; // Cập nhật variant_id
    await item.save();

    return res.json({ message: 'Cập nhật phân loại thành công', item });
  } catch (err) {
    console.error('[PATCH /api/cart/update-variant]', err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});


module.exports = router;

