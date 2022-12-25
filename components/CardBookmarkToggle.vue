<template>
  <v-btn small text class="mb-4" v-if="value" @click="onClickRemoveFromBookmark">
    <v-icon left large color="red">mdi-bookmark</v-icon>
    Убрать из закладок
  </v-btn>

  <v-btn small text class="mb-4" v-else @click="onClickAddToBookmark">
    <v-icon left large color="red">mdi-bookmark-outline</v-icon>
    Добавить в закладки
  </v-btn>
</template>

<style lang="scss">

</style>

<script>
import {defineComponent} from "vue";

export default defineComponent({

  props: {
    value: {
      type: Boolean
    }
  },

  methods: {
    onClickRemoveFromBookmark() {
      this.$emit('input', false);
    },

    onClickAddToBookmark() {
      this.$emit('input', true);
    }
  }

})
</script>
