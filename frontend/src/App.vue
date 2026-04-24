<template>
  <router-view />
</template>

<script setup lang="ts"></script>

<style>
:root {
  color: #27312d;
  font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif;
  background: #f4efe6;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 12%, rgba(255, 196, 91, 0.28), transparent 28rem),
    radial-gradient(circle at 88% 4%, rgba(87, 138, 110, 0.2), transparent 24rem),
    linear-gradient(135deg, #f7f0df 0%, #ede5d6 48%, #f8f4ec 100%);
}

button,
input,
select {
  font: inherit;
}

#app {
  min-height: 100vh;
}
</style>
