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
          <v-icon>mdi-folder-edit</v-icon>
        </v-btn>
      </div>
    </div>

    <v-divider class="mb-4"/>

    <v-card elevation="2" class="mb-4" :to="'/folders/create?parentId=' + getCurrentFolderId()">
      <v-card-text class="d-flex align-center pa-2">
        <div>
          <v-icon class="mr-2">mdi-folder-plus</v-icon>
        </div>
        <div>Создать подраздел</div>
      </v-card-text>
    </v-card>

    <FoldersList :filter="foldersFilter"/>

    <v-divider class="mb-4"/>

<!--    <div class="d-flex justify-space-around mb-4">-->
<!--      <v-btn elevation="1" large fab dark color="teal" :to="'/card/create?folderId=' + getCurrentFolderId()">-->
<!--        <v-icon>mdi-plus-box-multiple-outline</v-icon>-->
<!--      </v-btn>-->

<!--      <v-btn elevation="1" large fab dark color="indigo" @click="onClickCardPlay">-->
<!--        <v-icon>mdi-play</v-icon>-->
<!--      </v-btn>-->
<!--    </div>-->

    <CardsList :filter="cardsFilter"/>

    <v-footer fixed app class="pa-0">
      <v-container class="bottom_navigation_buttons">
        <v-btn dark color="teal" :to="'/card/create?folderId=' + getCurrentFolderId()">
          <v-icon>mdi-plus-box-multiple-outline</v-icon>
        </v-btn>

        <v-btn color="green" class="filter_btn" :class="{'active': isCardDifficultTypeSelected(CardDifficultType.EASY)}" @click="clickOnDifficultTypeFilter(CardDifficultType.EASY)">
          <v-icon color="blue-grey darken-4">mdi-head-check</v-icon>
        </v-btn>
        <v-btn color="amber" class="filter_btn" :class="{'active': isCardDifficultTypeSelected(CardDifficultType.DONT_SURE)}" @click="clickOnDifficultTypeFilter(CardDifficultType.DONT_SURE)">
          <v-icon color="blue-grey darken-4">mdi-head-dots-horizontal</v-icon>
        </v-btn>
        <v-btn color="red" class="filter_btn" :class="{'active': isCardDifficultTypeSelected(CardDifficultType.DONT_KNOW)}" @click="clickOnDifficultTypeFilter(CardDifficultType.DONT_KNOW)">
          <v-icon color="blue-grey darken-4">mdi-head-remove</v-icon>
        </v-btn>

        <v-btn dark color="indigo" @click="onClickCardPlay">
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </v-container>
    </v-footer>
  </div>
</template>

<style lang="scss">
.bottom_navigation_buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    flex-grow: 0;
  }

  .filter_btn {
    opacity: 0.65;

    &.active {
      opacity: 1;
    }
  }
}
</style>

<script lang="ts">
import CardsList from "../../components/CardsList.vue";
import CardsFilter from "../../repositories/cards/CardsFilter";
import authService from "~/services/AuthService";
import FoldersList from "~/components/FoldersList.vue";
import FoldersFilter from "~/repositories/folders/FoldersFilter";
import foldersApi from "~/repositories/folders/FoldersApi";
import FolderTree from "~/repositories/folders/FolderTree";
import Vue from "vue";

import {defineComponent} from "vue";
import CardDifficultType, {allCardDifficultTypes} from "~/services/CardDifficultType";

export default defineComponent({
  components: {
    FoldersList,
    CardsList
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
    },
    CardDifficultType() {
      return CardDifficultType;
    }
  },

  methods: {
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
      if (this.getCurrentFolderId() !== undefined) {
        let currentFolder: FolderTree | undefined = (await foldersApi.tree({
          ids: [this.getCurrentFolderId()]
        })).first();

        if (currentFolder) {
          this.currentFolder = currentFolder;
        }
      }
    },

    isCardDifficultTypeSelected(difficultType: CardDifficultType): boolean {
      if (!this.cardsFilter || !this.cardsFilter.difficultTypes) return false;
      return this.cardsFilter.difficultTypes.indexOf(difficultType) > -1;
    },

    clickOnDifficultTypeFilter(difficultType: CardDifficultType) {
      let alreadySelected = this.isCardDifficultTypeSelected(difficultType);
      if (alreadySelected) {
        this.cardsFilter.difficultTypes.splice(this.cardsFilter.difficultTypes.indexOf(difficultType), 1);
      } else {
        this.cardsFilter.difficultTypes.push(difficultType);
      }
      this.cardsFilter = new CardsFilter(this.cardsFilter);
    }
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
      difficultTypes: allCardDifficultTypes
    });
    this.foldersFilter = new FoldersFilter({
      userIds: [authService.getUserId()],
      parentIds: [this.getCurrentFolderId()]
    });
    this.fetchCurrentFolder();
  }

})
</script>
