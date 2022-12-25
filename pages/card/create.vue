<template>
  <div class="card_create_page_component">
    <div class="text-h6 mb-4">
      Создание карточки
    </div>

    <CardManage :front-side="frontSide" @update:front-side="newVal => this.frontSide = newVal"
                :back-side="backSide" @update:back-side="newVal => this.backSide = newVal"
                :folder="selectedFolder" @update:folder="newVal => this.selectedFolder = newVal"
                :pre-selected-folder-id="getFolderIdFromQuery()"
                :bookmarked="bookmarked" @update:bookmarked="newVal => this.bookmarked = newVal"
    />

    <Footer>
      <template slot="buttons">
        <v-btn color="secondary" icon large @click="onClickBack">
          <v-icon>mdi-keyboard-backspace</v-icon>
        </v-btn>

        <v-btn color="primary" icon large @click="onClickCreate">
          <v-icon>mdi-plus-box-multiple-outline</v-icon>
        </v-btn>
      </template>
    </Footer>
  </div>
</template>

<style lang="scss">
.card_create_page_component {

}
</style>

<script>
import cardsApi from "../../repositories/cards/CardsApi";
import FoldersSelect from "../../components/FoldersSelect";
import CardManage from "../../components/CardManage";
import Vue from "vue";

import {defineComponent} from "vue";
import Footer from "@/components/Footer";
import alertsService, {Alert} from "@/services/AlertsService";

export default defineComponent({
  components: {
    Footer,
    CardManage,
    FoldersSelect

  },

  data() {
    return {
      selectedFolder: undefined,
      frontSide: '',
      backSide: '',
      bookmarked: false
    }
  },

  methods: {
    getFolderIdFromQuery() {
      return this.$route.query.folderId;
    },

    async onClickCreate() {
      try {
        let card = await cardsApi.create({
          folderId: this.selectedFolder?.id,
          frontSide: this.frontSide,
          backSide: this.backSide,
          bookmarked: this.bookmarked
        });
        this.onClickBack();
      } catch (e) {
        alertsService.addAlert(new Alert('error', e.message));
        console.error(e);
      }
    },

    onClickBack() {
      this.$router.back();
    }
  }

})
</script>
