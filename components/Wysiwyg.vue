<template>
  <TiptapVuetify :placeholder="placeholder" v-model="content" :extensions="extensions"/>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {
  TiptapVuetify,
  Bold,
  Italic,
  Underline,
  Code,
  OrderedList,
  ListItem,
  HardBreak,
  HorizontalRule,
  History
} from 'tiptap-vuetify'

export default defineComponent({
  components: {TiptapVuetify},

  props: {
    placeholder: {},
    value: {}
  },

  data: () => ({
    extensions: [History, Code, Underline, Bold, Italic, ListItem, OrderedList, HorizontalRule, HardBreak
    ],
    content: ''
  }),

  watch: {
    content(newVal) {
      this.$emit('input', this.content);
    },
    value(newVal) {
      this.content = this.value;
    }
  },

  mounted() {
    this.content = this.value;
  }

});
</script>
