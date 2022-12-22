<template>
  <div>
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
    CardsList,
    CardsListActionsFooter,
  },

  data() {
    return {
      cardsFilter: undefined,
    }
  },

  methods: {
    onCardsFilterChange(filter) {
      this.cardsFilter = filter;
    },
  },

  mounted() {
    this.cardsFilter = new CardsFilter({
      userIds: [authService.getUserId()],
      folderIds: [],
      difficultTypes: getAllCardDifficultTypes()
    });
  }

})
</script>
