<template>
  <v-row justify="center">
    <v-dialog v-model="opened" persistent max-width="290">
      <v-card>
        <v-card-title class="" v-if="title">{{title}}</v-card-title>

        <v-card-text v-if="text">{{text}}</v-card-text>

        <v-card-actions style="display: flex; justify-content: space-between">
          <v-btn v-if="yesBtnTitle && onClickYes" text @click="onClickYes">
            {{yesBtnTitle}}
          </v-btn>
          <v-btn v-if="noBtnTitle && onClickNo" text @click="onClickNo">
            {{noBtnTitle}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";

import {defineComponent} from "vue";

export default defineComponent({

  props: {
    opened: {
      type: Boolean,
      required: true
    },
    title: {
      type: String
    },
    text: {
      type: String
    },
    noBtnTitle: {
      type: String
    },
    yesBtnTitle: {
      type: String
    },
    onClickYes: {
      type: Function
    },
    onClickNo: {
      type: Function
    }
  },

  data() {
    return {
      dialog: false
    }
  }

})
</script>
