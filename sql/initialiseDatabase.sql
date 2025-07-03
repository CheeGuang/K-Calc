-- 0) Drop database if exists
IF DB_ID('kcalc') IS NOT NULL
BEGIN
    ALTER DATABASE kcalc SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE kcalc;
END
GO

-- 1) Create the database
CREATE DATABASE kcalc;
GO

-- 2) Use the new database
USE kcalc;
GO

-- 3) Create the Category table
CREATE TABLE dbo.Category (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE
);
GO

-- 4) Insert dummy data into Category
INSERT INTO dbo.Category (name) VALUES
('Mathematics'),
('Science'),
('Engineering'),
('Finance');
GO

-- 5) Select everything from Category
SELECT * FROM dbo.Category;
GO
