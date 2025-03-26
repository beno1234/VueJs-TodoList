<script setup lang="ts">
import { remult } from "remult";
import App from "../App.vue";
import { onMounted, ref } from "vue";

const username = ref("");
const signedIn = ref(false);

async function SignIn() {
  const result = await fetch("/api/signIn", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username.value }),
  });
  if (result.ok) {
    remult.user = await result.json();
    signedIn.value = true;
  } else {
    alert(await result.json());
  }
}

onMounted(async () => {
  const result = await fetch("/api/currentUser");
  remult.user = await result.json();
  signedIn.value = remult.authenticated();
});

async function signOut() {
  await fetch("api/signout", {
    method: "POST",
  });
  remult.user = undefined;
  signedIn.value = false;
}
</script>

<template>
  <div v-if="signedIn">
    Olá {{ remult.user?.name }}
    <button @click="signOut()">Deslogar</button>
    <App />
  </div>
  <div v-else>
    <h1>To do</h1>
    <main>
      <form @submit.prevent="($event) => SignIn()">
        <input
          type="text"
          v-model="username"
          placeholder="Usuarios, tente Jane or Steve"
        />
        <button>Logar</button>
      </form>
    </main>
  </div>
</template>
