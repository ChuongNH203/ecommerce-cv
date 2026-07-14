-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 14, 2026 at 02:02 PM
-- Server version: 8.0.44
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `street_address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `ward` varchar(255) NOT NULL,
  `postal_code` varchar(255) NOT NULL,
  `address_type` enum('office','home') NOT NULL DEFAULT 'home',
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `full_name`, `phone_number`, `street_address`, `city`, `district`, `ward`, `postal_code`, `address_type`, `isDefault`, `created_at`, `updated_at`) VALUES
(1, 1, 'chuong', '0387112211', '111', '70', 'Thị xã Chơn Thành', '25444', '', 'home', 1, '2026-06-22 08:39:55', '2026-06-22 08:40:01');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
CREATE TABLE IF NOT EXISTS `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-06-22 08:31:56', '2026-06-22 08:31:56');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `variant_id`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 1, '2026-06-22 08:31:56', '2026-06-22 15:46:26');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `parent_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, 'iphone', NULL, NULL, '2026-06-22 08:28:16', '2026-06-22 08:28:16');

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscribers`
--

DROP TABLE IF EXISTS `newsletter_subscribers`;
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `shipping_address_id` int NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `shipping_method` varchar(255) NOT NULL,
  `voucher_id` int DEFAULT NULL,
  `total_amount` float NOT NULL,
  `order_status` enum('Pending','Processing','Shipping','Completed','Cancelled') NOT NULL DEFAULT 'Pending',
  `cancellation_requested` tinyint(1) DEFAULT '0',
  `cancellation_approved` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `shipping_address_id` (`shipping_address_id`),
  KEY `voucher_id` (`voucher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `shipping_address_id`, `payment_method`, `shipping_method`, `voucher_id`, `total_amount`, `order_status`, `cancellation_requested`, `cancellation_approved`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Momo', 'standard', NULL, 20020000, 'Pending', 0, 0, '2026-06-22 08:40:12', '2026-06-22 08:40:12'),
(2, 1, 1, 'Momo', 'standard', NULL, 20020000, 'Pending', 0, 0, '2026-06-22 15:47:21', '2026-06-22 15:47:21');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_variant_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `price` float NOT NULL,
  `total_price` float NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_variant_id` (`product_variant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_variant_id`, `quantity`, `price`, `total_price`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 20000000, 20020000, '2026-06-22 08:40:12', '2026-06-22 08:40:12'),
(2, 2, 1, 1, 20000000, 20020000, '2026-06-22 15:47:21', '2026-06-22 15:47:21');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `momo_order_id` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) NOT NULL,
  `payment_status` varchar(255) NOT NULL DEFAULT 'Pending',
  `payment_date` datetime DEFAULT NULL,
  `amount` float NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `momo_order_id`, `payment_method`, `payment_status`, `payment_date`, `amount`, `created_at`, `updated_at`) VALUES
(1, 1, 'MOMO1782117612609', 'Momo', 'Success', '2026-06-22 08:40:12', 20020000, '2026-06-22 08:40:12', '2026-06-22 08:41:37'),
(2, 2, 'MOMO1782143241941', 'Momo', 'Success', '2026-06-22 15:47:22', 20020000, '2026-06-22 15:47:22', '2026-06-22 15:48:07');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `category_id` int NOT NULL,
  `discount_percentage` decimal(5,2) DEFAULT '0.00',
  `brand` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `category_id`, `discount_percentage`, `brand`, `thumbnail`, `created_at`, `updated_at`) VALUES
(1, 'Điện thoại iPhone 13', 'đẹp lắm', 1, 20.00, 'Iphone', '/uploads/media/iphone/product_1_1782116952624.jpg', '2026-06-22 08:28:51', '2026-06-22 08:29:12');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 1, '/uploads/media/iphone/product_1_1782116952624.jpg', '2026-06-22 08:29:12', '2026-06-22 08:29:12');

-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
CREATE TABLE IF NOT EXISTS `product_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `comment` text,
  `images` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `user_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `order_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  KEY `variant_id` (`variant_id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_specifications`
--

DROP TABLE IF EXISTS `product_specifications`;
CREATE TABLE IF NOT EXISTS `product_specifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `variant_id` int NOT NULL,
  `spec_name` varchar(255) NOT NULL,
  `spec_value` varchar(255) DEFAULT NULL,
  `spec_group` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `variant_id` (`variant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_specifications`
--

INSERT INTO `product_specifications` (`id`, `variant_id`, `spec_name`, `spec_value`, `spec_group`, `created_at`, `updated_at`) VALUES
(1, 1, 'CPU', '4K', '', '2026-06-22 08:30:38', '2026-06-22 08:30:38');

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `variant_name` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `dimensions` json DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `variant_name`, `color`, `size`, `price`, `stock`, `sku`, `weight`, `dimensions`, `created_at`, `updated_at`) VALUES
(1, 1, '16GB', 'Đen', '16', 20000000.00, 2, NULL, 0.00, '{\"depth\": 0, \"width\": 0, \"height\": 0}', '2026-06-22 08:30:08', '2026-06-22 08:31:29'),
(2, 1, 'Đen', 'Trắng', '16', 19000000.00, 3, '55', 0.00, '{\"depth\": 0, \"width\": 0, \"height\": 0}', '2026-06-22 08:30:12', '2026-06-22 08:31:47');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
CREATE TABLE IF NOT EXISTS `settings` (
  `key` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `spec_templates`
--

DROP TABLE IF EXISTS `spec_templates`;
CREATE TABLE IF NOT EXISTS `spec_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `spec_name` varchar(255) NOT NULL,
  `spec_group` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `spec_templates`
--

INSERT INTO `spec_templates` (`id`, `category_id`, `spec_name`, `spec_group`, `created_at`, `updated_at`) VALUES
(1, 1, 'CPU', NULL, '2026-06-22 08:30:35', '2026-06-22 08:30:35');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT '0',
  `is_valid_email` tinyint(1) DEFAULT '0',
  `last_login` datetime DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `email`, `phone_number`, `gender`, `date_of_birth`, `role`, `is_active`, `is_valid_email`, `last_login`, `avatar`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2b$10$0JOTqtxU53OpCN1kZHNqH.KyZdGD8j7tXNC20Bhxgx0lMAim2a7ty', 'Nguyen Hoang Chuong', 'nguyenhoangchuong7506@gmail.com', NULL, NULL, NULL, 'admin', 1, 1, NULL, '/uploads/media/account/avatar_1_1782118019535.jpg', '2026-06-22 08:24:18', '2026-06-22 08:46:59');

-- --------------------------------------------------------

--
-- Table structure for table `user_otps`
--

DROP TABLE IF EXISTS `user_otps`;
CREATE TABLE IF NOT EXISTS `user_otps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `expires` datetime NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'forgot_password',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_otps`
--

INSERT INTO `user_otps` (`id`, `user_id`, `otp_code`, `expires`, `type`, `created_at`) VALUES
(1, 1, '383103', '2026-06-22 08:29:18', 'verify_email', '2026-06-22 08:24:18');

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
CREATE TABLE IF NOT EXISTS `vouchers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `discount_amount` float NOT NULL,
  `discount_percentage` float DEFAULT NULL,
  `valid_from` datetime NOT NULL,
  `valid_until` datetime NOT NULL,
  `usage_limit` int DEFAULT NULL,
  `usage_count` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
CREATE TABLE IF NOT EXISTS `wishlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  KEY `variant_id` (`variant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `product_id`, `variant_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, '2026-06-22 08:31:01', '2026-06-22 08:31:01');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`shipping_address_id`) REFERENCES `addresses` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_reviews_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `product_reviews_ibfk_4` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_specifications`
--
ALTER TABLE `product_specifications`
  ADD CONSTRAINT `product_specifications_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlists_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
