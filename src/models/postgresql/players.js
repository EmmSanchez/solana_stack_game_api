import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const API_URL = process.env.SUPABASE_URL;
const API_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(API_URL, API_KEY);

export class PlayerModel {
  static async getRanking(limit, offset) {
    try {
      let query = supabase.from("players").select("*");

      query = query
        .order("max_score", { ascending: false })
        .order("create_at", { ascending: true });

      if (limit) {
        const start = offset || 0;
        const end = start + limit - 1;
        query = query.range(start, end);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching data", error);
        return [];
      }

      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static async registerPlayer(id, score) {
    try {
      const { data, error } = await supabase
        .from("players")
        .insert([{ address: id, max_score: score }]);

      if (error) {
        console.error("Error inserting data", error);
        return {};
      }

      return {
        success: true,
        message: "Player registererd successfully",
        data: data,
      };
    } catch (error) {
      console.error("Error uploading data", error);
    }
  }

  static async getPlayer(id) {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("address", id);

      if (error) {
        console.error(error);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  static async setNewMaxScore(id, score) {
    try {
      const { data, error } = await supabase
        .from("players")
        .update({ max_score: score })
        .eq("address", id);

      if (error) {
        console.error("Error inserting replacing score", error);
        return [];
      }

      return {
        success: true,
        message: "New score inserted",
        data: data,
      };
    } catch (error) {
      console.error("Error uploading score", error);
    }
  }
}
