<template>
  <v-select :multiple="multiply"
            :label="label || 'Статус изучения карточки'"
            :items="items"
            v-model="selectedItem"
            return-object
            chips
  >
    <template slot="item" slot-scope="data">
      <div>
        <v-icon large :color="getColor(data.item)">{{getIcon(data.item)}}</v-icon>
        {{typesNames.get(data.item)}}
      </div>
    </template>

    <template slot="selection" slot-scope="data">
      <div>
        <v-icon large :color="getColor(data.item)">{{getIcon(data.item)}}</v-icon>
      </div>
    </template>
  </v-select>
</template>

<style lang="scss">

</style>

<script lang="ts">
import Vue, {defineComponent} from "vue";
import CardDifficultType, {allCardDifficultTypesNames, getAllCardDifficultTypes} from "~/services/CardDifficultType";

export default defineComponent({

  props: {
    value: {
    },
    label: {
    },
    multiply: {
      default: false
    }
  },

  data() {
    return {
      items: [],
      selectedItem: [],
    }
  },

  watch: {
    value() {
      this.processProvidedValue();
    },
    selectedItem(newValue, oldValue) {
      if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
        return;
      }

      this.$emit('input',
        this.selectedItem
          ? this.selectedItem.map((cardDifficultType: CardDifficultType) => cardDifficultType)
          : []
      );
    }
  },

  computed: {
    typesNames() {
      return allCardDifficultTypesNames;
    },
  },

  methods: {
    processProvidedValue() {
      if (this.value) {
        this.selectedItem = [...this.value]
      }
    },

    async fetchData() {
      this.items = [...getAllCardDifficultTypes()];
    },

    getIcon(cardDifficultType: CardDifficultType) {
      switch (cardDifficultType) {
        case CardDifficultType.EASY: return 'mdi-head-check';
        case CardDifficultType.DONT_SURE: return 'mdi-head-dots-horizontal';
        case CardDifficultType.DONT_KNOW: return 'mdi-head-remove';
      }
    },

    getColor(cardDifficultType: CardDifficultType) {
      switch (cardDifficultType) {
        case CardDifficultType.EASY: return 'green darken-2';
        case CardDifficultType.DONT_SURE: return 'amber darken-2';
        case CardDifficultType.DONT_KNOW: return 'red darken-2';
      }
    }
  },

  mounted() {
    this.fetchData();
    this.processProvidedValue();
  }

})
</script>
