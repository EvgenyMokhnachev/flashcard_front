<template>
  <div>
    <CardManage :front-side="frontSide" @update:front-side="newVal => this.frontSide = newVal"
                :back-side="backSide" @update:back-side="newVal => this.backSide = newVal"
                :folder="selectedFolder" @update:folder="newVal => this.selectedFolder = newVal"
                :pre-selected-folder-id="getFolderIdFromQuery()"
    />

    <v-btn block color="primary" class="mb-4" v-on:click="onClickCreate">Создать</v-btn>
    <v-btn block v-on:click="onClickBack">Назад</v-btn>
  </div>
</template>

<script>
import cardsApi from "../../repositories/cards/CardsApi";
import FoldersSelect from "../../components/FoldersSelect";
import CardManage from "../../components/CardManage";

export default {

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

}
</script>
