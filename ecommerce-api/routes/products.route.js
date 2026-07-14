const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { Sequelize, Op } = require('sequelize');
const { Products, ProductVariants, ProductImages } = require('../models/products.model');
const { ProductReviews } = require('../models/product-reviews.model');
const { Categories } = require('../models/categories.model');
const { verifyToken } = require('../middlewares/auths');
const { parsePagination, parseFilter } = require('../utils/api_utils');
const { listResponse } = require('../utils/response');
const { ProductSpecifications } = require('../models/product-specifications.model');
const { OrderItem } = require('../models/order-item');
const { Order } = require('../models/order.model');
const sequelize = require('../config/database');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Quản lý sản phẩm và biến thể
 */

/**
 * @swagger
 * /api/product/list:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/list', async (req, res) => {
  const {  category_id, brand, price, search } = req.query; // Lấy category_id, brand, priceRange và search từ query params

  try {
    // Cấu hình phân trang

    const whereClause = {}; // Khởi tạo đối tượng whereClause cho điều kiện lọc

    // Nếu có category_id, áp dụng điều kiện lọc theo category_id
    if (category_id) {
      whereClause.category_id = category_id;
    }

    // Nếu có brand, áp dụng điều kiện lọc theo thương hiệu (brand)
    if (brand) {
      whereClause.brand = brand;
    }

    // Nếu có từ khóa tìm kiếm, áp dụng điều kiện lọc theo tên sản phẩm (title)
    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };  // Tìm kiếm theo tên sản phẩm
    }

    const variantWhereClause = {};  // Điều kiện lọc cho bảng ProductVariants
    if (price) {
      switch (price) {
        case 'Dưới 15 triệu':
          variantWhereClause.price = { [Op.lt]: 15000000 };
          break;
        case 'Từ 15 đến 20 triệu':
          variantWhereClause.price = { [Op.between]: [15000000, 20000000] };
          break;
        case 'Trên 20 triệu':
          variantWhereClause.price = { [Op.gt]: 20000000 };
          break;
        case 'Dưới 2 triệu':
          variantWhereClause.price = { [Op.lt]: 2000000 };
          break;
        case 'Từ 2 đến 5 triệu':
          variantWhereClause.price = { [Op.between]: [2000000, 5000000] };
          break;
        case 'Trên 5 triệu':
          variantWhereClause.price = { [Op.gt]: 5000000 };
          break;
        default:
          break;
      }
    }
    // Truy vấn dữ liệu từ database với điều kiện lọc
    const result = await Products.findAndCountAll({
      where: whereClause, // Áp dụng điều kiện lọc nếu có category_id, brand, hoặc search
      order: [['created_at', 'DESC']],
      attributes: [
        'id', 'name', 'description', 'category_id',
        'discount_percentage', 'brand', 'thumbnail',
        'created_at', 'updated_at'
      ],
      include: [
        {
          model: ProductVariants, 
          as: 'variants',
          where: variantWhereClause, // Lọc theo price trong ProductVariants
        },
        { model: Categories, as: 'categoryDetail', attributes: ['id', 'name'] },
        { model: ProductReviews, as: 'reviews', attributes: ['id', 'rating', 'comment', 'date'] },
      ],

    });

    // Trả về kết quả
    return res.status(200).json({
      data: result.rows,
      count: result.count,
    });
  } catch (error) {
    console.error('[PRODUCT LIST ERROR]', error);
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});
/**
 * @swagger
 * /api/product/detail/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get('/detail/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const product = await Products.findOne({
      where: { id },
      attributes: [
        'id', 'name', 'description', 'category_id',
        'discount_percentage', 'brand', 'thumbnail',
        'created_at', 'updated_at'
      ],
      include: [
        { model: ProductVariants, as: 'variants',
          include: [
            { model: ProductSpecifications, as: 'specifications', attributes: ['id', 'spec_name', 'spec_value', 'spec_group', 'created_at', 'updated_at'] }
          ]
        },
        { model: Categories, as: 'categoryDetail', attributes: ['id', 'name'] },
        { model: ProductReviews, as: 'reviews', attributes: ['id', 'rating', 'comment', 'date'] },
        { model: ProductImages, as: 'images', attributes: ['image_url'] }
      ]
    });

    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    return res.status(200).json({ result: product });
  } catch (error) {
    console.error('[PRODUCT DETAIL ERROR]', error);
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});


/**
 * @swagger
 * /api/product/create:
 *   post:
 *     summary: Thêm sản phẩm mới
 *     tags: [Products]
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
 *               category_id:
 *                 type: integer
 *               brand:
 *                 type: string
 *               discount_percentage:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Danh sách hình ảnh sản phẩm (optional)"
 *             required:
 *               - name
 *               - description
 *               - category_id
 *     responses:
 *       201:
 *         description: Sản phẩm đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post('/create', [verifyToken], async (req, res) => {
  try {
    const { name, description, category_id, brand, discount_percentage, thumbnail } = req.body;
    
    // Tạo sản phẩm mới với thông tin từ yêu cầu
    const newProduct = await Products.create({
      name,
      description,
      category_id,
      brand,
      discount_percentage,
      thumbnail: '' // Để trống thumbnail ban đầu
    });

    // Sau khi sản phẩm được tạo thành công, cập nhật thumbnail khi hình ảnh được tải lên
    if (req.body.images && req.body.images.length > 0) {
      const firstImage = req.body.images[0]; // Hình ảnh đầu tiên
      newProduct.thumbnail = firstImage; // Cập nhật thumbnail
      await newProduct.save();
    }

    res.status(201).json({ message: 'Sản phẩm đã được thêm thành công', data: newProduct });
  } catch (error) {
    console.error('[ERROR CREATING PRODUCT]', error);
    res.status(500).json({ message: 'Lỗi khi tạo sản phẩm', error: error.message });
  }
});

router.get('/all', [verifyToken], async (req, res) => {
  try {
    // Lấy tất cả sản phẩm từ cơ sở dữ liệu
    const allProducts = await Products.findAll({
      attributes: [
        'id', 'name', 'description', 'category_id',
        'discount_percentage', 'brand', 'thumbnail', 'created_at', 'updated_at'
      ],
      include: [
        { model: Categories, as: 'categoryDetail', attributes: ['id', 'name'] },  // Bao gồm thông tin danh mục
      ],
    });

    // Kiểm tra nếu không có sản phẩm nào
    if (allProducts.length === 0) {
      return res.status(404).json({ message: 'Không có sản phẩm nào trong hệ thống.' });
    }

    // Trả về danh sách tất cả sản phẩm
    return res.status(200).json({
      message: 'Danh sách sản phẩm',
      data: allProducts
    });
  } catch (error) {
    console.error('[ERROR FETCHING PRODUCTS]', error);
    return res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
  }
});

/**
 * @swagger
 * /api/product/update/{id}:
 *   put:
 *     summary: Cập nhật thông tin sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sản phẩm
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
 *               category_id:
 *                 type: integer
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               brand:
 *                 type: string
 *               discount_percentage:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *             required:
 *               - name
 *               - description
 *               - category_id
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Sản phẩm không tìm thấy
 *       500:
 *         description: Lỗi server
 */
router.put('/update/:id', [verifyToken], async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, description, category_id, brand, discount_percentage, thumbnail } = req.body;

    const product = await Products.findOne({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    product.name = name;
    product.description = description;
    product.category_id = category_id;
    product.brand = brand;
    product.discount_percentage = discount_percentage;
    product.thumbnail = thumbnail;

    await product.save();

    res.status(200).json({ message: 'Sản phẩm đã được cập nhật', data: product });
  } catch (error) {
    console.error('[ERROR UPDATING PRODUCT]', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
  }
});

/**
 * @swagger
 * /api/product/delete/{id}:
 *   delete:
 *     summary: Xóa sản phẩm và tất cả các liên quan
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sản phẩm
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sản phẩm và tất cả các liên quan đã được xóa thành công
 *       404:
 *         description: Sản phẩm không tìm thấy
 *       500:
 *         description: Lỗi server
 */
router.delete('/delete/:id', [verifyToken], async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await Products.findOne({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    const variants = await ProductVariants.findAll({ where: { product_id: productId } });
    const variantIds = variants.map(variant => variant.id);

    await ProductSpecifications.destroy({
      where: {
        variant_id: variantIds
      }
    });

    await ProductImages.destroy({
      where: {
        product_id: productId
      }
    });

    await ProductVariants.destroy({
      where: {
        product_id: productId
      }
    });

    await product.destroy();

    res.status(200).json({ message: 'Sản phẩm và tất cả các liên quan đã được xóa thành công!' });
  } catch (error) {
    console.error('[ERROR DELETING PRODUCT AND RELATED RECORDS]', error);
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm và các liên quan', error: error.message });
  }
});
/**
 * @swagger
 * /api/product/images:
 *   get:
 *     summary: Lấy toàn bộ danh sách hình ảnh sản phẩm
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Danh sách hình ảnh sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       product_id:
 *                         type: integer
 *                       image_url:
 *                         type: string
 */
router.get('/images', async (req, res) => {
  try {
    const images = await ProductImages.findAll({
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({ data: images });
  } catch (err) {
    console.error('[ERROR FETCH IMAGES]', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});
/**
 * @swagger
 * /api/product/upload-images:
 *   post:
 *     summary: Tải lên hình ảnh sản phẩm
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID của sản phẩm cần cập nhật hình ảnh
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Các hình ảnh sản phẩm (tối đa 10 hình ảnh)
 *     responses:
 *       200:
 *         description: "Hình ảnh đã được tải lên và cập nhật thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: "Không có hình ảnh để tải lên"
 *       500:
 *         description: "Lỗi khi tải lên hình ảnh"
 */
const removeVietnameseTones = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // loại bỏ dấu
    .replace(/\s+/g, '_') // thay dấu cách bằng _
    .toLowerCase();
};
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const productId = req.body.productId;
    let uploadDir = 'uploads/media/others';

    try {
      const product = await Products.findByPk(productId, {
        include: [{ model: Categories, as: 'categoryDetail' }]
      });

      if (product && product.categoryDetail && product.categoryDetail.name) {
        const categoryFolder = removeVietnameseTones(product.categoryDetail.name);
        uploadDir = path.join('uploads', 'media', categoryFolder);
      }
    } catch (error) {
      console.error('Lỗi lấy category từ sản phẩm:', error);
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const productId = req.body.productId;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const newFileName = `product_${productId}_${timestamp}${ext}`;
    cb(null, newFileName);
  }
});

// Chỉ cho phép các định dạng ảnh phổ biến
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/upload-images', upload.array('images', 10), async (req, res) => {
  const { productId } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Không có hình ảnh để tải lên' });
  }

  try {
    const product = await Products.findByPk(productId, {
      include: [{ model: Categories, as: 'categoryDetail' }]
    });

    if (!product || !product.categoryDetail) {
      return res.status(404).json({ message: 'Sản phẩm hoặc danh mục không tồn tại' });
    }

    const categoryFolder = removeVietnameseTones(product.categoryDetail.name);

    const imageUrls = req.files.map(file => ({
      product_id: productId,
      image_url: `/uploads/media/${categoryFolder}/${file.filename}`
    }));

    await Promise.all(imageUrls.map(img => ProductImages.create(img)));

    // Cập nhật thumbnail (nếu cần)
    product.thumbnail = imageUrls[0].image_url;
    await product.save();

    res.status(200).json({ message: 'Hình ảnh đã được tải lên và cập nhật thành công' });
  } catch (error) {
    console.error('[UPLOAD ERROR]', error);
    res.status(500).json({
      message: 'Lỗi khi tải lên hình ảnh',
      error: error.message
    });
  }
});


/**
 * @swagger
 * /api/product/delete-image:
 *   delete:
 *     summary: Xóa hình ảnh của sản phẩm
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID của sản phẩm cần xóa hình ảnh
 *               imageUrl:
 *                 type: string
 *                 description: URL của hình ảnh cần xóa
 *             required:
 *               - productId
 *               - imageUrl
 *     responses:
 *       200:
 *         description: "Hình ảnh đã được xóa thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ hoặc thiếu thông tin"
 *       404:
 *         description: "Không tìm thấy sản phẩm hoặc hình ảnh"
 *       500:
 *         description: "Lỗi server khi xóa hình ảnh"
 */
router.delete('/delete-image', async (req, res) => {
  const { productId, imageUrl } = req.body;

  if (!productId || !imageUrl) {
    return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
  }

  try {
    // Tìm hình ảnh trong bảng ProductImages
    const image = await ProductImages.findOne({ where: { product_id: productId, image_url: imageUrl } });
    if (!image) {
      return res.status(404).json({ message: 'Hình ảnh không tồn tại trong cơ sở dữ liệu' });
    }

    // Xóa hình ảnh khỏi cơ sở dữ liệu
    await image.destroy();

    // Xác định đường dẫn file cần xóa
    let imagePath = '';
    if (imageUrl.includes('product')) {
      imagePath = path.join(__dirname, '..', 'uploads', 'media', 'product', path.basename(imageUrl)); 
    } else if (imageUrl.includes('screen')) {
      imagePath = path.join(__dirname, '..', 'uploads', 'media', 'screen', path.basename(imageUrl)); 
    }

    // Xóa file vật lý nếu tồn tại
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Nếu hình ảnh bị xóa là thumbnail, cập nhật lại thumbnail mới
    const product = await Products.findByPk(productId);
    if (product && product.thumbnail === imageUrl) {
      const remainingImages = await ProductImages.findAll({ where: { product_id: productId } });
      product.thumbnail = remainingImages.length > 0 ? remainingImages[0].image_url : '';
      await product.save();
    }

    return res.status(200).json({ message: 'Hình ảnh đã được xóa thành công' });
  } catch (error) {
    console.error('[ERROR DELETING IMAGE]', error);
    return res.status(500).json({ message: 'Lỗi khi xóa hình ảnh', error: error.message });
  }
});

router.get('/order-items/non-completed',  async (req, res) => {
  try {
    // Truy vấn tất cả các OrderItem có trạng thái đơn hàng khác 'Completed'
    const orderItems = await OrderItem.findAll({
      where: {
        '$order.order_status$': { // Lọc đơn hàng có trạng thái khác 'Completed'
          [Sequelize.Op.ne]: 'Completed'
        }
      },
      include: [{
        model: Order,
        as: 'order',
        attributes: [] 
      }, {
        model: ProductVariants,
        as: 'product_variant',  // Include ProductVariants để lấy thông tin phân loại sản phẩm
        attributes: ['id', 'variant_name', 'price', 'stock']  // Chỉ lấy thông tin cần thiết
      }]
    });

    if (orderItems.length === 0) {
      return res.status(404).json({ message: 'Không có phân loại sản phẩm trong đơn hàng chưa hoàn thành.' });
    }
    const productVariants = orderItems.map(item => item.product_variant);

    res.status(200).json({ productVariants });
  } catch (error) {
    console.error('[ERROR GETTING NON-COMPLETED ORDER ITEMS]', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách phân loại sản phẩm trong đơn hàng chưa hoàn thành.', error: error.message });
  }
});

router.get('/order-items/non-completed/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);

    const orderItems = await OrderItem.findAll({
      where: {
        product_variant_id: {
          [Sequelize.Op.in]: Sequelize.literal(`(SELECT id FROM product_variants WHERE product_id = ${productId})`)
        }
      },
      include: [{
        model: Order,
        as: 'order',
        attributes: ['id', 'order_status']
      }]
    });


    if (orderItems.length > 0) {
      return res.status(200).json(orderItems);
    }

    return res.status(200).json([]); 
  } catch (error) {
    console.error('Lỗi khi kiểm tra sản phẩm trong đơn hàng chưa hoàn thành:', error);
    res.status(500).json({ message: 'Lỗi khi kiểm tra sản phẩm trong đơn hàng chưa hoàn thành', error: error.message });
  }
});



router.get('/sales-statistics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Điều kiện lọc theo ngày tạo đơn hàng
    const orderDateRange = startDate && endDate
      ? {
          created_at: {
            [Op.between]: [new Date(startDate), new Date(endDate)]
          }
        }
      : {};

    // Tổng doanh thu
    const totalSalesResult = await OrderItem.findAll({
      attributes: [[sequelize.fn('sum', sequelize.col('total_price')), 'total_sales']],
      include: [{
        model: Order,
        as: 'order',
        where: orderDateRange,
        attributes: [],
      }],
      raw: true,
    });
    const totalSales = totalSalesResult[0]?.total_sales || 0;

    // Tổng số đơn hàng (không tính đã huỷ)
    const totalOrders = await Order.count({
      where: {
        ...orderDateRange,
        order_status: { [Op.ne]: 'Cancelled' },
      }
    });

    // Sản phẩm bán chạy nhất
    const bestSellingProduct = await OrderItem.findAll({
      attributes: ['product_variant_id', [sequelize.fn('sum', sequelize.col('quantity')), 'total_quantity']],
      group: ['product_variant_id'],
      order: [[sequelize.fn('sum', sequelize.col('quantity')), 'DESC']],
      limit: 1,
      include: [
        {
          model: ProductVariants,
          as: 'product_variant',
          include: [{
            model: Products,
            as: 'Product',
            attributes: ['name']
          }]
        },
        {
          model: Order,
          as: 'order',
          where: orderDateRange,
          attributes: [],
        }
      ],
    });

    const bestSellingProductName = bestSellingProduct.length > 0
      ? bestSellingProduct[0]?.product_variant?.Product?.name || 'Không có sản phẩm bán chạy'
      : 'Không có sản phẩm bán chạy';

    // Doanh thu theo danh mục sản phẩm
    const salesByCategory = await OrderItem.findAll({
      attributes: [
        [sequelize.col('product_variant.Product.category_id'), 'category_id'],
        [sequelize.fn('sum', sequelize.col('total_price')), 'total_sales'],
      ],
      group: ['product_variant.Product.category_id'],
      include: [
        {
          model: ProductVariants,
          as: 'product_variant',
          include: [
            {
              model: Products,
              as: 'Product',
              attributes: ['name', 'category_id'],
              include: [{
                model: Categories,
                as: 'categoryDetail',
                attributes: ['name'],
              }],
            },
          ],
        },
        {
          model: Order,
          as: 'order',
          where: orderDateRange,
          attributes: [],
        },
      ],
    });

    const salesByCategoryData = salesByCategory.map(item => ({
      categoryId: item.dataValues.category_id,
      categoryName: item.product_variant?.Product?.categoryDetail?.name || 'Chưa có tên danh mục',
      totalSales: item.dataValues.total_sales || 0,
    }));

    return res.status(200).json({
      totalSales,
      totalOrders,
      bestSellingProduct: bestSellingProductName,
      salesByCategory: salesByCategoryData,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê bán hàng:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thống kê bán hàng', error: error.message });
  }
});



module.exports = router;