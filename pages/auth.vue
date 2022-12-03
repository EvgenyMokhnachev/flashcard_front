<template>
  <div>
    <v-card elevation="1" tile>
      <v-card-title>Авторизация</v-card-title>
      <v-card-subtitle>Введите свой email и пароль, указанный ранее при регистрации или введите email и пароль для
        регистрации
      </v-card-subtitle>

      <v-card-text>
        <v-form>
          <v-text-field type="email" v-model="email" label="E-mail" required />
          <v-text-field type="password" v-model="pass" label="Пароль" required />
          <v-btn color="primary" v-on:click="onClickLogin">Войти</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import authService from "../services/AuthService";

export default {
  layout: 'auth',

  middleware: ['auth'],

  data() {
    return {
      email: '',
      pass: '',
    }
  },

  methods: {
    async onClickLogin(e) {
      e.preventDefault();

      try {
        await authService.auth(this.email, this.pass);

        if (authService.isAuthenticated) {
          this.$router.push("/");
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

}
</script>
