const express = require('express');
const router = express.Router();
const { SpecTemplate } = require('../models/spec-templates.model');
const { verifyToken } = require('../middlewares/auths');

/**
 * @swagger
 * /api/specifications/template/{categoryId}:
 *   get:
 *     summary: Lấy danh sách thông số kỹ thuật mẫu theo category
 *     tags: [Spec Templates]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách thông số kỹ thuật mẫu
 *       500:
 *         description: Lỗi server
 */
router.get('/template/:categoryId', [verifyToken], async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: 'categoryId không hợp lệ' });
    }

    const templates = await SpecTemplate.findAll({
      where: { category_id: categoryId },
      attributes: ['id', 'spec_name', 'spec_group']
    });

    return res.status(200).json({ data: templates });
  } catch (error) {
    console.error('Lỗi lấy spec template:', error);
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});
/**
 * @swagger
 * /api/specifications/template:
 *   post:
 *     summary: Thêm mới thông số kỹ thuật mẫu
 *     tags: [Spec Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *               spec_name:
 *                 type: string
 *               spec_group:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thêm mới thông số kỹ thuật mẫu thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post('/template', [verifyToken], async (req, res) => {
  try {
    const { category_id, spec_name, spec_group } = req.body;

    // Kiểm tra xem các trường dữ liệu có tồn tại không
    if (!category_id || !spec_name) {
      return res.status(400).json({ message: 'category_id và spec_name là bắt buộc' });
    }

    const newTemplate = await SpecTemplate.create({
      category_id,
      spec_name,
      spec_group
    });

    return res.status(201).json({ message: 'Thêm mới thông số kỹ thuật mẫu thành công', data: newTemplate });
  } catch (error) {
    console.error('Lỗi thêm mới spec template:', error);
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

/**
 * @swagger
 * /api/specifications/template/{templateId}:
 *   put:
 *     summary: Cập nhật thông số kỹ thuật mẫu
 *     tags: [Spec Templates]
 *     parameters:
 *       - in: path
 *         name: templateId
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
 *               spec_name:
 *                 type: string
 *               spec_group:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thông số kỹ thuật mẫu thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy thông số kỹ thuật mẫu
 *       500:
 *         description: Lỗi server
 */
router.put('/template/:templateId', [verifyToken], async (req, res) => {
  try {
    const templateId = parseInt(req.params.templateId);
    const { spec_name, spec_group } = req.body;

    const template = await SpecTemplate.findOne({ where: { id: templateId } });

    if (!template) {
      return res.status(404).json({ message: 'Không tìm thấy thông số kỹ thuật mẫu' });
    }

    // Cập nhật thông số kỹ thuật mẫu
    template.spec_name = spec_name || template.spec_name;
    template.spec_group = spec_group || template.spec_group;

    await template.save();

    return res.status(200).json({ message: 'Cập nhật thông số kỹ thuật mẫu thành công', data: template });
  } catch (error) {
    console.error('Lỗi cập nhật spec template:', error);
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

/**
 * @swagger
 * /api/specifications/template/{templateId}:
 *   delete:
 *     summary: Xóa thông số kỹ thuật mẫu
 *     tags: [Spec Templates]
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thông số kỹ thuật mẫu thành công
 *       404:
 *         description: Không tìm thấy thông số kỹ thuật mẫu
 *       500:
 *         description: Lỗi server
 */
router.delete('/template/:templateId', [verifyToken], async (req, res) => {
  try {
    const templateId = parseInt(req.params.templateId);

    const template = await SpecTemplate.findOne({ where: { id: templateId } });

    if (!template) {
      return res.status(404).json({ message: 'Không tìm thấy thông số kỹ thuật mẫu' });
    }

    await template.destroy();

    return res.status(200).json({ message: 'Xóa thông số kỹ thuật mẫu thành công' });
  } catch (error) {
    console.error('Lỗi xóa spec template:', error);
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;
