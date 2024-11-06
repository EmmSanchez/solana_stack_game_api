import { PlayerModel } from "../models/postgresql/players.js";

export class PlayerController {
  static async getRanking(req, res) {
    try {
      const { limit, offset } = req.query;
      const parsedLimit = parseInt(limit);
      const parsedOffset = parseInt(offset);

      const ranking = await PlayerModel.getRanking(parsedLimit, parsedOffset);

      res.json(ranking);
    } catch (error) {
      console.error(error);
    }
  }

  static async registerPlayer(req, res) {
    try {
      const { id, score } = req.body;
      const parsedId = parseInt(id);
      const parsedScore = parseInt(score);

      const response = await PlayerModel.registerPlayer(parsedId, parsedScore);

      res.json(response);
    } catch (error) {
      console.error(error);
    }
  }

  static async getPlayer(req, res) {
    try {
      const { id } = req.query;

      const response = await PlayerModel.getPlayer(id);

      res.json(response);
    } catch (error) {
      console.error(error);
    }
  }

  static async setNewMaxScore(req, res) {
    try {
      const { id, score } = req.body;
      const parsedScore = parseInt(score);

      const response = await PlayerModel.setNewMaxScore(id, parsedScore);

      res.json(response);
    } catch (error) {
      console.error(error);
    }
  }
}
