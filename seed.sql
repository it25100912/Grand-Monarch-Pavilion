-- ====================================================================
-- Grand Monarch Pavilion - Luxury Restaurant & Event Management System
-- SE2030 Software Engineering Assignment Project
-- Master Database Seed Data Script (seed.sql)
-- Comprehensive, Real-World Sample Data for Full System Demonstration
-- ====================================================================

USE `restaurant_event_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------------------
-- 1. RESTAURANTS & VENUE PROFILES
-- --------------------------------------------------------------------
INSERT INTO `restaurants` (`id`, `name`, `short_description`, `detailed_bio`, `cuisines`, `phone`, `email`, `website`, `opening_hours`, `closing_hours`, `logo_url`, `cover_image_url`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Grand Monarch Pavilion', 'Premier luxury fine dining and ballroom complex in Colombo 07', 'Grand Monarch Pavilion represents world-class culinary excellence and luxury event hospitality. Blending traditional Sri Lankan spices with modern international gastronomy, our complex hosts high-profile banquet events, corporate summits, and bespoke dining.', 'Fine Dining, Continental, Seafood, Sri Lankan Fusion, Haute Cuisine', '0112345678', 'concierge@grandmonarch.lk', 'https://grandmonarch.lk', '10:00 AM', '11:30 PM', 'images/logo.png', 'images/gourmet_feast.jpg', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- --------------------------------------------------------------------
-- 2. BRANCHES & HOSPITALITY PAVILIONS (8 Premier Locations)
-- --------------------------------------------------------------------
INSERT INTO `branches` (`id`, `restaurant_id`, `branch_code`, `branch_name`, `restaurant_name`, `branch_manager`, `phone`, `street_address`, `city`, `region_state`, `zip_code`, `seating_capacity`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'GMC-01', 'Colombo 07 Flagship Pavilion', 'Grand Monarch Pavilion', 'Dulanjee Supervisor', '0112678901', '450 Independence Avenue, Cinnamon Gardens', 'Colombo', 'Western Province', '00700', 350, 'OPEN', NOW(), NOW()),
(2, 1, 'GMC-02', 'Mount Lavinia Beachfront Pavilion', 'Grand Monarch Pavilion', 'Kamal Bandara', '0112712345', '100 Hotel Road, Mount Lavinia', 'Mount Lavinia', 'Western Province', '10370', 280, 'OPEN', NOW(), NOW()),
(3, 1, 'GMC-03', 'Kandy Royal Hillside Terrace', 'Grand Monarch Pavilion', 'Ruwan Senanayake', '0812234567', '45 Rajapihilla Mawatha, Kandy', 'Kandy', 'Central Province', '20000', 220, 'OPEN', NOW(), NOW()),
(4, 1, 'GMC-04', 'Negombo Lagoon Deck', 'Grand Monarch Pavilion', 'Chathura Fernando', '0312223344', '88 Pamunugama Road, Negombo', 'Negombo', 'Western Province', '11500', 200, 'OPEN', NOW(), NOW()),
(5, 1, 'GMC-05', 'Galle Fort Heritage Grand Hall', 'Grand Monarch Pavilion', 'Anoma Wickramasinghe', '0912234567', '12 Church Street, Galle Fort', 'Galle', 'Southern Province', '80000', 180, 'OPEN', NOW(), NOW()),
(6, 1, 'GMC-06', 'Nuwara Eliya Highlands Manor', 'Grand Monarch Pavilion', 'Dilan Jayasuriya', '0522223456', '25 Grand Hotel Road, Nuwara Eliya', 'Nuwara Eliya', 'Central Province', '22200', 150, 'OPEN', NOW(), NOW()),
(7, 1, 'GMC-07', 'Battaramulla Waters Edge Pavilion', 'Grand Monarch Pavilion', 'Niroshan Perera', '0112889900', '316 Pannipitiya Road, Battaramulla', 'Battaramulla', 'Western Province', '10120', 300, 'OPEN', NOW(), NOW()),
(8, 1, 'GMC-08', 'Kurunegala Royal Rock Pavilion', 'Grand Monarch Pavilion', 'Suresh Rathnayake', '0372223344', '14 Circular Road, Kurunegala', 'Kurunegala', 'North Western Province', '60000', 160, 'OPEN', NOW(), NOW())
ON DUPLICATE KEY UPDATE `branch_name`=VALUES(`branch_name`);

-- --------------------------------------------------------------------
-- 3. SYSTEM USERS (Staff and Customers - Shared Model)
-- Default Password for all demo accounts: 'admin123'
-- --------------------------------------------------------------------
INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `email`, `phone`, `role`, `status`, `role_type`, `address`, `job_position`, `department`, `branch`, `working_hours`, `created_at`) VALUES
(1, 'admin', '$2a$10$SSe4laUVTt6b0VfpoS4.we.Sn9euar66vtknewFSJlhCyBIvUoEMe', 'Nadin P.G.K. (Admin)', 'admin@restaurant.com', '0771234567', 'ADMIN', 'ACTIVE', 'STAFF', 'Pavilion Executive Suite, Level 4', 'General General Manager', 'Executive Administration', 'Colombo 07 Flagship Pavilion', '08:30 - 18:30', NOW()),
(2, 'coordinator', '$2a$10$SSe4laUVTt6b0VfpoS4.we.Sn9euar66vtknewFSJlhCyBIvUoEMe', 'Hellarawa H. M. V. K. B.', 'coordinator@restaurant.com', '0772345678', 'EVENT_COORDINATOR', 'ACTIVE', 'STAFF', 'Events Coordination Suite, Level 2', 'Chief Event Coordinator', 'Banquet & Events', 'Colombo 07 Flagship Pavilion', '10:00 AM - 07:00 PM', NOW()),
(3, 'finance', '$2a$10$SSe4laUVTt6b0VfpoS4.we.Sn9euar66vtknewFSJlhCyBIvUoEMe', 'Wijesingha W.M.G.K.', 'finance@restaurant.com', '0773456789', 'FINANCE_OFFICER', 'ACTIVE', 'STAFF', 'Finance & Treasury Department, Level 3', 'Senior Finance & Billing Officer', 'Finance & Billing', 'Colombo 07 Flagship Pavilion', '09:00 - 18:00', NOW()),
(4, 'supervisor', '$2a$10$SSe4laUVTt6b0VfpoS4.we.Sn9euar66vtknewFSJlhCyBIvUoEMe', 'Dulanjee R. K. K.', 'supervisor@restaurant.com', '0774567890', 'OPERATIONS_SUPERVISOR', 'ACTIVE', 'STAFF', 'Operations Hub, Level 1', 'Dining Hall & Venue Supervisor', 'Restaurant Operations', 'Colombo 07 Flagship Pavilion', '02:00 PM - 11:00 PM', NOW()),
(5, 'csr', '$2a$10$SSe4laUVTt6b0VfpoS4.we.Sn9euar66vtknewFSJlhCyBIvUoEMe', 'Jayakodi J.A.P.V.N.', 'csr@restaurant.com', '0775678901', 'CUSTOMER_SERVICE', 'ACTIVE', 'STAFF', 'Front Desk & Guest Concierge', 'Customer Service Representative', 'Customer Relations & Inventory', 'Colombo 07 Flagship Pavilion', '08:00 AM - 05:00 PM', NOW()),
(6, 'sandaruwan', '$2a$10$SSe4laUVTt6b0VfpoS4.we.Sn9euar66vtknewFSJlhCyBIvUoEMe', 'Sandaruwan D.G.I.', 'sandaruwan@gmail.com', '0719876543', 'CUSTOMER', 'ACTIVE', 'CUSTOMER', '15/3 Flower Road, Colombo 07', '', '', 'Colombo 07 Flagship Pavilion', '09:00 - 18:00', NOW()),
(7, 'kamal', '$2a$10$SSe4laUVTt6b0VfpoS4.we.Sn9euar66vtknewFSJlhCyBIvUoEMe', 'Kamal Perera', 'kamal@gmail.com', '0711122334', 'CUSTOMER', 'ACTIVE', 'CUSTOMER', '24 Beach Road, Mount Lavinia', '', '', 'Mount Lavinia Beachfront Pavilion', '09:00 - 18:00', NOW()),
(12, 'vihanga', '$2a$10$SSe4laUVTt6b0VfpoS4.we.Sn9euar66vtknewFSJlhCyBIvUoEMe', 'Vihanga Nethpahan', 'vihanga.nethpahan@gmail.com', '0778899999', 'CUSTOMER', 'ACTIVE', 'CUSTOMER', 'No 42/B, Havelock Road, Colombo 05', '', '', 'Colombo 07 Flagship Pavilion', '09:00 - 18:00', NOW()),
(13, 'kavindu', '$2a$10$SSe4laUVTt6b0VfpoS4.we.Sn9euar66vtknewFSJlhCyBIvUoEMe', 'Kavindu Perera', 'kavindu.perera@gmail.com', '0712345999', 'CUSTOMER', 'ACTIVE', 'CUSTOMER', '88/A Kandy Road, Kiribathgoda', '', '', 'Colombo 07 Flagship Pavilion', '09:00 - 18:00', NOW()),
(14, 'dinuka', '$2a$10$SSe4laUVTt6b0VfpoS4.we.Sn9euar66vtknewFSJlhCyBIvUoEMe', 'Dinuka Fernando', 'dinuka.fernando@gmail.com', '0765544332', 'CUSTOMER', 'ACTIVE', 'CUSTOMER', '74 Sea Street, Negombo', '', '', 'Negombo Lagoon Deck', '09:00 - 18:00', NOW()),
(15, 'naveen_9907', '$2a$10$SSe4laUVTt6b0VfpoS4.we.Sn9euar66vtknewFSJlhCyBIvUoEMe', 'Naveen Jayawardena', 'naveen_9907@gmail.com', '0771122334', 'CUSTOMER', 'ACTIVE', 'CUSTOMER', '18 Gregory\'s Road, Colombo 07', '', '', 'Colombo 07 Flagship Pavilion', '09:00 - 18:00', NOW()),
(16, 'leon', '$2a$10$SSe4laUVTt6b0VfpoS4.we.Sn9euar66vtknewFSJlhCyBIvUoEMe', 'Leon Kudaligama', 'leon@gmail.com', '0765424235', 'CUSTOMER', 'ACTIVE', 'CUSTOMER', '102 Ward Place, Colombo 07', '', '', 'Colombo 07 Flagship Pavilion', '09:00 - 18:00', NOW())
ON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`), `status`=VALUES(`status`);

-- --------------------------------------------------------------------
-- 4. RESTAURANT DINING TABLES (15 Realistic Tables Across Zones)
-- --------------------------------------------------------------------
INSERT INTO `restaurant_tables` (`id`, `table_number`, `capacity`, `location`, `status`) VALUES
(2, 'T-01', 2, 'Main Dining Indoor Hall', 'AVAILABLE'),
(3, 'T-02', 2, 'Main Dining Indoor Hall', 'AVAILABLE'),
(4, 'T-03', 4, 'Main Dining Indoor Hall', 'OCCUPIED'),
(5, 'T-04', 4, 'Main Dining Indoor Hall', 'AVAILABLE'),
(6, 'T-05', 6, 'Main Dining Indoor Hall', 'RESERVED'),
(7, 'T-06', 8, 'Main Dining Indoor Hall', 'AVAILABLE'),
(8, 'G-01', 4, 'Outdoor Garden Terrace', 'AVAILABLE'),
(9, 'G-02', 4, 'Outdoor Garden Terrace', 'AVAILABLE'),
(10, 'G-03', 6, 'Outdoor Garden Terrace', 'RESERVED'),
(11, 'R-01', 2, 'Rooftop Panoramic Deck', 'AVAILABLE'),
(12, 'R-02', 4, 'Rooftop Panoramic Deck', 'AVAILABLE'),
(13, 'VIP-01', 10, 'VIP Private Lounge', 'RESERVED'),
(14, 'VIP-02', 12, 'VIP Private Lounge', 'AVAILABLE'),
(15, 'P-01', 4, 'Poolside Deck', 'AVAILABLE'),
(16, 'P-02', 6, 'Poolside Deck', 'AVAILABLE')
ON DUPLICATE KEY UPDATE `table_number`=VALUES(`table_number`);

-- --------------------------------------------------------------------
-- 5. DINING RESERVATIONS (12 Actual Bookings)
-- --------------------------------------------------------------------
DELETE FROM `reservations` WHERE `id` >= 1;
INSERT INTO `reservations` (`id`, `customer_id`, `table_id`, `reservation_date`, `reservation_time`, `party_size`, `special_request`, `status`, `created_at`) VALUES
(1, 6, 2, '2026-10-07', '12:30:00', 2, 'Romantic anniversary dinner, quiet table requested', 'CONFIRMED', NOW()),
(2, 12, 4, '2026-10-07', '13:00:00', 4, 'High chair needed for toddler, seafood allergy alert', 'SEATED', NOW()),
(3, 7, 6, '2026-10-07', '19:30:00', 6, 'Birthday celebration dessert sparkler and candle', 'CONFIRMED', NOW()),
(4, 13, 8, '2026-10-08', '18:00:00', 4, 'Quiet garden corner, outdoor candlelight ambiance', 'CONFIRMED', NOW()),
(5, 14, 10, '2026-10-08', '19:00:00', 6, 'Family reunion, pre-ordered seafood platter', 'PENDING', NOW()),
(6, 15, 11, '2026-10-09', '20:00:00', 2, 'Champagne bucket on arrival, rooftop skyline view', 'CONFIRMED', NOW()),
(7, 16, 12, '2026-10-09', '20:30:00', 4, 'Sunset cocktail table and non-smoking zone', 'CONFIRMED', NOW()),
(8, 6, 13, '2026-10-10', '19:00:00', 10, 'Corporate partner dinner, privacy partition closed', 'CONFIRMED', NOW()),
(9, 12, 14, '2026-10-10', '12:00:00', 8, 'Business executive luncheon, projector access', 'PENDING', NOW()),
(10, 7, 15, '2026-10-11', '17:30:00', 4, 'Poolside sunset tapas and craft mocktails', 'CONFIRMED', NOW()),
(11, 13, 5, '2026-10-06', '13:00:00', 4, 'Guest has severe peanut allergy', 'COMPLETED', NOW()),
(12, 14, 7, '2026-10-06', '20:00:00', 8, 'Celebration dinner with assorted appetizers', 'COMPLETED', NOW());

-- --------------------------------------------------------------------
-- 6. BANQUET VENUES & BALLROOMS (10 Luxury Facilities)
-- --------------------------------------------------------------------
DELETE FROM `venues` WHERE `id` >= 1;
INSERT INTO `venues` (`id`, `name`, `description`, `capacity`, `price_per_hour`, `location`, `facilities`, `image_url`, `status`) VALUES
(1, 'Grand Monarch Imperial Ballroom', 'Palatial 600-guest ballroom with imported crystal chandeliers, royal stage, and dedicated bridal suite.', 600, 85000.00, 'Grand Wing - Level 1', 'Crystal Chandeliers, Central Climate Control, 4K LED Wall Screen, Stage, Bridal Suite, Valet Parking', 'images/venue_imperial_ballroom.jpg', 'AVAILABLE'),
(2, 'Royal Sapphire Banquet Hall', 'Regal ballroom designed for mid-sized weddings, award dinners, and musical recitals.', 400, 65000.00, 'Sapphire Wing - Level 2', 'Surround Acoustic Sound, Dimmable Mood Lighting, Buffet Stations, Dance Floor, VIP Greenroom', 'images/venue_sapphire_hall.jpg', 'AVAILABLE'),
(3, 'Lotus Lagoon Waterfront Pavilion', 'Open-air exotic pavilion by the water lily lake, ideal for fairy-tale wedding ceremonies and sunset banquets.', 300, 50000.00, 'Waterfront Deck', 'Open Air Waterfront Deck, Ambient Fairy Lights, Floating Stage, Cocktail Bar, Fountain Display', 'images/venue_lotus_lagoon.jpg', 'AVAILABLE'),
(4, 'Crystal Sky Terrace & Rooftop', 'Panoramic 8th-floor rooftop lounge overlooking the city skyline, perfect for cocktail soirees and anniversaries.', 200, 45000.00, 'Rooftop - Level 8', '360 Panoramic City View, Sunset Bar, Pergola Lounges, Live DJ Booth, Glass Balustrades', 'images/venue_crystal_sky.jpg', 'AVAILABLE'),
(5, 'The Golden Dynasty Ballroom', 'Majestic oriental-inspired ballroom with high coffered ceilings and acoustic wood finishes.', 500, 75000.00, 'Dynasty Wing - Level 1', 'High Ceilings, Acoustic Paneling, VIP Dining Alcove, Dual Projectors, Dressing Rooms', 'images/venue_golden_dynasty.jpg', 'AVAILABLE'),
(6, 'Orchid Garden Pavilion', 'Enchanting botanical lawn pavilion surrounded by royal palms, ideal for daytime garden weddings.', 250, 40000.00, 'Botanical Garden Courtyard', 'Lush Lawn, Garden Gazebo, Outdoor Banquet Lighting, Canopies, Photo Booth Alcoves', 'images/venue_orchid_garden.jpg', 'AVAILABLE'),
(7, 'Emerald Presidential Boardroom', 'State-of-the-art boardroom for high-stakes investor summits, corporate negotiations, and board dinners.', 50, 25000.00, 'Executive Wing - Level 3', '4K Video Conferencing, Smart Touch Displays, Ergonomic Seating, Private Pantry, High-speed Wi-Fi', 'images/venue_presidential_suite.jpg', 'AVAILABLE'),
(8, 'Majestic Horizon Pavilion', 'Sleek architectural pavilion featuring floor-to-ceiling glass walls and garden views.', 350, 55000.00, 'West Terraces', 'Glass Facade, Climate Control, Portable Dance Stage, Mood Lighting, Sound System', 'images/venue_majestic_horizon.jpg', 'AVAILABLE'),
(9, 'The Windsor Luxury Dining Hall', 'Aristocratic dining hall with rich mahogany furnishings, ideal for VIP private banquets.', 150, 35000.00, 'Windsor Wing - Level 2', 'Round Banquet Tables, Wine Cellar Showcase, Grand Piano Lounge, Butler Service', 'images/venue_windsor_hall.jpg', 'AVAILABLE'),
(10, 'Ocean Breeze Poolside Deck', 'Vibrant tropical poolside entertainment deck suited for youth galas, BBQ parties, and celebrations.', 180, 38000.00, 'Poolside Promenade', 'Resort Poolside Ambience, Tiki Cocktail Bar, Cabana Lounges, Live BBQ Grill Station', 'images/venue_poolside_deck.jpg', 'AVAILABLE');

-- --------------------------------------------------------------------
-- 7. EVENT PACKAGES (10 Tailored Event Packages)
-- --------------------------------------------------------------------
DELETE FROM `event_packages` WHERE `id` >= 1;
INSERT INTO `event_packages` (`id`, `name`, `tier`, `event_type`, `max_guests`, `price`, `description`, `services`, `status`, `created_at`) VALUES
(1, 'Royal Monarch Imperial Wedding', 'PLATINUM', 'WEDDING', 500, 1850000.00, 'Ultra-luxury all-inclusive wedding extravaganza with 7-course international buffet and royal decor.', '5-Tier Cake, Traditional Poruwa, Floral Stage Decor, Red Carpet, Welcome Cocktails, Live Band Sound, Luxury Bridal Suite', 'ACTIVE', NOW()),
(2, 'Silver Elegance Wedding Package', 'SILVER', 'WEDDING', 250, 950000.00, 'Classic sophisticated wedding reception tailored for intimate celebrations.', '3-Tier Cake, Standard Floral Setup, Welcome Drinks, Head Table Styling, Dedicated Event Butler', 'ACTIVE', NOW()),
(3, 'Golden Bliss Nuptial Package', 'GOLD', 'WEDDING', 350, 1350000.00, 'Refined luxury wedding reception package with customized dinner buffet and lighting.', 'Champagne Fountain, 4-Tier Cake, Poruwa & Settee Decor, DJ Sound & Stage Lighting, Traditional Oil Lamp', 'ACTIVE', NOW()),
(4, 'Global Corporate Summit & Dinner', 'PLATINUM', 'CORPORATE', 400, 1200000.00, 'Comprehensive full-day corporate conference package with keynote stage, lunch buffet, and dinner.', 'Dual 4K Laser Projectors, Wireless UHF Microphones, Podium, Morning & Afternoon Tea Breaks, Executive Buffet, Valet Parking', 'ACTIVE', NOW()),
(5, 'Executive Leadership Seminar', 'SILVER', 'CORPORATE', 80, 350000.00, 'Professional executive boardroom and workshop package with gourmet refreshments.', 'Interactive Smart Board, High-speed Wi-Fi, Stationery, Morning & Afternoon Tea Breaks, Plated Executive Lunch', 'ACTIVE', NOW()),
(6, 'Grand Annual Corporate Gala', 'GOLD', 'CORPORATE', 300, 980000.00, 'Spectacular awards ceremony and gala dinner celebration for corporate companies.', 'Awards Stage Backdrop, Follow-spot Lighting, 3-Course Plated Dinner, Red Carpet Entrance, Cocktail Bar Setup', 'ACTIVE', NOW()),
(7, 'Diamond Jubilee Birthday Extravaganza', 'PLATINUM', 'BIRTHDAY', 150, 650000.00, 'Vibrant milestone birthday celebration package with themed lighting and luxury catering.', 'Themed Floral Backdrop, Customized Birthday Cake, DJ & Lighting, Photo Booth, Luxury Dessert Table', 'ACTIVE', NOW()),
(8, 'Sweet Sixteen & Youth Soirée', 'SILVER', 'BIRTHDAY', 100, 420000.00, 'Fun, trendy birthday party package with mocktail bar and upbeat sound systems.', 'Neon Lighting & Signs, Mocktail Station, Finger Food Buffet, Bluetooth Sound System, Balloon Sculptures', 'ACTIVE', NOW()),
(9, 'Sunset Cocktail & Networking Soirée', 'GOLD', 'PARTY', 200, 750000.00, 'Chic rooftop or terrace party package featuring craft cocktails and gourmet canapés.', 'Open Cocktail Bar, Live Acoustic Music Setup, Lounge Sofas, Canapé Pass-around, Ambient Fairy Lights', 'ACTIVE', NOW()),
(10, 'Golden Heritage Anniversary Soirée', 'GOLD', 'PARTY', 180, 580000.00, 'Heartwarming wedding anniversary celebrations with elegant table setups and classical entertainment.', 'Memory Video Projection, Welcome Wine, Candlelit Table Centers, Gourmet Dinner Buffet, Anniversary Cake', 'ACTIVE', NOW());

-- --------------------------------------------------------------------
-- 8. BOOKED EVENTS (10 Actual Event Bookings)
-- --------------------------------------------------------------------
DELETE FROM `events` WHERE `id` >= 1;
INSERT INTO `events` (`id`, `customer_id`, `venue_id`, `event_title`, `event_type`, `event_date`, `start_time`, `end_time`, `expected_guests`, `special_requirements`, `status`, `advance_payment`, `booking_code`, `client_email`, `client_phone`, `package_id`, `package_name`, `total_price`, `created_at`) VALUES
(1, 6, 1, 'Sandaruwan & Dilini Royal Wedding', 'WEDDING', '2026-10-15', '10:00:00', '16:00:00', 400, 'Traditional Kandyan Poruwa with 4-tier customized fruit cake and gold flower decor.', 'APPROVED', 500000.00, 'EVT-2026-001', 'sandaruwan@gmail.com', '0719876543', 1, 'Royal Monarch Imperial Wedding', 1850000.00, NOW()),
(2, 12, 2, 'Virtusa Tech Annual Corporate Summit 2026', 'CORPORATE', '2026-10-20', '09:00:00', '17:00:00', 250, 'Requires dual laser projectors, live streaming setup, and international seafood buffet.', 'SCHEDULED', 400000.00, 'EVT-2026-002', 'vihanga.nethpahan@gmail.com', '0778899999', 4, 'Global Corporate Summit & Dinner', 1200000.00, NOW()),
(3, 7, 3, 'Kamal Perera 50th Golden Jubilee Birthday', 'BIRTHDAY', '2026-10-18', '18:00:00', '23:00:00', 150, 'Waterfront floating stage, DJ setup, and special chocolate fondue station.', 'APPROVED', 250000.00, 'EVT-2026-003', 'kamal@gmail.com', '0711122334', 7, 'Diamond Jubilee Birthday Extravaganza', 650000.00, NOW()),
(4, 13, 4, 'Colombo FinTech Networking & Cocktail Night', 'PARTY', '2026-10-25', '18:30:00', '23:30:00', 180, 'Rooftop cocktail bar, signature mocktails, live saxophonist, and ambient lounge lighting.', 'APPROVED', 300000.00, 'EVT-2026-004', 'kavindu.perera@gmail.com', '0712345999', 9, 'Sunset Cocktail & Networking Soirée', 750000.00, NOW()),
(5, 14, 5, 'Dinuka & Rashmi Traditional Poruwa Wedding', 'WEDDING', '2026-11-02', '09:30:00', '15:30:00', 350, 'Low country traditional dancers, vegetarian catering option for 50 guests.', 'SCHEDULED', 450000.00, 'EVT-2026-005', 'dinuka.fernando@gmail.com', '0765544332', 3, 'Golden Bliss Nuptial Package', 1350000.00, NOW()),
(6, 15, 7, 'Executive Strategy & Investor Conference', 'CORPORATE', '2026-10-12', '08:30:00', '14:00:00', 45, 'Boardroom setup, private catering, NDAs required for catering staff.', 'APPROVED', 150000.00, 'EVT-2026-006', 'naveen_9907@gmail.com', '0771122334', 5, 'Executive Leadership Seminar', 350000.00, NOW()),
(7, 16, 6, 'Leon & Amanda Garden Engagement Party', 'PARTY', '2026-10-28', '16:00:00', '22:00:00', 160, 'Fairy lights in trees, acoustic duo stage, outdoor lawn lounge chairs.', 'APPROVED', 200000.00, 'EVT-2026-007', 'leon@gmail.com', '0765424235', 9, 'Sunset Cocktail & Networking Soirée', 580000.00, NOW()),
(8, 6, 8, 'Sri Lanka Medical Association Annual Dinner', 'CORPORATE', '2026-11-10', '19:00:00', '23:30:00', 280, 'Awards stage, podium with company banner, formal 4-course dinner.', 'SCHEDULED', 350000.00, 'EVT-2026-008', 'sandaruwan@gmail.com', '0719876543', 6, 'Grand Annual Corporate Gala', 980000.00, NOW()),
(9, 12, 9, 'Dr. Nethpahan Silver Anniversary Soirée', 'PARTY', '2026-11-15', '18:00:00', '23:00:00', 120, 'Classical piano performance, commemorative wine glasses for guests.', 'PENDING', 200000.00, 'EVT-2026-009', 'vihanga.nethpahan@gmail.com', '0778899999', 10, 'Golden Heritage Anniversary Soirée', 580000.00, NOW()),
(10, 7, 10, 'Rotary Club Colombo Charity Gala 2026', 'OTHER', '2026-11-20', '18:30:00', '23:00:00', 170, 'Silent auction table, stage for live band, BBQ buffet dinner.', 'APPROVED', 250000.00, 'EVT-2026-010', 'kamal@gmail.com', '0711122334', 9, 'Sunset Cocktail & Networking Soirée', 720000.00, NOW());

-- --------------------------------------------------------------------
-- 9. RESOURCE INVENTORY (12 Equipment & Furniture Assets)
-- --------------------------------------------------------------------
DELETE FROM `resources` WHERE `id` >= 1;
INSERT INTO `resources` (`id`, `name`, `category`, `total_quantity`, `allocated_quantity`, `unit_price`, `status`) VALUES
(1, 'JBL Professional Line-Array PA System', 'AV_EQUIPMENT', 10, 4, 35000.00, 'AVAILABLE'),
(2, 'Epson 4K Ultra-Bright Laser Projector & Screen', 'AV_EQUIPMENT', 15, 6, 18000.00, 'AVAILABLE'),
(3, 'Shure Wireless Dual UHF Handheld Microphones', 'AV_EQUIPMENT', 30, 12, 5000.00, 'AVAILABLE'),
(4, 'Gold Chiavari Luxury Banquet Chairs', 'FURNITURE', 1200, 650, 350.00, 'AVAILABLE'),
(5, 'Round Royal Dining Tables (10-Seater)', 'FURNITURE', 150, 65, 2500.00, 'AVAILABLE'),
(6, 'VIP Velvet Chesterfield Lounges', 'FURNITURE', 25, 8, 8500.00, 'AVAILABLE'),
(7, 'Custom Grand Floral Wedding Arch & Poruwa', 'DECORATION', 8, 3, 45000.00, 'AVAILABLE'),
(8, 'Crystal LED Table Centerpieces (Set of 10)', 'DECORATION', 40, 18, 4500.00, 'AVAILABLE'),
(9, 'Red Carpet Runner (50ft Luxury Pile)', 'DECORATION', 12, 4, 7500.00, 'AVAILABLE'),
(10, 'Intelligent Moving-Head DMX Stage Lights', 'LIGHTING', 24, 10, 12000.00, 'AVAILABLE'),
(11, 'Outdoor Fairy Light Cascades (100m Set)', 'LIGHTING', 50, 20, 3500.00, 'AVAILABLE'),
(12, 'Stainless Steel Chafing Dish Roll-Top Stations', 'CATERING_EQUIPMENT', 60, 25, 2000.00, 'AVAILABLE');

-- --------------------------------------------------------------------
-- 10. EVENT RESOURCE ALLOCATIONS (15 Allocations)
-- --------------------------------------------------------------------
DELETE FROM `event_resources` WHERE `id` >= 1;
INSERT INTO `event_resources` (`id`, `event_id`, `resource_id`, `quantity`) VALUES
(1, 1, 1, 1),   -- JBL PA System for Sandaruwan Wedding
(2, 1, 4, 400), -- 400 Chiavari Chairs
(3, 1, 5, 40),  -- 40 Dining Tables
(4, 1, 7, 1),   -- Floral Poruwa
(5, 1, 10, 4),  -- 4 Stage Moving Lights
(6, 2, 2, 2),   -- 2 4K Projectors for Virtusa Summit
(7, 2, 3, 4),   -- 4 Shure Microphones
(8, 2, 4, 250), -- 250 Chairs
(9, 3, 1, 1),   -- Sound System for Kamal Birthday
(10, 3, 8, 15), -- 15 Crystal Centerpieces
(11, 4, 6, 6),  -- 6 VIP Velvet Lounges for FinTech Party
(12, 4, 11, 8), -- 8 Fairy Light Cascades
(13, 5, 4, 350),-- 350 Chairs for Dinuka Wedding
(14, 5, 7, 1),  -- Floral Arch
(15, 6, 2, 1);  -- 1 Projector for Executive Conference

-- --------------------------------------------------------------------
-- 11. INVOICES & BILLING (10 Commercial Invoices)
-- --------------------------------------------------------------------
DELETE FROM `invoices` WHERE `id` >= 1;
INSERT INTO `invoices` (`id`, `invoice_number`, `customer_id`, `booking_type`, `booking_id`, `subtotal`, `tax_amount`, `discount_amount`, `total_amount`, `status`, `created_at`) VALUES
(1, 'INV-2026-0001', 6, 'EVENT', 1, 1850000.00, 185000.00, 35000.00, 2000000.00, 'PARTIALLY_PAID', NOW()),
(2, 'INV-2026-0002', 12, 'EVENT', 2, 1200000.00, 120000.00, 20000.00, 1300000.00, 'PARTIALLY_PAID', NOW()),
(3, 'INV-2026-0003', 7, 'EVENT', 3, 650000.00, 65000.00, 15000.00, 700000.00, 'PARTIALLY_PAID', NOW()),
(4, 'INV-2026-0004', 13, 'EVENT', 4, 750000.00, 75000.00, 25000.00, 800000.00, 'PARTIALLY_PAID', NOW()),
(5, 'INV-2026-0005', 14, 'EVENT', 5, 1350000.00, 135000.00, 35000.00, 1450000.00, 'ISSUED', NOW()),
(6, 'INV-2026-0006', 15, 'EVENT', 6, 350000.00, 35000.00, 5000.00, 380000.00, 'PAID', NOW()),
(7, 'INV-2026-0007', 16, 'EVENT', 7, 580000.00, 58000.00, 18000.00, 620000.00, 'PARTIALLY_PAID', NOW()),
(8, 'INV-2026-0008', 6, 'RESERVATION', 1, 18500.00, 1850.00, 350.00, 20000.00, 'PAID', NOW()),
(9, 'INV-2026-0009', 12, 'RESERVATION', 2, 32000.00, 3200.00, 1200.00, 34000.00, 'PAID', NOW()),
(10, 'INV-2026-0010', 13, 'RESERVATION', 11, 28500.00, 2850.00, 850.00, 30500.00, 'PAID', NOW());

-- --------------------------------------------------------------------
-- 12. PAYMENTS & TRANSACTION RECEIPTS (10 Transactions)
-- --------------------------------------------------------------------
DELETE FROM `payments` WHERE `id` >= 1;
INSERT INTO `payments` (`id`, `invoice_id`, `payment_method`, `amount_paid`, `deposit_amount`, `balance_amount`, `booking_ref`, `customer_name`, `transaction_ref`, `status`, `verified_by`, `verified_at`, `slip_file_name`, `payment_date`) VALUES
(1, 1, 'BANK_TRANSFER', 500000.00, 500000.00, 1500000.00, 'EVT-2026-001', 'Sandaruwan D.G.I.', 'TXN-BOC-20261001-01', 'VERIFIED', 'Wijesingha (Finance)', NOW(), 'slips/boc_receipt_001.pdf', NOW()),
(2, 2, 'ONLINE_PAYMENT', 400000.00, 400000.00, 900000.00, 'EVT-2026-002', 'Vihanga Nethpahan', 'TXN-COMM-20261002-02', 'VERIFIED', 'Wijesingha (Finance)', NOW(), 'slips/comm_slip_002.pdf', NOW()),
(3, 3, 'CREDIT_CARD', 250000.00, 250000.00, 450000.00, 'EVT-2026-003', 'Kamal Perera', 'TXN-VISA-20261003-03', 'VERIFIED', 'Wijesingha (Finance)', NOW(), '', NOW()),
(4, 4, 'BANK_TRANSFER', 300000.00, 300000.00, 500000.00, 'EVT-2026-004', 'Kavindu Perera', 'TXN-HNB-20261004-04', 'VERIFIED', 'Wijesingha (Finance)', NOW(), 'slips/hnb_transfer_004.pdf', NOW()),
(5, 5, 'BANK_TRANSFER', 450000.00, 450000.00, 1000000.00, 'EVT-2026-005', 'Dinuka Fernando', 'TXN-SAMP-20261005-05', 'PENDING_VERIFICATION', NULL, NULL, 'slips/sampath_slip_005.pdf', NOW()),
(6, 6, 'ONLINE_PAYMENT', 380000.00, 380000.00, 0.00, 'EVT-2026-006', 'Naveen Jayawardena', 'TXN-MAST-20261005-06', 'VERIFIED', 'Wijesingha (Finance)', NOW(), '', NOW()),
(7, 7, 'CASH', 200000.00, 200000.00, 420000.00, 'EVT-2026-007', 'Leon Kudaligama', 'TXN-CSH-20261006-07', 'VERIFIED', 'Wijesingha (Finance)', NOW(), '', NOW()),
(8, 8, 'CREDIT_CARD', 20000.00, 20000.00, 0.00, 'RES-2026-001', 'Sandaruwan D.G.I.', 'TXN-POS-20261007-08', 'VERIFIED', 'Wijesingha (Finance)', NOW(), '', NOW()),
(9, 9, 'CREDIT_CARD', 34000.00, 34000.00, 0.00, 'RES-2026-002', 'Vihanga Nethpahan', 'TXN-POS-20261007-09', 'VERIFIED', 'Wijesingha (Finance)', NOW(), '', NOW()),
(10, 10, 'CASH', 30500.00, 30500.00, 0.00, 'RES-2026-011', 'Kavindu Perera', 'TXN-CSH-20261006-10', 'VERIFIED', 'Wijesingha (Finance)', NOW(), '', NOW());

-- --------------------------------------------------------------------
-- 13. STAFF TASKS & DUTY ROSTERS (10 Operational Tasks)
-- --------------------------------------------------------------------
DELETE FROM `staff_tasks` WHERE `id` >= 1;
INSERT INTO `staff_tasks` (`id`, `title`, `description`, `assigned_staff_id`, `assigned_staff_name`, `branch_name`, `booking_ref`, `priority`, `status`, `due_date_time`, `created_at`) VALUES
(1, 'Imperial Ballroom Sound & Stage Check', 'Conduct thorough acoustic soundcheck and 4K LED test for Sandaruwan Wedding.', 2, 'Hellarawa (Coordinator)', 'Colombo 07 Flagship Pavilion', 'EVT-2026-001', 'HIGH', 'IN_PROGRESS', '2026-10-15 08:30', NOW()),
(2, 'Virtusa Summit AV & Keynote Rehearsal', 'Inspect dual laser projectors and test 4 wireless UHF lapels with corporate team.', 2, 'Hellarawa (Coordinator)', 'Colombo 07 Flagship Pavilion', 'EVT-2026-002', 'MEDIUM', 'PENDING', '2026-10-19 16:00', NOW()),
(3, 'Dinner Rush Table & Cutlery Setup', 'Verify table arrangements and polish silverware for dinner rush (Tables T-01 to T-06).', 4, 'Dulanjee (Supervisor)', 'Colombo 07 Flagship Pavilion', 'RES-DAILY-1007', 'HIGH', 'COMPLETED', '2026-10-07 18:00', NOW()),
(4, 'Chiavari Chairs Inventory & Quality Audit', 'Inspect 400 Chiavari chairs and clean gold finish before weekend banquet.', 5, 'Jayakodi (CSR/Inventory)', 'Colombo 07 Flagship Pavilion', 'INV-RES-CHK', 'LOW', 'COMPLETED', '2026-10-06 14:00', NOW()),
(5, 'Verify Advance Payment Slips for October Bookings', 'Reconcile Sampath and BOC bank transfer slips with event invoices in finance portal.', 3, 'Wijesingha (Finance)', 'Colombo 07 Flagship Pavilion', 'FIN-REC-2026', 'HIGH', 'IN_PROGRESS', '2026-10-08 11:00', NOW()),
(6, 'Lotus Lagoon Floating Stage Floral Setup', 'Supervise florist team in decorating floating stage and perimeter fairy lights.', 4, 'Dulanjee (Supervisor)', 'Colombo 07 Flagship Pavilion', 'EVT-2026-003', 'MEDIUM', 'PENDING', '2026-10-18 12:00', NOW()),
(7, 'Rooftop Panoramic Deck Safety Inspection', 'Check glass balustrades, pergola retractors, and terrace spotlights on 8th floor.', 4, 'Dulanjee (Supervisor)', 'Colombo 07 Flagship Pavilion', 'MAINT-ROOF-01', 'MEDIUM', 'COMPLETED', '2026-10-05 10:00', NOW()),
(8, 'VIP Dietary & Allergy Follow-up Calls', 'Call customer Vihanga regarding seafood allergy precautions for upcoming banquet.', 5, 'Jayakodi (CSR)', 'Colombo 07 Flagship Pavilion', 'INQ-2026-889', 'MEDIUM', 'IN_PROGRESS', '2026-10-08 15:00', NOW()),
(9, 'Monthly Financial VAT & Revenue Report', 'Generate Q3 tax filing breakdown and compile credit card settlement reports.', 3, 'Wijesingha (Finance)', 'Colombo 07 Flagship Pavilion', 'FIN-VAT-Q3', 'HIGH', 'PENDING', '2026-10-10 17:00', NOW()),
(10, 'Staff Shift Rostering for October Peak Weddings', 'Organize shifts and banquet captain rosters for upcoming 4 weekend weddings.', 1, 'Nadin P.G.K. (Admin)', 'Colombo 07 Flagship Pavilion', 'ADMIN-ROTA-10', 'URGENT', 'COMPLETED', '2026-10-06 16:30', NOW());

-- --------------------------------------------------------------------
-- 14. NOTIFICATIONS (10 System Notifications)
-- --------------------------------------------------------------------
DELETE FROM `notifications` WHERE `id` >= 1;
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `is_read`, `created_at`) VALUES
(1, 1, 'New Event Booking Approved', 'Sandaruwan & Dilini Royal Wedding (EVT-2026-001) has been approved for Oct 15, 2026.', 0, NOW()),
(2, 2, 'Task Assignment: Stage Check', 'You have been assigned to supervise the Imperial Ballroom sound rehearsal.', 0, NOW()),
(3, 3, 'Advance Payment Received', 'BOC Bank transfer of LKR 500,000 received for Invoice INV-2026-0001.', 1, NOW()),
(4, 4, 'Dining Table Floor Plan Update', '15 dining tables are set to active. Evening dinner bookings require allocation.', 0, NOW()),
(5, 6, 'Wedding Booking Confirmed', 'Your wedding reservation at Grand Monarch Imperial Ballroom is confirmed for Oct 15.', 0, NOW()),
(6, 12, 'Table Reservation Confirmed', 'Your table reservation at Table T-03 (Main Dining Hall) is confirmed for today.', 0, NOW()),
(7, 7, 'Invoice Ready for Review', 'Invoice INV-2026-0003 for your Golden Jubilee Birthday has been generated.', 0, NOW()),
(8, 13, 'Garden Table Booking Confirmed', 'Table G-01 at Outdoor Garden Terrace reserved for Oct 08 at 18:00.', 1, NOW()),
(9, 5, 'Guest Allergy Alert Recorded', 'Customer Vihanga added a seafood allergy note for Table T-03 reservation.', 0, NOW()),
(10, 14, 'Traditional Poruwa Wedding Scheduled', 'Golden Dynasty Ballroom setup scheduled for Nov 02, 2026.', 0, NOW());

-- --------------------------------------------------------------------
-- 15. OPERATION AUDIT ACTIVITIES (10 Activity Logs)
-- --------------------------------------------------------------------
DELETE FROM `operation_activities` WHERE `id` >= 1;
INSERT INTO `operation_activities` (`id`, `actor`, `title`, `description`, `type`, `timestamp`) VALUES
(1, 'Nadin (Admin)', 'System Initialization', 'Grand Monarch Pavilion core database initialized with multi-branch configuration.', 'SYSTEM_INIT', NOW() - INTERVAL 5 DAY),
(2, 'Hellarawa (Coordinator)', 'Event Booking Approved', 'Approved Sandaruwan & Dilini Royal Wedding (EVT-2026-001) for Imperial Ballroom.', 'EVENT_APPROVAL', NOW() - INTERVAL 4 DAY),
(3, 'Wijesingha (Finance)', 'Advance Payment Verified', 'Verified LKR 500,000 BOC bank transfer deposit for invoice INV-2026-0001.', 'PAYMENT_PROCESSED', NOW() - INTERVAL 3 DAY),
(4, 'Dulanjee (Supervisor)', 'Floor Plan Activated', 'Configured and activated 15 luxury dining tables across 5 dining zones.', 'TABLE_ALLOCATION', NOW() - INTERVAL 2 DAY),
(5, 'Jayakodi (CSR)', 'Guest Check-in Completed', 'Checked in customer Vihanga Nethpahan for Table T-03 luncheon reservation.', 'GUEST_CHECKIN', NOW() - INTERVAL 1 DAY),
(6, 'Hellarawa (Coordinator)', 'Package Catalog Updated', 'Published Royal Monarch Imperial Wedding and Corporate Summit packages.', 'PACKAGE_CREATED', NOW() - INTERVAL 20 HOUR),
(7, 'Dulanjee (Supervisor)', 'Resource Allocated to Wedding', 'Dispatched 400 Gold Chiavari chairs and JBL Line-Array sound to Ballroom 1.', 'RESOURCE_ALLOCATED', NOW() - INTERVAL 12 HOUR),
(8, 'Wijesingha (Finance)', 'Quarterly Revenue Generated', 'Compiled monthly banquet billing summary and digital receipts.', 'REPORT_GENERATED', NOW() - INTERVAL 6 HOUR),
(9, 'Jayakodi (CSR)', 'VIP Profile Updated', 'Recorded dietary preferences and special request notes for guest Kamal Perera.', 'PROFILE_UPDATE', NOW() - INTERVAL 3 HOUR),
(10, 'Dulanjee (Supervisor)', 'Rooftop Facility Inspected', 'Conducted safety walkthrough and pergola inspection on Crystal Sky Terrace.', 'MAINTENANCE', NOW() - INTERVAL 1 HOUR);

SET FOREIGN_KEY_CHECKS = 1;
