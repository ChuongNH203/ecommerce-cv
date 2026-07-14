const express = require('express');
const router = express.Router();
const { ProductSpecifications } = require('../models/product-specifications.model');
const { ProductVariants } = require('../models/products.model');
const { verifyToken } = require('../middlewares/auths');

/**
 * @swagger
 * /api/specifications/variant/{variantId}:
 *   get:
 *     summary: Lấy thông số kỹ thuật của variant
 *     tags: [Product Specifications]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         description: ID của variant
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách thông số kỹ thuật của variant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductSpecification'
 *       404:
 *         description: Không tìm thấy thông số kỹ thuật cho variant này
 *       500:
 *         description: Lỗi khi lấy thông số kỹ thuật
 */
router.get('/variant/:variantId',  async (req, res) => {
  try {
    const variantId = parseInt(req.params.variantId);

    const productSpecs = await ProductSpecifications.findAll({
      where: { variant_id: variantId },
      attributes: ['id', 'spec_name', 'spec_value', 'spec_group', 'created_at', 'updated_at']
    });

    if (productSpecs.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thông số kỹ thuật cho variant này', data: [] });
    }

    return res.status(200).json({ data: productSpecs });
  } catch (error) {
    console.error('[ERROR GETTING PRODUCT SPECIFICATIONS]', error);
    return res.status(500).json({ message: 'Lỗi khi lấy thông số kỹ thuật', error: error.message });
  }
});

/**
 * @swagger
 * /api/specifications/variant/{variantId}:
 *   post:
 *     summary: Thêm thông số kỹ thuật cho variant
 *     tags: [Product Specifications]
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
 *               spec_name:
 *                 type: string
 *               spec_value:
 *                 type: string
 *               spec_group:
 *                 type: string
 *             required:
 *               - spec_name
 *               - spec_value
 *               - spec_group
 *     responses:
 *       201:
 *         description: Thêm thông số kỹ thuật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductSpecification'
 *       404:
 *         description: Variant không tồn tại
 *       500:
 *         description: Lỗi khi thêm thông số kỹ thuật
 */
router.post('/variant/:variantId', [verifyToken], async (req, res) => {
  try {
    const variantId = parseInt(req.params.variantId);
    const { spec_name, spec_value, spec_group } = req.body;

    const variant = await ProductVariants.findOne({ where: { id: variantId } });
    if (!variant) {
      return res.status(404).json({ message: 'Variant không tồn tại' });
    }

    const newSpec = await ProductSpecifications.create({
      variant_id: variantId,
      spec_name,
      spec_value,
      spec_group
    });

    return res.status(201).json({ message: 'Thông số kỹ thuật đã được thêm thành công', data: newSpec });
  } catch (error) {
    console.error('[ERROR CREATING PRODUCT SPECIFICATION]', error);
    return res.status(500).json({ message: 'Lỗi khi thêm thông số kỹ thuật', error: error.message });
  }
});
/**
 * @swagger
 * /api/specifications/variant/{variantId}/{specId}:
 *   put:
 *     summary: Cập nhật thông số kỹ thuật của variant
 *     tags: [Product Specifications]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         description: ID của variant
 *         schema:
 *           type: integer
 *       - in: path
 *         name: specId
 *         required: true
 *         description: ID của thông số kỹ thuật
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spec_name:
 *                 type: string
 *               spec_value:
 *                 type: string
 *               spec_group:
 *                 type: string
 *             required:
 *               - spec_name
 *               - spec_value
 *               - spec_group
 *     responses:
 *       200:
 *         description: Cập nhật thông số kỹ thuật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductSpecification'
 *       404:
 *         description: Không tìm thấy variant hoặc thông số kỹ thuật
 *       500:
 *         description: Lỗi khi cập nhật thông số kỹ thuật
 */
router.put('/variant/:variantId/:specId', [verifyToken], async (req, res) => {
  try {
    const variantId = parseInt(req.params.variantId);
    const specId = parseInt(req.params.specId);

    console.log('variantId:', variantId);  // In ra giá trị variantId
    console.log('specId:', specId);        // In ra giá trị specId

    const variant = await ProductVariants.findOne({ where: { id: variantId } });
    if (!variant) {
      return res.status(404).json({ message: 'Variant không tồn tại' });
    }

    const productSpec = await ProductSpecifications.findOne({ where: { id: specId, variant_id: variantId } });
    if (!productSpec) {
      return res.status(404).json({ message: 'Thông số kỹ thuật không tồn tại' });
    }

    productSpec.spec_name = req.body.spec_name;
    productSpec.spec_value = req.body.spec_value;
    productSpec.spec_group = req.body.spec_group;
    await productSpec.save();

    return res.status(200).json({ message: 'Thông số kỹ thuật đã được cập nhật', data: productSpec });
  } catch (error) {
    console.error('[ERROR UPDATING PRODUCT SPECIFICATION]', error);
    return res.status(500).json({ message: 'Lỗi khi cập nhật thông số kỹ thuật', error: error.message });
  }
});
/**
 * @swagger
 * /api/specifications/variant/{variantId}/{specId}:
 *   delete:
 *     summary: Xóa thông số kỹ thuật của variant
 *     tags: [Product Specifications]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         description: ID của variant
 *         schema:
 *           type: integer
 *       - in: path
 *         name: specId
 *         required: true
 *         description: ID của thông số kỹ thuật
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thông số kỹ thuật thành công
 *       404:
 *         description: Không tìm thấy variant hoặc thông số kỹ thuật
 *       500:
 *         description: Lỗi khi xóa thông số kỹ thuật
 */
router.delete('/variant/:variantId/:specId', [verifyToken], async (req, res) => {
  try {
    const variantId = parseInt(req.params.variantId);
    const specId = parseInt(req.params.specId);

    const variant = await ProductVariants.findOne({ where: { id: variantId } });
    if (!variant) {
      return res.status(404).json({ message: 'Variant không tồn tại' });
    }

    const productSpec = await ProductSpecifications.findOne({ where: { id: specId, variant_id: variantId } });
    if (!productSpec) {
      return res.status(404).json({ message: 'Thông số kỹ thuật không tồn tại' });
    }

    await productSpec.destroy();

    return res.status(200).json({ message: 'Thông số kỹ thuật đã được xóa' });
  } catch (error) {
    console.error('[ERROR DELETING PRODUCT SPECIFICATION]', error);
    return res.status(500).json({ message: 'Lỗi khi xóa thông số kỹ thuật', error: error.message });
  }
});

/**
 * @swagger
 * /api/specifications/all:
 *   get:
 *     summary: Lấy toàn bộ thông số kỹ thuật của tất cả các biến thể
 *     tags: [Product Specifications]
 *     responses:
 *       200:
 *         description: Danh sách tất cả thông số kỹ thuật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductSpecification'
 *       500:
 *         description: Lỗi khi lấy dữ liệu
 */
router.get('/all', [verifyToken], async (req, res) => {
  try {
    const allSpecifications = await ProductSpecifications.findAll({
      attributes: ['id', 'variant_id', 'spec_name', 'spec_value', 'spec_group', 'created_at', 'updated_at'],
      order: [['variant_id', 'ASC']],
    });

    return res.status(200).json({ data: allSpecifications });
  } catch (error) {
    console.error('[ERROR GETTING ALL PRODUCT SPECIFICATIONS]', error);
    return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu', error: error.message });
  }
});

module.exports = router;
