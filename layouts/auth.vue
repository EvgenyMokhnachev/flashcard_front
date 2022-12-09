<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <Nuxt/>
      </v-container>
    </v-main>

    <Alerts />
  </v-app>
</template>

<script>
import Alerts from "~/components/Alerts.vue";

export default {
  name: 'auth',

  components: {Alerts},

  data() {
    return {

    }
  }
}
</script>
