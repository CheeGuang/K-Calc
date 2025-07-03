// ========== Models ==========
const Template = require("../../models/template");

// ========== Controller ==========
class TemplateController {
  // getAllCategories handler
  static async getAllCategories(req, res) {
    try {
      console.log("[DEBUG] TemplateController.getAllCategories called");

      const categories = await Template.getAllCategories();

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      console.error(`Error in getAllCategories: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve categories.",
      });
    }
  }
}

// ========== Export ==========
module.exports = TemplateController;
