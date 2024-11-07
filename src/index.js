import express from "express";
import cors from "cors";
import { PlayerController } from "./controllers/players.js";

const app = express();
app.disable("x-powered-by");

const ACCEPTED_ORIGINS = [
  "http://localhost:5173",
  "https://solana-stack-game.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    // eslint-disable-next-line prettier/prettier
  })
);

app.use(express.json());

const PORT = process.env.PORT ?? 1234;

app.get("/ranking", PlayerController.getRanking);

app.get("/player", PlayerController.getPlayer);

app.post("/register", PlayerController.registerPlayer);

app.put("/player/update-score", PlayerController.setNewMaxScore);

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
