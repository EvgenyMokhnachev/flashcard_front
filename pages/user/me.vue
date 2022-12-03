<template>
  <v-card>
    <v-card-title>Мой профиль</v-card-title>

    <v-card-text>
      email: {{userMe.email}}
    </v-card-text>

    <v-card-actions>
      <v-btn color="error" @click="onClickLogOut">Выйти</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import authService from "~/services/AuthService";
import User from "~/repositories/user/User";
import Vue from "vue";

import {defineComponent} from "vue";

export default defineComponent({
  components: {

  },

  data() {
    return {
      userMe: {},
    }
  },

  methods: {
    async fetchUserMe() {
      let userMe: User | undefined = await authService.getUserMe();
      if (userMe) {
        this.userMe = userMe;
      }
    },

    onClickLogOut() {
      authService.clearAuthToken();
    }
  },

  mounted() {
    this.fetchUserMe();
  }

})
</script>
