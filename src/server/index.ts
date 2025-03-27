import express, { type Request, type Response } from "express";
import { api } from "./api";
import cors from "cors";
import session from "cookie-session";
import { auth } from "./auth";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:8080", "https://vuejs-todolist.onrender.com"], // Adicione a URL do seu frontend no Render
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(session({ secret: "secret" }));
app.use(auth);
app.use(api);
app.get("/api/hi", (req: Request, res: Response) => {
  res.send("ola");
});
app.listen(3002, () => console.log("started"));
