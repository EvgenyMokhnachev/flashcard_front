<template>
  <v-btn icon>
    <v-icon color="red" v-if="value.bookmarked" @click="onClickChangeBookmarked(false)">mdi-bookmark</v-icon>
    <v-icon color="red" v-else @click="onClickChangeBookmarked(true)">mdi-bookmark-outline</v-icon>
  </v-btn>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Card from "~/repositories/cards/Card";
import cardsApi from "~/repositories/cards/CardsApi";

export default defineComponent({

  props: ['value'],

  methods: {
    onClickChangeBookmarked(bookmarked: boolean) {
      this.value.bookmarked = bookmarked;
      this.$emit('input', this.value);
      cardsApi.update({id: this.value.id, bookmarked: this.value.bookmarked})
    },
  }

})
</script>
