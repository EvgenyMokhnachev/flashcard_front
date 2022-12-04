<template>
  <div>
    <div v-if="currentCard">
      <v-card elevation="2" tile class="mb-4">
        <v-card-title>Вопрос</v-card-title>
        <v-card-text class="card_data card_q_a_a_text" v-html="currentCard.frontSide" />
      </v-card>

      <v-card elevation="2" tile class="mb-4" v-if="showAnswer">
        <v-card-title>Ответ</v-card-title>
        <v-card-text class="card_data card_q_a_a_text" v-html="currentCard.backSide" />
      </v-card>
    </div>

    <v-footer fixed app>
      <v-container>
        <div class="cards_manage_panel mb-4">
          <v-btn v-on:click="onClickPrev" icon x-large><v-icon>mdi-arrow-left-circle</v-icon></v-btn>
          <v-btn color="primary" v-on:click="onClickShake" icon x-large><v-icon>mdi-file-arrow-left-right-outline</v-icon></v-btn>
          <v-btn color="primary" v-on:click="onClickShowAnswer" icon x-large><v-icon>mdi-eye-outline</v-icon></v-btn>
          <v-btn v-on:click="onClickNext"icon x-large><v-icon>mdi-arrow-right-circle</v-icon></v-btn>
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

<style lang="scss">
.card_data {
  p {
    margin-bottom: initial;
  }
}

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

    random(min: number, max: number): number {
      return min + Math.round((max-min) * Math.random());
    },

    onClickShake() {
      if (!this.cards || !this.cards.length) return;
      let shakenCards = [];
      let originalCards = [...this.cards];
      const originalCardsLength = originalCards.length;
      while (shakenCards.length != originalCardsLength) {
        let indexOfCard = this.random(0, originalCards.length - 1);
        shakenCards.push(originalCards[indexOfCard]);
        originalCards.splice(indexOfCard, 1);
      }

      this.showAnswer = false;
      this.cards = shakenCards;
      this.currentCardIndex = 0;
      this.currentCard = this.cards[this.currentCardIndex];
    },

    onClickShowAnswer() {
      this.showAnswer = !this.showAnswer;
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
