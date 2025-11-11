CREATE DATABASE IF NOT EXISTS fps_inventory;

USE fps_inventory;

CREATE TABLE IF NOT EXISTS equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id VARCHAR(20) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    responsible VARCHAR(100) NOT NULL,
    purchase_date DATE NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    currency ENUM('USD', 'CDF') NOT NULL,
    useful_life INT NOT NULL,
    depreciation_method VARCHAR(50) NOT NULL,
    depreciation_rate DECIMAL(5,2) NOT NULL,
    accumulated_depreciation DECIMAL(10,2) NOT NULL,
    net_book_value DECIMAL(10,2) NOT NULL,
    condition_status VARCHAR(50) NOT NULL,
    alert VARCHAR(255),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
