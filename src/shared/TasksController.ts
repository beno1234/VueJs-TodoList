import { Allow, BackendMethod, remult } from "remult";
import { Task } from "./task";

export class TaskController {
  @BackendMethod({ allowed: true })
  static async setAllCompleted(completed: boolean) {
    const taskRepo = remult.repo(Task);
    for (const task of await taskRepo.find()) {
      await taskRepo.save({ ...task, completed });
    }
  }
}
