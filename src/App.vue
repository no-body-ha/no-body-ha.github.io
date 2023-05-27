<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss">
body,
html {
  margin: 0;
  padding: 0;
  font-size: 16px;
  min-width: 520px;
}
@media screen and (min-width: 1125px) and (max-width: 1559px) {
  body,
  html {
    font-size: 13px;
  }
}
@media screen and (min-width: 900px) and (max-width: 1124px) {
  body,
  html {
    font-size: 10px;
  }
}
@media screen and (max-width: 900px) {
  body,
  html {
    font-size: 9px;
  }
}
</style>
<style lang="scss">
#app {
  height: 100%;
}
</style>
