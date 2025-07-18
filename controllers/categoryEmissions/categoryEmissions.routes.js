// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising CategoryEmissionsController
const CategoryEmissionsController = require("./categoryEmissionsController");

// ========== Set-up ==========
// Initialising categoryEmissionsRoutes
const categoryEmissionsRoutes = express.Router();

// ========== Routes ==========
// Route to get all category segments joined with their category
categoryEmissionsRoutes.get(
  "/category-segments",
  CategoryEmissionsController.getAllCategorySegmentsWithCategory
);

// Route to get calculated category emissions
categoryEmissionsRoutes.get(
  "/category-emissions",
  CategoryEmissionsController.getAllCategoryEmissions
);

// ========== Export ==========
module.exports = categoryEmissionsRoutes;
