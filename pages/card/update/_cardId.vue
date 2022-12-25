<template>
  <div class="card_update_page_component">
    <div class="text-h6 mb-4">
      Редактирование карточки
    </div>

    <CardManage class="mb-6"
                :front-side="card.frontSide" @update:front-side="newVal => this.card.frontSide = newVal"
                :back-side="card.backSide" @update:back-side="newVal => this.card.backSide = newVal"
                :bookmarked="card.bookmarked" @update:bookmarked="newVal => this.card.bookmarked = newVal"
                @update:folder="newVal => this.card.folderId = newVal ? newVal.id : undefined"
                :pre-selected-folder-id="card.folderId"
    />

    <DialogYesNot title="Вы уверены, что ходите удалить карточку?"
                  no-btn-title="Нет"
                  :on-click-no="() => this.openedDeleteWindow = false"
                  yes-btn-title="Да, удалить"
                  :on-click-yes="onClickAcceptDelete"
                  :opened="openedDeleteWindow"
    />

    <Footer>
      <template slot="buttons">
        <v-btn color="secondary" icon large @click="onClickBack">
          <v-icon>mdi-keyboard-backspace</v-icon>
        </v-btn>

        <v-btn color="error" icon large @click="() => this.openedDeleteWindow = true">
          <v-icon>mdi-delete-empty</v-icon>
        </v-btn>

        <v-btn color="primary" icon large @click="onClickSave">
          <v-icon>mdi-content-save-check-outline</v-icon>
        </v-btn>
      </template>
    </Footer>
  </div>
</template>

<style lang="scss">
.card_update_page_component {

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
import Footer from "~/components/Footer.vue";
import alertsService, {Alert} from "~/services/AlertsService";

export default defineComponent({

  components: {
    Footer,
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
        alertsService.addAlert(new Alert('success', 'Карточка успешно обновлена'));
      } catch (e) {
        alertsService.addAlert(new Alert('error', e.message));
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
        alertsService.addAlert(new Alert('success', 'Карточка успешно удалена'));
      } catch (e) {
        alertsService.addAlert(new Alert('error', e.message));
        console.error(e);
      }
    }
  },

  mounted() {
    this.fetchCardData();
  }

})
</script>
