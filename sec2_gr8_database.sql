SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

DROP DATABASE IF EXISTS coffee;
CREATE DATABASE coffee;
USE coffee;

-- ===========================================================
-- TABLE: User_Account
-- ===========================================================
CREATE TABLE User_Account (
    User_ID CHAR(10) PRIMARY KEY,
    Username VARCHAR(50)  NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Create_Date DATE NOT NULL,
    Date_of_Birth DATE NOT NULL,
    First_Name VARCHAR(50)  NOT NULL,
    Last_Name VARCHAR(50)  NOT NULL,
    Address VARCHAR(100) NOT NULL,
    Phone_Number CHAR(10)  NOT NULL,
    Role ENUM('CUSTOMER','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    Is_Active TINYINT(1) NOT NULL DEFAULT 1,
    Last_Login DATETIME NULL
);


INSERT INTO User_Account VALUES
('U001','Nattakit','$2b$10$6u9L9.XMniX.j9FGWi1KhemB0w2Xw5kL3zzRkwJ/HNbanjZSGmTOO','2025-10-29','2000-01-01','Nattakit','Kiewchaum','Bangkok','0123456789','CUSTOMER',1,NULL),
('U002','Naruepon','$2b$10$wF1mvE/VqRjVYLRNvKcW/OHsK3dwuO3xZPNZ54qkS3VvOjSNpP9QC','2025-10-29','1995-01-01','Naruepon','Santipapchai','Bangkok','0987654321','CUSTOMER',1,NULL),
('U003','Thanamet','$2b$10$ZCrpYv.0GOkmUfcbgBNolORd65N0fJJ7y8psZuJRj3rkMR0obAgc.','2025-10-29','1995-01-01','Thanamet','Datharach','Bangkok','0987654321','ADMIN',1,NULL),
('U004','Babu','$2b$10$LN9HufypcmeybL90gYStX.SQEx5UbZeJwkK7YJXkL9IU0Hx.pt5Ye','2025-10-29','1995-01-01','Phumet','Babu','Bangkok','0987654321','CUSTOMER',1,NULL),
('U005','admin','$2b$10$08o847NUWnA8XR9KqAvTHeJfEZ5pGH2zWoQCH53kacqsahyJNY9e','2025-11-06','1990-01-01','System','Administrator','Head Office','0000000000','ADMIN',1,NULL);

-- ===========================================================
-- TABLE: Login
-- ===========================================================
CREATE TABLE Login (
    Login_ID CHAR(10) PRIMARY KEY,
    User_ID CHAR(10) NOT NULL,
    Login_Time DATETIME NOT NULL,
    Logout_Time DATETIME NULL,
    Login_Status VARCHAR(20) NOT NULL,
    Login_Ip VARCHAR(45) NOT NULL
);

INSERT INTO Login VALUES
('L001','U001','2025-11-05 08:00:00','2025-11-05 09:00:00','Success','192.168.1.10'),
('L002','U002','2025-11-05 09:30:00','2025-11-05 10:15:00','Success','192.168.1.11'),
('L003','U003','2025-11-05 11:00:00','2025-11-05 11:45:00','Failed','192.168.1.12'),
('L004','U004','2025-11-05 13:00:00','2025-11-05 14:00:00','Success','192.168.1.13');

-- ===========================================================
-- TABLE: Product (⭐ FIXED Product_ID AUTO_INCREMENT)
-- ===========================================================
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE Product (
    Product_ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Product_Name VARCHAR(50) NOT NULL,
    Product_Source VARCHAR(50),
    Roast_Level ENUM('L', 'M', 'D') NOT NULL,
    Size VARCHAR(50) NOT NULL,
    Taste_Note VARCHAR(200),
    Price_per_kg DECIMAL(8,2) NOT NULL,
    Image_URL LONGTEXT
);

INSERT INTO Product (Product_ID, Product_Name, Product_Source, Roast_Level, Size, Taste_Note, Price_per_kg, Image_URL) VALUES
(1,'Tum Ja Ja Blend','Brazil','D','1kg','Bold and rich with notes of dark chocolate and roasted nuts. Full-bodied.',850.00,'https://i.pinimg.com/736x/76/cb/0a/76cb0a8eebf20c401fece9fdd452ba1e.jpg'),
(2,'Andes Blend','Columbia','M','1kg','A smooth balance of bright acidity and caramel sweetness.',950.00,'https://i.pinimg.com/736x/81/7a/38/817a3844ae548bfa6f51670c68bfffd4.jpg'),
(3,'Doichang Blend','Thai','M','500g','Warm and comforting with soft milk chocolate tones.',800.00,'https://i.pinimg.com/736x/73/9d/68/739d68379323c7413fd77be75963ad55.jpg'),
(4,'Lalibela Blend','Ethiopia','L','1kg','Floral and fruity with jasmine and citrus.',1350.00,'https://i.pinimg.com/736x/17/c5/3a/17c53acb12816d45c0ab892ad7bf38a7.jpg'),
(5,'Goji Blend','Geisha','L','250g','Elegant and aromatic with dried berries.',2000.00,'https://i.pinimg.com/736x/f1/8b/6d/f18b6dfdc902cc68970b960cd4fa5111.jpg'),
(6,'Holidays Blend','Brazil, Columbia','D','1kg','Cozy and festive.',1000.00,'https://i.pinimg.com/736x/c8/f2/47/c8f247a038690f6c40932adfe7d46762.jpg'),
(7,'Hondurus Blend','Japan','L','500g','Sweet and mellow.',1050.00,'https://i.pinimg.com/736x/40/ed/c9/40edc9416a10b57c204ecc4927ef7a9b.jpg'),
(8,'House Blend','Japan','D','1kg','A classic dark roast.',850.00,'https://i.pinimg.com/736x/97/1b/16/971b16a55584591a68f792571bf02f72.jpg'),
(9,'Maejuntai Blend','Thai','L','500g','Bright and floral.',950.00,'https://i.pinimg.com/736x/13/47/3b/13473bd51b27cc7fab5b26cc87574945.jpg'),
(10,'Moonstones Blend','Ethiopia, Geisha','L','250g','Fragrant and refined.',1800.00,'https://i.pinimg.com/736x/22/10/72/2210725128778112ad50c8ad1efb6b18.jpg'),
(11,'Pangkhon Blend','Thai','M','500g','Fresh and vibrant.',1000.00,'https://i.pinimg.com/736x/b7/01/9f/b7019ffd91401c382192e3cdc2bba9ab.jpg'),
(12,'Rebirth Blend','Thai, Japan','L','250g','Refreshing fusion.',1100.00,'https://i.pinimg.com/736x/b7/0c/ef/b70cef43fb85c98fd648675db3151d27.jpg'),
(13,'Restinpeach Blend','Japan, Ethiopia','L','250g','Juicy and sweet.',1400.00,'https://i.pinimg.com/736x/2a/07/b9/2a07b9aae4467a13326d83bb8c368e41.jpg'),
(14,'Rumbarel Blend','Europe','D','250g','Deep and mature.',1520.00,'https://i.pinimg.com/736x/08/9d/f1/089df1d477ec655d47829c4dfdeca19b.jpg'),
(15,'Sateeberral Blend','Europe, Columbia','L','500g','Fruity and bright.',1100.00,'https://i.pinimg.com/736x/24/48/ec/2448ecfda761a48be07942a85cd70048.jpg');

-- ===========================================================
-- TABLE: Promotions
-- ===========================================================
CREATE TABLE Promotions (
    Promotion_ID CHAR(10) PRIMARY KEY,
    Promotion_Name VARCHAR(50) NOT NULL,
    Discount_Value DECIMAL(8,2) NOT NULL,
    Promotion_Status VARCHAR(20) NOT NULL,
    Promotion_Start_Date DATE NOT NULL,
    Promotion_End_Date DATE NOT NULL
);

INSERT INTO Promotions VALUES
('P001','Buy 2 Get 1 Free',0.00,'Active','2025-11-01','2025-12-31'),
('P002','Weekend 10% Off',10.00,'Active','2025-11-02','2025-11-30'),
('P003','Black Friday 25%',25.00,'Upcoming','2025-11-29','2025-12-02'),
('P004','New Year Special',20.00,'Planned','2025-12-25','2026-01-05');

-- ===========================================================
-- TABLE: Has_ProductPromotions
-- ===========================================================
CREATE TABLE Has_ProductPromotions (
    Product_ID INT NOT NULL,
    Promotion_ID CHAR(10) NOT NULL,
    PRIMARY KEY (Product_ID, Promotion_ID)
);

INSERT INTO Has_ProductPromotions VALUES
(1,'P001'),
(2,'P002'),
(5,'P003'),
(10,'P004'),
(15,'P002');

-- ===========================================================
-- TABLE: Manage_UserProduct
-- ===========================================================
CREATE TABLE Manage_UserProduct (
    Product_ID INT NOT NULL,
    User_ID CHAR(10) NOT NULL,
    PRIMARY KEY (Product_ID, User_ID)
);

INSERT INTO Manage_UserProduct VALUES
(1,'U001'),
(2,'U002'),
(3,'U003'),
(4,'U004'),
(5,'U001'),
(6,'U002');

-- ===========================================================
-- TABLE: User_Email
-- ===========================================================
CREATE TABLE User_Email (
    User_ID CHAR(10) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    PRIMARY KEY (User_ID, Email)
);

INSERT INTO User_Email VALUES
('U001','nattakit@example.com'),
('U002','naruepon@example.com'),
('U003','thanamet@example.com'),
('U004','babu@example.com'),
('U005','admin@example.com');

-- ===========================================================
-- FOREIGN KEYS
-- ===========================================================

ALTER TABLE Login
    ADD CONSTRAINT fk_login_user FOREIGN KEY (User_ID)
    REFERENCES User_Account(User_ID) ON DELETE CASCADE;

ALTER TABLE User_Email
    ADD CONSTRAINT fk_useremail_user FOREIGN KEY (User_ID)
    REFERENCES User_Account(User_ID) ON DELETE CASCADE;

ALTER TABLE Manage_UserProduct
    ADD CONSTRAINT fk_mup_user FOREIGN KEY (User_ID)
    REFERENCES User_Account(User_ID) ON DELETE CASCADE,
    ADD CONSTRAINT fk_mup_product FOREIGN KEY (Product_ID)
    REFERENCES Product(Product_ID) ON DELETE CASCADE;

ALTER TABLE Has_ProductPromotions
    ADD CONSTRAINT fk_hpp_product FOREIGN KEY (Product_ID)
    REFERENCES Product(Product_ID) ON DELETE CASCADE,
    ADD CONSTRAINT fk_hpp_promotion FOREIGN KEY (Promotion_ID)
    REFERENCES Promotions(Promotion_ID) ON DELETE CASCADE;

ALTER TABLE User_Account ADD Profile_Image LONGTEXT;

SET FOREIGN_KEY_CHECKS = 1;

COMMIT;

-- ในกรณีที่ไม่สามารถสร้าง Users and Privileges
-- DROP USER IF EXISTS 'CoffeeShop'@'localhost';
-- CREATE USER 'CoffeeShop'@'localhost' IDENTIFIED BY 'Coffee1234';
-- GRANT ALL PRIVILEGES ON *.* TO 'CoffeeShop'@'localhost';
-- FLUSH PRIVILEGES;

FLUSH TABLE;
SELECT * FROM User_Account;
SELECT * FROM Product;




