const express = require('express');
const router = express.Router();
const { Order } = require('../models/order.model');
const { OrderItem } = require('../models/order-item');
const { Voucher } = require('../models/voucher.model');
const { verifyToken } = require('../middlewares/auths');
const { ProductVariants } = require('../models/products.model');
const { Products, ProductImages } = require('../models/products.model');
const { User } = require('../models/user.model');

router.post('/', verifyToken, async (req, res) => {
  const {
    shipping_address_id,
    payment_method,
    shipping_method,
    shipping_fee,
    voucher_code,
    items,
    total_amount,
  } = req.body;

  const user_id = req.userId; 

  try {
    let voucher_id = null;  


    if (voucher_code) {
      const voucher = await Voucher.findOne({ where: { code: voucher_code } });
      if (voucher && voucher.is_active) {
        voucher_id = voucher.id; 
      } else {
        return res.status(400).json({ message: 'Voucher không hợp lệ hoặc đã hết hạn' });
      }
    }

  
    const order = await Order.create({
      user_id,
      shipping_address_id,
      payment_method,
      shipping_method,
      shipping_fee,
      voucher_code: voucher_code || null,  
      voucher_id: voucher_id,  
      total_amount: total_amount,
      order_status: 'Pending',
    });
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
      price: item.price,
      total_price: total_amount,
    }));

    await OrderItem.bulkCreate(orderItems);
    return res.status(201).json({ message: 'Đặt hàng thành công', order });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ message: 'Lỗi tạo đơn hàng', error: err.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  const user_id = req.userId;
  const limit = parseInt(req.query.limit) || 5;
  const offset = parseInt(req.query.offset) || 0;
  const status = req.query.status; 

  const whereCondition = { user_id };

  if (status && status !== 'TẤT CẢ') {
    whereCondition.order_status = status;
  }

  try {
    const orders = await Order.findAll({
      where: whereCondition,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['full_name'],
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: ProductVariants,
              as: 'product_variant',
              include: [
                {
                  model: Products,
                  as: 'Product',
                  include: [
                    {
                      model: ProductImages,
                      as: 'images'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Lỗi lấy danh sách đơn hàng', error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  console.log('📦 req.params.id:', orderId);
  console.log('📨 req.body:', req.body);

  const allowedStatuses = ['Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }

  try {
    const order = await Order.findByPk(orderId, {
      include: ['orderItems'],
    });

    if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    if (status === 'Completed' && order.order_status !== 'Completed') {
      const { ProductVariants } = require('../models/products.model');

      for (const item of order.orderItems) {
        const variant = await ProductVariants.findByPk(item.product_variant_id);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
          await variant.save();
        }
      }
    }

    order.order_status = status;
    await order.save();

    res.json({ message: 'Cập nhật trạng thái thành công', order });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái', error: err.message });
  }
});

router.get('/all', verifyToken, async (req, res) => {
  try {
    // Lấy tất cả các đơn hàng
    const orders = await Order.findAll({
      order: [['created_at', 'DESC']],  // Sắp xếp theo thời gian tạo, mới nhất lên đầu
      include: [
        {
          model: User,
          attributes: ['full_name'],  // Lấy tên đầy đủ của người dùng
        },
        {
          model: OrderItem,
          as: 'orderItems',  // Alias cho OrderItems
          include: [
            {
              model: ProductVariants,
              as: 'product_variant',  // Alias cho ProductVariants
              include: [
                {
                  model: Products,
                  as: 'Product',  // Alias cho Products
                  include: [
                    {
                      model: ProductImages,
                      as: 'images',  // Alias cho ProductImages
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    // Trả về danh sách tất cả đơn hàng
    res.status(200).json({ orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Lỗi lấy danh sách đơn hàng', error: err.message });
  }
});



module.exports = router;
