-- SQL Server (T-SQL) compatible script
-- Crée la base si elle n'existe pas, puis la table dbo.equipment

IF DB_ID(N'fps_inventory') IS NULL
BEGIN
    CREATE DATABASE fps_inventory;
END
GO

USE fps_inventory;
GO

IF OBJECT_ID(N'dbo.equipment', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.equipment (
        id INT IDENTITY(1,1) PRIMARY KEY,
        asset_id VARCHAR(20) NOT NULL UNIQUE,
        description NVARCHAR(MAX) NOT NULL,
        category NVARCHAR(100) NOT NULL,
        location NVARCHAR(100) NOT NULL,
        responsible NVARCHAR(100) NOT NULL,
        purchase_date DATE NOT NULL,
        purchase_price DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) NOT NULL,
        useful_life INT NOT NULL,
        depreciation_method NVARCHAR(50) NOT NULL,
        depreciation_rate DECIMAL(5,2) NOT NULL,
        accumulated_depreciation DECIMAL(10,2) NOT NULL,
        net_book_value DECIMAL(10,2) NOT NULL,
        condition_status NVARCHAR(50) NOT NULL,
        alert NVARCHAR(255) NULL,
        remarks NVARCHAR(MAX) NULL,
        created_at DATETIME2(0) NOT NULL CONSTRAINT DF_equipment_created_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT CK_equipment_currency CHECK (currency IN ('USD','CDF'))
    );
END
GO