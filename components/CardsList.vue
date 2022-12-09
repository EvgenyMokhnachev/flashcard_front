<template>
  <div>
    <v-subheader class="" v-if="!cards || !cards.length">Еще нет созданных карточек</v-subheader>
    <v-card class="mb-4" v-for="(card, i) in cards" :key="i" :to="'/card/update/' + card.id">
      <div style="display: flex; justify-content: space-between;">
        <v-card-text style="white-space: pre-wrap;" v-html="card.frontSide" class="card_data" />
        <v-icon v-if="card.difficult === CardDifficultType.EASY" class="mr-2" color="green">mdi-head-check</v-icon>
        <v-icon v-if="card.difficult === CardDifficultType.DONT_SURE" class="mr-2" color="amber">mdi-head-dots-horizontal</v-icon>
        <v-icon v-if="card.difficult === CardDifficultType.DONT_KNOW" class="mr-2" color="red">mdi-head-remove</v-icon>
      </div>
    </v-card>
  </div>
</template>

<style lang="scss">
.card_data {
  p {
    margin-bottom: initial;
  }
}
</style>

<script lang="ts">
import cardsApi from "../repositories/cards/CardsApi";
import CardsFilter from "../repositories/cards/CardsFilter";
import Vue from "vue";

import {defineComponent} from "vue";
import CardDifficultType from "~/services/CardDifficultType";

export default defineComponent({

  props: {
    filter: {
      type: CardsFilter,
      required: false
    },
  },

  computed: {
    CardDifficultType() {
      return CardDifficultType;
    }
  },

  data() {
    return {
      cards: []
    }
  },

  watch: {
    filter(newVal) {
      this.fetchItems();
    }
  },

  methods: {
    async fetchItems() {
      if (!this.filter) return;
      let cardPaginationResponse = await cardsApi.get(this.filter);
      this.cards = cardPaginationResponse.items;
    }
  },

  async mounted() {
    this.fetchItems();
  }

})
</script>
