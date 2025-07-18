// ========== Models ==========
const CategoryEmissions = require("../../models/categoryEmissions");

// ========== Controller ==========
class CategoryEmissionsController {
  // Handler to get all category segments joined with category
  static async getAllCategorySegmentsWithCategory(req, res) {
    try {
      console.log(
        "[DEBUG] CategoryEmissionsController.getAllCategorySegmentsWithCategory called"
      );

      const data = await CategoryEmissions.getAllCategorySegmentsWithCategory();

      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.error(
        `Error in getAllCategorySegmentsWithCategory: ${error.message}`
      );
      res.status(500).json({
        success: false,
        message: "Failed to retrieve category segment data.",
      });
    }
  }

  // Handler to get calculated emissions for all category segments
  static async getAllCategoryEmissions(req, res) {
    try {
      console.log(
        "[DEBUG] CategoryEmissionsController.getAllCategoryEmissions called"
      );

      const emissions = await CategoryEmissions.getAllCategoryEmissions();

      res.status(200).json({
        success: true,
        data: emissions,
      });
    } catch (error) {
      console.error(`Error in getAllCategoryEmissions: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to calculate category emissions.",
      });
    }
  }
}

// ========== Export ==========
module.exports = CategoryEmissionsController;
