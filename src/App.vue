<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { Task } from "./shared/task";
import { remult } from "remult";
import { TaskController } from "./shared/TasksController";

const tasks = ref<Task[]>([]);
const taskRepo = remult.repo(Task);

onMounted(() => {
  onUnmounted(
    taskRepo
      .liveQuery({
        where: { completed: undefined },
      })
      .subscribe((info) => (tasks.value = info.applyChanges(tasks.value)))
  );
});

const newTaskTitle = ref("");
const newTaskDescription = ref("");

async function addTask() {
  if (!newTaskTitle.value.trim() || !newTaskDescription.value.trim()) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const newTask = await taskRepo.insert({
      title: newTaskTitle.value,
      description: newTaskDescription.value,
    });

    newTaskTitle.value = "";
    newTaskDescription.value = "";
  } catch (error: any) {
    alert(error.message);
  }
}
async function deleteTask(task: Task) {
  try {
    await taskRepo.delete(task);
  } catch (error: any) {
    alert(error.message);
  }
}
async function saveTask(task: Task) {
  try {
    await taskRepo.save(task);
  } catch (error: any) {
    alert(error.message);
  }
}

async function setAllCompleted(completed: boolean) {
  await TaskController.setAllCompleted(completed);
}
</script>

<template>
  <h1>To Do List - Mplan</h1>
  <main>
    <form @submit.prevent="addTask">
      <label for="taskTitle">
        O que precisa ser feito?
        <input
          id="taskTitle"
          placeholder="Título da tarefa"
          v-model="newTaskTitle"
        />
      </label>
      <label for="taskDescription">
        Coloque uma descrição para a tarefa
        <input
          id="taskDescription"
          placeholder="Descrição da tarefa"
          v-model="newTaskDescription"
        />
      </label>
      <button>Adicionar</button>
    </form>

    <div v-for="task in tasks" :key="task.id" class="task-card">
      <div class="task-header">
        <input
          type="checkbox"
          v-model="task.completed"
          @change="($event) => saveTask(task)"
          id="taskCompleted{{ task.id }}"
        />
        <label :for="'taskCompleted' + task.id">
          <input v-model="task.title" />
        </label>
        <button @click="($event) => saveTask(task)">Salvar</button>
      </div>
      <p class="task-description">{{ task.description }}</p>
      <button @click="($event) => deleteTask(task)">Deletar</button>
    </div>

    <div class="button-group" style="display: flex">
      <button @click="($event) => setAllCompleted(true)">Marcar todos</button>
      <button @click="($event) => setAllCompleted(false)">
        Desmarcar todos
      </button>
    </div>
  </main>
</template>
