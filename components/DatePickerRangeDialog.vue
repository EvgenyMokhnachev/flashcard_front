<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="date"
    persistent
    width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-date-picker v-model="date" scrollable range>
      <v-spacer></v-spacer>

      <v-btn text color="primary" @click="modal = false">
        Cancel
      </v-btn>

      <v-btn text color="primary" @click="$refs.dialog.save(date)">
        OK
      </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<style lang="scss">

</style>

<script lang="ts">
import {defineComponent} from "vue";
import FoldersList from "~/components/FoldersList.vue";
import FoldersSelect from "~/components/FoldersSelect.vue";
import CardDifficultSelect from "~/components/CardDifficultSelect.vue";

export default defineComponent({
  components: {CardDifficultSelect, FoldersSelect, FoldersList},

  props: {
    label: {
      type: String
    }
  },

  data() {
    return {
      modal: false,
      date: undefined
    }
  },

  methods: {
    clickClose() {
      this.$emit('close');
    }
  }
})
</script>
