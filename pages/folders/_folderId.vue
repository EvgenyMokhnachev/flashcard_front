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
      <v-card-subtitle class="pa-2 pt-0"><strong>{{ (currentFolder ? currentFolder.name : '') }}</strong></v-card-subtitle>
      <div>
        <v-btn icon :to="'/folders/update/' + (currentFolder ? currentFolder.id : '')">
          <v-icon>mdi-folder-edit-outline</v-icon>
        </v-btn>
      </div>
    </div>

    <v-divider class="mb-4"/>

    <v-card elevation="2" class="mb-4" :to="'/folders/create?parentId=' + getCurrentFolderId()">
      <v-card-text class="d-flex align-center pa-2">
        <div>
          <v-icon class="mr-2">mdi-folder-plus-outline</v-icon>
        </div>
        <div>Создать подраздел</div>
      </v-card-text>
    </v-card>

    <FoldersList :filter="foldersFilter"/>

    <v-divider class="mb-4"/>

    <CardsList :filter="cardsFilter"/>

    <CardsListActionsFooter :cards-filter="cardsFilter" @change="onCardsFilterChange" />
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

import {defineComponent} from "vue";
import {getAllCardDifficultTypes} from "~/services/CardDifficultType";
import CardsListActionsFooter from "~/components/CardsListActionsFooter.vue";

export default defineComponent({
  components: {
    FoldersList,
    CardsList,
    CardsListActionsFooter,
  },

  data() {
    return {
      cardsFilter: undefined,
      foldersFilter: undefined,
      currentFolder: undefined
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
    onCardsFilterChange(filter) {
      this.cardsFilter = filter;
    },

    getFolderTreeToRoot(folder?: FolderTree, treeItems?: FolderTree[]): FolderTree[] {
      let treeItemsInit: FolderTree[] = treeItems ? [...treeItems] : [];

      if (!folder) return treeItemsInit;

      treeItemsInit.push(folder);

      return this.getFolderTreeToRoot(folder.parent, treeItemsInit);
    },

    getCurrentFolderId(): number | undefined {
      if (this.$route.params.folderId) {
        return parseInt(this.$route.params.folderId);
      }
      return;
    },

    async fetchCurrentFolder() {
      if (this.getCurrentFolderId() !== undefined) {
        let currentFolder: FolderTree | undefined = (await foldersApi.tree({
          ids: [this.getCurrentFolderId()]
        })).first();

        if (currentFolder) {
          this.currentFolder = currentFolder;
        }
      }
    },
  },

  created() {
    foldersApi.onFoldersCrud(() => {
      this.fetchCurrentFolder();
    })
  },

  mounted() {
    this.cardsFilter = new CardsFilter({
      userIds: [authService.getUserId()],
      folderIds: [this.getCurrentFolderId()],
      difficultTypes: getAllCardDifficultTypes()
    });
    this.foldersFilter = new FoldersFilter({
      userIds: [authService.getUserId()],
      parentIds: [this.getCurrentFolderId()]
    });
    this.fetchCurrentFolder();
  }

})
</script>
