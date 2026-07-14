const express = require('express');
const { NewsletterSubscriber } = require('../models/newsletter.model');
const router = express.Router();
const { sendNewsletter } = require('../utils/email-service');

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email không được để trống' });
    }

    const existingSubscriber = await NewsletterSubscriber.findOne({
      where: { email }
    });

    if (existingSubscriber) {
      return res.status(400).json({ error: 'Email đã được đăng ký trước đó' });
    }

    const newSubscriber = await NewsletterSubscriber.create({ email });

    return res.status(201).json({
      message: 'Đăng ký nhận bản tin thành công!',
      subscriber: newSubscriber
    });
  } catch (err) {
    console.error('POST /subscribe error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

router.post('/send-newsletter', async (req, res) => {
  try {
    const { subject, content } = req.body;

    // Kiểm tra nếu không có tiêu đề hoặc nội dung
    if (!subject || !content) {
      return res.status(400).json({ error: 'Tiêu đề và nội dung bản tin không được để trống.' });
    }

    // Lấy danh sách tất cả người dùng đã đăng ký nhận bản tin
    const subscribers = await NewsletterSubscriber.findAll();

    if (subscribers.length === 0) {
      return res.status(400).json({ error: 'Không có người đăng ký nhận bản tin.' });
    }

    // Gửi email cho tất cả người đăng ký
    for (const subscriber of subscribers) {
      const email = subscriber.email;

      // Gửi email cho từng người đăng ký với tiêu đề và nội dung
      await sendNewsletter(email, subject, content);
    }

    return res.status(200).json({ message: 'Bản tin đã được gửi cho tất cả người đăng ký.' });
  } catch (err) {
    console.error('POST /send-newsletter error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});


module.exports = router;
