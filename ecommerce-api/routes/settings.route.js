const express = require('express');
const router = express.Router();
const Settings = require('../models/setting.model'); // <== Đường dẫn đúng tới file model

// Cập nhật setting
router.post('/limit-one-item', async (req, res) => {
  const { value } = req.body;
  try {
    await Settings.upsert({ key: 'limit_one_item', value });
    res.json({ success: true });
  } catch (error) {
    console.error('Lỗi cập nhật setting:', error);
    res.status(500).json({ error: 'Lỗi cập nhật setting' });
  }
});

// Lấy setting
router.get('/limit-one-item', async (req, res) => {
  try {
    const setting = await Settings.findOne({ where: { key: 'limit_one_item' } });
    res.json({ value: setting?.value || 'false' });
  } catch (error) {
    console.error('Lỗi lấy setting:', error);
    res.status(500).json({ error: 'Lỗi lấy setting' });
  }
});

module.exports = router;
