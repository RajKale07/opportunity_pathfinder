CREATE DATABASE IF NOT EXISTS opportunity_pathfinder;
USE opportunity_pathfinder;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    is_verified BOOLEAN DEFAULT FALSE,
    otp VARCHAR(6),
    otp_expiry DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    doc_type VARCHAR(50),
    extracted_text LONGTEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    source VARCHAR(50) DEFAULT 'OCR',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    dob VARCHAR(20),
    gender VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100),
    category VARCHAR(50),
    annual_income VARCHAR(50),
    employment_status VARCHAR(50),
    tenth_percentage VARCHAR(20),
    twelfth_percentage VARCHAR(20),
    graduation_cgpa VARCHAR(20),
    graduation_degree VARCHAR(100),
    graduation_branch VARCHAR(100),
    graduation_year VARCHAR(10),
    experience VARCHAR(50),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
