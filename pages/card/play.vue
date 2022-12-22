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

    <Footer>
      <template slot="custom">
        <v-container>
          <div class="cards_counter_block">
            {{ currentCardIndex + 1 }} / {{ cards.length }}
          </div>

          <div class="cards_manage_panel mb-4">
            <v-btn v-on:click="onClickPrev" icon x-large><v-icon x-large>mdi-arrow-left-circle</v-icon></v-btn>
            <v-btn color="primary" v-on:click="() => areYouSureToShakeDialog = true" icon x-large><v-icon x-large>mdi-file-arrow-left-right-outline</v-icon></v-btn>
            <v-btn color="primary" v-on:click="onClickShowAnswer" icon x-large><v-icon x-large>mdi-eye-outline</v-icon></v-btn>
            <v-btn v-on:click="onClickNext" icon x-large><v-icon x-large>mdi-arrow-right-circle</v-icon></v-btn>
          </div>

          <div class="difficult_level_chooser_block mb-4" v-if="currentCard">
            <v-btn color="green" :class="{'active': currentCard.difficult === CardDifficultType.EASY}" @click="onClickChangeDifficultType(CardDifficultType.EASY)">
              <v-icon color="blue-grey darken-4" v-if="currentCard.difficult === CardDifficultType.EASY">mdi-head-check</v-icon>
              <v-icon color="blue-grey darken-4" v-else>mdi-head-check-outline</v-icon>
            </v-btn>
            <v-btn color="amber" :class="{'active': currentCard.difficult === CardDifficultType.DONT_SURE}" @click="onClickChangeDifficultType(CardDifficultType.DONT_SURE)">
              <v-icon color="blue-grey darken-4" v-if="currentCard.difficult === CardDifficultType.DONT_SURE">mdi-head-dots-horizontal</v-icon>
              <v-icon color="blue-grey darken-4" v-else>mdi-head-dots-horizontal-outline</v-icon>
            </v-btn>
            <v-btn color="red" :class="{'active': currentCard.difficult === CardDifficultType.DONT_KNOW}" @click="onClickChangeDifficultType(CardDifficultType.DONT_KNOW)">
              <v-icon color="blue-grey darken-4" v-if="currentCard.difficult === CardDifficultType.DONT_KNOW">mdi-head-remove</v-icon>
              <v-icon color="blue-grey darken-4" v-else>mdi-head-remove-outline</v-icon>
            </v-btn>
          </div>

          <div class="cards_manage_panel">
            <DialogYesNot title="Вы уверены, что хотите завершить попытку?"
                          yes-btn-title="Да"
                          :on-click-yes="onClickFinish"
                          no-btn-title="Нет"
                          :on-click-no="() => {this.areYouSureToFinishDialog = false}"
                          :opened="areYouSureToFinishDialog"
            />
            <v-btn block small color="secondary" @click="areYouSureToFinishDialog = true">Завершить</v-btn>
          </div>

          <DialogYesNot title="Вы уверены, что хотите перемешать колоду?"
                        yes-btn-title="Да"
                        :on-click-yes="onClickShake"
                        no-btn-title="Нет"
                        :on-click-no="() => {this.areYouSureToShakeDialog = false}"
                        :opened="areYouSureToShakeDialog"
          />
        </v-container>
      </template>
    </Footer>
<!--    <v-footer fixed app class="pa-0">-->
<!--      -->
<!--    </v-footer>-->
  </div>
</template>

<style lang="scss">
.cards_counter_block {
  text-align: center;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
}

.difficult_level_chooser_block {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  button {
    flex-grow: 1;
    margin: 6px;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .active {
    box-shadow: 0 0 4px green;
  }
}

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
import {defineComponent} from "vue";
import cardsApi from "~/repositories/cards/CardsApi";
import CardsFilter from "~/repositories/cards/CardsFilter";
import DialogYesNot from "~/components/DialogYesNot.vue";
import CardDifficultType from "~/services/CardDifficultType";
import Footer from "~/components/Footer.vue";

export default defineComponent({

  components: {Footer, DialogYesNot},

  data() {
    return {
      cards: [],
      currentCardIndex: 0,
      currentCard: undefined,
      showAnswer: false,
      areYouSureToFinishDialog: false,
      areYouSureToShakeDialog: false,
    }
  },

  computed: {
    CardDifficultType() {
      return CardDifficultType;
    },

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
    async onClickChangeDifficultType(difficultType: CardDifficultType) {
      this.currentCard.difficult = difficultType;
      try {
        await cardsApi.update(this.currentCard);
      } catch (e) {
        console.error(e);
      }
    },

    async fetchCards(filter: CardsFilter) {
      let paginationResponse = await cardsApi.get(filter);
      this.cards = paginationResponse.items || [];
      this.currentCard = this.cards[this.currentCardIndex];
    },

    random(min: number, max: number): number {
      return min + Math.round((max-min) * Math.random());
    },

    onClickShake() {
      this.areYouSureToShakeDialog = false;
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
