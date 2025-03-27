import { TaskController } from "@/shared/TasksController";
import { Task } from "../shared/task";
import { remultExpress } from "remult/remult-express";
import { createPostgresConnection } from "remult/postgres";
import dotenv from "dotenv";

dotenv.config();
export const api = remultExpress({
  entities: [Task],
  controllers: [TaskController],
  dataProvider: createPostgresConnection({
    connectionString: process.env.POSTGRE,
  }),
});
