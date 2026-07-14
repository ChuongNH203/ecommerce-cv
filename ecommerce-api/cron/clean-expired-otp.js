const cron = require("node-cron");
const { Op } = require("sequelize");
const UserOtp = require("../models/user-otp.model");

cron.schedule("* * * * *", async () => {
  const now = new Date();

  try {
    const deletedCount = await UserOtp.destroy({
      where: {
        expires: {
          [Op.lt]: now, // Chỉ xóa OTP nào đã hết hạn (sau 5p)
        },
      },
    });

    if (deletedCount > 0) {
      console.log(`[OTP Cleanup] Xóa ${deletedCount} OTP hết hạn lúc ${now.toLocaleTimeString()}`);
    }
  } catch (err) {
    console.error("[OTP Cleanup] Lỗi:", err.message);
  }
});