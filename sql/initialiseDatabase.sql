-- 1) Use the new database
USE kcalc;
GO

-- 2) Drop tables if they exist
IF OBJECT_ID('dbo.CategorySegment', 'U') IS NOT NULL
    DROP TABLE dbo.CategorySegment;
IF OBJECT_ID('dbo.Category', 'U') IS NOT NULL
    DROP TABLE dbo.Category;
GO

-- 3) Create Category table
CREATE TABLE dbo.Category (
    id INT IDENTITY(1,1) PRIMARY KEY,
    categoryNumber NVARCHAR(100) NOT NULL UNIQUE,
    name NVARCHAR(100) NOT NULL UNIQUE
);
GO

-- 4) Create CategorySegment table
CREATE TABLE dbo.CategorySegment (
    id INT IDENTITY(1,1) PRIMARY KEY,
    category_id INT FOREIGN KEY REFERENCES dbo.Category(id),
    year INT NOT NULL,
    category_segment NVARCHAR(255) NOT NULL,
    category_segment_unit NVARCHAR(100),
    category_segment_value FLOAT,
    emission_factor FLOAT,
    formula NVARCHAR(MAX)
);
GO

-- 5) Insert data into Category
INSERT INTO dbo.Category (categoryNumber, name) VALUES
('Category 1', 'Purchased Goods and Services'),
('Category 6', 'Business Travel'),
('Category 4', 'Upstream Transportation and Distribution'),
('Category 7', 'Employee Commuting');
GO

-- 6) Insert data into CategorySegment

-- Category 1: Purchased Goods and Services
INSERT INTO dbo.CategorySegment (category_id, year, category_segment, category_segment_unit, category_segment_value, emission_factor, formula) VALUES
(1, 2020, 'Bunkering cost', 'SGD', 510000, 0.788, 'Emissions = Cost × Emission Factor'),
(1, 2021, 'Bunkering cost', 'SGD', 550000, 0.788, 'Emissions = Cost × Emission Factor'),
(1, 2022, 'Bunkering cost', 'SGD', 460000, 0.788, 'Emissions = Cost × Emission Factor'),
(1, 2023, 'Bunkering cost', 'SGD', 470000, 0.788, 'Emissions = Cost × Emission Factor'),
(1, 2024, 'Bunkering cost', 'SGD', 430000, 0.788, 'Emissions = Cost × Emission Factor'),
(1, 2025, 'Bunkering cost', 'SGD', 250000, 0.788, 'Emissions = Cost × Emission Factor'),

(1, 2020, 'Stevedoring cost', 'SGD', 200000, 0.208, 'Emissions = Cost × Emission Factor'),
(1, 2021, 'Stevedoring cost', 'SGD', 220000, 0.208, 'Emissions = Cost × Emission Factor'),
(1, 2022, 'Stevedoring cost', 'SGD', 180000, 0.208, 'Emissions = Cost × Emission Factor'),
(1, 2023, 'Stevedoring cost', 'SGD', 190000, 0.208, 'Emissions = Cost × Emission Factor'),
(1, 2024, 'Stevedoring cost', 'SGD', 170000, 0.208, 'Emissions = Cost × Emission Factor'),
(1, 2025, 'Stevedoring cost', 'SGD', 100000, 0.208, 'Emissions = Cost × Emission Factor'),

(1, 2020, 'Transportation of machinery b/n brand and shipyard', 'SGD', 60000, 0.14, 'Emissions = Cost × Emission Factor'),
(1, 2021, 'Transportation of machinery b/n brand and shipyard', 'SGD', 70000, 0.14, 'Emissions = Cost × Emission Factor'),
(1, 2022, 'Transportation of machinery b/n brand and shipyard', 'SGD', 50000, 0.14, 'Emissions = Cost × Emission Factor'),
(1, 2023, 'Transportation of machinery b/n brand and shipyard', 'SGD', 55000, 0.14, 'Emissions = Cost × Emission Factor'),
(1, 2024, 'Transportation of machinery b/n brand and shipyard', 'SGD', 48000, 0.14, 'Emissions = Cost × Emission Factor'),
(1, 2025, 'Transportation of machinery b/n brand and shipyard', 'SGD', 30000, 0.14, 'Emissions = Cost × Emission Factor');

-- Category 2: Business Travel
INSERT INTO dbo.CategorySegment (category_id, year, category_segment, category_segment_unit, category_segment_value, emission_factor, formula) VALUES
(2, 2020, 'Air Travel (km)', 'km', 350000, 0.13464, 'Emissions = Distance × Emission Factor'),
(2, 2021, 'Air Travel (km)', 'km', 400000, 0.13464, 'Emissions = Distance × Emission Factor'),
(2, 2022, 'Air Travel (km)', 'km', 300000, 0.13464, 'Emissions = Distance × Emission Factor'),
(2, 2023, 'Air Travel (km)', 'km', 320000, 0.13464, 'Emissions = Distance × Emission Factor'),
(2, 2024, 'Air Travel (km)', 'km', 280000, 0.13464, 'Emissions = Distance × Emission Factor'),
(2, 2025, 'Air Travel (km)', 'km', 160000, 0.13464, 'Emissions = Distance × Emission Factor');

-- Category 3: Upstream Transportation and Distribution
INSERT INTO dbo.CategorySegment (category_id, year, category_segment, category_segment_unit, category_segment_value, emission_factor, formula) VALUES
(3, 2020, '3rd Party Transport of Purchased Goods', 'km', 52000, 0.6362, 'Emissions = Distance × Emission Factor'),
(3, 2021, '3rd Party Transport of Purchased Goods', 'km', 58000, 0.6362, 'Emissions = Distance × Emission Factor'),
(3, 2022, '3rd Party Transport of Purchased Goods', 'km', 48000, 0.6362, 'Emissions = Distance × Emission Factor'),
(3, 2023, '3rd Party Transport of Purchased Goods', 'km', 50000, 0.6362, 'Emissions = Distance × Emission Factor'),
(3, 2024, '3rd Party Transport of Purchased Goods', 'km', 45000, 0.6362, 'Emissions = Distance × Emission Factor'),
(3, 2025, '3rd Party Transport of Purchased Goods', 'km', 30000, 0.6362, 'Emissions = Distance × Emission Factor');

-- Category 4: Employee Commuting
INSERT INTO dbo.CategorySegment (category_id, year, category_segment, category_segment_unit, category_segment_value, emission_factor, formula) VALUES
(4, 2020, 'Bus Travel (Total Km)', 'km', 200000, 0.07, 'Emissions = Distance × Emission Factor'),
(4, 2021, 'Bus Travel (Total Km)', 'km', 220000, 0.07, 'Emissions = Distance × Emission Factor'),
(4, 2022, 'Bus Travel (Total Km)', 'km', 180000, 0.07, 'Emissions = Distance × Emission Factor'),
(4, 2023, 'Bus Travel (Total Km)', 'km', 190000, 0.07, 'Emissions = Distance × Emission Factor'),
(4, 2024, 'Bus Travel (Total Km)', 'km', 170000, 0.07, 'Emissions = Distance × Emission Factor'),
(4, 2025, 'Bus Travel (Total Km)', 'km', 100000, 0.07, 'Emissions = Distance × Emission Factor'),

(4, 2020, 'EV / Hybrid Vehicles (Total km)', 'km', 50000, 0.0004, 'Emissions = Distance × Emission Factor'),
(4, 2021, 'EV / Hybrid Vehicles (Total km)', 'km', 55000, 0.0004, 'Emissions = Distance × Emission Factor'),
(4, 2022, 'EV / Hybrid Vehicles (Total km)', 'km', 47000, 0.0004, 'Emissions = Distance × Emission Factor'),
(4, 2023, 'EV / Hybrid Vehicles (Total km)', 'km', 48000, 0.0004, 'Emissions = Distance × Emission Factor'),
(4, 2024, 'EV / Hybrid Vehicles (Total km)', 'km', 45000, 0.0004, 'Emissions = Distance × Emission Factor'),
(4, 2025, 'EV / Hybrid Vehicles (Total km)', 'km', 36000, 0.0004, 'Emissions = Distance × Emission Factor');

GO

-- 7) Select all data from both tables
SELECT * FROM dbo.Category;
SELECT * FROM dbo.CategorySegment;
GO
