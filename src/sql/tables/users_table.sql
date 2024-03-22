-- Create the user table if it doesn't exist
USE vanilla_social_media_db;

CREATE TABLE IF NOT EXISTS  users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    account_verification ENUM("NOT_VERIFIED","VERIFIED") DEFAULT "NOT_VERIFIED",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM users;

