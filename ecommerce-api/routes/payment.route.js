const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const { Payment } = require('../models/payment.model');
const { Order } = require('../models/order.model');
const { verifyToken } = require('../middlewares/auths');
const router = express.Router();


const momoConfig = {
  accessKey: 'F8BBA842ECF85',
  secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  orderInfo: 'pay with MoMo',
  partnerCode: 'MOMO',
  redirectUrl: 'http://localhost:3001/account/order',
  ipnUrl: 'https://ccfe-2402-800-6378-d1ff-4ddf-5ed6-d2de-e3b6.ngrok-free.app/api/payments/callback',
  requestType: 'payWithMethod',
  extraData: '',
  orderGroupId: '',
  autoCapture: true,
  lang: 'vi',
};
/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Xử lý thanh toán cho đơn hàng
 *     description: "Tạo yêu cầu thanh toán cho đơn hàng qua Momo và nhận kết quả thanh toán."
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: integer
 *                 description: "ID của đơn hàng"
 *                 example: 1
 *               payment_method:
 *                 type: string
 *                 description: "Phương thức thanh toán (ví dụ: Momo, Cod)"
 *                 example: "Momo"
 *               amount:
 *                 type: number
 *                 description: "Số tiền thanh toán"
 *                 example: 10000
 *     responses:
 *       200:
 *         description: "Thanh toán thành công, trả về thông tin thanh toán và đường dẫn thanh toán Momo"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment:
 *                   type: object
 *                   properties:
 *                     order_id:
 *                       type: integer
 *                       description: "ID của đơn hàng"
 *                     payment_method:
 *                       type: string
 *                       description: "Phương thức thanh toán"
 *                     payment_status:
 *                       type: string
 *                       description: "Trạng thái thanh toán"
 *                       example: "Pending"
 *                     payment_date:
 *                       type: string
 *                       description: "Ngày thanh toán"
 *                       example: "2025-06-01T00:00:00Z"
 *                     amount:
 *                       type: number
 *                       description: "Số tiền thanh toán"
 *                       example: 10000
 *                 payUrl:
 *                   type: string
 *                   description: "Đường dẫn thanh toán Momo"
 *                   example: "https://test-payment.momo.vn"
 *       400:
 *         description: "Lỗi khi thanh toán (ví dụ: đơn hàng không tồn tại, số tiền không khớp)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Số tiền thanh toán không khớp với tổng giá trị đơn hàng!"
 *       500:
 *         description: "Lỗi server"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi server"
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.post('/', async (req, res) => {
  const { order_id, payment_method, amount } = req.body;

  const {
    accessKey,
    secretKey,
    orderInfo,
    partnerCode,
    redirectUrl,
    ipnUrl,
    requestType,
    extraData,
    orderGroupId,
    autoCapture,
    lang,
  } = momoConfig;

  try {
    const order = await Order.findOne({ where: { id: order_id } });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.order_status !== 'Pending') {
      return res.status(400).json({ message: 'Không thể thanh toán đơn hàng đã xử lý!' });
    }

    if (amount !== order.total_amount) {
      return res.status(400).json({ message: 'Số tiền thanh toán không khớp với đơn hàng!' });
    }

    const momoOrderId = partnerCode + new Date().getTime();
    const requestId = momoOrderId;

    // Tạo raw signature đúng thứ tự theo tài liệu MoMo
    const rawSignature =
      'accessKey=' + accessKey +
      '&amount=' + amount +
      '&extraData=' + extraData +
      '&ipnUrl=' + ipnUrl +
      '&orderId=' + momoOrderId +
      '&orderInfo=' + orderInfo +
      '&partnerCode=' + partnerCode +
      '&redirectUrl=' + redirectUrl +
      '&requestId=' + requestId +
      '&requestType=' + requestType;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId,
      amount,
      orderId: momoOrderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      orderGroupId,
      extraData,
      signature,
    });

    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    const result = await axios(options);
    const data = result.data;

    if (data && data.payUrl) {
      await Payment.create({
        order_id,
        momo_order_id: momoOrderId,
        payment_method,
        payment_status: 'Pending',
        payment_date: new Date(),
        amount,
      });

      return res.status(200).json({
        payment: {
          order_id,
          momo_order_id: momoOrderId,
          payment_method,
          payment_status: 'Pending',
          payment_date: new Date(),
          amount,
        },
        payUrl: data.payUrl,
      });
    } else {
      return res.status(400).json({ message: 'Không thể tạo liên kết thanh toán từ MoMo' });
    }
  } catch (error) {
    console.error('[POST /api/payments] ERROR:', error);
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});


/**
 * @swagger
 * /api/payments/callback:
 *   post:
 *     summary: MoMo IPN Callback
 *     description: MoMo sẽ gọi API này để thông báo kết quả giao dịch.
 *     tags:
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partnerCode:
 *                 type: string
 *               accessKey:
 *                 type: string
 *               requestId:
 *                 type: string
 *               orderId:
 *                 type: string
 *               orderInfo:
 *                 type: string
 *               amount:
 *                 type: number
 *               orderType:
 *                 type: string
 *               transId:
 *                 type: number
 *               resultCode:
 *                 type: integer
 *               message:
 *                 type: string
 *               payType:
 *                 type: string
 *               responseTime:
 *                 type: number
 *               extraData:
 *                 type: string
 *               signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Callback xử lý thành công
 *       400:
 *         description: Chữ ký không hợp lệ
 *       500:
 *         description: Server error
 */
router.post('/callback', async (req, res) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = req.body;

    const { accessKey, secretKey } = momoConfig;

    // Rebuild raw signature string (phải đúng thứ tự tài liệu MoMo)
    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&message=${message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&orderType=${orderType}` +
      `&partnerCode=${partnerCode}` +
      `&payType=${payType}` +
      `&requestId=${requestId}` +
      `&responseTime=${responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${transId}`;

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    if (signature !== generatedSignature) {
      console.error('[MoMo Callback] Invalid signature');
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Nếu giao dịch thành công
    if (parseInt(resultCode) === 0) {
      const payment = await Payment.findOne({ where: { momo_order_id: orderId } });

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      // Chỉ cập nhật nếu chưa success
      if (payment.payment_status !== 'Success') {
        await payment.update({ payment_status: 'Success' });

        // Có thể cập nhật đơn hàng nếu cần
        const order = await Order.findOne({ where: { id: payment.order_id } });
        if (order && order.order_status === 'Pending') {
          await order.update({ order_status: 'Pending' });
        }
      }
    }

    // Trả về cho MoMo biết đã nhận (rất quan trọng)
    return res.status(200).json({ message: 'Callback received' });
  } catch (error) {
    console.error('[MoMo Callback Error]', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/update-status', async (req, res) => {
  const { momo_order_id, status } = req.body;

  try {
    const payment = await Payment.findOne({ where: { momo_order_id } });
    if (!payment) {
      return res.status(404).json({ message: 'Không tìm thấy thanh toán' });
    }

    if (status === 'Success' && payment.payment_status !== 'Success') {
      await payment.update({ payment_status: 'Success' });

      // Optional: cập nhật trạng thái đơn hàng
      const order = await Order.findOne({ where: { id: payment.order_id } });
      if (order && order.order_status === 'Pending') {
        await order.update({ order_status: 'Pending' });
      }
    }

    return res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    console.error('[update-status] error:', error.message);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});
/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Lấy danh sách thanh toán
 *     description: "Lấy danh sách thanh toán với các bộ lọc (theo order_id, payment_status)"
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: order_id
 *         schema:
 *           type: integer
 *         description: "ID của đơn hàng để lọc thanh toán"
 *       - in: query
 *         name: payment_status
 *         schema:
 *           type: string
 *         description: "Trạng thái thanh toán để lọc (Pending, Success, etc.)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Số lượng bản ghi trả về"
 *         default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: "Số trang để phân trang"
 *         default: 0
 *     responses:
 *       200:
 *         description: "Danh sách thanh toán"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       order_id:
 *                         type: integer
 *                         description: "ID của đơn hàng"
 *                       payment_method:
 *                         type: string
 *                         description: "Phương thức thanh toán"
 *                       payment_status:
 *                         type: string
 *                         description: "Trạng thái thanh toán"
 *                       payment_date:
 *                         type: string
 *                         description: "Ngày thanh toán"
 *                       amount:
 *                         type: number
 *                         description: "Số tiền thanh toán"
 *       404:
 *         description: "Không tìm thấy thanh toán"
 *       500:
 *         description: "Lỗi server"
 *       400:
 *         description: "Lỗi với tham số truyền vào"
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    // Lấy các query parameters để phân trang và lọc kết quả
    const { order_id, payment_status, limit = 10, offset = 0 } = req.query;

    // Cấu hình các điều kiện tìm kiếm
    const whereConditions = {};
    if (order_id) whereConditions.order_id = order_id;
    if (payment_status) whereConditions.payment_status = payment_status;

    // Tìm thanh toán theo điều kiện lọc
    const payments = await Payment.findAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['payment_date', 'DESC']], // Sắp xếp theo ngày thanh toán giảm dần
    });

    // Nếu không có kết quả
    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thanh toán nào' });
    }

    // Trả về danh sách thanh toán
    return res.json({ payments });
  } catch (error) {
    console.error('[GET /api/payments ERROR]', error);
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;
