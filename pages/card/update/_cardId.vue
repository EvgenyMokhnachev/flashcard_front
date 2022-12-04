<template>
  <div class="cardIdPage">
    <CardManage :front-side="card.frontSide" @update:front-side="newVal => this.card.frontSide = newVal"
                :back-side="card.backSide" @update:back-side="newVal => this.card.backSide = newVal"
                @update:folder="newVal => this.card.folderId = newVal ? newVal.id : undefined"
                :pre-selected-folder-id="card.folderId"
                class="mb-6"
    />

    <v-footer fixed app>
      <v-container class="footer_buttons_block">
        <v-btn v-on:click="onClickBack">Назад</v-btn>
        <v-btn color="error" v-on:click="() => this.openedDeleteWindow = true">Удалить</v-btn>
        <v-btn color="primary" v-on:click="onClickSave">Сохранить</v-btn>
      </v-container>
    </v-footer>

    <DialogYesNot title="Вы уверены, что ходите удалить карточку?"
                  no-btn-title="Нет"
                  :on-click-no="() => this.openedDeleteWindow = false"
                  yes-btn-title="Да, удалить"
                  :on-click-yes="onClickAcceptDelete"
                  :opened="openedDeleteWindow"
    />
  </div>
</template>

<style lang="scss">
.cardIdPage {
  .footer_buttons_block {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>

<script lang="ts">
import cardsApi from "./../../../repositories/cards/CardsApi";
import FoldersSelect from "./../../../components/FoldersSelect.vue";
import CardManage from "./../../../components/CardManage.vue";
import DialogYesNot from "./../../../components/DialogYesNot.vue";
import Card from "~/repositories/cards/Card";
import Vue from "vue";

import {defineComponent} from "vue";

export default defineComponent({

  components: {
    FoldersSelect,
    CardManage,
    DialogYesNot,

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

})
</script>
