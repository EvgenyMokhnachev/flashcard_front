<template>
  <div>
    <CardsFilterDialog :filter="cardsFilterData" @onFilterStarted="onClickCardsFilterStart"
                       :show="showCardsFilterDialog" @close="() => this.showCardsFilterDialog = false" />

    <Footer>
      <template slot="buttons">
        <v-btn icon fab small color="teal" :to="'/card/create?folderId=' + getCurrentFolderId()">
          <v-icon>mdi-plus-box-multiple-outline</v-icon>
        </v-btn>

        <v-btn icon fab small class="card_filter_btn" @click="() => this.showCardsFilterDialog = true">
          <v-icon>mdi-filter-multiple-outline</v-icon>
        </v-btn>

        <v-btn :outlined="isCardDifficultTypeSelected(CardDifficultType.EASY)" icon fab small class="card_filter_btn" @click="clickOnDifficultTypeFilter(CardDifficultType.EASY)">
          <v-icon color="green darken-2">mdi-head-check</v-icon>
        </v-btn>
        <v-btn :outlined="isCardDifficultTypeSelected(CardDifficultType.DONT_SURE)" icon fab small class="card_filter_btn" @click="clickOnDifficultTypeFilter(CardDifficultType.DONT_SURE)">
          <v-icon color="amber darken-2">mdi-head-dots-horizontal</v-icon>
        </v-btn>
        <v-btn :outlined="isCardDifficultTypeSelected(CardDifficultType.DONT_KNOW)" icon fab small class="card_filter_btn" @click="clickOnDifficultTypeFilter(CardDifficultType.DONT_KNOW)">
          <v-icon color="red darken-2">mdi-head-remove</v-icon>
        </v-btn>

        <v-btn fab small icon dark color="indigo" @click="onClickCardPlay">
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </template>
    </Footer>
  </div>
</template>

<script lang="ts">
import authService from "~/services/AuthService";

import {defineComponent} from "vue";
import CardDifficultType, {getAllCardDifficultTypes} from "~/services/CardDifficultType";
import Footer from "~/components/Footer.vue";
import CardsFilterDialog from "~/components/CardsFilterDialog.vue";
import CardsFilter from "~/repositories/cards/CardsFilter";

export default defineComponent({
  components: {
    CardsFilterDialog,
    Footer
  },

  props: {
    cardsFilter: {
      type: CardsFilter,
      required: false
    }
  },

  watch: {
    cardsFilter(newVal, oldVal) {
      // if (JSON.stringify(this.cardsFilter) === JSON.stringify(this.cardsFilterData)) {
      //   return;
      // }
      this.cardsFilterData = new CardsFilter(JSON.parse(JSON.stringify(newVal)));
    },

    cardsFilterData(newVal, oldVal) {
      if (JSON.stringify(this.cardsFilter) === JSON.stringify(this.cardsFilterData)) {
        return;
      }
      this.$emit('change', new CardsFilter(JSON.parse(JSON.stringify(this.cardsFilterData))));
    }
  },

  data() {
    return {
      cardsFilterData: undefined,
      showCardsFilterDialog: false
    }
  },

  computed: {
    CardDifficultType() {
      return CardDifficultType;
    }
  },

  methods: {
    onClickCardsFilterStart(filter) {
      this.cardsFilterData = new CardsFilter(JSON.parse(JSON.stringify(filter)));
    },

    getCurrentFolderId(): number | undefined {
      if (this.$route.params.folderId) {
        return parseInt(this.$route.params.folderId);
      }
      return;
    },

    onClickCardPlay() {
      this.$router.push('/card/play?filter=' + this.getCardsFilterUrl());
    },

    getCardsFilterUrl(): string {
      try {
        return encodeURI(JSON.stringify(this.cardsFilterData));
      } catch (e) {
        return "{}";
      }
    },

    isCardDifficultTypeSelected(difficultType: CardDifficultType): boolean {
      if (!this.cardsFilterData || !this.cardsFilterData.difficultTypes) return false;
      return this.cardsFilterData.difficultTypes.indexOf(difficultType) > -1;
    },

    clickOnDifficultTypeFilter(difficultType: CardDifficultType) {
      let alreadySelected = this.isCardDifficultTypeSelected(difficultType);
      if (alreadySelected) {
        this.cardsFilterData.difficultTypes.splice(this.cardsFilterData.difficultTypes.indexOf(difficultType), 1);
      } else {
        this.cardsFilterData.difficultTypes.push(difficultType);
      }
      this.cardsFilterData = new CardsFilter(JSON.parse(JSON.stringify(this.cardsFilterData)));
    }
  },

  mounted() {
    if (this.cardsFilter) {
      this.cardsFilterData = new CardsFilter(JSON.parse(JSON.stringify(this.cardsFilter || {})));
    }
  }

})
</script>
