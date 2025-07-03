-- 1) Create SQL Server login at the server level
CREATE LOGIN kcalc WITH PASSWORD = 'kcalc';
GO

-- 2) Create a user in the kcalc database that maps to that login
USE kcalc;
GO

CREATE USER kcalc FOR LOGIN kcalc;
GO

-- 3) Grant db_owner role to the user so it can do everything in the kcalc database
ALTER ROLE db_owner ADD MEMBER kcalc;
GO
