import express, { type Request, type Response } from "express";
import { api } from "./api";
import cors from "cors";
import session from "cookie-session";
import { auth } from "./auth";

const app = express();
app.use(cors());
app.use(session({ secret: "secret" }));
app.use(auth);
app.use(api);

app.listen(3002, () => console.log("started"));
