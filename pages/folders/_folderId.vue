<template>
  <div>
    <v-breadcrumbs v-if="breadcrumbsItems.length > 1" divider="/" :items="breadcrumbsItems" class="pa-2 pb-0">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="'/folders/' + item.id">
          {{ item.name }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>

    <div class="d-flex justify-space-between align-center">
      <v-card-subtitle class="pa-2 pt-0"><strong>{{ currentFolder.name }}</strong></v-card-subtitle>
      <div>
        <v-btn icon :to="'/folders/update/' + currentFolder.id"><v-icon>mdi-folder-edit</v-icon></v-btn>
      </div>
    </div>

    <v-divider class="mb-4" />

    <v-card elevation="2" class="mb-4" :to="'/folders/create?parentId=' + getCurrentFolderId()">
      <v-card-text class="d-flex align-center pa-2">
        <div><v-icon class="mr-2">mdi-folder-plus</v-icon></div>
        <div>Создать подраздел</div>
      </v-card-text>
    </v-card>

    <FoldersList :filter="foldersFilter" />

    <v-divider class="mb-4" />

    <div class="d-flex justify-space-around mb-4">
      <v-btn elevation="1" large fab dark color="teal" :to="'/card/create?folderId=' + getCurrentFolderId()">
        <v-icon>mdi-plus-box-multiple-outline</v-icon>
      </v-btn>

      <v-btn elevation="1" large fab dark color="indigo" v-on:click="onClickCardPlay">
        <v-icon>mdi-play</v-icon>
      </v-btn>
    </div>

    <CardsList :filter="cardsFilter" />
  </div>
</template>

<script lang="ts">
import CardsList from "../../components/CardsList.vue";
import CardsFilter from "../../repositories/cards/CardsFilter";
import authService from "~/services/AuthService";
import FoldersList from "~/components/FoldersList.vue";
import FoldersFilter from "~/repositories/folders/FoldersFilter";
import foldersApi from "~/repositories/folders/FoldersApi";
import FolderTree from "~/repositories/folders/FolderTree";

export default {
  components: {
    FoldersList,
    CardsList
  },

  data() {
    return {
      cardsFilter: new CardsFilter({
        userIds: [authService.getUserId()],
        folderIds: [this.getCurrentFolderId()]
      }),
      foldersFilter: new FoldersFilter({
        userIds: [authService.getUserId()],
        parentIds: [this.getCurrentFolderId()]
      }),
      currentFolder: new FolderTree()
    }
  },

  computed: {
    breadcrumbsItems() {
      let result = [];
      if (this.currentFolder && this.currentFolder.parent) {
        result = this.getFolderTreeToRoot(this.currentFolder.parent).reverse();
      }
      result.push({
        id: undefined,
        name: '',
        disabled: true
      })
      return result;
    }
  },

  methods: {
    getFolderTreeToRoot(folder?: FolderTree, treeItems?: FolderTree): FolderTree[] {
      if (!treeItems) {
        treeItems = [];
      }

      if (!folder) return treeItems;

      treeItems.push(folder);

      return this.getFolderTreeToRoot(folder.parent, treeItems);
    },

    getCurrentFolderId() {
      return this.$route.params.folderId;
    },

    onClickCardPlay() {
      this.$router.push('/card/play?filter=' + this.getCardsFilterUrl());
    },

    getCardsFilterUrl(): string {
      try {
        return encodeURI(JSON.stringify(this.cardsFilter));
      } catch (e) {
        return "";
      }
    },

    async fetchCurrentFolder() {
      let currentFolder: FolderTree = (await foldersApi.tree({
        ids: [this.getCurrentFolderId()]
      })).first();

      if (currentFolder) {
        this.currentFolder = currentFolder;
      }
    }
  },

  created() {
    foldersApi.onFoldersCrud(() => {
      this.fetchCurrentFolder();
    })
  },

  mounted() {
    this.fetchCurrentFolder();
  }

}
</script>
