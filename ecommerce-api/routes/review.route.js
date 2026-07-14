const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { ProductReviews } = require('../models/product-reviews.model');
const { verifyToken } = require('../middlewares/auths');
const { User } = require('../models/user.model');
const { ProductVariants } = require('../models/products.model');

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/media/reviews'); // Đặt thư mục lưu ảnh
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname); // Lấy phần mở rộng của file
    const timestamp = Date.now(); // Lấy thời gian hiện tại làm phần của tên file
    cb(null, `review_${timestamp}${fileExtension}`); // Đổi tên file theo định dạng review_id_timestamp.extension
  }
});

// Thiết lập multer upload với cấu hình
const upload = multer({ storage: storage });

/**
 * @swagger
  /api/review/product-reviews:
 *   post:
 *     summary: Thêm đánh giá sản phẩm
 *     tags: [ProductReviews]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: "ID sản phẩm"
 *                 example: 1
 *               rating:
 *                 type: number
 *                 description: "Điểm đánh giá từ 1 đến 5"
 *                 example: 4.5
 *               comment:
 *                 type: string
 *                 description: "Lý do đánh giá"
 *                 example: "Sản phẩm tuyệt vời, rất hài lòng!"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: "Hình ảnh kèm theo đánh giá"
 *               variant_id:
 *                 type: integer
 *                 description: "ID của biến thể sản phẩm"
 *                 example: 2
 *             required:
 *               - product_id
 *               - rating
 *               - comment
 *               - variant_id
 *     responses:
 *       201:
 *         description: Đánh giá đã được thêm thành công
 *       400:
 *         description: Lỗi khi thêm đánh giá
 */

// Sử dụng upload trong route API
router.post('/product-reviews', verifyToken, upload.single('image'), async (req, res) => {
  // Xử lý API thêm đánh giá sản phẩm
  const { product_id, rating, comment, variant_id, order_id  } = req.body; // Lấy thông tin từ req.body
  const user_id = req.userId;

  
  try {

    const existingReview = await ProductReviews.findOne({
      where: {
        order_id: order_id, // Kiểm tra đánh giá theo order_id
        user_id: user_id, // Kiểm tra người dùng đã đánh giá đơn hàng này chưa
      },
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Bạn đã đánh giá đơn hàng này rồi.' });
    }

    const imageUrl = req.file ? `/uploads/media/reviews/${req.file.filename}` : null;

    const newReview = await ProductReviews.create({
      product_id,
      rating,
      comment,
      user_id,
      variant_id,
      order_id,  
      images: imageUrl, 
      date: new Date()
    });

    res.status(201).json({
      message: 'Đánh giá đã được thêm thành công',
      review: newReview
    });
  } catch (error) {
    console.error('[POST /api/product-reviews] ERROR:', error);
    res.status(500).json({ message: 'Lỗi khi thêm đánh giá', error: error.message });
  }
});

router.get('/product-reviews', async (req, res) => {
  const { product_id } = req.query;

  try {
    let conditions = {};
    if (product_id) {
      conditions.product_id = product_id; // Lọc theo product_id nếu có
    }

    // Lấy danh sách đánh giá sản phẩm với các mối quan hệ User và ProductVariants
    const reviews = await ProductReviews.findAll({
      where: conditions,
      include: [
        {
          model: User, // Lấy thông tin người dùng
          as: 'userDetail',
          attributes: ['full_name','avatar'] 
        },
        {
          model: ProductVariants, // Lấy thông tin biến thể sản phẩm
          as: 'variantDetail',
          attributes: ['variant_name'] // Chỉ lấy tên biến thể sản phẩm
        }
      ],
      order: [['date', 'DESC']] 
    });

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'Không có đánh giá nào' });
    }

    res.status(200).json({
      message: 'Danh sách đánh giá sản phẩm',
      reviews: reviews.map(review => {
        return {
          ...review.toJSON(),
          user_name: review.userDetail.full_name, 
          variant_name: review.variantDetail ? review.variantDetail.variant_name : 'Không có biến thể',
          user_image:review.userDetail.avatar,
        };
      })
    });
  } catch (error) {
    console.error('[GET /api/product-reviews] ERROR:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đánh giá', error: error.message });
  }
});

router.get('/check-review', verifyToken, async (req, res) => {
  const { order_id, variant_id } = req.query; 
  const user_id = req.userId; 

  try {

    const existingReview = await ProductReviews.findOne({
      where: {
        user_id,
        order_id,
        variant_id
      }
    });

    if (existingReview) {
      return res.status(200).json({ message: 'Cảm ơn bạn đã đánh giá!' });
    } else {
      return res.status(404).json({ message: 'Chưa có đánh giá cho sản phẩm này' });
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra đánh giá:', error);
    res.status(500).json({ message: 'Lỗi khi kiểm tra đánh giá', error: error.message });
  }
});
module.exports = router;
