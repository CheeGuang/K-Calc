const sql = require("mssql");
const dbConfig = require("../dbConfig");

class CategoryEmissions {
  constructor() {
    console.log("CategoryEmissions model initialized");
  }

  // Function 1: Join Category with CategorySegment
  static async getAllCategorySegmentsWithCategory() {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const result = await pool.request().query(`
        SELECT 
          c.id AS category_id,
          c.name AS category_name,
          c.categoryNumber AS category_categoryNumber,
          cs.id AS segment_id,
          cs.year,
          cs.category_segment,
          cs.category_segment_unit,
          cs.category_segment_value,
          cs.emission_factor,
          cs.formula
        FROM dbo.Category c
        JOIN dbo.CategorySegment cs ON c.id = cs.category_id
      `);
      return result.recordset;
    } catch (error) {
      console.error(
        `[DEBUG] Error in CategoryEmissions.getAllCategorySegmentsWithCategory: ${error.message}`
      );
      throw error;
    } finally {
      if (pool) await pool.close();
    }
  }

  // Function 2: Get emissions calculated using segment value × emission factor
  static async getAllCategoryEmissions() {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const result = await pool.request().query(`
        SELECT 
          c.name AS category_name,
          c.categoryNumber AS category_categoryNumber,
          cs.year,
          cs.category_segment,
          cs.category_segment_unit,
          cs.category_segment_value,
          cs.emission_factor,
          cs.formula
        FROM dbo.Category c
        JOIN dbo.CategorySegment cs ON c.id = cs.category_id
      `);

      const emissions = result.recordset.map((row) => {
        const {
          category_name,
          category_categoryNumber,
          year,
          category_segment,
          category_segment_unit,
          category_segment_value,
          emission_factor,
          formula,
        } = row;

        let emission = category_segment_value * emission_factor;
        let emissionString = `${emission.toFixed(2)} kg CO₂e`;

        return {
          category_name,
          categoryNumber: category_categoryNumber,
          year,
          category_segment,
          unit: category_segment_unit,
          value: category_segment_value,
          emission_factor,
          formula,
          emissions: emissionString,
        };
      });

      return emissions;
    } catch (error) {
      console.error(
        `[DEBUG] Error in CategoryEmissions.getAllCategoryEmissions: ${error.message}`
      );
      throw error;
    } finally {
      if (pool) await pool.close();
    }
  }
}

module.exports = CategoryEmissions;
