<template>
  <div>
<!--    <div>Cards list</div>-->
<!--    <div>Folder: {{folder}}</div>-->
    <v-card class="mb-4" v-for="(card, i) in cards" :key="i" :to="'/card/update/' + card.id">
      <v-card-title style="white-space: pre-wrap;">{{card.frontSide}}</v-card-title>
    </v-card>
  </div>
</template>

<style>

</style>

<script lang="ts">
import cardsApi from "../repositories/cards/CardsApi";
import CardsFilter from "../repositories/cards/CardsFilter";

export default {

  props: {
    filter: {
      type: CardsFilter,
      required: true,
      default: {}
    },
  },

  computed: {
  },

  data() {
    return {
      cards: []
    }
  },

  methods: {
    async fetchCards() {
      let cardPaginationResponse = await cardsApi.get(this.filter);
      this.cards = cardPaginationResponse.items;
    }
  },

  async mounted() {
    this.fetchCards();
  }

}
</script>
