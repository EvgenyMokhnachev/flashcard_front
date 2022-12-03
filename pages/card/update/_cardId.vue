<template>
  <div>
    <CardManage :front-side="card.frontSide" @update:front-side="newVal => this.card.frontSide = newVal"
                :back-side="card.backSide" @update:back-side="newVal => this.card.backSide = newVal"
                @update:folder="newVal => this.card.folderId = newVal ? newVal.id : undefined"
                :pre-selected-folder-id="card.folderId"
    />

    <v-btn block color="primary" class="mb-4" v-on:click="onClickSave">Сохранить</v-btn>
    <v-btn block color="error" class="mb-4" v-on:click="() => this.openedDeleteWindow = true">Удалить</v-btn>
    <v-btn block v-on:click="onClickBack">Назад</v-btn>

    <DialogYesNot title="Вы уверены, что ходите удалить карточку?"
                  no-btn-title="Нет"
                  :on-click-no="() => this.openedDeleteWindow = false"
                  yes-btn-title="Да, удалить"
                  :on-click-yes="onClickAcceptDelete"
                  :opened="openedDeleteWindow"
    />
  </div>
</template>

<script lang="ts">
import cardsApi from "../../../repositories/cards/CardsApi";
import FoldersSelect from "../../../components/FoldersSelect";
import CardManage from "../../../components/CardManage";
import Card from "~/repositories/cards/Card";
import DialogYesNot from "~/components/DialogYesNot.vue";

export default {

  components: {
    DialogYesNot,
    CardManage,
    FoldersSelect

  },

  data() {
    return {
      card: new Card(),
      openedDeleteWindow: false
    }
  },

  methods: {
    getCardId() {
      return this.$route.params.cardId;
    },

    async fetchCardData() {
      this.card = await cardsApi.getFirst({
        ids: [this.getCardId()]
      });
    },

    async onClickSave() {
      try {
        let card = await cardsApi.update(this.card);
      } catch (e) {
        console.error(e);
      }
    },

    onClickBack() {
      this.$router.back();
    },

    async onClickAcceptDelete() {
      try {
        await cardsApi.delete(this.card.id);
        this.onClickBack();
      } catch (e) {
        console.error(e);
      }
    }
  },

  mounted() {
    this.fetchCardData();
  }

}
</script>
