<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item to="/user/me" router exact>
          <v-list-item-action class="mr-3">
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>
              {{ userMe.email }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/" router exact>
          <v-list-item-action class="mr-3">
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>
              Главная панель
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/folders/create" router exact>
          <v-list-item-action class="mr-3">
            <v-icon>mdi-folder-plus-outline</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>Создать раздел</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-for="(folder, i) in rootFolders" :key="i" :to="'/folders/' + folder.id" router>
          <v-list-item-action class="mr-3">
            <v-icon>mdi-folder-outline</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ folder.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <Nuxt/>
      </v-container>
    </v-main>

<!--    <v-footer :absolute="!fixed" app>-->
<!--      <span>&copy; {{ new Date().getFullYear() }}</span>-->
<!--    </v-footer>-->
  </v-app>
</template>

<script lang="ts">
import FoldersFilter from "../repositories/folders/FoldersFilter";
import foldersApi from "../repositories/folders/FoldersApi";
import authService from "~/services/AuthService";
import User from "~/repositories/user/User";

export default {

  name: 'DefaultLayout',

  middleware: ['auth'],

  data() {
    return {
      clipped: false,
      miniVariant: false,
      drawer: false,
      title: 'Словарик',

      rootFolders: [],
      userMe: {}
    }
  },

  methods: {
    async fetchRootFolders() {
      let foldersPagination = await foldersApi.get(new FoldersFilter({
        onlyRoot: true,
        userIds: [authService.getUserId()]
      }));
      this.rootFolders = foldersPagination.items;
    },

    async fetchUserMe() {
      let userMe: User | undefined = await authService.getUserMe();
      if (userMe) {
        this.userMe = userMe;
      }
    }
  },

  created() {
    foldersApi.onFoldersCrud(() => {
      this.fetchRootFolders();
    })
  },

  mounted() {
    this.fetchRootFolders();
    this.fetchUserMe();
  }
}
</script>
