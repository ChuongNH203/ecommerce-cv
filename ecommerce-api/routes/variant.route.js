const express = require('express');
const router = express.Router();
const { ProductVariants, Products } = require('../models/products.model');
const { ProductSpecifications } = require('../models/product-specifications.model');
const { verifyToken } = require('../middlewares/auths');
const { OrderItem } = require('../models/order-item');

/**
 * @swagger
 * /api/variant/create:
 *   post:
 *     summary: Tạo mới variant
 *     tags: [Variants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               variant_name:
 *                 type: string
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               sku:
 *                 type: string
 *               weight:
 *                 type: number
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: number
 *                   width:
 *                     type: number
 *                   height:
 *                     type: number
 *     responses:
 *       201:
 *         description: Variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/create', [verifyToken], async (req, res) => {
  try {
    const { product_id, variant_name, color, size, price, stock, sku, weight, dimensions } = req.body;

    const newVariant = await ProductVariants.create({
      product_id,
      variant_name,
      color,
      size,
      price,
      stock,
      sku,
      weight,
      dimensions,
    });

    res.status(201).json({ message: 'Variant created successfully', data: newVariant });
  } catch (error) {
    console.error('[ERROR CREATING VARIANT]', error);
    res.status(500).json({ message: 'Error creating variant', error: error.message });
  }
});

/**
 * @swagger
 * /api/variant/product/{productId}:
 *   get:
 *     summary: Lấy danh sách variants của một sản phẩm
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID của sản phẩm
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách các variants của sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductVariant'
 *       404:
 *         description: Không tìm thấy variants cho sản phẩm
 *       500:
 *         description: Lỗi khi lấy danh sách variants
 */
router.get('/product/:productId', [verifyToken], async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const variants = await ProductVariants.findAll({
      where: { product_id: productId },
      include: [{ model: ProductSpecifications, as: 'specifications', attributes: ['id', 'spec_name', 'spec_value'] }],
    });

    if (variants.length === 0) {
      return res.status(404).json({ message: 'No variants found for this product' });
    }

    res.status(200).json({ data: variants });
  } catch (error) {
    console.error('[ERROR GETTING VARIANTS]', error);
    res.status(500).json({ message: 'Error fetching variants', error: error.message });
  }
});

/**
 * @swagger
 * /api/variant/update/{variantId}:
 *   put:
 *     summary: Cập nhật thông tin variant
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         description: ID của variant
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               variant_name:
 *                 type: string
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               sku:
 *                 type: string
 *               weight:
 *                 type: number
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: number
 *                   width:
 *                     type: number
 *                   height:
 *                     type: number
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Variant not found
 *       500:
 *         description: Server error
 */
router.put('/update/:variantId', [verifyToken], async (req, res) => {
  try {
    const variantId = parseInt(req.params.variantId);
    const { variant_name, color, size, price, stock, sku, weight, dimensions } = req.body;

    const variant = await ProductVariants.findOne({ where: { id: variantId } });

    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    variant.variant_name = variant_name;
    variant.color = color;
    variant.size = size;
    variant.price = price;
    variant.stock = stock;
    variant.sku = sku;
    variant.weight = weight;
    variant.dimensions = dimensions;

    await variant.save();

    res.status(200).json({ message: 'Variant updated successfully', data: variant });
  } catch (error) {
    console.error('[ERROR UPDATING VARIANT]', error);
    res.status(500).json({ message: 'Error updating variant', error: error.message });
  }
});

/**
 * @swagger
 * /api/variant/delete/{variantId}:
 *   delete:
 *     summary: Xóa variant
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         description: ID của variant
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 *       404:
 *         description: Variant not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:variantId', [verifyToken], async (req, res) => {
  try {
    const variantId = parseInt(req.params.variantId);

    const variant = await ProductVariants.findOne({ where: { id: variantId } });

    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    await variant.destroy();

    res.status(200).json({ message: 'Variant deleted successfully' });
  } catch (error) {
    console.error('[ERROR DELETING VARIANT]', error);
    res.status(500).json({ message: 'Error deleting variant', error: error.message });
  }
});

/**
 * @swagger
 * /api/variant/all:
 *   get:
 *     summary: Lấy danh sách tất cả các variants của mọi sản phẩm
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách tất cả các variants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductVariant'
 *       500:
 *         description: Lỗi khi lấy danh sách variants
 */
router.get('/all', [verifyToken], async (req, res) => {
  try {
    const variants = await ProductVariants.findAll({
      include: [
        {
          model: ProductSpecifications,
          as: 'specifications',
          attributes: ['id', 'spec_name', 'spec_value'],
        },
      ],
    });
    res.status(200).json({ data: variants });
  } catch (error) {
    console.error('[ERROR GETTING ALL VARIANTS]', error);
    res.status(500).json({ message: 'Error fetching all variants', error: error.message });
  }
});

/**
 * @swagger
 * /api/variant/{variantId}/detail:
 *   get:
 *     summary: Lấy chi tiết biến thể bao gồm category_id từ bảng Products
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         description: ID của biến thể
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chi tiết biến thể bao gồm category_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariantWithCategory'
 *       404:
 *         description: Không tìm thấy biến thể
 *       500:
 *         description: Lỗi khi lấy chi tiết biến thể
 */
router.get('/:variantId/detail', [verifyToken], async (req, res) => {
  try {
    const variantId = parseInt(req.params.variantId);
    const variant = await ProductVariants.findOne({
      where: { id: variantId },
      include: {
        model: Products,
        as: 'Product',
        attributes: ['category_id'],
      },
    });

    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    res.status(200).json({ data: variant });
  } catch (error) {
    console.error('[ERROR GETTING VARIANT DETAIL]', error);
    res.status(500).json({ message: 'Error fetching variant detail', error: error.message });
  }
});

/**
 * @swagger
 * /api/variant/check-variant-used/{variantId}:
 *   get:
 *     summary: Kiểm tra xem biến thể đã tồn tại trong đơn hàng chưa
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         description: ID của biến thể
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kết quả kiểm tra trạng thái sử dụng của biến thể
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inUse:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Biến thể này đã tồn tại trong đơn hàng. Không thể xóa.
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi server
 *                 error:
 *                   type: string
 *                   example: Lỗi truy vấn cơ sở dữ liệu
 */
router.get('/check-variant-used/:variantId', async (req, res) => {
  const variantId = parseInt(req.params.variantId);

  try {
    const count = await OrderItem.count({
      where: { product_variant_id: variantId },
    });

    if (count > 0) {
      return res.status(200).json({
        inUse: true,
        message: 'Biến thể này đã tồn tại trong đơn hàng. Không thể xóa.',
      });
    }

    return res.status(200).json({ inUse: false });
  } catch (err) {
    console.error('Lỗi kiểm tra biến thể:', err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});


module.exports = router;
