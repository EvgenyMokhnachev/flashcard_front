<template>
  <div>
    <CardManage :front-side="frontSide" @update:front-side="newVal => this.frontSide = newVal"
                :back-side="backSide" @update:back-side="newVal => this.backSide = newVal"
                :folder="selectedFolder" @update:folder="newVal => this.selectedFolder = newVal"
                :pre-selected-folder-id="getFolderIdFromQuery()"
    />

    <v-footer fixed>
      <div class="d-flex justify-space-between">
        <v-btn tile block v-on:click="onClickBack" >Назад</v-btn>
        <v-btn tile block v-on:click="onClickCreate" color="primary">Создать</v-btn>
      </div>
    </v-footer>
  </div>
</template>

<script>
import cardsApi from "../../repositories/cards/CardsApi";
import FoldersSelect from "../../components/FoldersSelect";
import CardManage from "../../components/CardManage";
import Vue from "vue";

import {defineComponent} from "vue";

export default defineComponent({

  components: {
    CardManage,
    FoldersSelect

  },

  data() {
    return {
      selectedFolder: undefined,
      frontSide: '',
      backSide: ''
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
          backSide: this.backSide
        });
        this.onClickBack();
      } catch (e) {
        console.error(e);
      }
    },

    onClickBack() {
      this.$router.back();
    }
  }

})
</script>
