<template>
  <div>
    <div v-if="currentCard">
      <v-card elevation="2" tile class="mb-4">
        <v-card-title>Вопрос</v-card-title>
        <v-card-text class="card_q_a_a_text" style="">{{ currentCard.frontSide }}</v-card-text>
      </v-card>

      <v-card elevation="2" tile class="mb-4" v-if="showAnswer">
        <v-card-title>Ответ</v-card-title>
        <v-card-text class="card_q_a_a_text">{{ currentCard.backSide }}</v-card-text>
      </v-card>
    </div>

    <v-footer fixed app>
      <v-container>
        <div class="cards_manage_panel mb-4">
          <v-btn v-on:click="onClickPrev">Назад</v-btn>
          <v-btn color="accent" v-on:click="onClickShowAnswer">Показать</v-btn>
          <v-btn v-on:click="onClickNext">Вперед</v-btn>
        </div>

        <div class="cards_manage_panel">
          <DialogYesNot title="Вы уверены, что хотите завершить попытку?"
                        yes-btn-title="Да"
                        :on-click-yes="onClickFinish"
                        no-btn-title="Нет"
                        :on-click-no="() => {areYouSureToFinishDialog = false}"
                        :opened="areYouSureToFinishDialog"
          />
          <v-btn block small color="secondary" @click="areYouSureToFinishDialog = true">Завершить</v-btn>
        </div>
      </v-container>
    </v-footer>
  </div>
</template>

<style>
.cards_manage_panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.card_q_a_a_text {
  font-size: 20px;
  white-space: pre-wrap;
}
</style>

<script lang="ts">
import cardsApi from "~/repositories/cards/CardsApi";
import CardsFilter from "~/repositories/cards/CardsFilter";
import DialogYesNot from "~/components/DialogYesNot.vue";
import Vue from "vue";

import {defineComponent} from "vue";

export default defineComponent({

  components: {DialogYesNot},

  data() {
    return {
      cards: [],
      currentCardIndex: 0,
      currentCard: undefined,
      showAnswer: false,
      areYouSureToFinishDialog: false
    }
  },

  computed: {
    cardsFilterFromUri(): CardsFilter | undefined {
      if (!this.$route.query || !this.$route.query.filter) {
        return;
      }

      try {
        return JSON.parse(decodeURI(this.$route.query.filter));
      } catch (e) {
        return;
      }
    },
  },

  methods: {
    async fetchCards(filter: CardsFilter) {
      let paginationResponse = await cardsApi.get(filter);
      this.cards = paginationResponse.items || [];
      this.currentCard = this.cards[this.currentCardIndex];
    },

    onClickShowAnswer() {
      this.showAnswer = true;
    },

    onClickPrev() {
      let prevCard = this.cards[this.currentCardIndex - 1];
      if (prevCard) {
        this.currentCard = prevCard;
        this.currentCardIndex -= 1;
        this.showAnswer = false;
      }
    },

    onClickNext() {
      let nextCard = this.cards[this.currentCardIndex + 1];
      if (nextCard) {
        this.currentCard = nextCard;
        this.currentCardIndex += 1;
        this.showAnswer = false;
      }
    },

    onClickFinish() {
      this.$router.back();
    }
  },

  mounted() {
    this.fetchCards(this.cardsFilterFromUri);
  }

})
</script>
