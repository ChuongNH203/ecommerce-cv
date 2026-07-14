require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const corsOptions = {
  origin: 'http://localhost:3001', // Địa chỉ của frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true, // Nếu cần gửi cookie
};

app.use(cors(corsOptions));

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const sequelize = require('./config/database');
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const categoryRoutes = require('./routes/categories.route');
const productRoutes = require('./routes/products.route');
const reviewRoutes = require('./routes/review.route');
const cartRoute = require('./routes/cart.route');
const wishlistRoutes = require('./routes/wishlist.route');
const productSpecRoutes = require('./routes/specifications.route');
const variantRouters = require('./routes/variant.route');
const specTemplateRoutes = require('./routes/spectemplate.route');
const addressRoutes = require('./routes/address.route');
const orderRoutes = require('./routes/order.route');
const orderItemRoutes = require('./routes/order-item.route');
const paymentRoutes = require('./routes/payment.route');
const voucherRoutes = require('./routes/voucher.route');
const newsletterRoutes = require('./routes/newsletter.route');
const settingRoute = require('./routes/settings.route');

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/cart', cartRoute);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/specifications', productSpecRoutes);
app.use('/api/variant', variantRouters);
app.use('/api/specifications', specTemplateRoutes);
app.use('/api/addresses',addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/settings', settingRoute);

// Swagger route
app.use('/api-docs', swaggerUi.serve,
  swaggerUi.setup(
    swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true
    }
  }
  )
);

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
  });
});
