CREATE TABLE proj_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE form_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    fio VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    dat DATE NOT NULL,
    radio ENUM('M', 'W') NOT NULL,
    bio TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES proj_users(id) ON DELETE CASCADE
);

CREATE TABLE languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO languages (name) VALUES 
('Pascal'), ('C'), ('C++'), ('JavaScript'), ('PHP'), ('Python'), ('Java'), ('Haskel'), ('Clojure'), ('Prolog'), ('Scala');