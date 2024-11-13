/* eslint-disable prettier/prettier */
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL,
});

export class PlayerModel {
  static async getRanking(limit, offset) {
    try {
      let query = "SELECT * FROM players ORDER BY max_score DESC";
      const params = [];

      if (limit > 0) {
        query += " LIMIT $1";
        params.push(limit);
      }

      if (offset > 0 && limit > 0) {
        query += " OFFSET $2";
        params.push(offset);
      } else if (offset > 0) {
        query += " OFFSET $1";
        params.push(offset);
      }

      const { rows } = await pool.query(query, params);

      if (rows.length === 0) {
        return {
          success: true,
          message: "Data is empty",
          data: rows,
        };
      }

      return rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static async registerPlayer(id, score) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO players (address, max_score) VALUES ($1, $2) RETURNING *",
        [id, score]
      );

      if (rows.length === 0) {
        return {
          success: false,
          message: "Error registering player",
          data: rows,
        };
      }

      return {
        success: true,
        message: "Player registererd successfully",
        data: rows[0],
      };
    } catch (error) {
      console.error("Error uploading data", error);
    }
  }

  static async getPlayer(id) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM players WHERE address = $1",
        [id]
      );

      if (rows.length === 0) {
        return { message: "User not found" };
      }

      return rows;
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  static async setNewMaxScore(id, score) {
    try {
      const { rows } = await pool.query(
        "UPDATE players SET max_score = $1 WHERE address = $2 RETURNING *",
        [score, id]
      );

      if (rows.length === 0) {
        return {
          success: false,
          message: "Error updating score",
          data: rows,
        };
      }

      return {
        success: true,
        message: "New score inserted",
        data: rows,
      };
    } catch (error) {
      console.error("Error uploading score", error);
    }
  }
}
