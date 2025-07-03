const sql = require("mssql"); // Import the mssql library
const dbConfig = require("../dbConfig"); // Import your db config

class Template {
  constructor() {
    console.log("Template model initialized");
  }

  // Function to fetch and display everything in the Category table
  static async getAllCategories() {
    let pool;
    try {
      console.log("[DEBUG] Connecting to the database...");
      pool = await sql.connect(dbConfig);
      console.log("[DEBUG] Database connected successfully.");

      console.log("[DEBUG] Executing query: SELECT * FROM Category");

      const result = await pool.request().query("SELECT * FROM Category");

      console.log("[DEBUG] Query executed successfully.");
      console.log("[DEBUG] Result:", result.recordset);

      return result.recordset;
    } catch (error) {
      console.error(
        `[DEBUG] Error in Template.getAllCategories: ${error.message}`
      );
      throw error;
    } finally {
      if (pool) {
        await pool.close();
        console.log("[DEBUG] Database connection closed.");
      }
    }
  }
}

module.exports = Template;
