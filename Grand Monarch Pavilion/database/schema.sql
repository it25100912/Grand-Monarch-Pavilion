-- ====================================================================
-- Web-based Restaurant and Event Management System
-- SE2030 Software Engineering Assignment
-- Group: 2026-Y2-S1-MLB-B3G2-09
-- Database Schema Script for MySQL 8.0+
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `restaurant_event_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `restaurant_event_db`;

-- -----------------------------------------------------
-- 1. Users Table (Shared Account Model - Member 1: Nadin P.G.K.)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL,
  `role` ENUM('ADMIN', 'EVENT_COORDINATOR', 'FINANCE_OFFICER', 'CUSTOMER_SERVICE', 'OPERATIONS_SUPERVISOR', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
  `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `address` VARCHAR(255) DEFAULT '',
  `job_position` VARCHAR(100) DEFAULT '',
  `department` VARCHAR(100) DEFAULT '',
  `role_type` VARCHAR(31) DEFAULT 'STAFF',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 2. Restaurant Tables (Member 2: Sandaruwan D.G.I)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_tables` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `table_number` VARCHAR(20) NOT NULL UNIQUE,
  `capacity` INT NOT NULL,
  `location` VARCHAR(50) NOT NULL DEFAULT 'Main Dining Hall',
  `status` ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 3. Reservations Table (Member 2: Sandaruwan D.G.I)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `table_id` INT NOT NULL,
  `reservation_date` DATE NOT NULL,
  `reservation_time` TIME NOT NULL,
  `party_size` INT NOT NULL,
  `special_request` TEXT,
  `status` ENUM('PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 4. Venues Table (Member 5: Dulanjee R. K. K.)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `venues` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `capacity` INT NOT NULL,
  `price_per_hour` DECIMAL(10,2) NOT NULL,
  `status` ENUM('AVAILABLE', 'BOOKED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 5. Events Table (Member 3: Hellarawa H. M. V. K. B.)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `venue_id` INT NOT NULL,
  `event_title` VARCHAR(150) NOT NULL,
  `event_type` ENUM('WEDDING', 'BIRTHDAY', 'CORPORATE', 'PARTY', 'OTHER') NOT NULL,
  `event_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `expected_guests` INT NOT NULL,
  `special_requirements` TEXT,
  `status` ENUM('PENDING', 'APPROVED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 6. Resources Table (Member 6: Jayakodi J.A.P.V.N)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `resources` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `category` VARCHAR(50) NOT NULL,
  `total_quantity` INT NOT NULL,
  `allocated_quantity` INT NOT NULL DEFAULT 0,
  `unit_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('AVAILABLE', 'LIMITED', 'OUT_OF_STOCK') NOT NULL DEFAULT 'AVAILABLE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 7. Event Resources Table (Member 6: Jayakodi J.A.P.V.N)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `event_resources` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `resource_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 7b. Event Staff Table (Member 3: Hellarawa H. M. V. K. B.)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `event_staff` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `role_description` VARCHAR(100) DEFAULT 'Assigned Staff',
  `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`staff_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_event_staff` (`event_id`, `staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 8. Invoices Table (Member 4: Wijesingha W.M.G.K.)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_number` VARCHAR(50) NOT NULL UNIQUE,
  `customer_id` INT NOT NULL,
  `booking_type` ENUM('RESERVATION', 'EVENT') NOT NULL,
  `booking_id` INT NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `tax_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('UNPAID', 'PARTIALLY_PAID', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'UNPAID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 9. Payments Table (Member 4: Wijesingha W.M.G.K.)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` INT NOT NULL,
  `payment_method` ENUM('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'ONLINE') NOT NULL,
  `amount_paid` DECIMAL(10,2) NOT NULL,
  `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `transaction_ref` VARCHAR(100),
  `status` ENUM('SUCCESS', 'FAILED', 'PENDING') NOT NULL DEFAULT 'SUCCESS',
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 9b. Receipts Table (Member 4: Wijesingha W.M.G.K.)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `receipts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `receipt_number` VARCHAR(50) NOT NULL UNIQUE,
  `payment_id` INT NOT NULL,
  `invoice_id` INT NOT NULL,
  `customer_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL,
  `receipt_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `notes` TEXT,
  FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 10. Menu Items Table (Minor Function)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `category` ENUM('APPETIZER', 'MAIN_COURSE', 'DESSERT', 'BEVERAGE', 'CATERING_COMBO') NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) NOT NULL,
  `is_available` BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 11. Notifications Table (Minor Function)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================================
-- SYSTEM USERS (Default Credentials: 'admin123')
-- ====================================================================
INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `email`, `phone`, `role`, `status`) VALUES
(1, 'admin', 'admin123', 'Nadin P.G.K. (Admin)', 'admin@restaurant.com', '0771234567', 'ADMIN', 'ACTIVE'),
(2, 'coordinator', 'admin123', 'Hellarawa H. M. V. K. B.', 'coordinator@restaurant.com', '0772345678', 'EVENT_COORDINATOR', 'ACTIVE'),
(3, 'finance', 'admin123', 'Wijesingha W.M.G.K.', 'finance@restaurant.com', '0773456789', 'FINANCE_OFFICER', 'ACTIVE'),
(4, 'supervisor', 'admin123', 'Dulanjee R. K. K.', 'supervisor@restaurant.com', '0774567890', 'OPERATIONS_SUPERVISOR', 'ACTIVE'),
(5, 'csr', 'admin123', 'Jayakodi J.A.P.V.N.', 'csr@restaurant.com', '0775678901', 'CUSTOMER_SERVICE', 'ACTIVE'),
(6, 'sandaruwan', 'admin123', 'Sandaruwan D.G.I.', 'sandaruwan@gmail.com', '0719876543', 'CUSTOMER', 'ACTIVE'),
(7, 'kamal', 'admin123', 'Kamal Perera', 'kamal@gmail.com', '0711122334', 'CUSTOMER', 'ACTIVE');

-- ====================================================================
-- RESTAURANT DINING TABLES (Default Tables)
-- ====================================================================
INSERT INTO `restaurant_tables` (`table_number`, `capacity`, `location`, `status`) VALUES
('T-01', 2, 'Main Dining Indoor Hall', 'AVAILABLE'),
('T-02', 2, 'Main Dining Indoor Hall', 'AVAILABLE'),
('T-03', 4, 'Main Dining Indoor Hall', 'AVAILABLE'),
('T-04', 4, 'Main Dining Indoor Hall', 'AVAILABLE'),
('T-05', 6, 'Main Dining Indoor Hall', 'AVAILABLE'),
('T-06', 8, 'Main Dining Indoor Hall', 'AVAILABLE'),
('G-01', 4, 'Outdoor Garden Terrace', 'AVAILABLE'),
('G-02', 4, 'Outdoor Garden Terrace', 'AVAILABLE'),
('G-03', 6, 'Outdoor Garden Terrace', 'AVAILABLE'),
('R-01', 2, 'Rooftop Panoramic Deck', 'AVAILABLE'),
('R-02', 4, 'Rooftop Panoramic Deck', 'AVAILABLE'),
('VIP-01', 10, 'VIP Private Lounge', 'AVAILABLE'),
('VIP-02', 12, 'VIP Private Lounge', 'AVAILABLE'),
('P-01', 4, 'Poolside Deck', 'AVAILABLE'),
('P-02', 6, 'Poolside Deck', 'AVAILABLE');


