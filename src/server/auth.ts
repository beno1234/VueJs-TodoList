import { json, Router } from "express";
import type { UserInfo } from "remult";
import express, { type Request, type Response } from "express";

const validUsers: UserInfo[] = [
  {
    id: "1",
    name: "Jane",
  },
  {
    id: "2",
    name: "Steve",
  },
];

export const auth = Router();
auth.use(json());

auth.post("/api/signIn", (req, res) => {
  const user = validUsers.find((user) => user.name === req.body.username);
  if (user) {
    req.session!["user"] = user;
    res.json(user);
  } else {
    res.status(404).json("Usuario invalido - Tente Jane ou Steve!");
  }
});

auth.get("/api/currentUser", (req: Request, res: Response) => {
  res.json(req.session?.user || null);
});
auth.post("/api/signout", (req, res) => {
  req.session!["user"] = null;
  res.json("Deslogado");
});
