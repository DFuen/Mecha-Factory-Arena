<template>
  <div class="app-shell">
    <nav class="app-shell__nav">
      <RouterLink to="/garage">Garage</RouterLink>
      <RouterLink to="/arena">Arena</RouterLink>
    </nav>

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f8fafc;
}

.app-shell__nav {
  display: flex;
  gap: 16px;
  padding: 16px 24px;
  background: #0f172a;
}

.app-shell__nav a {
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 600;
}

.app-shell__nav a.router-link-active {
  color: #38bdf8;
}
</style>
