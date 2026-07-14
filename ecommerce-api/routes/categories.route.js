const express = require('express');

const { verifyToken } = require('../middlewares/auths');

const { listResponse } = require('../utils/response');

const { Categories } = require('../models/categories.model');
const { ProductVariants } = require('../models/products.model');

const router = express.Router();

/**
 * @swagger
 * /api/category/list:
 *   get:
 *     summary: Danh sách danh mục
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 */
router.get('/list', async (req, res) => {
    return Categories.findAll({
        where: {
            
        },
        order: [['name', 'ASC']]
    })
        .then((categories) => {
            const result = listResponse(categories);
            return res.status(200).json(result);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        });

});

/**
 * @swagger
 * /api/category/create:
 *   post:
 *     summary: Tạo mới danh mục
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               parent_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/create', [verifyToken], async (req, res) => {
    const { name, description, parent_id } = req.body;
  
    if (!name) return res.status(400).json({ message: 'Tên danh mục là bắt buộc' });
  
    try {
      const newCategory = await Categories.create({ name, description, parent_id });
      return res.status(201).json({ success: true, data: newCategory });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Tạo danh mục thất bại' });
    }
  });
  
  /**
   * @swagger
   * /api/category/update/{id}:
   *   put:
   *     summary: Cập nhật danh mục
   *     tags: [Categories]
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
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               parent_id:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Cập nhật thành công
   */
  router.put('/update/:id', [verifyToken], async (req, res) => {
    const { id } = req.params;
    const { name, description, parent_id } = req.body;
  
    try {
      const category = await Categories.findByPk(id);
      if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
  
      await category.update({ name, description, parent_id });
      return res.status(200).json({ success: true, data: category });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Cập nhật danh mục thất bại' });
    }
  });
  
  /**
   * @swagger
   * /api/category/delete/{id}:
   *   delete:
   *     summary: Xóa danh mục
   *     tags: [Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Xóa thành công
   */
  router.delete('/delete/:id', [verifyToken], async (req, res) => {
    const { id } = req.params;
  
    try {
      const category = await Categories.findByPk(id);
      if (!category) return res.status(404).json({ message: 'Danh mục không tồn tại' });
  
      await category.destroy();
      return res.status(200).json({ success: true, message: 'Xóa danh mục thành công' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Xóa danh mục thất bại' });
    }
  });

  /**
 * @swagger
 * /api/category/{id}/products:
 *   get:
 *     summary: Danh sách sản phẩm của danh mục
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của danh mục
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm của danh mục
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 */
router.get('/:id/products', async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm danh mục theo ID
    const category = await Categories.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Danh mục không tồn tại' });
    }

    // Tìm các sản phẩm thuộc danh mục này cùng với thông tin thương hiệu và giá bán từ ProductVariants
    const products = await category.getProducts({
      include: [
        {
          model: ProductVariants,
          as: 'variants',
          attributes: ['id', 'variant_name', 'price', 'stock'], // Chọn những thuộc tính cần thiết
        }
      ]
    });

    // Chuyển các sản phẩm sang định dạng dễ sử dụng
    const productData = products.map(product => {
      return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        variants: product.variants.map(variant => ({
          name: variant.variant_name,
          price: variant.price,
          stock: variant.stock
        }))
      };
    });

    return res.status(200).json({
      success: true,
      data: productData, 
    });
  } catch (err) {
  console.error(err);
  return res.status(500).json({
    message: 'Lỗi server khi lấy danh sách sản phẩm',
    error: err.message,
    stack: err.stack,  // Thêm phần này để có thông tin chi tiết về lỗi
  });
}
});
  module.exports = router;