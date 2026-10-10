-- =====================================================================
-- FINTECH BANK MANAGEMENT - DATABASE SCHEMA & INITIAL DEMO DATA
-- Use this file to present your database in MySQL Workbench or CMD!
-- =====================================================================

CREATE DATABASE IF NOT EXISTS bankdb;
USE bankdb;

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bank Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(30) NOT NULL UNIQUE,
    account_type VARCHAR(20) NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    customer_id BIGINT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_account_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);

-- 3. Transactions Audit Ledger Table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    description VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transaction_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- =====================================================================
-- PRESENTATION DEMO SEED DATA (Ready for your viva / live presentation)
-- =====================================================================

INSERT IGNORE INTO customers (id, first_name, last_name, email, phone, address, created_at) VALUES
(1, 'Alex', 'Rivera', 'alex.rivera@fintech.test', '+1-555-0182', '45 Wall Street, New York, NY', NOW()),
(2, 'Sophia', 'Chen', 'sophia.chen@fintech.test', '+1-555-0199', '88 Silicon Valley Blvd, San Jose, CA', NOW()),
(3, 'Marcus', 'Sterling', 'marcus.s@fintech.test', '+44-20-7946-0921', '12 Canary Wharf, London, UK', NOW());

INSERT IGNORE INTO accounts (id, account_number, account_type, balance, customer_id, active, created_at) VALUES
(1, 'FTBK8187578194', 'SAVINGS', 12500.00, 1, TRUE, NOW()),
(2, 'FTBK9482017382', 'CURRENT', 4850.50, 2, TRUE, NOW()),
(3, 'FTBK3198472910', 'SAVINGS', 250000.00, 3, TRUE, NOW());

INSERT IGNORE INTO transactions (id, account_id, type, amount, balance_after, description, timestamp) VALUES
(1, 1, 'DEPOSIT', 10000.00, 10000.00, 'Initial opening deposit', NOW() - INTERVAL 5 DAY),
(2, 1, 'DEPOSIT', 2500.00, 12500.00, 'Monthly consulting fee deposit', NOW() - INTERVAL 1 DAY),
(3, 2, 'DEPOSIT', 5000.00, 5000.00, 'Corporate escrow deposit', NOW() - INTERVAL 3 DAY),
(4, 2, 'WITHDRAWAL', 149.50, 4850.50, 'ATM withdrawal', NOW() - INTERVAL 2 HOUR),
(5, 3, 'DEPOSIT', 250000.00, 250000.00, 'Investment portfolio credit', NOW() - INTERVAL 10 DAY);

-- Useful presentation queries:
-- SELECT * FROM customers;
-- SELECT * FROM accounts;
-- SELECT * FROM transactions ORDER BY timestamp DESC;
-- SELECT c.first_name, c.last_name, a.account_number, a.account_type, a.balance FROM customers c JOIN accounts a ON c.id = a.customer_id;
