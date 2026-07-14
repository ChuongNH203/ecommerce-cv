const express = require('express');
const router = express.Router();
const { OrderItem } = require('../models/order-item');
const { Order } = require('../models/order.model');
const { Address } = require('../models/address.model'); 
const { Voucher } = require('../models/voucher.model');
const { Products, ProductImages, ProductVariants } = require('../models/products.model');
const { verifyToken } = require('../middlewares/auths');

router.get('/:order_id', verifyToken, async (req, res) => {
  const { order_id } = req.params;  
  const user_id = req.userId;  

  try {

    const order = await Order.findOne({
      where: { id: order_id, user_id },
      include: [{ model: Address }]  
    });

   
    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại hoặc bạn không có quyền truy cập' });
    }
    const voucherId = order.voucher_id;

    // Tìm thông tin voucher nếu có
    let voucher = null;
    if (voucherId) {
      voucher = await Voucher.findOne({
        where: { id: voucherId }
      });
    }
    // Tìm các items trong đơn hàng
    const orderItems = await OrderItem.findAll({
      where: { order_id },
      include: [
        {
          model: ProductVariants,  // Bao gồm thông tin biến thể sản phẩm
          as: 'product_variant',  // Alias của mối quan hệ ProductVariants
          include: [
            {
              model: Products,  // Bao gồm thông tin sản phẩm
              as: 'Product',  // Alias của mối quan hệ Products
              include: [
                {
                  model: ProductImages,
                  as: 'images',  // Alias của mối quan hệ ProductImages
                  limit: 1  // Giới hạn lấy 1 ảnh
                }
              ]
            }
          ]
        }
      ]
    });

    // Trả về thông tin chi tiết đơn hàng và các items liên quan
    return res.json({
      order,
      orderItems,
      discount_amount: voucher ? voucher.discount_amount : 0
    });
  } catch (err) {
    console.error('[GET /api/order-items ERROR]', err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;

