<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { Task } from "./shared/task";
import { remult } from "remult";
import { TaskController } from "./shared/TasksController";
const tasks = ref<Task[]>([]);
const taskRepo = remult.repo(Task);

async function fetchTasks() {
  try {
    fetch("https://vuejs-todolist.onrender.com/api/tasks")
      .then((res) => res.json())
      .then(console.log)
      .catch(console.error);
    tasks.value = await taskRepo.find();
    console.log("Tarefas carregadas:", tasks.value);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
  }
}

onMounted(() => {
  fetchTasks();
});

const newTaskTitle = ref("");
const newTaskDescription = ref("");

async function addTask() {
  if (!newTaskTitle.value.trim() || !newTaskDescription.value.trim()) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const response = await fetch(
      "https://vuejs-todolist.onrender.com/api/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTaskTitle.value,
          description: newTaskDescription.value,
        }),
      }
    );

    if (response.ok) {
      await fetchTasks(); // Refazer a busca após adicionar
    } else {
      throw new Error("Erro ao adicionar tarefa");
    }
  } catch (error: any) {
    alert(error.message);
  }
}

async function deleteTask(task: Task) {
  try {
    await taskRepo.delete(task);
    await fetchTasks();
  } catch (error: any) {
    alert(error.message);
  }
}
async function saveTask(task: Task) {
  try {
    await taskRepo.save(task);
    await fetchTasks();
  } catch (error: any) {
    alert(error.message);
  }
}

async function setAllCompleted(completed: boolean) {
  await TaskController.setAllCompleted(completed);
  await fetchTasks();
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
