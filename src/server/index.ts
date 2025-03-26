import express, { type Request, type Response } from "express";
import { api } from "./api";
import session from "cookie-session";
import { auth } from "./auth";

const app = express();
app.use(session({ secret: "secret" }));
app.use(auth);
app.use(api);
app.get("/api/hi", (req: Request, res: Response) => {
  res.send("ola");
});
app.listen(3002, () => console.log("started"));
