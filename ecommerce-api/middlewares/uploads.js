const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo rằng thư mục lưu avatar đã tồn tại
const uploadDirectory = path.join(__dirname,'..', 'uploads', 'media', 'account');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDirectory = path.join(__dirname,'..', 'uploads', 'media', 'account');
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }
    console.log("Đường dẫn lưu ảnh:", uploadDirectory); // Kiểm tra đường dẫn
    cb(null, uploadDirectory); // Lưu ảnh vào thư mục này
  },
  filename: (req, file, cb) => {
    const userId = req.params.id;
    const fileExtension = path.extname(file.originalname); // Lấy đuôi file
    const filename = `avatar_${userId}_${Date.now()}${fileExtension}`; // Đổi tên file
    console.log("Tên file lưu:", filename); // Kiểm tra tên file
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file (5MB)
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extname && mimeType) {
      return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận các định dạng ảnh jpeg, jpg, png, gif'));
  }
});

module.exports = upload;
